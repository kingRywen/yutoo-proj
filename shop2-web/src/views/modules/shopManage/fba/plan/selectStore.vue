<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['options', 'fn'],
  data() {
    return {
      formSchema: {
        storeId: {
          widget: 'select',
          options: this.options,
          label: '店铺'
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          synType: 4,
          storeId: this.value.storeId
        }
        if (this.fn) {
          this.fn(this.value.storeId)
          return Promise.resolve('close')
        }
        return this.$api[`fba/fbaReplenishProductSyn`](params)
      })
    }
  }
}
</script>