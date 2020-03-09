<template>
  <div class="container">
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
      <el-form-item>
        <h2>登录</h2>
      </el-form-item>
      <el-form-item
        prop="user"
        :rules="[
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ]"
      >
        <el-input v-model="dynamicValidateForm.user" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item
        prop="pass"
        :rules="{
          required: true, message: '请输入密码', trigger: 'blur'
        }"
      >
        <el-input v-model="dynamicValidateForm.pass" type='password' placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-form-item
        label-width="135px"
        prop="pass"
        :rules="{
          required: true, message: '验证码', trigger: 'blur'
        }"
      >
        <img slot="label" class="vali" :src="img" @click="refresh">
        <el-input v-model="dynamicValidateForm.vali" placeholder="验证码"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')" style="width:100%" :loading="loading">{{ loginText }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dynamicValidateForm: {
        user: '',
        pass: '',
        vali: ''
      },
      img: '/sys/valicode?t=',
      loginText: '登 录',
      loading: false
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.loginText = '登录中...'
          this.logIn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    logIn () {
      const formData = this.dynamicValidateForm
      this.$axios.post(`/sys/login?username=${formData.user}&password=${formData.pass}&captcha=${formData.vali}`)
        .then(res => {
          console.log(res)
          if (res.data.code === 500) {
            this.$message.error(res.data.msg)
            this.loading = false
            this.loginText = '登 录'
            return
          }
          localStorage.setItem('token', res.data.token)
          this.$router.push('/admin')
        })
        .catch((err) => {
          this.$message.error(err.message ? err.message : '服务器错误，请联系管理员')
          this.loading = false
          this.loginText = '登 录'
        })
    },
    refresh () {
      this.img = 'http://localhost:8080/sys/valicode?t=' + Date.now()
    }
  }
}
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
}
form {
  width: 300px;
  text-align: center
}
.el-form-item.is-required .el-form-item__label:before {
  content: ''
}
.vali {
  height: 40px;
}
</style>
