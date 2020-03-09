<template>
  <scroll-bar :class="{'isCollapse' :isCollapse}">
    <div class="logo">
      <transition-type mode="out-in">
        <img v-if="!isCollapse" src="~@/assets/images/logo.png" key="1" width="180">
        <img v-else src="~@/assets/images/logo_mini.png" key="2" width="28">
      </transition-type>
    </div>
    <el-menu
      unique-opened
      mode="vertical"
      :show-timeout="200"
      background-color="#272b2c"
      text-color="hsla(0, 0%, 100%, .65)"
      active-text-color="#212732"
      :default-active="$route.path"
      :collapse="isCollapse"
      class="main-menu"
    >
      <template v-for="item in asideMenuConfig">
        <router-link v-if="!item.children" tag="li" :to="item.path" :key="item.name">
          <el-menu-item :index="item.path">
            <i v-if="item.icon" :class="item.icon"></i>
            <span v-if="item.name" slot="title">{{item.name}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else :index="item.name || item.path" :key="item.name">
          <template slot="title">
            <i v-if="item && item.icon" :class="item.icon"></i>
            <span v-if="item && item.name" slot="title">{{item.name}}</span>
          </template>
          <template v-for="child in item.children" v-if="!child.hidden">
            <router-link :to="item.path + child.path" :key="child.name">
              <el-menu-item :index="item.path + child.path">
                <span v-if="child && child.name" slot="title">{{child.name}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </scroll-bar>
</template>

<script>
import ScrollBar from './ScrollBar'
// import { asideMenuConfig } from '../../../menuConfig'

export default {
  components: { ScrollBar },
  name: 'SideBar',
  props: ['isCollapse'],
  data() {
    return {
      asideMenuConfig: []
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  line-height: 64px;
  background: #272b2c;
  color: #fff;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
}
.site-name {
  margin-left: 10px;
}
.sidebar-container {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  transition: width 0.28s;
  width: 256px !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  a {
    display: inline-block;
    width: 100%;
  }
  .el-menu {
    // padding-top: 16px;
    width: 100% !important;
    border: none;
  }
  .el-submenu .el-menu-item {
    min-width: 256px !important;
    padding-left: 48px !important;
    background-color: #222 !important;
    &:hover {
      color: #30cc7b !important;
    }
  }
  &.isCollapse {
    width: 65px !important;
  }
  .el-menu-item,
  .el-submenu .el-menu-item {
    &.is-active {
      background-color: #111 !important;
      color: #30cc7b !important;
    }
  }
  .el-submenu__title i {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
<style lang="scss">
.el-menu--collapse {
  .el-submenu.is-active {
    i {
      color: #30cc7b !important;
    }
  }
}
</style>