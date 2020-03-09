<template>
  <div class="app-wrapper">
    <div class="main-container">
      <nav-bar></nav-bar>
      <sub-nav></sub-nav>
      <app-main></app-main>
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
      // showSideBar: true
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: all .28s;
}
.fade-enter, .fade-leave-to {
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
  min-height: 100vh;
  height: 100vh;
  transition: margin-left 0.28s;
  // margin-left: 256px;
  // background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow: auto;
  &.isCollapse {
    margin-left: 65px;
  }
  &.noSide {
    margin-left: 0
  }
}
</style>
