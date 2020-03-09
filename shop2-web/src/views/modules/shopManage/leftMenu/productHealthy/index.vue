<template>
  <main-layout
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    edit-width="160px"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="leftBatchChange"
    :right-edit-btns="editBtns"
    :treeTable="true"
    :treeTableOtions="treeTableOtions"
    url="shopManage/productHealthStatList"
    tip="截至昨日近30天数据分析"
    ref="layout"
  ></main-layout>
</template>
<script>
import { downloadFile } from 'Utils'
export default {
  data() {
    let vm = this
    return {
      treeTableOtions: {
        childs: 'childList',
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },
      topBatchBtn: {
        options: [
          {
            label: '导出Excel'
          }
        ]
      },
      searchFields: {
        searchText: {
          placeholder: 'SKU、ASIN',
          labelWidth: '70px'
        }
      },
      editBtns: [
        {
          name: '导入流量报告',
          perm: 'add',
          fn: () => {
            this.$router.push({
              path: '/common/trafficReportImport'
            })
          }
        }
      ],
      columns: [
        {
          label: 'SKU',
          value: 'sellerSku',
          numField: 'childList',
          expand: true,
          noTooltip: true
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: '主图',
          value: 'imagePath',
          img: true
        },
        {
          label: '退款率',
          value: 'returnRate',
          sortable: 'custom'
        },
        {
          label: '退货数量',
          value: 'returnCnt',
          sortable: 'custom'
        },
        {
          label: '退货成本',
          value: 'returnCost',
          sortable: 'custom'
        },
        {
          label: '访客数',
          value: 'sessions',
          sortable: 'custom'
        },
        {
          label: '转化率',
          value: 'cvr',
          sortable: 'custom'
        },
        {
          label: '订单量',
          value: 'orderCnt',
          sortable: 'custom'
        },
        {
          label: '已配送订单数',
          value: 'shippedOrderCnt',
          sortable: 'custom'
        },
        {
          label: '确认订单数',
          value: 'un_shippedOrderCnt',
          sortable: 'custom'
        },
        {
          label: 'Pending订单数',
          value: 'pendingOrderCnt',
          sortable: 'custom'
        },
        {
          label: '取消订单数',
          value: 'cancelOrderCnt',
          sortable: 'custom'
        },
        {
          label: '可售退货数量',
          value: 'sellableReturnCnt',
          sortable: 'custom'
        },
        {
          label: '不可售退货数量',
          value: 'unSellableReturnCnt',
          sortable: 'custom'
        },
        {
          label: '退货原因统计',
          value: 'returnReasonCnt',
          sortable: 'custom',
          render(h, scope) {
            let { returnReasonCnt, sellerSku } = scope.row
            return (
              <el-button
                type="text"
                onClick={() => {
                  vm.showDialog(sellerSku)
                }}
              >
                {returnReasonCnt}
              </el-button>
            )
          }
        }
        //123/
      ]
    }
  },
  methods: {
    showDialog(sellerSku) {
      let params = { sku: sellerSku, ...this.outerParams }
      this.showDialogGlobal(
        '排名曲线',
        '100%',
        params,
        () => import('./dialogs/table.vue'),
        '',
        '关闭'
      )
    },
    leftBatchChange(type, data) {
      let sellerSkus = data.map(e => e.sellerSku)
      switch (type[0]) {
        case '导出Excel':
          this.expReview(sellerSkus, 0, true)
          break
      }
    },
    expReview(sellerSkus, exportType, setLoading, searchData) {
      setLoading && (this.topBatchBtn.loading = true)
      return this.$api[`shopManage/productHealthStatExport`]({
        sellerSkus,
        ...this.outerParams,
        exportType,
        ...searchData
      })
        .then(data => {
          setLoading && (this.topBatchBtn.loading = false)
          let ext = exportType ? 'csv' : 'xlsx'
          downloadFile(data, `产品健康诊断.${ext}`)
        })
        .catch(err => {
          setLoading && (this.topBatchBtn.loading = false)
          return Promise.reject(err)
        })
    }
  },
  computed: {
    outerParams() {
      return {
        ...this.storeInfo
      }
    }
  }
}
</script>
