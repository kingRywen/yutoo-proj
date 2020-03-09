<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <!-- <el-dropdown class="avatar-container" trigger="click">
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
    </el-dropdown> -->
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  data:()=>({
    headerImgBig:true
  }),
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ])
  },
  created() {
    this.headerImgBig =this.sidebar.opened
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
      if(this.sidebar.opened){
        this.headerImgBig =true
      }else{
        this.headerImgBig =false
      }
      
    },
    // logout() {
    //   this.$store.dispatch('user/LogOut').then(() => {
    //     location.reload() // 为了重新实例化vue-router对象 避免bug
    //   })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
  }
}
</style>
<style lang="less" scoped>
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
    }
  }
}
</style>


