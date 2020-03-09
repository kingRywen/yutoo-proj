<template>
  <div class="box">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery">
        <el-form-item label="策略名称">
          <el-input v-model.trim="listQuery.ruleName" placeholder="请输入" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker v-model="daterange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" size="mini" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- <el-button size="mini" type="primary" plain @click="getList">确认搜索</el-button> -->
          <el-button size="small" type="primary" @click="handleFilter" icon="el-icon-search" :loading="searchLoading">搜索</el-button>
          <el-button size="small" type="primary" plain @click="clear" :disabled='searchLoading'>重置搜索</el-button>
        </el-form-item>
      </el-form>
      </el-collapse-item>
    </el-collapse>

    <div class="box-update">
      <el-button size="mini" type="primary" plain @click="showKeywordConditionRuleDialog(null)">添加标题卖点策略</el-button>
      <el-button size="mini" type="primary" plain @click="deleteRows(null)">删除</el-button>
    </div>
    <div class="box-data">
      <tree-table :data="list" :eval-func="func" :eval-args="args" :expand-all="expandAll" border v-loading="listLoading" :key='tableKey' v-on:handleSelectionChange="handleSelectionChange">

        <!-- <el-table-column label="关键词属性名称2" min-width="110">
          <template slot-scope="scope">
            <div v-if="scope.row.children">
              {{scope.row.ruleName}}
            </div>
          </template>
        </el-table-column> -->

        <el-table-column prop="ruleName" label="策略" min-width="60">
          <template slot-scope="scope">
            <div v-if="!scope.row.children">
              {{scope.row.ruleName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" min-width="135" label="修改时间">
        </el-table-column>
        <el-table-column label="操作" width="75">
          <template slot-scope="scope">
            <!--
                  判断 父节点 ruleType 或 expressionId

                  父节点没有decisionRuleId
                -->
           
            <!-- <el-button type="text" size="mini" icon="el-icon-edit-outline" v-if="scope.row.ruleName==='其他词'?false:true" @click="showKeywordConditionRuleDialog(scope.row)"></el-button> -->
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="showKeywordConditionRuleDialog(scope.row)"></el-button>
             <el-button type="text" size="mini" icon="el-icon-delete" v-if="scope.row.decisionRuleId" @click="deleteRows(scope.row.ruleId)"></el-button>
          </template>
        </el-table-column>

      </tree-table>
      <!-- <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination> -->
    </div>
    <keyword-condition-rule ref="keywordConditionRule" v-on:reLoad="getList" />
    <formula-board ref="formulaBoard" v-on:reLoad="getList" />
  </div>
</template>
<script>
import { pickerOptions } from "../utils";
import treeTable from "./TreeTable";
import treeToArray from "./customEval";
import KeywordConditionRule from "./components/keyword-condition-rule";
import FormulaBoard from "./components/formula-board";
import _ from "lodash";
export default {
  components: { treeTable, KeywordConditionRule, FormulaBoard },
  data() {
    return {
      pickerOptions,
      tableKey: 0,
      list: null,
      listLoading: false,
      daterange: [],
      listQuery: {
        ruleName: null,
        startTime: null,
        endTime: null
      },
      multipleSelection: [],
      func: treeToArray,
      expandAll: true,
      args: [null, null, "timeLine"],

      searchLoading:false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleFilter() {
     // this.listQuery.pageNumber = 1
      this.getList()
    },
    clear(){
      //this.listQuery.conditionScope='all';
      this.listQuery.ruleName=null;
      this.daterange=[];
      //this.listQuery.pageNumber = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      this.searchLoading=true;
      let listQuery = _.cloneDeep(this.listQuery);
      let daterange = this.daterange;
      if (daterange === null || daterange.length === 0) {
        listQuery.endTime = null;
        listQuery.startTime = null;
      } else {
        listQuery.startTime = daterange[0];
        listQuery.endTime = daterange[1];
      }
      let ruleName = listQuery.ruleName;
      if (ruleName !== null) {
        let flag = _.isEmpty(ruleName.replace(/(^\s+)|(\s+$)/g, ""));
        if (flag) {
          listQuery.ruleName = null;
        }
      }
      this.$api["keywordDecisionRuleListUp"](listQuery)
        .then(res => {
          let { data } = res;
          this.list = data;
          setTimeout(() => {
            this.listLoading = false;
             this.searchLoading=false;
          });
        })
        .catch(() => {
          this.listLoading = false;
          this.searchLoading=false;
        });
    },

    showKeywordConditionRuleDialog(row) {
      // debugger
      if (row !== null) {
        if (row.decisionRuleId) {
          this.$refs.keywordConditionRule.showKeywordConditionRuleDialog(row);
        } else {
          this.$refs.formulaBoard.showDialog("related-words", row);
        }
      } else {
        this.$refs.keywordConditionRule.showKeywordConditionRuleDialog(null);
      }
    },
    deleteRows(id) {
      let ids = [];
      if (id === null) {
        _(this.multipleSelection).forEach(element => {
          ids.push(element.ruleId);
        });
        if (ids.length === 0) {
          this.$message.warning("至少选一项");
          return;
        }
      } else {
        ids = [id];
      }

      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = { ids };
          this.$api["keywordConditionRuleRemove"](params).then(res => {
            this.getList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
@import "./common";
.box-query {
  min-width: 680px;
}
.box-update {
  // width: 230px;
}
.custom-collapse .el-form-item {
    margin-bottom: 10px;
}
</style>
