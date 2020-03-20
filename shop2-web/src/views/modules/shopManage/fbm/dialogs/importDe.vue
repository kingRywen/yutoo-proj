<template>
  <div>
    <ImportFile
      @success="handleSuccess"
      :data="dataParams"
      :downloadParams="{a: 1}"
      :downloadApi="downloadApi"
      :action="action"
    />
  </div>
</template>
<script>
import { CONST_PORT_CONFIG } from 'Config'
export default {
  data() {
    return {
      action:
        CONST_PORT_CONFIG.DEFAULT_URL + '/fbm-order/order/fulfillment-import',
      downloadApi: 'fbm/fbm-orderOrderFulfillment-template',
      dataParams: {
        storeId: this.$attrs.storeId
      }
    }
  },
  methods: {
    handleSuccess({ res }) {
      if (res.code !== 0) {
        // this.$emit('dialog.close', true)
        return this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.$emit('dialog.close', true)
      }
    }
  }
}
</script>