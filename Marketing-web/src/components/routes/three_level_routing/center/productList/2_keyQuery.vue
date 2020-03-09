<!-- 关键词查询 -->
<template>
  <div class="keyQuerys __wrapper_i">
    <section class="parentPosition">
      <el-row>
        <el-button type="success" @click="onaddKeywordTask">添加任务</el-button>
        <el-dialog :close-on-click-modal="false" title="添加产品" :visible.sync="addKeywordDialog" width="600px">
          <div slot="title">
            <span class="el-dialog__title">添加任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <div class="box __box_wrapper">

            <el-form :rules="rules" :model="queryForm" ref="ruleForm" style="width:100%;">
              <!-- <el-form-item label="选择站点: " prop="siteValue" :label-width="formLabelWidth" style="width:100%;">
                <el-select :popper-append-to-body="false"v-model="queryForm.siteValue" style="width:100%;">
                  <el-option v-for="(item,index) in siteData" :label="item.siteName" :value="item.siteId">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="关键词: " prop="keywords" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="textarea" :rows="4" placeholder="多个关键词换行输入（1-500个）" v-model="queryForm.keywords" style="width:100%;" />
                <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
              </el-form-item>
              <el-form-item label="页数: " prop="pageValue" :label-width="formLabelWidth" style="width:100%;">
                <el-select :popper-append-to-body="false" v-model="queryForm.pageValue" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-button type="primary" class="addTaskSubmitStyle" @click="showPoint('ruleForm')" style="width:100%;">确 定</el-button>
              </el-form-item>
            </el-form>
            <!-- <div slot="footer" class="dialog-footer " style="padding: 0 0 10px 102px; ">
              <el-button type="primary" class="addTaskSubmitStyle" @click="addTaskSubmit('ruleForm')" style="width:370px; margin-bottom:10px;">确 定</el-button>
            </div> -->
          </div>
        </el-dialog>
        <el-button type="success" plain @click="deleteList()">删除</el-button>
      </el-row>
      <!-- 布局 -->
      <el-row style="margin-top:8px;margin-bottom: 8px;height:30px" type="flex" justify="space-between">
        <!-- 输入框 -->
        <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
          <el-input placeholder="请输入关键词" v-model="searchListData.keyword" clearable style='max-width:150px;'>
          </el-input>
          <el-select :popper-append-to-body="false" v-model="searchListData.status" placeholder="选择状态" style='max-width:120px' clearable>
            <el-option v-for="item in keywordsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- 搜索按钮 -->
          <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" :loading="searchLoading" @click="searchData()">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" :loading="searchLoading" @click="searchData()">搜索</el-button>

        </el-col>
        <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">

          <el-date-picker unlink-panels :label-width="formLabelWidth" class="el-date-wrapper" value-format="yyyy-MM-dd" clearable @change="newTime" style="width:53%;max-width:240px" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-radio-group v-model="tabPosition" @change="currentTimeData" style="vertical-align: top;">
            <el-radio-button label="1">今日</el-radio-button>
            <el-radio-button label="7">7天</el-radio-button>
            <el-radio-button label="30">30天</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- <div class="timeStyle" style="top:50px">
        <el-date-picker  unlink-panels :label-width="formLabelWidth" class="el-date-wrapper" value-format="yyyy-MM-dd" @blur="newTime()" clearable @change="newLists3()" style="width:53%" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div> -->
      <!-- 表格数据 -->
      <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="geQueryLists" class="tableBox" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" align='center' :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="siteName" label="站点" align='center'>
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
            <el-button @click="handleClick(scope.row.taskId,scope.row.keyword)" v-if="scope.row.status=='2'" type="primary">查看</el-button>
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
import { trimAll } from "@/plugins/utils";
import { isDisabled, getDay } from "@/api/functions";
export default {
  data() {
    // 自定义校验
    var validateKeyword = (rule, value, callback) => {
      if (!value) {
        this.keywordsArr = [];
        // console.log(this.skusArr);
        callback(new Error("输入不能为空"));
        return;
      }
      if (value == null || value == undefined) return;
      let val = value
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
      isDisabled: true,
      searchLoading: false,
      // fontSum: 0,
      keywordsArr: [], //校验后的关键词数组
      loading: false, //Loading
      monitorTimeAry: [], //选择时间
      surplusAmount: null, //剩余点数
      charge: null, //点数
      userSelect: [],
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      totalPages: null,
      geQueryLists: [], //定义列表数据
      deleteData: [], //选中定义的数据
      addKeywordDialog: false, //定义添加任务弹窗
      queryForm: {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteValue: null, // 站点
        pageValue: null, //页数
        keywords: "" //关键词
      },
      // 状态数据
      processingState: [
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
      // 校验
      rules: {
        keywords: [
          {
            required: true,
            validator: validateKeyword,
            trigger: ["blur", "change"]
          } //限定输入的个
        ],
        pageValue: [{ required: true, message: "请选择页数", trigger: "blur" }],
        siteValue: [
          { required: true, message: "请选择站点", trigger: "change" }
        ]
      },
      formLabelWidth: "90px",
      analysisSearchData: {
        searchKeywords: "",
        searchSources: "",
        searchStatus: ""
      },
      siteData: [], // 定义站点接收赋值
      //  定义添加任务
      form: {
        platformId: null, //平台ID
        siteValue: [], // 站点
        sourceList: [], //来源列表
        keywords: "" //关键词
      },
      //选择的页数
      pageOptions: [
        {
          value: 1,
          label: 1
        },
        {
          value: 2,
          label: 2
        },
        {
          value: 3,
          label: 3
        },
        {
          value: 4,
          label: 4
        },
        {
          value: 5,
          label: 5
        },
        {
          value: 6,
          label: 6
        },
        {
          value: 7,
          label: 7
        },
        {
          value: 8,
          label: 8
        },
        {
          value: 9,
          label: 9
        },
        {
          value: 10,
          label: 10
        }
      ],
      value: "",
      // 定义搜索的内容
      searchListData: {
        keyword: "",
        status: ""
      },
      // 状态
      keywordsOptions: [
        {
          value: 1,
          label: "处理中"
        },
        {
          value: 2,
          label: "处理成功"
        },
        {
          value: 3,
          label: "处理失败"
        }
      ],
      // 时间段
      tabPosition: ""
    };
  },
  created() {
    // this.monitorTimeAry.push(this.getBeforeTime(30), this.getBeforeTime(0));
    // this.params = {
    //   platformId: this.$store.state.common.savePlatformIdAndSiteId.split("," )[0],
    //   pageNumber: 1,
    //   pageSize: 10
    // };
    this.getQueryListApi(); //获取列表
    this.getCategorList(); //获取站点
    this.getPointeApi(); //获取扣点
  },
  computed: {
    fontSum() {
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
          this.pageSize = 10;
          this.pageNumber = 1;
          this.getQueryListApi();
        }
      },
      deep: true
    }
    // 监听平台ID
    // platformId(val) {
    //   this.getQueryListApi({
    //     platformId: val
    //   });
    // },
    //监听关键词，生成任务名
    // keywordsArr(val) {
    //   if (val.length) {
    //     this.fontSum = val.length;
    //   } else {
    //     this.fontSum = 0;
    //   }
    // }
  },
  methods: {
    // 请求扣点 关键词查询扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/keywordQuery/list").then(res => {
        this.surplusAmount = res.data.data.surplusAmount;
        this.charge = res.data.data.charge;
      });
    },
    // 搜索为空时，刷新列表
    newLists1(e) {
      // console.log(e);
      if (e === "" || e == null) {
        this.getQueryListApi(); //关键词竞争分析列表
      }
    },
    newLists2() {
      this.getQueryListApi(); //关键词竞争分析列表
    },
    newLists3() {
      this.getQueryListApi(); //关键词竞争分析列表
      this.tabPosition = null;
    },
    ...mapMutations("selectionTool", {
      setWordList: "getKeywordList"
    }),

    // 请求列表
    getQueryListApi(param = {}) {
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

      this.$axios.post("/TaskKeywordQuery/list", params).then(res => {
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
          this.geQueryLists = rows;
        } else if (!rows) {
          this.geQueryLists = rows;
          this.total = 0;
          this.totalPages = 0;
        }
      });
    },

    // 分页 改变条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getQueryListApi();
    },
    // 改变页数
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getQueryListApi();
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
    // 改变时间 1.7.30天
    currentTimeData() {
      this.pageSize = 10;
      this.pageNumber = 1;
      let a = Number(this.tabPosition);
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
      return this.getQueryListApi();
    },
    // 自由改变时间搜索
    newTime(val) {
      this.pageSize = 10;
      this.pageNumber = 1;
      const { $ } = this;
      if (!val) {
        this.tabPosition = null;
        return this.getQueryListApi();
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

      return this.getQueryListApi();
    },
    //点击添加任务按钮
    onaddKeywordTask() {
      this.addKeywordDialog = true;
      this.queryForm.pageValue = null; //页数
      this.queryForm.keywords = null;
      this.keywordsArr = [];
    },
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务  关键词查询任务添加
    addTaskSubmit(formName, point) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            type: point,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0],
            siteId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[1],
            keywords: this.queryForm.keywords.split("\n"),
            searchPages: this.queryForm.pageValue
          };
          params.keywords = [...new Set(this.keywordsArr)];
          // 扣点按钮loading
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          this.$axios.post("/TaskKeywordQuery/save", params).then(res => {
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
              this.getQueryListApi(this.param); //关键词竞争分析列表
              this.$refs[formName].resetFields(); //清空数据
              this.addKeywordDialog = false;
            }
          });
        }
      });
    },
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
    //删除
    deleteList() {
      if (this.userSelect.length) {
        // let a = this.deleteData;
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
              .post("/TaskKeywordQuery/remove", { taskIds: arr })
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.pageNumber = 1;
                  this.getQueryListApi(this.param); //关键词竞争分析列表
                  this.deleteData = [];
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
    //搜索
    searchData() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.searchLoading = true;
      this.getQueryListApi();
    },
    //记录搜索值
    recordSearch(keyword, status) {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: 1,
        pageSize: 10
      };
      params = { ...params, ...this.searchListData };
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key];
          if (element === "" || element == null) delete params[key];
        }
      }
      this.$axios.post("/TaskKeywordQuery/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.pageNumber = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.geQueryLists = res.data.rows;
      });
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.deleteData.push(item.taskId);
      });
    },
    // table的查看
    handleClick(taskId, keyword) {
      this.$router.push({
        name: "关键词查询查看",
        query: {
          id: taskId,
          keyword: keyword
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
  left: 413px;
  top: -32px;
  color: #30cca5;
  font-size: 12px;
}
.box {
  position: relative;
}

.addTaskSubmitStyle {
  width: 300px;
}
.tableBox {
  width: 100%;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
</style>
