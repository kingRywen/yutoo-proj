<template>
  <new-form label-width="120px" ref="form" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
export default {
  props: ['mobile', 'mobileId'],
  data() {
    return {
      formSchema: {
        mobile: {
          label: '手机号码',
          disabled: true,
          required: true
        },
        payMoney: {
          label: '充值金额$',
          min: 0.01,
          widget: 'currency',
          required: true
        },
        validDuration: {
          label: '有效时长（月）',
          min: 1,
          widget: 'number',
          required: true
        }
      },
      value: {
        mobile: this.mobile,
        mobileId: this.mobileId
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`main/mobilePay`](this.value)
      })
    }
  }
}
</script>