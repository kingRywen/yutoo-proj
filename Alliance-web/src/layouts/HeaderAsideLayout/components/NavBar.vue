<template>
  <div class="navbar-wrapper">
    <el-menu
      @select="handleSelect"
      router
      ref="menu"
      :default-active="activeIndex"
      class="navbar"
      mode="horizontal"
      background-color="#242424"
      text-color="#e8e8e8"
      active-text-color="#108ee9"
    >
      <li class="el-menu-item is-logo">
        <div class="logo">{{$route.name === 'allotTask' ? '联盟操作' : '联盟代理'}}</div>
      </li>
      <template v-if="isAdmin">
        <el-menu-item index="/dash">
          <i class="iconfont">&#xeb8f;</i>类目
        </el-menu-item>
        <!-- <el-menu-item index="/identification">
          <i class="iconfont">&#xeb8a;</i>终端账号
        </el-menu-item>-->
        <el-submenu :hide-timeout="100" :show-timeout="100" index="/identification">
          <template slot="title">
            <i class="iconfont">&#xeb8a;</i>
            <!-- {{firstName}} -->
            终端账号
          </template>
          <el-menu-item index="/identification">账号</el-menu-item>
          <el-menu-item index="/app">手机</el-menu-item>
          <el-menu-item index="/pc">PC</el-menu-item>
          <el-menu-item index="/vm">虚拟机</el-menu-item>
        </el-submenu>
        <!-- <el-submenu :hide-timeout="100" :show-timeout="100" index="/order">
          <template slot="title">
            <i class="iconfont">&#xec37;</i>
            {{firstName}}
            商户订单
          </template>
          <el-menu-item index="/order/list">订单列表</el-menu-item>
          <el-menu-item index="/order/payment_record">付款记录</el-menu-item>
        </el-submenu>-->

        <el-submenu :hide-timeout="100" :show-timeout="100" index="/task">
          <template slot="title">
            <i class="iconfont">&#xec35;</i>
            任务中心
          </template>
          <el-menu-item index="/task/source">任务</el-menu-item>
          <!-- <el-menu-item index="/task">代理任务</el-menu-item> -->
          <el-menu-item index="/task/al">操作员任务</el-menu-item>
        </el-submenu>

        <el-submenu :hide-timeout="100" :show-timeout="100" index="/recharge">
          <template slot="title">
            <i class="iconfont">&#xe662;</i>
            充值消费
          </template>
          <el-menu-item index="/recharge/ship">充值</el-menu-item>
          <el-menu-item index="/recharge/record">消费记录</el-menu-item>
          <el-menu-item index="/recharge/settings">充值设置</el-menu-item>
        </el-submenu>

        <!-- <el-menu-item index="/recircle">
          <i class="iconfont">&#xe61f;</i>商品回收
        </el-menu-item>-->

        <el-submenu :hide-timeout="100" :show-timeout="100" index="5">
          <template slot="title">
            <i class="iconfont">&#xec6b;</i>
            内容库
          </template>
          <el-menu-item index="/content_repository/evaluate">评价库</el-menu-item>
          <el-menu-item index="/content_repository/qa">问答库</el-menu-item>
          <el-menu-item index="/content_repository/message">站内信</el-menu-item>
        </el-submenu>
        <el-submenu :hide-timeout="100" :show-timeout="100" index="6">
          <template slot="title">
            <i class="iconfont">&#xe6ae;</i>
            系统管理
          </template>
          <!-- <el-menu-item index="/sys/role">角色管理</el-menu-item> -->
          <el-menu-item index="/sys/operator">操作员管理</el-menu-item>

          <!-- <el-menu-item index="/content_repository/qa">问答库</el-menu-item>
          <el-menu-item index="/content_repository/message">站内信</el-menu-item>-->
        </el-submenu>
      </template>

      <li class="el-menu-item user-profile">
        <div class="user-profile-container" trigger="click">
          <div class="user-profile-content">
            <el-dropdown @command="logout">
              <div class="user-profile-body">
                <img class="user-avatar" src="https://img.alicdn.com/tfs/TB1ONhloamWBuNjy1XaXXXCbXXa-200-200.png" />
                <span class="user-name">{{userInfo.username}}</span>
              </div>
              <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <el-dropdown-item command="e" v-if="isAdmin">
                  <span class="btn">
                    <i class="iconfont">&#xeb8a;</i>
                    <span>商户中心</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item command="a" v-if="isAdmin">
                  <span class="btn">
                    <i class="iconfont">&#xeb94;</i>
                    <span>邮件模板</span>
                  </span>
                </el-dropdown-item>
                <!-- <el-dropdown-item command="b">
                  <span class="btn">
                    <i class="iconfont">&#xeb9c;</i>
                    <span>修改密码</span>
                  </span>
                </el-dropdown-item>-->
                <el-dropdown-item command="c">
                  <span class="btn">
                    <i class="iconfont">&#xeb6a;</i>
                    <span>注销</span>
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </li>
      <li class="el-menu-item user-profile custom-menu-file">
        <el-menu
          :default-active="activeIndex1"
          mode="horizontal"
          background-color="#242424"
          text-color="#e8e8e8"
          active-text-color="#108ee9"
          @select="handleSiteMenuSelect"
        >
          <el-submenu
            :hide-timeout="100"
            :show-timeout="100"
            popper-class="custom-submenu"
            style="float:right;margin-right:-20px"
            index="6"
          >
            <template slot="title">{{activePlatName}}</template>
            <el-menu-item v-for="(item, index) in platformList" :index="item.enName" :key="index">
              <el-submenu :index="`6-${index}`">
                <template slot="title">{{item.enName}}</template>
                <el-menu-item
                  v-for="(i, subIndex) in item.childs"
                  :index="i.platformSiteId +'-' + i.cnName"
                  :key="subIndex"
                >{{i.cnName}}</el-menu-item>
              </el-submenu>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </li>
      <!-- <li class="el-menu-item user-profile">
        <i class="el-icon-bell" style="color:#f2f2f2"></i>
      </li>-->
    </el-menu>
    <div v-if="info.length && isAdmin">
      <el-alert show-icon center type="warning" @close="handleMouseEnter">
        <template slot="title">
          <div class="text-box" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <div class="text-wrapper">
              <div v-for="(item, index) in info" :key="index" v-html="item"></div>
            </div>
          </div>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script>
import USA from '@/assets/images/USA.png'
import storage from 'Utils/saver'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'NavBar',
  props: ['isCollapse'],
  data() {
    return {
      passBtnLoading: false,
      // info: [
      //   `温馨提醒：IP资源不足，请及时<a href="#">购买</a>`,
      //   `提醒1`,
      //   '提醒2'
      // ],
      visible: false,
      firstName: '订单',
      secondName: '内容库',
      activePlatName: '加载中...',
      activeIndex1: '',
      activeIndex: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.activeIndex = vm.$route.path
    })
  },
  async created() {
    this.activeIndex = this.$route.path.replace(/\/$/, '')
    this.setName(this.activeIndex)

    await this.getPlatform()
    this.activePlatName = this.defalutSiteName
    this.activeIndex1 = this.defalutSiteIndex
    // this.getUserInfo()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  // mounted() {
  //   // this.setMove()
  // },
  methods: {
    ...mapActions(['getUserInfo', 'getPlatform', 'getSite']),
    setMove() {
      let box = document.querySelectorAll('.text-wrapper')[0]
      if (this.info.length > 1 && box) {
        clearInterval(this.timer)
        this.timer = null
        this.index = this.index || 1
        this.timer = setInterval(() => {
          if (this.index >= this.info.length) {
            this.index = 0
          }
          let style = window.getComputedStyle(box)
          let height = parseInt(style.height)
          box.style.transform = `translateY(-${18 * this.index}px)`
          this.index++
        }, 3000)
      }
    },
    handleMouseEnter() {
      clearInterval(this.timer)
      this.timer = null
    },
    handleMouseLeave() {
      this.setMove()
    },
    handleClose() {
      this.$refs.form.resetFields()
    },
    handleSiteMenuSelect(index, indexPath) {
      //

      if (indexPath.length > 2) {
        const loading = this.$loading({
          lock: true,
          text: '切换中',
          spinner: 'el-icon-loading'
          // background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$api[`main/sysUserChangeSite`](+index.split('-')[0])
          .then(() => {
            loading.close()
            // console.log(index, indexPath)
            let platformList = this.$store.state.platformList
            let curPlat = platformList.find(el => el.enName == indexPath[1])
            let curSite = curPlat.childs.find(
              el => el.cnName == indexPath[3].split('-')[1]
            )
            let currentSiteInfo = {
              ...curSite,
              platformCode: curPlat.code,
              selectedSite: [curPlat.enName, curSite.platformSiteId]
            }
            this.$store.commit('setcurrentSiteInfo', currentSiteInfo)
            this.$store.commit(
              'setdefaultSiteName',
              indexPath[1] + '-' + indexPath[3].split('-')[1]
            )
            // if (!this.isAdmin) {
            //   this.setName()
            //   GLOBAL.vbus.$emit('dash.refresh')
            //   return
            // }
            // this.$router.push({ name: 'dash' })
            this.setName()
            // GLOBAL.vbus.$emit('dash.refresh')
            GLOBAL.vbus.$emit('appmain.refresh')
          })
          .catch(err => {
            loading.close()
            console.error(err)
          })
      }
    },
    handleSelect(index, indexPath) {
      //
      this.setName(indexPath[1])
      if (indexPath.slice(0).shift() === '6') {
        this.$router.push({ name: 'dash' })
      }
    },
    setName(path) {
      if (!path) {
        this.firstName = '订单'
        this.secondName = '内容库'
        return
      }
      let _path = path.split('/')
      let firstPath = _path[1]
      let secondPath = _path[2]
      if (firstPath === 'order') {
        this.secondName = '内容库'
        if (secondPath === 'list') {
          this.firstName = '订单列表'
        }
        if (secondPath === 'payment_record') {
          this.firstName = '付款记录'
        }
      } else if (firstPath === 'content_repository') {
        this.firstName = '订单'
        if (secondPath === 'evaluate') {
          this.secondName = '评价库'
        }
        if (secondPath === 'qa') {
          this.secondName = '问答库'
        }
        if (secondPath === 'message') {
          this.secondName = '站内信'
        }
      }
    },
    logout(command) {
      if (command === 'a' || command === 'e') {
        this.$refs.menu.activeIndex = ''
        this.activeIndex = ''
        this.setName()
        this.$router.push({ name: command === 'a' ? 'emailSettings' : 'user' })
      }
      if (command === 'b') {
        this.visible = true
      }
      if (command === 'c') {
        let checkAccount = storage.get('local', 'checkAccount')
        let username = storage.get('local', 'username')
        if (this.$route.name === 'allotTask') {
          storage.remove('local', 'token_a')
          storage.remove('local', 'userInfo_a')
        } else {
          storage.remove('local', 'token')
          storage.remove('local', 'userInfo')
        }
        if (checkAccount) {
          storage.set('local', 'checkAccount', checkAccount)
          storage.set('local', 'username', username)
        }
        sessionStorage.clear()
        this.$router.push({ name: this.isAdmin ? 'login' : 'allotLogin' })
      }
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'platformList',
      'siteList',
      'defalutSiteName',
      'defaultSiteIndex',
      'msg'
    ]),
    info() {
      return this.msg
    },
    isAdmin() {
      return this.$store.state.userInfo.isAdmin
    },
    username() {
      let username = storage.get('local', 'username')
      return username
    }
  },
  watch: {
    info(val) {
      if (val.length > 1) {
        this.setMove()
      }
    },
    defalutSiteName(val) {
      this.activePlatName = val
    },
    defaultSiteIndex: {
      immediate: true,
      handler(val) {
        this.activeIndex1 = val
      }
    },
    $route(to) {
      this.activeIndex = to.path.replace(/\/$/, '')
      this.setName(this.activeIndex)
    }
  }
}
</script>

<style lang="scss">
.navbar-wrapper {
  .el-alert--warning {
    background-color: rgba(255, 186, 84, 0.2);
    color: #d6850b;
    border-radius: 0;
    .el-alert__closebtn {
      color: #d6850b;
    }
  }

  .tips-info {
    width: 100%;
    // background: rgba(0, 0, 0, 0.1);
    padding: 10px;
    box-sizing: border-box;
  }
  .text-box {
    height: 18px;
    line-height: 18px;
    overflow: hidden;
    .text-wrapper {
      transition: all 0.25s ease-in-out;
    }
  }

  .navbar {
    &.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
      background-color: #242424;
    }
    &.el-menu.el-menu--horizontal {
      overflow: hidden;
      overflow-x: auto;
      height: 60px;
      line-height: 60px;
      border-bottom: none;
      box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.04);

      z-index: 22;
    }
    .el-menu-item.is-logo:hover,
    .el-menu-item.is-logo:focus {
      background: #000;
    }

    .logo {
      float: left;
      // background: #ddd;
      height: 64px;
      display: flex;
      align-items: center;
      width: 200px;
      justify-content: center;
      font-weight: bolder;
      font-size: 24px;
      color: #fff;
    }
    .iconfont {
      margin-right: 6px;
      font-size: 18px;
    }

    .user-profile {
      float: right;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      .user-profile-container {
        .user-profile-content {
          .el-dropdown {
            .user-profile-body {
              .user-avatar {
                width: 20px;
              }
              .user-name {
                color: #fff;
                margin-left: 6px;
              }
            }
          }
        }
      }
    }
    .custom-menu-file {
      padding: 0 10px;
      height: 60px;
      line-height: 60px;

      .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
        color: #fff !important;
        border-bottom: none;
        i {
          color: #fff;
        }
      }
      & > .el-menu--horizontal {
        height: 60px;
        line-height: 60px;
        border: none;
        & > .el-submenu {
          height: 60px;
          line-height: 60px;
          margin-right: 0 !important;
          & > .el-submenu__title {
            height: 60px;
            line-height: 60px;
          }
        }
      }
    }
    .el-submenu.is-active,
    .el-submenu.is-opened {
      height: 60px;
      line-height: 60px;
      border-bottom: none;
      i {
        color: #108ee9;
      }
    }
  }
}
.user-dropdown {
  .el-dropdown-menu__item {
    span.btn {
      display: flex;
      align-items: center;
      i {
        font-size: 12px;
        margin-right: 4px;
      }
    }
  }
}
.custom-submenu {
  .el-submenu__title {
    background-color: transparent !important;
  }
  & > .el-menu--popup-bottom-start {
    margin-top: 1px;
    .el-icon-arrow-right {
      right: 0px;
    }
    .el-menu--horizontal {
      top: -5px !important;
      left: 104px !important;
    }
  }
  .el-menu--popup {
    min-width: 108px;
    width: 108px;
    .el-menu-item {
      min-width: 100%;
      width: 100%;
    }
  }
}
</style>

