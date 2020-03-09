<template>
  <div class="app-wrapper">
    <div class="main-container">
      <el-scrollbar
        class="main-scroll"
        style="height:100%"
        wrap-class="default-scrollbar__wrap"
        view-class="p20-scrollbar__view cus-main-container"
        ref="scroll"
      >
        <nav-bar v-if="!$route.meta.__hideHeader"></nav-bar>
        <div class="sub-nav-wrapper">
          <sub-nav :subMenu="subMenu" v-if="$route.meta.showSubMenuState"></sub-nav>
          <el-button v-if="backRoute" @click="back" class="back" type="primary" size="mini" plain icon="el-icon-back">返回</el-button>
        </div>
        <app-main></app-main>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { NavBar, AppMain, SubNav } from './components'

export default {
  name: 'layout',

  components: {
    NavBar,
    AppMain,
    SubNav
  },

  data() {
    return {
      noSidePageNames: ['dash']
      // showBackList: [
      //   ['/product/common/setup/temp', '/product/common/setup/category']
      // ]
      // showSideBar: true
    }
  },
  methods: {
    back() {
      this.$router.push(this.backRoute[1])
    }
  },
  computed: {
    showBackList() {
      return this.$store.state.app.showBackList
    },
    backRoute() {
      return this.showBackList.find(el => el[0] === this.$route.path)
    },
    subMenu() {
      return this.$store.state.auth.subMenu[this.$route.meta.showSubMenuState]
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-nav-wrapper {
  position: relative;
  .back {
    position: absolute;
    right: 22px;
    top: 8px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.28s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-256px);
}
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
  // min-height: 100%;
  height: 100vh;
  transition: margin-left 0.28s;
  // margin-left: 256px;
  // background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  flex: auto;
  &.isCollapse {
    margin-left: 65px;
  }
  &.noSide {
    margin-left: 0;
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
</style>