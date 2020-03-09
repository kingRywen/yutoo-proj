<template lang="html">
    <!-- 批量导入支付宝 和 追踪号-->
    <div class="uploadBox">
        <el-upload
            class="uploadBtn"
            :action="url"
            ref="upload"
            :with-credentials="true"
            :headers="headers"
            :data="file"
            multiple
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :file-list="fileList"
            :limit="10">
            <el-button size="small" type="primary">批量导入</el-button>
            <div slot="tip" class="el-upload__tip">只能导入excel文件</div>
        </el-upload>

        <el-button size="small" type="primary" @click="downloadTemplate" class="downloadBtn">下载模板</el-button>
    </div>
</template>

<script>
/* eslint-disable */
import { downloadFile } from '@/utils/tools'
import storage from 'Utils/saver'
import { CONST_PORT_CONFIG } from '@/config/index'

export default {
  props: {
    type: [String, Number] //type1下载支付宝模板，2.追踪号
  },
  data() {
    return {
      url:
        CONST_PORT_CONFIG.PROCUREMENT_URL +
        '/purchase/lowerSingle/importAlipay',
      headers: {
        token: storage.get('local', 'token')
      },
      file: {},
      fileList: []
    }
  },
  methods: {
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    //上传失败
    uploadError(err, file, fileList) {
      console.log(err)
    },
    //上传成功
    uploadSuccess(response, file, fileList) {
      if (response.code == 0) {
        this.$message.success(response.msg)
      } else {
        this.$message.error(response.msg)
      }
    },
    //上传之前
    beforeUpload(file) {
      this.file['file'] = file
      this.file['type'] = this.type
    },
    downloadTemplate() {
      this.$api['procurement/lowerSingleDownloadImport']({
        type: this.type
      })
        .then(res => {
          downloadFile(res.path)
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    }
  }
}
</script>

<style lang="scss">
.uploadBox {
  display: flex;
  flex-direction: row;
  height: 300px;
  overflow-y: auto;
  position: relative;
  .downloadBtn {
    height: 32px;
    position: absolute;
    left: 150px;
    top: 0;
    // margin-right: 10px;
  }
}
</style>
