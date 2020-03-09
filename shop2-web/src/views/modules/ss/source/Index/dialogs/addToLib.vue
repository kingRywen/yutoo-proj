<template>
  <new-form ref="form" class="w600" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['asins', 'curSiteId', 'type'],
  data() {
    return {
      formSchema: {
        targetSiteId: {
          widget: 'select',
          label: '站点',
          bind: {
            label: 'siteName',
            value: 'siteId'
          },
          options: this.$store.getters['storeInfo/currentPlat'].sites,
          required: true
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          asins: this.asins,
          type: this.type,
          platformId: this.storeInfo.platformId,
          srcSiteId: this.curSiteId,
          ...this.value
        }
        return this.$api[`ss/sellingAddToMaybe`](params)
      })
    }
  }
}
</script>