<!--  -->
<template>
  <div v-if="$route.name === 'CateAnalysis'">
    <!-- 亚马逊类目分析亚马逊类目分析 -->
    <keep-alive>
      <Analysis ref="site1" />
    </keep-alive>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import Analysis from "./CateAnalysis";
export default {
  components: { Analysis },
  data() {
    return {};
  },

  created() {},
  // mounted() {
  //   this.init()
  // },
  methods: {
    init() {
      // this.$refs.site1.getList();
    this.$store.commit("common/siteId__", 1);
    }
  },
  computed: {},
  // watch: {
  //   sellerData() {
  //     this.$refs.site1.getList();
  //   }
  // }
};
</script>

<style lang='scss' scoped>
</style>
