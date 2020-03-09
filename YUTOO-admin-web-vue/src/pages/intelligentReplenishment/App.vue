<template>
  <div id="components-layout-demo-top-side" v-loading="isLoading">
    <v-layout>
      <yt-header :index="0"></yt-header>
      <v-layout style="flex-direction: row;">
        <v-layout>
          <v-content>
            <!-- 主体内容开始 -->
            <router-view></router-view>
          </v-content>
        </v-layout>
      </v-layout>
    </v-layout>
  </div>
</template> 
<script>
import { mapActions, mapState } from "vuex";
import { fetchData } from "@/common/common";
import ytHeader from "components/layout/header.vue";
import Vue from "vue";
import apis from "@/apis";
import {
  // Menu,
  icon,
  layout,
  content,
  header,
  menu
} from "vue-beauty";

Vue.use(icon);
Vue.use(layout);
Vue.use(content);
Vue.use(header);
Vue.use(menu);

// 全局调用接口
export default {
  components: {
    ytHeader
  },
  async created() {
    // await this.login();
    this.getSourcePlatformList();
    // this.getSourceShopList();
  },
  methods: {
    ...mapActions(["getSourcePlatformList", "getSourceShopList"]),
    // 登录
    async login() {
      fetchData({
        ...apis.MERCHANT_USER_LOGIN,
        data: {
          username: "",
          password: ""
        }
      }).then(res => {
        localStorage.setItem("token", res.data.token);
      });
    }
  },
  computed: mapState(["isLoading"])
};
</script>
<style lang="less">
.header_wrapper.ant-layout-header .ant-menu .ant-menu-item {
  box-sizing: border-box;
}
// #components-layout-demo-top-side {
//   background: #ececec;
//   .ant-card {
//     margin-bottom: 20px;
//   }
//   .logo {
//     width: 120px;
//     height: 48px;
//     background: #333;
//     border-radius: 6px;
//     margin: 16px 28px 16px 0;
//     float: left;
//   }
// }
</style>