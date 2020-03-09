<template>
  <div class="navbar-wrapper">
    <el-menu
      @select="handleSelect"
      router
      ref="menu"
      background-color="#242424"
      text-color="#c7c7c7"
      active-text-color="#FF9800"
      :default-active="activeIndex"
      class="navbar"
      mode="horizontal"
    >
      <li class="el-menu-item">
        <div class="logo">联盟中心</div>
      </li>
      <div class="el-menu--horizontal menu-box">
        <template v-for="(r, index) in navList">
          <el-menu-item :key="index" v-if="!r.childs" :index="r.path">
            <i class="iconfont" v-html="r.icon">{{r.icon}}</i>
            {{r.name}}
          </el-menu-item>
          <el-submenu :hide-timeout="100" :show-timeout="100" :key="index" v-else :index="r.path">
            <template slot="title">
              <i class="iconfont" v-html="r.icon">{{r.icon}}</i>
              {{r.name}}
            </template>
            <el-menu-item v-for="(sub, i) in r.childs" :index="sub.path" :key="i">{{sub.name}}</el-menu-item>
          </el-submenu>
        </template>
      </div>

      <!-- <el-menu-item index="/identification">
        <i class="iconfont">&#xeb8a;</i>账号
      </el-menu-item>
      <el-submenu index="/order">
        <template slot="title">
          <i class="iconfont">&#xec37;</i>
          {{firstName}}
        </template>
        <el-menu-item index="/order/list">订单列表</el-menu-item>
        <el-menu-item index="/order/payment_record">付款记录</el-menu-item>
      </el-submenu>
      <el-menu-item index="/task">
        <i class="iconfont">&#xec35;</i>任务
      </el-menu-item>
      <el-submenu index="5">
        <template slot="title">
          <i class="iconfont">&#xec6b;</i>
          {{secondName}}
        </template>
        <el-menu-item index="/content_repository/evaluate">评价库</el-menu-item>
        <el-menu-item index="/content_repository/qa">问答库</el-menu-item>
        <el-menu-item index="/content_repository/message">站内信</el-menu-item>
      </el-submenu>-->
      <!-- <li class="el-menu-item user-profile">
        <div class="user-profile-container" @click="$router.push('/Notify')" trigger="click">
          <i class="el-icon-bell"></i>
        </div>
      </li>-->
      <li class="el-menu-item user-profile">
        <div class="user-profile-container" trigger="click">
          <div class="user-profile-content">
            <el-dropdown @command="logout">
              <div class="user-profile-body">
                <i class="iconfont">&#xe613;</i>
                <span class="user-name">{{userInfo.username}}</span>
              </div>
              <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <el-dropdown-item command="b">
                  <span class="btn">
                    <i class="iconfont">&#xeb9c;</i>
                    <span>修改密码</span>
                  </span>
                </el-dropdown-item>
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
    </el-menu>
    <div>
      <el-alert v-if="showAlert" show-icon center type="warning" @close="handleMouseEnter">
        <template slot="title">
          <div class="text-box" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <div class="text-wrapper">
              <div v-for="(item) in info" v-html="item"></div>
            </div>
          </div>
        </template>
      </el-alert>
    </div>
    <el-dialog title="修改密码" :visible.sync="visible" width="500px" @close="handleClose">
      <el-form :model="modifyFormData" label-width="76px" ref="form" size="small">
        <ElFormItem label="账号">
          <el-tag type="success">{{$store.state.userInfo.username}}</el-tag>
        </ElFormItem>
        <ElFormItem label="原密码" prop="pswd" :rules="[{required: true, message: '请输入原密码'}]">
          <el-input v-model="modifyFormData.pswd"></el-input>
        </ElFormItem>
        <ElFormItem label="新密码" prop="newPswd" :rules="checkPass">
          <el-input v-model="modifyFormData.newPswd"></el-input>
        </ElFormItem>
      </el-form>
      <div class="txc">
        <el-button size="small" type="primary" @click="editPassword" :loading="passBtnLoading">确认</el-button>
        <el-button size="small" @click="visible= false">取消</el-button>
      </div>
    </el-dialog>
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
      showAlert: false,
      checkPass: this.$const['OTHER/checkPass'],
      navList: [
        // {
        //   path: '/PlatformManagement',
        //   name: '平台管理',
        //   childs: [
        //     {
        //       path: '/PlatformManagement',
        //       name: '国家'
        //     },
        //     {
        //       path: '/PlatformManagement/platform',
        //       name: '平台'
        //     },
        //     {
        //       path: '/PlatformManagement/platform',
        //       name: '平台站点'
        //     }
        //   ]
        // }
      ],
      passBtnLoading: false,
      modifyFormData: {
        pswd: '',
        newPswd: ''
      },
      // info: [],
      visible: false,
      firstName: '订单',
      secondName: '内容库',
      activePlatName: '',
      activeIndex1: '',
      activeIndex: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.activeIndex = vm.$route.path
    })
  },
  created() {
    let list = []
    function getRouter(routes, parent) {
      routes.forEach(element => {
        if (parent) {
          if (!element.meta || (element.meta && !element.meta.noMenu)) {
            parent.childs.push({
              path: parent.path + '/' + element.path,
              name: element.meta && element.meta.title
            })
          }
        } else {
          if (!element.meta || (element.meta && !element.meta.noMenu)) {
            let r = {
              path: (element.meta && element.meta.path) || element.path,
              name: element.meta && element.meta.title,
              icon: element.meta && element.meta.icon
            }
            list.push(r)

            if (element.children) {
              if (element.meta && element.meta.path) return
              r.childs = []
              getRouter(element.children, r)
            }
          }
        }
      })
    }
    getRouter(this.$router.options.routes)
    this.navList = list
    this.setMenuActive()
    this.getPlatform()
  },
  // mounted() {
  //   this.setMove()
  // },
  methods: {
    ...mapActions(['getPlatform', 'getSite']),

    handleMouseEnter() {
      clearInterval(this.timer)
      this.timer = null
    },
    handleMouseLeave() {
      this.setMove()
    },

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

    setMenuActive() {
      this.activeIndex = this.$route.matched[1].path
    },
    editPassword() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.passBtnLoading = true
          this.$api[`main/sysUserUpdatePswd`](this.modifyFormData)
            .then(data => {
              this.visible = false
              this.passBtnLoading = false
            })
            .catch(err => {
              this.passBtnLoading = false
            })
        }
      })
    },
    handleClose() {
      this.$refs.form.resetFields()
    },
    handleSiteMenuSelect(index, indexPath) {
      console.log(index, indexPath)

      if (indexPath.length > 2) {
        this.$api[`main/sysUserChangeSite`](+index.split('-')[0])
          .then(data => {
            this.$store.commit(
              'setdefaultSiteName',
              indexPath[1] + '-' + indexPath[3].split('-')[1]
            )
            this.$router.push({ name: 'dash' })
            this.setName()
            GLOBAL.vbus.$emit('dash.refresh')
          })
          .catch(err => {})
      }
    },
    handleSelect(index, indexPath) {
      // console.log(index, indexPath)
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
      if (command === 'a') {
        this.$refs.menu.activeIndex = ''
        this.activeIndex = ''
        this.setName()
        this.$router.push({ name: 'emailSettings' })
      }
      if (command === 'b') {
        this.visible = true
      }
      if (command === 'c') {
        let checkAccount = storage.get('local', 'checkAccount')
        let username = storage.get('local', 'username')
        if (checkAccount) {
          storage.set('local', 'checkAccount', checkAccount)
          storage.set('local', 'username', username)
        }
        storage.remove('local', 'token')
        sessionStorage.clear()
        this.$router.push('/login')
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
      return this.msg || []
    },
    username() {
      let username = storage.get('local', 'username')
      return username
    }
  },
  watch: {
    info(val) {
      if (val && val.length) {
        this.showAlert = true
      }
      if (val.length > 1) {
        this.setMove()
      }
    },
    defalutSiteName(val) {
      this.activePlatName = val
    },
    defaultSiteIndex(val) {
      this.activeIndex1 = val
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
}
.custom-submenu {
  .el-submenu__title {
    padding: 0 10px;
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
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
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
  /*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: #333333;
  }

  /*定义滑块
 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: none;
    background-color: rgba(96, 98, 102, 0.7);
  }
  .menu-box {
    display: flex;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .iconfont {
    margin-right: 6px;
    font-size: 18px;
  }

  // .el-submenu__title i,
  // .el-menu-item i {
  //   color: #c7c7c7;
  //   :hover {
  //     color: #fff;
  //   }
  // }
  .el-menu--horizontal
    > .el-menu-item:not(.is-disabled):not(.custom-menu-file):hover,
  .el-menu--horizontal
    > .el-menu-item:not(.is-disabled):not(.custom-menu-file):focus {
    background: #363636;
  }
  .el-menu--horizontal > .el-menu-item.custom-menu-file:not(.is-disabled):hover,
  .el-menu--horizontal
    > .el-menu-item.custom-menu-file:not(.is-disabled):focus {
    background: #444;
  }

  .el-menu--horizontal {
    & > .el-menu-item {
      border: none;
      &.is-active {
        border: none;
        background-color: #111111 !important;
        .el-submenu__title {
          border-bottom-color: transparent !important;
        }
      }
    }
    & > .el-submenu.is-active .el-submenu__title {
      border-bottom-color: transparent !important;
      background-color: #111111 !important;
    }
  }

  .el-submenu__title {
    padding: 0 14px;
  }

  .user-profile {
    float: right;
    .user-profile-container {
      .user-profile-content {
        .el-dropdown {
          .user-profile-body {
            .user-avatar {
              width: 20px;
            }
            .user-name {
              margin-left: 6px;
              color: #909399;
            }
          }
        }
      }
    }
  }
  .custom-menu-file {
    height: 60px;
    line-height: 60px;
    & > .el-menu--horizontal {
      height: 60px;
      line-height: 60px;
      border: none;
      & > .el-submenu {
        height: 60px;
        line-height: 60px;
        & > .el-submenu__title {
          height: 60px;
          line-height: 60px;
          background-color: #333;
        }
        &.is-active {
          .el-submenu__title {
            background-color: #444 !important;
            color: #fff !important;
            border-bottom: 0;
          }
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
      color: #c7c7c7;
    }
  }
  .el-submenu.is-active {
    i {
      color: #ff9800;
    }
  }
}
.user-dropdown {
  .el-dropdown-menu__item {
    span {
      display: flex;
      align-items: center;
      i {
        font-size: 12px;
        margin-right: 4px;
      }
    }
  }
}
</style>

