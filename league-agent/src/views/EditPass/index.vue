<template>
  <div style="width:100%; magin: 0 auto" class="flex-c">
    <div style="width: 50%">
      <el-page-header @back="$router.go(-1)" content="修改密码" class="mb20"></el-page-header>
      <!-- <el-page-header class="mb20" @back="$router.go(-1)" content="修改密码"></el-page-header> -->

      <!-- <div style="width:400px"> -->
      <ElForm :model="formData" :rules="rules" ref="form" label-width="0">
        <ElFormItem label prop="oldPassword">
          <el-input v-model="formData.oldPassword" maxlength="20" placeholder="原密码"></el-input>
        </ElFormItem>
        <ElFormItem label prop="newPassword">
          <el-input v-model="formData.newPassword" maxlength="20" placeholder="新密码"></el-input>
        </ElFormItem>
        <ElFormItem label prop="confirmPass">
          <el-input v-model="formData.confirmPass" maxlength="20" placeholder="确认密码"></el-input>
        </ElFormItem>
      </ElForm>

      <div class="txc mt20">
        <el-button type="primary" @click="submit1" :loading="$store.state.isloading">修改密码</el-button>
        <el-button type="primary" plain @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { authMethods } from 'Store/helper/auth'
export default {
  data() {
    const checkPassword = (rule, value, cb) => {
      if (value.length < 6) {
        cb(new Error('密码至少6位'))
      }
      if (value == null || value === '') {
        cb(new Error('请再次输入密码'))
      }
      if (value !== this.formData.newPassword) {
        cb(new Error('两次输入的密码不一致'))
      }
      cb()
    }
    return {
      formData: {},
      rules: {
        newPassword: [
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
        oldPassword: [
          {
            required: true,
            message: '请输入旧密码'
          }
          // {
          //   validator(rule, value, cb) {
          //     if (value.length < 6) {
          //       cb(new Error('密码至少6位'))
          //     }
          //     cb()
          //   }
          // }
        ]
      }
    }
  },
  methods: {
    ...authMethods,
    submit1() {
      this.$refs.form.validate().then(() => {
        this.$api[`agent/merchantUpdatePassword`]({
          oldPassword: this.formData.oldPassword,
          newPassword: this.formData.newPassword
        }).then(() => {
          this.loggOut()
          this.$router.push(`/login`)
        })
      })
    }
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
