<template>
  <section class="app-main">
    <vue-progress-bar></vue-progress-bar>
    <div class="main-wrapper">

      <div class="dashboard">{{$route.meta.name || $route.name}}
        <span v-if="$route.query.title && $route.name === '类目分析详情'"> - {{$route.query.title | formatTitle}}</span>
        <span v-if="$route.query.title && $route.name !== '类目分析详情'"> - {{$route.query.title}}</span>
      </div>
      <div class="scroll-wrapper">
        <transition name="fade" mode="out-in">
          <happy-scroll color="rgba(51,51,51,0.2)" size="4" resize>
            <router-view></router-view>
          </happy-scroll>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import HappyScroll from "vue-happy-scroll";
import "vue-happy-scroll/docs/happy-scroll.css";

Vue.use(HappyScroll);

export default {
  name: "AppMain",
  mounted() {
    this.$Progress.finish();
  },
  created() {
    this.$Progress.start();
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress;
        this.$Progress.parseMeta(meta);
      }
      this.$Progress.start();
      next();
    });
    this.$router.afterEach((to, from) => {
      this.$Progress.finish();
    });
  },
  filters: {
    formatTitle(val) {
      return val.replace(/\:/g, " > ");
    }
  }
  // wacth: {
  //   $route(to, from) {
  //     console.log(to);
  //     let list = to.matched.map(el => ({
  //       name: el.name,
  //       path: el.path
  //     }));
  //     list.shift();
  //     this.$store.commit("common/setBreadList", list);
  //   }
  // }
};
</script>
<style lang="scss" scoped>
.app-main {
  display: flex;
  flex: auto;
  padding: 10px;
  background: #f0f3fa;
  .main-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: auto;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    // height: 100%;
    // overflow: hidden;
    .scroll-wrapper {
      flex: auto;
      width: 100%;
      height: 100%;
      margin-bottom: 20px;
    }
  }
}
.__cov-progress {
  height: 3px !important;
  background: $titleColor !important;
  position: absolute !important;
}
</style>

