<template>
  <div class="user-login" @keyup.enter="submitForm('customRuleForm')">
    <div class="user-login-bg"></div>
    <div class="content-wrapper">
      <div class="form-container">
        <h4 class="form-title">联盟注册</h4>
        <el-form :model="user" label-width="0" :rules="rules" ref="customRuleForm">
          <div class="form-items">
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="email">
                  <div class="form-line">
                    <i class="el-icon-message"></i>
                    <el-input placeholder="邮箱" maxlength="50" v-model="user.email"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="mobile">
                  <div class="form-line">
                    <i class="el-icon-mobile-phone"></i>
                    <el-input placeholder="手机号码" maxlength="20" v-model="user.mobile"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="inviteCode">
                  <div class="form-line">
                    <i class="el-icon-chat-line-square"></i>
                    <el-input placeholder="邀请码" maxlength="6" auto-complete="off" v-model="user.inviteCode"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password">
                  <div class="form-line">
                    <i class="el-icon-lock"></i>
                    <el-input
                      type="password"
                      auto-complete="new-password"
                      maxlength="20"
                      placeholder="登录密码"
                      v-model="user.password"
                    ></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="rePassword">
                  <div class="form-line">
                    <i class="el-icon-circle-check"></i>
                    <el-input
                      type="password"
                      auto-complete="new-password"
                      maxlength="20"
                      placeholder="确认密码"
                      v-model="user.rePassword"
                    ></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item mt10">
              <el-button
                :loading="loading"
                type="primary"
                class="submit-btn"
                size="small"
                @click.prevent="submitForm('customRuleForm')"
              >{{loading ?"注册中..." : "注 册"}}</el-button>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <div class="mb10 txc">
                  <el-button type="text" @click="$router.push('/login')" icon="el-icon-back">登录</el-button>
                </div>
              </el-col>
            </el-row>
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
  name: 'Register',

  data() {
    const checkEmail = (rule, value, cb) => {
      if (
        !/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(value)
      ) {
        return cb(new Error('请输入正确的邮箱'))
      }
      cb()
    }
    const checkMobile = (rule, value, cb) => {
      if (!/0?(13|14|15|17|18|19)[0-9]{9}/.test(value)) {
        return cb(new Error('请输入正确的手机号码'))
      }
      cb()
    }
    const checkPass = (rule, value, cb) => {
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(value)) {
        cb(new Error('必须存在大小写字母、数字及特殊字符，限6-20位'))
      }
      if (
        value !== '' &&
        this.user.rePassword &&
        value !== this.user.rePassword
      ) {
        cb(new Error('密码不一致'))
      }

      cb()
    }
    const checkConfirmPass = (rule, value, cb) => {
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(value)) {
        cb(new Error('必须存在大小写字母、数字及特殊字符，限6-20位'))
      }
      if (value !== '' && this.user.password && value !== this.user.password) {
        cb(new Error('密码不一致'))
      }
      cb()
    }
    return {
      loading: false,
      checkAccount: '',
      valicode: LOGIN_URL + '/valicode',
      redirect: undefined,
      user: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {
            required: true,
            message: '请输入邮箱'
          },
          {
            validator: checkEmail
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码'
          },
          {
            validator: checkMobile
          }
        ],
        inviteCode: [
          {
            required: true,
            message: '请输入邀请码'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            validator: checkPass
          }
        ],

        rePassword: [
          {
            required: true,
            message: '请确认密码'
          },
          {
            validator: checkConfirmPass
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
      this.valicode = LOGIN_URL + '/valicode?t=' + Date.now()
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
            this.$api[`agent/sysRegister`](this.user)
              .then(data => {
                vm.loading = false

                vm.$confirm(
                  `<span style="color:red"><b>*</b>${data.msg}</span>`,
                  '欢迎！',
                  {
                    dangerouslyUseHTMLString: true,
                    type: 'success'
                  }
                )
                  .then(() => {
                    vm.$router.replace('/login')
                  })
                  .catch(() => {})
              })
              .catch(data => {
                vm.$message.error(data.msg)
                vm.loading = false
              })
          }
        })
      } catch (error) {
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
.user-login .el-form {
  max-width: 280px;
}
.user-login .el-input__inner {
  border: none;
}
.user-login .el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>
