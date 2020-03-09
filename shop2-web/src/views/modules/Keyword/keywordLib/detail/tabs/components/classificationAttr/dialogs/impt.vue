<template>
  <div>
    <ImportFile @success="handleSuccess" filename="排名查询" :data="downloadParams" :action="action">
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
  props: ['params', 'query'],
  data() {
    return {
      ImportFileData: {},
      action: `${CONST_PORT_CONFIG.DEFAULT_URL}/importLog/importData`
    }
  },
  methods: {
    download() {
      downloadFile('./xls-temp/分类属性模板.xlsx', null)
    },
    //导入数据成功
    handleSuccess({ res }) {
      if (res.code === 0) {
        GLOBAL.vbus.$emit('business.response.success', res.msg)
        if (!(res.fail || res.ignore)) {
          this.params.fn()
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
