<template>
  <div class="w600">
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  props: ['querys', 'closeFn'],
  data() {
    return {
      formSchema: {
        styleName: {
          label: '选择款式',
          widget: 'autocomplete',
          required: true,
          options: () =>
            this.$api[`proPick/categoryDepthTaskMerchantStyleList`](
              this.querys
            ).then(data => data.data.map(el => ({ value: el })))
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`proPick/categoryDepthTaskMerchantSetSameStyle`]({
          styleName: this.value.styleName,
          ...this.querys
        })
      })
    }
  }
}
</script>