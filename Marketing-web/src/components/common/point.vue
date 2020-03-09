<!-- 加入竞争分析组件 -->
<template>
  <div class="__wrapper_i">
    <el-dialog top="30vh" :close-on-click-modal="false" title="扣点明细" :visible.sync="data.show" width="300px">
      <div class="text_aligin_center" style="margin-bottom:10px;">
        <span>
          本次操作总共扣点：
          <span class="color_blue">{{data.point}}</span>
        </span>
      </div>
      <div class="text_aligin_center">
        <slot>
          <el-button type="primary" style="width:60%;" :loading="data.loading" @click="data.func(data.formName)">确 定</el-button>
        </slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "el-point",
  props: ["data"],
  components: {},
  data() {
    return {
      loading: false,
      formLabelWidth: "90px"
    };
  },

  created() {},
  mounted() {},
  methods: {
    //添加任务-  关键词分析添加任务
    addTaskSubmit(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0]
          };
          params = { ...params, ...this.form };
          params.keywords = [...new Set(this.keywordsArr)];
          params = this.$.dealObjectValue(params);
          this.loading = true;
          _this.$axios.post("/TaskKeywordCompete/save", params).then(
            res => {
              if (res.data.code == 500) {
                this.$message.error(res.data.msg);
                this.loading = false;
              }
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$refs[formName].resetFields(); //清除数据
                this.form.taskName = null; //清空任务名
                this.loading = false;
                this.data.show = false;
                this.reloadPointApi(); //重新获取点数
                return;
              }
            },
            err => {
              // console.log(err);
            }
          );
        } else {
          return false;
        }
      });
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.text_aligin_center {
  text-align: center;
}
.box {
  position: relative;
}
.searchSitesStyle {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  width: 350px;
  box-sizing: border-box;
  line-height: 40px;
  height: 42px;
}
</style>
