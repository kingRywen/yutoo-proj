<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane name="first" label="已筛选关键词" lazy>
      <filtered v-bind="$attrs" />
    </el-tab-pane>
    <el-tab-pane name="second" label="待筛选关键词" lazy>
      <unfilter v-bind="$attrs" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import filtered from './filtered'
import unfilter from './unfilter'
export default {
  components: {
    filtered,
    unfilter
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>