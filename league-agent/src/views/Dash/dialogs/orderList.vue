<template>
  <main-layout
    ref="layout"
    url="agent/platformOrderList"
    :columns="columns"
    :edit-btns="editBtns"
    :btnFn="btnFn"
    :outerParams="{taskSourceId: $attrs.taskSourceId}"
    :showSelection="false"
    :isShowPag="false"
  ></main-layout>
</template>
<script>
export default {
  data() {
    let vm = this
    return {
      editBtns: [
        {
          name: '索评',
          fn: scope => {
            this.showTips({ msg: '请确认是否现在索评？' }, () => {
              return this.$api[`agent/platformOrderAskForReview`]({
                taskSourceId: this.$attrs.taskSourceId,
                platformOrderId: scope.row.platformOrderId,
                orderNum: scope.row.orderNum
              }).then(() => {
                vm.$refs.layout.getList()
                return Promise.reject()
              })
            })
          }
        }
      ],
      columns: [
        {
          label: '订单ID',
          value: 'orderNum'
        },
        {
          label: '订单时间',
          value: 'orderTime'
        },
        {
          label: '订单金额',
          value: 'feeTotal'
        },
        {
          label: '评价时间',
          value: 'reviewTime'
        }
      ]
    }
  },
  methods: {
    btnFn(row) {
      if (row.blagReviewFlag == 1) {
        return [1]
      } else {
        return []
      }
    }
  }
}
</script>