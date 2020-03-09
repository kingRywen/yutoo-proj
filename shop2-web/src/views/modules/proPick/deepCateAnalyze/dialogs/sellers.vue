<template>
  <main-layout
    url="proPick/categoryDepthTaskMerchantListToBuyBoxSellerByProduct"
    :simple="true"
    :outerParams="{...storeInfo,merchantTaskId,parentAsin}"
    :columns="columns"
  ></main-layout>
</template>
<script>
export default {
  props: ['parentAsin', 'merchantTaskId'],
  data() {
    return {
      columns: [
        {
          label: '卖家名',
          url: 'sellerUrl',
          value: 'sellerName'
        },
        {
          label: '跟卖子SKU数',
          value: 'sellerSkuCnt'
        },
        {
          label: '自跟卖',
          render: (h, scope) => {
            const { sellYourselfFlag, fbpFlag } = scope.row,
              fbq = this.cfuns.arrayToObj(this.$const['OTHER/fbpFlag'])
            return <span>{sellYourselfFlag ? fbq[fbpFlag] : '无'}</span>
          }
        },
        {
          label: '店铺新增月FEEDBACK数',
          sortable: 'custom',
          value: 'newFeedbackCnt'
        },
        {
          label: '卖家产品数',
          sortable: 'custom',
          value: 'productCnt'
        }
      ]
    }
  }
}
</script>