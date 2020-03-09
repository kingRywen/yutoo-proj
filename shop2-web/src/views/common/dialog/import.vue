<template>
  <div>
    <ImportFile
      :downloadParams="downloadParams"
      @success="handleSuccess"
      :filename="params.filename"
      :data="dataParams"
      :downloadApi="downloadApi"
      :action="action"
    />
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from 'Config'
export default {
  props: {
    params: {
      default: () => ({
        filename: '文件', //导出模板文件的名称
        importType: 0, //导入及导出模板的类型
        fn: () => {}, //fn:this.$refs.layout.closeDialog,    			//关闭弹框的函数
        success: () => {}, //success:this.$refs.layout.getList,				//导入成功的函数

        // 以上内容建议都传,以下内容根据需求来决定是否传递

        taskId: null, //任务id
        date: null, //导入日期,类型为流量报告时传入
        isMainLayout: false //是否是mainLayout点出的弹窗
      }),
      type: Object
    }
  },
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
        if (this.params.isMainLayout) {
          return this.$emit('dialog.close')
        }
        this.params.fn && this.params.fn()
        this.params.success && this.params.success()
      } else {
        this.$message.error(res.msg)
      }
    }
  },
  computed: {
    downloadParams() {
      //导出模板文件传给后台数据
      return {
        ...this.storeInfo,
        importType: this.params.importType || 0,
        merchantTaskId: this.params.merchantTaskId
      }
    },
    dataParams() {
      //导入传给后台数据
      let ret = {
        ...this.storeInfo,
        importType: this.params.importType || 0,
        // taskId: this.params.taskId || undefined,
        // date: this.params.date || undefined,
        merchantTaskId: this.params.merchantTaskId
      }
      if (this.params.taskId != null) {
        ret.taskId = this.params.taskId
      }
      if (this.params.date != null) {
        ret.date = this.params.date
      }
      return ret
    }
  }
}
</script>
