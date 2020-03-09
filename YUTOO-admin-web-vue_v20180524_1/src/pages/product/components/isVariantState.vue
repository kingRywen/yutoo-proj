<template>
  <div>
    <v-input type="textarea" v-model="value"></v-input>
  </div>
</template>

<script>
import { fetchData } from "common/common";
import apis from "apis";
export default {
  data() {
    return {
      value: ""
    };
  },
  methods: {
    ok() {
      let variant = this.$attrs.item.variant;
      fetchData({
        ...apis.PRODUCT_VARIANT_UPDATE,
        data: {
          productId: variant.productId,
          activateFlag: this.$attrs.status,
          activateRemark: this.value
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$listeners.set();
          this.$root.$children[0].asyncModalVisible = false;
        }
      });
      // let n = this.$listeners.set(this.selected);
      // this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style>
</style>
