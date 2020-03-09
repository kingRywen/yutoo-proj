<template>
  <div class="w600">
    <new-form ref="form" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formSchema: {
        classifyName: {
          placeholder: '请输入名称',
          required: true
        }
      },
      value: {
        classifyName: this.$attrs.classifyName
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`keyword/keywordLibClassifyUpdate`]({
          ...this.$attrs,
          ...this.storeInfo,
          ...this.value
        })
      })
    }
  }
}
</script>