<template>
  <div class="w600">
    <new-form ref="formData" v-model="formData" label-width="80px" :form-schema="dataFormSchema"></new-form>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      formData: {
        frequency: null
      },
      dataFormSchema: {
        monitor: {
          widget: 'daterange',
          label: '监控周期',
          span: 24,
          required: true
        },
        frequency: {
          widget: 'select',
          label: '监控频率',
          span: 24,
          required: true,
          options: [
            {
              label: '10分钟',
              value: 10
            },
            {
              label: '30分钟',
              value: 30
            },
            {
              label: '60分钟',
              value: 60
            },
            {
              label: '240分钟',
              value: 240
            },
            {
              label: '1天',
              value: 60 * 24
            }
          ]
        }
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.formData.validate().then(() => {
        let params = {
          ...this.params,
          frequency: this.formData.frequency,
          monitorFrom: this.formData.monitor[0],
          monitorTo: this.formData.monitor[1]
        }
        if (params.edit) delete params.edit
        delete params.rows
        return this.$api[
          `${
            this.params.edit
              ? 'keyword/taskKeywordRankUpdateMonitor'
              : 'keyword/taskKeywordRankOpenMonitor'
          }`
        ](params)
      })
    }
  },
  mounted() {
    //如果只有一条,回显;   否则不回显
    let row = this.params.rows
    if (row.length === 1) {
      this.formData.frequency = row[0].frequency
      if (row[0].monitorFrom && row[0].monitorTo)
        this.formData.monitor = [row[0].monitorFrom, row[0].monitorTo]
    }
  }
}
</script>

<style>
</style>
