<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">登 录</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="phone" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="lock" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <div class="vali-code">
          <img :onerror="errorValicode" :src="valicode" @click="refreshCode">
          <el-form-item prop="captcha">
            <el-input name="captcha" type="text" v-model="loginForm.captcha" placeholder="验证码" @keyup.enter.native="handleLogin"></el-input>
          </el-form-item>
      </div>
      
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登 录
        </el-button>
      </el-form-item>
      <div class="other-handle">
        <span>立即注册</span>
        <span>找回密码</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import errValicode from '@/assets/login_images/no_valicode_150x55.png'
export default {
  name: 'Login',
  data() {
    const letterOrNumReg = /^[0-9a-zA-Z]+$/
    const validateUsername = (rule, value, callback) => {
      if (!value) {
          return callback(new Error('请输入用户名'));
        }else if (!letterOrNumReg.test(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
          return callback(new Error('请输入密码'));
        }else if (value.length < 5) {
        // callback(new Error('密码不能小于5位'))
        callback()
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入验证码'));
        }else if (value.length < 5) {
            callback(new Error('验证码不能小于5位'))
        } else if(!letterOrNumReg.test(value)){
            callback(new Error('请输入数字或字母的验证码'))
        } else {
            callback()
        }
    }
    return {
      loginForm: {
        username: null,
        password: null,
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      valicode: '',
      errorValicode: 'this.src="' + errValicode + '"'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {
    this.valicode = process.env.BASE_API+ 'sys/valicode'
  },
  methods: {
    refreshCode () {
        this.valicode = process.env.BASE_API + 'sys/valicode?t=' + new Date().getTime()
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params = `username=${this.loginForm.username}&password=${this.loginForm.password}&captcha=` + this.loginForm.captcha
          
          this.$store.dispatch('user/Login', params).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
            this.refreshCode()
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

<style rel="stylesheet/scss" lang="scss">
$bg:#fff;
$light_gray:#000;
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
    
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
   
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
    .el-input__inner{
        height: 40px;
    }
  }
  .el-form-item {
    background:#fff;
    border: 1px solid #dcdfe6;

    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
// $bg:#2d3a4b;
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#00c0de;
.login-container {
  
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  background-image: url(https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png);
  
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 380px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background-color: #fff;
    border-radius:5px;
  }
  .vali-code{
        display: flex;
        img{
          width: 115px;
          height: 40px;
          border: 1px solid #dcdfe6;
          border-radius:5px;
          margin-right: 15px;
        }
        .el-form-item{
          width: 180px;
          height: 40px;
          /deep/ .el-input__inner{
            width: 148px;
            height: 25px;
          }
        }
      }
  .other-handle {
    display: flex;
    justify-content:center;
    font-size: 12px;
    color: #96a5c4;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding-left:6px;
    color: $dark_gray;
  }
  .title {
    font-size: 14px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
