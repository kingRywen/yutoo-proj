<template>
  <div class="navbar">
    <el-menu
      @select="handleSelect"
      router
      ref="menu"
      :default-active="activeIndex"
      class="navbar"
      mode="horizontal"
      active-text-color="#108ee9"
    >
      <li class="el-menu-item">
        <div class="logo">联盟</div>
      </li>
      <el-menu-item index="/dash">
        <i class="iconfont">&#xeb8f;</i>类目
      </el-menu-item>
      <el-menu-item index="/identification">
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
      </el-submenu>

      <li class="el-menu-item user-profile">
        <div class="user-profile-container" trigger="click">
          <div class="user-profile-content">
            <el-dropdown @command="logout">
              <div class="user-profile-body">
                <img class="user-avatar" src="https://img.alicdn.com/tfs/TB1ONhloamWBuNjy1XaXXXCbXXa-200-200.png">
                <span class="user-name">{{userInfo.username}}</span>
              </div>
              <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <el-dropdown-item command="a">
                  <span class="btn">
                    <i class="iconfont">&#xeb94;</i>
                    <span>邮箱设置</span>
                  </span>
                </el-dropdown-item>
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
      <li class="el-menu-item user-profile custom-menu-file">
        <el-menu
          :default-active="activeIndex1"
          mode="horizontal"
          active-text-color="#108ee9"
          @select="handleSiteMenuSelect"
        >
          <el-submenu popper-class="custom-submenu" style="float:right;margin-right:-20px" index="6">
            <template slot="title">{{activePlatName}}</template>
            <el-menu-item v-for="(item, index) in platformList" :index="item.name">
              <el-submenu :index="`6-${index}`">
                <template slot="title">{{item.name}}</template>
                <el-menu-item v-for="(i, index) in item.childs" :index="i.platformSiteId +'-' + i.name">{{i.name}}</el-menu-item>
              </el-submenu>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </li>
    </el-menu>
    <el-dialog title="修改密码" :visible.sync="visible" width="500px" @close="handleClose">
      <el-form :model="modifyFormData" label-width="76px" ref="form" size="small">
        <ElFormItem label="账号">
          <el-tag type="success">{{$store.state.userInfo.username}}</el-tag>
        </ElFormItem>
        <ElFormItem label="原密码" prop="pswd" :rules="[{required: true, message: '请输入原密码'}]">
          <el-input v-model="modifyFormData.pswd"></el-input>
        </ElFormItem>
        <ElFormItem label="新密码" prop="newPswd" :rules="[{required: true, message: '请输入新密码'}]">
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
      passBtnLoading: false,
      modifyFormData: {
        pswd: '',
        newPswd: ''
      },
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
    this.activeIndex = this.$route.path.replace(/\/$/, '')
    this.setName(this.activeIndex)
    this.activePlatName = this.defalutSiteName
    this.activeIndex1 = this.defalutSiteIndex
    this.getPlatform()
  },
  methods: {
    ...mapActions(['getUserInfo', 'getPlatform', 'getSite']),
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
        localStorage.clear()
        if (checkAccount) {
          storage.set('local', 'checkAccount', checkAccount)
          storage.set('local', 'username', username)
        }
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
      'defaultSiteIndex'
    ]),
    username() {
      let username = storage.get('local', 'username')
      return username
    }
  },
  watch: {
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
.custom-submenu {
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
    color: #333;
  }
  .iconfont {
    margin-right: 6px;
    font-size: 18px;
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
        }
      }
    }
  }
  .el-submenu.is-active,
  .el-submenu.is-opened {
    height: 60px;
    line-height: 60px;
    border-bottom: 2px solid #108ee9;
    i {
      color: #108ee9;
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

