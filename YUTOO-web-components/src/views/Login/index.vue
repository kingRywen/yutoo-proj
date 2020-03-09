<template>
  <div class="user-login" @keyup.enter="submitForm('customRuleForm')">
    <div class="user-login-bg" :style="{'background-image':`url(${backgroundImage})`}"></div>
    <div class="content-wrapper">
      <h2 class="slogan">
        <!-- 宇图科技ERP -->
      </h2>
      <div class="form-container">
        <h4 class="form-title">登录</h4>
        <el-form :model="user" label-width="0" :rules="rules" ref="customRuleForm">
          <div class="form-items">
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="username">
                  <div class="form-line">
                    <i class="el-icon-circle-check-outline"></i>
                    <el-input placeholder="账户" v-model="user.username"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password">
                  <div class="form-line">
                    <i class="el-icon-circle-check-outline"></i>
                    <el-input type="password" placeholder="密码" v-model="user.password"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="captcha">
                  <div class="form-line">
                    <div style="margin-bottom: 5px;height:50px;width:140px;">
                      <img :src="valicode" @click="refreshCode">
                    </div>
                    <el-input type="text" placeholder="验证码" v-model="user.captcha"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class=form-item>
              <el-col>
                <el-form-item>
                  <!-- {{checkAccount}} -->
                  <el-checkbox class="checkbox" v-model="checkAccount">记住账号</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-button :loading="loading" type="primary" class="submit-btn" size="small" @click.prevent="submitForm('customRuleForm')">
                {{loading ?"登录中..." : "登 录"}}
              </el-button>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from "Config";
import storage from "Utils/saver";
const backgroundImage =
  "https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png";

const { BASE_URL } = CONST_PORT_CONFIG;

// import shopRoutes from "../../router/shopRouter";
// import ebayRoutes from "../../router/ebayRouter";
//import {resetRouter} from '../../router/index'

export default {
  name: "user-login",

  data() {
    return {
      loading: false,
      checkAccount: "",
      backgroundImage: backgroundImage,
      valicode: BASE_URL + "sys/valicode",
      redirect: undefined,
      user: {
        username: "",
        password: "",
        captcha: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名"
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码"
          }
        ]
      }
    };
  },

  created() {
    let check = storage.get("local", "checkAccount");
    this.checkAccount = check;
    if (check) {
      this.user.username = storage.get("local", "username");
    }
  },

  methods: {
    getLocal(name) {
      return JSON.parse(localStorage.getItem(name));
    },
    setLocal(name, val) {
      storage.set("local", name, val);
    },
    removeLocal(name) {
      storage.remove("local", name);
    },
    refreshCode: function() {
      this.valicode = BASE_URL + "sys/valicode?t=" + Date.now();
    },
    login: function() {
      this.submitForm("customRuleForm");
    },
    submitForm: function(formName) {
      let vm = this;
      vm.$refs[formName].validate(valid => {
        if (valid) {
          let { username, password, captcha } = vm.user;
          vm.loading = true;
          vm.$api["userlogin"](vm.user, {
            transformRequest: [
              function(data) {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                return ret;
              }
            ],
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
            .then(data => {

              
              //router.addRoutes;
						  //	console.log(shopRoutes)
              // vm.$router.addRoutes(shopRoutes);
							//假设进来的是amazon
			  storage.set('session','routerType','amazon')
			  this.$store.commit('common/routerType','amazon')
              sessionStorage.removeItem('shop_seller_data')
              vm.setLocal("shop_token", data.token);
              vm.$message.success("登录成功");
              vm.loading = false;
              // 记录记住账号和用户名的状态到本地
              vm.setLocal("username", vm.user.username);
              if (vm.checkAccount) {
                vm.setLocal("checkAccount", true);
              } else {
                vm.removeLocal("checkAccount");
              }
              vm.$router.push({
                path: vm.redirect || "/dash"
              });
            })
            .catch(() => {
              vm.refreshCode();
              vm.user.captcha = "";
              vm.loading = false;
            });
        }
      });
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    },
    "user.username": {
      immediate: true,
      handler() {
        if (this.checkAccount) {
          this.setLocal("username", this.user.username);
          this.setLocal("checkAccount", true);
        }
      }
    },
    checkAccount(val) {
      if (val) {
        this.setLocal("username", this.user.username);
        this.setLocal("checkAccount", true);
      } else {
        this.removeLocal("username");
        this.removeLocal("checkAccount");
      }
    }
  }
};
</script>

<style lang="scss">
@import "./index.scss";
.user-login .el-form {
  max-width: 280px;
}
.user-login .el-input__inner {
  border: none;
}
.user-login .form-title {
  font-size: 22px;
}
.user-login .el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>
