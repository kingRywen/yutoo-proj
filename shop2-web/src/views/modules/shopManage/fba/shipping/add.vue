<template>
  <new-form class="w30p" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['transportInfo'],
  data() {
    return {
      formSchema: {
        transportName: {
          label: '名称',
          required: true
        },
        transportType: {
          label: '运输类型',
          required: true,
          widget: 'select',
          options: this.$const['FBA/tranType']
        },
        shippingDays: {
          label: '运输天数',
          required: true,
          widget: 'number'
        }
      },
      value:
        {
          ...this.transportInfo
          // transportType: this.$const['FBA/tranType'].find(
          //   e => e.value == this.transportInfo.transportType
          // ).value
        } || {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[
          `fba/${
            this.transportInfo
              ? 'FbaReplenishTransportEdit'
              : 'FbaReplenishTransportAnd'
          }`
        ](this.value)
      })
    }
  }
}
</script>