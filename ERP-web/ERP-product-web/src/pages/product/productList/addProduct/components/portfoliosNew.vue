<template>
  <div class="portfolios_new" v-if="tableDataItems.length && tableData.length">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="(item, index) in tableData" :name="index">
        <template slot="title">
          <div class="title_slot">
            <div class="prop">
              <div class="sku" :title="item.skuCustom">自定义SKU： {{item.skuCustom}}</div>
              <div class="prop" :title="getTitle(item, 1)">
                变体属性：
                <span v-for="(val, key) in item">
                  <span class="__distance" v-if="!isNaN(key)">{{tableDataItems[+key].propertyName}}: {{val}}</span>
                </span>
              </div>
              <div class="num" v-if="allTb && allTb[index]" :title="getTitle({allTb, nums, index}, 2)">
                <span v-if="nums[index]!=null">产品数量: {{nums[index]}}</span>
                变体数: {{allTb[index].length}}
              </div>
            </div>
            <div class="btn">
              <v-button v-if="!$attrs.show" type="primary" @click.stop="addProduct(item, index)">添加产品</v-button>
              <v-button v-if="!$attrs.show" type="danger" @click.stop="deleteProduct(item, index)">删除</v-button>
            </div>
          </div>
        </template>

        <v-data-table
          check-type="checkbox"
          :data="loadData(item, index)"
          :columns="columns"
          ref="table"
          style="max-height:400px"
        >
          <template slot="th" slot-scope="props">
            <strong v-if="props.column.field=='edit'">操作</strong>
            <div v-else-if="props.column.field=='imgPath'" class="text-center">
              <strong>图片</strong>
            </div>
            <strong v-else v-html="props.title"></strong>
          </template>
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='productPropertyEntities'">
              <div v-if="props.content">
                <span class="__distance" v-for="item in props.content">{{item.propertyName}}:{{item.propertyValue}}</span>
              </div>
              <div v-else>-</div>
            </div>
            <div v-else-if="props.column.field=='edit'">
              <v-button v-if="!$attrs.show" @click.stop="editProduct(props.item, index)" size="small">修改</v-button>
              <v-button
                v-if="!$attrs.show"
                @click.stop="deleteProductOne(props.item, index)"
                size="small"
                type="danger"
              >删除</v-button>
            </div>
            <div v-else-if="props.column.field=='relNum'">
              <div v-if="props.item._edit">
                <v-input-number :min="1" v-model="props.item.relNum" size="large"></v-input-number>
                <v-button
                  @click.stop="ok(props.item, index)"
                  type="primary"
                  size="small"
                  :loading="props.item._loading"
                >确认</v-button>
                <v-button @click.stop="cancel(props.item, index)" size="small">取消</v-button>
              </div>
              <div v-else>{{props.content}}</div>
            </div>
            <div v-else-if="props.column.field=='imgPath'">
              <div class="subItems">
                <el-tooltip placement="right" effect="light" :open-delay="300">
                  <div slot="content">
                    <img
                      :src="props.item.imgPath && props.item.imgPath.replace(/,[wh]_\d+/ig, ',w_240') || '/static/no-image.jpg'"
                    >
                  </div>
                  <div class="divContent" style="position:relative">
                    <img :src="props.item.imgPath || '/static/no-image.jpg'" :alt="props.column.title">
                    <div class="groupFlag" v-if="props.item.groupFlag">组合</div>
                  </div>
                </el-tooltip>
              </div>
            </div>
            <span v-else v-html="props.content"></span>
          </template>
        </v-data-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { Collapse, CollapseItem, Tooltip } from 'element-ui'
import {
  showDialog,
  fetchData,
  showToast,
  handlerCode,
  showConfirm
} from 'common/common'
import apis from 'apis'
import { getQueryString } from 'common/util'
import Vue from 'vue'

Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tooltip)

export default {
  created() {
    this.init()
    this.productId = getQueryString('productId')
  },

  computed: {
    nums() {
      const ret = {}
      for (const key in this.allTb) {
        if (this.allTb.hasOwnProperty(key)) {
          const element = this.allTb[key]
          let total = 0
          element.forEach((el, index) => {
            total += el.relNum
          })
          ret[key] = total
        }
      }

      return ret
    }
  },

  data() {
    let vm = this
    return {
      tableData: [],
      tableDataItems: [],
      allTb: {},
      activeNames: [0],
      loadData(item, index) {
        const { productId } = item
        return pramas => {
          return vm.getList(productId).then(data => {
            vm.$set(vm.allTb, index, data)
            return {
              result: data
            }
          })
        }
      },
      columns: [
        { title: '图片', field: 'imgPath' },
        { title: '产品名称', field: 'variantNameZh' },
        { title: '系统SKU', field: 'variantSku' },
        { title: '自定义SKU', field: 'variantSkuCustom' },
        { title: '变体属性', field: 'productPropertyEntities' },
        { title: '产品数量', field: 'relNum' },
        { title: '操作', field: 'edit' }
      ]
    }
  },
  methods: {
    getTitle(item, type) {
      let str = ``
      switch (type) {
        case 1:
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              const element = item[key]
              if (!isNaN(key)) {
                str += `${this.tableDataItems[+key].propertyName}: ${element} `
              }
            }
          }
          return str
          break

        case 2:
          let { allTb, nums, index } = item
          if (nums[index] != null) {
            str = `产品数量: ${nums[index]} 变体数: ${allTb[index].length}`
            return str
          } else {
            return null
          }

          break

        default:
          return null
          break
      }
    },
    init() {
      this.tableData = JSON.parse(sessionStorage.getItem('tableData'))
      this.tableDataItems = JSON.parse(sessionStorage.getItem('tableDataItems'))
    },
    getList(productId) {
      return fetchData({
        ...apis.PRODUCT_VARIANT_REL_LIST,
        data: {
          productId,
          relType: 5
        }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        return res.data.rows
      })
    },
    handleChange(val) {
      let index = val.slice(0).pop()
      this.setNum(index)
    },

    setNum(index, data) {
      if (data) {
        let total = 0
        data.forEach(element => {
          total += element.relNum
        })
        this.$set(this.nums, index, total)
        return
      }
      if (this.$refs.table && this.$refs.table[index]) {
        let total = 0
        this.$refs.table[index].current.forEach(element => {
          total += element.relNum
        })
        this.$set(this.nums, index, total)
      }
    },

    addProduct(item, index) {
      let vm = this
      showDialog(
        'PortfoliosAdd',
        {
          title: `添加组合产品   (${item.skuCustom})`,
          width: 1200,
          modalnoBtn: true
        },
        {
          productId: item.productId
        },
        {
          set() {
            vm.$refs.table[index].refresh()
            vm.activeNames = [index]
            vm.setNum(index)
          }
        },
        null,
        null,
        'custom_top_20'
      )
    },

    deleteProduct(item, index) {
      let vm = this
      const relIds = this.$refs.table[index]
        .getCheckedData()
        .map(el => el.variantRelId)
      if (relIds.length === 0) {
        showToast('warning', '请选择一项进行删除')
        return
      }
      showConfirm({
        title: '警告',
        content: '是否删除选中项？',
        onOk() {
          fetchData({
            ...apis.PRODUCT_VARIANT_REL_REMOVE,
            data: { parentFlag: 0, relIds, relType: 5 }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table[index].refresh()
            })
          })
        }
      })
    },

    deleteProductOne(item, index) {
      let vm = this
      showConfirm({
        title: '警告',
        content: '是否删除当前项？',
        onOk() {
          fetchData({
            ...apis.PRODUCT_VARIANT_REL_REMOVE,
            data: { parentFlag: 0, relIds: [item.variantRelId], relType: 5 }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table[index].refresh()
            })
          })
        }
      })
    },

    editProduct(item, index) {
      this.$set(item, '_edit', true)
      item.oldVal = item.relNum
    },

    ok(item, index) {
      let vm = this
      vm.$set(item, '_loading', true)

      fetchData({
        ...apis.PRODUCT_VARIANT_REL_UPDATE,
        data: {
          relNum: item.relNum,
          variantRelId: item.variantRelId,
          relType: 5
        }
      }).then(res => {
        handlerCode(res, res => {
          vm.setNum(index)
          vm.$set(item, '_edit', false)
          vm.$set(item, '_loading', false)
        })
      })
    },

    cancel(item, index) {
      this.$set(item, '_edit', false)
      item.relNum = item.oldVal
    }
  }
}
</script>

<style lang="scss">
.portfolios_new {
  .el-collapse-item__header {
    display: flex;
  }
  .title_slot {
    display: flex;
    width: 98%;
    justify-content: space-between;
    .prop {
      display: flex;
      width: 70%;
      .sku {
        flex: 0.8;
      }
      .prop {
        flex: 1;
      }
      .num {
        flex: 0.5;
      }
      div {
        margin-right: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 260px;
        flex: 1;
        span {
          margin-left: 12px;
        }
      }
    }
    .btn {
      flex-shrink: 1;
      flex-wrap: nowrap;
      white-space: nowrap;
      margin-right: 20px;
    }
  }
  .el-collapse-item__wrap {
    width: 100%;
  }
  .el-collapse-item__header {
    border: 1px solid #ebeef5;
    background: #f5f5f5;
    padding: 0 10px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
