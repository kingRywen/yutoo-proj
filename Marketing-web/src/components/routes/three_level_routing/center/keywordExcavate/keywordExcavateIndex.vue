<!-- 关键词挖掘主页 -->
<template>
  <div class='keywordIndexContainer __wrapper_i'>
    <section class="parentPosition">
      <el-row>
        <!-- 添加任务 -->
        <el-button type="success" @click="onExcavateTask">添加任务</el-button>
        <!-- 添加任务弹窗 -->
        <el-dialog :close-on-click-modal="false" title="添加产品" :visible.sync="onExcavateTaskDiakig" width="600px">
          <div slot="title">
            <span class="el-dialog__title">添加任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <div class="box __box_wrapper">
            <el-form :rules="rules" :model="excavateForm" ref="ruleForm" style="width:100%">
              <el-form-item label="选择来源: " prop="platformName" :label-width="formLabelWidth" style="width:100%">
                <el-select :popper-append-to-body="false" v-model.number="excavateForm.platformName" style="width:100%">
                  <el-option v-for="(item,index) in sourceData" :label="item.platformName" :value="item.platformId">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="选择站点: " prop="siteId" :label-width="formLabelWidth" style="width:100%">
                <el-select :popper-append-to-body="false"v-model="excavateForm.siteId" style="width:100%">
                  <el-option v-for="(item,index) in siteDatas" :label="item.siteName" :value="item.siteId">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <!-- 选择语言接口再是不对，没有后台数据接口， -->
              <el-form-item label="选择语言: " prop="language" :label-width="formLabelWidth" v-if="languageShows" style="width:100%">
                <!-- {{excavateForm.language}} -->
                <el-select :popper-append-to-body="false" v-model="excavateForm.language" style="width:100%">
                  <el-option v-for="(item,index) in languageData" :label="item.languageName" :value="item.languageTypeId">
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-if="box">
                <el-form-item :label-width="formLabelWidth" v-if="keywordTypesBox" prop="keywordTypes" style="width:100%" label="选择类型: ">
                  <!-- 非wish平台模式-->
                  <el-checkbox-group v-if="excavateForm.platformName!=4" v-model="excavateForm.keywordTypes" class="keywordTypesStyle" :min="min" :max="max">
                    <el-checkbox :label="item.type" v-for="item in typaArr">{{item.typeName}}</el-checkbox>
                  </el-checkbox-group>
                  <!-- wish平台模式todoh-->
                  <el-checkbox-group v-if="excavateForm.platformName==4" class="keywordTypesStyle" :min="min" :max="max" style="vertical-align: middle">
                    <el-radio v-model="excavateForm.keywordTypes" style="vertical-align: middle" :label="item.type" :key="item.type" v-for="item in typaArr">{{item.typeName}}</el-radio>
                  </el-checkbox-group>
                </el-form-item>
                <!-- todoh -->
                <el-form-item v-if="shendu" :label-width="formLabelWidth" :label="shendu_label+'深度:' " prop="depth" style="width:100%">
                  <el-select :popper-append-to-body="false" v-model="excavateForm.depth" style="width:100%">
                    <el-option v-for="item in depths" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="keywords1" prop="keywords" label="关键词: " :label-width="formLabelWidth" style="width:100%">
                  <el-input type="textarea" :rows="4" :placeholder="placeholder" v-model="excavateForm.keywords" style="width:100%" />
                  <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
                </el-form-item>
              </div>
              <el-form-item v-if="keywords2" prop="keywords" label="产品id: " :label-width="formLabelWidth" style="width:100%">
                <el-input type="textarea" :rows="4" placeholder="多个产品ID换行输入（1-500个）" v-model="excavateForm.keywords" style="width:100%" />
                <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
              </el-form-item>

              <el-form-item prop="name" :label-width="formLabelWidth" style="width:100%" label="任务名称: ">
                <el-input v-model="excavateForm.name" placeholder="最多输入30个字符" maxlength="30" style="width:100%"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" style="width:100%">
                <el-button type="primary" style="width:100%;" @click="showPoint('ruleForm')" :loading="addLoading">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <el-button type="success" plain @click="deleteList()">删除</el-button>
      </el-row>
      <!-- 布局 todoh-->
      <el-row style="margin-top:8px;margin-bottom: 8px;height:30px" type="flex" justify="space-between">
        <!-- 输入框 -->
        <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
          <el-input placeholder="输入任务名称" prop="" v-model="searchListData.taskName" clearable style='max-width:150px;'>
          </el-input>
          <!-- 选择来源 -->
          <el-select :popper-append-to-body="false" v-model="searchListData.originId" placeholder="选择来源" style='max-width:120px' clearable>
            <el-option v-for="item in sourceData" :key="item.value" :label="item.platformName" :value="item.platformId">
            </el-option>
          </el-select>
          <!-- 选择站点 -->
          <!-- <el-select :popper-append-to-body="false"v-model="searchListData.siteId" placeholder="选择站点" style='max-width:120px' clearable>
            <el-option v-for="item in siteDataList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
          <!-- 选择类型 -->
          <el-select :popper-append-to-body="false" v-model="searchListData.keywordTypes" placeholder="选择类型" style='max-width:120px' clearable>
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- 选择状态 -->
          <el-select :popper-append-to-body="false" v-model="searchListData.status" placeholder="选择状态" style='max-width:120px' clearable>
            <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- 搜索按钮 -->
          <!-- <el-button :disabled="Disabled" type="success" icon="el-icon-search" :loading="searchLoading" @click="searchLists" style='margin-right:5px;'>搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" :loading="searchLoading" @click="searchLists" style='margin-right:5px;'>搜索</el-button>
          <!-- 清空搜索按钮 -->
          <el-button :disabled="Disabled" type="success" icon="el-icon-search" :loading="clearSearchLoading" @click="clearSearchLists">清空</el-button>
        </el-col>
        <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
          <el-date-picker unlink-panels :label-width="formLabelWidth" value-format="yyyy-MM-dd" clearable @change="newTime" class="el-date-wrapper" style="width:53%;max-width:240px" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-radio-group v-model="tabPosition" @change="changeTime" class="timeStyleBox">
            <el-radio-button label="1">今日</el-radio-button>
            <el-radio-button label="7">7天</el-radio-button>
            <el-radio-button label="30">30天</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table v-loading="loading" :max-height="12000" stripe ref="multipleTable" :data="getKeywordMiningData" tooltip-effect="dark" class="tableBox" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" align='center' :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="platformName" label="来源" align='center'>
        </el-table-column>
        <el-table-column prop="siteName" label="站点" align='center'>
        </el-table-column>
        <el-table-column label="类型" align='center'>
          <template slot-scope="scope">
            <template v-for="item in scope.row.keywordTypes">
              <span v-if="item==0">相关词</span>
              <span v-if="item==1">下拉词</span>
              <span v-if="item==2">联想词</span>
              <span v-if="item==3">Tag词</span>
              <span v-if="item==4">AdWords</span>
              <span v-if="item==-1">-</span>
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
            <!-- 条件显示查看 -->
            <el-button @click="handleClick(scope.row)" v-if="scope.row.status=='2'" type="primary">查看</el-button>
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
// // import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'
import { mapActions, mapState, mapMutations } from "vuex";
// 1
import { isDisabled, getDay } from "@/api/functions";
// import func from "./vue-temp/vue-editor-bridge";
export default {
  // components: {
  //   vieCheck
  // },
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
      if (
        this.excavateForm.platformName == 6 ||
        this.excavateForm.platformName == 7
      ) {
        if (val.length > 50) {
          callback(new Error("关键词最多只能输入50个"));
        }
      }
      // if (regEn.test(value) || regCn.test(value)) {
      //   callback(new Error("不能包含特殊字符"));
      // } else
      if (val.length > 500) {
        callback(new Error("关键词最多只能输入500个"));
      } else {
        callback();
      }
    };

    // validatekeywordTypes;
    return {
      loading: false,
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      Disabled: true,
      addLoading: false,
      searchLoading: false,
      // 清空搜索按钮的的加载动画
      clearSearchLoading: false,
      searchListData: {
        // keyword: "",
        // site: "",
        // type: "",
        // status: "",
        // // 保存选择的来源id数据
        // saveOriginId: ""
      },
      newkeywordTypes: [],
      typaArr: [],
      placeholder: "输入关键词", //提示
      min: 0,
      max: Infinity,
      keywordsArr: [],
      monitorTimeAry: [], //选择时间
      surplusAmount: null, //剩余点数
      charge: null, //点数
      userSelect: [],
      total: null, //总条数
      pageNumber: 1, //分页
      pageSize: 10, //每页条数
      totalPages: null,
      // 4
      tabPosition: "", //默认时间为空
      getKeywordMiningData: [], //列表数据
      input: "", //任务名称
      checkList: [], //复选框
      checked: false, //是否tag词
      keywords1: true,
      keywords2: false,
      shendu: false,
      shendu_label: "", // 深度词前缀
      box: true, //  是否tag词控制
      languageShows: false, //语言显示隐藏
      languageData: [], //语言数据
      sourceWishShow1: true, //wish平台单选模式
      sourceWishShow2: false, //wish平台单选模式
      sourceWishShow3: false, //wish平台单选模式
      depthBox: false, //深度
      keywordTypesBox: true,
      box3: false, //深度
      onExcavateTaskDiakig: false, //添加任务弹窗
      // 定义添加任务的数据
      excavateForm: {
        type: null,
        platformId: null,
        platformName: null, //来源
        originId: null, // 来源id
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1], //站点
        keywordTypes: [], //类型
        depth: null, //深度
        keywords: "", //关键词
        name: null,
        language: null //语言
      },
      formLabelWidth: "100px", //公用宽度
      skuListw: [], //定义添加任务的类目类别
      props: {
        value: "categoryId",
        children: "recursionList",
        label: "categoryName"
      },
      //添加任务选择的搜索页数
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
      deleteData: [], //定义删除的列表
      // 定义搜索的数据
      searchData: {
        keyword: "",
        site: null,
        type: "",
        status: null,
        originId: null
      },
      // 校验
      rules: {
        platformName: [
          { required: true, message: "选择来源", trigger: ["change", "blur"] }
        ],
        depth: [
          { required: true, message: "请选择深度", trigger: ["change", "blur"] }
        ],
        // 站点
        // siteId: [
        //   { required: true, message: "选择站点", trigger: ["change", "blur"] }
        // ],
        //关键词
        keywords: [
          {
            required: true,
            validator: validateKeyword,
            trigger: ["blur", "change"]
          } //限定输入的个
        ],
        //深度
        // 关键词类型
        keywordTypes: [
          {
            required: true,
            message: "请选择关键词类型",
            trigger: ["change", "blur"]
          }
        ],
        name: [
          {
            required: true,
            max: 30,
            message: "请输入任务名称",
            trigger: ["blur", "change"]
          }
        ]
      },
      siteDatas: [], // 定义站点接收赋值
      sourceData: [
        // {
        //   value: 1,
        //   label: "Amazon"
        // },
        // {
        //   value: 2,
        //   label: "eBay"
        // },
        // {
        //   value: 3,
        //   label: "AliExpress"
        // },
        // {
        //   value: 4,
        //   label: "Wish"
        // },
        // {
        //   value: 5,
        //   label: "Walmart"
        // },
        // {
        //   value: 6,
        //   label: "AliExpress"
        // },
        // {
        //   value: 7,
        //   label: "AliExpress"
        // }
      ],
      //定义站点数据
      siteDataList: [
        // {
        //   value: 3,
        //   label: "日本站"
        // },
        // {
        //   value: 2,
        //   label: "中国站"
        // },
        {
          value: 1,
          label: "美国站"
        }
      ],
      // 关键词类型
      typeOptions: [
        {
          value: 0,
          label: "相关词"
        },
        {
          value: 1,
          label: "下拉词"
        },
        {
          value: 2,
          label: "联想词"
        },
        {
          value: 3,
          label: "Tag 词"
        },
        {
          value: 4,
          label: "AdWords"
        }
      ],
      typeValue: "",
      // 状态
      StatusOptions: [
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
      depths: [
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
        }
      ],
      StatusValue: "",
      // 放删除选中的数组
      multipleSelection: []
    };
  },

  created() {
    // 2
    // this.monitorTimeAry.push(this.getBeforeTime(30), this.getBeforeTime(0));
    this.getMiningListsApi(); // 关键词挖掘列表请求
    this.getCategorList(); //请求站点
    this.getPointeApi(); //请求扣点
    this.getSourceList(); //添加任务 请求来源
    this.getKeywordTypeList(1); //请求关键词类型
    this.getlanguageList(); //请求语言
  },
  computed: {
    // 及时更新Id
    platformId() {
      return this.$store.state.common.savePlatformIdAndSiteId.split(",")[0];
    },
    fontSum() {
      return this.keywordsArr.length;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("common/pathFromCheckProductAnalysis", "");
    next();
  },
  watch: {
    // 监听帅选条件，空值Disabled的true和falsea
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.Disabled = isDisabled(newV);
        //要干的事情
        if (this.Disabled === true) {
          this.getMiningListsApi();
        }
      },
      deep: true
    },
    // 平台ID监听
    platformId(val, index) {
      this.getMiningListsApi({ platformId: val });
    },
    // 监听来源  控制相关
    ["excavateForm.platformName"](val) {
      this.addLoading = false;
      // console.log(val, "来源选择变化1");
      // 根据来源不同 提示输入个数
      for (let key in this.excavateForm) {
        if (key == "keywordTypes") {
          this.excavateForm[key] = [];
          continue;
        }
        if (key == "platformName") continue;
        this.excavateForm[key] = null;
      }

      switch (val) {
        case 1:
          this.changeStatus();
          break;
        case 2:
          this.changeStatus();
          break;
        case 3:
          this.changeStatus();
          break;
        case 5:
          this.changeStatus();
          break;
        case 4:
          this.excavateForm.keywordTypes = 1; //默认下拉词
          this.changeStatus();
          break;
        case 6:
          this.changeStatus("多个关键词换行输入(最多50个)", true, true);
          this.$set(this.rules, "language", {
            required: true,
            message: "请选择语言"
          });
          break;
        case 7:
          this.changeStatus("多个关键词换行输入(最多50个)", false, false);
          break;
      }
      this.getKeywordTypeList(val);
    },
    //监听关键词类型，深度，产品ID显示判断todow
    ["excavateForm.keywordTypes"](val) {
      // console.log(this.excavateForm.keywordTypes, "单选中哪一个");
      var arr = val;
      // console.log(
      //   arr,
      //   "关键词类型集合变化2（弹窗打开时因为被清空，所以没有，勾选关键词可看到其变化）"
      // );
      if (!(val instanceof Array)) arr = Array.of(val);
      if (
        // 类型为下拉词，而且是来源1或5，则加上在深度二字前面加上下拉词前缀
        arr.some(item => item == 1) &&
        (this.excavateForm.platformName === 1 ||
          this.excavateForm.platformName === 5)
      ) {
        this.shendu_label = "下拉词";
        this.shendu = true;
        this.rules.depth[0].required = true;
        return;
      }
      if (
        // 类型为下拉词或者相关，而且是不是来源1和5，则去掉深度下拉词前缀
        arr.some(
          item =>
            (item == 0 &&
              (this.excavateForm.platformName !== 1 ||
                this.excavateForm.platformName !== 5)) ||
            (item == 1 &&
              (this.excavateForm.platformName !== 1 ||
                this.excavateForm.platformName !== 5))
        )
      ) {
        this.shendu_label = "";
        this.shendu = true;
        this.rules.depth[0].required = true;
        // this.$set(this.rules, "depth", [
        //   {
        //     required: true,
        //     message: "请选择深度",
        //     trigger: ["blur", "change"]
        //   }
        // ]);
      } else {
        this.shendu = false;
        this.rules.depth[0].required = false;
        // for (let key in this.rules) {
        //   if (key == "depth") {
        //     delete this.rules[key];
        //   }
        // }
      }
      if (arr.some(item => item == 3)) {
        this.keywords1 = false;
        this.keywords2 = true;
      } else {
        this.keywords1 = true;
        this.keywords2 = false;
      }
    }
  },
  methods: {
    changeStatus(
      str = "多个关键词换行输入(最多500个)",
      type = true,
      language = false
    ) {
      this.placeholder = str;
      this.keywordTypesBox = type;
      this.languageShows = language;
    },
    // 请求扣点  关键词挖掘扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/keywordDig/list").then(res => {
        this.surplusAmount = res.data.data.surplusAmount;
        this.charge = res.data.data.charge;
      });
    },
    ...mapActions("KeywordMining", ["getKeywordMiningListsApi"]), //引入方法
    ...mapMutations("KeywordMining", {}),
    ...mapActions("menu", ["addCompeteKeywordAnalysisApi"]),

    // 请求列表todom
    getMiningListsApi(param = {}) {
      // debugger;
      // this.searchListData.keyword = Array.of(this.searchListData.keyword);
      this.loading = true;
      const { pageSize, pageNumber } = this;
      let startTime = this.monitorTimeAry ? this.monitorTimeAry[0] : "";
      let endTime = this.monitorTimeAry ? this.monitorTimeAry[1] : "";
      let originId = this.searchListData.saveOriginId;
      const params = this.$.dealObjectValue({
        pageSize,
        pageNumber,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        originId,
        ...this.searchListData,
        startTime,
        endTime,
        ...param
      });

      this.$axios.post("/TaskKeywordDig/list", params).then(res => {
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
          rows.forEach(item => {
            item.keywordTypes = item.keywordTypes.split(",");
          });
          this.getKeywordMiningData = rows;
          // console.log(this.getKeywordMiningData, 11111);
        } else if (!rows) {
          this.getKeywordMiningData = [];
          this.total = 0;
        }
        this.clearSearchLoading = false;
      });
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMiningListsApi();
    },
    // 翻页
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getMiningListsApi();
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
    changeTime() {
      this.pageSize = 10;
      this.pageNumber = 1;
      // console.log(this.monitorTimeAry[0], "时间");
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
      // 3
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
      // 3
      this.monitorTimeAry = [_start, _end];
      this.$forceUpdate();
      return this.getMiningListsApi({
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
        return this.getMiningListsApi();
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

      return this.getMiningListsApi();
    },

    // 获取来源的方法
    getSourceList() {
      let params = {
        pageNumber: 1,
        pageSize: 10
      };
      this.$axios.post("/Platform/allList", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.sourceData = res.data.data;
        // console.log(this.sourceData, "来源");
      });
    },
    // 关键词类型获取
    getKeywordTypeList(platformId) {
      platformId = Number(platformId);
      this.$axios.post("/KeywordType/list", { platformId }).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        let data = res.data.data;
        let str = null;
        let newData = data.map(item => {
          switch (item.type) {
            case 0:
              str = "相关词";
              break;
            case 1:
              str = "下拉词";
              break;
            case 2:
              str = "联想词";
              break;
            case 3:
              str = "TAG词";
              break;
            case 4:
              str = "AdWords";
              break;
          }
          return {
            typeName: str,
            type: item.type,
            maxQty: item.maxQty
          };
        });
        // console.log(this.typaArr, "关键词类型和字数");
        this.typaArr = newData;
        this.$nextTick(() => {
          this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
        });
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
        this.siteDatas = res.data;
        this["short"] = res.data;
      });
    },
    // 获取语言
    getlanguageList() {
      let params = {
        searchSites: 0
      };
      this.$axios.post("/TaskKeywordDig/languageList", params).then(res => {
        // console.log(res.data, 999);
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.languageData = res.data;
      });
    },
    //点击添加任务
    onExcavateTask() {
      this.onExcavateTaskDiakig = true;
      this.excavateForm.type = null;
      this.excavateForm.platformId = null;
      this.excavateForm.platformName = null;
      this.excavateForm.originId = null;
      this.excavateForm.keywordTypes = null;
      this.excavateForm.depth = null;
      this.excavateForm.keywords = "";
      this.excavateForm.language = "";
      this.excavateForm.name = ""; //任务名为空
      this.keywordsArr = [];
    },
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务todon
    addTaskSubmit(formName, point) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addLoading = true;
          let a = this.checkList;
          this.keywordTypes = [Number(a)];
          let b = [this.excavateForm.keywords];
          let params = {
            type: point,
            originId: this.excavateForm.platformName,
            language: this.excavateForm.language,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0],
            siteId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[1], //站点
            keywordTypes: this.excavateForm.keywordTypes,
            depth: this.excavateForm.depth, //深度
            keywords: this.excavateForm.keywords.split("\n"), //去除换行
            taskName: this.excavateForm.name //任务名称
          };
          // if (this.checked == true) {
          //   params.keywordTypes.push(3);
          // }
          params.keywords = [...new Set(this.keywordsArr)];
          params = { ...params };
          params = this.$.dealObjectValue(params);
          // wish单选的时候导致this.excavateForm.keywordTypes从【】变成数字。多选的时候是【】，所有判断如果是数字，则变成数组
          if (typeof params.keywordTypes === "number") {
            params.keywordTypes = Array.of(params.keywordTypes);
          }
          // console.log(params, "添加发送的参数");
          // 扣点按钮loading
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          this.$axios.post("/TaskKeywordDig/save", params).then(res => {
            this.addLoading = false;
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
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.reloadPointApi(); // 重新获取点数
              this.$refs[formName].resetFields(); //清除数据记录
              this.onExcavateTaskDiakig = false; //关闭第一个弹窗
              this.$nextTick(() => {
                this.pointData.show = false; // 关闭扣点弹窗
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              this.searchListData = {};
              this.getMiningListsApi(); //请求查询列表
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
    // 删除
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
              .post("/TaskKeywordDig/remove", { taskIds: arr })
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.pageNumber = 1;
                  this.getMiningListsApi(); // 关键词挖掘列表请求
                  this.deleteData = [];
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
    searchLists() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.searchLoading = true;
      this.getMiningListsApi();
    },
    // 清空搜索
    clearSearchLists() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.clearSearchLoading = true;
      this.searchListData = {};
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.deleteData.push(item.taskId);
      });
    },
    // table的查看
    handleClick(asg) {
      // console.log(asg);
      let taskId = asg.taskId;
      let keywordTypes = asg.keywordTypes;
      let taskName = asg.taskName;
      this.$router.push({
        path: "/admin/center/keywordExcavateIndexSee",
        query: {
          taskId: taskId,
          keywordTypes: keywordTypes,
          taskName: taskName
        }
      });
    }
  }
};
</script>

<style scoped>
.depthBoxStyle {
  margin-left: -35px;
}
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
.smallStarBox {
  position: relative;
}
.smallStar {
  position: absolute;
  color: red;
  left: -20px;
  top: 2px;
  z-index: 1000;
}
.keywordTypesStyle {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  width: 340px;
  box-sizing: border-box;
  line-height: 40px;
  height: 42px;
}
.boxStyle {
  width: 600px;
}
.box {
  position: relative;
}
.tableBox {
  width: 100%;
  margin-top: 0;
}
.paddingBobbtom {
  /* padding-bottom: 10px; */
}
/* 弹窗自定义区域 */
</style>
