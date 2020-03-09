<template>
  <yt-dialog :options="options" :events="events" class="formula-dialog ___common">
    <el-form size="small" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="90px" class="ad-ruleForm">
      <el-form-item label="属性名称">
        <el-input v-model="ruleForm.customName" placeholder="" size="mini" :readonly='true' :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <div class="formula-body __ruleinput">
      <div class="column-1" style="font-size: 12px;text-align: right;padding-right: 12px">
        计算公式
      </div>
      <div class="column-2">
        <div class="symbol">
          <!-- <el-button type="text" @click="addFormulaBtns('symbol','-')">-</el-button> -->
          <!-- <el-button type="text" @click="addFormulaBtns('symbol','*')">*</el-button> -->
          <!-- <el-button type="text" @click="addFormulaBtns('symbol','/')">/</el-button> -->
          <!-- <el-button type="text" @click="addFormulaBtns('symbol','=')">=</el-button> -->
          <el-button type="text" @click="addFormulaBtns('symbol','(')">(</el-button>
          <el-button type="text" @click="addFormulaBtns('symbol',')')">)</el-button>
          <!-- <el-button type="text" @click="addFormulaBtns('symbol','<')">&lt;</el-button> -->
          <!-- <el-button type="text" @click="addFormulaBtns('symbol','>')">&gt;</el-button> -->
          <!-- <el-button type="text" @click="addFormulaBtns('symbol','<=')">&lt;=</el-button> -->
          <!-- <el-button type="text" @click="addFormulaBtns('symbol','>=')">&gt;=</el-button> -->
          <el-button type="text" @click="addFormulaBtns('symbol','&&')">&amp;&amp;</el-button>
          <el-button type="text" @click="addFormulaBtns('symbol','||')">||</el-button>
        </div>
        <div class="param-title">
          数据项
        </div>
        <div class="param">
          <el-button type="info" size="mini" v-for="item in formulaParamList" :key="item.fieldKey" @click="addFormulaBtns(item.fieldKey,item.displayName,item.selects,item.value,item.inputValue)">{{item.displayName}}</el-button>
        </div>

      </div>
      <div class="column-3" ref="formulaBoard">
        <draggable v-model="formulaParamBtns" @start="drag=true" @end="drag=false" class="draggable">
          <div v-for="(item,index) in formulaParamBtns" :key="index" class="formula-btn">
            <div class="btn-txt">
              {{item.displayName}}
            </div>
            <div class="item-symbol" v-if="item.fieldKey!=='symbol'">
              <el-select v-model="item.value" placeholder="符号" size="mini" :clearable="true">
                <el-option v-for="el in item.selects" :key="el.value" :label="el.label" :value="el.value">
                </el-option>
              </el-select>
            </div>
            <div class="item-symbol" v-if="item.fieldKey!=='symbol'">
              <el-input size="mini" placeholder="值" v-model="item.inputValue">
                <template v-if="item.fieldKey&&item.fieldKey.includes('_rates')" slot="append">%</template>
              </el-input>
            </div>
            <i class="el-icon-circle-close-outline" @click="btnClose(index)"></i>
          </div>
        </draggable>
        <div style="color:#f56c6c;font-size:12px;margin-left: 10px;" v-show="formulaMsg">请设置公式</div>
      </div>
    </div>
    <div class="param-clean">
      <el-button type="warning" size="mini" @click="clearParams">清 空</el-button>
    </div>
  </yt-dialog>
</template>
<script>
import draggable from "vuedraggable";
import _ from "lodash";
export default {
  components: {
    draggable
  },
  data() {
    return {
      formulaParamList: [],
      ruleForm: {
        customName: null
      },
      rules: {
        customName: [
          { required: true, message: "请输入属性名称", trigger: "blur" }
        ]
      },
      formulaParamBtns: [],
      // fieldOrigin:'ADVERT',
      options: {
        visible: false,
        width: "850px",
        title: "添加/编辑",
        okBtnText: "确认",
        btnLoading:false,
      },
      events: {
        handleOkClick: () => {
          this.saveFormula();
        }
      },
      formulaMsg: false,
      form: {
        ruleId: null,
        ruleType: null,
        expression: null
      },
      selects: [
        {
          value: "<",
          label: "<"
        },
        {
          value: ">",
          label: ">"
        },
        {
          value: ">=",
          label: ">="
        },
        {
          value: "<=",
          label: "<="
        },

        {
          value: "==",
          label: "="
        }
      ],
      // value: ""
      i: 0
    };
  },
  methods: {
    showDialog(page, row) {
      // console.log(row);
      if (!_.isUndefined(this.$refs["ruleForm"])) {
        this.$refs["ruleForm"].resetFields();
      }
      if (this.$refs.formulaBoard !== undefined) {
        this.setFormulaStyle();
      }
      let params = {};
      if (page === "negate-words") {
        params = { fieldOrigin: "ADVERT" };
      }
        this.options.visible = true;
      this.$api["keywordDataFieldListAll"](params)
        .then(res => {
          this.formulaParamList = [];
          this.formulaParamBtns = [];
          this.ruleForm.customName = null;
          let { data } = res;
          data.forEach(val => {
            let item = {
              fieldKey: val.fieldKey,
              displayName: val.displayName,
              selects: this.selects,
              value: "",
              inputValue: ""
            };
            this.formulaParamList.push(item);
          });
          // console.log(this.formulaParamList, "formulaParamList");
          this.options.visible = true;
          this.getHistoryRule(row.ruleId);
        })
        .catch(err => {
          console.log(err);
          this.$message.error("数据项加载失败!");
        });
      this.form.ruleId = row.ruleId;
      this.form.ruleType = row.ruleType;
      this.form.expression = row.expression;
      this.page = page;
      //   page related-words negate-words
    },
    // 回显历史表达式
    getHistoryRule(ruleId) {
      let params = {
        ruleId
      };
      this.$api["keywordDecisionRuleInfo"](params)
        .then(data => {
          this.ruleForm.customName = data.ruleName;
          if (data.expression) {
            let fieldKey,
              displayName,
              selects = this.selects,
              value,
              inputValue,
              item;
            // this.formulaParamBtns.push(item);
            let arr,
              arr2 = [],
              arr3 = [],
              arr4 = [],
              str = JSON.parse(JSON.stringify(data.expression));
            console.log(str, "str");
            arr = str.split("||");
            let arr_copy = JSON.parse(JSON.stringify(arr));
            // 增加||
            let reslut = this.insert(arr, arr_copy, "||");
            // console.log(reslut, "relsut");
            // 增加&&
            reslut.forEach((el, index) => {
              let new_el = [];
              new_el = el.split("&&");
              // console.log(new_el);
              let new_el_copy = JSON.parse(JSON.stringify(new_el));
              let new_el_result = this.insert(new_el, new_el_copy, "&&");
              arr2.push(...new_el_result);
            });
            // 将‘（’和‘）’变成项
            arr2.forEach((el, index) => {
              let new_el = [];
              new_el = el.split("(");
              new_el.forEach((i, j) => {
                if (i === "") {
                  new_el.splice(j, 1, "(");
                }
              });
              arr3.push(...new_el);
            });
            arr3.forEach((el, index) => {
              let new_el = [];
              new_el = el.split(")");
              new_el.forEach((i, j) => {
                if (i === "") {
                  new_el.splice(j, 1, ")");
                }
              });
              arr4.push(...new_el);
            });
            // console.log(arr4, "arr4");
            //  将数组处理成回显
            this.formulaParamBtns = [];
            arr4.forEach((el, index) => {
              if (el === "(" || el === ")" || el === "&&" || el === "||") {
                this.formulaParamBtns.push({
                  fieldKey: "symbol",
                  displayName: el
                });
              } else {
                let values = data.values;
                if (el.indexOf(">=") !== -1) {
                  this.byStr(el, ">=", values);
                } else if (el.indexOf("<=") !== -1) {
                  this.byStr(el, "<=", values);
                } else if (el.indexOf("=") !== -1) {
                  this.byStr(el, "==", values);
                } else if (el.indexOf(">") !== -1) {
                  this.byStr(el, ">", values);
                } else if (el.indexOf("<") !== -1) {
                  this.byStr(el, "<", values);
                }
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("数据项加载失败!");
        });
    },
    // 增加||和&&
    insert(arr, arr_copy, str) {
      this.i = 0;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== str) {
          // console.log(i, "i");
          // console.log(arr[i], "arr[i]");
          arr_copy.splice(i + this.i, 0, str);
          this.i += 1;
          // console.log(this.i, "this.i");
          // console.log(arr_copy, "arr_copy");
        }
      }
      return arr_copy;
    },
    // 根据符号切割回显
    byStr(el, str, values) {
      let new_el = el.split(str);
      // 通过fieldKey 找出displayName
      // console.log(this.formulaParamList, "formulaParamList");
      let item = this.formulaParamList.find(i => {
        return i.fieldKey === new_el[0];
      });
      let inputValue = values[new_el[1]];
      // console.log(item, "item");
      this.formulaParamBtns.push({
        fieldKey: new_el[0],
        displayName: item.displayName,
        selects: this.selects,
        value: str,
        inputValue: inputValue
      });
    },
    // 点击数据项
    addFormulaBtns(fieldKey, displayName, selects, value, inputValue) {
      this.setFormulaStyle();
      this.formulaParamBtns.push({
        fieldKey,
        displayName,
        selects,
        value,
        inputValue
      });
      console.log(this.formulaParamBtns, "formulaParamBtns");
    },
    btnClose(index) {
      this.formulaParamBtns.splice(index, 1);
    },
    clearParams() {
      this.formulaParamBtns = [];
      this.setFormulaStyle();
    },
    setFormulaStyle() {
      let style = this.$refs.formulaBoard.style;
      style.borderWidth = "0";
      this.formulaMsg = false;
    },
    saveFormula() {
      if (this.formulaParamBtns.length === 0) {
        let style = this.$refs.formulaBoard.style;
        style.border = "1px solid #f56c6c";
        style.borderRadius = "4px";
        this.formulaMsg = true;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.formulaParamBtns.length === 0) {
            return;
          }
          // console.log(this.formulaParamBtns, "formulaParamBtns");
          let notAllStr = false;
          let notAllInput = false;
          let hasNaN = false;
          let expression = "",
            params = [],
            variables = {};
          // console.log(this.formulaParamBtns, "提交this.formulaParamBtns");
          this.formulaParamBtns.forEach((el, index) => {
            if (el.fieldKey === "symbol") {
              expression += el.displayName;
            } else {
              if (!el.value) {
                if (el.fieldKey !== "symbol") {
                  notAllStr = true;
                }
              } else if (el.inputValue === "") {
                if (el.fieldKey !== "symbol") {
                  notAllInput = true;
                }
                return false;
              } else {
                expression += el.fieldKey;
                expression += el.value;
                let key = "key" + index;
                expression += key;
                params.push(el.fieldKey);
                let u = +el.inputValue;
                console.log(expression, "expression");
                if (isNaN(u)) {
                  // console.log(u, "uuuu");
                  hasNaN = true;
                } else {
                  variables[key] = +el.inputValue;
                  // console.log(variables, "variables");
                }
              }
            }
          });
          if (notAllStr === true) {
            this.$message.warning("请确认每个选择框都选择了符号");
            return;
          } else if (notAllInput === true) {
            this.$message.warning("请确认每个输入框都输入了值");
            return;
          } else if (hasNaN === true) {
            this.$message.warning("请确认每个输入的值是数字");
            return;
          }
          this.options.btnLoading=true;
          let arg = {
            ruleId: this.form.ruleId,
            ruleType: this.form.ruleType,
            expression,
            params,
            variables: JSON.parse(JSON.stringify(variables))
          };
          arg = this.$.dealObjectValue(arg);
          console.log(arg, "arg");
          this.$api["keywordDecisionRuleUpdate"](arg).then(data => {
            this.options.visible = false;
             this.options.btnLoading=false;
            this.$emit("reLoad");
          });
          // console.log(arg, "arg");
        } else {
          console.log("error submit!!");
          this.options.btnLoading=false;
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.formula-dialog {
  font-size: 12px !important;
  .formula-body {
    display: flex;
    .column-1 {
      width: 90px;
      padding-left: 18px;
      padding-top: 7px;
    }
    .column-2 {
      width: 220px;
      .symbol {
        .el-button--text {
          padding: 7px;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .param-title {
        text-align: center;
        padding: 5px;
        background-color: @boxQueryBGColor;
      }
      .param {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid @borderColor;
        padding-left: 5px;
        padding-bottom: 5px;
        .el-button {
          padding: 7px;
          margin-left: 0;
          margin-right: 5px;
          margin-top: 5px;
        }
      }
    }
    .column-3 {
      width: 480px;
      margin-left: 10px;
      background-color: @boxQueryBGColor;
      .draggable {
        padding: 5px 0 5px 10px;
        display: flex;
        flex-wrap: wrap;
        .formula-btn {
          margin-right: 10px;
          font-size: 12px;
          display: flex;
          height: 30px;
          .btn-txt {
            cursor: move;
            padding-top: 8px;
            padding-right: 5px;
          }
          .item-symbol {
            width: 55px;
            margin-right: 5px;
            /deep/.el-input__inner {
              padding-left: 5px;
              padding-right: 5px;
            }
          }
          .item-param {
            width: 50px;
            margin-right: 0;
            /deep/.el-input__inner {
              padding-left: 5px;
              padding-right: 5px;
            }
          }
          /deep/[class^="el-icon-"] {
            font-size: 10px;
            width: 10px;
            height: 10px;
            color: red;
            cursor: pointer;
          }
        }
      }
    }
  }
  .param-clean {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
