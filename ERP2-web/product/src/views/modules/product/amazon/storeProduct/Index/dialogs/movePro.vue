<template>
  <Move :store-product="true" :params="params" :platSiteId="platSiteId" />
</template>
<script>
import Move from 'Views/modules/product/amazon/platProduct/index/dialogs/moveProduct.vue';
export default {
  props: {
    params: Object,
    platSiteId: Number,
    // 是否店铺产品的挪动
    storeProduct: {
      default: false,
      type: Boolean
    }
  },
  components: {
    Move
  }
}
</script>