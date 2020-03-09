<template>
  <div>
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  props: ['orderNumbers', 'ways', 'edit'],
  data() {
    return {
      formSchema: {
        table: {
          // rowKey: 'sku',
          type: 'table',
          label: 'table',
          batch: false,
          width: 'auto',
          head: {
            orderNumber: {
              widget: 'text',
              label: '订单号',
              noLabel: true
            },
            trankingNumber: {
              widget: 'input',
              label: '运单号',
              required: true,
              noLabel: true
            },
            shippingWay: {
              widget: 'select',
              options: this.ways,
              label: '运输方式',
              required: true,
              noLabel: true
            }
          }
        }
      },
      value: {
        table: this.orderNumbers.map(e => ({
          orderNumber: e.orderNumber,
          trankingNumber: e.trankingNumber || '',
          shippingWay: e.shippingWay || null
        }))
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = { data: this.value.table }
        return this.$api[
          `fba/${
            this.edit
              ? 'fbmOrderInfoUpdateTrackingNumber'
              : 'FbmOrderInfoBatchSend'
          }`
        ](params)
      })
    }
  }
}
</script>