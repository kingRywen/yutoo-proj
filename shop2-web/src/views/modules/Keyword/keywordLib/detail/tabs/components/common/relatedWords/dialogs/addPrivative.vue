<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['query'],
  data() {
    return {
      formSchema: {
        movedKeywordType: {
          label: '否定类型',
          required: true,
          widget: 'select',
          options: this.$const['KEYWORD/negativeTypeOpts']
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = { ...this.query, ...this.value }
        return this.$api[`keyword/keywordLibMoveKeyword`](params)
      })
    }
  }
}
</script>