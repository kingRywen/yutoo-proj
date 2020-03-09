<template>
  <privative :categoryId="categoryId" :productId="productId" :curQuery="curQuery" />
</template>
<script>
import privative from '../common/privative'
export default {
  props: ['categoryId', 'curQuery', 'productId'],
  components: {
    privative
  },
  data() {
    return {}
  }
}
</script>