<!-- 加入竞争分析组件 -->
<template>
  <div class="__wrapper_i">
    <el-dialog :close-on-click-modal="false" title="添加任务" :visible.sync="data.show" width="600px">
      <div slot="title">
        <span class="el-dialog__title">添加任务</span>
        <span class="timeCss"> {{this.charge}}点/每次</span>
      </div>
      <div class="box __box_wrapper">
        <el-form :rules="rules" :model="form" ref="ruleForm" style="width:100%;">
          <el-form-item label="选择来源 :" prop="searchSites" :label-width="formLabelWidth" style="width:100%;">
            <el-checkbox-group v-model="form.searchSites" class="searchSitesStyle" style="width:100%;">
              <el-checkbox v-for="item in StatusOptions" :label="item.value" :key='item.value' name="searchSites">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="关键词: " prop="keywords" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="textarea" style="width:100%;" :rows="4" placeholder="多个关键词以逗号间隔或换行输入（1-500个）" class="keywordIntext" v-model="form.keywords" />
            <!-- <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div> -->
          </el-form-item>
          <el-form-item label="任务名称 :" :label-width="formLabelWidth" style="width:100%;">
            <el-input v-model.trim="form.taskName" placeholder="最多输入30个字符" style="width:100%;" maxlength="30" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button type="primary" style="width:100%" @click="showPoint('ruleForm')" :loading="loading">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-point :data="pointData"></el-point>
  </div>
</template>

<script>
export default {
  props: ["data"],
  components: {},
  data() {
    // 自定义校验
    var validateKeyword = (rule, value, callback) => {
      let val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      this.keywordsArr = val;
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      let keyworldLength = null;
      //   if (regEn.test(value) || regCn.test(value)) {
      //     callback(new Error("不能包含特殊字符"));
      //   } else
      if (val.length > 500) {
        callback(new Error("输入数量不能超过500个"));
      } else {
        callback();
      }
    };
    return {
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      loading: false,
      formLabelWidth: "90px",
      keywordsArr: [],
      // 来源定义数据
      StatusOptions: [
        {
          value: 0,
          label: "Google"
        },
        // {
        //   value: 1,
        //   label: "速卖通"
        // },
        {
          value: 2,
          label: "merchantwords"
        }
      ],
      // 校验
      rules: {
        keywords: [
          {
            // type: "any",
            required: true,
            message: "请输入关键词",
            trigger: "blur"
          },
          { validator: validateKeyword, trigger: ["change", "blur"] } //限定输入的个数
        ],
        searchSites: [
          {
            required: true,
            message: "请至少选择一个来源",
            trigger: "change"
          }
        ]
        // siteId: [{ required: true, message: "请选择站点", trigger: "change" }]
      },
      //  定义添加任务
      form: {
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1], // 站点
        searchSites: [], //来源列表
        keywords: "", //关键词
        taskName: ""
      }
    };
  },

  created() {},
  mounted() {},
  methods: {
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务-  关键词分析添加任务
    addTaskSubmit(formName, point) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 设置任务名称
          if (!this.form.taskName || this.form.taskName == "") {
            let len = [...new Set(this.keywordsArr)].length;
            // console.log(len);
            let taskName = this.keywordsArr[0] + " " + len;
            taskName = taskName.slice(-30);
            // console.log(taskName);
            this.form.taskName = taskName;
          }
          // 设置任务名称end
          let params = {
            //pointData
            type: point,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0]
          };
          params = { ...params, ...this.form };
          params.keywords = [...new Set(this.keywordsArr)];
          params = this.$.dealObjectValue(params);
          this.loading = true;
          // 扣点按钮loading pointData
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          _this.$axios.post("/TaskKeywordCompete/save", params).then(
            res => {
              this.loading = false;
              // 扣点弹窗
              if (point === 0) {
                if (res.data.code == 0) {
                  this.pointData.show = true;
                  this.pointData.point = res.data.data + "点";
                  this.pointData.formName = formName;
                } else if (res.data.code === 500) {
                  this.$message.error(res.data.msg);
                }
                return;
              }
              if (res.data.code == 500) {
                this.$nextTick(() => {
                  this.loading = false;
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                this.$message.error(res.data.msg);
              }
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$refs[formName].resetFields(); //清除数据
                this.form.taskName = null; //清空任务名
                this.data.show = false;
                this.$nextTick(() => {
                  this.pointData.show = false; // 关闭扣点弹窗 pointData
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                if (point === undefined) {
                  this.reloadPointApi(); //重新获取点数
                }
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
  computed: {
    charge() {
      return this.$store.state.common.key_index_charge;
    },
    userSelect() {
      return this.$store.state.common.userSelect;
    },
    type_keyword() {
      return this.$store.state.common.type_keyword;
    },
    fontSum() {
      return this.keywordsArr.length;
    }
  },
  watch: {
    type_keyword(v) {
      this.form.keywords = this.$store.state.common.type_keyword;
    }
    // userSelect(newV) {
    //   if (newV != "") {
    //     let arr = this.$store.state.common.userSelect;
    //     this.keywordsArr = [];
    //     arr.forEach((item, index) => {
    //       if (item.keyword !== "" && item.keyword !== "-") {
    //         this.keywordsArr.push(item.keyword);
    //       }
    //     });
    //     let str = this.keywordsArr.join(",");
    //     // this.$store.commit("common/type_keyword", str);
    //     // this.form.keywords = str;
    //   }
    // }
  }
};
</script>

<style lang='scss' scoped>
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
