<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="产品列表" name="product">
      <Product />
    </el-tab-pane>
    <el-tab-pane lazy label="任务列表" name="task">
      <Task />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Product from './product'
import Task from './task'
export default {
  components: {
    Product,
    Task
  },
  data() {
    return {
      activeName: 'product'
    }
  }
}
</script>