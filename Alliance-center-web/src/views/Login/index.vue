<template>
  <div id="login">
    <div style="position: relative; min-width: 1200px; width:100%; height: 100vh; " class="bg">
      <div class="next-row next-row-wrap">
        <div class="next-col next-col-12">
          <div
            style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; height: 100vh;"
          >
            <div>
              <a href="#" style=" display: block;text-align: center;">
                <img src="@/assets/images/placeholder.png" alt="logo" style="width: 88px;" />
              </a>
            </div>
            <div
              style="margin-top: 60px; font-weight: 500; font-size: 22px; line-height: 1.5; text-align: center; color: rgb(52, 58, 64);"
            >
              联盟中心端
              <br />
            </div>
            <p style="margin-top: 30px; font-size: 13px; color: rgb(33, 37, 41); text-align: center;">Alliance Center</p>
            <div
              style="position: absolute; top: 100px; bottom: 100px; right: 0px; background: rgb(255, 255, 255); width: 30px; box-shadow: rgb(245, 245, 245) -19px 0px 35px -7px;"
            ></div>
          </div>
        </div>

        <div class="next-col next-col-12">
          <el-form ref="customRuleForm" :model="user" :rules="rules">
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
              <div>
                <h4
                  style="margin-bottom: 40px; font-weight: 500; font-size: 22px; text-align: center; letter-spacing: 4px;"
                >登录</h4>
                <div>
                  <div class="next-row">
                    <div class="next-col">
                      <ElFormItem
                        label
                        label-width="0"
                        class="next-input next-input-single next-input-large"
                        style="width: 320px; border-radius: 0px; border-top: 0px rgb(235, 237, 242); border-left: 0px rgb(235, 237, 242); border-right: 0px rgb(235, 237, 242); border-bottom-color: rgb(235, 237, 242);"
                        prop="username"
                      >
                        <input v-model="user.username" type="text" placeholder="用户名" maxlength="20" height="100%" />
                      </ElFormItem>
                    </div>
                    <div class="next-col"></div>
                  </div>
                  <div class="next-row">
                    <div class="next-col">
                      <ElFormItem
                        label
                        label-width="0"
                        class="next-input next-input-single next-input-large"
                        style="width: 320px; border-radius: 0px; border-top: 0px rgb(235, 237, 242); border-left: 0px rgb(235, 237, 242); border-right: 0px rgb(235, 237, 242); border-bottom-color: rgb(235, 237, 242);"
                        prop="password"
                      >
                        <input type="password" v-model="user.password" placeholder="密码" height="100%" />
                      </ElFormItem>
                    </div>
                    <div class="next-col"></div>
                  </div>
                  <div class="next-row">
                    <div class="next-col">
                      <ElFormItem
                        label-width="160px"
                        class="next-input next-input-single next-input-large captchaImg"
                        style="width: 320px; border-radius: 0px; border-top: 0px rgb(235, 237, 242); border-left: 0px rgb(235, 237, 242); border-right: 0px rgb(235, 237, 242); border-bottom-color: rgb(235, 237, 242);"
                        prop="captcha"
                      >
                        <template slot="label">
                          <img :src="valicode" @click="refreshCode" />
                        </template>

                        <input type="text" v-model="user.captcha" placeholder="验证码" height="100%" />
                      </ElFormItem>
                    </div>
                    <div class="next-col"></div>
                  </div>
                  <div class="next-row" style="margin-bottom: 20px;">
                    <div class="next-col">
                      <label>
                        <span
                          :class="['next-checkbox', {hovered: hover, checked:checked }]"
                          @mouseenter="hover = true"
                          @mouseleave="hover = false"
                        >
                          <span class="next-checkbox-inner">
                            <i class="next-icon el-icon-check"></i>
                          </span>
                          <input type="checkbox" v-model="checked" aria-checked="false" />
                        </span>
                        <span class="next-checkbox-label">记住账号</span>
                      </label>
                    </div>
                  </div>
                  <div class="next-row" style="margin-bottom: 20px; justify-content: center;">
                    <el-button
                      type="primary"
                      :loading="loading"
                      class="next-btn next-btn-primary next-btn-medium"
                      style="margin-top: 40px; width: 180px; height: 48px; line-height: 48px; text-align: center; border-radius: 50px; border: 0px; box-shadow: rgba(152, 22, 244, 0.19) 0px 5px 10px 2px;"
                      @click="login"
                    >登录</el-button>
                  </div>
                  <!-- <div class="next-row" style="justify-content: center; align-items: center;">
                    <a href="/register" style="color: rgb(153, 153, 153); font-size: 12px; margin: 0px 5px;">立即注册</a>
                    <a href="/forgetpassword" style="color: rgb(153, 153, 153); font-size: 12px; margin: 0px 5px;">找回密码</a>
                  </div>-->
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
const backgroundImage =
  'https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png'

const { BASE_URL } = CONST_PORT_CONFIG

export default {
  name: 'user-login',

  data() {
    return {
      hover: false,
      checked: false,
      loading: false,
      checkAccount: '',
      backgroundImage: backgroundImage,
      valicode: BASE_URL + 'sys/valicode',
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
            message: '请输入用户名'
          }
        ],
        merchantNo: [
          {
            required: true,
            message: '请输入商户名'
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
    // let checked = storage.get('local', 'checked')
    let username = storage.get('local', 'username')
    if (username) {
      this.checked = true
      this.user.username = username
    }
    this.bindEnter()
  },
  beforeDestroy() {
    this.unbindEnter()
  },

  watch: {
    checked(val) {
      if (val) {
        storage.set('local', 'username', this.user.username)
      } else {
        storage.remove('local', 'username')
      }
    },
    'user.username'(val) {
      if (!this.checked) {
        return
      }
      if (val != null && val !== '') {
        storage.set('local', 'username', val)
      }
    }
  },

  methods: {
    bindEnter() {
      document.addEventListener('keyup', this.handleEnterEvent)
    },
    unbindEnter() {
      document.removeEventListener('keyup', this.handleEnterEvent)
    },
    handleEnterEvent(e) {
      if (e.keyCode === 13) {
        this.login()
      }
    },
    refreshCode: function() {
      this.valicode = BASE_URL + 'sys/valicode?t=' + Date.now()
    },
    login: function() {
      this.submitForm('customRuleForm')
    },
    submitForm: function(formName) {
      let vm = this
      vm.$refs[formName].validate(valid => {
        if (valid) {
          let { username, password, captcha } = vm.user
          vm.loading = true
          vm.$api['main/userlogin'](vm.user, {
            transformRequest: [
              function(data) {
                let ret = ''
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    '=' +
                    encodeURIComponent(data[it]) +
                    '&'
                }
                return ret
              }
            ],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then(data => {
              storage.set('local', 'token', data.token)
              vm.$message.success('登录成功')
              vm.loading = false
              vm.$router.push({
                path: vm.redirect || '/PlatformManagement/index'
              })
            })
            .catch(e => {
              console.error(e)
              vm.refreshCode()
              vm.user.captcha = ''
              vm.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';

.user-login .el-form {
  max-width: 280px;
  i {
    font-size: 16px;
    color: #808080;
  }
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