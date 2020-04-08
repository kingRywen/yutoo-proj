<template>
  <div>
    <ImportFile
      ref="upload"
      @success="handleSuccess"
      filename="排名查询"
      :data="downloadParams"
      :isAuto="false"
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
    </ImportFile>
  </div>
</template>

<script>
import { downloadFile } from 'Utils'
import { CONST_PORT_CONFIG } from 'Config'
export default {
  props: ['params', 'query', 'type', 'purchaseObject'],
  data() {
    return {
      ImportFileData: {},
      action: `${CONST_PORT_CONFIG.DEFAULT_URL}/importLog/importData`
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        if (this.$refs.upload.fileList.length) {
          resolve()
        } else {
          this.$message.warning('请上传文件')
          reject()
        }
      })
    },
    download() {
      let filePath = ''
      if (this.type) {
        filePath = !this.purchaseObject
          ? './xls-temp/sellWith/跟卖模板.xlsx'
          : './xls-temp/sellWith/跟卖模板-指定卖家.xlsx'
      } else {
        filePath = './xls-temp/导入库存&成本.xlsx'
      }

      downloadFile(filePath, null)
    },
    //导入数据成功
    handleSuccess({ res }) {
      if (res.code === 0) {
        GLOBAL.vbus.$emit('business.response.success', res.msg)
        if (!(res.fail || res.ignore)) {
          this.params.fn && this.params.fn()
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
        ...this.storeInfo,
        ...this.query
      }
    }
  }
}
</script>
