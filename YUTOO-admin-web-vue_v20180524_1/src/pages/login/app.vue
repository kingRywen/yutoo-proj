<template>
  <div class="login_wrapper" @keyup.enter="login">
    <v-form direction="horizontal" :model="customForm" :rules="customRules" ref="customRuleForm">
      <h2>后台管理系统</h2>
      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" prop="username" has-feedback>
        <v-input type="text" size="large" v-model="customForm.username">
          <span slot="before">
            <v-icon type="user"></v-icon>
          </span>
        </v-input>
      </v-form-item>
      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" prop="password" has-feedback>
        <v-input type="password" size="large" v-model="customForm.password">
          <span slot="before">
            <v-icon type="safety"></v-icon>
          </span>
        </v-input>
      </v-form-item>
      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" prop="captcha">
        <v-row :gutter="16">
          <v-col span="14">
            <v-input type="text" size="large" placeholder="验证码" v-model="customForm.captcha"></v-input>
          </v-col>
          <v-col span="10">
            <img height="38" alt="如果看不清楚，请单击图片刷新！" :src="valicode" @click="refreshCode">
          </v-col>
        </v-row>

      </v-form-item>
      <v-form-item :wrapper-col="{ span: 24 }">
        <v-button type="primary" :loading="loading" @click.prevent="submitForm('customRuleForm')" class="login_btn">{{ loading ? "登录中" : "登 录" }}</v-button>
      </v-form-item>
    </v-form>
  </div>
</template>
<script>
import { BASE_URL } from "common/config";
import apis from "apis";
import { requestWithFormData, handlerCode } from "common/common";

export default {
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账户"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      captcha: "",
      valicode: BASE_URL + "/sys/valicode",
      loading: false,
      customForm: {
        username: "web",
        password: "web"
      },
      customRules: {
        username: [
          {
            required: true,
            message: "请输入账户名"
          },
          {
            validator: validateUser
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码"
          },
          {
            validator: validatePass
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码"
          }
        ]
      },
      labelCol: {
        span: 24
      },
      wrapperCol: {
        span: 24
      }
    };
  },
  methods: {
    refreshCode: function() {
      this.valicode = BASE_URL + "/sys/valicode?t=" + Date.now();
    },
    login() {
      this.submitForm("customRuleForm");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          // 验证通过
          requestWithFormData(apis.LOGIN.url, this.customForm).then(res => {
            console.log(res);
            if (res.data.code === 0) {
              console.log("2");
            }
            handlerCode(
              res,
              () => {
                localStorage.setItem("token", res.data.token);
                location.href = "/admin.html";
                this.loading = false;
              },
              () => {
                this.loading = false;
              }
            );
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@import "~assets/style/variables.less";

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
