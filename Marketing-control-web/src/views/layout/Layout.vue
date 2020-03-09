<template>
<div class="box">
  <div class="app-wrapper-header">
    <div class="grid">
      <img class="header-logo" src="@/assets/login_images/market_logo.png" height="48"/>
      <div></div>
      <div class="right">
        <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div class="box"> 
            <img src="@/assets/navbar_images/user.png" class="user-avatar">
            <div class="user-name">{{userInfo.username}}</div>
            <i class="el-icon-caret-bottom"/>
          </div> 
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/home">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
      </div>
      
    </div>
  </div>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</div>
  
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    logout() {
      this.$store.dispatch('user/LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .box{
    //#304156 #001529
     .app-wrapper-header{
        background-color: #001529;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 56px;
        z-index: 1002;
        .grid{
          display: grid;
          grid-template: 56px/ 180px 380px auto;
          .header-logo{
            align-self: center;
            justify-self: center;
          }
        }
      }
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
    .sidebar-container{
      margin-top: 56px;
    }
    .main-container{
      padding-top: 56px;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .right{
    align-self: center;
    justify-self: end;
    padding-right: 15px;
  }
  .avatar-wrapper{
    
    cursor: pointer;
  .box{
    display: flex;
    align-items: center;
    .user-avatar{
      width: 36px;
      height: 36px;
    }
    .user-name{
      padding-left: 5px;
      padding-right: 5px;
      color: #30cc7b;
    }
    .el-icon-caret-bottom{
      color: #30cc7b;
    }
  }
}
</style>
