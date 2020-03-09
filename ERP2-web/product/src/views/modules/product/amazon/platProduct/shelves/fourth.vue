<template>
  <div>
    <WidgetCardWrapper v-if="params.saleType == 1" :defaultHide="false" title="店铺差异信息">
      <new-form
        :showMessage="false"
        ref="form"
        :is-dirty.sync="isDirty"
        :valid-success.sync="validSuccess"
        v-model="storeDiffs"
        label-width="100px"
        :form-schema="storeSchema"
      ></new-form>
    </WidgetCardWrapper>
    <WidgetCardWrapper :defaultHide="false" title="店铺变体差异信息">
      <new-form
        :showMessage="false"
        ref="form"
        :is-dirty.sync="isDirty1"
        :valid-success.sync="validSuccess1"
        v-model="variantDiffs"
        label-width="100px"
        :form-schema="varSchema"
      ></new-form>
    </WidgetCardWrapper>
  </div>
</template>
<script>
import { generateUploadDiffs, getStores } from '../../utils'
export default {
  props: ['params'],
  data() {
    return {
      storeDiffs: {
        table: []
      },
      variantDiffs: {
        table: []
      },
      storeSchema: {},
      varSchema: {},
      isDirty: false,
      isDirty1: false,
      validSuccess: false,
      validSuccess1: false
    }
  },
  methods: {
    init(stores) {
      const { productPlatId, platSiteId } = this.params
      const params = { productPlatId, platSiteId }
      // function getStores(storeDif = true) {
      //   let ret = [],
      //     _stores = stores.map(info => {
      //       return {
      //         storeId: info.storeId,
      //         storeName: info.storeName
      //       }
      //     })
      //   if (storeDif) {
      //     return _stores
      //   } else {
      //     stores[0].platSkus.forEach(el => {
      //       _stores.forEach((store, index) => {
      //         ret.push({
      //           rowKey: store.storeId + el.platSku + index,
      //           storeId: store.storeId,
      //           storeName: store.storeName,
      //           length: index == 0 ? _stores.length : undefined,
      //           ...el
      //         })
      //       })
      //     })
      //     return ret
      //   }
      // }
      this.$api[`product/platProductDifferenceProperty`](params).then(data => {
        const { varSchema, storeSchema } = generateUploadDiffs(
          data,
          this.params.saleType
        )

        this.varSchema = varSchema
        this.storeSchema = storeSchema
        setTimeout(() => {
          this.storeDiffs.table = getStores(stores)
          this.variantDiffs.table = getStores(stores, false)
        }, 0)
      })
    }
  },
  computed: {
    validSu() {
      return this.validSuccess && this.validSuccess1
    }
  },
  watch: {
    validSu(val) {
      this.$emit('update:validSuccess', val)
    }
  }
}
</script>