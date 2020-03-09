<template>
  <section class="app-main" v-if="refresh">
    <div style="width:100%" v-if="fullScreenUrl.includes($route.path)">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <div v-else :class="['main-wrapper', {
      dash: $route.name === 'dash'
    }]">
      <!-- 面包屑 -->
      <div class="bread">
        <div class="bread-title">仓库产品</div>
        <ul class="bread-nav">
          <li class="bread-nav-item">
            <ElButton type="text">了解更多</ElButton>
          </li>
          <li class="bread-nav-item">
            <ElButton type="text">操作指南</ElButton>
          </li>
          <li class="bread-nav-item">
            <ElButton type="text">评价此页</ElButton>
          </li>
        </ul>
      </div>
      <div class="scroll-wrapper">
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
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
  created() {
    GLOBAL.vbus.$on('page.main.refresh', this.mainRefresh)
  },
  destroyed() {
    GLOBAL.vbus.$on('page.main.refresh', this.mainRefresh)
  },
  methods: {
    mainRefresh() {
      console.log('刷新')
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    }
  },
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
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    // height: 100%;
    // overflow: auto;
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
}
.__cov-progress {
  height: 3px !important;
  background: $titleColor !important;
  position: absolute !important;
}
</style>

