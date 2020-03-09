<template>
  <new-form :form-schema="formSchema" label-width="110px" ref="search" v-model="data"></new-form>
</template>
<script>
export default {
  props:['productPlatIds', 'platSiteId'],
  data() {
    return {
      formSchema: {
        p1: {
          label: '父产品平台SKU',
          widget: 'input',
          required: {
            value: /^[\da-zA-Z-]{4,18}$/,
            errMsg: '请输入4~18数字或字母或-'
          },
          placeholder: '请输入4~18数字或字母或-',
          options: []
        }
      },
      data: {}
    }
  },
  methods: {
    _submit() {
      return this.$router.push({
        path: '/product/amazon/platProduct/copy',
        query: {
          productPlatIds: this.productPlatIds,
          platSku: this.data.p1,
          platSiteId: this.platSiteId
        }
      })
    }
  },
}
</script>