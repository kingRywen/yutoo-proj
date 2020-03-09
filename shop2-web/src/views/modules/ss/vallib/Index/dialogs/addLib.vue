<template>
  <new-form class="w600" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
</template>
<script>
export default {
  props: ['asins', 'srcSiteId', 'type'],
  data() {
    return {
      formSchema: {
        targetSiteId: {
          widget: 'select',
          required: true,
          label: '站点',
          options: this.$store.getters['storeInfo/currentPlat'].sites.filter(
            e => e.siteId !== this.srcSiteId
          )
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          platformId: this.storeInfo.platformId,
          asins: this.asins,
          srcSiteId: this.srcSiteId,
          targetSiteId: this.value.targetSiteId,
          type: this.type
        }
        return this.$api[`ss/sellingAddToMaybe`](params)
      })
    }
  }
}
</script>