<template>
  <el-container class="layout-container">
    <el-header class="header" height="68px">
      <!--  -->
      <div class="logo">
        <img src="~@/assets/images/logo.png">
      </div>
      <main-menu class="mainMenu"/>
      <!--  -->
    </el-header>
    <el-container>
      <el-aside class="nav" :width="isUnfold?'':'200px'">
        <!--  -->
        <submenu/>
        <!--  -->
      </el-aside>
      <el-main class="main">
        <breadcrumb/>
        <app-main v-if="isNetwork" v-loading="isloading" element-loading-text="拼命加载中..."/>
        <div :class="['isUnfold', {active:isUnfold}]" @click="changeUnfold">
          <i class="el-icon-arrow-left"></i>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MainMenu from './nav/mainMenu'
import Submenu from './nav/submenu'
import Breadcrumb from './nav/breadcrumb'
import AppMain from './AppMain'
import { mapMutations, mapActions } from 'vuex'
export default {
  components: {
    MainMenu,
    Submenu,
    Breadcrumb,
    AppMain
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initMenu()
    })
  },
  computed: {
    isUnfold() {
      return this.$store.state.isSubmenuUnfold
    },
    isNetwork() {
      return this.$store.state.network
    },
    isloading() {
      return this.$store.state.isloading
    }
  },
  methods: {
    ...mapActions('perms', ['initMenu']),
    ...mapMutations(['changeSubmenuUnfold']),
    changeUnfold() {
      this.changeSubmenuUnfold()
    }
  }
}
</script>

<style lang="scss">
.layout-container {
  position: relative;
  height: 100%;
  width: 100%;
  .main {
    position: relative;
    .isUnfold {
      position: absolute;
      top: 50%;
      left: 2px;
      height: 50px;
      line-height: 50px;
      margin-top: -25px;
      cursor: pointer;
      transition: all 0.25s ease-in-out;
      &.active {
        transform: rotate(180deg);
        transition: all 0.25s ease-in-out;
      }
    }
  }
}
</style>
