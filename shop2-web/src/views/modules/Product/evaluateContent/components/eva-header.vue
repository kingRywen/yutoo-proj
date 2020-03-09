<template>
  <el-tabs type="card" @tab-click="handleClick" :value="activeName">
    <el-tab-pane label="评价库" name="first"></el-tab-pane>
    <el-tab-pane label="QA库" name="second"></el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  props: ['activeName'],
  methods: {
    handleClick(tab) {
      if (tab.name !== this.activeName) {
        this.$router.push({
          path:
            this.activeName !== 'first'
              ? '/product/evaluateContent/rep'
              : '/product/evaluateContent/qa',
          query: this.$route.query
        })
      }
    }
  }
}
</script>