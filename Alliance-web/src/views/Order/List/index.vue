<template>
  <div>
    <NewMainLayout
      ref="lay"
      url="main/merchantOrderList"
      :edit-btns="edits"
      editWidth="120px"
      :searchFields="searchFields"
      :columns="columns"
      :btnFn="btnFn"
      :searchFunc="searchFunc"
      :loadNode="_loadNode"
    ></NewMainLayout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <PayMoney ref="payMoney" :data="originData" />
    </yt-dialog>
    <yt-dialog :options="paymentRecordsOpts" :events="paymentRecordsEvents">
      <PaymentRecords :orderId="orderId" ref="paymentRecords" />
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
        noShowLoading: false,
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
          vm.dialogOptions.noShowLoading = true
          return vm.$refs.payMoney.validate(() => {
            vm.dialogOptions.noShowLoading = false
            let data = vm.$refs.payMoney.getData()
            return vm.$api[api](data)
              .then(() => {
                vm.dialogOptions.visible = false
                vm.$refs.lay.handleSearch()
              })
              .catch(() => {
                return Promise.reject(false)
              })
          })
          // return vm.$refs.payMoney.validate().then(() => {
          //   return vm.$confirm(
          //   '请确定已经通过支付宝或微信二维码支付了正确金额',
          //   '提示',
          //   {
          //     confirmButtonText: '确认',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          //   }
          // )
          //   .then()
          //   .catch(() => {
          //     return Promise.reject()
          //   })
          // })
        }
      },
      paymentRecordsEvents: {
        handleOkClick() {}
      },
      columns: [
        {
          label: '订单编号',
          value: 'orderId'
        },
        {
          label: '账号配额',
          value: 'ipCount'
        },
        {
          label: '在用账号数',
          value: 'accountUseCount'
        },
        {
          label: '金额/月',
          value: 'totalPrice',
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
        //   value: 'realPay'
        // },
        {
          label: '订单状态',
          value: 'orderStatus',
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
          value: 'effectiveTimeCase',
          width: 150
        },
        {
          label: '待审核/总付费次数',
          value: 'payCountCase',
          width: 145
        },

        {
          label: '到期时间',
          value: 'expireTime',
          width: 145
        },
        {
          label: '最近支付时间',
          value: 'payTime',
          width: 145
        },
        {
          label: '创建时间',
          value: 'createTime',
          width: 145
        }
      ],
      edits: [
        {
          name: '支付',
          fn: scope => {
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
          fn: scope => {
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
          fn: scope => {
            vm.handleDel([{ orderId: scope.row.orderId }])
          }
        },
        {
          name: '付费记录',
          show: scope => {
            return scope.row.orderStatus !== 0
          },
          fn: scope => {
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
          show: () => {
            return true
            // return scope.row.orderStatus !== 0
          },
          fn: scope => {
            vm.$router.push({
              name: 'account_list',
              query: { orderId: scope.row.orderId, ipCount: scope.row.ipCount }
            })
          }
        }
      ],
      searchFields: {
        orderId: {
          label: '订单编号'
        },
        orderStatus: {
          label: '订单状态',
          widget: 'select',
          options: [
            { label: '正常', value: '1' },
            { label: '已作废', value: '0' }
          ]
        },
        time: {
          label: '订单时间',
          widget: 'daterange'
        }
      },
      addFields: []
    }
  },
  methods: {
    btnFn(row) {
      let btn = []
      if (
        row.orderStatus !== 0 &&
        row.payCount === 0 &&
        (row.payStatus === 0 || row.payStatus === 3)
      ) {
        btn.push(0)
      }
      if (
        row.orderStatus !== 0 &&
        row.payCount > 0 &&
        (row.payStatus === 2 || row.payStatus === 3)
      ) {
        btn.push(1)
      }
      if (row.orderStatus !== 0 && row.payStatus === 0 && row.payCount === 0) {
        btn.push(2)
      }
      if (row.orderStatus !== 0) {
        btn.push(3)
      }
      btn.push(4)
      return btn
    },
    searchFunc(data) {
      let { time, ...info } = data
      let [queryStartDate, queryEndDate] = time || []
      let params = { queryStartDate, queryEndDate, ...info }
      return params
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
          .catch(() => {})
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
            .then(() => {
              vm.$refs.lay.handleSearch()
            })
            .catch(() => {})
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
    }
  }
}
</script>

<style>
</style>
