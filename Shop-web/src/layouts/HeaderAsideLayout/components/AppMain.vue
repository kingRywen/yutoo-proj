<template>
  <section class="app-main" v-if="refresh">
    <div style="width:100%" v-if="fullScreenUrl.includes($route.path)">
      <router-view></router-view>
    </div>
    <div v-else :class="['main-wrapper', {
      dash: $route.name === 'dash'
    }]">
      <!-- <div class="dashboard">{{$route.meta.name || $route.name}}
        <span v-if="$route.query.title && $route.name === '类目分析详情'"> - {{$route.query.title | formatTitle}}</span>
        <span v-if="$route.query.title && $route.name !== '类目分析详情'"> - {{$route.query.title}}</span>
      </div>-->
      <!-- 面包屑 -->
      <div class="dashboard" v-if="$route.name !== 'dash'">
        <el-breadcrumb v-if="bread" separator="/">
          <el-breadcrumb-item :to="{ path: '/dash' }">首页</el-breadcrumb-item>
          <!-- 记录需要返回的路由栈 -->
          <el-breadcrumb-item
            v-for="item in $store.state.backRoutes"
            :to="{ name: item.name, query: item.query }"
            :key="item.name"
          >{{item.title}}</el-breadcrumb-item>
          <template v-for="(route, index) in $route.matched">
            <template v-if="index !== 0">
              <el-breadcrumb-item
                :key="route.path"
                :to="{path: route.path, query: index === 1 ? {} : route.meta.getParams ? route.meta.getParams($route.query) : $route.query}"
              >{{(route.meta.showMetaProp && $route.query[route.meta.showMetaProp]) ? `${route.meta.title} - ${$route.query[route.meta.showMetaProp]}` : route.meta.title}}</el-breadcrumb-item>
              <!-- <el-breadcrumb-item v-else>{{$route.meta.title}}</el-breadcrumb-item> -->
            </template>
          </template>
        </el-breadcrumb>
        <ElButton v-if="backBtn" @click.stop="handleBack" type="text" icon="el-icon-back">返回</ElButton>
      </div>
      <div class="scroll-wrapper">
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
          <!-- <router-view v-if="!showNoresponsePage"></router-view>
          <div v-else>响应失败</div>-->
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import storage from 'Utils/saver'
import { mapState } from 'vuex'

export default {
  name: 'AppMain',
  data() {
    return {
      bread: true,
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
    ...mapState(['showNoresponsePage']),
    backBtn() {
      //店铺深度分析详情需要自己定义返回按钮
      return (
        (this.$route.matched.length > 2 &&
          this.$route.name !== 'storeDeepAnalysisDatails') ||
        this.$store.state.backBtn
      )
    }
  },
  created() {
    GLOBAL.vbus.$on('page.main.refresh', this.mainRefresh)
    // console.log(this.$route.matched);
    if (!this.$store.state.backRoutes.length) {
      let backRoutes = storage.get('local', 'backRoutes') || []
      this.$store.commit('setBackRoutes', backRoutes)
    }
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
    },
    refreshBread() {
      this.bread = false
      this.$nextTick(() => {
        this.bread = true
      })
    },
    handleBack() {
      try {
        const matched = this.$route.matched
        const len = matched.length
        const backRoute = matched[len - 2]
        let { query, params } = this.$route
        this.routeIgnore.forEach(key => {
          delete query[key]
          delete params[key]
        })
        console.log(backRoute)
        this.$router.push({
          name: backRoute.name,
          query: backRoute.meta.showMetaProp
            ? backRoute.meta.getParams
              ? backRoute.meta.getParams(query)
              : query
            : null,
          params: backRoute.meta.showMetaProp ? params : null
        })
				
      } catch (error) {
				// console.log(error)
        if (this.$store.state.backBtn) {
          // 如果是自定义返回事件则下发返回事件
          GLOBAL.vbus.$emit('custom.back')
          return
        }
        this.$router.go(-1)
      }
    }
  },
  watch: {
    $route(to) {
      this.refreshBread()
      // console.log(to, from);
      let backRoutes = storage.get('local', 'backRoutes') || []
      let index = backRoutes.findIndex(el => el.name === to.name)
      if (index > -1) {
        backRoutes.splice(index)
      }
      storage.set('local', 'backRoutes', backRoutes)
      this.$store.commit('setBackRoutes', backRoutes)
    }
  },
  filters: {
    formatTitle(val) {
      return val.replace(/\\:/g, ' > ')
    }
  }
}
</script>
<style lang="scss" scoped>
.app-main {
  // display: flex;
  flex: 1;
  // margin-left: 200px;
  // padding: 10px;
  // height: 100%;
  background: #fff;
  .main-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: auto;
    background: #fff;
    padding: 10px 10px 10px 10px;
    box-sizing: border-box;
    position: relative;
    // height: 100%;
    // overflow: auto;
    &.dash {
      background: #f2f3f7;
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

