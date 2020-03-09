<template>
  <div>
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  props: ['data', 'edit'],
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
            orderPrice: {
              widget: 'text',
              label: '订单金额（$）',
              noLabel: true
            },
            returnPrice: {
              widget: 'currency',
              label: '退款金额（$）',
              required: true,
              noLabel: true
            }
          }
        }
      },
      value: {
        table: this.data
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = { data: this.value.table }
        return this.$api[`fba/FbmOrderInfoRefund`](params)
      })
    }
  }
}
</script>