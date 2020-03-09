<template>
  <div>
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="位置名称">
            <el-input v-model.trim="listQuery.configName" placeholder="请输入关键字" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-date-picker
              v-model="daterange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              size="mini"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <!-- @click="onSubmit" -->
            <!-- <el-button :loading="queryBtnLoading" size="mini" type="primary" plain @click="handleFilter">确认搜索</el-button> -->
            <el-button size="small" type="primary" @click="handleFilter" icon="el-icon-search" :loading="queryBtnLoading">搜索</el-button>
            <el-button size="small" type="primary" plain @click="clear" :disabled='queryBtnLoading'>重置搜索</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <div class="box-data">
      <el-table :data="list" v-loading="listLoading" :key="tableKey" style="width: 100%" border stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="configName" label="位置名称" min-width="80"></el-table-column>
        <el-table-column prop="maxLength" label="有效长度" min-width="80">
          <template slot-scope="scope">
            <div>{{scope.row.minLength}}~{{scope.row.maxLength}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="maxLength" label="关键词推荐长度" min-width="80">
          <template slot-scope="scope">
            <div>{{ (scope.row.recommendKeywordLength ||scope.row.recommendKeywordLength ===0) ? Math.ceil(scope.row.recommendKeywordLength*10000)/100+'%'  :'-' }}</div>
          </template>
        </el-table-column>
         <el-table-column prop="maxLength" label="容错单词数" min-width="80">
          <template slot-scope="scope">
            <div>{{ (scope.row.faultToleranceCnt ||scope.row.faultToleranceCnt ===0) ? scope.row.faultToleranceCnt  :'-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="150"></el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="showDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>-->
    </div>
    <yt-dialog :options="options" :events="events">
      
      <el-form  :model="ruleForm" :rules="rules" ref="ruleForm">
        <div>
            <el-form-item label="校验有效长度" prop="minLength" label-width="110px" style='display:inline-block;'>
              <el-input v-model.trim="ruleForm.minLength" placeholder="开始值" size="small" style='width:160px;'></el-input>
            </el-form-item>
            <el-form-item label="~" prop="maxLength" label-width="30px" style='display:inline-block;'>
              <el-input v-model.trim="ruleForm.maxLength" placeholder="结束值" size="small" style='width:160px;'></el-input>
            </el-form-item>
        </div>
        <el-form-item label="关键词推荐长度" prop="recommendKeywordLength" label-width="110px">
            <el-input v-model.trim="ruleForm.recommendKeywordLength" placeholder="请输入值" size="small" style='width: 350px;'></el-input> %
        </el-form-item>
        <el-form-item label="容错率" prop="faultToleranceCnt" label-width="110px" v-if='lsEditFaultToleranceCnt'>
            <el-input v-model.trim="ruleForm.faultToleranceCnt" placeholder="请输入值" size="small" style='width: 350px;'></el-input> 
        </el-form-item>
      </el-form>

    </yt-dialog>
  </div>
</template>
<script>
import { pickerOptions } from './utils'
const _ = require('lodash')
export default {
  data() {
    let numReg = /^[1-9]\d*$/
    let checkMinLength = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入开始值'))
      } else {
        if (!numReg.test(value)) {
          return callback(new Error('请输入正整数'))
        }
        callback()
      }
    }
    let checkMaxLength = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入结束值'))
      } else {
        if (!numReg.test(value)) {
          return callback(new Error('请输入正整数'))
        } else {
          if (parseInt(value) <= parseInt(this.ruleForm.minLength)) {
            return callback(new Error('结束值不能小于开始值'))
          }
        }
        callback()
      }
    }
    let checkMaxLengthValidator =  (rule, value, callback) => {
      if (!value || isNaN(Number(value))) {
        return callback(new Error('请输入数值'))
      } else {
        if (  Number(value)<0 || Number(value)>100) {
          return callback(new Error('请输入0%到100%之间'))
        } 
        callback()
      }
    }
    let faultToleranceCntValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数值'))
      } else {
        if (!numReg.test(value)) {
          return callback(new Error('请输入正整数'))
        }
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      daterange: [],
      queryBtnLoading: false,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        sortOrder: 'asc',
        configName: null,
        startTime: null,
        endTime: null
      },
      pickerOptions,
      options: {
        visible: false,
        btnLoading: false,
        width: '550px',
        title: '设置',
        okBtnText: '确认'
      },
      events: {
        handleOkClick: () => {
          this.submitForm('ruleForm')
        }
      },
      ruleForm: {
        configId: null,
        minLength: null,
        maxLength: null,
        recommendKeywordLength:null,
        faultToleranceCnt:null,
      },
      rules: {
        minLength: [{ validator: checkMinLength, trigger: 'blur' }],
        maxLength: [{ validator: checkMaxLength, trigger: 'blur' }],
        recommendKeywordLength: [{ validator: checkMaxLengthValidator, trigger: 'blur' }],
        faultToleranceCnt: [{ validator: faultToleranceCntValidator, trigger: 'blur' }],
      },

      lsEditFaultToleranceCnt:true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clear(){
        this.listQuery.pageNumber = 1
        this.daterange=[]
        this.listQuery.startTime = this.daterange[0]
        this.listQuery.endTime = this.daterange[1]
        this.listQuery.configName=null;
        this.getList()
    },
    getList() {
      this.listLoading = true
      this.queryBtnLoading = true
      let configName = this.listQuery.configName
      if (configName !== null) {
        let flag = _.isEmpty(configName.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          this.listQuery.configName = null
        }
      }
      this.$api['keywordConfigList'](this.listQuery)
        .then(res => {
          let { data } = res
          this.list = data

            this.listLoading = false
            this.queryBtnLoading = false
         
        })
        .catch(() => {
          this.listLoading = false
          this.queryBtnLoading = false
        })
    },
    handleFilter() {
      let daterange = this.daterange
      if (daterange !== null) {
        if (daterange.length === 2) {
          this.listQuery.startTime = daterange[0]
          this.listQuery.endTime = daterange[1]
        } else {
          setNull(this)
        }
      } else {
        setNull(this)
      }
      this.listQuery.pageNumber = 1
      this.getList()
      function setNull(vm) {
        vm.listQuery.startTime = null
        vm.listQuery.endTime = null
      }
    },
    showDialog(row) {
      this.options.visible = true
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      };
      if(row.configName==='后台词'){
          this.lsEditFaultToleranceCnt=true ;
      }else {
           this.lsEditFaultToleranceCnt=false ;
      } 
      this.ruleForm.configId = row.configId
      this.ruleForm.minLength = row.minLength
      this.ruleForm.maxLength = row.maxLength
      this.ruleForm.recommendKeywordLength = row.recommendKeywordLength * 100
      this.ruleForm.faultToleranceCnt = row.faultToleranceCnt
    },
    submitForm(formName) {
      this.options.btnLoading = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.ruleForm));
          params.recommendKeywordLength = params.recommendKeywordLength/100
          this.$api['keywordConfigUpdate'](params)
            .then(data => {
              this.options.visible = false
              this.options.btnLoading = false
              this.getList()
            })
            .catch(() => {
              // this.options.visible = false
              this.options.btnLoading = false
            })
        } else {
          console.log('error submit!!')
          this.options.btnLoading = false
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// @import "~@/assets/style/base/variables.less";
.custom-collapse .el-form-item {
    margin-bottom: 10px;
}
.box {
  border: 1px solid @borderColor;
  padding: 10px;
  .box-info {
    font-size: 14px;
    background-color: @boxQueryBGColor;
    padding: 15px;
    border: 1px solid @borderColor;
    span {
      &:first-of-type {
        margin-right: 20px;
      }
      &:last-of-type {
        color: @titleColor;
      }
    }
  }
  .box-query {
    min-width: 680px;
    padding: 15px;
    border-left: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
    border-bottom: 1px solid @borderColor;
    //    display: flex;
    // //    justify-content: center;
    //    align-items: center;
    // //    align-self: center;
    .el-form--inline {
      height: 40px;
    }
    .el-form-item__content {
      .el-input {
        width: 150px;
      }

      .el-range-editor {
        width: 240px;
        /deep/.el-range-separator {
          width: 20px;
        }
      }
    }
  }
  .box-data {
    .el-pagination {
      margin-top: 5px;
      padding-left: 0;
      /deep/.el-pagination__sizes {
        .el-input {
          margin-left: 0 !important;
        }
      }
    }
  }
  /deep/.el-dialog__body {
    padding-bottom: 0;
  }
}
</style>


