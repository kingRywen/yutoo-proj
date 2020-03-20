<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['options', 'data'],
  data() {
    return {
      formSchema: {
        value: {
          widget: 'select',
          label: '运输方式',
          required: true,
          options: this.options
        }
      },
      value: {
        value: null
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$router.push({
          path: '/shopManage/fba/rep',
          query: {
            data: this.data.map(e => e.storeId + '_-_' + e.sellerSku),
            transportId: this.value.value,
            transportLabel: this.options.find(e => e.value == this.value.value)
              .label
          }
        })
      })
    }
  }
}
</script>