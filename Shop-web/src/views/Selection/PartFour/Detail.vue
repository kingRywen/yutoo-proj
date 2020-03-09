<template>
  <div class="partfour-detail">
    <el-tabs type="card" class="noshadow" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="产品分析" name="first">
        <ProductAnalysis/>
      </el-tab-pane>
      <el-tab-pane label="子SKU" name="second" lazy>
        <ChildSku ref="sku"/>
      </el-tab-pane>
      <el-tab-pane label="有效关键词分析" name="third" lazy>
        <EffectiveKeywordAnalysis/>
      </el-tab-pane>
    </el-tabs>
    <!-- <ElButton type="text" class="back" @click="handleBack" icon="el-icon-back">返回</ElButton> -->
  </div>
</template>

<script>
export default {
  components: {
    ProductAnalysis: () => import('./components/ProductAnalysis.vue'),
    ChildSku: () => import('./components/ChildSku.vue'),
    EffectiveKeywordAnalysis: () =>
      import('./components/EffectiveKeywordAnalysis.vue')
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleBack() {
      // 
      this.$router.push({name: this.$route.matched[1].name})
    },
    tabClick(tab) {
      if (tab.name === 'second') {
        // debugger
        let skuVm = this.$refs.sku
        if (skuVm) {
          this.$nextTick(() => {
            skuVm.resetSlider()
          })
          
        }
      }
    }
  },
}
</script>

<style lang="scss">
.partfour-detail {
  position: relative;
  .back {
    position: absolute;
    top: 0;
    right: 0;
    padding: 13px;
  }
}
</style>
