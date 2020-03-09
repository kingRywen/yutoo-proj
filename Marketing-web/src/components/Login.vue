<template>
  <div class="container __login" style="background-image: url(&quot;https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png&quot;);">
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
      <h2 style="letter-spacing:8px;color:#00C0DE;font-size:14px;height:30px;margin-bottom:5px;margin-top:15px;">登录</h2>
      <el-form-item prop="user" :rules="[
          { required: true, message: '账号不能为空', trigger: 'blur' },
           { min: 0, max: 100,message: '长度须小于100字符',trigger: 'blur'}
        ]">
        <el-input class="login-btn" v-model.trim="dynamicValidateForm.user" placeholder="请输入手机或邮箱">
          <i slot="prefix" class="iconfont">&#xe633;</i>
        </el-input>
      </el-form-item>
      <el-form-item prop="pass" :rules="{
          required: true, message: '请输入密码', trigger: 'blur'
        }">
        <el-input class="login-btn" v-model.trim="dynamicValidateForm.pass" type='password' placeholder="密码">
          <i slot="prefix" class="iconfont">&#xe620;</i>
        </el-input>
      </el-form-item>
      <el-form-item label-width="120px" prop="pass" :rules="{
          required: false, message: '验证码', trigger: 'blur'
        }">
        <img slot="label" class="img" :src="img" @click="refresh" style="margin-right:10px;">
        <el-input class="login-btn" v-model.trim="dynamicValidateForm.vali" placeholder="验证码"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click="submitForm('dynamicValidateForm')" style="width:100%;letter-spacing:4px;" :loading="loading">{{ loginText }}</el-button>
      <!-- <el-button type="primary" plain @click="goReg" style="width:100%;letter-spacing:4px;margin-top:20px">注册</el-button> -->
      <div class="regAndFind">
        <span class="s" style="margin-right:15px;" @click="goReg">立即注册</span>
        <span class="s" style="margin-left:15px;" @click="goFind">找回密码</span>
      </div>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";
import { baseURL } from "@/api/axios.js";
export default {
  data() {
    return {
      dynamicValidateForm: {
        user: "",
        pass: "",
        vali: ""
      },
      // img: "/sys/valicode?t=",
      img: baseURL + "/sys/valicode?t=" + Date.now(),
      loginText: "登录",
      loading: false
    };
  },
  mounted() {
    let isload = sessionStorage.getItem("isload");
    if (isload == 1) {
      sessionStorage.setItem("isload", 0);
      // window.location.reload();
      // console.log(this.$store.state);
      this.$store.commit(
        "common/pathFromCheckProductAnalysis",
        "/admin/center"
      );
    }
    this.keyupSubmit();
    this.refresh();
    // alert(baseURL);
  },
  methods: {
    keyupSubmit() {
      document.onkeydown = e => {
        let event = e || window.event;
        let _key = event.keyCode;
        if (_key === 13) {
          this.submitForm("dynamicValidateForm");
        }
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(valid);
        if (valid) {
          this.loading = true;
          this.loginText = "登录中...";
          this.logIn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    logIn() {
      const formData = this.dynamicValidateForm;
      let data = new FormData();
      data.append("username", formData.user);
      data.append("password", formData.pass);
      data.append("captcha", formData.vali);
      // console.log(formData);
      // console.log(this);
      // axios({
      //   method: 'post',
      //   timeout: 10000000000,
      //   withCredentials: true,
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   url: `${baseURL}/sys/login?username=${formData.user}&password=${
      //     formData.
      //   }&captcha=${formData.vali}`
      // })
      this.$axios
        .post("/sys/login", {
          username: formData.user,
          password: formData.pass,
          captcha: formData.vali
        })
        .then(res => {
          if (res.data.code == 500) {
            this.$message.error(res.data.msg);
            this.loading = false;
            this.loginText = "登 录";
            this.refresh();
            return;
          }
          localStorage.setItem("market_toke", res.data.token);
          // console.log(window.location.host + "/#/admin");
          // location.href = window.location.host + "/#/admin";
          this.$store.commit("common/setLoginData", formData.user);
          localStorage.setItem("userName", formData.user);
          sessionStorage.setItem("platformId", "1,1");
          // this.$store.commit("common/savePlatformIdAndSiteId", "1,1");
          // this.$router.push("/index");
          this.$router.push("/admin");
        })
        .catch(err => {
          this.$message.error(
            err.message ? err.message : "服务器错误，请联系管理员"
          );
          this.loading = false;
          this.loginText = "登 录";
        });
    },
    refresh() {
      // this.img = "http://localhost:8080/sys/valicode?t=" + Date.now();
      this.img = baseURL + "/sys/valicode?t=" + Date.now();
      // this.img = baseURL + "/sys/valicode?t=";
    }
    // goReg() {
    //   this.$router.push("/register");
    // },
    // goFind() {
    //   this.$router.push("/findpass");
    // }
  }
};
</script>
<style scoped lang="scss">
.__login .iconfont {
  color: #dcdfe6 !important;
  right: -2px;
  display: inline-block;
  vertical-align: middle;
  font-size: 18px;
}
.container {
  width: 100vw;
  height: 100vh;
  background: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo-dynamic {
  background: #fff;
  padding: 10px 50px;
  border-radius: 10px;
  position: absolute;
  left: 55%;
}
form {
  width: 280px;
  text-align: center;
}
.el-form-item.is-required .el-form-item__label:before {
  content: "";
}
.vali {
  height: 40px;
}
.regAndFind {
  margin-top: 15px;
  margin-bottom: 15px;
  .s {
    cursor: pointer;
    color: #888;
    &:hover {
      color: #00c0de;
    }
  }
}
</style>
<style>
.login-btn .el-input__inner {
  height: 40px !important;
  line-height: 40px !important;
}
.__login .el-input__inner {
  height: 40px;
  line-height: 40px;
}
/* .__login .el-button {
  padding: 12px 20px;
} */
.img {
  height: 40px;
  margin-top: -2px;
  vertical-align: middle;
}
</style>

