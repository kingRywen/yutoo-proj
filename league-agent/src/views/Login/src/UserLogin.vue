<template>
  <div class="user-login" @keyup.enter="submitForm('customRuleForm')">
    <div class="user-login-bg">
      <div class="top blue"></div>
      <div class="top"></div>
    </div>
    <div class="content-wrapper">
      <div class="form-container">
        <h4 class="form-title">联盟登录</h4>
        <el-form :model="user" label-width="0" :rules="rules" ref="customRuleForm">
          <div class="form-items">
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="username">
                  <div class="form-line">
                    <i class="el-icon-user"></i>
                    <el-input placeholder="账户" v-model="user.username"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password">
                  <div class="form-line">
                    <i class="el-icon-lock"></i>
                    <el-input type="password" placeholder="密码" v-model="user.password"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item mt10">
              <el-col>
                <el-form-item prop="captcha">
                  <div class="form-line">
                    <img width="130" alt="点击刷新" :src="valicode" @click="refreshCode" style="margin-bottom: 5px" />
                    <el-input type="text" placeholder="验证码" v-model="user.captcha"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <div class="flex-t-b mb10">
                  <el-checkbox class="checkbox" v-model="checkAccount">记住账号</el-checkbox>
                  <div>
                    <el-button type="text" @click="forget">忘记密码</el-button>
                    <!-- 
                    <el-button type="text" @click="register">注册</el-button>-->
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-button
                :loading="loading"
                type="primary"
                class="submit-btn"
                size="small"
                @click.prevent="submitForm('customRuleForm')"
              >{{loading ?"登录中..." : "登 录"}}</el-button>
            </el-row>
            <div class="txc">
              <el-button type="text" @click="register">注册</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from 'Config'
import { authMethods } from 'Store/helper/auth'
// eslint-disable-next-line
const { LOGIN_URL, loginRedirect } = CONST_PORT_CONFIG

export default {
  name: 'user-login',

  data() {
    return {
      loading: false,
      checkAccount: '',
      valicode: LOGIN_URL + '/sys/valicode?t=' + Date.now(),
      redirect: undefined,
      user: {
        username: '',
        password: '',
        captcha: ''
      },
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入用户名'
          }
        ],
        captcha: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入验证码'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入密码'
          }
        ]
      }
    }
  },

  created() {
    let check = this.$storage.get('local', 'checkAccount')
    this.checkAccount = check
    if (check) {
      this.user.username = this.$storage.get('local', 'username')
    }
  },

  methods: {
    ...authMethods,
    register() {
      this.$router.push({
        path: '/register'
      })
    },
    forget() {
      this.$router.push({
        path: '/findPass',
        params: { username: this.user.username }
      })
    },
    getLocal(name) {
      return JSON.parse(localStorage.getItem(name))
    },
    setLocal(name, val) {
      this.$storage.set('local', name, val)
    },
    removeLocal(name) {
      this.$storage.remove('local', name)
    },
    refreshCode: function() {
      this.valicode = LOGIN_URL + '/sys/valicode?t=' + Date.now()
    },
    login: function() {
      this.submitForm('customRuleForm')
    },
    submitForm: function(formName) {
      try {
        let vm = this
        vm.$refs[formName].validate(valid => {
          if (valid) {
            vm.loading = true
            vm.loggIn(vm.user)
              .then(() => {
                let count =
                  vm.$storage.get('local', 'logCounts') != null
                    ? vm.$storage.get('local', 'logCounts') + 1
                    : 0
                vm.$storage.set('local', 'logCounts', count)
                vm.loading = false
                vm.$router
                  .replace(
                    vm.$route.query.redirect || {
                      path: count == 0 ? '/stores' : '/dash'
                    }
                  )
                  .catch(() => {
                    this.refreshCode()
                  })
              })
              .catch(() => {
                this.user.captcha = ''
                this.refreshCode()
                vm.loading = false
              })
          }
        })
      } catch (error) {
        this.refreshCode()
        console.error(error)
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    'user.username': {
      immediate: true,
      handler() {
        if (this.checkAccount) {
          this.setLocal('username', this.user.username)
          this.setLocal('checkAccount', true)
        }
      }
    },
    checkAccount(val) {
      if (val) {
        this.setLocal('username', this.user.username)
        this.setLocal('checkAccount', true)
      } else {
        this.removeLocal('username')
        this.removeLocal('checkAccount')
      }
    }
  }
}
</script>

<style lang="scss">
@import './UserLogin.scss';
// .user-login .el-form {
//   max-width: 280px;
// }
.user-login .el-input__inner {
  border: none;
}
.user-login .el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>
