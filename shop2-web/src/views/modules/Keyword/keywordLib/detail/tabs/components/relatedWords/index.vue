<template>
  <relatedWords :categoryId="categoryId" :productId="productId" :curQuery="curQuery" />
</template>
<script>
import relatedWords from '../common/relatedWords'
export default {
  props: ['categoryId', 'curQuery', 'productId'],
  components: {
    relatedWords
  }
}
</script>