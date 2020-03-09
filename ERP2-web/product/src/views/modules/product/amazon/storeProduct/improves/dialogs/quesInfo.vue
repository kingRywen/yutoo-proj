<template>
    <mainLayout
    :simple="true"
    :outerParams="{changeId, platSiteId, productSellerId}"
    :columns="columns"
    :selection="false"
    :url="parent ? `product/prProductSellerChangeAmzListForParent` : `product/prProductSellerChangeAmzListForChild`"
  ></mainLayout>
</template>
<script>
export default {
  props: ['changeId', 'platSiteId', 'parent', 'productSellerId'],
  data() {
    return {
      currentPage: 1,
      total: 10,
      columns: [
        {
          label: '时间',
          value: 'createTime'
        },
        {
          label: 'SKU',
          value: 'sellerSku'
        },
        {
          label: '变动前',
          value: 'preContent'
        },
        {
          label: '变动后',
          value: 'curContent'
        }
      ]
    }
  }
}
</script>