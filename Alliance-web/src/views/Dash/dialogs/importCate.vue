<template>
  <div>
    <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
    <new-form ref="form" label-width="120px" :form-schema="formSchema" v-model="value"></new-form>
  </div>
</template>
<script>
import download from 'Utils/download'
export default {
  data() {
    return {
      formSchema: {
        upload: {
          widget: 'upload',
          width: 'full',
          action: 'https://jsonplaceholder.typicode.com/posts/',
          autoUpload: false,
          multiple: false,
          required: true,
          limit: 1,
          limitSize: 1,
          fileLimit: ['excel']
        }
      },
      value: {}
    }
  },
  methods: {
    downloadTemp() {
      this.$api[`main/categorySysExportTemplate`]({}).then(data => {
        download(data, '类目导入模板.xls')
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`main/categoryImportData`]({
          file: this.value.upload[0].raw
        })
      })
    }
  }
}
</script>