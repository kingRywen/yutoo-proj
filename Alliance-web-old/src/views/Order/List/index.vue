<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      editWidth="160px"
      :tableCols="tableCols"
      :cellClassNameFunc="cellClassNameFunc"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <PayMoney ref="payMoney" :data="originData"/>
    </yt-dialog>
    <yt-dialog :options="paymentRecordsOpts" :events="paymentRecordsEvents">
      <PaymentRecords :orderId="orderId" ref="paymentRecords"/>
    </yt-dialog>
  </div>
</template>

<script>
import PayMoney from '../../components/PayMoney'
import PaymentRecords from './components/PaymentRecords'
export default {
  components: {
    PayMoney,
    PaymentRecords
  },
  data() {
    let vm = this
    return {
      orderId: null,
      originData: {},
      paymentRecordsData: {},
      dialogOptions: {
        visible: false,
        title: '订单支付',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      paymentRecordsOpts: {
        visible: false,
        title: '付费记录',
        width: '800px',
        height: '560px'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '订单支付'
              ? `main/merchantOrderPay`
              : `main/merchantOrderRenew`
          let data = vm.$refs.payMoney.getData()
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        }
      },
      paymentRecordsEvents: {
        handleOkClick() {}
      },
      btns: [
        {
          name: '订单审核通过(测试)',
          fn() {
            let select = vm.$refs.lay.selection
            if (!select.length) {
              vm.$message.warning('请选择数据进行测试')
              return
            }
            vm.$api[`main/merchantOrderAuditPass`](
              select.map(el => ({ orderId: el.orderId }))
            )
              .then(data => {
                vm.$refs.lay.getList()
              })
              .catch(err => {})
          }
        }
      ],
      edits: [
        {
          name: '支付',
          show: scope => {
            return (
              scope.row.orderStatus !== 0 &&
              scope.row.payCount === 0 &&
              (scope.row.payStatus === 0 || scope.row.payStatus === 3)
            )
          },
          fn: (scope, item) => {
            vm.dialogOptions.title = '订单支付'
            vm.handleEdit(scope.row.orderId)
          }
        },
        {
          name: '续费',
          show: scope => {
            return (
              scope.row.orderStatus !== 0 &&
              scope.row.payCount > 0 &&
              (scope.row.payStatus === 2 || scope.row.payStatus === 3)
            )
          },
          fn: (scope, item) => {
            vm.dialogOptions.title = '订单续费'
            vm.handleEdit(scope.row.orderId)
          }
        },
        {
          name: '作废',
          show: scope => {
            return (
              scope.row.orderStatus !== 0 &&
              scope.row.payStatus === 0 &&
              scope.row.payCount === 0
            )
          },
          fn: (scope, item) => {
            vm.handleDel([{ orderId: scope.row.orderId }])
          }
        },
        {
          name: '付费记录',
          show: scope => {
            return scope.row.orderStatus !== 0
          },
          fn: (scope, item) => {
            // vm.paymentRecordsOpts.visible = true
            // vm.orderId = scope.row.orderId
            vm.$router.push({
              name: 'payment_record',
              query: { orderId: scope.row.orderId }
            })
          }
        },
        {
          name: '账号列表',
          show: scope => {
            return true
            // return scope.row.orderStatus !== 0
          },
          fn: (scope, item) => {
            vm.$router.push({
              name: 'account_list',
              query: { orderId: scope.row.orderId, ipCount: scope.row.ipCount }
            })
          }
        }
      ],
      searchFields: [
        {
          name: 'orderId',
          label: '订单编号'
        },
        {
          name: 'orderStatus',
          label: '订单状态',
          type: 'select',
          options: [
            { label: '正常', value: '1' },
            // { label: '已支付', value: '1' },
            { label: '已作废', value: '0' }
          ]
        },
        {
          name: 'time',
          label: '订单时间',
          type: 'dateRange'
        }
      ],
      addFields: [],
      tableCols: [
        {
          label: '订单编号',
          prop: 'orderId'
        },
        {
          label: '账号配额',
          prop: 'ipCount'
        },
        {
          label: '在用账号数',
          prop: 'accountUseCount'
        },
        {
          label: '金额/月',
          prop: 'totalPrice',
          render(h, scope) {
            return (
              <b>
                {scope.row.totalPrice != null
                  ? scope.row.totalPrice.toFixed(2)
                  : '-'}
              </b>
            )
          }
        },
        // {
        //   label: '总金额',
        //   prop: 'realPay'
        // },
        {
          label: '订单状态',
          prop: 'orderStatus',
          render(h, scope) {
            let { orderStatus } = scope.row,
              color,
              name
            // if (orderStatus === 0) {
            //   color = ''
            //   name = '未支付'
            // }
            if (orderStatus === 1) {
              color = 'success'
              name = '正常'
            }
            if (orderStatus === 0) {
              color = 'danger'
              name = '已作废'
            }
            return <span class={color}>{name}</span>
          }
        },
        {
          label: '待审核/累计时长（月）',
          prop: 'effectiveTimeCase',
          width: 150
        },
        {
          label: '待审核/总付费次数',
          prop: 'payCountCase',
          width: 135
        },

        {
          label: '到期时间',
          prop: 'expireTime',
          width: 135
        },
        {
          label: '最近支付时间',
          prop: 'payTime',
          width: 135
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 135
        }
      ]
    }
  },
  methods: {
    cellClassNameFunc({ row, column, rowIndex, columnIndex }) {
      if (column.label === '到期时间' && row.expireTime) {
        if (row.expireDay > 0) {
          return 'expired'
        }
        if (row.expireDay >= -30 && row.expireDay <= 0) {
          return 'willExpire'
        }
      }
    },
    handleEdit(orderId) {
      let vm = this,
        api
      vm.dialogOptions.visible = true
      if (vm.dialogOptions.title === '订单支付') {
        api = `main/merchantOrderPayInfo`
      } else {
        api = `main/merchantOrderRenewInfo`
      }
      vm.$nextTick(() => {
        this.$api[api]({ orderId })
          .then(data => {
            vm.originData = data.rows
          })
          .catch(err => {})
      })
    },
    handleDel(row) {
      let vm = this
      vm.$confirm(
        '是否作废选中的订单（作废订单号之后，订单内的账号就释放，然后就可以重新激活账号，生成新订单）？',
        '警告',
        {
          type: 'warning'
        }
      )
        .then(() => {
          vm.$api[`main/merchantOrderCancellation`](row)
            .then(data => {
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        })
        .catch(() => {})
    },
    checked(more = true) {
      let data = this.$refs.lay.getCheckedData()
      if (more && !data.length) {
        this.$message.warning('请选择数据进行操作')
        return
      }
      if (!more && data.length !== 1) {
        this.$message.warning('请选择一条数据进行操作')
        return
      }
      return this.$refs.lay.getCheckedData()
    },
    loadData(data) {
      let { time = [], ...info } = data
      let [queryStartDate, queryEndDate] = time
      let params = { queryStartDate, queryEndDate, ...info }
      return this.$api[`main/merchantOrderList`](params)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    }
  }
}
</script>

<style>
</style>
