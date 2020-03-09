<template>
  <el-tabs type="card">
    <el-tab-pane label="关键词属性">
      <key-property />
    </el-tab-pane>
    <el-tab-pane label="相关词筛选管理" lazy>
      <key-screen />
    </el-tab-pane>
    <el-tab-pane label="上架相关词设置" lazy>
      <key-related-words />
    </el-tab-pane>
    <el-tab-pane label="广告否定词设置" lazy>
      <key-negate-words />
    </el-tab-pane>
    <el-tab-pane label="介词管理" lazy>
      <key-preposition />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import {
  KeyProperty,
  KeyScreen,
  KeyRelatedWords,
  KeyNegateWords,
  KeyPreposition
} from "./include";
export default {
  components: {
    KeyProperty,
    KeyScreen,
    KeyRelatedWords,
    KeyNegateWords,
    KeyPreposition
  }
};
</script>



