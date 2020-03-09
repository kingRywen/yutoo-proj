<template>
  <new-form :form-schema="formSchema" label-width="90px" ref="form" v-model="data"></new-form>
</template>
<script>
export default {
  props: ['platSiteId','productRepoId'],
  data() {
    return {
      formSchema:{
        returnStatus:{
          label: '打回阶段',
          widget: 'checkbox',
          options: [
            {
              label: '基础信息',
              value: 1
            },
            {
              label: '采购',
              value: 2
            }
          ],
          required: true
        },
        returnReason:{
          label: '',
          widget: 'textarea',
          placeholder: '输入原因',
          rows: 10,
          required: true
        },
      },
      data:{}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          platSiteId: this.platSiteId,
          productRepoIds:[this.productRepoId],
          returnStatus: this.data.returnStatus.length == 2 ? 3 : this.data.returnStatus[0],
          returnReason: this.data.returnReason
        }
        return this.$api[`product/prProductPlatAmzReturnRepo`](params)
      })
    }
  },
}
</script>