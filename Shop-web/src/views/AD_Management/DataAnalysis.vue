<template>
  <div v-if="$route.name === 'DataAnalysis'" class="box">
    <!-- <Navigation>
            <div slot="breadcrumb" class="breadcrumb">广告数据分析</div>
        </Navigation> -->
    <el-collapse class="custom-collapse custom-collapse-1" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm">
          <el-form-item label="ASIN" prop="parentAsin">
            <el-input v-model="listQuery.parentAsin" placeholder="请输入" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="关键词" prop="keyword">
            <el-input v-model="listQuery.keyword" placeholder="请输入" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
            size="small"
            type="primary"
            :icon="item === '搜索' ? 'el-icon-search' : ''"
            :plain="item !== '搜索'"
            v-for="item in ['搜索','重置搜索']"
            :loading="listLoading"
            @click="distribute(item)"
          >{{item}}</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="box-update-btn">
      <el-button type="primary" plain size="small" v-for="item in ['修改监控频率']" @click="distribute(item)">{{item}}</el-button>
    </div>
    <div class="box-data">
      <el-table :data="list" v-loading="listLoading" :key='tableKey' style="width: 100%" border stripe @selection-change="handleSelectionChange" @sort-change='sortChange'>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="imageUrl" width="100" label="主图">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <div style="display:flex;justify-content:center;align-items:center; width: 300px;height: 150px;">
                <div>
                  <img :src="scope.row.imageUrl" />
                </div>
              </div>
              <img slot="reference" :src="scope.row.imageUrl" height="30" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="parentAsin" label="ASIN" min-width="120">
        </el-table-column>
        <el-table-column prop="keywordCnt" label="关键词数量" min-width="100" sortable="custom">
        </el-table-column>
        <el-table-column prop="lastTaskTime" label="更新时间" min-width="135">
        </el-table-column>
        <el-table-column prop="frequency" label="监控频率" min-width="100">
          <template slot-scope="scope">
            <div class="frequency-min-h-d">
              <div>{{scope.row.frequency}}</div>
              <div v-if="scope.row.unit=='min'" class="min-h-d">
                分钟
              </div>
              <div v-else-if="scope.row.unit=='h'" class="min-h-d">
                小时
              </div>
              <div v-else-if="scope.row.unit=='d'" class="min-h-d">
                天
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">

            <el-tooltip effect="light" content="查看详情" placement="top-start">
              <el-button type="text" size="small" icon="el-icon-search" @click="viewDetails(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <yt-dialog :options="options" :events="events" class="add-dialog">
      <el-form size="small" :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px">

        <el-form-item label="监控频率" prop="frequency" :rules="rules.frequency">
          <el-input v-model="ruleForm.frequency" placeholder="请输入" size="small" class="input-frequency"></el-input>
        </el-form-item>

        <el-form-item prop="unit" :rules="[
                    { required: true, message: '请选择时间类型', trigger: ['blur', 'change'] }
                ]">
          <el-select v-model="ruleForm.unit" placeholder="请选择" size="small" class="select-unit">
            <el-option label="分钟" value="min"></el-option>
            <el-option label="小时" value="h"></el-option>
            <el-option label="天" value="d"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </yt-dialog>

  </div>
  <router-view v-else></router-view>
</template>
<script>
const _ = require("lodash");
import { checkWords } from "../KeyLexicon/utils";
import Navigation from "../Common/y-template/navigation";
export default {
  components: {
    Navigation
  },
  data() {
    let numReg = /^[1-9]\d*$/;
    let checkFrequency = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入监控周期"));
      } else {
        if (!numReg.test(value)) {
          return callback(new Error("请输入正整数"));
        }
        // if (value < 30 || value > 14440) {
        //   return callback(new Error("请输入30至14440"));
        // }
        callback();
      }
    };
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      daterange: [],
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        platformId: null,
        siteId: null,
        sellerId: null,

        parentAsin: null,
        keyword: null
      },
      options: {
        visible: false,
        btnLoading: false,
        width: "410px",
        title: "添加",
        okBtnText: "确认"
      },
      events: {
        handleOkClick: () => {
          this.submitForm("ruleForm");
        }
      },
      ruleForm: {
        platformId: null,
        sellerId: null,
        siteId: null,
        frequency: null,
        unit: null
      },
      rules: {
        keywords: [{ required: true, validator: checkWords }],
        frequency: [{ required: true, validator: checkFrequency }]
      },
      multipleSelection: []
    };
  },
  created() {
     this.listQuery.platformId=this.platformId;
    this.ruleForm.platformId=this.platformId;
    this.getInitParams();
  },

  watch: {
    // 刷新的时候执行
    sellerData() {
      this.getInitParams();
    }
  },
  methods: {
    //tabl表格排序改变
      sortChange(column, prop, order){
          let tit=column.prop; //排序的字段名
          let sort=column.order;//排序顺序
          // console.log(tit);
          // console.log(sort);
          let v=this.sortableFunc(column, tit, sort );
          this.listQuery.sortField=v.sortField;
          this.listQuery.sort=v.sort;
          this.listQuery.pageNumber=1;
          this.getList();
      },
  //table排序参数处理
      sortableFunc(column, pro, order ){
          let prop = pro.replace(/[A-Z]/g, function (match) {
              return '_' + match.toLowerCase()
          })
          return {
              sort: order === 'ascending' ? 1 : 0,
              sortField: prop
          }
      },
    getInitParams() {
      if (this.sellerId && this.siteId) {
        this.listQuery.siteId = this.siteId;
        this.listQuery.sellerId = this.sellerId;
        this.ruleForm.siteId = this.siteId;
        this.ruleForm.sellerId = this.sellerId;
        this.getList();
      }
    },
    distribute(btn) {
      switch (btn) {
        case "搜索":
          this.handleFilter();
          break;
        case "重置搜索":
          this.resetListQueryForm();
          break;
        case "修改监控频率":
          this.showDialog(null);
          break;
      }
      // '添加监控','修改监控周期'
    },
    getList() {
      this.listLoading = true;
      let parentAsin = this.listQuery.parentAsin;
      if (parentAsin !== null) {
        let flag = _.isEmpty(parentAsin.replace(/(^\s+)|(\s+$)/g, ""));
        if (flag) {
          this.listQuery.parentAsin = null;
        }
      }
      let keyword = this.listQuery.keyword;
      if (keyword !== null) {
        let flag = _.isEmpty(keyword.replace(/(^\s+)|(\s+$)/g, ""));
        if (flag) {
          this.listQuery.keyword = null;
        }
      }

      let listQuery = _.cloneDeep(this.listQuery);
      if (listQuery.monitorFlag === "all") {
        listQuery.monitorFlag = null;
      }
      this.$api["taskAdDataList"](listQuery)
        .then(res => {
          let { rows, total } = res;
          this.list = rows;
          this.total = total;
          setTimeout(() => {
            this.listLoading = false;
          }, 500);
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    handleFilter() {
      this.listQuery.pageNumber = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getList();
    },
    resetListQueryForm() {
      this.daterange = [];
      this.$refs.listQueryForm.resetFields();
      this.getList()
    },

    showDialog(row) {
      // if(!this.checkRows()){
      //     return
      // }
      this.options.title = "添加";
      this.options.visible = true;
      if (this.$refs["ruleForm"] !== undefined) {
        this.$refs["ruleForm"].resetFields();
        this.ruleForm.frequency = null;
        this.ruleForm.unit = null;
      }
      if (this.multipleSelection.length === 1) {
        let row = this.multipleSelection[0];
        this.ruleForm.frequency = row.frequency;
        this.ruleForm.unit = row.unit;
      }
    },
    submitForm() {
      this.options.btnLoading = true;
      // this.ruleForm
      console.log(this.ruleForm);
      if (this.ruleForm.unit === "min") {
        if (this.ruleForm.frequency < 30 || this.ruleForm.frequency > 14400) {
          this.$message.warning("分钟为单位时须30-14000之间");
          return;
        }
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api["taskAdDataFrequencyUpdate"](this.ruleForm)
            .then(data => {
              this.options.visible = false;
              this.options.btnLoading = false;
              this.getList();
            })
            .catch(() => {
              // this.options.visible = false
              this.options.btnLoading = false;
            });
        } else {
          console.log("error submit!!");
          this.options.btnLoading = false;
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkRows() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("至少选一项");
        return false;
      }
      return true;
    },
    deleteRows(id) {
      let params = {
        taskFlag: this.listQuery.taskFlag
      };
      if (id === null) {
        let multipleSelection = this.multipleSelection;
        let ids = [];
        if (!this.checkRows()) {
          return;
        }
        multipleSelection.forEach(element => {
          ids.push(element.taskId);
        });
        params.taskIds = ids;
      } else {
        params.taskIds = [id];
      }

      this.$confirm("此操作将删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api["keywordRankFqRemove"](params).then(res => {
          let { code } = res;
          if (code === 0) {
            this.handleFilter();
          }
        });
      });
    },
    showMonitorDialog() {},
    submitMonitorForm(form) {},
    cancelMonitor() {
      if (!this.checkRows()) {
        return;
      }
      let taskIds = [];
      this.multipleSelection.forEach(element => {
        taskIds.push(element.taskId);
      });
      let params = {
        taskIds,
        taskFlag: this.listQuery.taskFlag
      };
      this.$api["keywordRankFqRemoveMonitor"](params).then(data => {
        let { code } = data;
        if (code === 0) {
          this.getList();
        }
      });
    },
    reCrawl(row) {
      this.$api["keywordRankFqReCrawl"]({
        taskId: row.taskId,
        taskFlag: parseInt(this.listQuery.taskFlag)
      }).then(data => {
        let { code } = data;
        if (code === 0) {
          this.getList();
        }
      });
    },
    viewDetails(row) {
      if (row.taskId === null) {
        this.$message.warning("taskId为空");
        return;
      }
      this.$router.push({
        name: "DA_details",
        query: {
          taskId: row.taskId
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
// @import "~@/assets/style/base/variables.less";
.box {
  // border: 1px solid @borderColor;
  // padding: 10px;
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
    //    min-width: 680px;
    padding: 15px 15px 0 15px;
    border-left: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
    border-bottom: 1px solid @borderColor;
    //    display: flex;
    // //    justify-content: center;
    //    align-items: center;
    // //    align-self: center;
    // .el-form--inline{
    //     height: 40px;
    // }
    .el-form-item__content {
      .el-input {
        width: 150px;
      }

      //联调时修改
      .select-monitor-flag {
        width: 100px;
      }
      .data-type {
        width: 70px;
      }
      .el-range-editor {
        width: 240px;
        /deep/.el-range-separator {
          width: 20px;
        }
      }
    }
  }
  .box-update-btn {
    margin-top: 10px;
    // .el-button-group {
    //     &:first-of-type {
    //         margin-right: 10px;
    //     }
    // }
  }
  .box-data {
    .el-table__body-wrapper {
      .frequency-min-h-d {
        display: flex;
        .min-h-d {
          color: #fff;
          background-color: #cccccc;
          border: 1px solid #cccccc;
          border-radius: 3px;
          padding-left: 7px;
          padding-right: 7px;
          margin-left: 5px;
        }
      }
    }
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
  .add-dialog {
    .input-frequency,
    .select-unit {
      width: 115px;
    }
  }
}
</style>


