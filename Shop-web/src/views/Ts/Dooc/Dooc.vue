<!--  -->
<template>
  <div>
    <chart ref="child" />
  </div>
</template>

<script>
import chart from "./echarts/chart";
export default {
  components: { chart },
  data() {
    return {};
  },

  created() {},
  mounted() {},
  methods: {
    getList() {
      this.$refs.child.getChartsData();
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
</style>
