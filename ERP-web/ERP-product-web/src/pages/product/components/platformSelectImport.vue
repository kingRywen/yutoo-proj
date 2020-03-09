<template>
  <div>
    <v-form style="margin-bottom:20px" :model="ruleForm">
      <v-form-item label="sku">
        <v-input placeholder v-model="ruleForm.sku"></v-input>
      </v-form-item>
      <v-form-item label="产品名称">
        <v-input placeholder v-model="ruleForm.nameZh"></v-input>
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
    </v-form>
    <v-data-table
      stripe
      ref="tableFu"
      :data="loadData"
      rowClickChecked
      :page-size="params.pageSize"
      :page-no="params.pageNumber"
      :height="600"
      :columns="columns"
      check-type="checkbox"
      @checkall="checkAll"
      @clickrow="clickRow"
      :bottomGap="isIE11"
      :current-data.sync="tableData"
    >
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='imgPath'">
          <img :src="props.content || '/static/no-image.jpg'" :alt="props.column.title" width="80" height="80">
        </div>
        <div v-else-if="props.column.field=='nameZh'" style="max-width:260px" class="__ellapase">
          <el-tooltip class="item" effect="dark" :content="props.content" placement="top-start" :open-delay="500">
            <span>{{props.content}}</span>
          </el-tooltip>
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import PriceRange from 'components/base/priceRange.vue'
import { fetchData, fixFrameHeight, showToast } from 'common/common'
import { browserType, debounce } from 'common/util'
import apis, { GET_PRODUCT_PAC_LIST } from 'apis'

export default {
  inheritAttrs: false,
  // props: ["type"],
  components: {
    PriceRange
  },
  created() {
    this.getWareHouse()
    // 请求初始化数据
    if (!browserType()) {
      this.isIE11 = 20
    }
  },
  data() {
    let self = this
    return {
      ruleForm: {},
      rangePrice: [],
      isIE11: 0,
      list: [],
      params: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1,
        platformId: 1,
        sku: null,
        nameZh: null,
        warehouseId: null
      },
      selected: [],
      tableData: [],
      loadData(data) {
        if (self.$attrs.type) {
          self.params.relType = self.$attrs.type
        }
        console.log(self.$attrs.type)
        let reqData = Object.assign({}, self.params, data, self.ruleForm)
        if (reqData.sku === '') {
          delete reqData.sku
        }
        if (reqData.nameZh === '') {
          delete reqData.nameZh
        }
        if (reqData.warehouseId === '') {
          delete reqData.warehouseId
        }
        reqData.platformId = self.$attrs.platform
        let opts = Object.assign({
          ...apis.PRODUCT_PLATFORM_LEAD_SELECT_LIST,
          data: reqData
        })
        return fetchData(opts).then(res => {
          return {
            result: res.data.rows,
            pageSize: res.data.pageSize,
            pageNo: res.data.pageNo,
            totalCount: res.data.total
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
          field: 'nameZh'
        },
        {
          title: '系统SKU',
          field: 'sku'
        },
        {
          title: '自定义SKU',
          field: 'skuCustom'
        },
        {
          title: '采购人员',
          field: 'operatorName'
        },
        {
          title: '默认本地发货仓库',
          field: 'warehouseIdString'
        }
        // {
        //   title: "默认供应商发货仓库",
        //   field: "remark"
        // }
      ]
    }
  },
  methods: {
    getWareHouse() {
      fetchData({ ...apis.WAREHOUSE_LIST, data: {} }).then(res => {
        this.list = res.data
      })
    },
    getData() {
      this.$refs.tableFu.refresh()
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
    ruleForm: {
      deep: true,
      handler(val) {
        this.getData()
      }
    },
    rangePrice(val) {
      this.ruleForm.priceMin = val[0]
      this.ruleForm.priceMax = val[1]
    }
  }
}
</script>

<style>
</style>
