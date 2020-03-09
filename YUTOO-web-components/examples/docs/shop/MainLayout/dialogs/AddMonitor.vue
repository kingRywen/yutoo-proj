<template>
  <yt-form ref="form" label-width="90px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      activeFields: [
        {
          label: '监控周期',
          name: 'monitor',
          type: 'dateRange',
          span: 24,
          timeDisabled: 'before',
          required: true
        }
      ],
      formData: {
        monitor:[]
      }
    }
  },
  methods: {
    _initData() {
      if (this.params && this.params.edit) {
        this.formData.monitor = this.params.time
      }
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let [monitorFrom, monitorTo] = this.formData.monitor
        let params = {
          taskIds: this.params.taskIds,
          monitorFrom,
          monitorTo
        }
        return this.$api[this.params.edit ? `productAnalysisUpdateMonitor` : `productAnalysisAddMonitor`](params)
      })
    }
  }
}
</script>

<style>
</style>
