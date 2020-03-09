<template>
  <new-form ref="form" class="w600" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['merchantTaskId'],
  data() {
    return {
      formSchema: {
        styleName: {
          label: '选择款式',
          required: true,
          asyncSearch: true,
          widget: 'autocomplete',
          multi: true,
          options: text =>
            this.$api[`proPick/categoryDepthTaskMerchantStyleList`]({
              ...this.storeInfo,
              text,
              merchantTaskId: this.merchantTaskId
            }).then(data => data.data.map(e => ({ label: e, value: e })))
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
          ...this.$attrs,
          ...this.value,
          merchantTaskId: this.merchantTaskId
        }
        return this.$api[`proPick/categoryDepthTaskMerchantSetSameStyle`](
          params
        )
      })
    }
  }
}
</script>