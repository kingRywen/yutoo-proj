<template>
  <new-form ref="form" class="w600" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {
      formSchema: {
        num: {
          placeholder: '请输入批次号',
          required: true
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        const params = {
          data: this.data.map(el => ({ ...el, batchNumber: this.value.num }))
        }
        return this.$api[`fba/FbaReplenishShippingSetBatchNumber`](params)
      })
    }
  }
}
</script>