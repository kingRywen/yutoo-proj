<template>
  <div class="app-wrapper">
    <!-- <side-bar class="sidebar-container" :is-collapse="isCollapse"></side-bar> -->
    <div class="main-container" :class="{'isCollapse':isCollapse}">
      <el-scrollbar
        class="main-scroll"
        style="height:100%"
        wrap-class="default-scrollbar__wrap"
        view-class="p20-scrollbar__view cus-main-container"
        ref="scroll"
      >
        <nav-bar @collapse="handleCollapse" :is-collapse="isCollapse"></nav-bar>
        <div class="dashboard">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: isAdmin ? '/dash' : '/allotTask' }">首页</el-breadcrumb-item>
            <template v-if="$route.meta.backs">
              <el-breadcrumb-item
                :key="route.path"
                v-for="route in $route.meta.backs"
                :to="{path:route.path, query: route.query ? $route.query : null, params:route.params ? $route.params : null}"
              >{{route.title}}</el-breadcrumb-item>
            </template>
            <template v-for="route in $route.matched">
              <el-breadcrumb-item v-if="route.meta.backname" :key="route.path">
                <a @click="$router.go(-1)">{{route.meta.backname}}</a>
              </el-breadcrumb-item>
              <el-breadcrumb-item
                v-if="route.meta.title"
                :key="route.path"
                :to="{name: !route.meta.back ? route.name : route.meta.url, query: $route.query, params: $route.params}"
              >{{route.meta.title}}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
          <ElButton type="text" icon="el-icon-back" v-if="$route.matched.length > 2" @click="handleBack">返回</ElButton>
          <!-- <div v-if="$route.name === 'identification'" class="ip">
          当前剩余可用虚拟机账号配额：
          <b class="danger">{{ipCase.ipUsableTotal}}</b>
          </div>-->
          <div v-if="$route.name === 'allotTask'" class="ip" style="font-size:14px">
            待办任务数（当日/总数）：
            <b class="success">{{$store.state.taskAllotCount[0]}}</b>
            / {{$store.state.taskAllotCount[1]}}
          </div>
        </div>
        <app-main></app-main>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from './components'
import { mapState, mapActions } from 'vuex'
import storage from 'Utils/saver'

export default {
  name: 'layout',

  components: {
    NavBar,
    SideBar,
    AppMain
  },
  // created() {
  //   GLOBAL.vbus.$on('interval.stop.message', (stop) => {
  //     if (stop) {
  //       console.log('停止');
  //       clearInterval(this.timer)
  //       this.timer = null
  //     }
  //   })
  // },

  mounted() {
    // this.getMsg()
    if (storage.get('local', 'token')) {
      this.getMsg()
    }
    this.timer = setInterval(() => {
      this.getMsg()
    }, 60 * 10 * 1000)
  },

  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    ...mapActions(['getMsg']),
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    handleBack() {
      this.$router.go(-1)
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'login') {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },
  computed: {
    ...mapState(['ipCase']),

    isAdmin() {
      return this.$store.state.userInfo.isAdmin
    }
  },
  beforeDestroy() {
    // console.log('清除定时器')
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style lang="scss" scoped>
body {
  height: 100vh;
}
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
}

.main-container {
  min-height: 100vh;
  height: 100vh;
  transition: margin-left 0.28s;
  background-color: #f0f3fa;
  display: flex;
  flex-direction: column;
  flex: auto;
  &.isCollapse {
    margin-left: 65px;
  }
}
</style>
<style lang="scss">
.cus-main-container {
  min-height: 100vh;
  // height: 100vh;
  transition: margin-left 0.28s;
  display: flex;
  flex-direction: column;
  flex: auto;
}
.dashboard {
  height: 14px;
  display: flex;
  // margin-bottom: 14px !important;
  justify-content: space-between;
  .el-button--text {
    padding: 0;
    margin-right: 10px;
  }
  .ip {
    margin-right: 10px;
  }
}
</style>
