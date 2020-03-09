<template>
  <div>
    <el-menu
      class="navbar"
      mode="horizontal"
      background-color="#232f3e"
      text-color="#e8e8e8"
      active-text-color="#3ab6fe"
      router
      ref="nav"
      :default-active="defaultActive"
    >
      <div class="logo">
        <span>联盟</span>
      </div>
      <template v-for="(item, index) in menuList">
        <el-menu-item v-if="!item.children" :index="item.path" :key="item.path">
          <div class="nav-item">{{item.name}}</div>
        </el-menu-item>
        <el-submenu v-else :index="index + ''" :key="index">
          <template slot="title">{{item.name}}</template>
          <el-menu-item v-for="sub in item.children" :index="sub.path" :key="sub.path">{{sub.name}}</el-menu-item>
        </el-submenu>
      </template>

      <div class="user-profile-container" trigger="click">
        <div class="user-profile-content">
          <a href="javascript:;" class="intro" @click="startIntro">操作指南</a>
          <div class="menu-icons top-menu-row">
            <ElPopover v-model="showPop" popper-class="bell-wrapper" title="消息通知" placement="bottom" trigger="hover">
              <ul class="bell">
                <li class="bell--item" @click="showItem(i.id)" v-for="i in msgs">
                  <h5>{{i.title}}</h5>
                  <p>{{i.content}}</p>
                  <!-- <span>2019-11-12</span> -->
                </li>
                <li class="txc">
                  <ElButton @click="showAll" type="text">查看所有</ElButton>
                </li>
              </ul>
              <a href="javascript:;" slot="reference" class="menu-icon">
                <el-badge v-if="showMsg" is-dot class="item">
                  <i class="el-icon-bell icon"></i>
                </el-badge>
                <i v-else class="el-icon-bell icon"></i>
              </a>
            </ElPopover>
          </div>
          <el-dropdown class="ml10">
            <div class="user-profile-body">
              <el-avatar size="small" class="mr10" icon="el-icon-user-solid"></el-avatar>
              <!-- <img class="user-avatar" src="https://img.alicdn.com/tfs/TB1ONhloamWBuNjy1XaXXXCbXXa-200-200.png" /> -->
              <span class="user-name">{{$store.state.auth.userInfo.username}}</span>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <router-link tag="span" to="/user">
                <el-dropdown-item>
                  <span style="display:block;">商户中心</span>
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item>
                <span @click="logout" style="display:block;">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { authMethods } from 'Store/helper/auth'
export default {
  name: 'NavBar',
  data() {
    return {
      lastMsgTime: this.$storage.get('local', 'seeMsgTime') || 0,
      msgs: [],
      showPop: false,
      // 菜单
      menuList: [
        {
          name: '任务中心',
          path: '/dash'
        },
        {
          name: '充值消费',
          children: [
            {
              name: '充值',
              path: '/recharge'
            },
            {
              name: '消费记录',
              path: '/spend_list'
            }
          ]
        },
        // {
        //   name: '商品回收',
        //   path: '/recycling'
        // },
        {
          name: '店铺管理',
          path: '/stores'
        }
        // {
        //   name: '帮助',
        //   path: '/help'
        // }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      circleUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      activeMenu: 'common',
      topActive: null
    }
  },
  methods: {
    ...authMethods,
    startIntro() {
      GLOBAL.vbus.$emit('intro.start', true)
    },
    getNewMsg() {
      this.$api[`agent/merchantMessageNewest`]({}).then(data => {
        this.msgs = data.rows
      })
    },
    showAll() {
      this.$router.push('/message')
      this.showPop = false
    },
    showItem(id) {
      this._openDialog({
        size: 'medium',
        title: '消息详情',
        params: { id },
        cancelBtnText: '关闭',
        component: () => import('Views/Message/dialogs/view.vue')
      })
      this.$storage.set('local', 'seeMsgTime', Date.now())

      this.showPop = false
    },
    toRouter(data) {
      const { url } = data
      url &&
        this.$router.push({
          path: url
        })
    },
    logout() {
      this.loggOut()
      if (this.$route.path === '/editPass') {
        return this.$router.push(`/login`)
      }
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
    // handleSelect(index) {
    //   this.$router.push(this.$store.state.auth.mainMenu[index].url)
    // }
  },
  created() {
    this.getNewMsg()
    GLOBAL.vbus.$on('nav.open', open => {
      if (open) {
        this.$refs.nav && this.$refs.nav.open('1')
      } else {
        this.$refs.nav && this.$refs.nav.close('1')
      }
    })
  },
  computed: {
    // 是否显示消息
    showMsg() {
      if (!this.msgs.length) {
        return false
      }
      let latestTime = Math.max.apply(
        Math,
        this.msgs.map(el => new Date(el.noticeStartDate).getTime())
      )
      return latestTime - 24 * 3600 * 1000 > this.lastMsgTime
    },
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
      return this.$route.path.replace(/\/$/, '')
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
  color: #fff;
  height: 60px;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .logo {
    float: left;
    text-align: center;
    width: 180px;
    span {
      font-size: 24px;
      font-weight: bold;
      line-height: 64px;
      margin-left: 20px;
      margin-right: 20px;
    }
    // img {
    //   height: 60px;
    // }
  }
  .user-profile-container {
    position: absolute;
    right: 20px;
    cursor: pointer;
    .user-profile-content {
      display: flex;
      padding: 0;
      align-items: center;
      height: 59px;
      .intro {
        font-size: 14px;
        text-decoration: none;
        color: #ddd;
        &:hover {
          color: #999;
        }
      }
    }
    .menu-icons {
      display: flex;
      align-items: center;
      :link,
      :visited {
        color: #fff;
      }
      :hover {
        color: #a8a8a8;
      }
      .menu-icon {
        padding: 0 12px;
        .icon {
          font-family: 'iconfont' !important;
          font-size: 16px;
          font-style: normal;

          display: inline-block;
          font-size: 18px;
          font-weight: normal;
          text-align: center;
          &:before {
            content: '\e60f';
          }
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
      color: rgba(255, 255, 255, 0.65);
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
  top: 61px;

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
<style lang="scss">
.bell-wrapper {
  top: 48px !important;
  font-size: 14px;
  padding: 0;
  .bell {
    display: flex;
    flex-direction: column;
    .bell--item {
      font-size: 12px;
      padding: 14px;
      border-bottom: 1px solid #f2f2f2;
      cursor: pointer;
      p {
        float: left;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        float: right;
      }
      &:hover {
        background-color: #f3fbff;
      }
      * {
        margin: 10px 0;
      }
      * + * {
        margin: 6px 0;
      }
      h5 {
        max-width: 300px;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        margin: 0;
      }
      p,
      span {
        color: #999;
      }
    }
  }
  .el-popover__title {
    margin-bottom: 0;
    font-size: 14px;
    padding: 14px;
    font-weight: bold;
    min-width: 230px;
    color: #000;
    border-bottom: 1px solid #f2f2f2;
  }
}
.el-menu.el-menu--horizontal {
  border: none;
}
.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: 4px solid $titleColor !important;
}

.el-menu--popup-bottom-start {
  margin-top: 1px !important;
}

.el-menu--popup-bottom-start {
  margin-top: 0 !important;
  background: rgba(35, 47, 62, 0.8) !important;
  .el-menu-item {
    background: transparent !important;
    &:hover {
      background: rgba(35, 47, 62, 0.8) !important;
    }
  }
}
.el-menu--popup {
  background: rgba(35, 47, 62, 0.85) !important;
  border-radius: 0;
}
.user-dropdown {
  .el-dropdown-menu__item {
    padding: 0;
    span {
      padding: 0 20px;
    }
  }
}
.el-menu--horizontal > .el-submenu {
  .el-submenu__title {
    border: none;
    color: #000;
    &:hover {
      color: $hoverColor;
    }
  }
  &.is-active {
    .el-submenu__title {
      border: none;
      color: $hoverColor;
    }
  }
}
</style>