<template>
  <div>
    <!-- {{data.type}} -->
    <el-button class="mb20" icon="el-icon-download" type="success" size="small" @click="download">下载模板文件</el-button>
    <el-upload
      class="per100 import-file"
      drag
      ref="upload"
      :data="data"
      :action="action"
      :headers="headers"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-success="handleSuccess"
      :on-error="handleError"
      :multiple="false"
      :accept="accept"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
    </el-upload>
  </div>
</template>

<script>
import storage from 'Utils/saver'
import { downloadFile } from 'Utils/tools'
// import { getConfig } from 'Plugins/api'
/* eslint-disable */
export default {
  inheritAttrs: false,
  name: 'ImportFile',
  props: {
    filename: String,
    downloadParams: {
      default: () => {}
    },
    data: {
      default: () => {}
    },
    single: {
      default: true
    },
    downloadApi: {
      required: true,
      type: String
    },
    action: {
      required: true,
      type: String
    },
    type: {
      // 0 zip 1 excel
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      accept: '.csv,.xlsx,.xls',
      fileList: [],
      headers: {
        token: storage.get('local', 'shop_token')
      }
      // 上传文件路径
      // action: '',
      // 上传确认接口名字
      // confirmApi: 'wmLocationUploadConfirm',
      // 下载模板文件路径
      // downloadApi: 'wmLocationDownload',
    }
  },
  created() {
    if (!this.type) {
      this.accept = '.zip'
    }
  },
  methods: {
    download() {
      this.$api[`${this.downloadApi}`](this.downloadParams)
        .then(data => {
          downloadFile(
            data,
            `${this.filename || '下载'}-${this.$.formatDate(
              new Date(),
              `{y}{m}{d}{h}{i}{s}`
            )}` || '下载'
          )
        })
        .catch(() => {})
    },

    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleSuccess(res, file, fileList) {
      this.$emit('success', { res, file, fileList })
    },
    handleError(response, file, fileList) {
      this.fileList = []
    },
    handleBeforeUpload(file) {
      let isZip = !this.type
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
    handleChange(file, fileList) {
      // 限制只能上传一个
      if (this.single && fileList.length > 1) {
        fileList.shift()
      }
      this.fileList = fileList
    }
  }
}
</script>

<style lang='scss'>
.import-file {
  .el-upload.el-upload--text {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>
