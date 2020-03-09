<template>
  <div>
    {{data}}
  </div>
</template>

<script>
import { fetchData } from "common/common";
import apis from "apis";
export default {
  inheritAttrs: false,
  data() {
    return {
      data: null
    };
  },
  created() {
    let { parentIds, variantIds } = this.$attrs;
    fetchData({
      ...apis.PRODUCT_PRICE_BATCH_INVOICE_TAX,
      data: { parentIds, variantIds }
    }).then(res => {
      this.data = res;
    });
  }
};
</script>

<style>
</style>
