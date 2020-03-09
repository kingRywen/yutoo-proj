<template>
  <div v-if="!$attrs.type">

    <div v-if="info">
      <a :href="info[0].downUrl">下载</a>
      <div>{{info[0].errorMessage}}</div>
    </div>
    <div v-else>获取上架失败信息失败</div>
  </div>
  <div v-else>
    原因： {{info.rows}}
    <!-- 审核不通过原因 -->
  </div>
</template>

<script>
import apis from "apis";
import { fetchData } from "common/common";
import UploadImg from "components/base/uploadImg";

export default {
  inheritAttrs: false,
  components: {
    UploadImg
  },
  created() {
    let data = {};
    data.productId = +this.$attrs.storeProductId;
    data.productType = +this.$attrs.productType;
    if (!this.$attrs.type) {
      fetchData({
        ...apis.STORE_PRODUCT_PUBLISH_FAIL_REASON,
        data: data
      }).then(res => {
        console.log(res);
        this.info = res.data.rows;
      });
    } else {
      // 查看审核不通过的原因
      fetchData({
        ...apis.STORE_PRODUCT_AUDIT_REFUSE_REASON,
        data: data
      }).then(res => {
        console.log(res);
        this.info = res.data;
      });
    }
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
