<template>
  <div>
    <new-form label-width="120px" :form-schema="formSchema" v-model="value" :valid-success.sync="validSuccess"></new-form>
    <WidgetCardWrapper title="店铺差异信息" v-if="variantVal.table.length">
      <new-form
        label-width="120px"
        :form-schema="varFormSchema"
        v-model="variantVal"
        :valid-success.sync="validSuccess1"
      ></new-form>
    </WidgetCardWrapper>
    <div class="txc">
      <!-- <ElButton type="primary" :disabled="!isValid">保存</ElButton> -->
      <ElButton type="primary" @click="save" :disabled="!isValid">提交</ElButton>
    </div>
  </div>
</template>
<script>
import { generateSell } from 'Views/modules/product/amazon/utils.js'
export default {
  data() {
    return {
      validSuccess: false,
      validSuccess1: false,
      formSchema: {
        store: {
          widget: 'select',
          multi: true,
          label: '店铺',
          required: true,
          options: []
        },
        asin: {
          label: 'ASIN',
          required: 'asin'
        }
      },
      value: {},
      varFormSchema: {},
      variantVal: {
        table: []
      }
    }
  },
  created() {
    this.getStoreList()
    this.getProps()
  },
  computed: {
    isValid() {
      return this.validSuccess && this.validSuccess1
    }
  },
  methods: {
    getStoreList() {
      this.$api[`product/storeProductListStore`]({
        platSiteId: this.$route.query.platSiteId
      }).then(data => {
        this.formSchema.store.options = data.map(el => ({
          label: el.storeName,
          value: el.storeId
        }))
      })
    },
    getProps() {
      this.$api[`product/storeProductToSellInfo`]({}).then(data => {
        this.varFormSchema = generateSell(data)
        // this.variantVal = _stores
      })
    },
    save() {
      let stores = []
      this.variantVal.table.forEach(el => {
        let propertys = []
        let head = this.varFormSchema.table.head
        for (const key in head) {
          if (head.hasOwnProperty(key)) {
            propertys.push({
              propertyId: +key,
              propertyType: head.propertyType,
              propertyValue: el[key]
            })
          }
        }
        stores.push({
          storeId: el.storeId,
          sellerSku: el[0],
          propertys
        })
      })
      let params = {
        asin: this.value.asin,
        platSiteId: +this.$route.query.platSiteId,
        stores
      }
      this.$api[`product/storeProductAddToSell`](params).then(() => {
        this.$router.push('/product/amazon/storeProduct')
      })
    }
  },
  watch: {
    'value.store'(val) {
      this.variantVal.table = this.formSchema.store.options
        .filter(el => val.indexOf(el.value) > -1)
        .map(el => ({ storeId: el.value, storeName: el.label }))
    }
  }
}
</script>