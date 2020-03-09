<template>
  <main-layout
    :columns="columns"
    :outerParams="{...storeInfo, taskId}"
    :isShowPag="false"
    :simple="true"
    url="productAnalysis/rcAsinList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  props: ['taskId', 'stats'],
  data() {
    return {
      columns: [
        {
          label: 'ASIN',
          url: true,
          btnClick: scope => {
            window.open(this.currentSite.asinUrl + scope.row.asin)
          },
          value: 'asin'
        },
        {
          label: '状态',
          value: 'status',
          _enum: this.stats
        }
      ]
    }
  }
}
</script>