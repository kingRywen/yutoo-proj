<template>
  <ImportFile filename="产品属性值模板" @success="handleSuccess" :downloadApi="downloadApi" :downloadParams="downloadParams" :action="action" :data="downloadParams" />
</template>

<script>
import { host } from "Config";

export default {
  props: ["params"],
  data() {
    return {
      downloadApi: "selAttrProductExportData",
      action: `${host}selAttrProduct/importData`
    };
  },
  computed: {
    downloadParams () {
      return {
        cateId: this.params.cateId,
        platformId: this.platformId,
        siteId: this.siteId,
        sellerId: this.sellerId,
      }
    }
  },
  methods: {
    handleSuccess({ res, file, fileList }) {
      console.log(res, file, fileList);
      if (res.code !== 0) {
        this.$message.error(res.msg);
      } else {
        this.$message.success(res.msg);
        // this.params.close();
      }
    }
  }
};
</script>

<style>
</style>
