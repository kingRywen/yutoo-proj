<template>
  <new-main-layout
    ref="layout"
    url="main/taskSourceOrderList"
    :columns="columns"
    :outerParams="{taskSourceId: $attrs.taskSourceId}"
    :showSelection="false"
    :isShowPag="false"
  ></new-main-layout>
</template>
<script>
export default {
  data() {
    return {
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
  }
}
</script>