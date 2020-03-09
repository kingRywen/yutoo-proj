<template>
  <main-layout
    :outerParams="storeInfo"
    :searchFields="searchFields"
    :columns="columns"
    edit-width="160px"
    tbRightFixed="right"
    :right-edit-btns="editBtns"
    :edit-btns="edits"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="fba/FbaReplenishInfoList"
    ref="layout"
  ></main-layout>
</template>
<script>
import { timeField } from 'Utils/table-render'
import { downloadFile } from 'Utils'
export default {
  data() {
    return {
      editBtns: [
        {
          name: '手动同步',
          perm: 'add',
          showLoading: true,
          fn: () => {
            return this.sync()
          }
        },
        {
          name: '导入',
          perm: 'add',
          icon: 'el-icon-upload2',
          type: 'dropdown',
          btns: [
            {
              name: '导入运输方式',
              perm: 'add',
              fn: () => {
                this._import(0)
              }
            },
            {
              name: '导入实际发货数量',
              perm: 'add',
              fn: () => {
                this._import(1)
              }
            }
          ]
        }
      ],
      searchFields: {
        storeId: {
          widget: 'select',
          placeholder: '选择店铺',
          options: []
        },
        keyword: {
          placeholder: 'FBA货件编号/批次号'
        },
        shippingStatus: {
          hidden: true,
          widget: 'select',
          labelWidth: '50px',
          label: '状态',
          options: [
            {
              label: '待处理',
              value: 1
            },
            {
              label: '已发货',
              value: 2
            },
            {
              label: '已到货',
              value: 3
            },
            {
              label: '已签收',
              value: 4
            },
            {
              label: '签收完成',
              value: 5
            },
            {
              label: '签收错误',
              value: 6
            },
            {
              label: '待处理',
              value: 1
            }
          ]
        },
        sendTime: timeField('发货时间', 'sendTime'),
        sendFlag: {
          widget: 'select',
          options: this.$const['OTHER/yesno'],
          label: '是否发货'
        },
        trackingNumber: {
          label: '批次号',
          labelWidth: '65px'
        }
      },
      columns: [
        {
          label: 'FBA货件编号',
          noTooltip: true,
          value: 'shippingId'
        },
        {
          label: '店铺',
          value: 'storeName'
        },
        {
          label: '批次号',
          minWidth: 100,
          noTooltip: true,
          value: 'batchNum'
        },
        {
          label: '创建时间',
          sortable: 'custom',
          value: 'createTime'
        },
        {
          label: '实际发货时间',
          sortable: 'custom',
          value: 'sendTime'
        },
        {
          label: '预计送达天数',
          sortable: 'custom',
          value: 'planArriveDays'
        },
        {
          label: 'MSKU',
          value: 'msku'
        },
        {
          label: '已发货',
          value: 'quantityReal'
        },
        {
          label: '已收到',
          value: 'signedQuestions'
        },
        {
          label: '问题数量',
          value: 'quantityQuestions'
        },
        {
          label: '目的地',
          value: 'destination'
        },
        {
          label: '是否发货',
          value: 'sendFlag',
          _enum: ['否', '是']
        },
        {
          label: '状态',
          value: 'shippingStatusString'
        }
      ],
      edits: [
        {
          fn: scope => {
            // FIXME: 不太明确 ，延后做
          },
          name: '查看',
          perm: 'addTask'
        },
        {
          fn: scope => {
            this.downSku(scope.row.storeId, scope.row.shippingId)
          },
          name: '下载SKU',
          perm: 'addTask'
        },
        {
          fn: scope => {
            this.downQues(scope.row.storeId, scope.row.shippingId)
          },
          name: '签收情况下载',
          perm: 'addTask'
        },
        {
          fn: scope => {
            this.preview(scope.row.storeId, scope.row.shippingId)
          },
          name: '签收情况预览',
          perm: 'addTask'
        },
        {
          fn: scope => {
            this.setTrackNum(scope.row.shippingId, scope.row.storeId)
          },
          name: '设置运单号',
          perm: 'addTask'
        },
        {
          fn: scope => {
            this.setTran('设置运输方式', [
              {
                storeId: scope.row.storeId,
                shippingId: scope.row.shippingId
              }
            ])
          },
          name: '设置运输方式',
          perm: 'addTask'
        },
        {
          fn: scope => {
            this.modifyTranNum(scope.row.storeId, scope.row.shippingId)
          },
          name: '修改发货数量',
          perm: 'addTask'
        }
      ],
      topBatchBtn: {
        title: '货件',
        loading: false,
        options: [
          {
            label: '确认发货'
          },
          {
            label: '设置运输方式'
          },
          {
            label: '关联批次号'
          },
          {
            label: '导出'
          }
        ]
      }
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      const data = sel.map(el => ({
        storeId: el.storeId,
        shippingId: el.shippingId
      }))
      switch (val[0]) {
        case '确认发货':
          this.showTips(
            {
              msg:
                '确认发货前，请确认实际发货与计划是否一致，不一致时请在操作中修改数量后再确认。'
            },
            () => {
              return this.$api[`fba/FbaReplenishShippingConfirmSend`]({ data })
            }
          )
          break
        case '设置运输方式':
          this.setTran(val[0], data)
          break
        case '关联批次号':
          this.relative(val[0], data)
          break
        case '导出':
          this._export(val[0], data)
          break

        default:
          break
      }
    },
    setTran(title, data) {
      this.$_dialog({
        size: 'medium',
        title,
        params: {
          data
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/setTran.vue')
      })
    },
    modifyTranNum(storeId, shippingId) {
      this.$_dialog({
        size: 'medium',
        title: '修改发货数量',
        params: {
          queries: {
            storeId,
            shippingId
          }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/modifyTranNum.vue')
      })
    },
    relative(title, data) {
      this.$_dialog({
        size: 'medium',
        title,
        params: {
          data
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/relative.vue')
      })
    },
    _export(title, data) {
      this.topBatchBtn.loading = true
      this.$api[`fba/FbaReplenishShippingExport`]({ data })
        .then(data => {
          this.topBatchBtn.loading = false
          downloadFile(data.path, null)
        })
        .catch(() => {
          this.topBatchBtn.loading = false
        })
    },
    sync() {
      return this.$api[`fba/fbaReplenishProductSyn`]({ synType: 4 })
    },
    downSku(storeId, shippingId) {
      this.$api[`fba/FbaReplenishShippingDownloadSku`]({
        storeId,
        shippingId
      }).then(data => {
        downloadFile(data.path, null)
      })
    },
    downQues(storeId, shippingId) {
      this.$api[`fba/FbaReplenishShippingDownloadReceiving`]({
        storeId,
        shippingId
      }).then(data => {
        downloadFile(data.path, null)
      })
    },
    preview(storeId, shippingId) {
      this.$_dialog({
        size: 'medium',
        title: '签收情况预览',
        params: {
          queries: {
            storeId,
            shippingId
          }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/preview.vue')
      })
    },
    setTrackNum(shippingId, storeId) {
      this.$_dialog({
        size: 'medium',
        title: `设置【${shippingId}】运单号`,
        params: { shippingId, storeId },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/setTrackNum.vue')
      })
    },
    _import(type) {
      this.$_dialog({
        size: 'large',
        fullscreen: false,
        title: `导入${type == 0 ? '运输方式' : '实际发货数量'}`,
        params: {
          downApi: `fba/${
            type == 0
              ? 'FbaReplenishShippingImportTransportDownload'
              : 'FbaReplenishShippingImportSendQtyDownload'
          }`,
          confirmApi: `fba/${
            type == 0
              ? 'FbaReplenishShippingImportTransportConfirm'
              : 'FbaReplenishShippingImportTransportConfirm'
          }`,
          uploadUrl:
            type == 0
              ? `/fbaReplenishShipping/import/transport`
              : '/fbaReplenishShipping/import/sendQty',
          fileName: `${type == 0 ? '运输方式' : '实际发货数量'}模板`,
          cols:
            type == 0
              ? [
                  {
                    label: '货件编号',
                    value: 'shippingId'
                  },
                  {
                    label: '店铺名',
                    value: 'storeName'
                  },
                  {
                    label: '批次号',
                    value: 'batchNumber'
                  },
                  {
                    label: '运输方式',
                    value: 'transportName'
                  },
                  {
                    label: '发货时间',
                    value: 'sendTime'
                  },
                  {
                    label: '最早到货时间',
                    value: 'earliestDeliveryDate'
                  }
                ]
              : [
                  {
                    label: 'SKU',
                    value: 'sellerSku'
                  },
                  {
                    label: 'ASIN',
                    value: 'asin'
                  },
                  {
                    label: '装运箱数量',
                    value: 'boxNumber'
                  },
                  {
                    label: '装运箱中商品数量',
                    value: 'count'
                  }
                ]
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('../dialogs/impLocalIvt')
      })
    }
  }
}
</script>