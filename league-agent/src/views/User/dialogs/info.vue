<template>
  <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['info'],
  data() {
    return {
      formSchema: {
        email: {
          label: '邮箱',
          disabled: true
        },
        mobile: {
          required: 'tel',
          maxlength: 20,
          label: '手机号码'
        }
      },
      value: this.info
    }
  },
  methods: {
    _submit() {
      return this.$refs.form
        .validate()
        .then(() => this.$api[`agent/merchantUpdateMobile`](this.value))
    }
  }
}
</script>