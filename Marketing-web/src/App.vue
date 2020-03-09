<template>
  <div style="min-width:1280px;overflow-x:hidden;margin:0 auto;">
    <router-view></router-view>
  </div>
</template>
<script>
import request from "@/api/axios";
export default {
  data() {
    return {};
  },
  created() {
    this.bindEvent();
  },
  methods: {
    bindEvent() {
      let vm = this;
      GLOBAL.vbus.$on("response.incorrect", resData => {
        vm.$message.error(resData.msg);
      });
    }
  },
  watch: {
    $route(to, from) {
      // console.log(to, from);
      // this.$store.commit("common/pathFromCheckProductAnalysis", to.path);
      request.defaults.headers.token = localStorage.getItem("market_toke");
    }
  }
};
</script>
<style>
@import "/font/iconfont.css";
@import "/font/iconfont2.css";
@import "/style/common.css";
@import "/style/common2.css";
</style>
