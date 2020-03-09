<template>
  <el-tabs type="border-card" class="product_box">
    <el-tab-pane lazy>
      <span slot="label">
        亚马逊</span>
      <app-main :platform="1" />
    </el-tab-pane>
    <!-- <el-tab-pane label="eabay" lazy>
      <app-main :platform="2" />
    </el-tab-pane>
    <el-tab-pane label="速卖通" lazy>
      <app-main :platform="3" />
    </el-tab-pane>
    <el-tab-pane label="wish" lazy>
      <app-main :platform="4" />
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
import AppMain from "./appMain";
export default {
  components: {
    AppMain
  }
};
</script>

<style scoped>
body {
  padding: 0;
  background-color: none !important;
}
</style>
