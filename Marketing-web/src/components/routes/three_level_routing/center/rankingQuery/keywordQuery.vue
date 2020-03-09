<template>
  <div class='keywordQuery __wrapper_i'>
    <section class="parentPosition">
      <el-row>
        <!-- 添加任务 -->
        <el-button type="success" @click="onaddTask">添加任务</el-button>
        <el-dialog :close-on-click-modal="false" title="添加产品" :visible.sync="addTask" width="600px">
          <div slot="title">
            <span class="el-dialog__title">添加任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <!-- <span class="dialogTips">
            <span v-if="platformId==1?true:false" style="position:relative;left:10px;"> 温馨提示，多个关键词和产品ASIN用换行或逗号分隔</span>
            <span v-if="platformId==1?false:true" style="position:relative;left:10px;"> 温馨提示，多个关键词和产品ID用换行或逗号分隔</span>
          </span> -->
          <div class="box __box_wrapper">
            <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%;">
              <el-form-item label="关键词: " prop="keywords" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="textarea" v-model="form.keywords" style="width:100%;" :rows="4" placeholder="多个关键词用换行或逗号分隔（1-20个）" />
                <div class="_fontSize" v-model="fontSum1">已输入 {{fontSum1||0}} 个</div>
              </el-form-item>

              <el-form-item v-if="platformId==1?true:false" label="产品ASIN:" prop="skus" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="input" v-model.trim="form.skus" placeholder="请输入产品ASIN" style="width:100%;" />
              </el-form-item>

              <el-form-item v-if="platformId==1?false:true" label="产品ID:" prop="skus" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="input" v-model.trim="form.skus" placeholder="请输入产品ID" style="width:100%;" />
              </el-form-item>

              <el-form-item label="任务名称:" :label-width="formLabelWidth" prop="taskName" style="width:100%;">
                <el-input v-model.trim="form.taskName" style="width:100%;" placeholder="最多输入30个字符" maxlength="30" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-checkbox v-model="form.monitorFlag">是否添加监控</el-checkbox>
              </el-form-item>
              <el-form-item prop="monitorTimeAry" :label-width="formLabelWidth" style="width:100%;" v-if='form.monitorFlag'>
                <el-date-picker unlink-panels :picker-options="pickerOptions1" :label-width="formLabelWidth" class="el-date-wrapper" style="width:100%" v-model="form.monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <!-- 监控频率 -->
              <el-form-item v-if='form.monitorFlag' label="监控频率:" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="text" v-model="form.frequency" style="width:90%;" placeholder="请输入10-1440之间的整数" />
                <span>分钟</span>
              </el-form-item>
              <!-- 确定 -->
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="showPoint('ruleForm')" :loading="buttonLoading.add">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 添加监控 todonow-->
        <el-button type="success" @click="showAddMonitoring('add')">添加监控</el-button>
        <el-button type="success" @click="showAddMonitoring('change')">修改监控周期</el-button>
        <el-dialog :close-on-click-modal="false" :title="dialogShow.title" :visible.sync="dialogShow.dialogShow" width="600px">
          <div class="__box_wrapper">
            <!-- 添加/修改监控弹窗 todoh-->
            <el-form :model="dialogDate" :rules="rules_addmoni" ref="ruleForm_addmoni" style="width:100%;">
              <!-- 监控起止时间 -->
              <el-form-item label="监控时间:" prop="addMonitorDateValue" :label-width="formLabelWidth" style="width:100%;">
                <div class="block" style="width:100%;">
                  <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions1" v-model="dialogDate.addMonitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-form-item>
              <!-- 监控频率 -->
              <el-form-item label="监控频率:" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="text" v-model="dialogDate.frequency" style="width:90%;" placeholder="请输入10-1440之间的整数" />
                <span>分钟</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-button :loading="buttonLoading.addmonitor" type="primary" style="width:100%;" @click="addChartMoni('ruleForm_addmoni')">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <el-button type="success" plain @click="sureCancelMonitor ">取消监控</el-button>
        <el-button style="margin-left:0" type="success" plain @click="deleteKeywordRankingList">删除</el-button>
      </el-row>
      <el-row style="margin-top:8px;margin-bottom: 8px;height:30px" type="flex" justify="space-between">
        <!-- 输入框 关键词输入 -->
        <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
          <el-input placeholder="请输入任务名称" v-model="searchListData.taskName" clearable style='max-width:150px;' clearable>
          </el-input>
          <el-input v-if="platformId==1?true:false" placeholder="ASIN" v-model="searchListData.sku" clearable style='max-width:120px;' clearable>
          </el-input>
          <el-input v-if="platformId==1?false:true" placeholder="产品ID" v-model="searchListData.sku" clearable style='max-width:120px;' clearable>
          </el-input>
          <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" :loading="searchLoading" @click="searchKeywordRankingAndAsin">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" :loading="searchLoading" @click="searchKeywordRankingAndAsin">搜索</el-button>
        </el-col>
        <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
          <el-date-picker unlink-panels :label-width="formLabelWidth" value-format="yyyy-MM-dd" @change="newTime" clearable class="el-date-wrapper" style="width:53%;max-width:240px" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-radio-group v-model="tabPosition" @change="currentTimeData">
            <el-radio-button label="1">今日</el-radio-button>
            <el-radio-button label="7">7天</el-radio-button>
            <el-radio-button label="30">30天</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="getWordRankingLists" tooltip-effect="dark" class="tableBox" @selection-change="handleSelectionChange" slot-scope="">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" align='center' :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column v-if="platformId==1?true:false" prop="sku" label="ASIN" align='center' width="120">
        </el-table-column>
        <el-table-column v-if="platformId==1?false:true" prop="sku" label="产品ID" align='center' width="120">
        </el-table-column>
        <el-table-column label="标题" align='center' class="status ">
          <template slot-scope="scope">

            <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title | _formatData}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.title">
              <div class="fix__row_2">
                {{scope.row.title | _formatData}}
              </div>
            </el-tooltip>

          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创始时间" align='center' class="status">
        </el-table-column>
        <el-table-column prop="monitorFlag" label="监控状态" align='center' class="status" width="80px">
          <template slot-scope="scope">

            {{ scope.row.monitorFlag==1&&scope.row.monitorFlag!==""?'开启':scope.row.monitorFlag===0?'关闭':""}} </template>
        </el-table-column>

        <el-table-column prop="frequency" label="监控频率" align='center' width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.frequency">{{scope.row.frequency}}分钟/次</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="monitorFrom" label="监控开始时间" align='center' class="status" width="120px">
          <template slot-scope="scope">
            {{scope.row.monitorFrom?scope.row.monitorFrom:"-"}}
          </template>
        </el-table-column>

        <el-table-column prop="monitorTo" label="监控结束时间" align='center' class="status" width="120px">
          <template slot-scope="scope">
            {{scope.row.monitorTo?scope.row.monitorTo:"-"}}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" align='center' class="status" width="120px">
          <template slot-scope="scope">
            {{ scope.row.status===2?"抓取成功":scope.row.status===0?"抓取中...":scope.row.status===1?"抓取中...":scope.row.status!==0||scope.row.status!==1||scope.row.status!==2?"抓取失败":"--" }}
          </template>
        </el-table-column>
        <el-table-column prop="webRank" label="PC排名" align='center' class="status" width="130px">
          <template slot-scope="scope" v-if="scope.row.status === 2">
            <!-- <span style="vertical-align: middle;font-weight: bolder;">
              {{ scope.row.webRank | _formatData2 }}
            </span> -->

            <el-button v-if="scope.row.status ===2" type="text" @click="showChart(scope,1)"> <img src="~@/assets/images/brokenLineImg.png" style="width:25px;height:25px;vertical-align: middle;" /></el-button>
          </template>
        </el-table-column>

        <el-table-column prop="appRank" label="APP排名" align='center' class="status" width="130px">
          <template slot-scope="scope" v-if="scope.row.status === 2">

            <!-- <span style="vertical-align: middle;font-weight: bolder;">
              {{ scope.row.appRank | _formatData2 }}
            </span> -->
            <el-button v-if="scope.row.status ===2" type="text" @click="showChart(scope,2)"><img src="~@/assets/images/brokenLineImg.png" style="width:25px;height:25px;vertical-align: middle;" /></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style='margin-top:20px;'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <!-- 一 -->
      <el-dialog :close-on-click-modal="false" :title="chartData.title" :visible.sync="pcMonitoringData" height='505px' width="950px" @close="closeDialog">
        <rankChart :chartData.sync="chartData" ref="child"></rankChart>
      </el-dialog>
    </section>
    <el-point :data="pointData"></el-point>
  </div>
</template>

<script >
// 二
import rankChart from "@/components/common/rankChart";
import { isDisabled, Trim, getDay } from "@/api/functions";
/* eslint-disable */
// json 假数据
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  // 三
  components: {
    rankChart
  },
  data() {
    // 自定义校验关键词
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
      if (val.length > 20) {
        callback(new Error("输入数量不能超过20个"));
      } else {
        callback();
      }
    };
    // 自定义校验SKU
    var validateSku = (rule, value, callback) => {
      if (!value) {
        callback(new Error("输入不能为空"));
        return;
      }
      if (value == null || value == undefined) return;
      let val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      this.skusArr = val;
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/;
      let changePlatformd = this.$store.state.common.savePlatformIdAndSiteId.split(
        ","
      )[0];
      let str = "ASIN须为10位数，纯数字或大写字母和数字的组合";
      if (changePlatformd == 2) {
        reg = /^[0-9]{12,12}$/;
        str = "请输入12位纯数字";
      } else if (changePlatformd == 3) {
        reg = /^(?!_)(?!.*?_$)[0-9_]+$/;
        str = "请输入纯数字，允许下划线";
      } else if (changePlatformd == 4) {
        reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]{24}$/;
        str = "长度24位，须小写字母与纯数字的组合";
      } else if (changePlatformd == 5) {
        reg = /^[0-9]*$/;
        str = "请输入纯数字";
      }
      if (!val.every(el => reg.test(el))) {
        callback(new Error(str));
      } else if (
        val.some(el => regEn.test(el)) ||
        val.some(el => regCn.test(el))
      ) {
        callback(new Error("不能包含特殊字符"));
      } else if (val.length > 500) {
        callback(new Error("输入数量不能超过500个"));
      } else {
        callback();
      }
    };
    // 自定义监控频率
    var validateFrequency = (rule, value, callback) => {
      value = Trim(value, "g");
      value = +value;
      if (/^[0-9]*$/.test(value) === false) {
        callback(new Error("请输入整数"));
      } else if (value < 10 || value > 1440) {
        callback(new Error("请输入10-1440之间的整数"));
      } else {
        callback();
      }
    };
    return {
      // todonow
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      buttonLoading: {
        add: false,
        addmonitor: false,
        changemonitor: false
      },
      dialogShow: {
        title: "",
        dialogShow: false,
        dialogMonitorType: "",
        submitMonitoringLoading: false
      },
      isDisabled: true,
      // 画图需要的数据 四
      chartData: {
        chartShow: true,
        title: "",
        taskId: "",
        type: "",
        monitorFrom: "",
        monitorTo: "",
        itemType: ""
      },
      searchListData: {},
      searchLoading: false,
      // fontSum1: null,
      fontSum2: null,
      title: null,
      keywordsArr: [],
      skusArr: [],
      loading: false,
      // 定义添加监控只能是今日之后
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      monitorTimeAry: [], //选择时间
      surplusAmount: null, //剩余点数
      charge: null, //点数
      pageSize: 10,
      total: null, //总条数
      pageNumber: 1,
      tabPosition: "", //当前时间
      getWordRankingLists: [
        // {
        //   title: "测试数据，上线注释",
        //   monitorFlag: 1,
        //   status: 2,
        //   taskId: 1459
        // }
      ],
      monitorType: "", //定义状态，传状态给提交
      userSelect: [],
      pcMonitoringData: false,
      appMonitoringData: false,
      dialogLoading: false,
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
      form2: {
        date: []
      },
      startTime: null,
      endTime: null,
      //关键词排名的变量
      form: {
        frequency: "",
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        keywords: null,
        skus: null,
        monitorFlag: false,
        monitorFrom: null,
        monitorTo: null,
        monitorTimeAry: [],
        taskName: ""
      },
      taskIds: [],
      rules: {
        keywords: [
          {
            required: true,
            validator: validateKeyword,
            trigger: ["blur", "change"]
          } //限定输入的个
        ],
        skus: [
          {
            required: true,
            // message: this.platformId == 1 ? "请输入产品ASIN" : "请输入产品ID",
            message: "输入不能为空",
            trigger: ["blur", "change"]
          },
          // { min: 1, max: 500, message: "最多只能输入500个字符", trigger: "blur" },
          { validator: validateSku, trigger: ["blur", "change"] } //限定输入的个数
        ],
        monitorTimeAry: [
          {
            required: true,
            message: "请选择监控起始时间",
            trigger: ["blur", "change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-1440）",
            trigger: ["blur", "change"]
          },
          { validator: validateFrequency, trigger: ["blur", "change"] } //限定输入的个数
        ],
        taskName: [
          {
            required: false,
            max: 30,
            message: "任务名称(30个字符以内)",
            trigger: ["blur", "change"]
          }
        ]
      },
      // 日期
      dialogDate: {
        frequency: "",
        addMonitorDateValue: "",
        changeMonitorDateValue: ""
      },
      rules_addmoni: {
        addMonitorDateValue: [
          {
            required: true,
            message: "请选择监控起始时间",
            trigger: ["blur"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-1440）",
            trigger: ["blur"]
          },
          { validator: validateFrequency, trigger: ["blur"] } //限定输入的个数
        ]
      },
      formLabelWidth: "90px",
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
    // this.getkeywordRankingListApi();//请求列表
    // this.monitorTimeAry.push(this.getBeforeTime(30), this.getBeforeTime(0));
    this.getkeywordApi();
    this.getPointeApi(); //请求站点;
  },
  mounted() {
    let vm = this;
    // console.log(this.$route, "111");
    // console.log(this.$router, "222");
  },
  computed: {
    // getWordRankingLists

    ...mapState("anking", {
      // getWordRankingLists: state => state.keywordRankings,
      addKeywordRankingTasks: state => state.keywordRankingTasks
    }),
    // 及时更新Id
    platformId() {
      return this.$store.state.common.savePlatformIdAndSiteId.split(",")[0];
    },
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
          this.getkeywordApi();
        }
      },
      deep: true
    },
    // platformId(val) {
    //   this.getkeywordApi({ platformId: val });
    // },
    tabPosition(val) {
      // console.log(val, "监听的时间");
    },
    skusArr(val) {
      if (val.length) {
        this.fontSum2 = val.length;
      } else {
        this.fontSum2 = null;
      }
    }
  },
  filters: {
    _format(val, scope) {
      // console.log(val);
      if (scope.row.status !== 2) {
        return "";
      } else {
        return val;
      }
    }
  },
  methods: {
    _formatter(m, n, i) {
      // console.log(m, n, i);
      return m.status !== 2 ? "" : i;
    },
    // 请求扣点 排名查询，关键词排名扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/keywordRank/list").then(res => {
        if (res.data.code == 0) {
          this.surplusAmount = res.data.data.surplusAmount;
          this.charge = res.data.data.charge;
        }
        // if (res.data.code == 500) {
        //   this.$message.error(res.data.msg);
        //   return;
        // }
      });
    },

    test(row, column, cellValue, index) {
      if (cellValue == null) {
        return "ceshi";
      }
    },

    newLists1(e) {
      if (e === "" || e == null) {
        this.getkeywordApi(); //关键词竞争分析列表
      }
    },
    newLists2(e) {
      if (e === "" || e == null) {
        this.getkeywordApi(); //关键词竞争分析列表
      }
    },
    newLists3() {
      this.getkeywordApi(); //自由时间选择
    },
    ...mapActions("anking", [
      // "getkeywordRankingListApi",
      "addKeywordRankingTaskApi"
    ]),

    // 请求列表
    getkeywordApi(param = {}) {
      // debugger;
      this.loading = true;
      const { pageSize, pageNumber } = this;
      let startTime = this.monitorTimeAry ? this.monitorTimeAry[0] : "";
      let endTime = this.monitorTimeAry ? this.monitorTimeAry[1] : "";
      let adFlag = 0;
      let params = this.$.dealObjectValue({
        pageSize,
        pageNumber,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        ...this.searchListData,
        startTime,
        endTime,
        adFlag,
        ...param
      });
      this.$axios.post("/TaskKeywordRank/list", params).then(res => {
        this.searchLoading = false;
        this.loading = false;
        const { pageNo, pageSize, total, rows } = res.data;
        if (res.data.code === 500) {
          this.$.showError(res);
          return;
        }
        if (rows && rows.length >= 0) {
          this.pageSize = pageSize;
          this.pageNumber = pageNo;
          this.total = total;
          this.getWordRankingLists = rows;
        } else if (!rows) {
          this.getWordRankingLists = rows;
          this.total = 0;
        }
      });
    },
    // 改变每页显示的条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getkeywordApi();
    },
    //分页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNumber = val;
      this.getkeywordApi();
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

    // 根据时间选择列表
    currentTimeData() {
      this.pageSize = 10;
      this.pageNumber = 1;
      let a = Number(this.tabPosition);
      // console.log("x");
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
      return this.getkeywordApi({
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      });
    },

    //自由选择时间 刷新列表todom
    newTime(val) {
      this.pageSize = 10;
      this.pageNumber = 1;
      const { $ } = this;
      if (!val) {
        this.tabPosition = null;
        return this.getkeywordApi();
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

      return this.getkeywordApi();
    },

    //排名todom 五
    showChart(scope, type) {
      // 日期
      // this.chartData.date = [getDay().today, getDay().today];
      this.pcMonitoringData = true;
      // console.log(scope, 111);
      if (type == 1) {
        this.chartData.title = "自然搜索PC排名";
      }
      if (type == 2) {
        this.chartData.title = "自然搜索APP排名";
      }
      // this.chartData.monitorFrom = scope.row.monitorFrom.slice(0, 10);
      // this.chartData.monitorTo = scope.row.monitorTo.slice(0, 10);
      this.chartData.taskId = scope.row.taskId;
      this.chartData.type = type;
      this.chartData.itemType = 1;
      this.chartData.url = "/TaskKeywordRankRtItem/list";
      this.chartData.keywords = scope.row.keywords;
      // console.log(this.$refs);
      this.$nextTick(() => {
        this.$refs.child.showChartChild(
          this.chartData.taskId,
          this.chartData.type
        );
      });
    },
    // 关闭弹窗时调用子组件方法清空日期 六
    closeDialog() {
      this.$refs.child.clearDate();
    },
    //  点击添加任务按钮  关键词排名添加任务数据初始为空 关键词、ASIN/监控状态、弹窗
    onaddTask() {
      this.form.frequency = "";
      this.form.keywords = null;
      this.form.skus = null;
      this.form.monitorFlag = false;
      this.form.monitorFrom = null;
      this.form.monitorTo = null;
      this.form.monitorTimeAry = [];
      this.form.taskName = "";
      this.addTask = true;
      this.keywordsArr = [];
    },
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务 提交
    addTaskSubmit(formName, point) {
      var _this = this;
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
            )[0],
            keywords: [...new Set(this.keywordsArr)],
            skus: [...new Set(this.skusArr)],
            monitorFlag: this.form.monitorFlag ? 1 : 0,
            taskName: this.form.taskName,
            frequency: this.form.frequency !== "" ? +this.form.frequency : ""
          };
          params = this.$.dealObjectValue(params);
          if (params.monitorFlag == 0) {
            this.addMonitoring(params, point);
          } else {
            // if (
            //   this.form.monitorTimeAry != null &&
            //   this.form.monitorTimeAry.length
            // ) {
            let time = {
              monitorFrom: this.form.monitorTimeAry[0],
              monitorTo: this.form.monitorTimeAry[1]
            };
            this.addMonitoring({ ...params, ...time }, point);
            // } else {
            //   this.$message({
            //     message: "请选择时间",
            //     type: "warning"
            //   });
            // }
          }
        }
      });
    },
    addMonitoring(params, point) {
      this.buttonLoading.add = true;
      // 扣点按钮loading pointData
      if (point === undefined) {
        this.pointData.loading = true; // 关闭扣点按钮loading
      }
      this.$axios.post("/TaskKeywordRank/save", params).then(res => {
        this.buttonLoading.add = false;
        // 扣点弹窗
        if (point === 0) {
          if (res.data.code == 0) {
            this.pointData.show = true;
            this.pointData.point = res.data.data + "点";
            this.pointData.formName = "ruleForm";
            this.pointData.func = this.addTaskSubmit;
          } else if (res.data.code === 500) {
            this.$message.error(res.data.msg);
          }
          return;
        }
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.addTask = false;
          this.form.monitorFlag = false;
          this.form.monitorTimeAry = null;
          this.form.keywords = null;
          this.form.skus = null;
          this.form.monitorFlag = false;
          this.form.monitorFrom = null;
          this.form.monitorTo = null;
          this.form.monitorTimeAry = [];
          this.$nextTick(() => {
            this.pointData.show = false; // 关闭扣点弹窗 pointData
            this.pointData.loading = false; // 关闭扣点按钮loading
          });
          if (point === undefined) {
            this.reloadPointApi(); // 重新获取点数
            this.getkeywordApi();
          }
        } else if (res.data.code === 500) {
          this.$nextTick(() => {
            this.pointData.loading = false; // 关闭扣点按钮loading
          });
          this.$message.error(res.data.msg);
        }
      });
    },
    getDate() {
      let date = new Date();
      let year = date.getFullYear(); //获取当前年份
      let mon = date.getMonth() + 1; //获取当前月份
      let day = date.getDate(); //获取当前日
      return (
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    // todonow
    // 添加/修改监控
    showAddMonitoring(type) {
      if (this.userSelect == "") {
        // if (type == "add") {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
        return;
      }
      if (type == "add") {
        // 此变量判断是否有未开启监控的选项
        let isAllInMonitor = true;
        for (let i = 0; i < this.userSelect.length; i++) {
          // console.log(this.tableHandle.multipleSelection[i]);
          if (this.userSelect[i].monitorFlag == 0) {
            // 只有要一项未开启，设置isAllInMonitor为否，下面则可以开启添加监控弹窗
            isAllInMonitor = false;
          }
        }
        if (isAllInMonitor === true) {
          this.$message({
            showClose: true,
            message: "选中项都处于监控，不能重复添加",
            type: "warning"
          });
          return;
        }
      }
      // 1
      if (type == "add") {
        this.dialogShow.title = "添加监控";
        this.dialogDate.frequency = "";
        this.dialogDate.addMonitorDateValue = [];
      } else {
        this.dialogShow.title = "修改监控周期";
        // 2
        if (
          this.userSelect.length === 1 &&
          this.userSelect[0].monitorFlag === 1
        ) {
          // 修改监控，只选中一条默认带上
          // console.log(this.userSelect, "修改监控一项");
          if (
            this.userSelect[0].frequency != null &&
            this.userSelect[0].frequency !== ""
          ) {
            this.dialogDate.frequency = this.userSelect[0].frequency + "";
          }
          if (this.userSelect[0].monitorFrom && this.userSelect[0].monitorTo) {
            this.dialogDate.addMonitorDateValue = [
              this.userSelect[0].monitorFrom,
              this.userSelect[0].monitorTo
            ];
          }
        } else {
          this.dialogDate.frequency = "";
          this.dialogDate.addMonitorDateValue = [];
        }
        // 2 end
      }
      // end
      this.dialogShow.dialogShow = true;

      this.dialogShow.dialogMonitorType = type;
    },
    // 添加，修改监控 pointData
    addChartMoni(formName) {
      this.submitMonitoring(formName, 0);
    },
    submitMonitoring(formName, point) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let type = this.dialogShow.dialogMonitorType;
          let monitoringUrl;
          if (type == "add") {
            monitoringUrl = "/TaskKeywordRank/addMonitor";
          }
          if (type == "change") {
            monitoringUrl = "/TaskKeywordRank/updateMonitor";
          }
          let taskIds = [];
          this.userSelect.forEach((item, index) => {
            taskIds.push(item.taskId);
          });
          let params = {
            type: point,
            taskIds: taskIds,
            monitorFrom: this.dialogDate.addMonitorDateValue[0],
            monitorTo: this.dialogDate.addMonitorDateValue[1],
            frequency: +this.dialogDate.frequency
          };
          params = this.$.dealObjectValue(params);
          this.buttonLoading.addmonitor = true;
          // 扣点按钮loading pointData
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          this.$axios
            .post(monitoringUrl, params)
            .then(res => {
              this.buttonLoading.addmonitor = false;
              // 扣点弹窗
              if (point === 0) {
                if (res.data.code == 0) {
                  this.pointData.show = true;
                  this.pointData.point = res.data.data + "点";
                  this.pointData.formName = "ruleForm_addmoni";
                  this.pointData.func = this.submitMonitoring;
                } else if (res.data.code === 500) {
                  this.$message.error(res.data.msg);
                }
                return;
              }
              // console.log("添加监控/修改接口响应", res.data);
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                this.dialogShow.dialogShow = false;
                this.$nextTick(() => {
                  this.pointData.show = false; // 关闭扣点弹窗 pointData
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                if (point === undefined) {
                  this.reloadPointApi();
                  this.getkeywordApi(); // 添加产品后重新发起请求
                }
              } else if (res.data.code === 500) {
                this.$nextTick(() => {
                  this.buttonLoading.add = false;
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(err => {
              // console.log("添加、修改监控失败", err);
            });
        }
      });
    },
    //取消监控
    sureCancelMonitor() {
      if (this.userSelect.length) {
        // 此变量判断是否有未开启监控的选项
        let isAllInMonitor = false;
        for (let i = 0; i < this.userSelect.length; i++) {
          if (this.userSelect[i].monitorFlag == 1) {
            // 只有要一项未开启，设置isAllInMonitor为否，下面则可以开启添加监控弹窗
            isAllInMonitor = true;
          }
        }
        if (isAllInMonitor === false) {
          this.$message({
            showClose: true,
            message: "选中项都未开启监控，不需要取消",
            type: "warning"
          });
          return;
        }
        ///
        this.$confirm("此操作将取消监控选中项?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.cancelMonitor();
          })
          .catch(() => {});
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    cancelMonitor() {
      let dele = [];
      let listTime = [];
      let keywordTime = [];
      if (this.userSelect.length) {
        this.userSelect.forEach(item => {
          // console.log(item.taskId);
          dele.push(item.taskId);
          keywordTime.push(item.keyword);
          listTime.push(item.monitorTo);
          // if (item.monitorFlag == 0) {
          //   this.$message({
          //     showClose: true,
          //     message: "没有添加监控",
          //     type: "error"
          //   });
          // }
        });
        let params = {
          taskIds: dele
        };
        // console.log(params, "111");
        this.$axios.post("/TaskKeywordRank/removeMonitor", params).then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.getkeywordApi(); //刷新列表
            return;
          } else if (res.data.code === 500) {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      }
    },
    //删除关键词排名列表
    deleteKeywordRankingList() {
      if (this.userSelect.length) {
        //  this.taskIds = []
        // console.log(this.taskIds);
        // let a = this.taskIds;
        // let s = new Set(a);
        // let result = Array.from(s);
        // console.log(result, "222");
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
              .post("TaskKeywordRank/remove", { taskIds: arr })
              .then(res => {
                if (res.data.code == 0) {
                  //成功返回的数据
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.pageNumber = 1;
                  this.getkeywordApi();
                  this.taskIds = [];
                  return;
                }
                if (res.data.code == 500) {
                  this.$message.error(res.data.msg);
                  this.taskIds = [];
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
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },

    //搜索 关键词和ASIN
    searchKeywordRankingAndAsin() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getkeywordApi();
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
      // console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    // table的查看
    handleClick(index, rowDetail) {
      // console.log(index, rowDetail);
    }
  }
};
</script>
<style scoped>
.fontSizeBox1 {
  position: relative;
}
.fontSize1 {
  position: absolute;
  z-index: 10000;
  left: 420px;
  top: -12px;
  color: #30cca5;
  font-size: 12px;
}
.fontSizeBox2 {
  position: relative;
}
.fontSize2 {
  position: absolute;
  z-index: 10000;
  left: 420px;
  top: -12px;
  color: #30cca5;
  font-size: 12px;
}
.titleStyle {
  display: inline;
  /* width: 100px; */
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 2; /** 显示的行数 **/
  overflow: hidden; /** 隐藏超出的内容 **/
}
.box {
  position: relative;
}

.tableBox {
  width: 100%;
}

.el-popper[x-placement^="bottom"] {
  position: fixed !important;
  top: 220px !important;
  left: 627px !important;
  z-index: 2031;
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
/* .el-dialog__footer {
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 80px 30px 83px;
} */
.el-dialog__title {
  line-height: 24px;
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

.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: orange;
  background-color: #fff;
  border-color: orange;
  -webkit-box-shadow: -1px 0 0 0;
  box-shadow: -1px 0 0 0;
  position: relative;
}
</style>
