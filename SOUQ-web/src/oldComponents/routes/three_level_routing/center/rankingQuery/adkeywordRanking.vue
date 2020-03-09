<template>
  <div class='adkeywordRanking'>
    <el-row class='paddingBobbtom'>
      <el-button type="success" @click="addAdvertisingTaks">添加任务</el-button>
      <el-dialog title="添加产品" :visible.sync="addTask" style="min-width:1200px;padding-right:100px;" width="35%">
        <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%; padding-right:100px; ">
          <el-form-item label="关键词:" prop="keyword" :label-width="formLabelWidth" style="width:100%;">
            <el-input v-model="form.keyword" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="商品ASIN:" prop="sku" :label-width="formLabelWidth">
            <el-input v-model="form.sku" placeholder=""></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox v-model="form.monitorFlag">是否添加监控</el-checkbox>
            <el-date-picker :label-width="formLabelWidth" class="el-date-wrapper" style="width:100%" v-if='form.monitorFlag' v-model="form.monitorTimeAry" type="daterange" align="left" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" @click="addAdvertisingTaksSubmit('ruleForm')" style="width:100%; ">确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="success" @click="onAddMonitor('add')">添加监控</el-button>
      <el-button type="success" @click="onAddMonitor('change')">修改监控周期</el-button>
      <el-dialog title="添加监控" :visible.sync="monitorDialogShow" width="40%" style="min-width:1200px">
        <el-form :model="form">
          <template>
            <div class="block " style="padding-left:25%;">

              <el-date-picker v-model="addMonitorTime.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :label-width="formLabelWidth" value-format="yyyy-MM-dd">
              </el-date-picker>
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
      <el-button type="success" plain @click="cancelMonitorSubmit()">取消监控</el-button>
      <el-button type="success" plain @click="deleteAdvertisingList()">删除</el-button>
    </el-row>
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键字输入 -->
      <el-col :span="15">
        <el-input placeholder="请输入广告词名查询" v-model="advertising.keyword" clearable @change="newLists1()" style='max-width:200px;'>
        </el-input>
        <el-input placeholder="ASIN" v-model="advertising.sku" style='max-width:200px;' clearable @change="newLists2()">
        </el-input>
        <el-button type="success" icon="el-icon-search" @click="searchAdvertisement()">搜索</el-button>
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
    <el-table stripe ref="multipleTable" :data="advertisementRanking" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="keyword" label="关键字" align='center'>
      </el-table-column>
      <el-table-column prop="sku" label="ASIN" align='center'>
      </el-table-column>
      <el-table-column prop="title" label="标题" align='center'>
      </el-table-column>
      <el-table-column prop="monitorFlag" label="监控状态" align='center'>
        <template slot-scope="scope">
          {{ scope.row.monitorFlag?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创始时间" align='center'>
      </el-table-column>
      <el-table-column prop="monitorFrom" label="监控开始时间" align='center'>
      </el-table-column>
      <el-table-column prop="monitorTo" label="监控结束时间" align='center'>
      </el-table-column>
      <el-table-column prop="webRank" label="PC排名" align='center'>
        <template slot-scope="scope">
          {{scope.row.webRank}}
          <el-button type="text" @click="akPcChart">
            <img src="~@/assets/images/brokenLineImg.png" alt="Pc图标" style="width:25px;height:25px;" v-if="scope.row.monitorFlag==true" @click="getPcCharts()">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="appRankk" label="App排名" align='center'>
        <template slot-scope="scope">
          {{scope.row.appRankk}}
          <el-button type="text" @click="akAppChart">
            <img src="~@/assets/images/brokenLineImg.png" alt="app图表" style="width:25px;height:25px" v-if="scope.row.monitorFlag==true" @click="getPcCharts()" />
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="pcChartsData" height='505px' width="827px">
      <div id="myPcChart_one" style="width:827px;height:528px;padding: 25px 0px;" ref="myPcChart_one"></div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="appChartsData" height="505px" width="827px">
      <div id="myAppChart_two" style="width:827px; height:528px; padding: 25px; 0px" ref="myAppChart_two">

      </div>

    </el-dialog>
  </div>
</template>
<script>
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
      currentPage: null, //页数
      pageSize: null, //条数
      total: null, //总数
      tabPosition: 1, //默认今日数据
      advertisementRanking: [], //接收请求过来的列表
      monitorType: "",
      pcChartsData: false,
      appChartsData: false,
      // 定义搜索的内容
      advertising: {
        keyword: "",
        sku: ""
      },

      //关键词排名添加任务的的变量
      form: {
        platformId: this.$store.state.selectPlatform.platformId,
        merchantId: 2,
        siteId: 3,
        adFlag: 1,
        keyword: null,
        sku: null,
        monitorFlag: null,
        monitorFrom: null,
        monitorTo: null,
        monitorTimeAry: null
      },

      rules: {
        keyword: [
          { required: true, message: "请输入关键字", trigger: "blur" },
          { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" } //限定输入的个数
        ],
        sku: [
          { required: true, message: "请输入商品ASIN:", trigger: "blur" },
          { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" } //限定输入的个数
        ]
      },
      monitorDialogShow: false, //监控弹窗初始为空
      userSelect: [],
      taskIds: [],
      addMonitorTime: {}, //定义时间

      // ---------------

      getWordRankingLists: [],
      timeShow: false,

      addTask: false,

      formLabelWidth: "120px",

      addTask: false,
      addMonitor: false,
      // 关键词
      inputText: ""
    };
  },
  created() {
    // // 初始调用获取列表接口
    // this.getAdvertisementRankingListApi();
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      adFlag: 1,
      pageNumber: 1,
      pageSize: 10
    };
    this.getRankingListApi(this.params);
  },
  mounted() {},
  computed: {
    // ...mapState("anking", {
    //   advertisementRanking: state => state.advertisementRanking
    // })
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
  },
  watch: {
    platformId(val) {
      this.getRankingListApi({ ...this.params, platformId: val });
    }
  },

  methods: {
    newLists1() {
      this.getRankingListApi(this.param); //关键词竞争分析列表
    },
    newLists2() {
      this.getRankingListApi(this.param); //关键词竞争分析列表
    },
    //请求列表
    getRankingListApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        adFlag: 1,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/AdKeywordRank/list", params).then(res => {
        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;

        this.advertisementRanking = res.data.rows;
      });
    },

    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        adFlag: 1,
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getRankingListApi(params);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        adFlag: 1,
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getRankingListApi(params);
    },

    //通过时间改变列表
    currentTimeData() {
      let params = {
        adFlag: 1,
        createTime: this.tabPosition,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };
      console.log(params);
      return this.getRankingListApi(params);
    },
    //PC图表弹窗
    akPcChart() {
      this.pcChartsData = true;
      this.$nextTick(() => {
        console.log(this.$refs.myPcChart_one);
        this.drawEchart(document.getElementById("myPcChart_one"));
      });
    },
    // APP图表弹窗控制
    akAppChart() {
      this.appChartsData = true;
      this.$nextTick(() => {
        console.log(this.$refs.myAppChart_two);
        this.drawEchart(document.getElementById("myAppChart_two"));
      });
    },
    //添加图表
    drawEchart(dom) {
      console.log(mock.rankData, 666);
      console.log(dom, 88888);
      let et = echart.init(dom);
      et.setOption(mock.rankData);
    },
    //获取PC图表数据
    getPcCharts() {
      let params = {
        taskId: 35,
        monitorFrom: "2018-06-20 19:04:40",
        monitorTo: "2018-06-20 19:20:30"
      };
      this.$axios.post("TaskKeywordRankRtItem/list", params).then(res => {
        if (res.data.code == 0) {
          //成功返回的数据
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          return;
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    //添加任务点击。弹窗弹出，且内容为空
    addAdvertisingTaks() {
      this.addTask = true;
      (this.sku = ""), (this.keyword = "");
    },
    //添加任务   后端接口有问题？，添加成功提示后，没有添加上去
    addAdvertisingTaksSubmit(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            platformId: this.$store.state.selectPlatform.platformId,
            merchantId: 2,
            siteId: 3,
            adFlag: 1,
            keyword: this.form.keyword,
            sku: this.form.sku,
            monitorFlag: this.form.monitorFlag ? 1 : 0
            // monitorFrom: "2018-06-20",
            // monitorTo: "2018-06-21"
            //          "monitorFrom":"2018-06-20",
            // "monitorTo":"2018-06-20"
          };
          console.log(params);
          if (params.monitorFlag) {
            params = Object.assign({}, params, {
              monitorFrom: this.form.monitorTimeAry[0],
              monitorTo: this.form.monitorTimeAry[1]
            });
          }
          this.$axios.post("/AdKeywordRank/save", params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getRankingListApi();
            }
          });
        }
      });
    },
    //点击添加监控按钮控制
    onAddMonitor(type) {
      this.monitorDialogShow = true;
      let addMonitor = [];
      // 判断是否选中
      if (this.userSelect.length) {
        // 判断是否点击添加监控
        if (type == "add") {
          this.userSelect.forEach(item => {
            addMonitor.push(item.taskId);
            if (item.monitorFlag == 1 && this.userSelect.length == 1) {
              this.$message({
                showClose: true,
                message: "已经添加监控",
                type: "warning"
              });
              this.monitorDialogShow = false;
            } else {
              this.monitorDialogShow = true;
            }
          });
        }
        if (type == "change") {
          this.userSelect.forEach(item => {
            addMonitor.push(item.taskId);
            if (item.monitorFlag == 0) {
              this.$message({
                showClose: true,
                message: "没有添加监控，请先添加监控",
                type: "warning"
              });
              this.monitorDialogShow = false;
            } else {
              this.monitorDialogShow = true;
            }
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "至少选择一个",
          type: "warning"
        });
        this.monitorDialogShow = false;
      }
      this.monitorType = type;
    },
    //监控添加提交
    addMonitorSubmit() {
      let type = this.monitorType;
      let addMonitor = [];
      if (this.userSelect.length) {
        this.userSelect.forEach(item => {
          addMonitor.push(item.taskId);

          // if (item.monitorFlag == 1) {
          //   this.$message({
          //     showClose: true,
          //     message: "已经添加监控",
          //     type: "warning"
          //   });
          // }
          let params = {
            taskIds: addMonitor,
            monitorFrom: this.addMonitorTime.date[0],
            monitorTo: this.addMonitorTime.date[1]
          };
          if (type == "add") {
            if (item.monitorFlag == 0) {
              this.$axios
                .post("/AdKeywordRank/addMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.monitorDialogShow = false;
                    this.getRankingListApi();

                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            }
          }
          if (type == "change") {
            console.log(1111);
            if (item.monitorFlag == 1) {
              this.$axios
                .post("/AdKeywordRank/updateMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.monitorDialogShow = false;
                    this.getRankingListApi();

                    return;
                  }
                  if (res.data.code == 500) {
                    this.$message.error(res.data.msg);
                  }
                });
            }
          }
          // if (item.monitorFlag == 0) {
          //   this.$axios.post("adKeywordRank/addMonitor", params).then(res => {
          //     if (res.data.code == 0) {
          //       this.$message({
          //         message: res.data.msg,
          //         type: "success"
          //       });
          //       this.monitorDialogShow = false;
          //       this.getAdvertisementRankingListApi();

          //       this.addMonitorTime = {
          //         taskIds: "",
          //         monitorFrom: "",
          //         monitorTo: ""
          //       };
          //       return;
          //     }
          //     if (res.data.code == 500) {
          //       this.$message.error(res.data.msg);
          //     }
          //   });
          // }
          // if (item.monitorFlag !== 0) {
          //   console.log("11111111111");
          // }
        });
      }
    },
    //  取消监控
    cancelMonitorSubmit() {
      // 判断是否有选择项目，必须选择一项
      if (this.userSelect.length) {
        let cancelMonitor = [];
        if (this.userSelect.length) {
          //循环这个数组，并且把选中的添加到这个新的数组中
          this.userSelect.forEach(item => {
            cancelMonitor.push(item.taskId);
            console.log(cancelMonitor, "111");
            if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              this.$message({
                showClose: true,
                message: "没有添加监控",
                type: "warning"
              });
            }
            let params = {
              taskIds: cancelMonitor
            };
            this.$axios
              .post("/AdKeywordRank/removeMonitor", params)
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.getRankingListApi();
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
    //删除监控
    deleteAdvertisingList() {
      if (this.userSelect.length) {
        let a = this.taskIds;
        let s = new Set(a);
        let results = Array.from(s);
        this.$axios
          .post("/AdKeywordRank/remove", { taskIds: results })
          .then(res => {
            if (res.data.code == 0) {
              //成功返回的数据
              this.$message({
                message: res.data.msg,
                type: "success"
              });

              this.getRankingListApi();
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

    // ...mapActions("anking", ["getAdvertisementRankingListApi"]),
    ...mapMutations("anking", {
      setAdkeyWord: "getAdvertisementRankingList"
    }),
    // 广告词搜索
    searchAdvertisement() {
      if (this.advertising.keyword || this.advertising.sku) {
        this.recordSearch(this.advertising.keyword, this.advertising.sku);
      }
    },
    //记录搜索值
    recordSearch(keyword, sku) {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        adFlag: 1,
        pageNumber: 1,
        pageSize: 10,
        keyword,
        sku
      };
      this.$axios.post("/AdKeywordRank/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.advertisementRanking = res.data.rows;

          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查询到相关的数据");
          return;
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
    deleteRow(tableData) {},
    // table的查看
    handleClick(index, rowDetail) {
      console.log(index, rowDetail);
    }
  }
};
</script>

<style scoped>
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
/* element.style {
    z-index: 2025;
    position: fixed;
    top: 221px;
    left: 637p !important;
} */
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: orange;
  background-color: #fff;
  border-color: orange;
  -webkit-box-shadow: -1px 0 0 0;
  box-shadow: -1px 0 0 0;
}
</style>
