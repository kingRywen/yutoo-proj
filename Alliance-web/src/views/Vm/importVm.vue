<template>
  <div v-loading="importWrapperLoading">
    <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
    <el-upload
      class="custom-upload"
      :before-upload="handleBeforeUpload"
      :action="uploadConfig.url"
      :headers="uploadConfig.headers"
      :data="uploadConfig.data"
      :show-file-list="false"
      :on-success="handleOnSuccess"
      :on-error="handleOnError"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
  </div>
</template>
<script>
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
import download from 'Utils/download'
const token = storage.get('local', 'token')

export default {
  props: ['rootVm', 'type'],
  data() {
    return {
      importWrapperLoading: false,
      uploadConfig: {
        url: CONST_PORT_CONFIG.BASE_URL + 'vm/importVm',
        headers: {
          token
        },
        data: {
          token
        }
      }
    }
  },
  methods: {
    downloadTemp() {
      this.$api[`main/vmExportTemplate`]({}).then(data => {
        download(data, '虚拟机导入模板.xls')
      })
    },
    handleBeforeUpload() {
      this.importWrapperLoading = true
      return Promise.resolve()
    },
    handleOnSuccess(res) {
      this.importWrapperLoading = false
      let { msg: message, code } = res
      if (code !== 0) {
        // this.$message.error(message)
        this.notifyVm = this.$notify({
          title: '上传失败',
          dangerouslyUseHTMLString: true,
          message,
          type: 'error',
          customClass: 'customErrorNotify',
          duration: 3000
        })
        return
      }

      this.$notify({
        title: '上传成功',
        dangerouslyUseHTMLString: true,
        message,
        duration: 3000,
        type: 'success'
      })
      // this.importDialogOptions.visible = false
      // this.$refs.lay.handleSearch()
      this.rootVm.$refs.layout.closeDialog()
      this.rootVm.$refs.layout.getList()
    },
    handleOnError(err) {
      this.importWrapperLoading = false
      this.$message.error(err.message)
    }
  }
}
</script>