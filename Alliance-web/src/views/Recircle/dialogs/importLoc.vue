<template>
  <new-form ref="form" label-width="120px" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
export default {
  data() {
    return {
      formSchema: {
        upload: {
          widget: 'upload',
          width: 'full',
          action: 'https://jsonplaceholder.typicode.com/posts/',
          autoUpload: false,
          multiple: false,
          required: true,
          limit: 1,
          limitSize: 1,
          fileLimit: ['excel']
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`main/recycleImportStorage`]({
          file: this.value.upload[0].raw
        })
      })
    }
  }
}
</script>