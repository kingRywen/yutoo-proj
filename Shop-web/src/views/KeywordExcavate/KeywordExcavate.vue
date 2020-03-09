<!-- 列表 -->
<template>
  <div class="___common" v-if="$route.name === 'KeywordExcavate'">
    <!-- {{userSelect}} -->
    <template>
      <el-search :search="search" :clearSearch.sync="clearSearch" :clearfield='clearfield' @searchTrueData='searchTrueData'></el-search>
    </template>
    <template>
      <el-handler :userSelect="userSelect" :hander="hander" :addShow.sync="options.visible"></el-handler>
    </template>
    <template>
      <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize"  :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
    </template>

    <!-- 添加任务 -->
    <template>
      <el-dialog-yt :options="options" :events="events">
        <div class="box __box_wrapper">
          <el-form size="small" :rules="rules" :model="excavateForm" ref="ruleForm">
            <el-form-item label="选择来源" prop="platformName" :label-width="formLabelWidth" style="width:100%">
              <el-select :popper-append-to-body="false" v-model.number="excavateForm.platformName" style="width:100%" size="mini">
                <el-option v-for="(item,index) in sourceData" :label="item.platformName" :value="item.platformId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 选择语言接口再是不对，没有后台数据接口， -->
            <el-form-item label="选择语言" prop="language" :label-width="formLabelWidth" v-if="languageShows" style="width:100%">
              <!-- {{excavateForm.language}} -->
              <el-select :popper-append-to-body="false" v-model="excavateForm.language" style="width:100%" size="mini">
                <el-option v-for="(item,index) in languageData" :label="item.languageName" :value="item.languageTypeId">
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="box">
              <el-form-item :label-width="formLabelWidth" v-if="keywordTypesBox" prop="keywordTypes" style="width:100%" label="选择类型">
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
              <el-form-item v-if="shendu" :label-width="formLabelWidth" :label="shendu_label+'深度' " prop="depth" style="width:100%">
                <el-select :popper-append-to-body="false" v-model="excavateForm.depth" style="width:100%" size="mini">
                  <el-option v-for="item in depths" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="keywords1" prop="keywords" label="关键词" :label-width="formLabelWidth" style="width:100%">
                <el-input type="textarea" :rows="4" :placeholder="placeholder" v-model.trim="excavateForm.keywords" style="width:100%" />
                <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
              </el-form-item>
            </div>
            <el-form-item v-if="keywords2" prop="keywords" label="产品id" :label-width="formLabelWidth" style="width:100%">
              <el-input type="textarea" :rows="4" placeholder="多个产品ID换行输入（1-500个）" v-model.trim="excavateForm.keywords" style="width:100%" />
              <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div>
            </el-form-item>

            <el-form-item prop="name" :label-width="formLabelWidth" style="width:100%" label="任务名称">
              <el-input v-model.trim="excavateForm.name" placeholder="最多输入30个字符" maxlength="30" style="width:100%" size="mini"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog-yt>
    </template>
  </div>
  <router-view v-else></router-view>
</template>

<script>
export default {
  components: {},
  provide() {
    return {
      getList: this.getList,
      deleteTask: this.deleteTask,
      addTask: this.addTask,
      edit__: this.edit__,
      refresh__: this.refresh__,
      check__: this.check__
    };
  },
  data() {
    // 自定义校验
    var validateKeyword = (rule, value, callback) => {
      if (!value) {
        this.keywordsArr = [];
        callback(new Error("输入不能为空"));
        return;
      }
      let val = value
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
    return {
	clearfield:['taskName','status','date'],
      // 搜索
      search: {
        loading: false,
        taskName: true,
        status: true,
        date: true
      },
      clearSearch: null,
      // 控件
      hander: {
        addTask: true,
        addButton: "添加任务",
        deleteTask: true
      },
      // 表格
      table: {
        loading: false,
        // rowKey: "taskId",
        rows: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          taskName: true,
          platformName: true,
          keywordTypes: true,
          keywordSrc1: true,
          status: true,
          createTime: true,
          resultTime: true,
          Handle: {
            // edit: true,
            refresh: true,
            check: true
          }
        }
      },
      userSelect: [],
      // 添加任务，编辑任务
      formLabelWidth: "90px", //label宽度
      options: {
        loading: false,
        visible: false,
        width: "500px",
        title: "添加任务",
        okBtnText: "确认",
        resetFields: () => {
          this.$refs.ruleForm.resetFields();
        }
      },
      events: {
        handleOkClick: this.addTask
      },
      // 定义添加任务的数据
      excavateForm: {
        type: null,
        platformId: this.platformId, //来源
        platformName: null,
        originId: null, // 来源id
        siteId: this.$store.state.common.siteId, //站点
        keywordTypes: [], //类型
        depth: null, //深度
        keywords: "", //关键词
        name: null,
        language: null //语言
      },
      // 来源
      sourceData: [],
      languageShows: false, //语言显示隐藏
      languageData: [], //语言数据
      keywordTypesBox: true, //类型
      typaArr: [], //类型
      min: 0,
      keywordsArr: [],
      max: Infinity,
      shendu: false,
      fontSum: 0,
      shendu_label: "", // 深度词前缀
      input: "", //任务名称
      checkList: [], //复选框
      checked: false, //是否tag词
      keywords1: true,
      keywords2: false,
      sourceWishShow1: true, //wish平台单选模式
      sourceWishShow2: false, //wish平台单选模式
      sourceWishShow3: false, //wish平台单选模式
      placeholder: "输入关键词", //提示
      depthBox: false, //深度
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
      box: true, //  是否tag词控制
      box3: false, //深度
      siteDatas: [], // 定义站点接收赋值
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
            trigger: ["change", "blur"]
          }
        ], //限定输入的个数]
        //深度
        // 关键词类型
        keywordTypes: [
          {
            required: true,
            message: "请选择关键词类型",
            trigger: ["blur"]
          }
        ],
        name: [
          {
            required: true,
            max: 30,
            message: "请输入任务名称",
            trigger: ["blur", "change"]
          }
        ],


        searchTrueDatas:'',//
      }
    };
  },
  created() {
    if (this.sellerId && this.siteId) {
      this.getList();
    }
    this.getSourceList(); //来源
    this.getKeywordTypeList(1); //关键词类型
    this.getlanguageList(); //语言
  },
  mounted() {},
  methods: {
    searchTrueData(v){
      delete v.pageNumber
      delete v.pageSize
      this.searchTrueDatas = v;
      console.log(this.searchTrueDatas);
    },
    // 列表
    getList(arg) {
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        platformId: this.platformId, //上线要改
        siteId: this.siteId, //上线要改
        sellerId: this.sellerId, //上线要改
        ...arg,
        ...this.searchTrueDatas
      };
      // 如果与日期，要分开赋值
      if (params.date) {
        params.startTime = params.date[0];
        params.endTime = params.date[1];
      }
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["KeywordExcavateList"](params)
        .then(data => {
          this.table.loading = false;
          data.rows.forEach(item => {
            item.keywordTypes = item.keywordTypes.split(",");
          });
          this.table.rows = data.rows;
          // console.log(data.rows == "");
          this.table.pageNumber = data.pageNo;
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          return true;
        })
        .catch(err => {
          console.log(err);
          this.table.loading = false;
          return true;
        });
    },
    // 添加
    addTask() {
     
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let a = this.checkList;
          this.keywordTypes = [Number(a)];
          let b = [this.excavateForm.keywords];
          let params = {
            originId: this.excavateForm.platformName,
            language: this.excavateForm.language,
            platformId: this.platformId, //上线要改
            siteId: this.siteId, //上线要改
            sellerId: this.sellerId, //上线要改
            keywordTypes: this.excavateForm.keywordTypes,
            depth: this.excavateForm.depth, //深度
            keywords: this.excavateForm.keywords.split("\n"), //去除换行
            taskName: this.excavateForm.name //任务名称
          };
          params.keywords = [...new Set(this.keywordsArr)];
          params = { ...params };
          params = this.$.dealObjectValue(params);
          // wish单选的时候导致this.excavateForm.keywordTypes从【】变成数字。多选的时候是【】，所有判断如果是数字，则变成数组
          if (typeof params.keywordTypes === "number") {
            params.keywordTypes = Array.of(params.keywordTypes);
          }
          this.options.loading = true; // 按钮loading
          this.$api["TaskKeywordDigSave"](params)
            .then(data => {
              this.options.loading = false;
              if (data.code == 0) {
                  // this.$refs["ruleForm"].resetFields(); //清除数据记录
                  // this.fontSum=0;
                // this.keywordsArr = [];
                this.options.visible = false; // 关闭弹窗
                this.clearSearch = new Date().getTime();
                return;
              }
            })
            .catch(err => {
              console.log(err, "err");
              this.options.loading = false;
            });
        }
      });
    },
    // 获取来源
    getSourceList() {
      let params = {
        pageNumber: 1,
        pageSize: 100
      };
      this.$api["PlatformAllList"](params).then(data => {
        this.sourceData = data.data;
         this.excavateForm.platformName = this.sourceData[0].platformId;

      });
    },
    // 关键词类型获取
    getKeywordTypeList(platformId) {
      platformId = Number(platformId);
      this.$api["KeywordTypeList"]({ platformId }).then(data => {
        let str = null;
        let arr = data.data;
        let newData = arr.map(item => {
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
    // 获取语言
    getlanguageList() {
      let params = {
        searchSites: 0
      };
      this.$api["TaskKeywordDigLanguageList"](params).then(data => {
        this.languageData = data;
      });
    },
    changeStatus(
      str = "请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号(最多500个)",
      type = true,
      language = false
    ) {
      this.placeholder = str;
      this.keywordTypesBox = type;
      this.languageShows = language;
    },
    // 删除
    deleteTask(arg) {
      let params = { taskIds: arg };
      return this.$api["DeleteExcavateList"](params)
        .then(data => {
          if (data.code === 0) {
            return true;
          } else {
            return false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑
    edit__(arg) {},
    // 重新抓取
    refresh__(arg) {
      // console.log(arg);
      let params = {
        taskId: arg.taskId
      };
      this.$confirm("此操作将重新抓取该项数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api["TaskKeywordDigReCrawl"](params).then(data => {
            this.clearSearch = new Date().getTime();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已放弃本次操作"
          });
        });
    },
    check__(arg) {
      // console.log(arg);
      let taskId = arg.taskId;
      let keywordTypes = arg.keywordTypes;
      let taskName = arg.taskName;
      this.$router.push({
        name: "KeywordExcavateDetail",
        query: {
          taskId: taskId,
          keywordTypes: keywordTypes,
          taskName: taskName,
          sellerId: this.sellerId,
          siteId: this.siteId
        }
      });
    }
  },
  computed: {},
  watch: {
    "options.visible"(){
       this.$refs["ruleForm"].resetFields(); //清除数据记录
       this.fontSum=0;
       this.excavateForm.platformName = this.sourceData[0].platformId;
    },
    sellerData() {
      this.table.pageNumber = 1;
      this.getList();
    },
    // 监听关键词 显示输入个数，和任务名称生成
    keywordsArr(val) {
      if (val.length) {
        // 自动生成任务名称
        // this.excavateForm.name = val[0] + " " + val.length;
        this.fontSum = val.length;
      } else {
        // this.excavateForm.name = null;
        this.fontSum = 0;
      }
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
          this.changeStatus("请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号(最多50个)", true, true);
          this.$set(this.rules, "language", {
            required: true,
            message: "请选择语言"
          });
          break;
        case 7:
          this.changeStatus("请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号(最多50个)", false, false);
          break;
        case 8:
          this.changeStatus("请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号(最多50个)", true, false);
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
  }
};
</script>

<style lang="less" scoped>
</style>
