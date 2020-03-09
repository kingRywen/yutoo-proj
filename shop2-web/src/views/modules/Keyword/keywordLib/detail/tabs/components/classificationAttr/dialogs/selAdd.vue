<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['query', 'productId'],
  data() {
    return {
      formSchema: {
        classifyId: {
          label: '选择分类属性',
          widget: 'select',
          options: () =>
            this.$api[`keyword/keywordLibClassifyList`]({
              pageSize: 100000,
              pageNumber: 1,
              ...this.storeInfo,
              categoryId: this.query.categoryId
            }).then(data =>
              data.rows.map(e => ({
                label: e.classifyName,
                value: e.classifyId
              }))
            )
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
          categoryId: this.query.categoryId,
          productId: this.productId,
          classifyId: this.value.classifyId
        }
        return this.$api[`keyword/keywordLibClassifySaveByProduct`](params)
      })
    }
  }
}
</script>