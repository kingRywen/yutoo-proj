<template>
  <main-layout
    :columns="columns"
    :outerParams="{...storeInfo, taskId}"
    :isShowPag="false"
    :showSelection="false"
    :simple="true"
    url="productAnalysis/reviewerAsinList"
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
          label: '主图',
          value: 'imageUrl',
          img: true
        },
        {
          label: '品牌',
          value: 'brand'
        },
        {
          label: '评分',
          value: 'starCnt',
          sortable: true
        },
        {
          label: '评价数',
          value: 'reviewCnt',
          sortable: true
        },
        {
          label: '评价者数',
          value: 'reviewerCnt',
          sortable: true
        },
        {
          label: '排名',
          value: 'sortNum',
          sortable: true
        },
        {
          label: '状态',
          value: 'status',
          _enum: {
            1: '抓取中',
            2: '抓取成功',
            '>=3': '抓取失败'
          }
        }
      ]
    }
  },
  methods: {}
}
</script>