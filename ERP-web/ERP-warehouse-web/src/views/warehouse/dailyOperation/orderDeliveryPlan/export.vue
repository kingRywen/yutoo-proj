<template>
  <div>
    <YtCustomExport :loadData="loadData" :apis="apis" fieldId="wmPackageExportId" :fetch="fetch" />
  </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';

export default {
  data() {
    let vm = this
    return {
      params: {},
      apis: ['warehouse/wmPackageExportRemove', 'warehouse/wmPackageExportList'],
      fetch: {
        dataPromise(row) {
          return vm.$api[`warehouse/wmPackageExportInfo`]({wmPackageExportId: row.wmPackageExportId})
          .then(data => {
            return data
          })
        },
        savePromise(columns, name) {
          return vm.$api[`warehouse/wmPackageExportSave`]({columns, name})
        },
        excelPromise(columns) {
          return vm.$api[`warehouse/wmPackageExport`]({wmPackageIds: vm.params.wmPackageIds, columns})
          .then(data => {
            downloadFile(data.path)
            vm.$message.success('导出成功')
            return data
          })
        },
      }
    }
  },
  methods: {
    getParams(params) {
      this.params = params
    },
    loadData() {
      return this.$api[`warehouse/wmPackageExportGetSystemTemplate`]({wmPackageIds: this.params.wmPackageIds})
      .then(data => {
        return data.rows
      }).catch(() => {})
    }
  },
}
</script>

<style>

</style>
