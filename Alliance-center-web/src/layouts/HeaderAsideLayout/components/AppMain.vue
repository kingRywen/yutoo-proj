<template>
  <section class="app-main">
    <div style="width:100%" v-if="fullScreenUrl.includes($route.path)">
      <transition-type name="fadeIn-fadeOut">
        <router-view></router-view>
      </transition-type>
    </div>
    <div v-else class="main-wrapper">
      <div class="scroll-wrapper">
        <transition-type name="fadeIn-fadeOut" mode="out-in" :duration="100" style="height:100%">
          <router-view></router-view>
        </transition-type>
        <!-- <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>-->
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'AppMain',
  data() {
    return {
      fullScreenUrl: [
        '/error/404',
        '/error/403',
        '/error/empty',
        '/error/notpermission'
      ]
    }
  },
  filters: {
    formatTitle(val) {
      return val.replace(/\:/g, ' > ')
    }
  }
}
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
    // overflow: auto;
    .scroll-wrapper {
      flex: auto;
      width: 100%;
      // height: 100%;
      // margin-bottom: 20px;
      // div {
      //   height: 100%;
      // }
    }
  }
}
.__cov-progress {
  height: 3px !important;
  background: $titleColor !important;
  position: absolute !important;
}
</style>

