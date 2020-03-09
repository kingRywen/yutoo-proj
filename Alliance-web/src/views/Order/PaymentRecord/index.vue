<template>
  <div>
    <!-- <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    >-->
    <NewMainLayout
      ref="lay"
      url="main/merchantOrderList"
      :edit-btns="edits"
      editWidth="120px"
      :searchFields="searchFields"
      :columns="columns"
    >
      <div slot="top" class="back-wrapper">
        <el-button size="mini" type="default" @click="handleBack" icon="el-icon-back">返回订单列表</el-button>
      </div>
    </NewMainLayout>
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
    return {
      btns: [],
      edits: [],
      searchFields: {
        type: {
          label: '记录类型',
          widget: 'select',
          options: [
            { label: '激活账号', value: '0' },
            { label: '重新激活账号', value: '1' },
            { label: '会员费', value: '2' }
          ]
        },
        orderId: {
          label: '订单编号'
        },
        status: {
          label: '审核状态',
          widget: 'select',
          options: [
            // { label: '待支付', value: '0' },
            { label: '待审核', value: '1' },
            { label: '已通过', value: '2' },
            { label: '已拒绝', value: '3' }
          ]
        }
      },
      addFields: [],
      columns: [
        {
          label: '记录ID',
          value: 'orderPayId'
        },
        {
          label: '记录类型',
          value: 'type',
          render(h, scope) {
            return (
              <span>
                {scope.row.type == 0
                  ? '激活账号'
                  : scope.row.type == 1
                  ? '重新激活账号'
                  : '会员费'}
              </span>
            )
          }
        },
        {
          label: '订单编号',
          value: 'orderId'
        },
        {
          label: '总账号数',
          value: 'accountCount'
        },
        {
          label: '可用账号数',
          value: 'accountUseCount'
        },
        {
          label: '有效时长（月）',
          value: 'effectiveTime'
        },
        {
          label: '实付金额',
          value: 'realPay',
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
          value: 'needPay',
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
          value: 'payName'
        },
        {
          label: '支付账号',
          value: 'payAccount'
        },
        {
          label: '留言',
          noTooltip: true,
          value: 'remark'
        },
        {
          label: '支付时间',
          value: 'payTime',
          width: 150
        },
        {
          label: '审核状态',
          value: 'status',
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
          noTooltip: true,
          value: 'auditIdea'
        }
      ]
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'order' })
    }
  }
}
</script>

<style scoped lang="scss">
.back-wrapper {
  // text-align: right;
}
</style>
