<template>
  <el-container class="layout-container" v-if="showMenu">
    <el-header class="header" height="68px">
      <!--  -->
      <div class="logo">
        <img src="~@/assets/images/logo.png">
      </div>
      <div class="right-container">
        <main-menu class="mainMenu"/>
        <ul class="right-menu">
          <li>
            <el-button icon="el-icon-question" type="text">帮助中心</el-button>
          </li>
          <li>
            <el-button @click="logout" icon="el-icon-circle-close" type="text">退出</el-button>
          </li>
        </ul>
      </div>
      <!--  -->
    </el-header>
    <el-container>
      <el-aside class="nav" :width="isUnfold?'':'200px'">
        <!--  -->
        <submenu/>
        <!--  -->
      </el-aside>
      <el-main class="main">
        <breadcrumb v-if="$route.fullPath.indexOf('/error/') !== 0"/>
        <app-main
          :class="{'loading':isloading}"
          v-if="isNetwork"
          v-loading="isloading"
          element-loading-spinner="el-icon-loading"
          element-loading-text="加载中..."
        />
        <div :class="['isUnfold', {active:isUnfold}]" @click="changeUnfold">
          <i class="el-icon-arrow-left"></i>
        </div>
      </el-main>
    </el-container>
  </el-container>
  <app-main
    :class="{'loading':isloading}"
    class="hiddenMenu"
    v-else
    v-loading="isloading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="加载中..."
  />
</template>

<script>
import MainMenu from './nav/mainMenu'
import Submenu from './nav/submenu'
import Breadcrumb from './nav/breadcrumb'
import AppMain from './AppMain'
import { mapMutations, mapActions } from 'vuex'
import storage from 'Utils/saver'
import { CONST_PORT_CONFIG } from 'Config'

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
    showMenu() {
      let arrs = ['printPlugSpecification', 'storehousePrintCode', 'faceSheetPreview', 'subwarehousePrintLayout']
      return (
        this.$route.query.areaSkipType != 1 &&
        arrs.indexOf(this.$route.name) === -1
      )
    },
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
    },
    logout() {
      storage.clear('local')
      storage.clear('session')
      top.location.href = CONST_PORT_CONFIG.loginRedirect + 'login.html'
    }
  }
}
</script>

<style lang="scss">
.layout-container {
  position: relative;
  height: 100%;
  width: 100%;
  .right-container {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    flex: 1;
    .mainMenu {
      display: flex;
      flex: 1;
      ul {
        width: 100%;
        display: flex;
        flex: 1;
      }
    }
    .right-menu {
      display: flex;
      line-height: 68px;
      li {
        margin-left: 12px;
        button {
          color: #fff;
        }
      }
    }
  }
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
