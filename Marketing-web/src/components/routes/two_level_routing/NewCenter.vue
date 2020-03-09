<template>
  <div style="height:100%">
    <div id="app">
      <el-container>
        <el-header style="height:65px">
          <Header :lists='menusScync'></Header>
        </el-header>
        <el-container>
          <el-main style="padding: 0 !important">
            <div class="newStyle_wrapper">
              <router-view class="newStyle"></router-view>
            </div>

          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>

</template>
<script>
import Header from "../../layout/header";
/* eslint-disable */
import { mapState } from "vuex";
export default {
  components: {
    Header
  },
  name: "newCenter",
  data() {
    return {
      menusScync: [
        {
          iconPath: escape("&#xe8b9;"),
          name: "首页",
          iconActivePath: "",
          url: ""
        },
        {
          iconPath: escape("&#xe8a2;"),
          name: "平台",
          iconActivePath: "",
          url: ""
        },
        {
          iconPath: escape("&#xe890;"),
          name: "账号充值",
          iconActivePath: "",
          url: ""
        }
      ]
    };
  }
};
</script>
<style lang="scss">
.newStyle_wrapper {
  height: 100%;
  background: #f4f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.newStyle {
  width: 560px;
  padding: 65px;
  background: #fff;
  transform: translateY(-60px);
}
.el-container {
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
}
.el-header {
  background-color: #404040;
  /* background: linear-gradient(to right, #396afc, #2948ff); */
  color: rgba(255, 255, 255, 0.7);
  line-height: 60px;
  text-align: right;
  font-size: 14px;
}
.el-aside {
  color: #333;
}
.toPreRouter {
  font-size: 14px;
  top: 5px;
  color: #606266;
  padding: 10px 10px 5px 0px;
  position: relative;
  /* top: 98px; */
  /* left: 0px; */
  /* z-index: 500; */
  width: 100%;
  height: 20px;
  background: #fff;
}
.toPreRouter span {
  position: relative;
  top: -6px;
  cursor: pointer;
  padding: 10px 10px 10px 0px;
}
.toPreRouter span:hover {
  color: #00c0de;
}
.breadcrumb_wrapper {
  flex: none;
  display: flex;
  align-items: center;
  padding: 6px;
  // flex: auto;
  justify-content: space-between;
  ._row {
    line-height: 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>