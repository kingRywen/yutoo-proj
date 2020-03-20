<template>
  <main-layout
    class="w1100"
    :showSelection="false"
    url="fbm/fbm-orderOrderItems"
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
          value: 'sellerSku'
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: '主图',
          img: true,
          value: 'imagePath'
        },
        {
          label: '数量',
          value: 'itemCount'
        }
      ]
    }
  }
}
</script>