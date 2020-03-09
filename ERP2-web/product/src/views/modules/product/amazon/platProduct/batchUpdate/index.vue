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
    // 导入入口， 1为仓库产品 2为平台产品 3为店铺产品
    type: {
      type: Number,
      default: 2
    },
    // platId: {
    //   type: Number,
    //   default: 1 // 1 亚马逊
    // }
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