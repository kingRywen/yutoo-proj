<!-- tab个人中心 -->
<template>
  <div class="feedbackCom">
    <div>
      <header>意见反馈</header>
      <section class="feedContent">
        <div>
          <span class="title_icon"></span>
          <span class="color_666">选择反馈类型</span>
        </div>
        <div class="margin_top20">
          <el-radio-group v-model="feedbackType">
            <el-radio :label="0">产品建议</el-radio>
            <el-radio :label="1">程序错误</el-radio>
            <el-radio :label="2">操作疑问</el-radio>
          </el-radio-group>
        </div>

        <div class="margin_top20">
          <span class="title_icon"></span>
          <span class="color_666">反馈内容</span>
        </div>
        <div class="margin_top20">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 20}" :rows="4" placeholder="请输入内容" v-model.trim="feedbackContent">
          </el-input>
        </div>
        <div class="margin_top20">
          <el-button :disabled="feedbackContent.length>0?false:true" type="success" @click="save" :loading="tableLoading">提交</el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
      feedbackType: 0,
      feedbackContent: ""
    };
  },

  created() {},
  mounted() {},
  methods: {
    // 离开当前页面
    leave() {},
    // 提交
    save() {
      let params = {
        feedbackType: this.feedbackType,
        feedbackContent: this.feedbackContent
      };
      params = this.$.dealObjectValue(params);
      this.tableLoading = true;
      this.$axios.post("/MerchantFeedback/save", params).then(res => {
        let code = res.data.code;
        this.tableLoading = false;
        if (code === 0) {
          this.goOn();
        } else if (code === 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 成功之后继续提交或者查看
    goOn() {
      this.$confirm("操作成功!", "提示", {
        confirmButtonText: "查看记录",
        cancelButtonText: "继续反馈",
        type: "success"
      })
        .then(() => {
          // 告诉父组件切换左边菜单栏
          this.$emit("child-msg", "TS" + new Date().getTime());
        })
        .catch(() => {
          this.feedbackType = 0;
          this.feedbackContent = "";
        });
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
//   list[0].isActived
.feedbackCom {
  color: #5a5a5a;
}
.margin_top20 {
  margin-top: 20px;
}
header {
  font-size: 22px;
  color: #00c0de;
  text-align: center;
}
section.feedContent {
  margin-top: 50px;
  min-height: 300px;
  margin: 50px 40px 20px;
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
</style>
