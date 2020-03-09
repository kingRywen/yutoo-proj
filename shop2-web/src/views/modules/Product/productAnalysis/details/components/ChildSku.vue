<template>
  <div v-if="!noData">
    <template v-if="!loading">
      <Slider ref="slider" @clickSku="refreshTableChart" :data="data" @setData="hasData = true" />
      <!-- 产品评价数和评分对比 start -->
      <PrContrast :asin="asin" :sku-data="originData" />
      <!-- 产品评价数和评分对比 end -->
      <!-- 历史数据 start -->
      <HistoryData v-if="asin" :asin="asin" />
      <!-- 历史数据 end -->
    </template>
    <div v-else style="min-height:300px" v-loading="loading"></div>
  </div>
  <NonePage v-else noBack />
</template>

<script>
import _chunk from 'lodash/chunk'
import Slider from './ChildSku/Slider'
import PrContrast from './charts/PrContrast'
import HistoryData from './charts/HistoryData'

export default {
  components: {
    Slider,
    PrContrast,
    HistoryData
  },
  data() {
    return {
      asin: null,
      loading: false,
      noData: false,
      data: [],
      originData: []
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
    resetSlider() {
      this.$refs.slider && this.$refs.slider.initSlider()
    },
    // 获取SKu列表
    getSKuData() {
      this.loading = true
      this.$api[`productAnalysis/paVariants`]({
        ...this.storeInfo,
        taskId: this.$route.query.taskId
      })
        .then(data => {
          this.loading = false
          if (!data.data.length) {
            this.noData = true
            return
          }
          this.asin = data.data[0].asin
          let res = data.data
          this.originData = res
          this.data = _chunk(res, 6)
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
