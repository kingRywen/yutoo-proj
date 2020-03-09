<template>
  <div>
    <user-login></user-login>
  </div>
</template>
<script>
import Vue from 'vue'
import { BASE_URL, loginRedirect } from 'common/config'
import apis from 'apis'
import {
  requestWithFormData,
  handlerCode,
  fetchData,
  _storage
} from 'common/common'
import UserLogin from 'components/layout/UserLogin'
import { Row, Col, FormItem, Form, Checkbox, Button, Input } from 'element-ui'

Vue.use(Row)
Vue.use(Col)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Input)

export default {
  components: {
    UserLogin
  },
  created() {
    localStorage.removeItem('perms')
    if (_storage._get('local', 'token')) {
      top.location.href = loginRedirect + 'admin.html'
    }
  },
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      captcha: '',
      valicode: BASE_URL + '/sys/valicode',
      loading: false,
      customForm: {
        username: 'merchant_admin',
        password: 'yutoo-admin-123'
      },
      customRules: {
        username: [
          {
            required: true,
            message: '请输入账户名'
          },
          {
            validator: validateUser
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            validator: validatePass
          }
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码'
          }
        ]
      },
      labelCol: {
        span: 24
      },
      wrapperCol: {
        span: 24
      }
    }
  },
  methods: {
    refreshCode: function() {
      this.valicode = BASE_URL + '/sys/valicode?t=' + Date.now()
    },
    login: function() {
      this.submitForm('customRuleForm')
    },
    submitForm: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          // 验证通过
          fetchData({
            ...apis.MERCHANT_USER_LOGIN,
            data: this.customForm
          }).then(res => {
            handlerCode(
              res,
              () => {
                localStorage.setItem('token', res.data.token)

                // 获取权限
                fetchData({
                  ...apis.MERCHANT_MENU_LIST_BY_CHILD,
                  data: {}
                }).then(res => {
                  if (res.data.code === 0) {
                    localStorage.setItem('perms', JSON.stringify(res.data.rows))
                    location.href = loginRedirect + 'admin.html'
                    this.loading = false
                  }
                })
              },
              () => {
                this.loading = false
              }
            )
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
@import '~assets/style/variables.less';

.login_wrapper {
  box-sizing: border-box;
  max-width: 360px;
  width: 360px\9;
  padding: 30px;
  border-top: 1px solid #fff;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  max-height: 420px;
  height: 420px\9;
  margin: auto;
  border-radius: 6px;
  box-shadow: 0 0 100px rgba(40, 40, 40, 0.1);
  _:-ms-fullscreen,
  :root & {
    width: 360px;
    height: 420px;
  }
  .login_btn {
    width: 100%;
    border-radius: 40px;
  }
  h2 {
    text-align: center;
    margin: 30px 0;
  }
}
</style>
