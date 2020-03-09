<template>
  <div class="main-wrapper">
    <div class="main-view">
      <div class="top-menu">
        <div class="logo">联盟代理</div>
        <div class="home" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
          <router-link class="home-btn" tag="a" to="/user">
            <svg width="20" height="20">
              <use xlink:href="#home" />
            </svg>
            返回主页
          </router-link>
        </div>
      </div>
      <div class="find-pass-container">
        <h2>修改密码</h2>
        <div style="width:400px">
          <ElForm :model="formData" :rules="rules" ref="form" label-width="0">
            <ElFormItem label prop="originPass">
              <el-input v-model="formData.originPass" placeholder="原密码"></el-input>
            </ElFormItem>
            <ElFormItem label prop="newPass">
              <el-input v-model="formData.newPass" placeholder="新密码"></el-input>
            </ElFormItem>
            <ElFormItem label prop="confirmPass">
              <el-input v-model="formData.confirmPass" placeholder="确认密码"></el-input>
            </ElFormItem>
          </ElForm>

          <el-button class="per100 mt20" type="primary" @click="submit1" :loading="$store.state.isloading">修改密码</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const checkPassword = (rule, value, cb) => {
      if (value == null || value === '') {
        cb(new Error('请再次输入密码'))
      }
      if (value !== this.formData.newPass) {
        cb(new Error('两次输入的密码不一致'))
      }
      cb()
    }
    return {
      formData: {},
      rules: {
        newPass: [
          {
            required: true,
            message: '请输入新密码'
          }
        ],
        confirmPass: [
          {
            validator: checkPassword
          }
        ],
        originPass: [
          {
            required: true,
            message: '请输入旧密码'
          }
        ]
      }
    }
  },
  methods: {
    submit1() {
      this.$refs.form.validate().then(() => {
        this.$api[`main/sysUserUpdatePswd`]({
          pswd: this.formData.originPass,
          newPswd: this.formData.newPass
        }).then(data => {
          localStorage.clear()
          this.$router.push({ path: '/login' })
        })
      })
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
        font-size: 24px;
        font-weight: bolder;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 140px;
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
          svg {
            margin-right: 6px;
          }
          &:hover {
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
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;
      h2 {
        margin-bottom: 40px;
      }
    }
  }
}
</style>
