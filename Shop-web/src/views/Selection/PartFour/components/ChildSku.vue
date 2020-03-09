<template>
  <div v-if="!noData">
    <template v-if="!loading">
      <Slider ref="slider" @clickSku="refreshTableChart" :data="data" @changeAsin="changeAsin" @setData="hasData = true"/>
      <BSRChange v-if="asin" :asin="asin"/>
      <PriceChange v-if="asin" :asin="asin"/>
      <DeliveryMethod v-if="asin" :asin="asin"/>
      <ShoppingCart v-if="asin" :asin="asin"/>
      <Inventory v-if="asin" :asin="asin"/>
    </template>
    <div v-else style="min-height:300px" v-loading="loading"></div>
  </div>
  <NonePage v-else/>
</template>

<script>
import _chunk from 'lodash/chunk'
import Slider from './ChildSku/Slider'
import BSRChange from '../charts/BSRChange'
import PriceChange from '../charts/PriceChange'
import DeliveryMethod from '../charts/DeliveryMethod'
import ShoppingCart from '../charts/ShoppingCart'
import Inventory from '../charts/Inventory'
export default {
  components: {
    Slider,
    PriceChange,
    DeliveryMethod,
    ShoppingCart,
    Inventory,
    BSRChange
  },
  data() {
    return {
      asin: null,
      loading: false,
      noData: false,
      data: []
    }
  },
  created() {
    this.getSKuData()
  },
  methods: {
    refreshTableChart(sku) {
      // console.log(sku)
      this.asin = sku.asin || this.$route.query.asin
    },
    changeAsin(asin) {
      this.asin = asin
    },
    resetSlider() {
      this.$refs.slider.initSlider()
    },
    // 获取SKu列表
    getSKuData() {
      this.loading = true
      this.$api[`bigProductSkuList`]({ taskId: this.$route.query.taskId })
        .then(data => {
          this.loading = false
          if (!data.data.length) {
            this.noData = true
            return
          }
          // this.$emit('changeAsin', data.data[0].asin)
          // this.$emit('setData')
          // this.changeAsin(data.data[0].asin)
          this.asin = data.data[0].asin
          // this.
          // this.focusIndex = [0, 0]
          let res = data.data.map(el => {
            let skuAttrList = el.skuAttrList
            let i = skuAttrList.find(
              el => el.attrName === 'color_name' || el.attrName === 'color'
            )
            return Object.assign(el, { color: i ? i.attrValue : '-' })
          })
          this.data = _chunk(res, 6)
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
