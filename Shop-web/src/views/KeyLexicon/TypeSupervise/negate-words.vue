<template>
    <div class="box">
        <div class="box-data">
            <el-table
                :data="list"
                v-loading="listLoading"
                :key='tableKey'
                style="width: 100%"
                border
                stripe>
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="ruleName"
                label="规则名称"
                min-width="70">
                </el-table-column>
                <el-table-column
                prop="expression"
                label="计算公式"
                min-width="70">
                </el-table-column>
                <el-table-column
                prop="ruleType"
                label="类型"
                min-width="70">
                    <template slot-scope="scope">
                        <div v-if="scope.row.ruleType=='PRODUCT_ADVERT_NEGATE'">产品</div>
                        <div v-else-if="scope.row.ruleType=='CATE_ADVERT_NEGATE'">类目</div>
                        <div v-else>其它</div>
                    </template>
                </el-table-column>
                <el-table-column
                prop="updateTime"
                label="修改时间"
                min-width="135">
                </el-table-column>
                <el-table-column
                label="操作"
                width="55">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" icon="el-icon-edit-outline"@click="showDialog(scope.row);"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <formula-board ref="formulaNegateBoard" v-on:reLoad="getList" />
    </div>
</template>
<script>
import { pickerOptions} from "../utils";
import FormulaBoard from "./components/formula-board";
export default {
    components: {FormulaBoard },
    data(){
        let vm = this
        return {
            pickerOptions,
            tableKey: 0,
            list: null,
            listLoading: false,
            options: {
                visible: false,
                width:'620px',
                title: '添加/编辑',
                okBtnText: '确认保存'
            },
            events: {
                handleOkClick: () =>{
                    this.options.visible = false
                }
            },
            fieldKeyOptions:[]
        }
    },
    created(){
        // setTimeout(() => {
        //     this.getfieldKeyOptions()  
        // }, 1.5 * 1000)
        this.getList()
        
    },
    methods: {
    //   getfieldKeyOptions(){
    //          this.$api["keywordDataFieldListAll"]({fieldOrigin:null}).then(res => {
    //            let {data} =res
    //            let fieldKeyOptions =[]
    //            _(data).forEach(val=>{
    //                 let item ={value:val.fieldKey,label:val.displayName}
    //                 fieldKeyOptions.push(item)
    //             })
    //             this.fieldKeyOptions =fieldKeyOptions
    //             this.getList()
    //         }).catch(() => {
    //             this.$message.error('筛选公式加载失败!');
    //         })
    //     },
    //      formatterFormula(row, column){
    //        let formulaNameArr =this.fieldKeyOptions.filter(element => {
    //         return element.value === row.fieldKey;
    //       });
        
    //     },
      getList() {
          this.listLoading = true
          this.$api["keywordDecisionRuleListAD"]().then(res => {
                let {data}= res
                this.list =data
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
          }).catch(() => {
              this.listLoading = false
          })
      },
      showDialog(row){
        this.$refs.formulaNegateBoard.showDialog('negate-words',row);
      }
      
    }
}
</script>
<style lang="less" scoped>
  @import './common';
//   .box-query{
//       min-width: 850px;
//   }
//   .box-update{
//       min-width: 310px;
//   }
.el-form-item {
    margin-bottom: 10px;
}
  .box-data{
      margin-top: 0;
  }
  .dialog-form{
      .form-item-row-1{
          /deep/.el-form-item__label{
              width: 72px;
          }
          width: 550px;
      }
      .form-item-row-2{
          width: 550px;
          .el-select{
              width: 180px;
          }
      }
      .form-item-row-3{
          .el-select{
              width: 110px;
          }
          .el-input{
              width: 200px;
          }
      }
  }
</style>
