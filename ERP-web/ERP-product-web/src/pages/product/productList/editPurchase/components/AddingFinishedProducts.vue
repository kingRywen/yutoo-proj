<template>
  <div class="purchase_box product_box">
    <div>
      <v-button :disabled="$attrs.show" type="primary" @click="addItem">添加</v-button>
      <v-button :disabled="$attrs.show" type="primary" @click="delItem">删除</v-button>
    </div>

    <v-data-table
      stripe
      :tree-option="treeOption"
      ref="table"
      :data="list"
      :columns="columns"
      check-type="checkbox"
      class="margin-top-25"
      :current-data.sync="tableData"
    >
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='edit'">
          <v-button :disabled="$attrs.show" type="primary" @click="editItem(props, $event)">修改</v-button>
        </div>
        <div v-else-if="props.column.field=='relNum'">
          <dynamicInput
            :disabled="$attrs.show"
            :isInput="props.item.isInput"
            type="num"
            :item="props"
            :text="props.content"
            @edit="updateName(props, $event)"
            @cancel="cancel(props, $event)"
          ></dynamicInput>
        </div>
        <div v-else-if="props.column.field=='photoFlag'">
          <img :src="props.item.imgPath || '/static/no-image.jpg'" width="49">
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {
  fetchData,
  getQueryString,
  showDialog,
  showToast,
  showConfirm,
  setData,
  handlerCode
} from 'common/common'
import { YT_PRODUCT_PACKAGE } from '../../../componentName'
import dynamicInput from '../../../components/dynamicInput'
import apis from 'apis'
export default {
  props: ['productid', 'upIndex'],
  components: {
    dynamicInput
  },
  data() {
    let vm = this
    return {
      list: pramas => {
        let data = {
          productId: +vm.productid,
          relType: 2
        }
        return fetchData({ ...apis.PRODUCT_VARIANT_REL_LIST, data }).then(
          res => {
            return {
              result: res.data.rows
            }
          }
        )
      },
      columns: [
        {
          title: '系统SKU',
          field: 'variantSku'
        },
        {
          title: '自定义SKU',
          field: 'variantSkuCustom'
        },
        {
          title: '图片',
          field: 'photoFlag'
        },
        {
          title: '数量',
          field: 'relNum'
        },
        {
          title: '产品名称',
          field: 'variantNameZh'
        },
        {
          title: '产品价格',
          field: 'salePrice'
        },
        {
          title: '添加时间',
          field: 'createTime'
        },
        {
          title: '操作',
          field: 'edit'
        }
      ],
      treeOption: {
        isAsync: true
      },
      tableData: []
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },

    // 修改操作
    editItem(v, e) {
      let updateItem = this.tableData[v.index]
      updateItem.isInput = true
      this.tableData.splice(v.index, 1, updateItem)
    },

    updateName(v, vm) {
      let data = {
        ...vm.item.item,
        relNum: +vm.value
      }
      fetchData(setData(apis.PRODUCT_VARIANTREL_UPDATE, data)).then(res => {
        if (!res) {
          return
        }
        handlerCode(res, () => {
          this.handleTbData(v, vm.value)
          vm.loading = false
        })
      })
    },

    cancel(v, newVal) {
      this.handleTbData(v, newVal)
    },

    // 操作表格数据
    handleTbData(v, newVal) {
      let updateItem = this.tableData[v.index]
      updateItem.isInput = false
      updateItem.attachmentName = newVal
      this.tableData.splice(v.index, 1, updateItem)
    },

    // 添加操作
    addItem() {
      let vm = this
      let selected = this.tableData.map(el => el.productId)
      showDialog(
        YT_PRODUCT_PACKAGE,
        { title: '选择成品原料', width: 1200 },
        { type: 2, selected },
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(arr) {
            console.log(arr)

            fetchData({
              ...apis.PRODUCT_VARIANT_REL_BATCH_SAVE,
              data: {
                variantIds: [],
                parentIds: [vm.productid],
                relType: 2,
                relVariant: arr
              }
            }).then(res => {
              console.log(res)
              if (res.data.code === 0) {
                showToast('success', '添加成功')
                vm.refresh()
                setTimeout(() => {
                  fixFrameHeight(1)
                })
              } else {
                showToast('error', '添加失败')
              }
            })
          }
        }
      )
    },

    // 删除操作
    delItem() {
      let vm = this
      showConfirm({
        title: '警告',
        content: '是否删除？',
        onOk: function() {
          let data = vm.$refs.table.getCheckedData().map(el => el.variantRelId)

          fetchData({
            ...apis.PRODUCT_VARIANT_REL_REMOVE,
            data: {
              parentFlag: vm.$parent.$attrs.parent ? 1 : 0,
              relIds: data,
              relType: 2
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast('success', '删除成功')
              vm.$refs.table.refresh()
            }
          })
        },
        onCancel: function() {}
      })
    }
  },
  watch: {
    upIndex() {
      this.refresh()
    }
  }
}
</script>

<style>
</style>
