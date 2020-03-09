<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['row'],
  data() {
    return {
      formSchema: {
        chineseName: {
          label: '币种名称',
          disabled: true
        },
        currency: {
          disabled: true,
          label: '币种代码'
        },
        symbol: {
          disabled: true,
          label: '币种符号'
        },
        exchangeRate: {
          label: '美元汇率',
          required: true
        }
      },
      value: {
        ...this.row
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.storeInfo,
          siteId: this.value.siteId,
          exchangeRate: this.value.exchangeRate
        }
        return this.$api[`ss/sellingRateUpdate`](params)
      })
    }
  }
}
</script>