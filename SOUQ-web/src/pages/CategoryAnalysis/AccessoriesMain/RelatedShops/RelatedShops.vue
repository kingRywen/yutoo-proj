<template>
  <!-- <el-tabs lazy v-model="activeName">
    <el-tab-pane label="所有店铺" name="a">
      <transition name="fade" mode="out-in">
      <router-view name="d"></router-view></transition>
    </el-tab-pane>
    <el-tab-pane label="热销店铺" name="b">
      <transition name="fade" mode="out-in">
      <router-view name="d"></router-view></transition>
    </el-tab-pane>
    <el-tab-pane label="飙升店铺" name="c">
      <transition name="fade" mode="out-in">
      <router-view name="d"></router-view></transition>
    </el-tab-pane>
  </el-tabs> -->
  <el-tabs lazy v-model="activeName">
    <el-tab-pane label="所有店铺" name="a">

      <transition name="fade" mode="out-in">
        <keep-alive>
          <ShopList key="a" v-if="activeName ==='a'" />
        </keep-alive>
      </transition>

    </el-tab-pane>
    <el-tab-pane label="热销店铺" name="b">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <ShopList :type="1" key="b" v-if="activeName ==='b'" />
        </keep-alive>
      </transition>
    </el-tab-pane>
    <el-tab-pane label="飙升店铺" name="c">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <ShopList :type="2" key="c" v-if="activeName ==='c'" />
        </keep-alive>
      </transition>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
const ShopList = () => import("@/pages/ShopAnalysis/Children/ShopList");
export default {
  components: {
    ShopList
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
