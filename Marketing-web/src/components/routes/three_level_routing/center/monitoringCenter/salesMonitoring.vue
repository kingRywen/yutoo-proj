<template>
  <!-- 跟卖监控 -->
  <div class='salesMonitoring __wrapper_i'>
    <section class="parentPosition">
      <el-row>
        <el-button type="success" @click="onaddCommodityk">添加产品</el-button>
        <!-- 添加产品 -->
        <el-dialog :close-on-click-modal="false" title="添加产品" :visible.sync="addCommodityk" style="padding-right:100px;" width="600px">
          <div slot="title">
            <span class="el-dialog__title">添加任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <span class="tips">温馨提示，如果输入的是父产品，必须勾选监控所有变体，否则将抓取失败</span>
          <div class="box __box_wrapper">
            <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%;">
              <el-form-item label="产品ASIN:" prop="sku" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="textarea" v-model="form.sku" :rows="4" placeholder="多个ASIN换行输入（1-500个）" style="width:100%;" />
                <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
              </el-form-item>
              <!-- 监控起止时间 -->
              <el-form-item label="监控时间:" prop="addDate" :label-width="formLabelWidth" style="width:100%;">
                <div class="block" style="width:100%;">
                  <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions" v-model="form.addDate" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-form-item>
              <!-- 监控频率 -->
              <el-form-item label="监控频率:" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="text" v-model="form.frequency" style="width:90%;" placeholder="限制10-60" />
                <span>分钟</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-checkbox v-model="form.allChildFlag">监控所有变体</el-checkbox>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-button :loading="buttonLoading.add" type="primary" style="width:100%;" @click="showPoint('ruleForm')">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 添加监控 -->
        <el-button type="success" @click="showAddmonitorDialog">添加监控</el-button>
        <!-- 添加监控弹窗 -->
        <el-dialog :close-on-click-modal="false" title="添加监控" :visible.sync="addDialogMonitorVisible" width="600px">
          <div class="box __box_wrapper">
            <el-form :model="dialogDate" :rules="rules_addmoni" ref="ruleForm_addmoni" style="width:100%;">
              <!-- 监控起止时间 -->
              <el-form-item label="监控时间:" prop="addMonitorDateValue" :label-width="formLabelWidth" style="width:100%;">
                <div class="block" style="width:100%;">
                  <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions" v-model="dialogDate.addMonitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-form-item>
              <!-- 监控频率 -->
              <el-form-item label="监控频率:" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="text" v-model="dialogDate.frequency" style="width:90%;" placeholder="限制10-60" />
                <span>分钟</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-button :loading="buttonLoading.addmonitor" type="primary" style="width:100%;" @click="addChartMoni('ruleForm_addmoni')">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 修改监控周期 todoh-->
        <el-button type="success" @click="showChangemonitorDialog">修改监控周期</el-button>
        <!-- 修改监控周期弹窗 -->
        <el-dialog :close-on-click-modal="false" title="修改监控周期" :visible.sync="changeDialogMonitorVisible" width="600px">
          <div class="box __box_wrapper">
            <el-form :model="dialogDate" :rules="rules_changemoni" ref="ruleForm_changemoni" style="width:100%;">
              <!-- 监控起止时间 -->
              <el-form-item label="监控时间:" prop="changeMonitorDateValue" :label-width="formLabelWidth" style="width:100%;">
                <div class="block" style="width:100%;">
                  <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions" v-model="dialogDate.changeMonitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-form-item>
              <!-- 监控频率 -->
              <el-form-item label="监控频率:" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="text" v-model="dialogDate.frequency" style="width:90%;" placeholder="限制10-60" />
                <span>分钟</span>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%;">
                <el-button :loading="buttonLoading.changemonitor" type="primary" style="width:100%;" @click="changeMoni('ruleForm_changemoni')">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 取消监控 -->
        <el-button type="success" plain @click="cancelSalesMonitor">取消监控</el-button>
        <el-button type="success" style="margin-left:0" plain @click="deleteMonitorList">删除</el-button>
        <!-- 定时任务（测试） -->
        <!-- <el-button type="primary" @click="ceshi(8)">定时任务（测试用）</el-button> -->
      </el-row>
      <!-- 布局 -->
      <el-row style="margin-top:8px;margin-bottom: 8px;height:30px" type="flex" justify="space-between">
        <!-- 输入框 关键词输入 -->
        <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
          <!-- 输入框 关键词输入 -->
          <el-input placeholder="请输入子ASIN" v-model.trim="searchListData.sku" clearable style='max-width:150px;'>
          </el-input>
          <!-- 搜索按钮 -->
          <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" :loading="searchLoading" @click="searchSalesMonitoring">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" :loading="searchLoading" @click="searchSalesMonitoring">搜索</el-button>
          <!-- <div>
            <el-button type="success" icon="el-icon-search" @click="testButton">测试</el-button>
          </div> -->

        </el-col>
        <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
          <el-date-picker unlink-panels :label-width="formLabelWidth" value-format="yyyy-MM-dd" @change="newTime" clearable class="el-date-wrapper" style="width:53%;max-width:240px" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-radio-group v-model="tabPosition" @change="currentTimeData">
            <el-radio-button label=1>今日</el-radio-button>
            <el-radio-button label=7>7天</el-radio-button>
            <el-radio-button label=30>30天</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table stripe ref="multipleTable" v-loading="loading" :max-height="12000" :data="saveSalesLists" tooltip-effect="dark" class="tableBox" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="sku" label="ASIN" align='center' width="120">
        </el-table-column>

        <el-table-column prop="imgs" label="图片" align='center'>
          <!-- 动态渲染图片 -->
          <template slot-scope="scope">
            <!-- <div class="__img_wrapper">
              <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'--'">
            </div> -->
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl" />
              <div class="__img_wrapper" slot="reference">
                <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align='center'>
          <!-- <template slot-scope="scope">
            <div class="titleStyle" :title="scope.row.title">
              {{scope.row.title | _formatData}}
            </div>
          </template> -->
          <template slot-scope="scope">
            <!-- <a class="aLink" target="_blank" :href="scope.row.productUrl?scope.row.productUrl:false" style="text-decoration:none;">{{ scope.row.title!=""?scope.row.title:""}}
            </a> -->
            <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title | _formatData}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.title">
              <div class="fix__row_2">
                <span>{{ scope.row.title!=""?scope.row.title:"-"}}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align='center'>
        </el-table-column>
        <el-table-column prop="monitorFlag" label="监控状态" align='center' width="100">
          <template slot-scope="scope">
            {{ scope.row.monitorFlag?'开启':'关闭' }}
          </template>
        </el-table-column>

        <el-table-column prop="frequency" label="监控频率" align='center' width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.frequency">{{scope.row.frequency}}分钟/次</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="监控起止时间" align='center'>
          <template slot-scope="scope">
            <span>
              {{ scope.row.monitorFrom?scope.row.monitorFrom.slice(0,10)+"~"+scope.row.monitorTo.slice(0,10):"-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sellerCnt" label="卖家数量" align='center' width="100">
        </el-table-column>
        <el-table-column prop="status" label="状态" align='center' class="status" width="120px">
          <template slot-scope="scope">
            {{ scope.row.status===2?"抓取成功":scope.row.status===0?"抓取中...":scope.row.status===1?"抓取中...":scope.row.status!==0||scope.row.status!==1||scope.row.status!==2?"抓取失败":"--" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.sellerCnt<=1&&scope.row.status==2?true:false" :disabled="true" type="primary">无跟卖</el-button> -->
            <el-button @click="handleClick(scope.row)" v-if="scope.row.status=='2'?true:false" type="primary">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style='margin-top:20px;'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-point :data="pointData"></el-point>
    </section>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapMutations } from "vuex";
import { isDisabled, Trim } from "@/api/functions";
export default {
  data() {
    var validateSku = (rule, value, callback) => {
      if (!value) {
        this.skusArr = [];
        callback(new Error("输入不能为空"));
        return;
      }
      if (value == null || value == undefined) return;
      let val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      this.skusArr = val;
      // console.log(this.skusArr, 44);
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      // let reg = /^[A-Z0-9]{10}$/;
      let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/;
      if (!val.every(el => reg.test(el))) {
        callback(new Error("ASIN须为10位数，只能是大写字母和数字组合"));
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
    var validateFrequency = (rule, value, callback) => {
      value = Trim(value, "g");
      value = +value;
      if (/^[0-9]*$/.test(value) === false) {
        callback(new Error("请输入整数"));
      } else if (value < 10 || value > 60) {
        callback(new Error("请输入10-60之间的整数"));
      } else {
        callback();
      }
    };
    return {
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      isDisabled: true,
      // 定义添加监控只能是今日之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      searchLoading: false,
      searchListData: {},
      skusArr: [],
      loading: true,
      buttonLoading: {
        add: false,
        addmonitor: false,
        changemonitor: false
      },
      surplusAmount: null, //剩余点数
      charge: null, //点数
      monitorTimeAry: [], //时间选择器
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      tabPosition: "",
      saveSalesLists: [], //接收请求的列表数据
      addCommodityk: false, //添加任务
      rules: {
        sku: [
          {
            required: true,
            validator: validateSku,
            trigger: ["blur", "change"]
          } //限定输入的个数
        ],
        addDate: [
          {
            required: true,
            message: "请选择监控起始时间",
            trigger: ["change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-60）",
            trigger: ["blur", "change"]
          },
          { validator: validateFrequency, trigger: ["blur", "change"] } //限定输入的个数
        ]
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
            message: "请输入监控频率（10-60）",
            trigger: ["blur", "change"]
          },
          { validator: validateFrequency, trigger: ["blur", "change"] } //限定输入的个数
        ]
      },
      rules_changemoni: {
        changeMonitorDateValue: [
          {
            required: true,
            message: "请选择监控起始时间",
            trigger: ["change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-60）",
            trigger: ["blur", "change"]
          },
          { validator: validateFrequency, trigger: ["blur", "change"] } //限定输入的个数
        ]
      },
      //添加产品
      form: {
        sku: "",
        frequency: "",
        addDate: "",
        monitorFlag: 1,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        allChildFlag: true,
        monitorFlag: null
      },
      // 添加监控
      // 弹窗todod
      addDialogMonitorVisible: false,
      // 日期
      dialogDate: {
        frequency: "",
        addMonitorDateValue: "",
        changeMonitorDateValue: ""
      },
      // 修改监控周期
      changeDialogMonitorVisible: false,
      // 定义搜索
      searchSkuLists: {
        sku: ""
      },
      taskIds: [],
      userSelect: [],
      // 、、、、、、、、、、、、、、
      checked: false,
      addTask: false,
      formLabelWidth: "90px",

      // 表格数据
      tableData: [
        {
          Numbering: "BSKEYON1136",
          imgs: "Lacoste ",
          titles:
            "Lacoste Men's Short Sleeve '85th Anni' 00's Striped Polo, PH7326",
          sellingQuantity: "666"
        }
      ],
      // 放删除选中的数组
      multipleSelection: []
    };
  },

  created() {
    // this.monitorTimeAry.push(this.getBeforeTime(30), this.getBeforeTime(0));
    // this.getSalesMonitoringListApi();
    this.getSalesMonitoringList(); //请求列表数据
    // this.getSalesMonitoringSeeListApi();
    this.getPointeApi(); //请求扣点
  },
  computed: {
    ...mapState("monitor", {
      // saveSalesLists: state => state.salesLists
    }),
    fontSum() {
      return this.skusArr.length;
    }
  },
  watch: {
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.isDisabled = isDisabled(newV);
        //要干的事情
        if (this.isDisabled === true) {
          this.getSalesMonitoringList();
        }
      },
      deep: true
    }
    // platformId(val) {
    //   this.getSalesMonitoringList({ platformId: val });
    // },
    // skusArr(val) {
    //   let len = [...new Set(val)].length;
    //   if (len) {
    //     this.fontSum = len;
    //   } else {
    //     this.fontSum = null;
    //   }
    // },
  },

  methods: {
    testButton() {},
    // 请求扣点  跟卖监控扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/productSelling/list").then(res => {
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
        this.getSalesMonitoringList(); //关键词竞争分析列表
      }
    },
    newLists2(e) {
      if (e === "" || e == null) {
        this.getSalesMonitoringList(); //关键词竞争分析列表
      }
    },
    ...mapActions("monitor", [
      // getSalesMonitoringListApi
      "getSalesMonitoringSeeListApi"
    ]),
    ...mapMutations("monitor", {
      setWordList: "saveSalesLists"
    }),

    // 请求列表
    getSalesMonitoringList(param = {}) {
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

      this.$axios.post("/TaskProductSelling/list", params).then(res => {
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
          this.saveSalesLists = rows;
        } else if (!rows) {
          this.saveSalesLists = rows;
          this.total = 0;
        }
      });
    },

    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;

      this.getSalesMonitoringList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNumber = val;
      this.getSalesMonitoringList();
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
    //根据时间选择列表 1.7.30
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
      let dateObj = new Date();
      let _end = `${dateObj.getFullYear()}-${dateObj.getMonth() +
        1}-${dateObj.getDate()}`;
      let _start = null;
      switch (params.createTime) {
        case 7:
          // _end = _start;
          // console.log(this.getBeforeTime(7), this.getCountDays());
          _start = this.getBeforeTime(7);
          break;
        case 30:
          // console.log(this.getBeforeTime(30), this.getCountDays());
          _start = this.getBeforeTime(30);
          break;
        default:
          _start = _end;
      }
      this.monitorTimeAry = [_start, _end];
      this.$forceUpdate();

      return this.getSalesMonitoringList({
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
        return this.getSalesMonitoringList();
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

      return this.getSalesMonitoringList();
    },

    //点击添加产品
    onaddCommodityk() {
      this.addCommodityk = true;
      // 清除表单内容;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务提交
    addTaskSubmit(formName, point) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            type: point,
            sku: this.form.sku.split("\n"), //转换为字符串并且可以换行
            monitorFlag: 1,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0],
            allChildFlag: this.form.allChildFlag ? 1 : 0, //判断是否监控所有变体，传给后台1 或者 0
            monitorFrom: this.form.addDate[0],
            monitorTo: this.form.addDate[1],
            frequency: +this.form.frequency
          };
          params.sku = [...new Set(this.skusArr)];
          params = this.$.dealObjectValue(params);
          this.buttonLoading.add = true;
          // 扣点按钮loading pointData
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          _this.$axios.post("/TaskProductSelling/save", params).then(res => {
            if (res.data.code == 0) {
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
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$nextTick(() => {
                this.pointData.show = false; // 关闭扣点弹窗 pointData
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              if (point === undefined) {
                this.reloadPointApi(); // 重新获取点数
                this.getSalesMonitoringList();
              }
              this.addCommodityk = false;
              this.$refs[formName].resetFields(); //清除数据记录
              this.form.allChildFlag = true; //默认为勾选状态
            }
            if (res.data.code == 500) {
              this.$nextTick(() => {
                this.buttonLoading.add = false;
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 添加监控
    //点击添加监控
    showAddmonitorDialog() {
      this.skusArr = [];
      if (this.userSelect.length) {
        // 此变量判断是否有未开启监控的选项
        let isAllInMonitor = true;
        for (let i = 0; i < this.userSelect.length; i++) {
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
          this.addDialogMonitorVisible = false;
          return;
        }
        //
        this.addDialogMonitorVisible = true;
        // 清除表单内容;
        // 清除表单内容;
        this.$nextTick(() => {
          this.$refs.ruleForm_addmoni.resetFields();
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    // 添加监控 pointData
    addChartMoni(formName) {
      this.addSalesMonitor(formName, 0);
    },
    addSalesMonitor(formName, point) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.userSelect.length) {
            let addMonitorArr = [];
            this.userSelect.forEach(item => {
              addMonitorArr.push(item.taskId);
            });
            let params = {
              type: point,
              taskIds: addMonitorArr,
              platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
                ","
              )[0],
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
              .post("/TaskProductSelling/addMonitor", params)
              .then(res => {
                this.buttonLoading.addmonitor = false;
                // 扣点弹窗
                if (point === 0) {
                  if (res.data.code == 0) {
                    this.pointData.show = true;
                    this.pointData.point = res.data.data + "点";
                    this.pointData.formName = "ruleForm_addmoni";
                    this.pointData.func = this.addSalesMonitor;
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

                  this.addDialogMonitorVisible = false;
                  this.$nextTick(() => {
                    this.pointData.show = false; // 关闭扣点弹窗 pointData
                    this.pointData.loading = false; // 关闭扣点按钮loading
                  });
                  if (point === undefined) {
                    this.reloadPointApi();
                    this.getSalesMonitoringList();
                  }
                  return;
                }
                if (res.data.code == 500) {
                  this.$nextTick(() => {
                    this.pointData.loading = false; // 关闭扣点按钮loading
                  });
                  this.$message.error(res.data.msg);
                }
              });
          } else {
            this.$message({
              showClose: true,
              message: "至少需要选中一个",
              type: "warning"
            });
          }
        }
      });
    },
    // 修改监控周期todom
    //点击修改监控周期
    showChangemonitorDialog() {
      if (this.userSelect.length) {
        this.changeDialogMonitorVisible = true;
        // 1
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
            this.dialogDate.changeMonitorDateValue = [
              this.userSelect[0].monitorFrom,
              this.userSelect[0].monitorTo
            ];
          }
        } else {
          this.dialogDate.frequency = "";
          this.dialogDate.changeMonitorDateValue = [];
        }
        // 2 end
        // end
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    // 添加监控 pointData
    changeMoni(formName) {
      this.changeSalesMonitor(formName, 0);
    },
    changeSalesMonitor(formName, point) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let changeMonitorArr = [];
          this.userSelect.forEach(item => {
            changeMonitorArr.push(item.taskId);
          });
          let params = {
            type: point,
            taskIds: changeMonitorArr,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0],
            monitorFrom: this.dialogDate.changeMonitorDateValue[0],
            monitorTo: this.dialogDate.changeMonitorDateValue[1],
            frequency: +this.dialogDate.frequency
          };
          params = this.$.dealObjectValue(params);
          this.buttonLoading.changemonitor = true;
          // 扣点按钮loading pointData
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          this.$axios
            .post("/TaskProductSelling/updateMonitor", params)
            .then(res => {
              this.buttonLoading.addmonitor = false;
              // 扣点弹窗
              if (point === 0) {
                if (res.data.code == 0) {
                  this.pointData.show = true;
                  this.pointData.point = res.data.data + "点";
                  this.pointData.formName = "ruleForm_changemoni";
                  this.pointData.func = this.changeSalesMonitor;
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
                this.$nextTick(() => {
                  this.pointData.show = false; // 关闭扣点弹窗 pointData
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                if (point === undefined) {
                  this.reloadPointApi();
                  this.getSalesMonitoringList();
                }
                this.changeDialogMonitorVisible = false;
                return;
              }
              if (res.data.code == 500) {
                this.$nextTick(() => {
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                this.$message.error(res.data.msg);
              }
            });
        }
      });
    },
    //取消监控
    cancelSalesMonitor() {
      if (this.userSelect.length) {
        // // 此变量判断是否有未开启监控的选项
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
        // //
        this.$confirm("此操作将取消监控选中项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let cancelMonitor = [];
          if (this.userSelect.length) {
            this.userSelect.forEach(item => {
              cancelMonitor.push(item.taskId);
              // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              //   this.$message({
              //     showClose: true,
              //     message: "没有添加监控",
              //     type: "warning"
              //   });
              // }
              let params = {
                taskIds: cancelMonitor
              };
              this.$axios
                .post("/TaskProductSelling/removeMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.getSalesMonitoringList();
                    return;
                  }
                  if (res.data.code == 500) {
                    // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
                    //   this.$message({
                    //     showClose: true,
                    //     message: "没有添加监控",
                    //     type: "warning"
                    //   });
                    // } else {
                    this.$message.error(res.data.msg);
                    // }
                  }
                });
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    //删除监控列表
    deleteMonitorList() {
      if (this.userSelect.length) {
        this.$confirm("此操作将删除选中项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let deleteArr = [];
          if (this.userSelect.length) {
            this.userSelect.forEach(item => {
              deleteArr.push(item.taskId);
              // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              //   this.$message({
              //     showClose: true,
              //     message: "没有添加监控",
              //     type: "warning"
              //   });
              // }
              let params = {
                taskIds: deleteArr
              };
              this.$axios
                .post("/TaskProductSelling/remove", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.pageNumber = 1;
                    this.getSalesMonitoringList();
                    return;
                  }
                  if (res.data.code == 500) {
                    // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
                    //   this.$message({
                    //     showClose: true,
                    //     message: "没有添加监控",
                    //     type: "warning"
                    //   });
                    // } else {
                    this.$message.error(res.data.msg);
                    // }
                  }
                });
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    //搜索，跟卖监控 搜索
    searchSalesMonitoring() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getSalesMonitoringList();
    },
    //记录搜索值
    recordSearch(sku) {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: 1,
        pageSize: 10,
        sku
      };

      this.$axios.post("/TaskProductSelling/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.pageNumber = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.saveSalesLists = res.data.rows;
          return;
        }
        if (!res.data.rows.length) {
          this.pageNumber = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.saveSalesLists = res.data.rows;
          return;
        }
      });
    },

    ...mapActions("monitor", ["getSalesMonitoringListApi"]),
    // ...mapMutations("monitor", {
    //   setWordList: "getWordRankingLists"
    // }),
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
    handleClick(row) {
      // console.log(index, rowDetail);
      this.$router.push({
        path: "/admin/monitoringCenter/salesMonitoring/salesMonitoringSee",
        query: {
          sku: row.sku,
          taskId: row.taskId
        }
      });
    }
  }
};
</script>


<style scoped>
.tips {
  display: block;
  text-align: center;
  margin-bottom: 20px;
  font-size: 12px;
  color: #30cca5;
}
.fontSizeBox {
  position: relative;
}
.fontSize {
  position: absolute;
  z-index: 10000;
  left: 420px;
  top: -92px;
  color: #30cca5;
  font-size: 12px;
}
.titleStyle {
  display: inline;

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

.timeCss2 {
  display: inline;
  margin-left: 30px;
  color: #00c0de;
  font-size: 12px;
}
.tableBox {
  width: 100%;
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
</style>
