<template>
  <new-form ref="form" label-width="80px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['onSuccess', 'editInfo'],
  data() {
    return {
      value: {},
      formSchema: {
        categoryName: {
          required: true,
          label: '词库名称'
        }
      }
    }
  },
  created() {
    if (this.editInfo) {
      this.value = { ...this.editInfo }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = { ...this.storeInfo, ...this.value }
        return this.$api[
          `keyword/${
            this.editInfo
              ? 'keywordLibUpdateCategory'
              : 'keywordLibSaveCategory'
          }`
        ](params).then(() => {
          this.onSuccess()
          return Promise.resolve('close')
        })
      })
    }
  }
}
</script>