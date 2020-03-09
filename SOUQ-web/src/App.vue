<template>
  <div id="app">
    <transition v-if="$route.path !== '/login'" enter-active-class="animated bounceInUp absolute" leave-active-class="animated bounceOutUp absolute">
      <router-view></router-view>
    </transition>
    <transition v-else enter-active-class="animated fadeIn absolute" leave-active-class="animated bounceOutUp absolute" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import request from "@/api/axios";
export default {
  data() {
    return {
      routeList: []
    };
  },
  watch: {
    $route(to, from) {
      let list = [];
      to.matched.map(el => {
        list.push({
          name: el.name,
          path: el.path
        });
      });
      console.log(list);
    }
    // $route() {
    //   request.defaults.headers.token = localStorage.getItem("token");
    // }
  }
};
</script>
<style>
@import "/font/iconfont.css";
@import "/font/iconfont2.css";
@import "/style/common.css";
body {
  overflow: hidden;
}
.absolute {
  position: absolute;
}
</style>

