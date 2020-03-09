<template>
  <div class="changePass __inputPrepend">
    <section class="section">
      <!-- <h2>密码找回</h2> -->
      <el-form :model="ruleForm" class="__register" :rules="rules" ref="ruleForm">
        <el-form-item prop="newPhone">
          <!-- <el-input v-model="ruleForm.newPhone"></el-input> -->
          <el-input v-model.trim="ruleForm.newPhone" placeholder="请输入要绑定的新手机号码">
            <template slot="prepend">
              <span class="required">*</span>
              新手机
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-row :span="24">
            <el-col :span="19">
              <!-- <el-input v-model="ruleForm.captcha" placeholder="图片验证码"></el-input> -->
              <el-input v-model.trim="ruleForm.captcha" placeholder="图片验证码">
                <template slot="prepend">
                  <span class="required">*</span>
                  图片验证码
                </template>
              </el-input>
            </el-col>
            <el-col :span="5"><img class="img" :src="cap" alt="点击刷新" @click="refresh"></el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="code">
          <el-row>
            <el-col :span="19">
              <!-- <el-input v-model="ruleForm.code" type="phoneCode" placeholder="手机验证码"></el-input> -->
              <el-input v-model.trim="ruleForm.code" placeholder="手机验证码">
                <template slot="prepend">
                  <span class="required">*</span>
                  手机验证码
                </template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <span v-show="toggleCodeStatus" class="commonPhoneCodeStyle phoneCode" @click="getPhoneCode(4)">获取验证码</span>
              <span v-show="!toggleCodeStatus" class="commonPhoneCodeStyle waitPhoneCode">重新获取({{waitPhoneCodeTimt}})</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-button type="success" :loading="loading" @click="submitForm('ruleForm','/sys/user/updatePhone',4)" style="width:100%;margin-top:5px">更换</el-button>
        <!-- <div class="line"></div> -->
      </el-form>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { baseURL } from "@/api/axios.js";
import changePhone from "./changePhone";
export default {
  components: { changePhone },
  props: ["oldCode"],
  data() {
    var validnewPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新手机"));
      } else {
        if (!/^1[34578]\d{9}$/.test(value)) {
          new Error("请输入正确的手机号码");
        }
        callback();
      }
    };
    var validCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机验证码"));
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
    // var validFlag = (rule, value, callback) => {
    //   if (!~~value) {
    //     callback(new Error("请同意协议"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      //   changePhoneShow2: false,
      // 验证码，重新获取切换
      toggleCodeStatus: true,
      waitPhoneCodeTimt: 60,
      loading: false,
      ruleForm: {
        newPhone: "",
        captcha: "",
        code: ""
        // flag: ""
      },
      cap: baseURL + "/sys/valicode?t=" + Date.now(),
      rules: {
        newPhone: [
          {
            required: true,
            validator: validnewPhone,
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
        code: [
          {
            required: true,
            validator: validCode,
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    refresh() {
      this.cap = baseURL + "/sys/valicode?t=" + Date.now();
    },
    getPhoneCode(messageType) {
      // messageType 3是修改密码
      this.$refs["ruleForm"].validateField("newPhone", cbVal1 => {
        if (cbVal1 === "") {
          this.$refs["ruleForm"].validateField("captcha", cbVal2 => {
            if (cbVal2 === "") {
              //  调用请求手机验证码的函数
              this.getCodeFun(messageType);
            }
          });
        }
      });
    },
    // 请求验证码接口
    getCodeFun(messageType) {
      // console.log(2222);
      let opts = {
        username: this.ruleForm.newPhone,
        captcha: this.ruleForm.captcha,
        messageType: messageType
      };
      this.$axios
        .post("/sys/user/sendMsg", opts)
        .then(res => {
          // console.log(res);
          if (res.data.code == 0) {
            this.$message({ type: "success", message: "手机验证码发送成功！" });
            this.toggleCodeStatus = false;
            let timer = setInterval(() => {
              this.waitPhoneCodeTimt = --this.waitPhoneCodeTimt;
              if (this.waitPhoneCodeTimt === 0) {
                clearInterval(timer);
                this.toggleCodeStatus = true;
                this.waitPhoneCodeTimt = 60;
              }
            }, 1000);
          } else if (res.data.code === 500) {
            this.refresh();
            this.ruleForm.captcha = "";
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          // console.log("获取验证码失败", err);
        });
    },
    submitForm(formName, url, messageType) {
      // console.log(formName);
      this.$refs[formName].validate(valid => {
        // console.log(valid);
        if (valid) {
          this.loading = true;
          this.register(url, messageType);
        } else {
          // console.log(this.ruleForm, "条件缺失");
          // console.log(this.ruleForm);
          return false;
        }
      });
    },
    // 弹出注册协议
    showRegAgreementPage() {
      this.$message.error("暂无");
    },
    // 跳转到登陆
    // toLogin() {
    //   this.$router.push("/login");
    // },
    register(url, messageType) {
      // const formData = this.ruleForm;
      // let data = new FormData();
      // data.append("username", formData.username);
      // data.append("password", formData.password);
      // data.append("confirmPassword", formData.confirmPassword);
      // data.append("captcha", formData.captcha);
      // data.append("phoneCode", formData.phoneCode);
      // data.append("flag", formData.flag);
      // console.log(formData);
      let data = {
        oldCode: this.oldCode,
        newCode: this.ruleForm.code,
        username: this.ruleForm.newPhone
      };
      axios({
        method: "post",
        timeout: 10000000000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("market_toke")
        },
        data: data,
        // url: `${baseURL}/sys/register?username=${formData.username}&password=${
        //   formData.password
        // }&captcha=${formData.captcha}&confirmPassword=${
        //   formData.confirmPassword
        // }&phoneCode=${formData.phoneCode}&flag=${formData.flag}`
        url: baseURL + url
      })
        .then(res => {
          this.loading = false;
          // console.log(res);
          if (res.data.code == 0) {
            this.$message({ type: "success", message: "修改成功,请重新登录" });
            // 隐藏第一个弹窗（第二个是在第一个的基础上的，所以不用再去隐藏）
            setTimeout(() => {
              //   this.$store.commit("competitive/changePhoneShow", false);
              //   this.
              this.LogOut();
            }, 500);
          }
          if (res.data.code === 500) {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          // console.log("error submit!!", err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.changePass {
  position: relative;
}
</style>
<style scoped lang="scss">
.changePass {
  //   background: url("../assets/background.png");
  //   height: 100vh;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // width: 100%;
  .section {
    width: 540px;
    box-sizing: border-box;
    margin: 0 auto;
    background: #fff;
    padding: 0px 60px 0px;
    border-radius: 10px;
    height: 235px;
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
</style>
