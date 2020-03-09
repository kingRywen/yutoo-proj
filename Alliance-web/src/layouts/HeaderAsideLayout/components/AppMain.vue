<template>
  <section class="app-main">
    <div style="width:100%" v-if="fullScreenUrl.includes($route.path)">
      <transition-type name="fadeIn-fadeOut">
        <router-view v-if="refresh && $store.state.currentSiteInfo.platformCode"></router-view>
      </transition-type>
    </div>
    <div v-loading="layoutLoading" v-else class="main-wrapper">
      <div class="scroll-wrapper" style="min-height: 100px">
        <transition-type name="fadeIn-fadeOut" mode="out-in" height="auto" :duration="100">
          <router-view v-if="refresh && $store.state.currentSiteInfo.platformCode"></router-view>
        </transition-type>
        <!-- <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>-->
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  data() {
    return {
      refresh: true,
      fullScreenUrl: [
        '/error/404',
        '/error/403',
        '/error/empty',
        '/error/notpermission'
      ]
    }
  },
  created() {
    GLOBAL.vbus.$on('appmain.refresh', () => {
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    })
  },

  beforeDestroy() {
    GLOBAL.vbus.$off('appmain.refresh')
  },

  computed: {
    ...mapGetters(['layoutLoading'])
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
  margin: 10px;
  background: #fff;
  .main-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: auto;
    // background: #fff;
    padding: 14px;
    box-sizing: border-box;
    // position: relative;
    height: 100%;
    overflow: auto;
    .scroll-wrapper {
      flex: auto;
      width: 100%;
      // height: 100%;
      // margin-bottom: 20px;
      div {
        // height: 100%;
      }
    }
  }
}
.__cov-progress {
  height: 3px !important;
  background: $titleColor !important;
  position: absolute !important;
}
</style>

