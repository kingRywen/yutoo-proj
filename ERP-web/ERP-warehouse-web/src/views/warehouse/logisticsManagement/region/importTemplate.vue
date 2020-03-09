<template>
  <div class="import-template">
    <el-row style="min-height: 160px;">
      <ElCol :offset="4" :span="6">
        <el-upload
          class="upload-demo"
          :action="action"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="onSuccess"
          :on-error="onError"
          :multiple="false"
          accept=".xlsx, .xls"
          :headers="headers"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">上传文件</el-button>
        </el-upload>
      </ElCol>
      <el-col :offset="1" :span="6">
        <!-- <el-button type="primary" size="small" class="upload" @click="handleUpload">上传文件</el-button> -->
        <el-button type="primary" size="small" class="updown" @click="handleUpdown">下载模板</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { downloadFile } from 'Utils/tools'
import { CONST_PORT_CONFIG } from 'Config'
const { WAREHOUSE_URL } = CONST_PORT_CONFIG
import storage from 'Utils/saver'
const token = storage.get('local', 'token')

export default {
  data() {
    return {
      params: {},
      fileList: [],
      headers: {
        token
      }
    }
  },
  computed: {
    action() {
      return `${WAREHOUSE_URL}/${this.params.upUrl}`
    }
  },
  methods: {
    // eslint-disable-next-line
    onSuccess(response, file, fileList) {
      console.log()
      this.$deleteMsg(response)
    },
    // eslint-disable-next-line
    onError(err, file, fileList) {
      this.$message.error('上传失败')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    // eslint-disable-next-line
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    initFn(params) {
      this.params = params
    },
    handleUpdown() {
      let vm = this
      vm.$api[`warehouse/${vm.params.downUrl}`]().then(({ path }) => {
        downloadFile(path)
      })
    },
    submitForm(cb) {
      cb && cb()
    },
    resetForm() {}
  }
}
</script>

<style lang="scss">
.import-template {
  background: #fff;
  .upload {
    margin-left: 15%;
  }
  .updown {
    margin-left: 20%;
  }
}
</style>
