<template>
  <yt-form ref="form" label-width="120px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      formData: {
        attrKey: this.params.attrKey
      },
      options: []
    }
  },
  computed: {
    activeFields() {
      return [
        {
          label: '关联亚马逊属性',
          name: 'attrKey',
          filterable: true,
          type: 'select',
          options: this.options,
          span: 24,
          required: true
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const { name, parentName } = this.params
      let params = {
        name,
        parentName
      }
      this.$api[`sameAttrConfigDetailListAttrAmazon`](params)
        .then(data => {
          this.options = data.data.map(el => ({
            label: el.attrKey,
            value: el.attrKey
          }))
        })
        .catch(() => {})
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        const { name, parentName } = this.params
        const params = {
          sellerId: this.sellerId,
          siteId: this.siteId,
          name,
          parentName,
          attrId: this.params.attrId,
          ...this.formData
        }
        return this.$api[`sameAttrConfigDetailUpdate`](params)
      })
    }
  }
}
</script>

<style>
</style>
