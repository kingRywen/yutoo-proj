<template>
  <CustomExport
    :save-name="saveName"
    ref="cus"
    :platSiteId="platSiteId"
    :storeProduct="storeProduct"
    :productSellerIds="productSellerIds"
    :loadData="loadData"
  />
</template>
<script>
import CustomExport from './customExport'
export default {
  props: [
    'saveName',
    'platSiteId',
    'productPlatIds',
    'productSellerIds',
    'storeProduct'
  ],
  components: {
    CustomExport
  },
  methods: {
    loadData() {
      let params = {
        productPlatIds: this.productPlatIds,
        platSiteId: this.platSiteId
      }
      if (this.storeProduct) {
        delete params.productPlatIds
        params.productSellerIds = this.productSellerIds
      }
      return this.$api[
        `product/${
          this.storeProduct
            ? 'storeProductCustomPropertys'
            : 'platProductCustomPropertys'
        }`
      ](params).then(data => {
        return data.rows.map(el => ({
          label: el.propertyName,
          value: el.propertyId,
          propertyType: el.propertyType
        }))
      })
    },
    _submit() {
      let params = {
        productPlatIds: this.productPlatIds,
        platSiteId: this.platSiteId,
        propertys: this.$refs.cus.selectData
      }
      if (this.storeProduct) {
        delete params.productPlatIds
        params.productSellerIds = this.productSellerIds
      }
      return this.$api[
        `product/${
          this.storeProduct ? 'storeProductExport' : 'platProductExport'
        }`
      ](params).then(() => {
        return 'close'
      })
    }
  }
}
</script>