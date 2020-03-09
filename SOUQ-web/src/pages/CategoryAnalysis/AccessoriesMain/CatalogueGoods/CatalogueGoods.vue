<template>
  <el-tabs lazy v-model="activeName">
    <el-tab-pane label="所有产品" name="a">

      <transition name="fade" mode="out-in">
        <keep-alive>
          <ProductList key="a" v-if="activeName ==='a'" />
        </keep-alive>
      </transition>

    </el-tab-pane>
    <el-tab-pane label="热销产品" name="b">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <ProductList :type="1" key="b" v-if="activeName ==='b'" />
        </keep-alive>
      </transition>
    </el-tab-pane>
    <el-tab-pane label="飙升产品" name="c">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <ProductList :type="2" key="c" v-if="activeName ==='c'" />
        </keep-alive>
      </transition>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
const ProductList = () =>
  import("@/pages/ProductAnalysis/Children/ProductList");
export default {
  components: {
    ProductList
  },
  data() {
    return {
      activeName: "a"
    };
  }
};
</script>

<style>
</style>
