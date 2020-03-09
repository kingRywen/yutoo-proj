<!-- tab个人中心 -->
<template>
  <div class="centerComtainer">
    <el-dialog :close-on-click-modal="false" title="修改密码" :visible.sync="changePasswordShow" width="600px">
      <changePass></changePass>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="解绑手机号码" :visible.sync="changePhoneShow" width="600px">
      <changePhone :userName="userName"></changePhone>
    </el-dialog>
    <div>
      <header>个人中心</header>
      <section v-loading="tableLoading" class="personalContent">
        <content>
          <div class="label">
            <i class="iconfont icon-mima icon" style="font-size:18px;"></i>
            <span class="s1" style="padding-left:5px;">密码</span>
          </div>
          <button class="button" @click="changePasswordShow=true">修改密码</button>
        </content>
        <content>
          <div class="label" style="padding-left:2px;">
            <i class="iconfont icon-shouji icon" style="font-size:20px;"></i>
            <span class="s2">手机号</span>
          </div>
          <span>{{userName}}</span>
          <span class="changePhone" @click="changePhoneShow=true">更改手机号码</span>
        </content>
        <!-- <content>
                    <div class="label">
                        <i class="iconfont icon-youxiang icon"></i>
                        <span class="s3" style="padding-left:7px;">邮箱</span>
                    </div>
                </content> -->
      </section>
    </div>
  </div>
</template>

<script>
import changePass from "./1_centerIndexChild/changePass";
import changePhone from "./1_centerIndexChild/changePhone";
export default {
  components: { changePass, changePhone },
  data() {
    return {
      // 修改密码
      changePasswordShow: false,
      // 更改手机号码(写在store)
      changePhoneShow: false,
      formLabelWidth: "115px",
      tableLoading: false
    };
  },

  created() {},
  mounted() {},
  methods: {
    changePhoneShowFunc() {
      this.$store.commit("competitive/changePhoneShow", true);
    }
  },
  computed: {
    userName() {
      let userName = localStorage.getItem("userName");
      userName = userName.slice(0, 3) + "****" + userName.slice(8, 11);
      return userName;
    }
    // changePhoneShow() {
    //   return this.$store.state.competitive.changePhoneShow;
    // }
  },
  watch: {}
};
</script>

<style lang='scss' scoped>
//   list[0].isActived
.centerComtainer {
  color: #5a5a5a;
}
.context {
  flex: 1;
  padding: 55px 35px 0;
  header {
    font-size: 22px;
    color: #00c0de;
    text-align: center;
  }
  section.personalContent {
    margin-top: 50px;
    width: 600px;
    min-height: 300px;
    margin: 50px auto 20px;
    content {
      width: 100%;
      display: block;
      .label {
        height: 50px;
        width: 150px;
        text-align: left;
        display: inline-block;
        .icon {
          color: #888 !important;
        }
        .s2 {
          letter-spacing: 10px;
        }
        .s1,
        .s3 {
          letter-spacing: 35px;
        }
      }
      .button {
        display: inline-block;
        padding: 4px 16px;
        cursor: pointer;
        border-radius: 3px;
        border: 1px solid #00c0de;
        background: #fafafa;
        color: #00c0de;
      }
    }
  }
}
// 更改手机号码
.changePhone {
  margin-left: 15px;
  color: #00c0e1;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
