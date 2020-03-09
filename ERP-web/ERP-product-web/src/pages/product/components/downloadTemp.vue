<template>
  <div>
    <v-button @click="download">下载模板</v-button>
    <!-- <v-upload @change="onChange">
      <v-button type="primary">上传模板</v-button>
    </v-upload>-->
    <el-upload
      accept=".csv, .xlsx, .xls"
      :before-upload="handleBeforeUpload"
      :limit="1"
      :auto-upload="false"
      class="upload-demo"
      ref="up"
      action="https://jsonplaceholder.typicode.com/posts/"
    >
      <v-button type="primary">上传模板</v-button>
    </el-upload>

    <div class="margin-top-10 text-center">
      <v-button @click="upload" :loading="loading">确认上传</v-button>
    </div>
  </div>
</template>

<script>
import { fetchData, showToast, downloadFile, handlerCode } from 'common/common'
import apis from 'apis'

export default {
  inheritAttrs: false,
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleBeforeUpload(file) {
      let isZip = false
      // const isZip = this.data.type === '导入产品质量问题'
      let arr = isZip
        ? 'application/zip, application/x-zip, application/x-zip-compressed'
        : '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.split(
            ', '
          )
      const isFile = arr.indexOf(file.type) > -1
      // const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isFile) {
        this.$message.warning(`上传文件只能是${isZip ? '.zip' : 'excel'}文件!`)
      }
      return isFile
    },
    download() {
      fetchData({ ...apis.PRODUCT_BATCH_UPDATE_DOWNLOAD, data: {} }).then(
        res => {
          if (res.data.code !== 0) {
            showToast('error', res.data.msg)
            return
          }
          downloadFile(res.data.path)
        }
      )
    },
    upload() {
      let vm = this
      let data = new FormData()
      if (!vm.$refs.up.uploadFiles.length) {
        showToast('warning', '请选择一个文件上传')
      }
      data.append('file', vm.$refs.up.uploadFiles[0].raw)
      vm.loading = true
      fetchData({ ...apis.PRODUCT_BASE_BATCH_UPLOAD, data }).then(res => {
        vm.loading = false
        vm.cancel()
        vm.$listeners.set(res)
      })
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false
    }
  }
}
</script>

<style lang='scss'>
.upload-demo {
  display: inline;
  .el-upload__input {
    display: none;
  }
}
</style>
