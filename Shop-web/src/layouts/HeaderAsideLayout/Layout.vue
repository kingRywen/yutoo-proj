<template>
  <div class="app-wrapper">
    <nav-bar :is-collapse="isCollapse" :no-side="!showSideBar"></nav-bar>
    <div class="main-wrapper">
      <transition name="fade">
      <side-bar @collapse="handleCollapse" class="sidebar-container" v-if="showSideBar" :is-collapse="isCollapse"></side-bar>
    </transition>
    <div class="main-container" :class="{'isCollapse':isCollapse, 'noSide': !showSideBar}">
      <app-main></app-main>
    </div>
    </div>
    
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from './components'

export default {
  name: 'layout',

  components: {
    NavBar,
    SideBar,
    AppMain
  },

  data() {
    return {
      isCollapse: false,
      noSidePageNames: ['dash']
      // showSideBar: true
    }
  },
  computed: {
    showSideBar() {
      return this.noSidePageNames.indexOf(this.$route.name) === -1
    }
  },
  methods: {
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.28s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-200px);
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
  min-height: calc(100vh - 65px);
  // height: 100vh;
  transition: margin-left 0.28s;
  margin-left: 200px;
  // width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow: auto;
  &.isCollapse {
    margin-left: 65px;
  }
  &.noSide {
    margin-left: 0;
  }
}
.main-wrapper {
  display: flex;
  width: 100%;
}
</style>
