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
      url="fba/FbmOrderInfoList"
      tip="每日6点和16点更新数据"
      ref="layout"
    ></main-layout>
    <el-dropdown v-if="isMount" class="anay" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-button type="text" style="padding: 0" icon="iconfont icongongju"></el-button>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">发货期限</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
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
        orderTime: timeField('下单时间', 'orderTime', '80px'),
        sendStatus: {
          label: '发货状态',
          widget: 'select',
          options: [
            {
              label: '已发货',
              value: 1
            },
            {
              label: '未发货',
              value: 0
            }
          ]
        },
        orderPrice: getSearchNumField.call(
          this,
          '订单金额',
          'orderPrice',
          '85px'
        ),
        returnPrice: getSearchNumField.call(
          this,
          '退款金额',
          'returnPrice',
          '85px'
        ),
        orderNumber: {
          label: '订单号',
          labelWidth: '65px'
        },
        shippingWay: {
          label: '发货方式',
          options: [],
          widget: 'select'
        }
      },
      columns: [
        {
          label: '订单号',
          noTooltip: true,
          value: 'orderNumber',
          width: 170
        },
        {
          label: '下单时间',
          width: 170,
          value: 'orderTime',
          sortable: 'custom'
        },
        {
          label: '店铺',
          noTooltip: true,
          value: 'storeName'
        },
        {
          label: '剩余发货时间',
          value: 'lastDay',
          sortable: 'custom',
          render(h, scope) {
            const { lastDay, lastHour } = scope.row
            return (
              <span>
                <span class="danger">{lastDay}</span>天
                <span class="danger">{lastHour}</span>小时
              </span>
            )
          }
        },
        {
          label: '订购产品',
          value: 'qtyProduct',
          url: true,
          btnClick: scope => {
            const { storeId, orderNumber } = scope.row
            this.$_dialog({
              size: 'medium',
              title: '产品列表',
              params: {
                queries: {
                  orderNumber,
                  storeId
                }
              },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./dialogs/proList.vue')
            })
          }
        },
        {
          label: '订单金额',
          value: 'orderPrice'
        },
        {
          label: '退款金额',
          value: 'priceReturn'
        },
        {
          label: '发货状态',
          value: 'sendStatus',
          _enum: ['未发货', '已发货']
        },
        {
          label: '运单号',
          width: 160,
          noTooltip: true,
          value: 'trankingNumber'
        },
        {
          label: '运输方式',
          value: 'shippingWayName'
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
            this.deliver(
              [
                {
                  orderNumber: scope.row.orderNumber,
                  trankingNumber: scope.row.trankingNumber,
                  shippingWay: scope.row.shippingWay
                }
              ],
              true
            )
          }
        },
        {
          name: '设置已发货',
          perm: 'addTask',
          fn: scope => {
            this.updateSendStatus(
              [
                {
                  orderNumber: scope.row.orderNumber,
                  storeId: scope.row.storeId,
                  status: 1
                }
              ],
              1
            )
          }
        },
        {
          name: '退款',
          perm: 'addTask',
          fn: scope => {
            this.refund([
              {
                orderNumber: scope.row.orderNumber,
                storeId: scope.row.storeId,
                orderPrice: scope.row.orderPrice,
                returnPrice: undefined
              }
            ])
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
          {
            label: '退款'
          },
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
    this.$store.dispatch('fba/getTransportList').then(data => {
      this.searchFields.shippingWay.options = data
    })
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
          this.deliver(sel.map(e => ({ orderNumber: e.orderNumber })))
          break
        case '修改运单号':
          this.deliver(
            sel.map(e => ({
              orderNumber: e.orderNumber,
              trankingNumber: e.trankingNumber,
              shippingWay: e.shippingWay
            })),
            true
          )
          break
        case '设为已发货':
          this.updateSendStatus(
            sel.map(el => ({
              orderNumber: el.orderNumber,
              storeId: el.storeId,
              status: 1
            })),
            1
          )
          break
        case '设为未发货':
          this.updateSendStatus(
            sel.map(el => ({
              orderNumber: el.orderNumber,
              storeId: el.storeId,
              status: 0
            })),
            0
          )
          break
        case '退款':
          this.refund(
            sel.map(e => ({
              orderNumber: e.orderNumber,
              storeId: e.storeId,
              orderPrice: e.orderPrice,
              returnPrice: undefined
            }))
          )
          break
        case '导出':
          this._export(
            sel.map(e => ({ storeId: e.storeId, orderNumber: e.orderNumber }))
          )
          break

        default:
          break
      }
    },
    _import() {
      this.$_dialog({
        size: 'medium',
        fullscreen: false,
        title: '导入运单号和运输方式',
        params: {
          downApi: 'fba/fbmOrderInfoImportTrankingNumberDownload',
          confirmApi: 'fba/FbmOrderInfoImportTrankingNumberConfirm',
          uploadUrl: '/fbmOrderInfo/import/trankingNumber',
          fileName: '导入运单模板',
          cols: [
            {
              label: '订单号',
              value: 'orderNumber'
            },
            {
              label: '运单号',
              value: 'trankingNumber'
            },
            {
              label: '运输方式',
              value: 'shippingWay'
            }
          ]
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () =>
          import('Views/modules/shopManage/fba/dialogs/impLocalIvt.vue')
      })
    },
    _export(data) {
      data && (this.topBatchBtn.loading = true)
      return this.$api[`fba/FbmOrderInfoExport`](data ? { data } : null)
        .then(data => {
          data && (this.topBatchBtn.loading = false)
          downloadFile(data.path, null)
          return Promise.resolve()
        })
        .catch(() => {
          data && (this.topBatchBtn.loading = false)
        })
    },
    refund(data) {
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
      this.showTips(
        { msg: `此操作将修改为${status ? '已' : '未'}发货, 是否继续?` },
        () => {
          return this.$api[`fba/FbmOrderInfoUpdateSendStatus`]({ data })
        }
      )
    },
    deliver(orderNumbers, edit) {
      const ways = this.searchFields.shippingWay.options
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