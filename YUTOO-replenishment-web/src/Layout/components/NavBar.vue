<template>
  <div>
    <el-menu class="navbar" mode="horizontal" :default-active="defaultActive" @select="handleSelect">
      <div class="logo">
        <img src="~@/assets/images/logo.png" />
      </div>

      <el-menu-item :index="item.activeIndex" v-for="item in mainMenu" :key="item.index">
        <div
          class="nav-item"
          @mouseenter="handleMouseEnter($event, item.activeIndex)"
          @mouseleave="handleMouseleave"
        >{{item.name}}</div>
      </el-menu-item>

      <div class="user-profile-container" trigger="click">
        <div class="user-profile-content">
          <el-dropdown>
            <div class="user-profile-body">
              <img class="user-avatar" src="https://img.alicdn.com/tfs/TB1ONhloamWBuNjy1XaXXXCbXXa-200-200.png" />
              <span class="user-name">admin</span>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <!-- <router-link tag="span" to="/">
                                <el-dropdown-item>我的主页</el-dropdown-item>
              </router-link>-->
              <router-link tag="span" to="/">
                <el-dropdown-item>消息</el-dropdown-item>
              </router-link>
              <el-dropdown-item>
                <span @click="logout" style="display:block;">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-menu>
    <!-- <transition name="menu-transform"> -->
    <div class="top-menu" v-show="showTopMenu" @mouseenter="handleMouseEnter" @mouseleave="handleMouseleave">
      <ElRow class="top-menu-row">
        <ElCol :span="4" class="left">
          <ul>
            <li
              v-for="item in leftMenu"
              @mouseenter="activeMenu = item.index"
              :key="item.index"
              :class="{active: item.index === activeMenu}"
            >{{item.name}}</li>
          </ul>
        </ElCol>
        <ElCol :span="20" class="right">
          <ElRow :gutter="20">
            <ElCol :span="12">
              <ElTree
                @node-click="toRouter"
                :data="currentMenu"
                :props="defaultProps"
                :indent="22"
                :expand-on-click-node="false"
                default-expand-all
              >
                <div slot-scope="{node, data}">
                  <div class="top-menu-node">
                    <h3>
                      <a>{{data.name}}</a>
                    </h3>
                    <span>{{data.desc}}</span>
                  </div>
                </div>
              </ElTree>
            </ElCol>
            <ElCol class="help" :span="12" v-if="currentMenu && currentMenu.length">
              <h3>帮助文档</h3>
              <ul>
                <li class="help-item" v-for="item in currentMenu">{{item.name}}</li>
              </ul>
            </ElCol>
          </ElRow>
        </ElCol>
      </ElRow>
      <ElButton class="close-btn" type="text" icon="el-icon-close info" @click="handleMouseleave"></ElButton>
    </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import { authMethods } from 'Store/helper/auth'
export default {
  name: 'NavBar',
  data() {
    return {
      showTopMenu: false,
      // leftMenu: [
      //     {
      //         name: '通用',
      //         index: 'common'
      //     },
      //     {
      //         name: 'Amazon',
      //         index: 'amazon'
      //     },
      //     {
      //         name: 'eBay',
      //         index: 'ebay'
      //     }
      // ],
      // menuData: {
      //     common: [
      //         {
      //             label: '仓库产品',
      //             url: '',
      //             desc:
      //                 '自己仓库的产品维护，完善产品的仓库信息正常状态的可以到各个平台上架',
      //             children: [
      //                 {
      //                     label: '新增仓库产品',
      //                     url: '',
      //                     desc: '添加仓库产品'
      //                 },
      //                 {
      //                     label: '批量上传仓库产品',
      //                     url: '',
      //                     desc: '添加或修改多个仓库产品，表格上传'
      //                 }
      //             ]
      //         },
      //         {
      //             label: '耗材',
      //             url: '',
      //             desc: '仓库耗材、办公耗材等其他耗材管理'
      //         },
      //         {
      //             label: '设置',
      //             url: '/product/common/setup/category',
      //             desc: '产品类目，sku生成规则、标题规则、敏感关键词设置'
      //         }
      //     ]
      // },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeMenu: 'common',
      topActive: null
    }
  },
  methods: {
    ...authMethods,
    toRouter(data) {
      const { url } = data
      url &&
        this.$router.push({
          path: url
        })

      this.handleMouseleave()
    },
    logout() {
      this.loggOut()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleSelect(index) {
      this.$router.push(this.$store.state.auth.mainMenu[index].url)
    },
    handleMouseEnter(e, active) {
      clearTimeout(this.timer)
      this.timer = null
      if (active) {
        this.topActive = active
      }

      this.showTopMenu = true
    },
    handleMouseleave() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.showTopMenu = false
      }, 200)
    }
  },
  computed: {
    // 当前模块的菜单
    currentTopMenu() {
      return this.mainMenu[this.defaultActive] || { children: [] }
    },
    // 当前模块左侧菜单
    leftMenu() {
      return this.currentTopMenu.children.map(el => ({
        name: el.name,
        index: el.activeIndex
      }))
    },
    // 当前模块右侧菜单
    menuData() {
      let ret = {}
      this.currentTopMenu.children.forEach(el => {
        ret[el.activeIndex] = el.children
      })
      return ret
    },
    defaultActive() {
      return this.topActive || this.$route.path.split('/')[1]
      // this.$store.state.auth.mainMenu.find(el => this.$route.path.split('/')[1].indexOf(f1) > -1)
    },
    currentMenu() {
      return this.menuData[this.activeMenu]
    },
    mainMenu() {
      return this.$store.state.auth.mainMenu
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .logo {
    float: left;
    img {
      height: 60px;
    }
  }
  .user-profile-container {
    position: absolute;
    right: 20px;
    cursor: pointer;
    .user-profile-content {
      display: flex;
      padding: 20px 0;
    }
    .menu-icons {
      display: flex;
      align-items: center;
      .menu-icon {
        padding: 0 12px;
        .icon {
          display: inline-block;
          font-size: 18px;
          text-align: center;
        }
      }
    }
    .user-profile-body {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-right: 14px;
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      margin: 0 8px 0 12px;
      border-radius: 4px;
    }
    .user-name {
      color: rgba(0, 0, 0, 0.65);
    }
    .user-department {
      font-size: 12px;
      color: rgba(102, 102, 102, 0.65);
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: 0;
      top: 13px;
      font-size: 12px;
    }
  }
}
.top-menu {
  position: absolute;
  background: #fff;
  z-index: 9999;
  left: 0;
  right: 0;
  bottom: 0;
  top: 64px;

  .top-menu-row {
    max-width: 1120px;
    margin: 0 auto;
    height: 100%;
    .left {
      text-align: right;
      padding: 20px;
      border-right: 1px solid #ddd;
      height: 100%;
      li {
        font-size: 16px;
        font-weight: bold;
        color: #000;
        line-height: 42px;
        cursor: default;
        &:hover,
        &.active {
          color: $titleColor;
        }
      }
    }
    .right {
      padding: 20px;
      .top-menu-node > span {
        width: 100%;
        white-space: normal;
        line-height: 1.4;
      }
    }
  }
  .help {
    & h3 {
      font-size: 18px;
      color: #000;
      font-weight: bold;
    }
    ul {
      border: 1px solid $boxBorderColor;
      border-width: 0 0 1px 1px;
    }
    &-item {
      line-height: 24px;
      font-size: 14px;
      cursor: pointer;
      padding: 10px 16px;
      border: 1px solid $boxBorderColor;
      border-width: 1px 1px 0 0;
      &:first-child {
        border-top-color: $subColor;
      }
      &:hover {
        color: $subColor;
      }
    }
  }
  .close-btn {
    position: absolute;
    top: 20px;
    right: 40px;
  }
}
</style>

