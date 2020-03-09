<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['categoryId', 'rootIds'],
  data() {
    return {
      formSchema: {
        rootType: {
          label: '无效类型',
          required: true,
          widget: 'select',
          options: this.$const['KEYWORD/invalidTypeOp']
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.value,
          ...this.storeInfo,
          categoryId: this.categoryId,
          rootIds: this.rootIds
        }
        return this.$api[`keyword/keywordLibRootUpdate`](params)
      })
    }
  }
}
</script>