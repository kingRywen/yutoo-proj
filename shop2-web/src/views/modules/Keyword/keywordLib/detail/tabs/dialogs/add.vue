<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template><script>
export default {
  props: ['categoryId'],
  deactivated() {},
  data() {
    return {
      formSchema: {
        productName: {
          label: '产品名称',
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
          productName: this.value.productName
        }
        return this.$api[`keyword/keywordLibSaveProduct`](params)
      })
    }
  }
}
</script>