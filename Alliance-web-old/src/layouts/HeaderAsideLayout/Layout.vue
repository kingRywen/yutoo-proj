<template>
  <div class="app-wrapper">
    <!-- <side-bar class="sidebar-container" :is-collapse="isCollapse"></side-bar> -->
    <div class="main-container" :class="{'isCollapse':isCollapse}">
      <nav-bar @collapse="handleCollapse" :is-collapse="isCollapse"></nav-bar>
      <div class="dashboard">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/dash' }">首页</el-breadcrumb-item>
          <template v-for="route in $route.matched">
            <el-breadcrumb-item v-if="route.meta.backname">
              <a @click="$router.go(-1)">{{route.meta.backname}}</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-if="route.meta.title"
              :to="{path: !route.meta.back ? route.path : route.meta.url, query: route.query}"
            >
              {{route.meta.title}}
              <!-- <router-link v-if="!route.meta.back" :to="{path: route.path, query: route.query}">{{route.meta.title}}</router-link>
              <router-link v-else :to="{path: route.meta.url, query: route.query}">{{route.meta.title}}</router-link>-->
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>
        <ElButton type="text" icon="el-icon-back" v-if="$route.matched.length > 2" @click="handleBack">返回</ElButton>
      </div>
      <app-main v-loading="isloading"></app-main>
    </div>
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from './components'
import { mapState } from 'vuex'

export default {
  name: 'layout',

  components: {
    NavBar,
    SideBar,
    AppMain
  },
  created() {
    console.log(this.$route.matched)
  },

  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    handleBack() {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState(['isloading'])
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
}
</style>
