<template>
  <div class="app-wrapper">
    <!-- <side-bar class="sidebar-container" :is-collapse="isCollapse"></side-bar> -->
    <div class="main-container" :class="{'isCollapse':isCollapse}">
      <nav-bar @collapse="handleCollapse" :is-collapse="isCollapse"></nav-bar>
      <div class="dashboard">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ name: 'Country' }">首页</el-breadcrumb-item>
          <template v-for="(route, index) in $route.matched">
            <template>
              <el-breadcrumb-item v-if="route.meta.backname" :key="index">
                <a @click="$router.go(-1)">{{route.meta.backname}}</a>
              </el-breadcrumb-item>
              <el-breadcrumb-item
                :key="index"
                v-if="route.meta.title && index !== 0"
                :to="{name: !route.meta.back ? route.name : route.meta.name, query: route.query, params: route.params}"
              >{{route.meta.title}}</el-breadcrumb-item>
            </template>
          </template>
        </el-breadcrumb>
        <ElButton
          type="text"
          icon="el-icon-back"
          v-if="$route.matched.length > 2 && !$route.meta.noBack"
          @click="handleBack"
        >返回</ElButton>
        <div v-if="$route.name === 'identification'" class="ip">
          当前剩余可用账号配额：
          <b class="danger">{{ipCase.ipUsableTotal}}</b>
        </div>
        <div v-if="$route.name === 'financeIndex'" class="ip">
          今日充值：
          <b class="danger">${{$store.state.currentM}}</b>
        </div>
      </div>
      <app-main v-loading="layoutLoading"></app-main>
    </div>
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from './components'
import { mapState, mapActions, mapGetters } from 'vuex'
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

  // mounted() {
  //   if (storage.get('local', 'token')) {
  //     this.getMsg()
  //   }
  //   this.timer = setInterval(() => {
  //     this.getMsg()
  //   }, 60 * 10 * 1000)
  // },

  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    // ...mapActions(['getMsg']),
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    handleBack() {
      this.$router.go(-1)
    }
  },
  beforeDestroy() {
    // console.log('清除定时器')
    clearInterval(this.timer)
    this.timer = null
  },
  computed: {
    ...mapState(['isloading', 'ipCase']),
    ...mapGetters(['layoutLoading'])
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
.dashboard {
  height: 14px;
  display: flex;
  justify-content: space-between;
  .el-button--text {
    padding: 0;
    margin-right: 10px;
  }
  .ip {
    margin-right: 10px;
    font-size: 17px;
  }
}
</style>
