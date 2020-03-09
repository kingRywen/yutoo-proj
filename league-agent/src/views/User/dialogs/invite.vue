<template>
  <div>
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
    <div style="opacity: 0.6;margin-left:120px">（邀请信息将直接发送至被邀请人邮箱中）</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formSchema: {
        email: { maxlength: 50, label: '被邀请人邮箱', required: 'email' }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`agent/merchantInvite`](this.value)
      })
    }
  }
}
</script>