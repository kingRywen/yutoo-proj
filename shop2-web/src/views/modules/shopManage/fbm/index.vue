<template>
  <div>
    <main-layout
      :outerParams="storeInfo"
      :searchFields="searchFields"
      :columns="columns"
      @searchTrueData="val => searchData = val"
      @requestSuccess="_ => isMount = true"
      edit-width="160px"
      :sortType="1"
      tbRightFixed="right"
      :right-edit-btns="editBtns"
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="fbm/fbm-orderOrderPage"
      tip="每日6点和16点更新数据"
      ref="layout"
    ></main-layout>
    <!-- <el-dropdown v-if="isMount" class="anay" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-button type="text" style="padding: 0" icon="iconfont icongongju"></el-button>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">发货期限</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
  </div>
</template>
<script>
import { downloadFile } from 'Utils'
import { timeField, getSearchNumField } from 'Utils/table-render.js'
export default {
  data() {
    return {
      isMount: false,
      searchData: {},
      searchFields: {
        storeId: {
          widget: 'select',
          options: [],
          labelWidth: '55px',
          label: '店铺'
        },
        purchaseDate: timeField(
          '下单时间',
          'purchaseDate',
          '80px',
          'daterange',
          true,
          true
        ),
        fbmOrderStatus: {
          label: '发货状态',
          widget: 'select',
          options: [
            {
              label: '已发货',
              value: 'Shipped'
            },
            {
              label: '未发货',
              value: 'Unshipped'
            }
          ]
        },
        amount: getSearchNumField.call(this, '订单金额', 'amount', '85px'),
        adjAmouts: getSearchNumField.call(
          this,
          '退款金额',
          'adjAmouts',
          '85px'
        ),
        amazonOrderId: {
          label: '订单号',
          labelWidth: '65px'
        },
        shipMethod: {
          label: '发货方式',
          options: [
            {
              label: 'Standard',
              value: 'Standard'
            },
            {
              label: 'Express',
              value: 'Express'
            }
          ],
          widget: 'select'
        }
      },
      columns: [
        {
          label: '订单号',
          noTooltip: true,
          value: 'amazonOrderId',
          width: 170
        },
        {
          label: '下单时间',
          width: 170,
          value: 'purchaseDate',
          sortable: 'custom'
        },
        {
          label: '店铺',
          noTooltip: true,
          value: 'storeId',
          render: (h, scope) => {
            const opts = this.searchFields.storeId.options
            if (!opts) {
              return <span>-</span>
            } else {
              return (
                <span>
                  {opts.find(e => e.value === scope.row.storeId).label}
                </span>
              )
            }
          }
        },
        {
          label: '剩余发货时间',
          value: 'remainDays',
          sortable: 'custom',
          width: 140,
          render(h, scope) {
            const { remainDays, fbmOrderStatus } = scope.row
            if (fbmOrderStatus == 'Shipped') {
              return <span>-</span>
            }
            return <span>{remainDays}</span>
          }
        },
        {
          label: '订购产品',
          value: 'numberItems',
          url: true,
          btnClick: scope => {
            const { amazonOrderId } = scope.row
            this.$_dialog({
              size: 'medium',
              title: '产品列表',
              params: {
                queries: {
                  amazonOrderId
                }
              },
              cancelBtnText: '关闭',
              // okBtnText: '确认',
              component: () => import('./dialogs/proList.vue')
            })
          }
        },
        {
          label: '订单金额',
          value: 'amount',
          width: 130,
          money: true,
          currency: row => {
            return row.currencyCode
          }
        },
        {
          label: '退款金额',
          width: 130,
          value: 'adjAmouts',
          money: true,
          currency: row => {
            return row.currencyCode
          }
        },
        {
          label: '发货状态',
          value: 'fbmOrderStatus'
          // _enum: ['未发货', '已发货']
        },
        {
          label: '运单号',
          width: 160,
          noTooltip: true,
          value: 'trackingNumbers'
        },
        {
          label: '运输方式',
          value: 'shipMethods'
        }
      ],
      editBtns: [
        {
          icon: 'el-icon-upload2',
          perm: 'add',
          // showLoading: true,
          type: 'plain',
          name: '导入',
          fn: () => {
            return this._import()
          }
        }
      ],
      edits: [
        {
          name: '修改运单号',
          perm: 'addTask',
          fn: scope => {
            this.deliver([scope.row], true)
          }
        },
        {
          name: '设置已发货',
          perm: 'addTask',
          fn: scope => {
            this.updateSendStatus([scope.row], 1)
          }
        },
        {
          name: '退款',
          perm: 'addTask',
          fn: scope => {
            this.refund(scope.row)
          }
        }
      ],
      topBatchBtn: {
        loading: false,
        title: '订单',
        options: [
          {
            label: '发货'
          },
          {
            label: '修改运单号'
          },
          {
            label: '设为已发货'
          },
          {
            label: '设为未发货'
          },
          // {
          //   label: '退款'
          // },
          {
            label: '导出'
          }
        ]
      }
    }
  },
  created() {
    this.$store.dispatch('storeInfo/getStoreList').then(data => {
      this.searchFields.storeId.options = data
    })
    // this.$store.dispatch('fba/getTransportList').then(data => {
    //   this.searchFields.shipMethod.options = data
    // })
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'a':
          this.$_dialog({
            size: 'medium',
            title: '设置发货期限',
            params: {},
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/deadline.vue')
          })
          break

        default:
          break
      }
    },
    handleLeftBatchChange(val, sel) {
      switch (val[0]) {
        case '发货':
          this.deliver(sel)
          break
        case '修改运单号':
          this.deliver(sel, true)
          break
        case '设为已发货':
          this.updateSendStatus(sel, 1)
          break
        case '设为未发货':
          this.updateSendStatus(sel, 0)
          break
        // case '退款':
        //   this.refund(sel)
        //   break
        case '导出':
          this._export(this.searchData)
          break

        default:
          break
      }
    },
    _import() {
      this.$_dialog({
        size: 'medium',
        title: '选择店铺',
        params: {
          options: this.$store.state.storeInfo.curStoreList,
          fn: storeId => {
            this._openDialog({
              size: 'medium',
              fullscreen: false,
              title: '导入运单号和运输方式',
              params: { storeId },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./dialogs/importDe.vue')
            })
          }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () =>
          import('Views/modules/shopManage/fba/plan/selectStore.vue')
      })
    },
    _export(data) {
      data && (this.topBatchBtn.loading = true)
      return this.$api[`fbm/fbm-orderOrderExport`](data)
        .then(data => {
          data && (this.topBatchBtn.loading = false)
          downloadFile(data, '下载.xls')
          return Promise.resolve()
        })
        .catch(() => {
          data && (this.topBatchBtn.loading = false)
        })
    },
    refund(data) {
      // data = data.map(e => ({
      //   amazonOrderId: e.amazonOrderId,
      //   actionType: 'Refund',
      //   orderItemId: e.orderItemId,
      //   currency: e.currencyCode,
      //   itemPriceAdj: undefined,
      //   shippingPriceAdj: undefined,
      //   amount: e.amount
      // }))
      this.$_dialog({
        size: 'medium',
        title: '退款',
        params: { data },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/refund.vue')
      })
    },
    updateSendStatus(data, status) {
      data = data.map(e => ({
        amazonOrderId: e.amazonOrderId,
        fbmOrderStatus: status ? 'Shipped' : 'unShipped'
      }))
      this.showTips(
        { msg: `此操作将修改为${status ? '已' : '未'}发货, 是否继续?` },
        () => {
          return this.$api[`fbm/fbm-orderOrderEdit`]({ orders: data })
        }
      )
    },
    deliver(orderNumbers, edit) {
      let obj = {}
      orderNumbers.forEach(el => {
        obj[el] = true
      })
      if (Object.keys(obj).length > 1) {
        return this.$message.warning('只能选择同一店铺的产品进行操作')
      }
      const ways = this.searchFields.shipMethod.options
      this.$_dialog({
        size: 'medium',
        title: edit ? '修改运单号' : '发货',
        params: {
          edit,
          orderNumbers,
          ways
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/deliver.vue')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.anay {
  position: absolute;
  right: 23px;
  top: -20px;
  /deep/ i {
    font-size: 24px;
  }
}
</style>