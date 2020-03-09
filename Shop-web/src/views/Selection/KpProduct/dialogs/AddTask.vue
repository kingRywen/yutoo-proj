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
          placeholder: '多个换行输入',
          required:'asinAndRemark',
          // disabled: true
        }
      ]
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { asin } = this.formData
        let asins = asin.split('\n')
        let asinList = asins.map(el => {
          let s = el.split(/[，,]/)
          return {
            asin: s[0],
            remark: s[1]
          }
        })
        return this.$api[`kpProductSave`]({
          asinList,
          ...this.params
        }).then(() => {
          return Promise.resolve('reset')
        })
      })
    }
  }
}
</script>

<style>
</style>
