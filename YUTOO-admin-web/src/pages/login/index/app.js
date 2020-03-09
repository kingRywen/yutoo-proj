import Vue from 'vue'
import 'scripts/common.js'
import {formDataReq} from 'scripts/common.js'
import {
  Button,
  Input,
  Message,
  Form,
  FormItem
} from 'element-ui'
import 'assets/css/all.scss'
import './app.scss'

Vue.use(Button)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Form)
Vue.prototype.$message = Message

var vm = new Vue({
  el: '#root',
  data: {
    userValidateForm: {
      username: 'admin',
      password: '1'
    },
    show: false,
    error: ''
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 登录POST
          formDataReq('/sys/login', { ...this.userValidateForm
          }).then(res => {
            console.log(res)
            if (res.data.code == 0) { //登录成功
              localStorage.setItem("token", res.data.token);
              location.href = '/admin/index.html';
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            this.$message(err.message)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    login() {
      // 登录POST
      formDataReq('/sys/login', { ...this.formData
      }).then(res => {
        console.log(res)
        if (res.data.code == 0) { //登录成功
          localStorage.setItem("token", res.data.token);
          location.href = '/admin/index.html';
        } else {
          this.error = res.msg
          this.show = true
        }
      }).catch(err => {
        console.error(err)
        this.error = err.message
        this.show = true
        // location.href = '/admin/index.html';
      })
    },
    close() {
      this.show = false
    }
  }
})