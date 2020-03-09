<template>
  <div>
    <ImportFile
      :downloadParams="downloadParams"
      @success="handleSuccess"
      filename="流量报告"
      :data="downloadParams"
      :downloadApi="downloadApi"
      :action="action"
    />
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from 'Config'
export default {
  props: ['params'],
  data() {
    return {
      ImportFileData: {},
      downloadApi: 'keyword/importLogExportTemplate',
      action: `${CONST_PORT_CONFIG.DEFAULT_URL}/importLog/importData`
    }
  },
  methods: {
    //导入数据成功
    handleSuccess({ res, file, fileList }) {
      if (res.code === 0) {
        GLOBAL.vbus.$emit('business.response.success', res.msg)
        if (res.fail || res.ignore) {
        } else {
          if (this.params.date) {
            return this.$emit('dialog.close')
          }
          this.params.fn()
          this.params.success()
        }
      } else {
        this.$message.error(res.msg)
      }
    }
  },
  computed: {
    downloadParams() {
      return {
        ...this.storeInfo,
        importType: 2,
        date: this.params.date ? this.params.date : null
      }
    }
  }
}
</script>
