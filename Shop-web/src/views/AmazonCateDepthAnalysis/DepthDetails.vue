<!--  -->
<template>
  <div>
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="卖家分析" name="sellerAnalysis">
        <sellerAnalysis ref="sellerAnalysis" />
      </el-tab-pane>
      <el-tab-pane label="产品分析" name="productAnalysis">
        <productAnalysis ref="productAnalysis" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import productAnalysis from "./DepthDetails/productAnalysis";
import sellerAnalysis from "./DepthDetails/sellerAnalysis";
export default {
  components: { productAnalysis, sellerAnalysis },
  data() {
    return {
      activeName: "sellerAnalysis"
    };
  },

  created() {},
  mounted() {
    this.$refs.sellerAnalysis.getList();
  },
  methods: {},
  computed: {},
  watch: {
    // sellerData() {
    //   let n = this.activeName;
    //   if (n === "sellerAnalysis") {
    //     this.$refs.sellerAnalysis.getList();
    //   } else if (n === "productAnalysis") {
    //     this.$refs.productAnalysis.getList();
    //   }
    // },
    activeName(n) {
      if (n === "sellerAnalysis") {
        this.$refs.sellerAnalysis.getList();
        this.$refs.sellerAnalysis.clearSortable();
      } else if (n === "productAnalysis") {
        this.$refs.productAnalysis.getList();
        this.$refs.productAnalysis.clearSortable();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
