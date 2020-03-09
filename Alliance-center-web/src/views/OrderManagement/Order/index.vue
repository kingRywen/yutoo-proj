<template>
  <div v-if="$route.name === 'Order'">
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      editWidth="220px"
      :tableCols="tableCols"
      :cellClassNameFunc="cellClassNameFunc"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
  </div>
  <router-view v-else></router-view>
</template>

<script>
export default {
  name: 'OrderIndex',
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
      btns: [],
      edits: [
        {
          name: '分配IP',
          show: scope => {
            return scope.row.oweIpCount > 0 && scope.row.orderStatus !== 0
          },
          fn: (scope, item) => {
            vm.$.showWarning('是否确认分配IP？', () => {
              this.$api[`main/merchantOrderAllocationIp`]({
                orderId: scope.row.orderId
              })
                .then(data => {
                  vm.$refs.lay.handleSearch()
                })
                .catch(err => {})
            })
          }
        },
        {
          name: '付费记录',
          show: scope => {
            return scope.row.orderStatus !== 0
          },
          fn: (scope, item) => {
            vm.$router.push({
              name: 'PaymentRecordsSingle',
              params: { orderId: scope.row.orderId }
            })
          }
        },
        {
          name: '账号列表',
          show: scope => {
            return scope.row.orderStatus !== 0
          },
          fn: (scope, item) => {
            vm.$router.push({
              name: 'AccountList',
              params: { orderId: scope.row.orderId }
            })
          }
        }
      ],
      searchFields: [
        {
          name: 'merchantEmail',
          label: '商户邮箱'
        },
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
          name: 'oweIpFlag',
          label: '是否缺少IP',
          type: 'select',
          options: [{ label: '是', value: '1' }, { label: '否', value: '0' }]
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
          label: '商户邮箱',
          minWidth: 170,
          prop: 'merchantEmail'
        },
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
        {
          label: '缺少IP总数',
          prop: 'oweIpCount',
          render(h, scope) {
            const { oweIpCount } = scope.row
            return (
              <span class={oweIpCount > 0 ? 'danger' : ''}>{oweIpCount}</span>
            )
          }
        },
        {
          label: '订单状态',
          prop: 'orderStatus',
          render(h, scope) {
            let { orderStatus } = scope.row,
              color,
              name
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
          label: '过期天数',
          prop: 'expireDay',
          width: 135,
          render(h, scope) {
            let { expireDay } = scope.row
            return <span class="danger">{expireDay > 0 ? expireDay : '-'}</span>
          }
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
        if (row.expireDay == null) {
          return ''
        }
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
