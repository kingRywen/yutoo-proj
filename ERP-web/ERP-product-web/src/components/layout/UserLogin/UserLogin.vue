<template>
  <div class="user-login" @keyup.enter="submitForm('customRuleForm')">
    <div class="user-login-bg" :style="{'background-image':`url(${backgroundImage})`}"></div>
    <div class="content-wrapper">
      <h2 class="slogan">宇图科技ERP</h2>
      <div class="form-container">
        <h4 class="form-title">登录</h4>
        <el-form :model="user" label-width="0" :rules="rules" ref="customRuleForm">
          <div class="form-items">
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="username">
                  <div class="form-line">
                    <v-icon type="user"></v-icon>
                    <!-- <i class="el-icon-edit-outline input-icon"></i> -->
                    <el-input placeholder="账户" v-model="user.username"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password">
                  <div class="form-line">
                    <v-icon type="lock"></v-icon>
                    <el-input type="password" placeholder="密码" v-model="user.password"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="captcha">
                  <div class="form-line">
                    <img
                      height="45"
                      alt="如果看不清楚，请单击图片刷新！"
                      :src="valicode"
                      @click="refreshCode"
                      style="margin-bottom: 5px"
                    >
                    <el-input type="text" placeholder="验证码" v-model="user.captcha"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item>
                  <el-checkbox class="checkbox" v-model="checkAccount">记住账号</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-button
                :loading="loading"
                type="primary"
                class="submit-btn"
                size="small"
                @click.prevent="submitForm('customRuleForm')"
              >登 录</el-button>
            </el-row>
          </div>
          <!-- <el-row class="tips">
            <a href="/" class="link">
              立即注册
            </a>
            <span class="line">|</span>
            <a href="/" class="link">
              忘记密码
            </a>
          </el-row>-->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui'
import BasicContainer from '@vue-materials/basic-container'
import { LOGIN_URL, loginRedirect } from 'common/config'
import { fetchData, handlerCode, showToast, _storage } from 'common/common'

console.log(loginRedirect);

import { getQueryString } from 'common/util'
import apis from 'apis'

Vue.use(ElementUI)
const backgroundImage =
  'https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png'


export default {
  components: { BasicContainer },
  name: 'UserLogin',

  data() {
    return {
      loading: false,
      checkAccount: '',
      backgroundImage: backgroundImage,
      valicode: LOGIN_URL + '/valicode',
      loading: false,
      user: {
        username: '',
        password: '',
        captcha: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名'
          }
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          }
        ]
      }
    }
  },

  created() {
    let check = _storage._get('local', 'checkAccount')
    this.checkAccount = check
    if (check) {
      this.user.username = _storage._get('local', 'username')
    }
  },

  methods: {
    getLocal(name) {
      return JSON.parse(localStorage.getItem(name))
    },
    setLocal(name, val) {
      _storage.set('local', name, val)
      // localStorage.setItem(name, JSON.stringify(val));
    },
    removeLocal(name) {
      _storage.remove('local', name)
    },
    refreshCode: function() {
      this.valicode = LOGIN_URL + '/valicode?t=' + Date.now()
    },
    login: function() {
      this.submitForm('customRuleForm')
    },
    submitForm: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          fetchData({
            ...apis.MERCHANT_USER_LOGIN,
            data: this.user
          }).then(res => {
            this.loading = false
            handlerCode(
              res,
              () => {
                this.setLocal('token', res.data.rows.token)
                // 获取权限
                // fetchData({
                //   ...apis.MERCHANT_MENU_LIST_BY_CHILD,
                //   data: {}
                // }).then(res1 => {
                //   if (res1.data.code !== 0) {
                //     showToast('error', res1.data.msg)
                //     return
                //   }
                //   this.setLocal('perms', res1.data.rows)

                // })
                this.loading = false
                let redirectUrl = getQueryString('redirect', null, true)
                if (redirectUrl && redirectUrl.indexOf('login.html') === -1) {
                  location.href = redirectUrl
                  return
                }
                location.href = loginRedirect + 'admin.html'
              },
              () => {
                this.loading = false
                this.refreshCode()
              }
            )
          })
        }
      })
    }
  },
  watch: {
    'user.username': {
      immediate: true,
      handler(val) {
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
@import '~element-ui/lib/theme-chalk/index.css';
.user-login .el-form {
  max-width: 280px;
}
.user-login .el-input__inner {
  border: none;
}
.user-login .form-title {
  font-size: 22px;
}
.user-login .el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>
