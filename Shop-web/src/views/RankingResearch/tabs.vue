<template>
    <!-- @tab-click="handleClick" -->
    <div>
        <!-- <Navigation>
            <div slot="breadcrumb" class="breadcrumb">
                <span class="link" @click="routerGo(-1)">自然搜索排名研究</span> / 参品列表/数据分析</div>
            <div slot="back" class="back">
                <i class="el-icon-back" @click="routerGo(-1)">返回</i>
            </div>
        </Navigation> -->
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="产品列表" name="product">
                <product-list :p-task-id="taskId" />
            </el-tab-pane>
            <el-tab-pane label="数据分析" name="data" :lazy='true'>
                <data-analysis ref="setChart" :p-params="pParams" :p-task-id="taskId" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import ProductList from "./ProductList";
import DataAnalysis from "./DataAnalysis";
import Navigation from "../Common/y-template/navigation";
export default {
  components: {
    ProductList,
    DataAnalysis,
    Navigation
  },
  data() {
    return {
      activeName: "product",
      taskId: null,
      pParams: {
        taskId: null,
        createTime: null
      }
    };
  },
  created() {
    this.taskId = this.$route.query.taskId;
    this.pParams.taskId = this.$route.query.taskId;
    this.pParams.createTime = this.$route.query.createTime;
    this.pParams.updateTime = this.$route.query.updateTime;
  },
  methods: {
    //   handleClick(tab, event) {
    //     if(tab.name==='data'){
    //         this.$refs.setChart.initChart()
    //     }
    //   }
    routerGo(num) {
      this.$router.go(num);
    }
  }
};
</script>
<style lang="less" scoped>
.el-tabs {
  -webkit-box-shadow: 0 0 0 0;
  box-shadow: 0 0 0 0;
  /deep/.el-tabs__content {
    padding-left: 0;
    padding-right: 0;
  }
  /deep/.el-tabs__content {
    overflow: inherit;
  }
}
</style>
<style lang="less">
.main-wrapper {
  overflow: inherit !important;
}
</style>




