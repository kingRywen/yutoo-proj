<template>
  <div className="basic-form">

    <basic-container>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="名称" prop="formuleName">
          <el-input v-model="ruleForm.formuleName"></el-input>
        </el-form-item>
        <el-form-item label="选择生命周期" prop="cycleType" required>
          <el-select v-model="ruleForm.cycleType" placeholder="请选择生命周期">
            <el-option v-for="item in $store.state.cycleType" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周期监控参数" v-if="show">
          <!-- 周期监控参数 -->
          <div v-for="(cycle, cycleIndex) in ruleForm.cycleMonitorParm">
            <el-row :gutter="20" style="margin-bottom:20px;margin-left:10px">
              <el-col :span="8">
                <el-form-item :label="cycleIndex === 0 ?'上架时间高于等于' :'上架时间低于'" :prop="'cycleMonitorParm[' + cycleIndex + '].day'" required :rules="[{required: true, message: '必须是正整数',type:'integer'}]">
                  <el-input :value="cycle.day" @input="val => (ruleForm.cycleMonitorParm[0].day = ~~val, ruleForm.cycleMonitorParm[1].day = ~~val)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                天
              </el-col>
            </el-row>

            <!-- BSR排名 -->
            <el-row :gutter="20" style="margin-bottom:20px;margin-left:10px" v-for="(item,index) in cycle.bsrRanking">
              <el-col :span="4">
                <el-form-item :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].largeRankingStart'" :rules="[{required: true, message: '必须是正整数', type:'integer'}]" label="BSR排名" label-width="80px" :required="index !== 0">
                  <el-input :disabled="index === 0" v-model.number="item.largeRankingStart" @input="setStartEqualVal(item, index, $event, cycle.bsrRanking)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align:center">
                ~
              </el-col>
              <el-col :span="3">
                <el-form-item :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].largeRankingEnd'" :rules="{required: true, message: '必须是正整数',type:'integer'}" :required="index !== cycle.bsrRanking.length - 1">
                  <el-input :disabled="index === cycle.bsrRanking.length - 1 && cycle.bsrRanking.length > 1" v-model.number="item.largeRankingEnd" @input="setEndEqualVal(item, index, $event, cycle.bsrRanking)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="计算周期" label-width="80px" :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].cycle'" :rules="{required: true, message: '请输入正整数',type:'integer'}" required>
                  <el-input v-model.number="item.cycle"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align:center">
                天
              </el-col>
              <el-col :span="4">
                <el-form-item label="幅度" label-width="80px" :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].range'" :rules="{required: true, message: '请选择一项', trigger: 'change'}" required>
                  <el-select v-model.number="item.range" required>
                    <el-option label="比例" :value="1"></el-option>
                    <el-option label="值" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].rangeValue'" :rules="{required: true, message: '请输入数字',type:'number'}" required>
                  <el-input v-model.number="item.rangeValue">
                    <i slot="suffix" v-if="item.range === 1">
                      %
                    </i>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1" v-if="index === cycle.bsrRanking.length - 1">
                <el-button plain icon="el-icon-plus" @click="addBsr(cycleIndex, index)"></el-button>
              </el-col>
              <el-col :span="1" v-else>
                <i class="el-icon-remove" @click="delBsr(cycleIndex, index)" style="cursor:pointer"></i>
              </el-col>

            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="缺货监控参数" prop="delivery">
          <!-- 缺货监控参数 -->
          <el-row :gutter="20" v-for="(item,index) in ruleForm.shortageMonitorParm" style="margin-bottom:20px;margin-left:10px">
            <el-col :span="4">
              <el-form-item label="运输方式" label-width="80px" :prop="'shortageMonitorParm[' + index + '].transportFirstId'" :rules="{required: true, message: '请选择运输方式'}" required>
                <el-select v-model="item.transportFirstId" filterable allow-create required>
                  <el-option v-for="tr in transportType" :label="tr.label" :value="tr.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="保底天数" label-width="80px" :prop="'shortageMonitorParm[' + index + '].insuredDays'" :rules="{required: true, message: '请输入正整数',type:'integer'}" required>
                <el-input v-model.number="item.insuredDays"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="备货天数" label-width="80px" :prop="'shortageMonitorParm[' + index + '].stockDays'" :rules="{required: true, message: '请输入正整数',type:'integer'}" required>
                <el-input v-model.number="item.stockDays"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="运输天数" label-width="80px" :prop="'shortageMonitorParm[' + index + '].transportDays'" :rules="{required: true, message: '请输入正整数',type:'integer'}" required>
                <el-input v-model.number="item.transportDays"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="index === 0">
              <el-form-item label="日平均销量计算周期" label-width="160px" prop="avgDays" :rules="{required: true, message: '请输入正整数',type:'integer'}" required>
                <el-input v-model.number="ruleForm.avgDays"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-else>
              <i class="el-icon-remove" @click="removeshortageMonitorParm(index)" style="cursor:pointer"></i>
            </el-col>

          </el-row>
          <el-row style="margin-left:30px">
            <el-col>
              <el-button plain icon="el-icon-plus" @click="addshortageMonitorParm"></el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="是否激活" prop="type">
          <el-switch v-model="ruleForm.activeFlag"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openDialog">保存</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>

      </el-form>

    </basic-container>
    <el-dialog title="提示" :visible.sync="dialogVisible" append-to-body>
      <span>是否立即使用该公式计算产品?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">不计算只保存</el-button>
        <el-button type="primary" @click="calc">立即计算保存</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BasicContainer from "@vue-materials/basic-container";
import { mapActions, mapState } from "vuex";
import { fetchData, showToast } from "@/common/common";
import apis from "@/apis";

export default {
  components: { BasicContainer },
  name: "BasicForm",

  created() {
    this.getCycleType();
    this.getTransportType();
    if (this.$route.params.formulaId != null) {
      this.edit = true;
      this.getEditData();
    }
  },

  data() {
    return {
      dialogVisible: false,
      show: false,

      ruleForm: {
        // 要提交的数据
        calculationFlag: false,
        formuleName: "",
        cycleType: null,
        cycleMonitorParm: [
          {
            judgementType: 1,
            day: null,
            bsrRanking: [
              {
                largeRankingStart: 0,
                largeRankingEnd: null,
                cycle: null,
                range: null,
                rangeValue: null
              }
            ]
          },
          {
            judgementType: 2,
            day: null,
            bsrRanking: [
              {
                largeRankingStart: 0,
                largeRankingEnd: null,
                cycle: null,
                range: null,
                rangeValue: null
              }
            ]
          }
        ],
        shortageMonitorParm: [
          {
            transportFirstId: null,
            insuredDays: null,
            stockDays: null,
            transportDays: null
          }
        ],
        avgDays: null,
        activeFlag: true
      },
      rules: {
        formuleName: [{ required: true, message: "请输入名称" }],
        cycleType: [{ required: true, message: "请选择生命周期" }]
      }
    };
  },
  methods: {
    validateLeft(item, index, cycleIndex) {
      let start = 0;
      if (index >= 1) {
        start = this.ruleForm.cycleMonitorParm[cycleIndex].bsrRanking[index - 1]
          .largeRankingEnd;
      }
      return (rule, value, callback) => {
        if (index === 0) {
          callback();
          return;
        }
        if (value > start) {
          callback(new Error("太大"));
        } else {
          callback(new Error("太小"));
        }
      };
    },
    cancel() {
      this.$router.push("/IntelligentReplenishment/setCalculate");
    },
    // 编辑进入获取数据
    getEditData() {
      fetchData({
        ...apis.REPLENISHFORMULA_INFO,
        data: {
          formulaId: +this.$route.params.formulaId
        }
      }).then(res => {
        if (res.data.code === 0) {
          if (
            res.data.rows.cycleMonitorParm == "" ||
            res.data.rows.cycleMonitorParm == null
          ) {
            delete res.data.rows.cycleMonitorParm;
          }
          this.ruleForm = {
            ...this.ruleForm,
            ...res.data.rows
          };
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 移除缺货
    removeshortageMonitorParm(index) {
      this.ruleForm.shortageMonitorParm.splice(index, 1);
    },
    // 增加缺货
    addshortageMonitorParm(index) {
      this.ruleForm.shortageMonitorParm.push({
        transportFirstId: null,
        insuredDays: null,
        stockDays: null,
        transportDays: null
      });
    },

    // 增加Bsr
    addBsr(i, index) {
      this.ruleForm.cycleMonitorParm[i].bsrRanking.push({
        largeRankingStart: this.ruleForm.cycleMonitorParm[i].bsrRanking[index]
          .largeRankingEnd,
        largeRankingEnd: 1,
        cycle: null,
        range: null,
        rangeValue: null
      });
      if (
        this.ruleForm.cycleMonitorParm[i].bsrRanking[index].largeRankingEnd ===
        1
      ) {
        this.ruleForm.cycleMonitorParm[i].bsrRanking[
          index
        ].largeRankingEnd = null;
        this.ruleForm.cycleMonitorParm[i].bsrRanking[
          index + 1
        ].largeRankingStart = null;
      }
    },

    delBsr(i, index) {
      if (index !== 0) {
        this.ruleForm.cycleMonitorParm[i].bsrRanking.splice(index, 1);
      } else {
        this.ruleForm.cycleMonitorParm[i].bsrRanking.splice(1, 1);
      }
      this.ruleForm.cycleMonitorParm[i].bsrRanking[
        index
      ].largeRankingStart = this.ruleForm.cycleMonitorParm[i].bsrRanking[
        index - 1
      ].largeRankingEnd;
      this.ruleForm.cycleMonitorParm[i].bsrRanking[
        index
      ].largeRankingEnd = null;
    },

    setStartEqualVal(item, index, val, bsrRanking) {
      bsrRanking[index - 1].largeRankingEnd = val;
    },

    setEndEqualVal(item, index, val, bsrRanking) {
      if (bsrRanking[index + 1]) {
        bsrRanking[index + 1].largeRankingStart = val;
      }
    },

    openDialog() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.dialogVisible = true;
        }
      });
    },

    save() {
      // this.dialogVisible = true;
      this.ruleForm.calculationFlag = false;
      this.saveApi();
    },

    calc() {
      this.ruleForm.calculationFlag = true;
      this.saveApi();
    },

    cancel1() {
      this.dialogVisible = false;
      // this.$router.push("/IntelligentReplenishment/setCalculate");
    },

    saveApi() {
      let api = apis.REPLENISHFORMULA_SAVE;
      if (this.edit) {
        api = apis.REPLENISHFORMULA_UPDATE;
      }
      fetchData({ ...api, data: this.ruleForm }).then(res => {
        if (res.data.code === 0) {
          showToast("success", res.data.msg);
          this.$router.push("/IntelligentReplenishment/setCalculate");
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    ...mapActions(["getCycleType", "getTransportType"])
  },
  computed: mapState(["transportType"]),
  watch: {
    "ruleForm.cycleType"(val) {
      if (val === 2) {
        this.show = false;
      } else {
        this.show = true;
      }
    }
  }
};
</script>

<style>
.basic-form {
}
</style>
