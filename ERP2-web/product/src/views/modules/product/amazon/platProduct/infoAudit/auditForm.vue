<template>
  <div>
    <new-form :form-schema="formSchema" label-width="90px" ref="form" v-model="data" :valid-success.sync="validSuccess"></new-form>
    <el-button style="margin-left: 90px" type="primary" @click="submit">确认审核</el-button>
  </div>
</template>
<script>
export default {
  props: ['platSiteId', 'productRepoId', 'value'],
  data() {
    return {
      validSuccess: false,
      formSchema: {
        flag: {
          label: '审核',
          widget: 'radio',
          options: [
            {
              label: '审核通过',
              value: 1
            },
            {
              label: '审核不通过',
              value: 0
            }
          ],
          required: true
        },
        auditReason: {
          label: '审核原因',
          widget: 'textarea',
          placeholder: '输入原因',
          rows: 20,
          required: false
        }
      },
      data: {
        auditReason: ''
      }
    }
  },
  watch: {
    'data.flag'(val) {
      this.data.auditReason = ''
      this.formSchema.auditReason.required = val != 1
    },
    data: {
      deep: true,
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('update:value', val)
        }
      }
    }
  },
  methods: {
    submit() {
      return this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('form-submit', this.data)
        }
      })
    }
  }
}
</script>