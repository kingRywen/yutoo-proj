<template>
  <new-form class="w30p" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['keywordTexts', 'categoryId', 'close'],
  data() {
    return {
      formSchema: {
        classifyName: {
          label: '名称',
          required: true
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.storeInfo,
          categoryId: this.categoryId,
          classifyName: this.value.classifyName,
          keywordTexts: this.keywordTexts
        }
        return this.$api[`keyword/keywordLibClassifySave`](params).then(() => {
          this.close()
          return Promise.resolve('close')
        })
      })
    }
  }
}
</script>