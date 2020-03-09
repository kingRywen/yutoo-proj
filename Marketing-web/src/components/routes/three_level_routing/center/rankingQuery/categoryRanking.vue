<template>

  <div class='categoryRanking __wrapper_i'>
    <section class="parentPosition">
      <el-row class='paddingBobbtom'>
        <!-- 添加任务 -->
        <el-button type="success" @click="onaddCategoryRankingTask">添加任务</el-button>
        <!-- 添加任务弹窗 -->
        <el-dialog :close-on-click-modal="false" title="添加产品" :visible.sync="addCategoryRankingTask" width="600px">
          <div slot="title">
            <span class="el-dialog__title">添加任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <span class="dialogTips">
            <span v-if="platformId==1?true:false" style="position:relative;left:-4px;"> 温馨提示，多个产品ASIN用换行或逗号分隔</span>
            <span v-if="platformId==1?false:true" style="position:relative;left:-4px;"> 温馨提示，多个产品ID用换行或逗号分隔</span>
          </span>
          <div class="box __box_wrapper">
            <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%;">
              <el-form-item label="类目:" :label-width="formLabelWidth" prop="category" style="width:100%;">
                <el-cascader v-loading="loadingCas" placeholder="可以输入或者点击选择" :options="skuListw" @active-item-change="handleItemChange" @change="model_change" v-model="form.category" :props="props" style=" width:100%;"></el-cascader>
              </el-form-item>
              <el-form-item v-if="platformId==1?true:false" label="产品ASIN:" prop="sku" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="textarea" v-model="form.sku" :rows="4" placeholder="多个产品ASIN换行输入（1-500个）" style="width:100%;" />
                <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
              </el-form-item>

              <el-form-item v-if="platformId==1?false:true" label="产品ID:" prop="sku" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="textarea" v-model="form.sku" :rows="4" placeholder="多个产品ID换行输入（1-500个）" style="width:100%;" />
                <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
              </el-form-item>

              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-checkbox v-model="form.monitorFlag">是否添加监控</el-checkbox>
              </el-form-item>
              <el-form-item prop="monitorTimeAry" :label-width="formLabelWidth" style="width:100%;" v-if='form.monitorFlag'>
                <el-date-picker unlink-panels :picker-options="pickerOptions2" :label-width="formLabelWidth" class="el-date-wrapper" style="width:100%" v-model="form.monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <!-- 监控频率todoh -->
              <el-form-item v-if='form.monitorFlag' label="监控频率:" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="text" v-model="form.frequency" style="width:90%;" placeholder="请输入10-1440之间的整数" />
                <span>分钟</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="showPoint('ruleForm')" :loading="buttonLoading.add">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 添加监控 修改监控周期 -->
        <el-button type="success" @click="showAddMonitoring('add')">添加监控</el-button>
        <el-button type="success" @click="showAddMonitoring('change')">修改监控周期</el-button>
        <!-- 添加监控弹窗 -->
        <el-dialog :close-on-click-modal="false" :title="dialogShow.title" :visible.sync="dialogShow.dialogShow" width="600px">
          <div class="__box_wrapper">
            <!-- <el-form :model="form" style="width:100%">
              <el-form-item style="width:100%;padding-bottom:10px;">
                <el-date-picker  unlink-panels v-model="categoryAddMonitorList.date" :picker-options="pickerOptions2" :label-width="formLabelWidth" class="el-date-wrapper" style="width:350px;margin-left:46px;" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item style="width:100%;">
                <div style="width:100%;text-align: center">
                  <el-button type="primary" v-loading="dialogShow.submitMonitoringLoading" @click="submitMonitoring" style="width:280px">确认</el-button>
                </div>
              </el-form-item> -->
            <!-- 添加/修改监控弹窗 todoh-->
            <el-form :model="dialogDate" :rules="rules_addmoni" ref="ruleForm_addmoni" style="width:100%;">
              <!-- 监控起止时间 -->
              <el-form-item label="监控时间:" prop="addMonitorDateValue" :label-width="formLabelWidth" style="width:100%;">
                <div class="block" style="width:100%;">
                  <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions2" v-model="dialogDate.addMonitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
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
            </el-form>
          </div>
        </el-dialog>
        <el-button type="success" plain @click="sureCancelMonitor()">取消监控</el-button>
        <el-button type="success" plain @click="deleteCategoryList()">删除</el-button>
      </el-row>
      <!-- 布局 -->
      <el-row style="margin-top:8px;margin-bottom: 8px;height:30px" type="flex" justify="space-between">
        <!-- 输入框 关键词输入 -->
        <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
          <el-input placeholder="请输入类目查询" v-model.trim="searchListData.category" clearable style='max-width:150px;'>
          </el-input>
          <!-- 输入框 关键词输入 -->
          <el-input v-if="platformId==1?true:false" placeholder="ASIN" v-model.trim="searchListData.sku" clearable style='max-width:120px;'>
          </el-input>
          <el-input v-if="platformId==1?false:true" placeholder="产品ID" v-model.trim="searchListData.sku" clearable style='max-width:120px;'>
          </el-input>
          <!-- 搜索按钮 -->
          <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" :loading="searchLoading" @click="cearchCategoryOrSku">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" :loading="searchLoading" @click="cearchCategoryOrSku">搜索</el-button>
        </el-col>
        <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
          <el-date-picker unlink-panels :label-width="formLabelWidth" value-format="yyyy-MM-dd" clearable @change="newTime" class="el-date-wrapper" style="width:53%;max-width:240px" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-radio-group v-model="tabPosition" @change="currentTimeData" class="timeStyleBox">
            <el-radio-button label="1">今日</el-radio-button>
            <el-radio-button label="7">7天</el-radio-button>
            <el-radio-button label="30">30天</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="getCategoryRankingLists" tooltip-effect="dark" class="tableBox" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="category" label="类目" align='center'>
          <template slot-scope="scope">
            <div class="fix__row_2" v-if="scope.row.category === '' || scope.row.category == null">{{scope.row.category | _formatData}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.category">
              <div class="fix__row_2">
                {{scope.row.category|_formatData_cate}}
              </div>
            </el-tooltip>

          </template>
        </el-table-column>
        <el-table-column v-if="platformId==1?true:false" prop="sku" label="ASIN" align='center' width="120">
        </el-table-column>
        <el-table-column v-if="platformId==1?false:true" prop="sku" label="产品ID" align='center' width="120">
        </el-table-column>
        <el-table-column prop="title" label="标题" align='center'>
          <template slot-scope="scope">
            <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title | _formatData}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.title">
              <div class="fix__row_2">
                {{scope.row.title | _formatData}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创始时间" align='center'>
        </el-table-column>
        <el-table-column prop="monitorFlag" label="监控状态" align='center' width="80px">

          <template slot-scope="scope">

            {{ scope.row.monitorFlag==1&&scope.row.monitorFlag!==""?'开启':scope.row.monitorFlag===0?'关闭':""}} </template>
        </el-table-column>
        <el-table-column prop="frequency" label="监控频率" align='center' width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.frequency">{{scope.row.frequency}}分钟/次</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="monitorFrom" label="监控开始时间" align='center' width="120px">
          <template slot-scope="scope">
            {{scope.row.monitorFrom?scope.row.monitorFrom:"-"}}
          </template>
        </el-table-column>

        <el-table-column prop="monitorTo" label="监控结束时间" align='center' width="120px">
          <template slot-scope="scope">
            {{scope.row.monitorTo?scope.row.monitorTo:"-"}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align='center' class="status" width="120px">
          <template slot-scope="scope">
            {{ scope.row.status===2?"抓取成功":scope.row.status===0?"抓取中...":scope.row.status===1?"抓取中...":scope.row.status!==0||scope.row.status!==1||scope.row.status!==2?"抓取失败":"--" }}
          </template>
        </el-table-column>
        <el-table-column prop="webRank" label="PC排名" align='center' width="130px">
          <template slot-scope="scope" v-if="scope.row.status === 2">
            <span v-if="scope.row.webRank !==null&&scope.row.webRank!==0" style="vertical-align: middle;font-weight: bolder;">
              {{ scope.row.webRank | _formatData2 }}
            </span>

            <el-button v-if="scope.row.status ===2" type="text" @click="showChart(scope,1)"> <img src="~@/assets/images/brokenLineImg.png" style="width:25px;height:25px;vertical-align: middle;" @click="pcRankingMonitoringTable = true"></el-button>
          </template>
        </el-table-column>
        <!-- APP排名图表 -->

        <el-table-column prop="appRank" label="APP排名" align='center' width="130px">
          <template slot-scope="scope" v-if="scope.row.status === 2">

            <span v-if="scope.row.appRank !==null&&scope.row.appRank!==0" style="vertical-align: middle;font-weight: bolder;">
              {{ scope.row.appRank | _formatData2 }}
            </span>

            <el-button v-if="scope.row.status ===2" type="text" @click="showChart(scope,2)"> <img src="~@/assets/images/brokenLineImg.png" alt="" style="width:25px;height:25px;vertical-align: middle;"></el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style='margin-top:20px;'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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

<script scoped>
// 二
import rankChart from "@/components/common/rankChart";
import { isDisabled, Trim, getDay } from "@/api/functions";
// 引入基本模板
/* eslint-disable */
var echart = require("echarts");
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  // 三
  components: {
    rankChart
  },
  data() {
    // todonow
    var category_validate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择类目"));
      } else {
        this.$nextTick(() => {
          if (this.form.haveChildren !== 0) {
            callback(new Error("请选择最后一级类目"));
          } else {
            callback();
          }
        });
      }
    };
    var validateSku = (rule, value, callback) => {
      if (!value) {
        this.skusArr = [];
        callback(new Error("输入不能为空"));
        return;
      } else {
        // if (value == null || value == undefined) return;
        let val = value
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== "");
        this.skusArr = val;

        let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi;
        let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
        // let reg = /^[A-Z0-9]{10}$/;
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
      // 日期
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
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
            trigger: ["change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-1440）",
            trigger: ["blur", "change"]
          },
          { validator: validateFrequency, trigger: ["blur", "change"] } //限定输入的个数
        ]
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
      loadingCas: false,
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
      searchLoading: false,
      searchListData: {},
      fontSum: 0,
      title: null,
      skusArr: [],
      loading: true,
      // 定义添加监控只能是今日之后
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pcMonitoringData: false,
      appMonitoringData: false,
      dialogLoading: false,
      surplusAmount: null, //剩余点数
      charge: null, //点数
      monitorTimeAry: [], //时间选择器
      pageNumber: 1, //页数
      total: null, //总条数
      pageSize: 10,
      getCategoryRankingLists: [
        // {
        //   title: "测试数据，上线注释",
        //   monitorFlag: 1,
        //   status: 2,
        //   taskId: 1459
        // }
      ], //定义列表的数据

      //图表弹窗
      monitorType: "", //定义个值，接收添加监控还是修改监控的状态
      pcSkuList: false,
      appSkuList: false,
      userSelect: [],
      addCategoryMonitor: false, //  添加监控弹窗
      formLabelWidth: "100px", //定义宽度
      categoryAddMonitorList: {
        date: []
      },
      taskIds: [],
      skuList: {
        category: null,
        sku: null
      },
      skuListw: [], //定义添加任务的类目类别
      //  appshowChart: false,
      input4: "",
      checked: false,
      addCategoryRankingTask: false,
      form: {
        frequency: "",
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        category: [],
        sku: null,
        monitorFlag: null,
        monitorFrom: null,
        monitorTo: null,
        monitorTimeAry: [],
        categoryId: null,
        haveChildren: ""
      },
      rules: {
        category: [
          { required: true, validator: category_validate, trigger: ["blur"] }
        ],
        sku: [
          {
            required: true,
            validator: validateSku,
            trigger: ["blur", "change"]
          } //限定输入的个数
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
        ]
      },

      // form: {
      //   name: "",
      //   region: "",
      //   date1: "",
      //   date2: "",
      //   category: [],
      //   delivery: false,
      //   type: [],
      //   resource: "",
      //   desc: ""
      // },
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      addMonitor: false,
      inputText: "",
      originValue: "",
      StatusValue: "",
      // 时间段
      tabPosition: "",
      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      props: {
        value: "name",
        children: "childs",
        label: "name"
        //  value: "categoryName",
      }
    };
  },
  created() {
    // 初始化类目列表方法
    // this.getCategoryRankingListsApi();
    // this.monitorTimeAry.push(this.getBeforeTime(30), this.getBeforeTime(0));
    this.getListsApi(); // 初始化类目列表方法
    this.getPointeApi(); //请求扣点
  },
  mounted() {},
  computed: {
    // 及时更新Id
    platformId() {
      return this.$store.state.common.savePlatformIdAndSiteId.split(",")[0];
    }
    // ...mapState("anking", {
    //   getCategoryRankingLists: state => state.categoryRankings
    // })
  },

  watch: {
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.isDisabled = isDisabled(newV);
        //要干的事情
        if (this.isDisabled === true) {
          this.getListsApi();
        }
      },
      deep: true
    },
    // platformId(val) {
    //   this.getListsApi({ ...this.params, platformId: val });
    //   // console.log(val);
    //   this.getCategorList(val);
    // },
    skusArr(val) {
      if (val.length) {
        this.fontSum = val.length;
      } else {
        this.fontSum = 0;
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
    //排名todom 五
    showChart(scope, type) {
      // 日期
      this.pcMonitoringData = true;
      // console.log(scope, 111);
      if (type == 1) {
        this.chartData.title = "类目搜索PC排名";
      }
      if (type == 2) {
        this.chartData.title = "类目搜索APP排名";
      }
      // this.chartData.monitorFrom = scope.row.monitorFrom.slice(0, 10);
      // this.chartData.monitorTo = scope.row.monitorTo.slice(0, 10);
      this.chartData.taskId = scope.row.taskId;
      this.chartData.type = type;
      this.chartData.itemType = 2;
      this.chartData.url = "/TaskCategoryRankRtItem/list";
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
    _formatter(m, n, i) {
      // console.log(m, n, i);
      return m.status !== 2 ? "" : i;
    },
    // 请求扣点 类目排名搜素扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/categoryRank/list").then(res => {
        if (res.data.code == 0) {
          this.surplusAmount = res.data.data.surplusAmount;
          this.charge = res.data.data.charge;
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
      });
    },
    newLists1(e) {
      if (e === "" || e == null) {
        this.getListsApi(); //关键词竞争分析列表
      }
    },
    newLists2(e) {
      if (e === "" || e == null) {
        this.getListsApi(); //关键词竞争分析列表
      }
    },
    newLists3() {
      this.getListsApi(); //自由选择时间为空刷新列表
    },

    // 请求列表
    getListsApi(param = {}) {
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
        ...this.searchListData,
        startTime,
        endTime,
        ...param
      });
      // if (params.category) {
      //   params.category = params.category.replace(/>>/g, ":");
      // }
      this.$axios.post("/TaskCategoryRank/list", params).then(res => {
        if (this.searchLoading) {
          this.searchLoading = false;
        }
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
          // rows.forEach(item => {
          //   item.category = item.category.replace(/:/g, ">>");
          // });
          this.getCategoryRankingLists = rows;
        } else if (!rows) {
          this.getCategoryRankingLists = rows;
          this.total = 0;
        }
      });
    },
    refreshList() {
      this.searchListData = {};
      this.getListsApi();
    },

    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getListsApi();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNumber = val;
      this.getListsApi();
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
      return this.getListsApi({
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      });
    },
    //自由选择时间 刷新列表
    newTime(val) {
      this.pageSize = 10;
      this.pageNumber = 1;
      const { $ } = this;
      if (!val) {
        this.tabPosition = null;
        return this.getListsApi();
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

      return this.getListsApi();
    },
    //类目列表获取  类目排名添加类目
    getCategorList(id = 0) {
      if (this.skuListw.length) {
        return;
      }
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        parentPcid: id
      };
      // console.log(this.$store.state.common.savePlatformIdAndSiteId.split("," )[0]);

      this.$axios.post("/TaskCategoryRank/getCategory", params).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.forEach(el => {
            if (el.haveChildren == 1) {
              this.$set(el, "childs", []);
            }
          });
          this.skuListw = data;
          // console.log(this.skuList, "4545");
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
      });
    },

    getCategorById(id = 0) {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        parentPcid: id
      };
      return this.$axios.post("/TaskCategoryRank/getCategory", params);
    },
    // todonow
    model_change(val) {
      // console.log(val);
      // let categoryId = this.findItem(
      //   this.skuListw,
      //   val[val.length - 1],
      //   parent
      // );
      this.handleItemChange(val, true);
    },
    handleItemChange(val, notSend_getCategorById) {
      this.$set(this.form, "category", val);

      const valStr = val.join(":");
      const parent = val.slice(0, val.length - 1).join(":");
      let cateList = this.$.getStorage("cateList");

      this.findItem(this.skuListw, val[val.length - 1], parent);
      //change进来的不要发请求
      if (notSend_getCategorById === true) {
        return;
      }
      if (Object.keys(cateList).indexOf(valStr) > -1) {
        this.setSub(this.selEl, cateList[valStr], val);
        this.handCate();
        return;
      }
      this.loadingCas = true;
      this.getCategorById(this.selEl.pcid).then(res => {
        this.loadingCas = false;
        if (res.data.code == null) {
          return;
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }

        let data = res.data.data;
        this.setSub(this.selEl, data, val);
        this.handCate();
      });
    },

    setSub(selEl, data, val) {
      const valStr = val.join(":");
      let cateList = this.$.getStorage("cateList");
      data.forEach(el => {
        if (el.haveChildren == 1) {
          this.$set(el, "childs", []);
        }
      });
      cateList[valStr] = data;
      this.$.setStorage("cateList", JSON.stringify(cateList));

      this.$set(this.selEl, "childs", data);
    },

    findItem(arr, name, pName) {
      if (pName) {
        arr.forEach(el => {
          if (el.name === name && pName === el.parentName) {
            this.selEl = el;
            this.form.categoryId = el.pcid;
            this.form.haveChildren = el.haveChildren;
            // this.parentSelEl = arr;
            return false;
          } else {
            if (el.childs && el.childs.length > 0) {
              this.findItem(el.childs, name, pName);
            }
          }
        });
      } else {
        arr.forEach(el => {
          if (el.name === name) {
            this.selEl = el;
            this.form.categoryId = el.pcid;
            this.form.haveChildren = el.haveChildren;
            // this.parentSelEl = arr;
            return false;
          } else {
            if (el.childs && el.childs.length > 0) {
              this.findItem(el.childs, name);
            }
          }
        });
      }
      // console.log(this.siteForm, "此时的siteForm");
      this.$refs.ruleForm.validateField("category");
    },

    //添加任务
    onaddCategoryRankingTask() {
      this.addCategoryRankingTask = true;
      if (!this.skuListw.length) {
        this.getCategorList();
      }
      this.form.category = [];
      this.form.frequency = "";
      this.form.monitorTimeAry = [];
      this.form.sku = null;
      this.form.monitorFlag = null;
      this.form.monitorFrom = null;
      this.form.monitorTo = null;
      this.form.monitorTimeAry = [];
      this.form.categoryId = null;
    },
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务
    addTaskSubmit(formName, point) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let a = this.form.category;
          let b = a.join(":");
          let params = {
            type: point,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0],
            categorys: b,

            skus: [...new Set(this.skusArr)],
            monitorFlag: this.form.monitorFlag ? 1 : 0,
            categoryId: this.form.categoryId,
            frequency: this.form.frequency !== "" ? +this.form.frequency : ""
          };
          params = this.$.dealObjectValue(params);
          if (params.monitorFlag == 0) {
            this.addMonitoring(params, point);
          } else {
            if (
              this.form.monitorTimeAry != null &&
              this.form.monitorTimeAry.length
            ) {
              let time = {
                monitorFrom: this.form.monitorTimeAry[0],
                monitorTo: this.form.monitorTimeAry[1]
              };
              this.addMonitoring({ ...params, ...time }, point);
            } else {
              this.$message({
                message: "请选择时间",
                type: "warning"
              });
            }
          }

          // params = Object.assign({}, params, {
          //   monitorFrom: this.form.monitorTimeAry[0],
          //   monitorTo: this.form.monitorTimeAry[1]
          // });
        }
      });
    },
    addMonitoring(params, point) {
      this.buttonLoading.add = true;
      // 扣点按钮loading pointData
      if (point === undefined) {
        this.pointData.loading = true; // 关闭扣点按钮loading
      }
      this.$axios.post("/TaskCategoryRank/save", params).then(res => {
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
          this.addCategoryRankingTask = false;
          this.form.monitorFlag = null; //清除是否选择监控
          this.form.monitorTimeAry = null; //清除时间
          this.$nextTick(() => {
            this.pointData.show = false; // 关闭扣点弹窗 pointData
            this.pointData.loading = false; // 关闭扣点按钮loading
          });
          if (point === undefined) {
            this.reloadPointApi(); // 重新获取点数
            this.getListsApi(); //请求列表
          }
        } else if (res.data.code === 500) {
          this.$nextTick(() => {
            this.buttonLoading.add = false;
            this.pointData.loading = false; // 关闭扣点按钮loading
          });
          this.$message.error(res.data.msg);
        }
      });
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
            monitoringUrl = "/TaskCategoryRank/addMonitor";
          }
          if (type == "change") {
            monitoringUrl = "/TaskCategoryRank/updateMonitor";
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
              // console.log("添加监控/修改接口响应", res.data);
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
                  this.getListsApi(); // 添加产品后重新发起请求
                }
              } else if (res.data.code === 500) {
                this.$nextTick(() => {
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                this.$message({
                  type: "warning",
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
            this.cancelCategoryMonitorSubmit();
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
    cancelCategoryMonitorSubmit() {
      let cancleMonitor = [];
      if (this.userSelect.length) {
        this.userSelect.forEach(item => {
          cancleMonitor.push(item.taskId);
          //判断如果是选择一条，并且没有添加监控，提示本来没有添加监控
          // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
          //   this.$message({
          //     showClose: true,
          //     message: "没有添加监控",
          //     type: "warning"
          //   });
          // }
        });
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

              this.getListsApi(); //刷新列表
              return;
            }
            if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              this.$message({
                showClose: true,
                message: "没有添加监控",
                type: "warning"
              });
            } else if (res.data.code === 500) {
              this.$message.error(res.data.msg);
              this.getListsApi();
            }
          });
      }
    },
    //删除类目列表数据
    deleteCategoryList() {
      if (this.userSelect.length) {
        // 防止重复删除
        // let a = this.taskIds;
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
              .post("TaskCategoryRank/remove", { taskIds: arr })
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.pageNumber = 1;
                  this.getListsApi();
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
    //搜索类目  名和SKU
    cearchCategoryOrSku() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getListsApi();
    },
    // 记录搜素值
    recordSearch(category, sku) {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: "1",
        pageSize: "10"
        // category,
        // sku: this.skuList.skus
      };
      this.skuList.category = this.skuList.category.replace(/>>/g, ":");

      params = { ...params, ...this.skuList };

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key];
          if (element === "" || element == null) delete params[key];
        }
      }
      this.$axios.post("/TaskCategoryRank/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.mag);
          return;
        }

        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        // this.getCategoryRankingLists = res.data.rows;
      });
    },

    // ...mapActions("anking", [
    //   "getCategoryRankingListsApi",
    //   "addKeywordRankingTaskApi"
    // ]),
    ...mapMutations("anking", {
      // setWordList: "getCategoryRankingLists"
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
.fontSizeBox {
  position: relative;
}
.fontSize {
  position: absolute;
  z-index: 10000;
  left: 426px;
  top: -31px;
  width: 100px;
  color: #30cca5;
  font-size: 12px;
}
/* 标题两行溢出隐藏 */
.titleStyle_categoryRanking {
  width: 100% !important;
  display: inline !important;
  word-break: break-all !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical !important; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2 !important; /** 显示的行数 **/
  overflow: hidden !important; /** 隐藏超出的内容 **/
}
.box {
  position: relative;
}

.tableBox {
  width: 100%;
}
.keyQuerys .el-dialog__header,
.shopAuthorization .el-dialog__header,
.keywordQuery .el-dialog__header,
.salesMonitoring .el-dialog__header,
.keywordQuery .el-dialog__header,
.el-dialog__header,
.adkeywordRanking .el-dialog__header,
.adkeywordRanking .el-dialog__header {
  border-bottom: 0 !important;
  margin: 0 !important;
  padding: 10px 0px;
}

.keywordIndexContainer {
  margin-top: 25px;
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
</style>
