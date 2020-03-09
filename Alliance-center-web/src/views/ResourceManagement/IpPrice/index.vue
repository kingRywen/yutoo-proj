<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      editWidth="160px"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm label-width="120px" :fields="addFields" ref="add"/>
      <!-- <el-form :model="priceData">
        <template v-for="item in priceData.list">
          <ElFormItem label="购买数量">
            <ElInput v-model="item.buyQuantity"></ElInput>
          </ElFormItem>
          <ElFormItem label="购买数量">
            <ElInput v-model="item.unitPrice"></ElInput>
          </ElFormItem>
          <ElFormItem label="购买数量">
            <ElInput v-model="item.totalPrice"></ElInput>
          </ElFormItem>
          <ElFormItem label="购买数量">
            <ElInput v-model="item.currency"></ElInput>
          </ElFormItem>
        </template>
      </el-form>-->
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'

export default {
  mixins: [mixin],
  data() {
    let vm = this
    return {
      listApi: 'ipPriceList',
      // priceData: {
      //   list: [
      //     {
      //       buyQuantity: undefined,
      //       unitPrice: undefined,
      //       totalPrice: undefined,
      //       currency: null
      //     }
      //   ]
      // },
      dialogOptions: {
        visible: false,
        title: '新增IP价格',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api = `main/ipPriceUpdate`
          let data = vm.$refs.add.formData
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          // if (vm.dialogOptions.title === '新增IP价格') return
          vm.$api[`main/ipPriceInfo`]({ ipPriceId: vm.editId })
            .then(data => {
              vm.$refs.add.setData(data.rows)
            })
            .catch(err => {})
        }
      },
      addFields: [
        {
          name: 'buyQuantity',
          label: '购买数量',
          span: 12,
          onChange(item, val, data) {
            if (data.totalPrice) {
              data.unitPrice = Math.round((data.totalPrice / val) * 100) / 100
            }
          },
          required: true
        },
        {
          name: 'totalPrice',
          label: '总价',
          onChange(item, val, data) {
            if (data.buyQuantity) {
              data.unitPrice = Math.round((val / data.buyQuantity) * 100) / 100
            }
          },
          span: 12,
          required: true
        },
        {
          name: 'unitPrice',
          label: '单价',
          disabled: true,
          span: 12,
          required: true
        },

        {
          name: 'currency',
          label: '币种',
          span: 12,
          type: 'select',
          options: [
            {
              label: '美元',
              value: 'USD'
            },
            {
              label: '人民币',
              value: 'CNY'
            }
          ],
          required: true
        }
      ],
      btns: [
        {
          name: '编辑',
          disabled: selection => {
            if (selection.length !== 1) {
              return true
            }
            return false
          },
          fn() {
            vm.edit()
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.edit(scope.row)
          }
        },
        {
          name: '删除',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.del(scope.row)
          }
        }
      ],
      searchFields: [],
      tableCols: [
        {
          label: '价格ID',
          prop: 'ipPriceId'
        },
        {
          label: '购买数量',
          prop: 'buyQuantity'
        },
        {
          label: '单价',
          prop: 'unitPrice'
        },
        {
          label: '总价',
          prop: 'totalPrice'
        },
        {
          label: '币种',
          prop: 'currency'
        }
      ]
    }
  },
  methods: {
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    edit(row) {
      if (row) {
        this.openAdd('编辑IP价格', row.ipPriceId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑IP价格', data[0].ipPriceId)
        }
      }
    }
    // del(row) {
    //   if (row) {
    //     this.handleDel(
    //       Array.of(row),
    //       '是否删除此IP价格？',
    //       'platformRemove',
    //       'ipPriceId'
    //     )
    //   } else {
    //     let data = this.checked(true)
    //     if (data) {
    //       this.handleDel(
    //         data,
    //         '是否删除此IP价格？',
    //         'platformRemove',
    //         'ipPriceId'
    //       )
    //     }
    //   }
    // }
  }
}
</script>

<style>
</style>
