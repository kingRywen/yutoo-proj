<template>
  <div>
    <v-input type="textarea" v-model="value" :autosize="{minRows:6}"></v-input>
  </div>
</template>

<script>
import { fetchData, showToast } from "common/common";
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
        } else {
          showToast('error', res.data.msg)
        }
      });
    }
  }
};
</script>

<style>
</style>
