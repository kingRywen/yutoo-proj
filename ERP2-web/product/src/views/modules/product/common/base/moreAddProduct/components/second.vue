<template>
  <div>
    <new-form
      :fileLoading.sync="fileLoading"
      class="mt20"
      ref="form"
      v-model="formData"
      label-width="100px"
      :form-schema="dataFormSchema"
    ></new-form>
    <ElButton style="margin-left: 100px" type="primary" @click="submit" :loading="fileLoading">确认上传</ElButton>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileLoading: false,
      formData: { type: 1 },
      dataFormSchema: {
        upload: {
          widget: 'upload',
          label: '上传文件',
          action: 'https://jsonplaceholder.typicode.com/posts/',
          required: true,
          limitSize: 100,
          fileLimit: 'all'
        },
        type: {
          label: '处理文件格式',
          widget: 'radio',
          options: [
            {
              label: 'Text',
              value: 1
            },
            {
              label: 'Excle',
              value: 2
            }
          ]
        }
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
        }
      })
    }
  }
}
</script>