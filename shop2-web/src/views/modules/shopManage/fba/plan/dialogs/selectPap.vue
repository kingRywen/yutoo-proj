<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
import { downloadFile } from 'Utils'
export default {
  props: ['pages', 'api', 'params'],
  data() {
    let formSchema = {
      pageType: {
        required: true,
        widget: 'select',
        placeholder: '请选择纸张',
        options: this.pages.map(e => ({ label: e, value: e }))
      }
    }
    if (this.api === 'fbaShipmentCreateLabelPallet') {
      formSchema.palletCount = {
        required: true,
        widget: 'number',
        placeholder: '请输入托盘数量'
      }
    }
    return {
      formSchema,
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[`fba/${this.api}`]({
          ...this.params,
          ...this.value
        }).then(data => {
          downloadFile(data)
          return Promise.resolve('close')
        })
      })
    }
  }
}
</script>