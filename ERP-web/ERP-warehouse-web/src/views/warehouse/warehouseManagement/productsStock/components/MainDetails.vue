<template>
  <!-- 查看详情 -->
  <div style="height:460px">
    <el-tabs
      style="height:100%"
      class="noShadow"
      type="border-card"
      tab-position="left"
      v-model="activeName"
      @tab-click="handleTabClick"
    >
      <el-tab-pane name="first">
        <span slot="label">基本信息</span>
        <BaseInfo :params="params" ref="BaseInfo"/>
      </el-tab-pane>
      <el-tab-pane name="second" lazy>
        <span slot="label">日志</span>
        <Logs :params="params" ref="Logs"/>
      </el-tab-pane>
      <el-tab-pane name="third" label="入库记录" lazy>
        <StorageRecord :params="params" ref="StorageRecord"/>
      </el-tab-pane>
      <el-tab-pane name="fourth" label="出库记录" lazy>
        <StockoutRecord :params="params" ref="StockoutRecord"/>
      </el-tab-pane>
      <el-tab-pane name="fifth" label="入库采购价" lazy>
        <WarehousingPurchasePrz :params="params" ref="WarehousingPurchasePrz"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseInfo from './MainDetails/BaseInfo.vue'
export default {
  inheritAttrs: false,
  components: {
    BaseInfo,
    Logs: () => import('./MainDetails/Logs.vue'),
    StockoutRecord: () => import('./MainDetails/StockoutRecord.vue'),
    StorageRecord: () => import('./MainDetails/StorageRecord.vue'),
    WarehousingPurchasePrz: () =>
      import('./MainDetails/WarehousingPurchasePrz.vue')
  },
  data() {
    return {
      activeName: 'first',
      params: {}
    }
  },
  methods: {
    _initData() {
      let { data } = this.$attrs
      this.params = {
        productId: data.productId,
        productType: data._level === 1 ? 3 : 1
      }
      this.$nextTick(async () => {
        this.$refs.BaseInfo.initData()
      })
    },
    _close() {
      this.activeName = 'first'
    },
    handleTabClick(tab) {
      this.$nextTick(() => {
        let child = tab.$children[0]
        if (child.initData) {
          child.initData()
        }
      })
    }
  }
}
</script>

<style>
</style>
