<template>
  <div v-if="$route.name === 'taskRelateSourceIndex'">
    <y-template>
      <!-- <div slot="ScreenTip">
                <span>筛选条件</span>
                <span></span>
            </div> -->
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model.trim="listQuery.taskName" placeholder="请输入" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="analysisUrl">
          <el-input v-model.trim="listQuery.analysisUrl" placeholder="请输入" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="listQuery.status" placeholder="请选择" size="mini" class="select-status" clearable>
            <el-option :label="item[0]" :value="item[1]" v-for="item in [['抓取中','1'],['抓取成功','2'],['抓取失败','3']]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- ,'重置搜索' -->
          <!-- <el-button size="mini" type="primary" plain v-for="item in ['确认搜索','重置搜索']" @click="distribute(item)">{{item}}</el-button> -->
           <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
             @click="distribute('确认搜索')"
              :loading="$store.state.isloading || $store.state.loading"

            >搜索</el-button>
            <el-button size="small" type="primary" plain  :disabled="$store.state.isloading || $store.state.loading"  @click="distribute('重置搜索')">重置搜索</el-button>
        </el-form-item>
      </el-form>

      <div slot="HandleBtn">
        <el-button type="primary" :loading="item === '重新抓取' ? reLoading: false" plain size="mini" v-for="item in ['添加任务','删除','重新抓取']" @click="distribute(item)
        ">{{item}}</el-button>
      </div>
      <el-table slot="table" :data="list" v-loading="listLoading" :key='tableKey' style="width: 100%" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="130">
        </el-table-column>
        <el-table-column prop="analysisCnt" label="链接数量" min-width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.analysisCnt" type="text" @click="showAnalysisCntDialog(scope.row)">{{scope.row.analysisCnt}}</el-button>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="100">
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.status==0">
                                待处理
                            </div>
                            <div v-else-if="scope.row.status==1">
                                处理中
                            </div>
                            <div v-else-if="scope.row.status==2">
                                处理成功
                            </div>
                            <div v-else-if="scope.row.status==3">
                                处理失败
                            </div>
                            <div v-else-if="scope.row.status==4">
                                页面不存在
                            </div>
                            <div v-else-if="scope.row.status==5">
                                大数据分析失败
                            </div>
                            <div v-else-if="scope.row.status==6">
                                kafka连接异常
                            </div> -->
            <div v-if="scope.row.status==1">
              抓取中
            </div>
            <div v-else-if="scope.row.status==2">
              抓取成功
            </div>
            <div v-else-if="scope.row.status>=3">
              抓取失败
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="抓取页数" prop="searchPages" min-width="160">
        </el-table-column>
        <el-table-column prop="updateTime" label="结果生成时间" min-width="100">
        </el-table-column>
        <el-table-column label="操作" width="75">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==2" type="text" size="mini" icon="el-icon-search" @click="viewDetails(scope.row)"></el-button>
            <el-button v-else-if="scope.row.status>=3" type="text" size="mini" icon="el-icon-edit-outline" @click="showDialog(scope.row)"></el-button>

            <!-- <el-button  type="text" size="mini" icon="el-icon-edit-outline" @click="showDialog(scope.row)"></el-button> -->
            <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteRows(scope.row.taskId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination slot="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </y-template>

    <yt-dialog :options="options" :events="events" class="add-dialog">
      <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px">
        <el-form-item label="分析类型" prop="analysisType" :rules="[
                        { required: true, message: '请选择分析类型', trigger: ['blur', 'change'] }
                    ]">
          <el-select v-model="ruleForm.analysisType" placeholder="请选择" size="mini" class="select-unit w100">
            <el-option label="产品链接" value="0"></el-option>
            <el-option label="类目链接" value="1"></el-option>
            <el-option label="BSR100链接" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接" prop="analysisUrls" :rules="[
                        { required: true, message: '请输入链接', trigger: ['blur'] }
                    ]">
          <el-input type="textarea" v-model.trim="ruleForm.analysisUrls" placeholder="多个换行输入" :rows="5" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName" :rules="[
                        { required: true, message: '请输入任务名称', trigger: ['blur'] },
                        { max: 20, message: '不能超过20个字符', trigger: 'blur' }
                ]">
          <el-input v-model.trim="ruleForm.taskName" placeholder="请输入" size="mini" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="抓取页数" prop="searchPages" :rules="[
                        { required: true, message: '请选择抓取页面', trigger: ['blur', 'change'] }
                    ]">
          <el-select v-model="ruleForm.searchPages" placeholder="请选择" size="mini" class="select-unit w100">
            <el-option v-for="item in [1,2,3,4,5,6,7,8,9,10]" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="analysisCntOptions" :events="analysisCntEvents">
      <el-table :data="analysisCntList" style="width: 100%" border stripe>
        <el-table-column prop="value" label="链接" min-width="55">
          <template slot-scope="scope">
            <a @click="openWebsite(scope.row.value)" class="a-title" 
                style='
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    color:rgb(16, 142, 233);
                '
            >{{scope.row.value}}</a>
          </template>
        </el-table-column>
      </el-table>
    </yt-dialog>

  </div>
  <router-view v-else></router-view>
</template>
<script>
const _ = require("lodash");
import { checkWords } from "../KeyLexicon/utils";
import YTemplate from "../Common/y-template/index";
import Navigation from "../Common/y-template/navigation";
export default {
  components: {
    YTemplate,
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
        if (value < 10 || value > 14440) {
          return callback(new Error("请输入10至14440"));
        }
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
      pickerdisabledDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      reLoading: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        platformId: null,
        siteId: null,
        sellerId: null,
        taskName: null,
        analysisUrl: null,
        status: null
      },
      options: {
        visible: false,
        width: "500px",
        title: "添加任务",
        okBtnText: "确认"
      },
      events: {
        handleOkClick: () => {
          this.submitForm();
        }
      },
      ruleForm: {
        platformId:null,
        sellerId: null,
        siteId: null,
        taskName: null,
        analysisType: null,
        searchPages: null,
        analysisUrls: null
      },
      analysisCntList: null,

      analysisCntOptions: {
        visible: false,
        width: "500px",
        title: "链接",
        okBtnText: "关闭",
        showFooter:false,
      },
      analysisCntEvents: {
        handleOkClick: () => {
          this.analysisCntOptions.visible = false;
        }
      },
      isMonitorAdd: true,
      ruleMonitorForm: {
        daterange: [],
        taskIds: null,
        monitorFlag: 1,
        monitorFrom: null,
        monitorTo: null,
        frequency: null,
        unit: null
      },

      rules: {
        keywords: [{ required: true, validator: checkWords, trigger: "blur" }],
        frequency: [
          { required: true, validator: checkFrequency, trigger: "blur" }
        ]
      },
      multipleSelection: []
    };
  },
  created() {
     this.ruleForm.platformId=this.platformId;
    this.listQuery.platformId=this.platformId;
    this.getInitParams();
   
  },

  watch: {
    // 刷新的时候执行
    sellerData() {
      this.getInitParams();
    }
  },
  methods: {
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
        case "确认搜索":
          this.handleFilter();
          break;
        case "重置搜索":
          this.resetListQueryForm();
          break;
        case "添加任务":
          this.showDialog(null);
          break;
        case "重新抓取":
          this.reCrawl();
          break;
        case "删除":
          this.deleteRows(null);
          break;
      }
      // '添加监控','修改监控周期'
    },
    openWebsite(url) {
      window.open(url);
    },
    getList() {
      this.listLoading = true;
      let taskName = this.listQuery.taskName;
      if (taskName !== null) {
        let flag = _.isEmpty(taskName.replace(/(^\s+)|(\s+$)/g, ""));
        if (flag) {
          this.listQuery.taskName = null;
        }
      }

      let listQuery = _.cloneDeep(this.listQuery);
      if (listQuery.status !== null) {
        listQuery.status = parseInt(listQuery.status);
      }
      this.$api["taskRelateSourceList"](listQuery)
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
	  this.getList();
    },

    showDialog(row) {
      this.options.visible = true;
      if (this.$refs["ruleForm"] !== undefined) {
        this.$refs["ruleForm"].resetFields();
      }
      if (row !== null) {
        this.ruleForm.analysisType = row.analysisType.toString();
        this.ruleForm.analysisUrls = row.analysisUrls.replace(/,/g, "\n");
        this.ruleForm.taskName = row.taskName;
        this.ruleForm.searchPages = row.searchPages;
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let paramMap = _.cloneDeep(this.ruleForm);
          paramMap.analysisType = parseInt(paramMap.analysisType);
          paramMap.analysisUrls = _.compact(
            this.ruleForm.analysisUrls.split("\n")
          );
          paramMap.analysisUrls = _.uniq(paramMap.analysisUrls);
          this.$api["taskRelateSourceSave"](paramMap)
            .then(data => {
              this.options.visible = false;
              this.getList();
            })
            .catch(() => {
              //   this.options.visible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reCrawl() {
      if (!this.checkRows()) {
        return;
      }
      let taskIds = [];
      this.multipleSelection.forEach(element => {
        taskIds.push(element.taskId);
      });
      this.reLoading = true
      this.$api["taskRelateSourceReCrawl"]({ taskIds }).then(res => {
        this.reLoading = false
        let { code } = res;
        if (code === 0) {
          this.getList();
        }
      });
    },
    showAnalysisCntDialog(row) {
      if (typeof row.analysisUrls == "string") {
        let listTmp = row.analysisUrls.split(",");
        let list = [];
        listTmp.forEach(element => {
          list.push({ value: element });
        });
        this.analysisCntList = list;
        this.analysisCntOptions.visible = true;
      } else {
        console.log("showAnalysisCntDialog:  " + row.analysisUrls);
      }
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
      let taskIds = [];
      if (id === null) {
        let multipleSelection = this.multipleSelection;

        if (!this.checkRows()) {
          return;
        }
        multipleSelection.forEach(element => {
          taskIds.push(element.taskId);
        });
      } else {
        taskIds = [id];
      }
      this.$confirm("此操作将删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api["taskRelateSourceRemove"]({ taskIds }).then(res => {
          let { code } = res;
          if (code === 0) {
            this.handleFilter();
          }
        });
      });
    },

    viewDetails(row) {
      console.log(row);
      if (row.taskId === null) {
        this.$message.warning("taskId为空");
        return;
      }
      this.$router.push({
        name: "taskRelateSourceDetails",
        query: {
          taskId: row.taskId,
          name: row.taskName
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  .template-box {
    .screen-info {
      .el-form-item__content {
        .el-input {
          width: 230px;
        }
        .select-status {
          width: 135px;
        }
      }
    }
    //    .box-update-btn {

    //     }
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
    }
  }
  /deep/.el-dialog__body {
    padding-bottom: 0;
  }
  .add-dialog {
    .el-textarea,
    .el-input,
    .el-select {
      width: 320px;
    }
  }
  .el-table__row {
    .a-title {
      color: #2f00cc;
      text-decoration: underline;
    }
  }
}
</style>


