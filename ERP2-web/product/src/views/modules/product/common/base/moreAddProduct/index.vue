<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="下载模板" name="first">
        <First :type="type" />
      </el-tab-pane>
      <el-tab-pane label="上传文件" name="second" lazy>
        <Second />
      </el-tab-pane>
      <el-tab-pane label="导入日志" name="third" lazy>
        <Third />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import First from './components/first'
import Second from './components/second'
import Third from './components/third'
export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
  },
  components: {
    First,
    Third,
    Second
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>