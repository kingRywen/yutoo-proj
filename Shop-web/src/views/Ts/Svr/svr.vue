<!--  -->
<template>
    <div>
        <chart1 ref="child" />
        <chart2 ref="child2" />
    </div>
</template>

<script>
import chart1 from "./echarts/chart1";
import chart2 from "./echarts/chart2";
export default {
  components: { chart1, chart2 },
  data() {
    return {};
  },

  created() {},
  mounted() {},
  methods: {
    getList() {
      this.$refs.child.showChartChild();
      this.$refs.child2.showChartChild();
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
</style>
