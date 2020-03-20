<template>
  <main-layout
    class="w800"
    :outerParams="outerParams"
    :columns="columns"
    :url="`ss/${type == 'lib' ? 'sellingLibSellingLibList' : 'sellingMaybeSellingList'}`"
    :isShowPag="false"
  ></main-layout>
</template>
<script>
export default {
  props: ['siteId', 'srcSiteId', 'asin', 'platformId', 'type'],
  computed: {
    outerParams() {
      const { siteId, srcSiteId, asin } = this
      if (this.type == 'lib') {
        return { siteId, platformId: this.storeInfo.platformId, asin }
      }
      return { platformId: this.storeInfo.platformId, siteId, srcSiteId, asin }
    }
  },
  data() {
    return {
      columns: [
        {
          label: '卖家名称',
          value: 'sellerName'
        },
        {
          label: '价格',
          value: 'price'
        },
        {
          label: '运费',
          value: 'fare'
        },
        {
          label: '发货方式',
          value: 'fbpFlag',
          _enum: ['FBM', 'FBA']
        }
      ]
    }
  }
}
</script>