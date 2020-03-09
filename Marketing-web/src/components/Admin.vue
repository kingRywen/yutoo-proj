<template>
  <div id="app">
    <el-container>
      <SiderBar v-show="isShow" :is-collapse="isCollapse"></SiderBar>
      <el-container>
        <el-header style="height:50px">
          <Header :lists='menusScync'></Header>
        </el-header>
        <el-main>
          <div class="breadcrumb_wrapper" v-show="isShow" v-if="!$route.meta.notShowPoint">
            <div class="_row">
              <i class="el-icon-menu" style="font-size:16px;margin-right:6px;color:#00c0de;cursor:pointer" @click="handleCollapseClick"></i>
              <span style="opacity:0.5" class="font12">当前位置： </span>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-if="firstName">
                  <span class="font12">{{firstName}}</span>
                  <!-- <span>{{this.$route.matched[0].meta.name||this.$route.matched[0].meta.title}}</span> -->
                </el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in routerList.filter(el => el.name || el.meta.title)" :to="item.meta.back? ({path:item.path, query:item.query?item.query:$route.query}) : item.path">
                  <span v-if="item.path === '/admin'" class="font12">首页</span>
                  <span v-else class="font12">{{item.meta.title || item.name}}</span>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <a href="" :download="downName" id="hf"></a>
            <!-- 店铺导出 -->
            <a href="" :download="downName" id="shop_hf"></a>
            <span class="font12" v-if="this.$route.name!=='图片空间' && !$route.meta.notShowPoint" style="margin-right:15px;color:#777">剩余额度 {{surplusAmount||0}}&nbsp;点
            </span>
            <span class="font12" v-else style="margin-right:15px;color:#777">
              <span v-if="showResidualCapacity"> 剩余 {{this.residualCapacity}}</span>
              <span v-if="!showResidualCapacity"> 未开启图片空间</span>
            </span>
          </div>
          <div style="flex: 1;overflow: hidden;overflow-y: auto;" class="main_wrapper">
            <router-view style="border:1px solid #e6e6e6;" class="commonStyle"></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import Header from './layout/header'
import SiderBar from './layout/siderBar'
import { mapGetters, mapMutations, mapState } from 'vuex'
import request from '@/api/axios'

export default {
  name: 'App',
  components: {
    Header,
    SiderBar
  },
  created() {
    if (this.$route.meta.notShowPoint) {
      return
    }
    // console.log(this.$route);
    //扣点
    this.reloadPointApi()
    if (this.$route.meta.shouldGet) {
      this.$store.dispatch('menu/getSiderBar', {
        route: this.$route.path,
        mes: this.$message,
        router: this.$router
      })
    }
  },
  methods: {
    toPreRouter() {
      this.$router.go(-1)
    },
    handleCollapseClick() {
      this.isCollapse = !this.isCollapse
      setTimeout(() => {
        GLOBAL.vbus.$emit('reset.menubar')
      }, 260)
    }
  },
  mounted() {},
  data() {
    return {
      isCollapse: false,
      shopList: '',
      point: {
        surplusAmount: null, //剩余点数
        charge: null //点数
      },
      name: '',
      menusScync: [
        {
          iconPath: escape('&#xe8b9;'),
          name: '首页',
          iconActivePath: '',
          url: ''
        },
        {
          iconPath: escape('&#xe8a2;'),
          name: '平台',
          iconActivePath: '',
          url: ''
        },
        {
          iconPath: escape('&#xe890;'),
          name: '账号充值',
          iconActivePath: '',
          url: ''
        }
      ]
    }
  },
  computed: {
    ...mapGetters('menu', {
      menus: 'allMenus'
    }),
    ...mapState('common', {
      downName: state => state.downName
    }),
    surplusAmount() {
      return this.$store.state.point.getPointeData
    },
    // 图片空间在admin上是否开启空间
    showResidualCapacity() {
      return this.$store.state.common.showResidualCapacity
    },
    // 图片空间扣点在admin上的点数
    residualCapacity() {
      return this.$store.state.common.residualCapacity
    },
    isShow() {
      let pageId = this.$store.state.common.pageId
      if (pageId == 1 || pageId == 2) {
        return false
      } else {
        return true
      }
    },
    firstName() {
      if (this.$route.meta.drop === false) {
        return false
      } else {
        return this.$route.matched[1].meta.title || this.$route.name
      }
    },
    routerList() {
      // 如果是从店铺的产品列表调转到产品，则使用店铺的面包屑
      if (
        this.$store.state.competitive.keepShopBreadcrumb === true &&
        this.shopList !== ''
      ) {
        let obj = {}
        obj.path = this.$route.matched[this.$route.matched.length - 1].path
        obj.name = this.$route.matched[this.$route.matched.length - 1].name
        obj.meta = this.$route.matched[this.$route.matched.length - 1].meta
        obj.query = this.$route.query
        let list = this.shopList.slice(0, -1)
        list.push(obj)
        if (this.$store.state.competitive.saveMatchedForChild) {
          // 插入一项
          list.splice(1, 0, this.$store.state.competitive.saveMatchedForChild)
          // console.log(list, "111111");
          return list
        } else {
          this.$router.push('/admin/competitive/shopAnalysis')
        }
        return list
      }
      // 跟卖监控——子ASIN——跟卖列表，插入子ASIN面包屑
      if (this.$route.meta.saleKeep === true && this.saleList !== '') {
        let obj = {}
        obj.path = this.$route.matched[this.$route.matched.length - 1].path
        obj.name = this.$route.matched[this.$route.matched.length - 1].name
        obj.meta = this.$route.matched[this.$route.matched.length - 1].meta
        obj.query = this.$route.query
        let list = this.$route.matched.slice(2)
        if (this.$store.state.monitor.saveSkuMatchedForChild) {
          // 插入一项
          list.splice(1, 0, this.$store.state.monitor.saveSkuMatchedForChild)
          // console.log(list, "111111");
          return list
        } else {
          this.$router.push('/admin/monitoringCenter/salesMonitoring')
        }
        return list
      }
      // 防跟卖监控——子ASIN——跟卖列表，插入子ASIN面包屑
      if (this.$route.meta.preSaleKeep === true && this.saleList !== '') {
        let obj = {}
        obj.path = this.$route.matched[this.$route.matched.length - 1].path
        obj.name = this.$route.matched[this.$route.matched.length - 1].name
        obj.meta = this.$route.matched[this.$route.matched.length - 1].meta
        obj.query = this.$route.query
        let list = this.$route.matched.slice(2)
        if (this.$store.state.monitor.saveSkuMatchedForChild) {
          // 插入一项
          list.splice(1, 0, this.$store.state.monitor.saveSkuMatchedForChild)
          // console.log(list, "111111");
          return list
        } else {
          this.$router.push('/admin/monitoringCenter/preventSalesMonitoring')
        }
        return list
      }
      // let routerList=[];
      // console.log(this.$route.meta, "drop");
      // 如果店铺789图调转到2_3
      if (this.$route.meta.drop === false) {
        return this.$route.matched.slice(1)
      } else {
        if (this.$route.meta.insert === true) {
          let list = this.$route.matched.slice(2)
          // 判断有保存则插入
          if (this.$store.state.competitive.saveMatchedForChild) {
            // 插入一项
            list.splice(1, 0, this.$store.state.competitive.saveMatchedForChild)
            // console.log(list, "111111");
            return list
          } else {
            this.$router.push('/admin/competitive/shopAnalysis')
          }
        }
        return this.$route.matched.slice(2)
      }
    }
  },
  watch: {
    routerList(newV) {
      // 如果是店铺分析查看页面，则保存用作面包屑
      if (this.$route.meta.keep && this.$route.meta.keep === true) {
        this.shopList = newV
        // console.log(newV);
        this.$store.commit('competitive/goCrossShopCheck', true)
      }
    }
    // "$route.meta.routeList"(n) {
    //   console.log(n, "routeList");
    // }
    // surplusAmount() {
    //   this.surplusAmount = this.$store.state.point.getPointeData.surplusAmoun;
    // }
    // $route(to, from) {
    //   console.log(to);
    //   let list = to.matched.map(el => ({
    //     name: el.name,
    //     path: el.path
    //   }));
    //   list.shift();
    //   this.$store.commit("common/setBreadList", list);
    // }
    // $route(to, from) {
    //   console.log(to, from);
    // }
  }
}
</script>

<style lang="scss">
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
  background-color: #272b2c !important;
  /* background: linear-gradient(to right, #396afc, #2948ff); */
  color: rgba(255, 255, 255, 0.7);
  line-height: 50px;
  text-align: right;
  font-size: 14px;
  border-left: 1px solid #546172;
}
.el-aside {
  color: #333;
}
.toPreRouter {
  font-size: 14px;
  top: 5px;
  color: #606266;
  padding: 10px 10px 5px 0px;
  position: relative;
  /* top: 98px; */
  /* left: 0px; */
  /* z-index: 500; */
  width: 100%;
  height: 20px;
  background: #fff;
}
.toPreRouter span {
  position: relative;
  top: -6px;
  cursor: pointer;
  padding: 10px 10px 10px 0px;
}
.toPreRouter span:hover {
  color: #00c0de;
}
.breadcrumb_wrapper {
  flex: none;
  display: flex;
  align-items: center;
  padding: 6px;
  padding-top: 0;
  padding-left: 0;
  height: 27px;
  // border-bottom: 1px solid #e6e6e6;
  // flex: auto;
  justify-content: space-between;
  ._row {
    line-height: 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
