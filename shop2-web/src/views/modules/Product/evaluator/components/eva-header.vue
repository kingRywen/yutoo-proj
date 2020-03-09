<template>
  <el-tabs type="card" @tab-click="handleClick" :value="activeName">
    <el-tab-pane label="评价者列表" name="first"></el-tab-pane>
    <el-tab-pane label="数据分析" name="second"></el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  props: ['activeName'],
  model: {
    prop: 'activeName',
    event: 'change'
  },
  methods: {
    handleClick(tab) {
      if (tab.name !== this.activeName) {
        this.$emit('change', tab.name)
      }
      // if (tab.name !== this.activeName) {
      //   this.$router.push({
      //     path:
      //       this.activeName !== 'first'
      //         ? '/product/evaluator/list'
      //         : '/product/evaluator/analysis',
      //     query: this.$route.query
      //   })
      // }
    }
  }
}
</script>