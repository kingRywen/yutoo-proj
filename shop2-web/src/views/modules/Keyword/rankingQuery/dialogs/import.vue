<template>
  <div>
    <ImportFile
      :downloadParams="downloadParams"
      @success="handleSuccess"
      filename="排名查询"
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
    let vm = this
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
        taskId: this.params.taskId,
        importType: 1
      }
    }
  }
}
</script>
