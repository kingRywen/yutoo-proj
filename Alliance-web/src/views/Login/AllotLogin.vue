<template>
  <div class="user-login" @keyup.enter="submitForm('customRuleForm')">
    <div class="user-login-bg" :style="{'background-image':`url(${backgroundImage})`}"></div>
    <div class="content-wrapper">
      <h2 class="slogan">联盟代理</h2>
      <div class="form-container">
        <h4 class="form-title">操作员登录</h4>
        <el-form :model="user" label-width="0" :rules="rules" ref="customRuleForm">
          <div class="form-items">
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="merchantNo">
                  <div class="form-line">
                    <i class="anticon anticon-shop"></i>
                    <el-input placeholder="商户号" v-model="user.merchantNo"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="username">
                  <div class="form-line">
                    <i class="anticon anticon-user"></i>
                    <el-input placeholder="账户" v-model="user.username"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password">
                  <div class="form-line">
                    <i class="anticon anticon-lock"></i>
                    <el-input type="password" placeholder="密码" v-model="user.password"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="captcha">
                  <div class="form-line">
                    <div style="margin-bottom: 5px;height:50px;width:140px;">
                      <img :src="valicode" @click="refreshCode" />
                    </div>
                    <el-input type="text" placeholder="验证码" v-model="user.captcha"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col :span="12">
                <el-form-item>
                  <el-checkbox class="checkbox" v-model="checkAccount">记住账号</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="findPassItem">
                  <router-link
                    tag="a"
                    style="margin-right:10px;opacity:0.5"
                    class="findPass"
                    :to="{name: 'findPass',params: {merchantNo:user.merchantNo,username:user.merchantNo}}"
                  >忘记密码?</router-link>
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
              >{{loading ?"登录中..." : "登 录"}}</el-button>
            </el-row>
            <el-row class="form-item findPassItem toggle-wrapper">
              <router-link tag="a" class="findPass btn" :to="{name: 'login'}">管理员登录</router-link>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>
    <yt-dialog :options="options" :events="events">
      <Renew :loginData="loginData" ref="form" />
    </yt-dialog>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from 'Config'
import Renew from 'Views/User/components/Renew.vue'
import storage from 'Utils/saver'
const backgroundImage =
  'https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png'

const { BASE_URL } = CONST_PORT_CONFIG

export default {
  name: 'user-login',
  components: { Renew },
  data() {
    let vm = this
    return {
      loginData: {},
      options: {
        visible: false,
        title: '会员费支付',
        width: '800px',
        appendToBody: true,
        okBtnText: '确认',
        cancelBtnText: '取消'
      },
      events: {
        handleOkClick() {
          return vm.$refs.form.submit().then(() => {
            vm.options.visible = false
          })
        }
      },
      loading: false,
      checkAccount: '',
      backgroundImage: backgroundImage,
      valicode: BASE_URL + 'sys/valicode',
      redirect: undefined,
      user: {
        // merchantNo: '100001',
        // username: '111111',
        // password: '111111',
        merchantNo: '',
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

  beforeRouteEnter(to, from, next) {
    // storage.remove('local', 'token_a')
    // storage.remove('local', 'userInfo_a')
    storage.clear('session')
    next()
  },
  created() {
    let check = storage.get('local', 'checkAccount_a')
    this.checkAccount = check
    if (check) {
      this.user.username = storage.get('local', 'username_a')
      this.user.merchantNo = storage.get('local', 'merchantid_a')
    }
  },
  watch: {
    'user.username': {
      immediate: true,
      handler() {
        this.remember()
      }
    },
    'user.merchantNo': {
      immediate: true,
      handler() {
        this.remember()
      }
    },
    checkAccount(val) {
      if (val) {
        this.setLocal('username_a', this.user.username)
        this.setLocal('merchantid_a', this.user.merchantNo)
        this.setLocal('checkAccount_a', true)
      } else {
        this.removeLocal('username_a')
        this.removeLocal('merchantid_a')
        this.removeLocal('checkAccount_a')
      }
    }
  },

  methods: {
    remember() {
      if (this.checkAccount) {
        this.setLocal('username_a', this.user.username)
        this.setLocal('merchantid_a', this.user.merchantNo)
        this.setLocal('checkAccount_a', true)
      }
    },
    setLocal(name, val) {
      this.$storage.set('local', name, val)
    },
    removeLocal(name) {
      this.$storage.remove('local', name)
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
          vm.$api['main/sysLoginRecipient'](vm.user, {
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
              // vm.options.visible = true
              // return
              storage.set('local', 'token_a', data.token)
              vm.$message.success('登录成功')
              vm.loading = false
              vm.$router.push({
                name: 'allotTask'
              })
            })
            .catch(err => {
              vm.refreshCode()
              vm.user.captcha = ''
              vm.loading = false
              if (err.expiryDate) {
                this.loginData = {
                  username: this.user.username,
                  merchantId: err.merchantId
                }
                vm.options.visible = true
              }
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
