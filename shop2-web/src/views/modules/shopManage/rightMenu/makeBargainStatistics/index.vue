<template>
  <div v-if="$store.state.storeInfo.info.sellerId" class="wrapper">
    <div class="right">
      最早订单同步时间：2019-07-08
      <el-button size="mini" type="primary">同步数据</el-button>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane name="first" label="销量统计">
        <saleStats />
      </el-tab-pane>
      <el-tab-pane name="second" label="客户统计">
        <customerStats />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import saleStats from './saleStats'
import customerStats from './customerStats'
export default {
  components: {
    saleStats,
    customerStats
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  position: relative;
  .right {
    z-index: 3;
    font-size: 13px;
    position: absolute;
    right: 0;
    top: 0;
    button {
      margin-left: 10px;
    }
  }
}
</style>
