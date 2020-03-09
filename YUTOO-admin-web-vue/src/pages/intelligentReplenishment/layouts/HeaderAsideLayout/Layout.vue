<template>
  <div class="app-wrapper">
    <app-main></app-main>
    <!-- <side-bar class="sidebar-container"></side-bar>
    <div class="main-container">
      <nav-bar></nav-bar>


        <el-breadcrumb separator-class="el-icon-arrow-right" class="separatorNav">
            <template v-for="item in separatorList">
                <el-breadcrumb-item :to="{ path: item.url }">{{item.name}}</el-breadcrumb-item>
            </template>
        </el-breadcrumb>



      <app-main></app-main>
    </div> -->
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from "./components";
import { mapState } from "vuex";

export default {
  name: "layout",
  components: {
    NavBar,
    SideBar,
    AppMain
  },
  computed: {
    ...mapState(["separatorList"])
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.main-container {
  position: fixed;
  left: 256px;
  right: 0;
  bottom: 0;
  top: 0;
  transition: margin-left 0.28s;
  background-color: #f0f2f5;
  .separatorNav {
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
  }
}
</style>
