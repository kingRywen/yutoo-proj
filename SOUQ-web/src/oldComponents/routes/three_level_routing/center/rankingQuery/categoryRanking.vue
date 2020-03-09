<template>
  <div class='categoryRanking'>
    <el-row class='paddingBobbtom'>
      <!-- 添加任务 -->
      <el-button type="success" @click="onaddCategoryRankingTask">添加任务</el-button>
      <!-- 添加任务弹窗 -->
      <el-dialog title="添加产品" :visible.sync="addCategoryRankingTask" style="min-width:1200px;padding-right:100px;" width="35%">
        <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%; padding-right:100px; ">
          <el-form-item label="类目:" :label-width="formLabelWidth" prop="category">
            <div class="block">
              <el-cascader placeholder="可以输入或者点击选择" :options="skuListw" :change-on-select="true" v-model="form.category" :props="props" @focus="getCategorList" filterable style=" width:100%;"></el-cascader>
            </div>
          </el-form-item>
          <!-- <el-form-item label="关键词: " prop="keywords" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.keywords" />
          </el-form-item> -->
          <el-form-item label="商品ASIN:" prop="sku" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.sku" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox v-model="form.monitorFlag">是否添加监控</el-checkbox>
            <el-date-picker :label-width="formLabelWidth" class="el-date-wrapper" style="width:100%" v-if='form.monitorFlag' v-model="form.monitorTimeAry" value-format="yyyy-MM-dd" :default-time="['00:00:00', ]" type="datetimerange" align="left" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" style="width:100%;" @click="addTaskSubmit('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加监控 修改监控周期 -->
      <el-button type="success" @click="onCategoryMonitor('add')">添加监控</el-button>
      <el-button type="success" @click="onCategoryMonitor('change')">修改监控周期</el-button>
      <!-- 添加监控弹窗 -->
      <el-dialog title="添加监控" :visible.sync="addCategoryMonitor" width="40%" style="min-width:1200px">

        <el-form :model="form">
          <template>
            <div class="block " style="padding-left:25%;">
              <el-date-picker v-model="categoryAddMonitorList.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :label-width="formLabelWidth" value-format="yyyy-MM-dd">
              </el-date-picker>
              <!-- <el-date-picker :label-width="formLabelWidth" class="el-date-wrapper" v-model="categoryAddMonitorList.date" value-format="yyyy-MM-dd" type="datetimerange" align="left" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker> -->
            </div>
            <div style="width:100%;padding-left:32%; padding-top:20px;">
              <el-button type="primary" style="margin-left:60px;" @click="addCategoryMonitorSubmit('ruleForm')">确认</el-button>
              <el-button type="primary" style="margin-left:60px;" @click="addMonitor = false">取消</el-button>
            </div>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer " style="padding:0 30px;">
        </div>
      </el-dialog>
      <el-button type="success" plain @click="cancelCategoryMonitorSubmit()">取消监控</el-button>
      <el-button type="success" plain @click="deleteCategoryList()">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键字输入 -->
      <el-col :span="15">
        <el-input placeholder="请输入类目查询" v-model="skuList.category" clearable @change="newLists1()" style='max-width:200px;'>
        </el-input>
        <!-- 输入框 关键字输入 -->
        <el-input placeholder="ASIN" v-model="skuList.skus" clearable @change="newLists2()" style='max-width:200px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="cearchCategoryOrSku">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="currentTimeData()">
          <el-radio-button label="1">今日</el-radio-button>
          <el-radio-button label="7">7天</el-radio-button>
          <el-radio-button label="30">30天</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table stripe ref="multipleTable" :data="getCategoryRankingLists" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="category" label="类目" align='center'>
        <template slot-scope="scope">
          {{scope.row.category.replace(":",">>")}}
        </template>
      </el-table-column>
      <el-table-column prop="sku" label="ASIN" align='center'>
      </el-table-column>
      <el-table-column prop="title" label="标题" align='center'>
      </el-table-column>
      <el-table-column prop="monitorFlag" label="监控状态" align='center'>
        <template slot-scope="scope">
          {{scope.row.monitorFlag?"是":"否"}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创始时间" align='center'>
      </el-table-column>
      <el-table-column prop="monitorFrom" label="监控开始时间" align='center'>
      </el-table-column>
      <el-table-column prop="monitorTo" label="监控结束时间" align='center'>
        <!-- PC排名图表 -->
      </el-table-column>
      <el-table-column prop="webRank" label="PC排名" align='center'>
        <template slot-scope="scope">
          {{ scope.row.webRank }}
          <el-button type="text" @click="pcshowChart"> <img src="~@/assets/images/brokenLineImg.png" style="width:30px;height:30px;" v-if="scope.row.monitorFlag ==true " @click="pcRankingMonitoringTable = true"></el-button>
        </template>
      </el-table-column>
      <!-- APP排名图表 -->
      <el-table-column prop="appRank" label="APP排名" align='center'>
        <template slot-scope="scope">
          {{ scope.row.appRank }}
          <el-button type="text" @click="appshowChart"> <img src="~@/assets/images/brokenLineImg.png" alt="" style="width:30px;height:30px;" v-if="scope.row.monitorFlag ==true " @click="getMonitoringEcharts()"></el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="提示" :visible.sync="pcSkuList" height='505px' width="827px">
      <div id="myChart_one" style="width:827px;height:528px;padding: 25px 0px;" ref="myChart_one"></div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="appSkuList" height='505px' width="827px">
      <div id="myChart_two" style="width:827px;height:528px;padding: 25px 0px;" ref="myChart_two"></div>
    </el-dialog>

  </div>
</template>

<script scoped>
/* eslint-disable */

// json 假数据
import mock from "@/api/json.js";
console.log(mock);
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
/* eslint-disable */
var echart = require("echarts");
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      currentPage: null, //页数
      total: null, //总条数
      pageSize: null,
      getCategoryRankingLists: [], //定义列表的数据

      // addMonitorUrl="/taskCategoryRank/addMonitor",

      // /taskCategoryRank/addMonitor
      //图表弹窗
      monitorType: "", //定义个值，接收添加监控还是修改监控的状态
      pcSkuList: false,
      appSkuList: false,
      userSelect: [],
      addCategoryMonitor: false, //  添加监控弹窗
      formLabelWidth: "120px", //定义宽度
      categoryAddMonitorList: {},
      taskIds: [],
      skuList: {
        category: null,
        skus: ""
      },
      skuListw: [], //定义添加任务的类目类别
      //  appshowChart: false,
      input4: "",
      checked: false,
      addCategoryRankingTask: false,
      form: {
        platformId: this.$store.state.selectPlatform.platformId,
        category: null,
        sku: null,
        monitorFlag: null,
        monitorFrom: null,
        monitorTo: null,
        monitorTimeAry: null
      },
      rules: {
        category: [
          { required: true, message: "请选择类目", trigger: "blur" },
          { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" } //限定输入的个数
        ],
        sku: [
          { required: true, message: "请输入商品ASIN:", trigger: "blur" },
          { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" } //限定输入的个数
        ]
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      addMonitor: false,
      inputText: "",
      originValue: "",
      StatusValue: "",
      // 时间段
      tabPosition: "top",
      // 放删除选中的数组
      multipleSelection: [],
      // 分页

      //  skuList: {
      //     label: '江苏',
      //     cities: []

      //  },
      //  [],  skuList:
      props: {
        value: "name",
        children: "recursionList",
        label: "name"
        //  value: "categoryName",
      }
    };
  },
  created() {
    // 初始化类目列表方法
    // this.getCategoryRankingListsApi();
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      pageNumber: 1,
      pageSize: 10
    };
    this.getListsApi(this.params); // 初始化类目列表方法
  },
  mounted() {},
  computed: {
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
    // ...mapState("anking", {
    //   getCategoryRankingLists: state => state.categoryRankings
    // })
  },
  watch: {
    platformId(val) {
      this.getListsApi({ ...this.params, platformId: val });
    }
  },
  methods: {
    newLists1() {
      this.getListsApi(this.param); //关键词竞争分析列表
    },
    newLists2() {
      this.getListsApi(this.param); //关键词竞争分析列表
    },

    // 请求列表
    getListsApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/TaskCategoryRank/list", params).then(res => {
        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.getCategoryRankingLists = res.data.rows;
      });
    },

    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getListsApi(params);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getListsApi(params);
    },
    currentTimeData() {
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };
      return this.getListsApi(params);
    },
    //pc排名
    pcshowChart() {
      this.pcSkuList = true;
      this.$nextTick(() => {
        console.log(this.$refs.myChart_one);
        this.drawEchart(document.getElementById("myChart_one"));
      });
    },
    //APP排名监控图表
    appshowChart() {
      this.appSkuList = true;
      this.$nextTick(() => {
        console.log(this.$refs.myChart_two);
        this.drawEchart(document.getElementById("myChart_two"));
      });
    },
    //添加图表
    drawEchart(dom) {
      console.log(mock.rankData, 666);
      console.log(dom, 88888);
      let et = echart.init(dom);
      et.setOption(mock.rankData);
    },
    //类目列表获取  类目排名添加类目
    getCategorList() {
      if (this.skuListw.length) {
        return;
      }
      let params = {
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.$axios.post("/TaskCategoryRank/getCategory", params).then(res => {
        if (res.data.code == 0) {
          this.skuListw = res.data.data;
          // console.log(this.skuList, "4545");
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    //添加任务
    onaddCategoryRankingTask() {
      this.addCategoryRankingTask = true;
      // this.skuList = this.getCategoryRankingLists.map(item => item.category);
      // console.log(this.skuList);
    },

    //添加任务
    addTaskSubmit(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let a = this.form.category;
          let b = a.join(":");

          let params = {
            platformId: this.$store.state.selectPlatform.platformId,
            category: b,
            sku: this.form.sku.split("\n"),
            monitorFlag: this.form.monitorFlag ? 1 : 0
          };
          if (params.monitorFlag) {
            params = Object.assign({}, params, {
              monitorFrom: this.form.monitorTimeAry[0],
              monitorTo: this.form.monitorTimeAry[1]
            });
          }

          _this.$axios.post("/TaskCategoryRank/save", params).then(
            res => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.addTask = false;
                this.$refs[formName].resetFields(); //清除数据记录
                this.getListsApi();
                return;
              }
              if (res.data.code == 500) {
                this.$message.error(res.data.msg);
              }
            },
            err => {
              console.log(err);
            }
          );
        } else {
          return false;
        }
      });
    },

    // 添加  修改监控时间
    onCategoryMonitor(type) {
      let addCategoryMonitor = [];
      if (this.userSelect.length) {
        if (type == "add") {
          this.userSelect.forEach(item => {
            addCategoryMonitor.push(item.taskId);
            // 如果选择一条，判断是否添加监控，并提示已经添加监控
            if (item.monitorFlag == 1 && this.userSelect.length == 1) {
              this.addCategoryMonitor = false;
              this.$message({
                showClose: true,
                message: "已经添加监控",
                type: "warning"
              });
            } else {
              this.addCategoryMonitor = true;
            }
          });
        }
        if (type == "change") {
          this.userSelect.forEach(item => {
            addCategoryMonitor.push(item.taskId);
            // 如果选择一条，判断是否添加监控，并提示已经添加监控
            if (item.monitorFlag == 1) {
              this.addCategoryMonitor = true;
            } else {
              this.addCategoryMonitor = false;
              this.$message({
                showClose: true,
                message: "没有添加监控，请先添加监控",
                type: "warning"
              });
            }
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选择一个",
          type: "warning"
        });
      }
      this.monitorType = type; //赋值，将状态赋值过去，提交中获取
    },

    //添加监控提交
    addCategoryMonitorSubmit() {
      let type = this.monitorType;
      if (this.userSelect.length) {
        let addCategoryMonitor = [];
        this.userSelect.forEach(item => {
          addCategoryMonitor.push(item.taskId);
          let params = {
            taskIds: addCategoryMonitor,
            monitorFrom: this.categoryAddMonitorList.date[0],
            monitorTo: this.categoryAddMonitorList.date[1]
          };
          if (type == "add") {
            if (item.monitorFlag == 0) {
              this.$axios
                .post("/TaskCategoryRank/addMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.addCategoryMonitor = false; //关闭监控弹窗
                    this.getListsApi(); //请求列表刷新数据
                    this.categoryAddMonitorList = {
                      taskIds: "",
                      monitorFrom: "",
                      monitorTo: ""
                    };
                    console.log(this.categoryAddMonitorList, "6666");
                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            }
          }
          if (type == "change") {
            if (item.monitorFlag == 1) {
              this.$axios
                .post("/TaskCategoryRank/updateMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.addCategoryMonitor = false; //关闭监控弹窗
                    this.getListsApi(); //请求列表刷新数据
                    this.categoryAddMonitorList = {
                      taskIds: "",
                      monitorFrom: "",
                      monitorTo: ""
                    };
                    console.log(this.categoryAddMonitorList, "6666");
                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            }
          }
        });
      }
    },
    //取消监控
    cancelCategoryMonitorSubmit() {
      if (this.userSelect.length) {
        let cancleMonitor = [];
        if (this.userSelect.length) {
          this.userSelect.forEach(item => {
            cancleMonitor.push(item.taskId);
            //判断如果是选择一条，并且没有添加监控，提示本来没有添加监控
            if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              this.$message({
                showClose: true,
                message: "没有添加监控",
                type: "warning"
              });
            }
            let params = {
              taskIds: cancleMonitor
            };
            this.$axios
              .post("/TaskCategoryRank/removeMonitor", params)
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.getListsApi();
                  return;
                }
                if (item.monitorFlag == 0 && this.userSelect.length == 1) {
                  this.$message({
                    showClose: true,
                    message: "没有添加监控",
                    type: "warning"
                  });
                } else {
                  this.$message.error(res.data.msg);
                }
              });
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选择一个",
          type: "warning"
        });
      }
    },
    //删除类目列表数据
    deleteCategoryList() {
      if (this.userSelect.length) {
        // 防止重复删除
        // console.log(this.taskIds, "777");
        let a = this.taskIds;
        let s = new Set(a);
        let result = Array.from(s);
        console.log(this.taskIds.value, "333");
        console.log(result, "111");
        this.$axios
          .post("TaskCategoryRank/remove", { taskIds: result })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getListsApi();
              this.taskIds = [];
              return;
            }
            if (res.data.code == 500) {
              this.$message.error(res.data.msg);
              this.taskIds = [];
            }
          });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选择一个",
          type: "warning"
        });
      }
    },
    //搜索类目  名和SKU
    cearchCategoryOrSku() {
      if (this.skuList.category || this.skuList.skus) {
        this.recordSearch(this.skuList.category, this.skuList.skus);
      }
    },
    // 记录搜素值
    recordSearch(category, skus) {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: "1",
        pageSize: "50",
        category,
        sku: this.skuList.skus
      };

      this.$axios.post("/TaskCategoryRank/list", params).then(res => {
        if (res.data.rows.length) {
          this.getCategoryRankingLists = res.data.rows;
          // this.setWordList(res.data.rows);
          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查到相关的数据");
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.mag);
          return;
        }
      });
    },

    // ...mapActions("anking", [
    //   "getCategoryRankingListsApi",
    //   "addKeywordRankingTaskApi"
    // ]),
    ...mapMutations("anking", {
      setWordList: "getCategoryRankingLists"
    }),
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.taskIds.push(item.taskId);
      });
    },
    // table删除
    deleteRow(tableData) {
      console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    // table的查看
    handleClick(index, rowDetail) {
      console.log(index, rowDetail);
    }
  }
};
</script>

<style scoped>
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  /* padding-bottom: 10px; */
}
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: orange;
  background-color: #fff;
  border-color: orange;
  -webkit-box-shadow: -1px 0 0 0;
  box-shadow: -1px 0 0 0;
}
.el-dialog__body {
  color: #606266;
  font-size: 14px;
  padding: 0 50px 0 0px;
}
.el-dialog__footer {
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 80px 30px 83px;
}
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #3aa8e6;
  font-weight: 30px;
}
.el-dialog {
  position: relative;
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 40%;
}

.el-picker-panel {
  position: fixed;
  top: 194px;
  left: 476px !important;
  z-index: 2003;
}
.el-picker-panel {
  color: #606266;
  border: 1px solid #e4e7ed;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 4px;
  line-height: 30px;
  margin: 18px 172px;
}
.el-select.el-input {
  width: 130px;
}
/* .input-with-select.el-input-group__prepend {
    background-color: #fff;
  } */
.el-input-group__append {
  background-color: blueviolet;

  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 20px;
  width: 1px;
  white-space: nowrap;
}
.el-cascader__label {
  position: absolute;
  left: 121px;
  top: 11px;
  height: 100%;
  padding: 0 25px 0 15px;
  color: #606266;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  text-align: left;
  font-size: inherit;
}
element.style {
  z-index: 2026;
  position: fixed;
  top: 180px;
  left: 707px;
}
/* .element.style {
    position: fixed;
    top: 183px;
    left: 716px;
    z-index: 2017;
} */
el-cascader__label {
  position: absolute;
  /* left: 117px;
    top: 12px; */
  height: 100%;
  padding: 0 25px 0 15px;
  color: #606266;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  text-align: left;
  font-size: inherit;
}
/* element.style {
    width: 30%;
    margin-top: 15vh;
    margin-right: 20px;
} */
/* .el-dialog__body {
    padding: 10px 3px;
    color: #606266;
    font-size: 14px;
    font-size: 14px;
    padding-right: 70px;
}


.el-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 80px;
    line-height: 40px;
    outline: none;
}
.el-dialog__footer {
    padding-top: 0px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-bottom: 30px;
    padding-right: 29px;
} */
</style>
