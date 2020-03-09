<template>
  <div>
    <!-- {{info}} -->
    <a :href="info[0].downUrl">下载</a>
    <div>{{info[0].errorMessage}}</div>
  </div>
</template>

<script>
import apis from "apis";
import { fetchData } from "common/common";
import UploadImg from "components/base/uploadImg";

export default {
  components: {
    UploadImg
  },
  created() {
    let data = {};
    data.productId = +this.$attrs.storeProductId;
    data.productType = +this.$attrs.productType;
    fetchData({
      ...apis.STORE_PRODUCT_PUBLISH_FAIL_REASON,
      data: data
    }).then(res => {
      console.log(res);
      this.info = res.data.rows;
    });
  },
  data: () => ({
    info: {}
  }),
  methods: {
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    ok() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style>
</style>
