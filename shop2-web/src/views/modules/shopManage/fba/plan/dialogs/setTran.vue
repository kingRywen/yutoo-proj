<template>
  <new-form ref="form" class="w600" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {
      formSchema: {
        transportId: {
          label: '选择运输方式',
          widget: 'select',
          required: true,
          options: []
        },
        sendTime: {
          label: '发送时间',
          required: true,
          width: '100%',
          widget: 'date'
        },
        earliestDeliveryDate: {
          label: '最早到货时间',
          width: '100%',
          required: true,
          widget: 'date'
        }
      },
      value: {}
    }
  },
  created() {
    this.$store.dispatch('fba/getTransportList').then(data => {
      this.formSchema.transportId.options = data
    })
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        const params = { data: this.data, ...this.value }
        return this.$api[`fba/FbaReplenishShippingSetTransport`](params)
      })
    }
  }
}
</script>