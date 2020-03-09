<!-- 首页 -->
<template>
    <div>
        <el-container>
            <el-header style="height:65px">
                <Header activedIndex="0"></Header>
            </el-header>
            <span style="font-size:50px">首页</span>
        </el-container>
    </div>
</template>

<script>
import Header from "./layout/header";
export default {
  components: { Header },
  data() {
    return {};
  },

  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.el-header {
  background-color: #404040;
  /* background: linear-gradient(to right, #396afc, #2948ff); */
  color: rgba(255, 255, 255, 0.7);
  line-height: 65px;
  text-align: right;
  font-size: 14px;
}
</style>
