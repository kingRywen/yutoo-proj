<template>
  <yt-form ref="form" label-width="90px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      formData: {},
      activeFields: [
        {
          label: '产品ASIN',
          name: 'asin',
          span: 24,
          type:'textarea',
          rows:5,
          required:'asin',
          // disabled: true
        },
        {
          label: '监控周期',
          name: 'monitor',
          type: 'dateRange',
          timeDisabled:'before',
          // disabled: true,
          span: 24,
          required: true
        }
      ]
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { asin, monitor } = this.formData
        let asins = this.$.getAsins(asin)
        let [monitorFrom, monitorTo] = monitor
        return this.$api[`productAnalysisSave`]({
          asins,
          monitorFrom,
          monitorTo,
          ...this.params
        }).then(data => {
          return Promise.resolve('reset')
        })
      })
    }
  }
}
</script>

<style>
</style>
