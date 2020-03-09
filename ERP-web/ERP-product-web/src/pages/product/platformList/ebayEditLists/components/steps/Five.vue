<template>
  <business-policy
    ref="business"
    :data="data"
    :review="review"
    @setData="$emit('setData',$event)"
    :parentFlag="parentFlag"
    :platformId="platformId"
    :productPltDetailId="productPltDetailId"
    :productType="productType"
    :productId="productId"
  ></business-policy>
</template>

<script>
import BusinessPolicy from './components/businessPolicy'

export default {
  props: {
    data: {
      default: () => ({})
    },
    // 是否审核状态
    review: {
      default: false
    },
    // 母变体
    parentFlag: Number,
    // 平台id
    productPltDetailId: Number,
    platformId: Number,
    productType: Number,
    productId: Number
  },
  components: {
    BusinessPolicy
  },
  methods: {
    validate() {
      return this.$refs.business.validate()
    },
    save() {}
  }
}
</script>

<style>
</style>
