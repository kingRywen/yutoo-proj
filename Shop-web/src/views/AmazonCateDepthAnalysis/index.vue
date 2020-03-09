<!--  -->
<template>
  <div>
    <!-- <el-tabs type="card" v-model="activeName" @tab-click="change">
      <el-tab-pane label="沙特站" name="10">
        <DepthAnalysis ref="site1" />
      </el-tab-pane>
      <el-tab-pane label="阿联酋站" name="11">
        <DepthAnalysis ref="site2" />
      </el-tab-pane>
    </el-tabs> -->
    <DepthAnalysis ref="site1" />
  </div>
</template>

<script>
import DepthAnalysis from "./CateDepthAnalysis";
export default {
  components: { DepthAnalysis },
  data() {
    return {};
  },

  created() {},
  mounted() {
    this.$refs.site1.getList();
    this.$store.commit("common/siteId__", 1);
  },
  methods: {},
  computed: {},
  watch: {
    sellerData() {
      this.$refs.site1.getList();
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
