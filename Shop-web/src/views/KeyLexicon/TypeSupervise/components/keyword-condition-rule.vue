<template>
    <yt-dialog  :options="KeywordConditionRuleOptions" :events="KeywordConditionRuleEvents">
           <el-form size="small" :model="dynamicValidateForm" ref="dynamicValidateForm" :label-width="isAdd ? `120px` : `86px`" class="dialog-dynamic">
              <el-form-item
                prop="decisionRuleId"
                label="关键词属性名称"
                :rules="{
                    required: true, message: '关键词属性名称不能为空', trigger: 'blur'
                  }"
                  v-if="isAdd">
                <el-select v-model="dynamicValidateForm.decisionRuleId" placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in decisionRuleOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
              </el-form-item>
              <el-form-item
                prop="ruleName"
                label="名称"
                :rules="{
                    required: true, message: '名称不能为空', trigger: 'blur'
                  }">
                <el-input v-model="dynamicValidateForm.ruleName" placeholder="请输入" size="mini"></el-input>
              </el-form-item>
              
              <el-form-item
                v-for="(expression, index) in dynamicValidateForm.expression"
                label="规则"
                :key="expression.key"
                class="dynamic-form-item"
                :prop="'expression.' + index + '.value'"
                :rules="{
                    required: true, message: '规则不能为空', trigger: 'blur'
                  }">
                  <el-cascader
                    expand-trigger="hover"
                    :options="expressionOptions"
                    v-model="expression.value"
                    size="mini">
                  </el-cascader>
                <el-button class="ml10" type="text" size="mini" icon="el-icon-plus" @click.prevent="addExpression" ></el-button>
                <el-button type="text" size="mini" v-if="dynamicValidateForm.expression.length > 1" icon="el-icon-minus" @click.prevent="removeExpression(expression)" ></el-button>
                
              </el-form-item>
            </el-form>
    </yt-dialog>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      KeywordConditionRuleOptions: {
        visible: false,
        title: "添加/编辑",
        width: "430px",
        okBtnText: "确认",
         btnLoading:false,
      },
      KeywordConditionRuleEvents: {
        handleOkClick: () => {
          this.KeywordConditionRuleSubmitForm();
        }
      },
      dynamicValidateForm: {
        expression: [
          {
            value: []
          }
        ],
        ruleName: null,
        decisionRuleId: null
      },
      decisionRuleOptions: [],
      expressionOptions: [],
      isAdd: false
    };
  },

  methods: {
    showKeywordConditionRuleDialog(row) {
      console.log(row)
      if (this.$refs.dynamicValidateForm !== undefined) {
        this.$refs.dynamicValidateForm.resetFields();
        this.dynamicValidateForm.decisionRuleId = null
        this.dynamicValidateForm.ruleName =null
        this.dynamicValidateForm.expression = [{ value: [] }];
      }

      this.$api["keywordDecisionRuleListUp"]()
        .then(res => {
          let { data } = res;
          let decisionRuleOptions = [];
          _(data).forEach(element => {
            decisionRuleOptions.push({
              value: element.ruleId,
              label: element.ruleName
            });
          });
          this.decisionRuleOptions = decisionRuleOptions;
        })
        .catch(() => {
          return;
        });
      this.$api["keywordFilterConditionListAll"]().then(res => {
        let { data } = res;
        let children = [
          {
            value: "HIGH",
            label: "高"
          },
          {
            value: "MIDDLE",
            label: "中"
          },
          {
            value: "LOW",
            label: "低"
          }
        ];
        let expressionOptions = [];
        _(data).forEach(element => {
          let item = {
            value: `id_${element.conditionId}`,
            label: element.conditionName,
            children
          };
          expressionOptions.push(item);
        });
        this.expressionOptions = expressionOptions;
      });

      if (row !== null && row.parent) {
        this.isAdd = false;
        this.dynamicValidateForm.ruleId = row.ruleId;

        this.dynamicValidateForm.ruleName = row.ruleName;
        this.dynamicValidateForm.decisionRuleId = row.parent.ruleId;
        
        let expression = JSON.parse(row.expression);
        
        let expressionArr = [];
        
        _(expression).forEach(element => {
          _.forIn(element, function(value, key) {
            expressionArr.push([key, value]);
          });
        });

        for (let index = 0; index < expressionArr.length; index++) {
          const element = expressionArr[index];
          let item = { value: element, key: Date.now() };
          this.dynamicValidateForm.expression[index] = item;
        }
      } else {
        this.isAdd = true;
      }

      this.KeywordConditionRuleOptions.visible = true;
    },
    KeywordConditionRuleSubmitForm() {
      this.$refs.dynamicValidateForm.validate(valid => {
        if (valid) {
         
          let expressions =this.dynamicValidateForm.expression
          let tailenderArr =expressions[expressions.length-1].value
          if(expressions.length>=2){
            let array =expressions
            for (let index = 0; index < array.length-1; index++) {
              const element = array[index].value;
              if(tailenderArr[0]===element[0]&&tailenderArr[1]===element[1]){
                this.$message.warning("规则有重复");
                return
              }
            }
          }      
          let { ruleName, decisionRuleId } = this.dynamicValidateForm;
           this.KeywordConditionRuleOptions.btnLoading=true;
          let params = {
            ruleName,
            decisionRuleId,
            expression: [],
            ruleId: this.dynamicValidateForm.ruleId
          };
          let expressionArr = this.dynamicValidateForm.expression;
          
          _(expressionArr).forEach(element => {
            // params.expression[element.value[0]] = element.value[1];
            let item ={}
            item[element.value[0]] =element.value[1]
            params.expression.push(item)
          });

          let apiName = "keywordConditionRuleSave";
          if (!this.isAdd) {
            apiName = "keywordConditionRuleUpdate";
            delete params.decisionRuleId;
          } else {
            delete params.ruleId;
          }
          // params.expression =JSON.stringify(params.expression)
          this.$api[apiName](params).then(res => {
            this.KeywordConditionRuleOptions.visible = false;
             this.KeywordConditionRuleOptions.btnLoading=false;
            this.$emit("reLoad");
          });
        } else {
          console.log("error submit!!");
          this.KeywordConditionRuleOptions.btnLoading=false;
          return false;
        }
      });
    },
    removeExpression(item) {
      var index = this.dynamicValidateForm.expression.indexOf(item);
      //检查最后一个不能删除
      if (this.dynamicValidateForm.expression.length > 1) {
        if (index !== -1) {
          this.dynamicValidateForm.expression.splice(index, 1);
        }
      }
      // else{

      // }
    },
    addExpression() {
      let expressions =this.dynamicValidateForm.expression
      let tailenderArr =expressions[expressions.length-1].value
      if(expressions.length>=1){
        if(tailenderArr.length===0){
          this.$message.warning("规则不能为空");
          return
        }
      }
      if(expressions.length>=2){
        let array =expressions
        for (let index = 0; index < array.length-1; index++) {
          const element = array[index].value;
          if(tailenderArr[0]===element[0]&&tailenderArr[1]===element[1]){
            this.$message.warning("规则有重复");
            return
          }
        }
      }
      this.dynamicValidateForm.expression.push({
        value: [],
        key: Date.now()
      });
    }
  }
};
</script>
<style lang="less" scoped>
.dialog-dynamic {
  .dynamic-form-item {
    .el-cascader {
      margin-right: 5px;
    }
  }
  /deep/.el-input {
    width: 195px;
  }
}
</style>
