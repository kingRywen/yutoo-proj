<template>
  <div>
    <!-- {{data.type}} -->
    <el-button class="mb20" icon="el-icon-download" type="success" size="small" @click="download">下载模板文件</el-button>
    <el-upload
      class="per100 import-file"
      drag
      ref="upload"
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
    <template v-if="data.type !== '导入产品质量问题'">
      <div v-if="resultInfo.errorInfos || resultInfo.locations">
        <div class="hr"></div>
        <h2>导入文件信息</h2>
        <template v-if="resultInfo.errorInfos && resultInfo.errorInfos.length">
          <el-tag class="mr10" type="danger" v-for="item in resultInfo.errorInfos" :key="item.id">
            <i class="el-icon-error"></i>
            {{item}}
          </el-tag>
        </template>
        <template v-if="resultInfo.locations.locationUploadBeans">
          <el-table :data="resultInfo.locations.locationUploadBeans">
            <ElTableColumn label="库位编码" prop="locationCode"></ElTableColumn>
            <ElTableColumn label="仓库名称" prop="warehouseName"></ElTableColumn>
            <ElTableColumn label="分区名称" prop="divisionName"></ElTableColumn>
            <ElTableColumn label="错误信息">
              <template slot-scope="scope">
                <template v-if="scope.row.errorInfo">
                  <i class="danger el-icon-error"></i>
                  <span class="danger">{{scope.row.errorInfo}}</span>
                </template>
                <span v-else>
                  <i class="success el-icon-success"></i>
                  <span class="success">验证通过</span>
                </span>
              </template>
            </ElTableColumn>
          </el-table>
        </template>
      </div>
    </template>
    <template v-else>
      <div v-if="resultInfo.questions">
        <div class="hr"></div>
        <h2>导入文件信息</h2>
        <template v-if="resultInfo.questions.errorInfos && resultInfo.questions.errorInfos.length">
          <el-tag class="mr10" type="danger" v-for="item in resultInfo.questions.errorInfos" :key="item.id">
            <i class="el-icon-error"></i>
            {{item}}
          </el-tag>
        </template>
        <template v-if="resultInfo.questions.qualityQuestionBeans">
          <el-table :data="resultInfo.questions.qualityQuestionBeans">
            <ElTableColumn label="产品SKU" prop="customizeSku"></ElTableColumn>
            <ElTableColumn label="供应商" prop="supplier"></ElTableColumn>
            <ElTableColumn label="数量" prop="count"></ElTableColumn>
            <ElTableColumn label="错误信息">
              <template slot-scope="scope">
                <template v-if="scope.row.errorInfo">
                  <i class="danger el-icon-error"></i>
                  <span class="danger">{{scope.row.errorInfo}}</span>
                </template>
                <span v-else>
                  <i class="success el-icon-success"></i>
                  <span class="success">验证通过</span>
                </span>
              </template>
            </ElTableColumn>
          </el-table>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import storage from 'Utils/saver'
import { downloadFile } from 'Utils/tools'
import { getConfig } from 'Plugins/api'
/* eslint-disable */
export default {
  inheritAttrs: false,
  name: 'ImportLocation',
  props: {
    data: {
      default: () => ({})
    }
  },
  // this.data.type 不存在 为导入库位
  // this.data.type 存在 即可判断值
  data() {
    return {
      accept: '.csv,.xlsx,.xls',
      fileList: [],
      headers: {
        token: storage.get('local', 'token')
      },
      // 上传文件路径
      action: '',
      // 上传确认接口名字
      confirmApi: 'wmLocationUploadConfirm',
      // 下载模板文件路径
      downloadApi: 'wmLocationDownload',
      resultInfo: {}
    }
  },
  created() {
    getConfig().then(_CONST_PORT_CONFIG => {
      let type = this.data && this.data.type
      let { WAREHOUSE_URL } = _CONST_PORT_CONFIG
      if (type === '导入产品质量问题') {
        // this.accept = '.zip'
        this.action = WAREHOUSE_URL + '/WmInventory/upload/quality'
        this.downloadApi = 'wmInventoryDownloadQuality'
        this.confirmApi = 'wmInventoryConfirmQuality'
      } else {
        this.action = WAREHOUSE_URL + '/WmLocation/upload'
      }
    })
  },
  methods: {
    _close() {
      this.fileList = []
    },
    download() {
      this.$api[`warehouse/${this.downloadApi}`]({})
        .then(data => {
          downloadFile(data.path, null, true)
        })
        .catch(() => {})
    },
    isError() {
      const el =
        this.data.type !== '导入产品质量问题'
          ? this.resultInfo.locations.locationUploadBeans
          : this.resultInfo.questions.qualityQuestionBeans
      const subError = el.filter(el => el.errorInfos && el.errorInfos.length)
      return (
        (this.resultInfo.errorInfos && this.resultInfo.errorInfos.length) ||
        subError.length
      )
    },

    submit() {
      if (!this.resultInfo.uploadCode) {
        return Promise.reject('请上传文件')
      }
      if (this.isError()) {
        return Promise.reject('导入文件信息有误，请编辑正确后上传再确认导入')
      }

      return this.$api[`warehouse/${this.confirmApi}`]({
        uploadCode: this.resultInfo.uploadCode
      }).then(data => {
        this.fileList = []
      })
    },

    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleSuccess(res, file, fileList) {
      if (this.data.type !== '导入产品质量问题') {
        let { code, errorInfos, locations, msg, uploadCode } = res
        if (code !== 0) {
          this.$message.error(msg)
        } else {
          this.resultInfo = {
            uploadCode,
            locations,
            errorInfos
          }
        }
      } else {
        let { questions, uploadCode, code, msg } = res
        if (code !== 0) {
          this.$message.error(msg)
        } else {
          this.resultInfo = {
            questions,
            uploadCode
          }
        }
      }
    },
    handleError(response, file, fileList) {
      this.fileList = []
    },
    handleBeforeUpload(file) {
      console.log(file.type)
      let isZip = false
      // const isZip = this.data.type === '导入产品质量问题'
      let arr = isZip
        ? 'application/zip, application/x-zip, application/x-zip-compressed'
        : '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.split(
            ', '
          )
      const isExcel = arr.indexOf(file.type) > -1
      // const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isExcel) {
        this.$message.warning(`上传文件只能是${isZip ? '.zip' : 'excel'}文件!`)
      }
      return isExcel
    },
    handleChange(file, fileList) {
      // 限制只能上传一个
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.fileList = fileList
    }
  },
  watch: {
    fileList(val) {
      if (!val.length) {
        this.resultInfo = {}
      }
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
