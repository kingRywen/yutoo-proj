<!-- 竞争者分析页面 -->
<template>
  <div class='keywordIndexContainer __wrapper_i'>
    <section class="parentPosition">
      <el-row>
        <el-button type="success" @click="onaddTask()">添加任务</el-button>
        <el-dialog :close-on-click-modal="false" title="添加任务" :visible.sync="addTask" width="600px">
          <div slot="title">
            <span class="el-dialog__title">添加任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <div class="box __box_wrapper">
            <el-form :rules="rules" :model="form" ref="ruleForm" style="width:100%;">
              <!-- <el-form-item label="选择站点: " prop="siteId" :label-width="formLabelWidth" style="width:100%;">
                <el-select :popper-append-to-body="false"v-model="form.siteId" class="siteIdStyle" style="width:100%;">
                  <el-option v-for="(item,index) in siteData" :label="item.siteName" :value="item.siteId">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="选择来源 :" prop="searchSites" :label-width="formLabelWidth" style="width:100%;">
                <el-checkbox-group v-model="form.searchSites" class="searchSitesStyle" style="width:100%;">
                  <el-checkbox v-for="item in StatusOptions" :label="item.value" :key='item.value' name="searchSites">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="关键词: " prop="keywords" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="textarea" style="width:100%;" :rows="4" placeholder="多个关键词以逗号间隔或换行输入（1-500个）" class="keywordIntext" v-model="form.keywords" />
                <div class="_fontSize" v-model="fontSum1">已输入 {{fontSum1||0}} 个</div>
              </el-form-item>
              <!-- <el-form-item style="height:0;padding:0;margin:0">
                <template>
                  <div class=" fontSizeBox fontSize" v-model="fontSum">已输入 {{fontSum}} 个</div>
                </template>
              </el-form-item> -->
              <el-form-item label="任务名称:" prop="taskName" :label-width="formLabelWidth" style="width:100%;">
                <el-input v-model="form.taskName" style="width:100%;" placeholder="最多输入30个字符" maxlength="30" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-button type="primary" style="width:100%" @click="showPoint('ruleForm')">确 定</el-button>
              </el-form-item>
            </el-form>

          </div>
        </el-dialog>
        <el-button type="success" plain @click="deleteAnalysisList()">删除</el-button>
      </el-row>
      <!-- 布局 -->
      <el-row type='flex' justify="space-between" style="margin-top:8px;margin-bottom: 8px;height:30px">
        <!-- 输入框 -->
        <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
          <el-input placeholder="请输任务名称" v-model.trim="searchListData.taskName" clearable style='max-width:150px;'>
          </el-input>
          <!-- 选择来源 -->
          <el-select :popper-append-to-body="false" v-model="searchListData.searchSites" clearable placeholder="选择来源" style='max-width:120px' clearable>
            <el-option v-for="item in originOptions" :label="item.label" :value="item.value" :collapse-tags="true">
            </el-option>
          </el-select>
          <!-- 选择状态 -->
          <el-select :popper-append-to-body="false" clearable v-model="searchListData.status" placeholder="选择状态" style='max-width:120px' clearable>
            <el-option v-for="item in processingState" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- 搜索按钮 -->
          <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" :loading="searchLoading" @click="onSearch">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" :loading="searchLoading" @click="onSearch">搜索</el-button>
          <el-button :disabled="isDisabled" type="success" icon="el-icon-search" :loading="clearSearchLoading" @click="clearSearchLists" style="margin-left:5px !important">清空</el-button>
        </el-col>
        <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
          <el-date-picker unlink-panels :label-width="formLabelWidth" class="el-date-wrapper" clearable @change="newTime" style="width:53%;max-width:240px" v-model="monitorTimeAry" type="daterange" align="left" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-radio-group v-model="tabPosition" @change="currentData">
            <el-radio-button label="1">今日</el-radio-button>
            <el-radio-button label="7">7天</el-radio-button>
            <el-radio-button label="30">30天</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="getAnalysisList" tooltip-effect="dark" class="tableBox" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" align='center' :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="siteName" label="站点" align='center'>
        </el-table-column>
        <el-table-column prop="searchSites" label="来源" align='center'>
          <template slot-scope="scope">
            <template v-for="item in scope.row.searchSites">
              <span v-if="item==0">Google</span>
              <!-- <span v-if="item==1">速卖通</span> -->
              <span v-if="item==2">merchantwords</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.status==='0'">处理中</span>
            <span v-if="scope.row.status=='1'">处理中</span>
            <span v-if="scope.row.status=='2'">处理成功</span>
            <span v-if="scope.row.status>=3">处理失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="resultTime" label="结果生成时间" align='center'>
        </el-table-column>
        <el-table-column prop="handle" label="操作" align='center'>
          <template slot-scope="scope">
            <!-- 条件显示  处理成功后显示查看 -->
            <div style="text-align: center">
              <el-button @click="handleClick(scope.row.taskId,scope.row.searchSites,scope.row.taskName)" v-if="scope.row.status=='2'" type="primary">查看</el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style='margin-top:20px;'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" :page-count="totalPages">
        </el-pagination>
      </div>
      <el-point :data="pointData"></el-point>
    </section>
  </div>
</template>
<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
import qs from "qs";
import _keyQueryVue from "./2_keyQuery.vue";
import { trimAll } from "@/plugins/utils";
import { isDisabled, getDay } from "@/api/functions";
export default {
  data() {
    // 自定义校验
    var validateKeyword = (rule, value, callback) => {
      if (!value) {
        this.keywordsArr = [];
        callback(new Error("输入不能为空"));
        return;
      }
      if (value == null || value == undefined) return;
      var val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      this.keywordsArr = val;
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      let keyworldLength = null;
      // if (regEn.test(value) || regCn.test(value)) {
      //   callback(new Error("不能包含特殊字符"));
      // } else
      if (val.length > 500) {
        callback(new Error("输入数量不能超过500个"));
      } else {
        callback();
      }
    };
    return {
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      searchLoading: false,
      searchListData: {},
      isDisabled: true,
      keywordsArr: [],
      clearSearchLoading: false,
      tabPosition: "",
      loading: true, //loading
      addData: [], //添加任务关键词
      keyworldLength: null,
      charge: null, //点数
      monitorTimeAry: [], //时间选择器
      userSelect: [],
      getAnalysisList: [], //请求过来的列表数据
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      totalPages: null,
      analysisData: [], //分析列表删除
      // 来源定义数据
      StatusOptions: [
        {
          value: 0,
          label: "Google"
        },
        // {
        //   value: 1,
        //   label: "速卖通"
        // },
        {
          value: 2,
          label: "merchantwords"
        }
      ],
      // 状态数据
      processingState: [
        // {
        //   value: "0",
        //   label: "待处理"
        // },
        {
          value: "1",
          label: "处理中"
        },
        {
          value: "2",
          label: "处理成功"
        },
        {
          value: "3",
          label: "处理失败"
        }
      ],
      addTask: false, //添加任务弹窗
      state: [],
      //  定义添加任务
      form: {
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1], // 站点
        searchSites: [], //来源列表
        keywords: "", //关键词
        taskName: ""
      },
      // 校验
      rules: {
        keywords: [
          {
            required: true,
            validator: validateKeyword,
            trigger: ["blur", "change"]
          } //限定输入的个
        ],
        searchSites: [
          {
            required: true,
            message: "请至少选择一个来源",
            trigger: "change"
          }
        ],
        taskName: [
          {
            required: false,
            max: 30,
            message: "任务名称(30个字符以内)",
            trigger: ["blur", "change"]
          }
        ]
        // siteId: [{ required: true, message: "请选择站点", trigger: "change" }]
      },
      formLabelWidth: "90px",
      analysisSearchData: {
        taskName: null,
        searchSites: null,
        status: null
      },
      siteData: "", // 定义站点接收赋值
      // 来源
      originOptions: [
        {
          value: "0",
          label: "Google"
        },
        // {
        //   value: "1",
        //   label: "速卖通"
        // },
        {
          value: "2",
          label: "merchantwords"
        }
      ]
    };
  },
  created() {
    // this.monitorTimeAry.push(this.getBeforeTime(30), this.getBeforeTime(0)),
    // this.getKeywordAnalysisListApi(); //关键词竞争分析列表
    // this.params = {
    //   platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
    //     ","
    //   )[0],
    //   pageNumber: 1,
    //   pageSize: 10
    // };
    this.getKeywordApi(); //关键词竞争分析列表
    this.getCategorList(); //获取站点
    this.getPointeApi();
  },
  mounted() {},
  computed: {
    // 获取点数
    ...mapState("point", {
      getpointData: state => state.getPointeData
    }),
    fontSum1() {
      return this.keywordsArr.length;
    }
  },
  watch: {
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.isDisabled = isDisabled(newV);
        //要干的事情
        if (this.isDisabled === true) {
          this.getKeywordApi();
        }
      },
      deep: true
    }
    // platformId(val) {
    //   this.getKeywordApi({ platformId: val });
    // },
  },
  methods: {
    // 请求扣点 关键词竞争分析扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/keywordCompete/list").then(res => {
        this.charge = res.data.data.charge;
      });
    },
    //获取多少天以前的时间
    getBeforeTime(n) {
      var n = n;
      var d = new Date();
      var year = d.getFullYear();
      var mon = d.getMonth() + 1;
      var day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      return (
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    //计算本月有多少天
    getCountDays() {
      var curDate = new Date();
      var curMonth = curDate.getMonth();
      curDate.setMonth(curMonth + 1);
      curDate.setDate(0);
      return curDate.getDate();
    },
    // 根据时间选择数据 今日 7日  30日
    currentData() {
      this.pageSize = 10;
      this.pageNumber = 1;
      // console.log(this.monitorTimeAry[0], "时间");
      let a = Number(this.tabPosition);
      let dateObj = new Date();
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      let _end = null;
      let _start = null;
      switch (params.createTime) {
        case 7:
          _start = getDay(7).computedDay;
          _end = getDay().today;
          break;
        case 30:
          _start = getDay(30).computedDay;
          _end = getDay().today;
          break;
        default:
          _start = getDay().today;
          _end = getDay().today;
      }
      this.monitorTimeAry = [_start, _end];
      this.$forceUpdate();
      this.getKeywordApi({
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      });
    },
    // 自由改变时间搜索
    newTime(val) {
      this.pageSize = 10;
      this.pageNumber = 1;
      const { $ } = this;
      if (!val) {
        this.tabPosition = null;
        return this.getKeywordApi();
      }

      const [start, end] = val;

      // console.log($.formatTime(end + 7 * 24 * 3600 * 1000, "{y}/{m}/{d}"));

      if (
        $.formatTime(start, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 1;
      } else if (
        $.formatTime(
          new Date(start).valueOf() + 7 * 24 * 3600 * 1000,
          "{y}/{m}/{d}"
        ) === $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 7;
      } else if (
        $.formatTime(
          new Date(start).valueOf() + 30 * 24 * 3600 * 1000,
          "{y}/{m}/{d}"
        ) === $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 30;
      } else {
        this.tabPosition = null;
      }

      return this.getKeywordApi({
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      });
    },
    // 请求列表
    // getKeywordApi(
    //   params = {
    //     platformId: this.$store.state.common.savePlatformIdAndSiteId.split("," )[0],
    //     pageNumber: 1,
    //     pageSize: 10
    //   }
    // ) {
    //   this.$axios.post("/TaskKeywordCompete/list", params).then(res => {
    //     if (res.data.code == 500) {
    //       this.loading = false;
    //       this.$message.error(res.data.msg);
    //       return;
    //     }
    //     this.pageNumber = res.data.pageNo; //分页
    //     this.total = res.data.total;
    //     this.pageSize = res.data.pageSize;
    //     this.loading = false;
    //     this.getAnalysisList = res.data.rows;
    //   });
    // },

    // 请求列表
    getKeywordApi(param = {}) {
      // debugger;
      this.loading = true;
      const { pageSize, pageNumber } = this;
      let startTime = this.monitorTimeAry ? this.monitorTimeAry[0] : "";
      let endTime = this.monitorTimeAry ? this.monitorTimeAry[1] : "";
      const params = this.$.dealObjectValue({
        pageSize,
        pageNumber,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        ...this.searchListData,
        startTime,
        endTime,
        ...param
      });

      this.$axios.post("/TaskKeywordCompete/list", params).then(res => {
        this.clearSearchLoading = false;
        this.searchLoading = false;
        this.loading = false;
        const { pageNo, pageSize, total, rows, totalPages } = res.data;
        if (res.data.code === 500) {
          this.$.showError(res);
          return;
        }
        if (rows && rows.length >= 0) {
          this.pageSize = pageSize;
          this.pageNumber = pageNo;
          this.total = total;
          this.totalPages = totalPages;
          this.getAnalysisList = rows;
        } else if (!rows) {
          this.getAnalysisList = rows;
          this.total = 0;
          this.totalPages = 0;
        }
      });
    },

    // 分页 改变条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getKeywordApi();
    },
    // 改变页数
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getKeywordApi();
    },
    ...mapMutations("selectionTool", {
      setWordList: "getAnalysisLists"
    }),
    // 获取站点方法
    getCategorList() {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.$axios.post("/TaskSiteShare/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.siteData = res.data;
      });
    },
    //添加任务按钮 弹出弹窗
    onaddTask() {
      // 清除表单内容;
      this.form.searchSites = []; //来源列表
      this.form.keywords = "";
      this.addTask = true;
      this.keywordsArr = [];
      this.form.taskName = null;
    },
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务-  关键词分析添加任务
    addTaskSubmit(formName, point) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 设置任务名称
          if (!this.form.taskName || this.form.taskName == "") {
            let len = [...new Set(this.keywordsArr)].length;
            // console.log(len);
            let taskName = this.keywordsArr[0] + " " + len;
            taskName = taskName.slice(-30);
            // console.log(taskName);
            this.form.taskName = taskName;
          }
          // 设置任务名称end
          let params = {
            type: point,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0]
          };
          params = { ...params, ...this.form };
          params.keywords = [...new Set(this.keywordsArr)];
          // 扣点按钮loading
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          _this.$axios.post("/TaskKeywordCompete/save", params).then(
            res => {
              // 扣点弹窗
              if (point === 0) {
                if (res.data.code == 0) {
                  this.pointData.show = true;
                  this.pointData.point = res.data.data + "点";
                  this.pointData.formName = formName;
                } else if (res.data.code === 500) {
                  this.$message.error(res.data.msg);
                }
                return;
              }
              if (res.data.code == 500) {
                this.$nextTick(() => {
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                this.$message.error(res.data.msg);
              }
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$nextTick(() => {
                  this.pointData.show = false; // 关闭扣点弹窗
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                this.reloadPointApi(); // 重新获取点数
                this.$refs[formName].resetFields(); //清除数据
                this.addTask = false; //关闭添加任务窗口
                this.form.taskName = null; //清空任务名
                this.getKeywordApi(); //刷新请求列表
                return;
              }
            },
            err => {
              // console.log(err);
            }
          );
        } else {
          return false;
        }
      });
    },
    //删除列表   竞争分析列表todom
    deleteAnalysisList() {
      if (this.userSelect.length) {
        // let a = this.analysisData;
        // let s = new Set(a);
        // let result = Array.from(s);
        let arr = [];
        this.userSelect.forEach(item => {
          arr.push(item.taskId);
        });
        this.$confirm("确定删除数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .post("/TaskKeywordCompete/remove", { taskIds: arr })
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.getKeywordApi({
                    pageNumber: 1
                  });
                  this.analysisData = [];
                }
                if (res.data.code == 500) {
                  this.$message.error(res.data.msg);
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    // 搜索
    onSearch() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.searchLoading = true;
      this.getKeywordApi();
    },
    // 清空搜索
    clearSearchLists() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.clearSearchLoading = true;
      this.searchListData = {};
    },
    // 弹窗中的级联类目选择
    handleChange(value) {
      // console.log(value);
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      // this.userSelect.forEach(item => {
      //   this.analysisData.push(item.taskId);
      // });
    },
    // table的查看
    handleClick(taskId, searchSites, taskName) {
      this.$router.push({
        path: "/admin/center/KeywordIndex/KeywordIndexSee",
        query: {
          id: taskId,
          searchSites: searchSites,
          taskName: taskName
        }
      });
    }
  }
};
</script>

<style scoped>
.fontSizeBox {
  position: relative;
}
.fontSize {
  position: absolute;
  z-index: 10000;
  color: #30cca5;
  font-size: 12px;
  text-align: right;
  float: right;
  right: 0;
  line-height: 2;
}
/* 定位时间选择器 */
.addTaskSubmitStyle {
  width: 375px;
  margin-left: 116px;
  /* margin-top: 20px;
  margin-bottom: 20px; */
}
.searchSitesStyle {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  width: 350px;
  box-sizing: border-box;
  line-height: 40px;
  height: 42px;
}
.siteIdStyle {
  width: 370px;
}
.keywordsStyle {
  width: 490px;
}
.taskStyle {
  width: 490px;
}
.box {
  position: relative;
}
/* .timeCss {
  display: inline;
  color: #30cca5;
  margin-left: 10px;
  font-size: 14px;
} */

.tableBox {
  width: 100%;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
</style>
