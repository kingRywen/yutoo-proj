<template>
  <div>
    <v-form style="margin-bottom:20px" :model="ruleForm" v-if="$attrs.type === 1 || $attrs.type === 2">
      <v-form-item label="SKU">
        <v-input placeholder v-model="ruleForm.sku"></v-input>
      </v-form-item>
      <v-form-item label="产品名称">
        <v-input placeholder v-model="ruleForm.name"></v-input>
      </v-form-item>
      <v-form-item label="发货仓库">
        <v-select
          :data="list"
          size="lg"
          placeholder
          style="width:120px"
          clue="warehouseId"
          label="warehouseName"
          v-model="ruleForm.warehouseId"
        ></v-select>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" @click="getData">搜索</v-button>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" @click="reloadData" icon="reload"></v-button>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" size="mini" @click="add($attrs.type)" icon="plus">添加</v-button>
      </v-form-item>
    </v-form>
    <v-form style="margin-bottom:20px" :model="ruleForm" v-else>
      <v-form-item label="型号">
        <v-input placeholder v-model="ruleForm.specification"></v-input>
      </v-form-item>
      <v-form-item label="价格">
        <PriceRange :range.sync="rangePrice"></PriceRange>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" @click="getData">搜索</v-button>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" @click="reloadData" icon="reload"></v-button>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" size="mini" @click="add($attrs.type)" icon="plus">添加</v-button>
      </v-form-item>
    </v-form>
    <v-data-table
      stripe
      ref="tableFu"
      :data="loadData"
      rowClickChecked
      :page-size="params.pageSize"
      :page-no="params.pageNumber"
      :columns="columns"
      check-type="checkbox"
      @checkall="checkAll"
      @clickrow="clickRow"
      :bottomGap="100"
      :current-data.sync="tableData"
    >
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='imgPath'">
          <img :src="props.content || '/static/no-image.jpg'" :alt="props.column.title" width="49" height="49">
        </div>
        <div v-else-if="props.column.field=='price'">{{props.item.price}}{{props.item.priceUnit}}</div>
        <div v-else-if="props.column.field=='spec'">
          <p>长{{props.item.singleLong}}{{props.item.lengthUnit}} x 宽{{props.item.singleWide}}{{props.item.widthUnit}} x 高{{props.item.singleHigh}}{{props.item.heightUnit}}</p>
          <p>
            体积{{props.item.volume}}{{props.item.lengthUnit}}
            <sup>3</sup>
          </p>
          <p>重量{{props.item.weight}}{{props.item.weightUnit}}</p>
        </div>
        
        <div v-else>{{props.content}}</div>
      </template>
      <template slot="emptytext" slot-scope="props">暂无数据，去 &nbsp;
        <v-button type="primary" size="mini" @click="add($attrs.type)" icon="plus">添加</v-button>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import PriceRange from 'components/base/priceRange.vue'
import { fetchData, fixFrameHeight } from 'common/common'
import { browserType, debounce } from 'common/util'
import apis, { GET_PRODUCT_PAC_LIST } from 'apis'

export default {
  inheritAttrs: false,
  // props: ["type"],
  components: {
    PriceRange
  },
  created() {
    let vm = this
    let hiddenProperty =
      'hidden' in document
        ? 'hidden'
        : 'webkitHidden' in document
        ? 'webkitHidden'
        : 'mozHidden' in document
        ? 'mozHidden'
        : null
    this.visibilityChangeEvent = hiddenProperty.replace(
      /hidden/i,
      'visibilitychange'
    )
    this.onVisibilityChange = function() {
      try {
        vm.$refs.tableFu.refresh()
      } catch (error) {}
    }
    document.addEventListener(
      this.visibilityChangeEvent,
      this.onVisibilityChange
    )
    // 请求初始化数据
    if (!browserType()) {
      this.isIE11 = 20
    }

    if (this.$attrs.type === 1 || this.$attrs.type === 2) {
      this.getWareHouse()
    }

    if (this.$attrs.tableType) {
      if (this.$attrs.type === 3) {
        this.columns = [
          {
            title: '类型',
            field: 'typeDesc'
          },
          {
            title: '型号',
            field: 'specification'
          },
          {
            title: '规格',
            field: 'spec'
          },
          {
            title: '价格',
            field: 'price'
          },
          {
            title: '备注',
            field: 'packageRemark'
          }
        ]
        return
      }
      this.columns = [
        {
          title: '类型',
          field: 'sourceTypeString'
        },
        {
          title: '型号',
          field: 'specification'
        },
        {
          title: '规格',
          field: 'size'
        },
        {
          title: '价格',
          field: 'salePrice'
        },
        {
          title: '备注',
          field: 'remark'
        }
      ]
    }
  },
  data() {
    let self = this
    return {
      list: [],
      ruleForm: {},
      rangePrice: [],
      isIE11: 0,
      params: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      selected: [],
      tableData: [],
      loadData(data) {
        let api = apis.PRODUCT_VARIANT_PAGE
        // debugger
        const type = self.$attrs.type
        // if (self.$attrs.type) {
        //   self.params.relType = 3; // type = 3  物流包材   type = 4 原材料
        // }
        self.params.relType = type

        if (type === 3) {
          api = apis.LOGISTIC_PACKAGE_PAGE_LIST
        }
        let reqData = Object.assign({}, self.params, data, self.ruleForm)
        delete reqData.sortColumns
        delete reqData.sortOrder
        // delete reqData.relType;
        for (const key in reqData) {
          if (reqData.hasOwnProperty(key)) {
            const element = reqData[key]
            if (
              (typeof element === 'string' && element.trim() === '') ||
              element == null
            ) {
              delete reqData[key]
            }
          }
        }

        let opts = Object.assign({
          ...api,
          data: { ...reqData, pageNumber: reqData.pageNo }
        })

        return fetchData(opts).then(res => {
          let selected = self.$attrs.selected
          const data =
            type === 3 || type === 1 || type === 2 ? res.data.rows : res.data

          if (selected) {
            setTimeout(() => {
              self.tableData.forEach((el, index) => {
                if (selected.indexOf(el.productId) > -1) {
                  self.$refs.tableFu.setChecked(index, true, true)
                }
              })
            })
          }
          return {
            result: data.rows,
            pageSize: data.pageSize,
            pageNo: data.pageNo,
            totalCount: data.total
          }
        })
      },
      columns: [
        {
          title: '图片',
          field: 'imgPath'
        },
        {
          title: '产品名称',
          field: 'variantNameZh'
        },
        {
          title: '系统SKU',
          field: 'variantSku'
        },
        {
          title: '自定义SKU',
          field: 'variantSkuCustom'
        },
        {
          title: '采购人员',
          field: 'purchaseName'
        },
        {
          title: '默认发货仓库 / 默认供应商发货仓',
          field: 'warehouseIdString'
        }
      ]
    }
  },
  methods: {
    add(type) {
      let vm = this
      let winOpen = window.open(
        type === 3
          ? '/product.html#/product/MaterialWrap.html'
          : '/product.html#/product/productList/addProduct.html'
      )
      clearInterval(this.timer)
      this.timer = null
      this.timer = setInterval(() => {
        if (winOpen.closed == true) {
          vm.$refs.tableFu.refresh()
          clearInterval(this.timer)
        }
      }, 500)
    },
    getWareHouse() {
      fetchData({ ...apis.WAREHOUSE_LIST, data: {} }).then(res => {
        this.list = res.data
      })
    },
    getData() {
      this.$refs.tableFu.refresh()
    },
    reloadData() {
      this.ruleForm = {}
      this.getData()
    },
    select(arr) {
      this.selected = arr
    },
    // 确认按钮
    ok() {
      this.$root.$children[0].asyncModalVisible = false
      let arr = this.$refs.tableFu.getCheckedData()
      this.$listeners.set(arr)
    },
    // 表格
    checkAll: function(value) {
      console.log(value)
      this.checkAllMsg = '当前全选状态是：' + value
      if (value) {
        this.select(this.tableData)
      } else {
        this.select([])
      }
    },
    clickRow: function(obj) {
      console.log(obj)
      this.clickRowMsg = '当前点击第' + obj.index + '行'
      // this.selected.push(obj.row)
    }
  },
  watch: {
    rangePrice(val) {
      this.ruleForm.priceStart = val[0]
      this.ruleForm.priceEnd = val[1]
    }
  },
  beforeDestroy() {
    document.removeEventListener(
      this.visibilityChangeEvent,
      this.onVisibilityChange
    )
  }
}
</script>

<style>
</style>
