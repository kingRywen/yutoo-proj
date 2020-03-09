<template>
  <section :class="['app-main', {'is-width': $route.meta.width}]" v-if="refresh">
    <div
      style="width:100%"
      v-if="fullScreenUrl.includes($route.path)"
      v-loading="$store.state.isloading"
      element-loading-text="加载中..."
    >
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <div v-else :class="['main-wrapper', {
      dash: $route.name === 'dash'
    }, {'no-padding': isNoPadding}]">
      <div :class="['scroll-wrapper']" v-loading="$store.state.isloading" element-loading-text="加载中...">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      classN: true,
      refresh: true,
      backRoutes: [],
      fullScreenUrl: [
        '/error/404',
        '/error/403',
        '/error/empty',
        '/error/notpermission'
      ]
    }
  },
  computed: {
    isNoPadding() {
      const nopaddings = ['commonH5']
      return nopaddings.indexOf(this.$route.name) > -1
    },
    showRouter() {
      const list = [
        '/product/common/setup/temp',
        '/product/amazon/storeProduct',
        '/product/amazon/platProduct',
        '/product/amazon/improves',
        '/product/amazon/banDisplay',
        '/product/amazon/changePro'
      ]
      if (list.find(i => i === this.$route.path)) return true
      return false
    }
  },
  created() {
    GLOBAL.vbus.$on('page.main.refresh', this.mainRefresh)
  },
  destroyed() {
    GLOBAL.vbus.$on('page.main.refresh', this.mainRefresh)
  },
  methods: {
    afterLeave() {
      console.log('离开')
      // this.classN = true;
    },
    afterEnter() {
      console.log('进入结束')
    },
    beforeEnter() {
      // this.classN = false;

      console.log('进入')
    },
    mainRefresh() {
      console.log('刷新')
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    }
  }
  // computed: {
  //   cachePage() {
  //     return this.$store.state.app.cachePage
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.app-main {
  // display: flex;
  flex: 1;
  // padding: 10px;
  // height: 100%;
  background: #fff;
  .main-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: auto;
    background: #fff;
    padding: 10px 20px 0;
    box-sizing: border-box;
    position: relative;
    // height: 100%;
    // overflow: auto;
    &.no-padding {
      padding: 0;
    }
    &.dash {
      background: #fff;
      height: 100%;
      // padding: 30px;
    }
    .scroll-wrapper {
      flex: auto;
      width: 100%;
      height: 100%;
      margin-bottom: 20px;
    }
  }
  &.is-width {
    background-color: rgba(242, 242, 242, 1);
    display: flex;
    flex-direction: column;
    .main-wrapper {
      margin: 0 auto;
      width: 1400px;
      height: 100%;
    }
  }
}
.__cov-progress {
  height: 3px !important;
  background: $titleColor !important;
  position: absolute !important;
}
.dark {
  .app-main {
    background: #f2f2f2;
  }
  .main-wrapper {
    background: transparent;
  }
}
</style>
