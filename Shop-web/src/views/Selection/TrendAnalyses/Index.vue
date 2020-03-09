<template>
  <div>
      <el-tabs type="card"  v-model="activeName" v-if='$route.name==="trendAnalyses"'>
        <el-tab-pane label="店铺趋势分析" name="first" :lazy='true'>
            <store-comp />
        </el-tab-pane>
        <el-tab-pane label="产品趋势分析" name="second" :lazy='true'>
            <product-comp />
        </el-tab-pane>
      </el-tabs>
      <router-view></router-view>
  </div>
</template>
<script>
import storeComp from './storeTrendAnalysis';
import ProductComp from './productTrendAnalysis';
export default {
  data() {
        return {
            activeName:"first"
        };
    },
    methods: {

    },
    created() {

    },
    components:{
      storeComp,
      ProductComp
    }

}
</script>

<style scoped lang="less">
.el-tabs {
  box-shadow: 0 0 0 0;
  /deep/.el-tabs__content {
    padding: 15px 0 0 0;
  }
}
</style>
