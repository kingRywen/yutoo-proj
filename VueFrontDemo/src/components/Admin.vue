<template>
  <div id="app">
    <el-container>
      <el-header style="height:80px">
        <Header :lists='menusScync'></Header>
      </el-header>
      <el-container>
        <SiderBar></SiderBar>
        <el-main>
          <el-breadcrumb separator="/" v-if="$route.path !== '/admin/dashboard'">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-breadcrumb v-else>
            <el-breadcrumb-item>首页</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="padding-top:20px"><router-view/></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from './layout/header'
import TabBar from './layout/TabBar'
import SiderBar from './layout/siderBar'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Header,
    SiderBar,
    TabBar
  },
  created () {
    if (this.$route.meta.shouldGet) {
      this.$store.dispatch('menu/getSiderBar', {
        route: this.$route.path,
        mes: this.$message,
        router: this.$router
      })
    }
  },
  data () {
    return {
      name: '',
      menusScync: [
        {
          iconPath: escape('&#xe8b9;'),
          name: '我的工作台',
          iconActivePath: '',
          url: '/admin/dashboard'
        },
        {
          iconPath: escape('&#xe8a2;'),
          name: '产品库中心',
          iconActivePath: '',
          url: '/admin/center'
        },
        {
          iconPath: escape('&#xe890;'),
          name: '仓储物流管理',
          iconActivePath: '',
          url: '/admin/WarehouseLogistics'
        },
        {
          iconPath: escape('&#xe89f;'),
          name: '销售管理',
          iconActivePath: '',
          url: '/admin/SalesManagement'
        },
        {
          iconPath: escape('&#xe8ac;'),
          name: 'CRM客服管理',
          iconActivePath: '',
          url: '/admin/CRM'
        },
        {
          iconPath: escape('&#xe8b8;'),
          name: '系统管理',
          iconActivePath: '',
          url: '/admin/Settings'
        },
        {
          iconPath: escape('&#xe8ae;'),
          name: '财务管理',
          iconActivePath: '',
          url: '/admin/financialManagement'
        },
        {
          iconPath: escape('&#xe904;'),
          name: '报告中心',
          iconActivePath: '',
          url: '/admin/ReportCenter'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('menu', {
      menus: 'allMenus'
    })
  },
  watch: {
    '$route' (to, from) {
      // 判断是否是子路由切换
      if (to.meta.shouldGet) {
        console.log('请求')
        this.$store.dispatch('menu/getSiderBar', {
          route: to.path,
          mes: this.$message
        })
      }
      console.log('admin', to)
    }
  }
}
</script>

<style>
.el-container {
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
}
.el-header {
  background-color: #3a8ee6;
  background: linear-gradient(to right, #396afc, #2948ff);
  color: #fff;
  line-height: 80px;
  text-align: right;
  font-size: 14px
}
.el-aside {
  color: #333;
}
</style>
