<template>
  <ImportFile @success="handleSuccess" filename="商品费用明细模板" :data="data" :downloadApi="downloadApi" :action="action" />
</template>

<script>
import { host } from "Config";
export default {
  props: ['params'],
  data() {
    return {
      downloadApi: '',
      action: `${host}finance/flowImport`,
    }
  },
  computed: {
    data() {
      return this.storeIds
    },
  },
  methods: {
    handleSuccess({ res, file, fileList }) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.params.success()
      }
    },
  },
}
</script>

<style>

</style>
