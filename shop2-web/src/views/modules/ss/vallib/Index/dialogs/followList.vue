/*
 * @Author: rywen 
 * @Date: 2020-03-02 15:29:21 
 * @Last Modified by: rywen
 * @Last Modified time: 2020-03-10 11:42:43
 */
<template>
  <div class="w800">
    <main-layout
      :outerParams="{asin,siteId, deliverySiteId, platformId: storeInfo.platformId}"
      :isShowPag="false"
      :columns="columns"
      url="ss/sellingSellingList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['asin', 'siteId', 'deliverySiteId'],
  data() {
    return {
      columns: [
        {
          label: '卖家名称',
          value: 'sellerName'
        },
        // {
        //   label: 'ASIN',
        //   value: 'sellerId'
        // },
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