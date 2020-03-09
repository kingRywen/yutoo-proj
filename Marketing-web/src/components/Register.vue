<template>
  <div class="regContainer __inputPrepend">
    <section class="section">
      <h2>欢迎注册</h2>
      <el-form :model="ruleForm" class="__register" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
          <!-- <el-input v-model="ruleForm.username" placeholder="请输入手机号码"></el-input> -->
          <el-input placeholder="请输入手机号码" v-model.trim="ruleForm.username">
            <template slot="prepend">
              <span class="required">*</span>
              手机号码
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <!-- <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password"></el-input> -->
          <el-input placeholder="请输入密码" v-model.trim="ruleForm.password">
            <template slot="prepend">
              <span class="required">*</span>
              密码
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <!-- <el-input v-model="ruleForm.confirmPassword" type="password" placeholder="确认密码"></el-input> -->
          <el-input placeholder="确认密码" v-model.trim="ruleForm.confirmPassword">
            <template slot="prepend">
              <span class="required">*</span>
              确认密码
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-row :span="24">
            <el-col :span="19">
              <!-- <el-input v-model="ruleForm.captcha" placeholder="请输入验证码"></el-input> -->
              <el-input placeholder="图片验证码" v-model.trim="ruleForm.captcha">
                <template slot="prepend">
                  <span class="required">*</span>
                  图片验证码
                </template>
              </el-input>
            </el-col>
            <el-col :span="4"><img class="img" :src="cap" alt="点击刷新" @click="refresh"></el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="phoneCode" style="margin-bottom:5px;">
          <el-row>
            <el-col :span="19">
              <!-- <el-input v-model="ruleForm.code" type="phoneCode" placeholder="手机验证码"></el-input> -->
              <el-input placeholder="手机验证码" v-model.trim="ruleForm.code">
                <template slot="prepend">
                  <span class="required">*</span>
                  手机验证码
                </template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <span v-show="toggleCodeStatus" class="commonPhoneCodeStyle phoneCode" @click="getPhoneCode(0)">获取验证码</span>
              <span v-show="!toggleCodeStatus" class="commonPhoneCodeStyle waitPhoneCode">重新获取({{waitPhoneCodeTimt}})</span>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item prop="flag" label-width="0px" style="margin-bottom:0px;">
          <div class="regAgreementCom">
            <el-checkbox label="我已阅读并同意协议" v-model="ruleForm.flag" :false-label="0" :true-label="1"></el-checkbox>
            <span class="regAgreement" @click="showRegAgreementPage">《注册协议》</span>
          </div>
        </el-form-item> -->
        <!-- <el-form-item> -->
        <el-button type="primary" :loading="loading" @click="submitForm('ruleForm','/sys/register',0)" style="width:100%;margin-top:20px;">注册</el-button>
        <div class="line"></div>
        <div class="toLoginCon">
          <span>已有账号？</span>
          <span @click="goLogin" class="tologin">请登陆</span>
        </div>
        <!-- </el-form-item> -->
      </el-form>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { baseURL } from "@/api/axios.js";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.confirmPassword) {
          //如果确认密码不为空，进行对比验证
          this.$refs.ruleForm.validateField("confirmPassword");
        }
        let password = this.ruleForm.password + "";
        // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/;
        let reg = /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/;
        if (value.length > 20 || value.length < 6) {
          callback(new Error("密码长度6-20位"));
        } else if (!reg.test(password)) {
          callback(
            new Error(
              "必须包含数字,字母,特殊字符两种以上的组合（中文、空格除外）"
            )
          );
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "" && this.ruleForm.password != "") {
        callback(new Error("请再次输入密码"));
      } else if (
        this.ruleForm.password != "" &&
        value !== this.ruleForm.password
      ) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validuserName = (rule, value, callback) => {
      if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    var validCaptcha = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    var validFlag = (rule, value, callback) => {
      if (!~~value) {
        callback(new Error("请同意协议"));
      } else {
        callback();
      }
    };
    return {
      // modalObj: {
      //   show: false,
      //   title: "注册协议",
      //   width: "70%"
      // },
      // 验证码，重新获取切换
      toggleCodeStatus: true,
      waitPhoneCodeTimt: 60,
      loading: false,
      ruleForm: {
        username: "",
        password: "",
        // confirmPassword: "",
        captcha: "",
        code: "",
        flag: 1
      },
      cap: baseURL + "/sys/valicode?t=" + Date.now(),
      rules: {
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: ["blur", "change"]
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: ["blur", "change"]
          }
        ],
        captcha: [
          {
            required: true,
            validator: validCaptcha,
            trigger: ["blur", "change"]
          }
        ],
        username: [
          {
            required: true,
            validator: validuserName,
            trigger: ["blur"]
          }
        ],
        code: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "请输入手机验证码"
          }
        ],
        flag: [
          {
            required: true,
            validator: validFlag,
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    // refresh() {
    //   this.cap = baseURL + "/sys/valicode?t=" + Date.now();
    // },
    // getPhoneCode() {
    //   this.$refs["ruleForm"].validateField("username", cbVal1 => {
    //     if (cbVal1 === "") {
    //       this.$refs["ruleForm"].validateField("captcha", cbVal2 => {
    //         if (cbVal2 === "") {
    //           this.toggleCodeStatus = false;
    //           //  调用请求手机验证码的函数
    //           this.getCodeFun();
    //           let timer = setInterval(() => {
    //             this.waitPhoneCodeTimt = --this.waitPhoneCodeTimt;
    //             if (this.waitPhoneCodeTimt === 0) {
    //               clearInterval(timer);
    //               this.toggleCodeStatus = true;
    //               this.waitPhoneCodeTimt = 60;
    //             }
    //           }, 1000);
    //         }
    //       });
    //     }
    //   });
    // },
    // // 请求验证码接口
    // getCodeFun() {
    //   // console.log(2222);
    //   this.$axios
    //     .post("/sys/sendMsg", {
    //       username: this.ruleForm.username,
    //       captcha: this.ruleForm.captcha,
    //       messageType: 0
    //     })
    //     .then(res => {
    //       console.log(res);
    //       if (res.data.code == 0) {
    //         this.$message({ type: "success", message: "手机验证码发送成功！" });
    //       } else {
    //         this.$message.error(res.data.msg);
    //       }
    //     })
    //     .catch(err => {
    //       console.log("获取验证码失败", err);
    //     });
    // },
    // submitForm(formName) {
    //   console.log(formName);
    //   console.log(
    //     this.$refs[formName].validate(function(res) {
    //       console.log(res);
    //     })
    //   );
    //   this.$refs[formName].validate(valid => {
    //     console.log(valid);
    //     if (valid) {
    //       this.loading = true;
    //       this.register();
    //     } else {
    //       // console.log(this.ruleForm, "条件缺失");
    //       console.log(this.ruleForm);
    //       return false;
    //     }
    //   });
    // },
    // // 弹出注册协议
    // showRegAgreementPage() {
    //   this.$message.error("暂无");
    // },
    // // 跳转到登陆
    // // toLogin() {
    // //   this.$router.push("/login");
    // // },
    // register() {
    //   // const formData = this.ruleForm;
    //   // let data = new FormData();
    //   // data.append("username", formData.username);
    //   // data.append("password", formData.password);
    //   // data.append("confirmPassword", formData.confirmPassword);
    //   // data.append("captcha", formData.captcha);
    //   // data.append("phoneCode", formData.phoneCode);
    //   // data.append("flag", formData.flag);
    //   // console.log(formData);
    //   let data = {
    //     username: this.ruleForm.username,
    //     password: this.ruleForm.password,
    //     captcha: this.ruleForm.captcha,
    //     code: this.ruleForm.code,
    //     flag: this.ruleForm.flag
    //   };
    //   axios({
    //     method: "post",
    //     timeout: 10000000000,
    //     withCredentials: true,
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     data: this.ruleForm,
    //     // url: `${baseURL}/sys/register?username=${formData.username}&password=${
    //     //   formData.password
    //     // }&captcha=${formData.captcha}&confirmPassword=${
    //     //   formData.confirmPassword
    //     // }&phoneCode=${formData.phoneCode}&flag=${formData.flag}`
    //     url: `${baseURL}/sys/register`
    //   })
    //     .then(res => {
    //       this.loading = false;
    //       console.log(res);
    //       if (res.data.code == 0) {
    //         this.$message({ type: "success", message: "注册成功" });
    //         localStorage.setItem("token", res.data.token);
    //         this.$store.commit("common/setLoginData", this.ruleForm.username);
    //         localStorage.setItem("userName", this.ruleForm.username);
    //         sessionStorage.setItem("platformId", 1);
    //         this.$router.push("/admin");
    //       }
    //       if (res.data.code !== 0) {
    //         // this.refresh();
    //         // this.ruleForm.captcha = "";
    //         this.$message.error(res.data.msg);
    //       }
    //     })
    //     .catch(err => {
    //       console.log("error submit!!", err);
    //     });
    // }
  }
};
</script>

<style lang="scss">
.regContainer {
  position: relative;
}
.regContainer .el-form-item__label {
  border-radius: 4px 0 0 4px;
  color: #909399;
  width: 93px;
  height: 38px;
  line-height: 36px;
  display: inline-block;
  border: 1px solid #dcdfe6;
  background: #fafafa;
  margin-top: 1px;
  text-align: center;
  border-right: 0;
}
.regContainer .el-input__inner {
  height: 38px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;
}

/* 注册协议 */
.regAgreement {
  color: #35ad67;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.regContainer .el-form-item.is-required .el-form-item__label:before {
  content: " ";
}
</style>
<style scoped lang="scss">
.regContainer {
  background: url("../assets/background.png");
  height: 100vh;
  padding-top: 15vh;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // width: 100%;
  .section {
    width: 540px;
    box-sizing: border-box;
    margin: 0 auto;
    background: #fff;
    padding: 20px 60px 0px;
    border-radius: 10px;
    height: 470px;
  }
}
img {
  height: 29px;
  margin-top: -1px;
  margin-left: 5px;
  vertical-align: middle;
}
h2 {
  margin: 0 auto 20px;
  text-align: center;
  color: #00c0de;
  letter-spacing: 3px;
}
.commonPhoneCodeStyle {
  border-radius: 4px;
  margin-left: 5px;
  padding: 0px 0px;
  font-size: 12px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #dbdee5;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 81px;
  color: #606266;
  margin-top: 7px;
}
.phoneCode {
  cursor: pointer;
}
.waitPhoneCode {
  cursor: default;
}
.line {
  width: 100%;
  border-top: 1px solid #e6e6e6;
  margin-top: 20px;
}
.toLoginCon {
  width: 200px;
  margin: 0 auto;
  position: relative;
  left: 40px;
  margin-top: 10px;
  font-size: 13px;
  color: #606266;
  .tologin {
    cursor: pointer;
    color: #00c0de;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

