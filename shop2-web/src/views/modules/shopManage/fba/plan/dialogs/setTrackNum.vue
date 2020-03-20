<template>
  <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['shippingId', 'storeId'],
  data() {
    return {
      formSchema: {
        trackingNumber: {
          placeholder: '请输入运单号，一行一个',
          widget: 'textarea',
          rows: 15,
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
          shippingId: this.shippingId,
          storeId: this.storeId,
          trackingNumber: this.value.trackingNumber
            .split('\n')
            .map(e => e.trim())
            .join(',')
        }
        return this.$api[`fba/FbaReplenishShippingSetTrackingNumber`](params)
      })
    }
  }
}
</script>