<template>
  <div class="main-wrapper">
    <div class="main-view">
      <div class="top-menu">
        <div class="logo">联盟</div>
        <div class="home" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
          <router-link class="home-btn" tag="a" to="/login">
            <svg width="20" height="20">
              <use xlink:href="#home" />
            </svg>
            返回主页
          </router-link>
        </div>
      </div>

      <div class="find-pass-container">
        <h2>找回密码</h2>
        <ElForm ref="form" style="width:400px" label-width="0" :model="formData" :rules="rules">
          <!-- <ElFormItem>
            <div class="text">{{$store.state.userInfo.mercEmail}}</div>
          </ElFormItem>-->
          <!-- <ElFormItem prop="merchantNo">
            <el-input v-model="formData.merchantNo" placeholder="商户编号"></el-input>
          </ElFormItem>-->
          <ElFormItem prop="username">
            <el-input v-model="formData.username" placeholder="用户名" maxlength="50"></el-input>
          </ElFormItem>
          <ElFormItem prop="password">
            <el-input
              type="password"
              autocomplete="new-password"
              maxlength="20"
              v-model="formData.password"
              placeholder="新密码"
            ></el-input>
          </ElFormItem>
          <ElFormItem prop="confirmPassword">
            <el-input
              type="password"
              autocomplete="new-password"
              maxlength="20"
              v-model="formData.confirmPassword"
              placeholder="确认密码"
            ></el-input>
          </ElFormItem>
          <ElFormItem prop="valiCode">
            <div class="flex">
              <el-input v-model="formData.valiCode" maxlength="6" placeholder="邮箱验证码"></el-input>
              <ElButton
                style="margin-left:10px"
                type="primary"
                plain
                @click="getCode"
                :disabled="codeBtnDisabled"
              >{{codeText}}</ElButton>
            </div>
          </ElFormItem>
          <ElFormItem label>
            <el-button class="per100 mt20" type="primary" @click="submit1" :loading="$store.state.isloading">重置密码</el-button>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
export default {
  data() {
    const checkPassword = (rule, value, cb) => {
      if (value == null || value === '') {
        cb(new Error('请再次输入密码'))
      }
      if (value !== this.formData.password) {
        cb(new Error('两次输入的密码不一致'))
      }
      cb()
    }
    return {
      value: '',
      codeBtnDisabled: false,
      codeText: '获取验证码',
      formData: {},
      rules: {
        password: [
          {
            required: true,
            message: '请输入新密码'
          }
        ],
        confirmPassword: [
          {
            validator: checkPassword
          }
        ],
        valiCode: [
          {
            required: true,
            message: '请输入验证码'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入用户名'
          }
        ]
      }
    }
  },

  methods: {
    submit1() {
      let vm = this
      this.$refs.form.validate().then(() => {
        vm.save()
      })
    },
    save() {
      let params = {
        username: this.formData.username,
        verificationCode: this.formData.valiCode,
        password: this.formData.password
      }
      this.$api[`agent/sysResetPassword`](params)
        .then(() => {
          this.clear()
          this.$router.push('/login')
        })
        .catch(err => {
          console.error(err)
        })
    },
    clear() {
      this.codeBtnDisabled = false
      this.codeText = '获取验证码'
      clearInterval(this.timer)
      this.timer = null
    },
    getCode() {
      this.$refs.form.validateField('username', err => {
        if (!err) {
          let username = this.formData.username
          let params = {
            username
          }
          this.codeBtnDisabled = true
          this.$api[`agent/sysGetVerificationCode`](params)
            .then(() => {
              this.codeBtnDisabled = false
              this.setCodeText()
            })
            .catch(() => {
              this.codeBtnDisabled = false
            })
        }
      })
    },
    setCodeText() {
      this.codeBtnDisabled = true
      let seconds = 60
      this.timer = setInterval(() => {
        if (seconds === 0) {
          this.codeBtnDisabled = false
          this.codeText = '获取验证码'
          clearInterval(this.timer)
          this.timer = null
        } else {
          this.codeText = `${seconds}秒后，重新获取验证码`
          seconds--
        }
      }, 1000)
    },
    setSvg(fPath = '#fff', sPath = '#fff') {
      let svg = document.getElementById('__SVG_SPRITE_NODE__')
      let path0 = svg.getElementsByTagName('path')[0]
      let path1 = svg.getElementsByTagName('path')[1]
      path0.setAttribute('fill', fPath)
      path1.setAttribute('fill', sPath)
    },
    handleMouseenter() {
      this.setSvg()
    },
    handleMouseleave() {
      this.setSvg('#444444', '#00D8A0')
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setSvg('#444444', '#00D8A0')
    next()
  },
  beforeDestroy() {
    this.clear()
    this.setSvg('#444444', '#00D8A0')
  }
}
</script>

<style scoped lang='scss'>
svg#home {
  path {
    transition: all 0.15s ease-in-out;
  }
}
.main-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  // align-items: center;
  display: flex;
  .row-item {
    margin: 20px 0;
    .hd {
      margin-right: 6px;
    }
  }
  .main-view {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    .top-menu {
      height: 60px;
      line-height: 60px;
      display: flex;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.04);
      position: relative;
      z-index: 22;
      .logo {
        font-size: 28px;
        font-weight: bolder;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
      }
      .home {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        .home-btn {
          height: 34px;
          padding: 0 20px;
          border-radius: 17px;
          display: flex;
          font-size: 14px;
          align-items: center;
          transition: all 0.15s ease-in-out;
          &:link,
          &:visited {
            color: #333;
          }
          svg {
            margin-right: 6px;
          }
          &:hover {
            text-decoration: none;
            background: #108ee9;
            color: #fff;
            svg {
              color: #fff;
            }
          }
        }
      }
    }
    .find-pass-container {
      // width: 600px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h2 {
        margin-bottom: 40px;
      }
      .el-button--primary {
        color: #fff;
        background-color: #3080fe;
        border-color: #3080fe;
      }
    }
  }
}
</style>
