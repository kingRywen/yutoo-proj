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
        <div v-if="$route.meta.bread" class="mar10 flex bread" :class="{'w1400': $route.meta.width}">
          <div>
            <i
              v-if="!$route.meta.noBack && ($route.meta.bread && $route.meta.bread.length > 1)"
              class="el-icon-back goBack"
              @click="$router.go(-1)"
            ></i>

            <span class="size12">当前位置：</span>
            <ElBreadcrumb separator=">">
              <ElBreadcrumbItem to="/">首页</ElBreadcrumbItem>
              <ElBreadcrumbItem
                v-for="(item, index) in $route.meta.bread.slice(1)"
                :to="{query: item.meta && item.meta.getQuery && item.meta.getQuery($route),path:item.path}"
                :key="index"
              >{{(item.meta && item.meta.showMetaProp && $route.query[item.meta.showMetaProp]) ? item.name ? `${item.name} - ${$route.query[item.meta.showMetaProp]}` : `${$route.query[item.meta.showMetaProp]}` : item.name}}</ElBreadcrumbItem>
              <ElBreadcrumbItem>{{($route.meta && $route.meta.showMetaProp && $route.query[$route.meta.showMetaProp]) ? $route.meta.name ? `${$route.meta.name} - ${$route.query[$route.meta.showMetaProp]}` : `${$route.query[$route.meta.showMetaProp]}` : $route.meta.name}}</ElBreadcrumbItem>
            </ElBreadcrumb>
          </div>
          <el-select
            class="sites-select"
            v-if="showSite"
            size="mini"
            :value="listSite"
            @change="handleSiteChange"
            placeholder="请选择站点"
          >
            <el-option v-for="item in sites" :key="item.siteId" :label="item.siteName" :value="item.siteId"></el-option>
          </el-select>
        </div>
        <div class="sub-nav-wrapper">
          <sub-nav :subMenu="subMenu" v-if="$route.meta.showSubMenuState"></sub-nav>
          <el-button v-if="backRoute" @click="back" class="back" type="primary" size="mini" plain icon="el-icon-back">返回</el-button>
        </div>
        <app-main :class="[{mt10: !$route.meta.bread}]" v-if="storeInfo.platformId || noPlatRoute"></app-main>
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

  // watch: {
  //   $route(to, from) {
  //     this.prevRoute = { ...from }
  //   }
  // },

  data() {
    return {
      // listSite: null,
      // sites: [],
      // prevRoute: {},
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
    },
    handleSiteChange(val) {
      this.$store.commit(
        'selling/setSiteId',
        this.sites.find(e => e.siteId === val)
      )
    }
  },
  watch: {
    sites: {
      immediate: true,
      handler(val) {
        // this.listSite = val[0].siteId
        this.handleSiteChange(val[0].siteId)
      }
    }
  },
  computed: {
    listSite() {
      return this.$store.state.selling.curSiteId
    },
    sites() {
      return this.$store.getters['storeInfo/currentPlat'].sites || []
    },
    showSite() {
      const routeNames = [
        'ssStralib',
        'ssSource',
        'ssVallib',
        'ssLib',
        'ssGroup',
        'ssTran',
        'ssParities'
      ]
      return routeNames.indexOf(this.$route.name) > -1
    },
    noPlatRoute() {
      // 存放无需platformid siteid的路由
      let notHavePlatformIdRoutes = ['/shopAuth'],
        notHavePlatformIdRouteRegs = [/^\/helps\/.*$/]
      return (
        notHavePlatformIdRoutes.indexOf(this.$route.path) > -1 ||
        notHavePlatformIdRouteRegs.some(reg => reg.test(this.$route.path))
      )
    },
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
.goBack {
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    color: $titleColor;
  }
}
.bread {
  color: #666666;
  margin: 10px 20px;
  position: relative;
  & > div {
    display: flex;
    align-items: center;
  }
  &.w1400 {
    width: 100%;
    background: rgba(242, 242, 242, 1);
    margin: 0;
    & > div {
      width: 1400px;
      margin: 0 auto;
      padding: 10px 20px;
      background: #fff;
      box-sizing: border-box;
    }
  }
  // margin-bottom: 10px;
  .sites-select {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }
}
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
.main-scroll > .el-scrollbar__wrap {
  overflow-x: initial;
}
</style>