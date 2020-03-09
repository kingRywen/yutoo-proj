<template>
  <main-layout
    class="w1100"
    url="fba/FbmOrderInfoViewItems"
    :outerParams="queries"
    :isShowPag="false"
    :columns="columns"
  ></main-layout>
</template>
<script>
export default {
  props: ['queries'],
  data() {
    return {
      columns: [
        {
          label: 'SKU',
          value: 'seller_sku'
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: '主图',
          img: true,
          value: 'img'
        },
        {
          label: '数量',
          value: 'count'
        }
      ]
    }
  }
}
</script>