<template>
  <div class='keywordQuery'>
    <el-row class='paddingBobbtom'>
      <!-- 添加任务 -->
      <el-button type="success" @click="onaddTask">添加任务</el-button>
      <el-dialog title="添加产品" :visible.sync="addTask" style="min-width:1200px;padding-right:100px;" width="35%">

        <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%; padding-right:100px; ">
          <el-form-item label="关键词: " prop="keywords" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.keywords" />
          </el-form-item>
          <el-form-item label="商品ASIN:" prop="sku" :label-width="formLabelWidth" style="margin-top:20px;">
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
      <!-- 添加监控 -->
      <el-button type="success" @click="onAddMonitor('add')">添加监控</el-button>
      <el-button type="success" @click="onAddMonitor('change')">修改监控周期</el-button>
      <el-dialog title="添加监控" :visible.sync="addMonitor" width="40%" style="min-width:1200px">
        <el-form :model="form">
          <template>
            <div class="block " style="padding-left:25%;">

              <el-date-picker v-model="form2.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :label-width="formLabelWidth" value-format="yyyy-MM-dd">
              </el-date-picker>

              <!-- //
              <el-date-picker :label-width="formLabelWidth" class="el-date-wrapper" style="width:100%" v-model="form2.date" value-format="yyyy-MM-dd" :default-time="['00:00:00', ]" type="datetimerange" align="left" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                // </el-date-picker> -->
            </div>
            <div style="width:100%;padding-left:32%; padding-top:20px;">
              <el-button type="primary" style="margin-left:60px;" @click="addMonitorSubmit('ruleForm')">确认</el-button>
              <el-button type="primary" style="margin-left:60px;" @click="addMonitor = false">取消</el-button>
            </div>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer " style="padding:0 30px;">
        </div>
      </el-dialog>

      <el-button type="success" plain @click="cancelMonitor() ">取消监控</el-button>
      <el-button type="success" plain @click="deleteKeywordRankingList()">删除</el-button>
    </el-row>
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键字输入 -->
      <el-col :span="15">
        <el-input placeholder="请输入关键词名称" v-model="wordRankingLists.keyword" clearable style='max-width:200px;' clearable @change="newLists1()">
        </el-input>
        <el-input placeholder="ASIN" v-model="wordRankingLists.sku" clearable style='max-width:200px;' clearable @change="newLists2()">
        </el-input>
        <el-button type="success" icon="el-icon-search" @click="searchKeywordRankingAndAsin()">搜索</el-button>
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
    <el-table stripe ref="multipleTable" :data="getWordRankingLists" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" slot-scope="">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="keyword" label="关键字" align='center'>
      </el-table-column>
      <el-table-column prop="sku" label="ASIN" align='center'>
      </el-table-column>

      <el-table-column prop="title" label="标题" align='center' class="status">
      </el-table-column>
      <el-table-column prop="monitorFlag" label="监控状态" align='center' class="status">
        <template slot-scope="scope">
          {{ scope.row.monitorFlag?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创始时间" align='center' class="status">
      </el-table-column>
      <el-table-column prop="monitorFrom" label="监控开始时间" align='center' class="status">
      </el-table-column>
      <el-table-column prop="monitorTo" label="监控结束时间" align='center' class="status">

      </el-table-column>
      <el-table-column prop="webRank" label="PC排名" align='center' class="status">
        <template slot-scope="scope">
          {{ scope.row.webRank }}
          <el-button type="text" @click="pcshowChart"> <img src="~@/assets/images/brokenLineImg.png" style="width:25px;height:25px;" v-if="scope.row.monitorFlag ==true " @click="getMonitoringEcharts()" /></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="appRank" label="App排名" align='center' class="status">
        <template slot-scope="scope">
          {{ scope.row.appRank }}
          <el-button type="text" @click="appshowChart"><img src="~@/assets/images/brokenLineImg.png" style="width:25px;height:25px;" v-if="scope.row.monitorFlag ==true " /></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <!-- <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
      </el-pagination> -->

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="pcMonitoringData" height='505px' width="827px">
      <div id="myChart_one" style="width:827px;height:528px;padding: 25px 0px;" ref="myChart_one"></div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="appMonitoringData" height='505px' width="827px">
      <div id="myChart_two" style="width:827px;height:528px;padding: 25px 0px;" ref="myChart_two"></div>
    </el-dialog>
  </div>
</template>

<script >
/* eslint-disable */
// json 假数据
import mock from "@/api/json.js";
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

var echart = require("echarts");
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      pageSize: null,
      total: null, //总条数
      currentPage: null,
      tabPosition: 1, //当前页
      getWordRankingLists: [],
      monitorType: "", //定义状态，传状态给提交
      userSelect: [],
      pcMonitoringData: false,
      appMonitoringData: false,
      status: false,
      wordRankingLists: {
        keyword: "",
        sku: ""
      },
      keyword: "",
      skus: "",
      searchdList: "",
      keyword: "",
      sku: "",
      prompt: "",
      timeShow: false,
      //  value7: '',
      checked: false,
      addTask: false,
      //  添加监控
      form2: {},
      //关键词排名的变量
      form: {
        platformId: this.$store.state.selectPlatform.platformId,
        keyword: null,
        sku: null,
        monitorFlag: null,
        monitorFrom: null,
        monitorTo: null,
        monitorTimeAry: null
      },
      taskIds: [],
      rules: {
        keywords: [
          { required: true, message: "请输入关键字", trigger: "blur" },
          { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" } //限定输入的个数
        ],
        sku: [
          { required: true, message: "请输入商品ASIN:", trigger: "blur" },
          { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" } //限定输入的个数
        ]
      },
      formLabelWidth: "120px",
      pcRankingMonitoringTable: false,
      addMonitor: false,
      // 关键词
      inputText: "",
      StatusValue: "",
      // 放删除选中的数组
      multipleSelection: []
    };
  },
  created() {
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      adFlag: 0,
      pageNumber: 1,
      pageSize: 10
    };
    // this.getkeywordRankingListApi();//请求列表
    this.getkeywordApi(this.params);
  },
  mounted() {
    let vm = this;
    // console.log(this.$route, "111");
    // console.log(this.$router, "222");
  },
  computed: {
    ...mapState("anking", {
      // getWordRankingLists: state => state.keywordRankings,
      addKeywordRankingTasks: state => state.keywordRankingTasks
    }),
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
  },
  watch: {
    platformId(val) {
      this.getkeywordApi({ ...this.params, platformId: val });
    }
  },
  methods: {
    newLists1() {
      this.getkeywordApi(this.param); //关键词竞争分析列表
    },
    newLists2() {
      this.getkeywordApi(this.param); //关键词竞争分析列表
    },
    ...mapActions("anking", [
      // "getkeywordRankingListApi",
      "addKeywordRankingTaskApi"
    ]),
    // ...mapMutations("anking", {
    //   setWordList: "getWordRankingLists"
    // }),
    //请求列表
    getkeywordApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        adFlag: 0,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/TaskKeywordRank/list", params).then(res => {
        console.log(res, "555");
        this.pageSize = res.data.pageSize;
        this.total = res.data.total;
        this.currentPage = res.data.pageNo;
        this.getWordRankingLists = res.data.rows;
      });
    },
    // 改变每页显示的条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        adFlag: 0,
        pageSize: val, //条数
        pageNumber: this.currentPage, //页数
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getkeywordApi(params);
    },
    //分页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        adFlag: 0,
        pageSize: this.pageSize, //条数
        pageNumber: val, //页数
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getkeywordApi(params);
    },
    // 根据时间选择列表
    currentTimeData() {
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };
      return this.getkeywordApi(params);
    },

    //pc排名
    pcshowChart() {
      this.pcMonitoringData = true;
      this.$nextTick(() => {
        console.log(this.$refs.myChart_one);
        this.drawEchart(document.getElementById("myChart_one"));
      });
    },
    //APP排名监控图表
    appshowChart() {
      this.appMonitoringData = true;
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
    //获取PC监控图表
    getMonitoringEcharts() {
      console.log("监控图表");
      let params = {
        taskId: 35,
        monitorFrom: "2018-06-20 19:04:40",
        monitorTo: "2018-06-20 19:20:30"
      };
      this.$axios.post("TaskKeywordRankRtItem/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
        if (res.data.code == 0) {
          //成功返回的数据
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          return;
        }
      });
    },

    // 关键词排名添加任务数据初始为空 关键字、ASIN/监控状态、弹窗
    onaddTask() {
      this.keywords = "";
      this.sku = "";
      this.addTask = true;
    },
    //添加任务
    addTaskSubmit(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            platformId: this.$store.state.selectPlatform.platformId,
            keyword: this.form.keywords.split("\n"),
            sku: this.form.sku,
            monitorFlag: this.form.monitorFlag ? 1 : 0
          };
          if (params.monitorFlag) {
            params = Object.assign({}, params, {
              monitorFrom: this.form.monitorTimeAry[0],
              monitorTo: this.form.monitorTimeAry[1]
            });
          }
          _this.$axios.post("/TaskKeywordRank/save", params).then(
            res => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.addTask = false;
                this.form = {
                  platformId: this.$store.state.selectPlatform.platformId,
                  keyword: null,
                  sku: null,
                  monitorFlag: null,
                  monitorFrom: null,
                  monitorTo: null,
                  monitorTimeAry: null
                };
                //
                this.getkeywordApi();
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

    //添加监控 判断是否有有对象
    onAddMonitor(type) {
      let add = [];
      if (this.userSelect.length) {
        if (type == "add") {
          this.userSelect.forEach(item => {
            add.push(item.taskId);
            //当点击一个添加箭筒，提示已经添加监控
            if (item.monitorFlag == 1 && this.userSelect.length == 1) {
              this.$message({
                showClose: true,
                message: "已经添加监控",
                type: "warning"
              });
              this.addMonitor = false;
              this.getkeywordApi();
            } else {
              this.addMonitor = true;
            }
          });
        }
        if (type == "change") {
          this.userSelect.forEach(item => {
            add.push(item.taskId);
            //当点击一个添加箭筒，提示已经添加监控
            if (item.monitorFlag == 0) {
              this.$message({
                showClose: true,
                message: "没有添加监控，请先添加监控",
                type: "warning"
              });
              this.addMonitor = false;
              this.getkeywordApi();
            } else {
              this.addMonitor = true;
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
      this.monitorType = type;
    },
    //  点击改变监控
    changeMonitorTime() {
      let add = [];
      if (this.userSelect.length) {
        this.userSelect.forEach(item => {
          add.push(item.taskId);
          //当点击一个添加箭筒，提示已经添加监控
          if (item.monitorFlag == 1 && this.userSelect.length == 1) {
            this.$message({
              showClose: true,
              message: "已经添加监控",
              type: "warning"
            });
            this.addMonitor = false;
          } else {
            this.addMonitor = true;
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
    //添加监控提交
    addMonitorSubmit() {
      let type = this.monitorType;
      let add = [];
      //判断是否选中
      if (this.userSelect.length) {
        this.userSelect.forEach(item => {
          add.push(item.taskId);

          // if (item.monitorFlag == 1) {
          //   this.$message({
          //     showClose: true,
          //     message: "已经添加监控",
          //     type: "warning"
          //   });
          // }
          //  console.log(item.monitorFlag,"666666666")
          // 动态参数
          let params = {
            taskIds: add,
            monitorFrom: this.form2.date[0],
            monitorTo: this.form2.date[1]
          };
          // 添加监控
          if (type == "add") {
            if (item.monitorFlag == 0) {
              this.$axios
                .post("/TaskKeywordRank/addMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    //成功返回的数据
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    //关闭窗口
                    this.addMonitor = false;
                    this.getkeywordApi();
                    this.form2 = {
                      taskIds: "",
                      monitorFrom: "",
                      monitorTo: ""
                    };
                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            }
          }
          //修改监控
          if (type == "change") {
            if (item.monitorFlag == 1) {
              this.$axios
                .post("/TaskKeywordRank/updateMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    //成功返回的数据
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    //关闭窗口
                    this.addMonitor = false;
                    this.getkeywordApi();
                    this.form2 = {
                      taskIds: "",
                      monitorFrom: "",
                      monitorTo: ""
                    };
                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            }
          }

          // if (item.monitorFlag !== 0) {
          //   console.log("11111111111");
          // }
        });
      }

      console.log(666);
    },
    //取消监控
    cancelMonitor() {
      if (this.userSelect.length) {
        let dele = [];
        if (this.userSelect.length) {
          this.userSelect.forEach(item => {
            console.log(item.taskId);
            dele.push(item.taskId);
            if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              this.$message({
                showClose: true,
                message: "没有添加监控",
                type: "warning"
              });
            }

            let params = {
              taskIds: dele
            };
            console.log(params, "111");
            this.$axios
              .post("/TaskKeywordRank/removeMonitor", params)
              .then(res => {
                if (res.data.code == 0) {
                  //成功返回的数据
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.addTask = false;
                  this.getkeywordApi();
                  return;
                }
                if (res.data.code == 500) {
                  if (item.monitorFlag == 0 && this.userSelect.length == 1) {
                    this.$message({
                      showClose: true,
                      message: "没有添加监控",
                      type: "warning"
                    });
                  } else {
                    this.$message.error(res.data.msg);
                  }
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
    //删除关键词排名列表
    deleteKeywordRankingList() {
      if (this.userSelect.length) {
        //  this.taskIds = []
        console.log(this.taskIds);
        let a = this.taskIds;
        let s = new Set(a);
        let result = Array.from(s);
        console.log(result, "222");
        this.$axios
          .post("TaskKeywordRank/remove", { taskIds: result })
          .then(res => {
            if (res.data.code == 0) {
              //成功返回的数据
              this.$message({
                message: res.data.msg,
                type: "success"
              });

              this.getkeywordApi();
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

    //分页
    page(val) {
      this.recordSearch(
        this.wordRankingLists.keyword,
        this.wordRankingLists.sku
      );
    },
    //搜索 关键词和ASIN
    searchKeywordRankingAndAsin() {
      if (this.wordRankingLists.keyword || this.wordRankingLists.sku) {
        this.recordSearch(
          this.wordRankingLists.keyword,
          this.wordRankingLists.sku
        );
      }
    },
    //记录搜索值
    recordSearch(keyword, sku) {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        adFlag: 0,
        pageNumber: 1,
        pageSize: 50,
        keyword,
        sku
      };
      this.$axios.post("/TaskKeywordRank/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }

        if (res.data.rows.length) {
          this.getWordRankingLists = res.data.rows;

          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查询到相关数据");
        }
      });
    },
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
/* eslint-disable */

.el-popper[x-placement^="bottom"] {
  position: fixed !important;
  top: 220px !important;
  left: 627px !important;
  z-index: 2031;
}
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: orange !important;
  background-color: #fff;
  border-color: orange;
  -webkit-box-shadow: -1px 0 0 0;
  box-shadow: -1px 0 0 0;
}
.el-dialog__body {
  color: #606266;
  font-size: 14px;
  /* padding: 0 100px 0 0px; */
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
  left: 600px !important;
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
.el-form-item {
  margin-bottom: 3px;
}

.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: orange;
  background-color: #fff;
  border-color: orange;
  -webkit-box-shadow: -1px 0 0 0;
  box-shadow: -1px 0 0 0;
  position: relative;
}
</style>
