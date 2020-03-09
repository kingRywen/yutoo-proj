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
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    >
      <div slot="top" class="back-wrapper">
        <el-button size="mini" type="default" @click="handleBack" icon="el-icon-back">返回订单列表</el-button>
      </div>
    </main-layout>
  </div>
</template>

<script>
import PayMoney from '../../components/PayMoney'
// import PaymentRecords from './components/PaymentRecords'
export default {
  components: {
    PayMoney
    // PaymentRecords
  },
  data() {
    let vm = this
    return {
      btns: [],
      edits: [],
      searchFields: [
        {
          name: 'type',
          label: '记录类型',
          type: 'select',
          options: [
            { label: '激活账号', value: '0' },
            { label: '重新激活账号', value: '1' },
            { label: '会员费', value: '2' }
          ]
        },
        {
          name: 'orderId',
          label: '订单编号'
        },
        {
          name: 'status',
          label: '审核状态',
          type: 'select',
          options: [
            // { label: '待支付', value: '0' },
            { label: '待审核', value: '1' },
            { label: '已通过', value: '2' },
            { label: '已拒绝', value: '3' }
          ]
        }
      ],
      addFields: [],
      tableCols: [
        {
          label: '记录ID',
          prop: 'orderPayId'
        },
        {
          label: '记录类型',
          prop: 'type',
          render(h, scope) {
            return <span>{scope.row.type == 0 ? '激活账号' : scope.row.type == 1 ? '重新激活账号' : '会员费'}</span>
          }
        },
        {
          label: '订单编号',
          prop: 'orderId'
        },
        {
          label: '总账号数',
          prop: 'accountCount'
        },
        {
          label: '可用账号数',
          prop: 'accountUseCount'
        },
        {
          label: '有效时长（月）',
          prop: 'effectiveTime'
        },
        {
          label: '实付金额',
          prop: 'realPay',
          render(h, scope) {
            return (
              <span style="font-weight:bolder">
                {scope.row.realPay != null ? scope.row.realPay.toFixed(2) : '-'}
              </span>
            )
          }
        },

        {
          label: '应付金额',
          prop: 'needPay',
          render(h, scope) {
            return (
              <span style="font-weight:bolder">
                {scope.row.needPay != null ? scope.row.needPay.toFixed(2) : '-'}
              </span>
            )
          }
        },

        {
          label: '支付姓名',
          prop: 'payName'
        },
        {
          label: '支付账号',
          prop: 'payAccount'
        },
        {
          label: '留言',
          prop: 'remark'
        },
        {
          label: '支付时间',
          prop: 'payTime'
        },
        {
          label: '审核状态',
          prop: 'status',
          render(h, scope) {
            let { status } = scope.row
            if (status === 0) {
              return <span>-</span>
            }
            if (status === 1) {
              return <span>待审核</span>
            }
            if (status === 2) {
              return <span class="success">已通过</span>
            }
            if (status === 3) {
              return <span class="warning">已拒绝</span>
            }
          }
        },
        {
          label: '审核意见',
          prop: 'auditIdea'
        }
      ]
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'order' })
    },
    loadData(data) {
      return this.$api[`main/merchantOrderPayList`](data)
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

<style scoped lang="scss">
.back-wrapper {
  // text-align: right;
}
</style>
