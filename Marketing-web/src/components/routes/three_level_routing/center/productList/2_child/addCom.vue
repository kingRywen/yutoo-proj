<!-- 加入竞争分析组件 -->
<template>
  <div class="__wrapper_i">
    <el-dialog :close-on-click-modal="false" title="添加任务" :visible.sync="data.show" width="600px">
      <div slot="title">
        <span class="el-dialog__title">添加任务</span>
        <span class="timeCss"> {{this.charge}}点/每次</span>
      </div>
      <span class="dialogTips">
        <span v-if="platformId==1?true:false" style="position:relative;left:-4px;"> 温馨提示，多个产品ASIN用换行或逗号分隔</span>
        <span v-if="platformId==1?false:true" style="position:relative;left:-4px;"> 温馨提示，多个产品ID用换行或逗号分隔</span>
      </span>
      <div class='box __box_wrapper'>
        <el-form :model="dialogData" :rules="rules" ref="ruleForm" style="width:100%;">
          <!-- 分组 -->
          <el-form-item label="选择分组:" prop="groupId" :label-width="formLabelWidth" style="width:100%;">
            <el-cascader change-on-select :options="groupList" style="width:100%" v-model="dialogData.groupId" :props="addProjectFormOpts"></el-cascader>
            </el-input>
          </el-form-item>
          <!-- asin -->
          <el-form-item v-if="platformId==1?true:false" label="产品ASIN:" prop="textarea" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="textarea" :rows="4" placeholder="多个ASIN换行输入，或用逗号分隔" v-model="dialogData.textarea" style="width:100%;">
            </el-input>
          </el-form-item>
          <el-form-item v-if="platformId==1?false:true" label="产品ID:" prop="textarea" :label-width="formLabelWidth" style="width:100%;">
            <el-input type="textarea" :rows="4" placeholder="多个产品ID换行输入，或用逗号分隔" v-model="dialogData.textarea" style="width:100%;">
            </el-input>
          </el-form-item>
          <!-- 是否马上添加到监控 -->
          <el-form-item :label-width="formLabelWidth" style="width:100%;">
            <el-checkbox v-model="dialogData.checked">是否添加监控</el-checkbox>
            <div class="block" v-show="dialogData.checked" style="width:100%;">
              <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions" v-model="dialogData.datePickValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" style="width:100%;">
            <el-button type="primary" :loading="loading" style="width:100%;" @click="showPoint('ruleForm')">确 认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-point :data="pointData"></el-point>
  </div>
</template>

<script>
import { Trim, removeArrEmpty } from "@/api/functions.js";
import { ProductAnalysisSaveUrl } from "@/api/myApi";
import { mapGetters, mapState } from "vuex";
export default {
  props: ["data"],
  components: {},
  data() {
    // 自定义校验
    var validateSku = (rule, value, callback) => {
      if (!value) {
        callback(new Error("输入不能为空"));
        return;
      } else {
        // if (value == null || value == undefined) return;
        let val = value
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== "");
        this.skusArr = val;

        let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi;
        let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
        // let reg = /^[A-Z0-9]{10}$/;
        let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/;
        let changePlatformd = this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0];
        let str = "ASIN须为10位数，纯数字或大写字母和数字的组合";
        if (changePlatformd == 2) {
          reg = /^[0-9]{12,12}$/;
          str = "请输入12位纯数字";
        } else if (changePlatformd == 3) {
          reg = /^[0-9]{11,11}$/;
          str = "请输入11位纯数字";
        } else if (changePlatformd == 4) {
          reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]+$/;
          str = "请输入小写字母与纯数字组合";
        } else if (changePlatformd == 5) {
          reg = /^[0-9]*$/;
          str = "请输入纯数字";
        }
        if (!val.every(el => reg.test(el))) {
          callback(new Error(str));
        } else if (
          val.some(el => regEn.test(el)) ||
          val.some(el => regCn.test(el))
        ) {
          callback(new Error("不能包含特殊字符"));
        } else if (val.length > 500) {
          callback(new Error("输入数量不能超过500个"));
        } else {
          callback();
        }
      }
    };
    return {
      addProjectFormOpts: {
        value: "groupId",
        label: "groupName",
        children: "groupingVOS"
      },
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      // 定义添加监控只能是今日之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      loading: false,
      formLabelWidth: "90px",
      // 校验
      rules: {
        textarea: [
          {
            required: true,
            message: "输入不能为空",
            trigger: ["blur", "change"]
          },
          // { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" }, //限定输入的个数
          { validator: validateSku, trigger: ["blur", "change"] } //限定输入的个数
        ],
        groupId: [
          {
            required: true,
            message: "请选择分组",
            trigger: ["blur", "change"]
          }
        ]
      },
      //  定义添加任务
      dialogData: {
        groupId: [-1],
        textarea: "",
        checked: true,
        datePickValue: "", // 添加产品的时间数组
        monitorDateValue: "" // 添加监控的时间数组
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
    // 添加产品
    addTaskSubmit(formName, point) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            //pointData
            type: point,
            platformId: 1,
            groupId:
              this.dialogData.groupId == ""
                ? -1
                : this.dialogData.groupId[this.dialogData.groupId.length - 1],
            skus: this.dialogData.textarea,
            monitorFlag: this.dialogData.checked === true ? 1 : 0
          };
          let skuArr = params.skus.replace(/\n/g, ",").split(","); // ["1 2", "2", "3", "4", "", "", "", ""]
          let newskuArr = [];
          skuArr.forEach((v, i) => {
            let vStr = Trim(v, "g"); //functions
            newskuArr.push(vStr);
          });
          params.skus = new Set(removeArrEmpty(newskuArr)); //functions
          if (params.skus == "") {
            this.$message({ type: "warning", message: "请选择监控起始时间" });
            return;
          }
          // console.log(params.skus); // 处理后的params.skus数组
          if (params.monitorFlag == 1) {
            if (!this.dialogData.datePickValue) {
              this.$message({ type: "warning", message: "请选择监控起始时间" });
              return;
            }
            params.monitorFrom = this.dialogData.datePickValue[0];
            params.monitorTo = this.dialogData.datePickValue[1];
          }
          params = this.$.dealObjectValue(params);
          this.loading = true;
          // 扣点按钮loading pointData
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          this.$axios
            .post(ProductAnalysisSaveUrl, params)
            .then(res => {
              this.loading = false;
              // 扣点弹窗
              if (point === 0) {
                if (res.data.code == 0) {
                  this.pointData.show = true;
                  this.pointData.point = res.data.data + "点";
                  this.pointData.formName = formName;
                } else if (code === 500) {
                  this.$message.error(res.data.msg);
                }
                return;
              }
              if (res.data.code == 500) {
                this.$nextTick(() => {
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
                this.data.show = false;
                this.$nextTick(() => {
                  this.pointData.show = false; // 关闭扣点弹窗 pointData
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                if (point === undefined) {
                  this.reloadPointApi(); //重新获取点数
                }
              }
            })
            .catch(err => {
              // console.log("添加产品失败", err);
            });
        }
      });
    }
  },
  computed: {
    ...mapState("common", {
      groupList: state => state.groupingVOS
    }),
    charge() {
      return this.$store.state.competitive.product_charge;
    },
    userSelect() {
      return this.$store.state.common.userSelect;
    },
    type_textarea() {
      return this.$store.state.competitive.type_textarea;
    },
    // 及时更新Id
    platformId() {
      return this.$store.state.common.savePlatformIdAndSiteId.split(",")[0];
    }
  },
  watch: {
    type_textarea(v) {
      this.dialogData.textarea = this.$store.state.competitive.type_textarea;
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
