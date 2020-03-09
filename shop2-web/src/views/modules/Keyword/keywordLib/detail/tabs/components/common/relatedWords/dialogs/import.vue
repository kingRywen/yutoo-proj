<template>
  <div>
    <ImportFile
      @success="handleSuccess"
      :beforeUpload="beforeUpload"
      filename="排名查询"
      :data="downloadParams"
      :action="action"
    >
      <el-button
        @click="download"
        slot="download"
        class="mb20"
        plain
        icon="el-icon-download"
        type="success"
        size="small"
      >下载模板文件</el-button>
      <new-form v-if="query.importType === 7" ref="form" label-width="70px" :form-schema="formSchema" :value="value"></new-form>
    </ImportFile>
  </div>
</template>

<script>
import { downloadFile } from 'Utils'
import { CONST_PORT_CONFIG } from 'Config'
export default {
  // props: ['params', 'query'],
  props: {
    params: Object,
    // 上传时的参数
    query: Object,
    tempName: {
      default: '数据模板'
    }
  },
  data() {
    return {
      formSchema: {
        origin: {
          required: true,
          widget: 'select',
          options: this.$const['KEYWORD/relatedSource'],
          label: '添加来源'
        }
      },
      value: {},
      ImportFileData: {},
      action: `${CONST_PORT_CONFIG.DEFAULT_URL}/importLog/importData`
    }
  },
  methods: {
    beforeUpload() {
      if (!this.$refs.form) {
        return Promise.resolve()
      }
      return this.$refs.form.validate()
    },
    download() {
      downloadFile(`./xls-temp/${this.tempName}.xlsx`, null)
    },
    //导入数据成功
    handleSuccess({ res }) {
      if (res.code === 0) {
        // debugger
        if (!(res.fail || res.ignore)) {
          // debugger
          this.params && this.params.fn && this.params.fn()
          GLOBAL.vbus.$emit('business.response.success', res.msg)
          this.$emit('dialog.close')
        }
      } else {
        this.$message.error(res.msg)
      }
    }
  },
  computed: {
    downloadParams() {
      return {
        ...this.value,
        ...this.storeInfo,
        ...this.query
      }
    }
  }
}
</script>
