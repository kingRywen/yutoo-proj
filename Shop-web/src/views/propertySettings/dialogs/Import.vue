<template>
  <ImportFile @success="handleSuccess" filename="类目属性模板" :data="data" :downloadApi="downloadApi" :action="action"/>
</template>

<script>
import { host } from 'Config'

export default {
  props: ['params'],
  data() {
    return {
      downloadApi: 'sameAttrConfigDownloadTemplate',
      action: `${host}sameAttrConfig/importData`
    }
  },
  computed: {
    data() {
      return {
        sellerId: this.sellerId,
        siteId: this.siteId,
        pcid: this.params.pcid
      }
    }
  },
  methods: {
    handleSuccess({ res, file, fileList }) {
      console.log(res, file, fileList)
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.params.close()
      }
    },
  }
}
</script>

<style>
</style>
