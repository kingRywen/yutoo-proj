<template>
  <new-form label-width="120px" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
export default {
  data() {
    return {
      formSchema: {
        stock: {
          widget: 'number',
          label: '库存',
          min: 1,
          required: true
        }
      },
      value: {}
    }
  },
  methods: {
    _submit() {
      const { platSiteId, productSellerIds } = this.$attrs
      const params = {
        platSiteId,
        productSellerIds,
        quantity: this.value.stock,
        flag: 1
      }
      return this.$api[`product/prProductSellerAmzShelf`](params)
    }
  }
}
</script>