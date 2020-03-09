<template>
  <div id="app">
    <el-container>
      <el-header style="height:80px">
        <Header :lists='menusScync'></Header>
      </el-header>
      <el-container>
        <SiderBar></SiderBar>
        <el-main style="padding:30px">
          <!-- <span>当前位置：</span>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in $store.state.common.breadList" :to="item.path">{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb> -->
          <div style="padding-top:10px">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "./layout/header";
import SiderBar from "./layout/siderBar";
import { mapGetters, mapMutations } from "vuex";
import request from "@/api/axios";

export default {
  name: "App",
  components: {
    Header,
    SiderBar
  },
  created() {
    if (this.$route.meta.shouldGet) {
      this.$store.dispatch("menu/getSiderBar", {
        route: this.$route.path,
        mes: this.$message,
        router: this.$router
      });
    }
  },
  // methods: mapMutations(['common/setBreadList']),
  data() {
    return {
      name: "",
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
  },
  computed: {
    ...mapGetters("menu", {
      menus: "allMenus"
    })
  },
  watch: {
    // $route(to, from) {
    //   console.log(to);
    //   let list = to.matched.map(el => ({
    //     name: el.name,
    //     path: el.path
    //   }));
    //   list.shift();
    //   this.$store.commit("common/setBreadList", list);
    // }
  }
};
</script>

<style scoped>
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
  line-height: 80px;
  text-align: right;
  font-size: 14px;
}
.el-aside {
  color: #333;
}
</style>
