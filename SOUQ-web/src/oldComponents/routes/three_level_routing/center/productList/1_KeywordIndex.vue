<!-- 竞争者分析页面 -->
<template>
  <div class='keywordIndexContainer'>

    <el-row class='paddingBobbtom'>
      <el-button type="success" @click="onaddTask">添加任务</el-button>
      <el-dialog title="添加产品" :visible.sync="addTask" style="min-width:1200px;padding-right:100px;" width="527px">
        <el-form :rules="rules" :model="form" ref="ruleForm" style="width:100%; padding-right:100px; ">
          <el-form-item label="选择站点: " prop="siteValue" :label-width="formLabelWidth" style=" width:417px">
            <el-select v-model="form.siteValue">
              <el-option v-for="(item,index) in siteData" :label="item.siteName" :value="item.siteId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=":选择来源 " prop="sourceList" :label-width="formLabelWidth">
            <!-- <span style="line-height:80px;margin-right:10px; pading-top:20px; height:40px;">选择来源:</span> -->
            <!-- {{form.sourceList}} -->
            <el-checkbox-group v-model="form.sourceList" style="margin-top:20px;">
              <el-checkbox v-for="item in StatusOptions" :label="item.value" :key='item.value'>{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="关键词: " prop="keywords" :label-width="formLabelWidth" style=" width:417px">
            <el-input type="textarea" v-model="form.keywords" />
          </el-form-item>
          <el-form-item label="任务名称:" :label-width="formLabelWidth" style="width:417px">
            <el-input type="textarea" v-model="form.taskName" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" style="width:100%;" @click="addTaskSubmit('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="success" plain @click="deleteAnalysisList()">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 -->
      <el-col :span="15">
        <el-input placeholder="请输关键字" v-model="analysisSearchData.keywords" clearable style='max-width:200px;' @change="newLists1()">
        </el-input>
        <!-- 选择来源 -->
        <el-select v-model="analysisSearchData.searchSites" placeholder="选择来源" style='max-width:150px' clearable @change="newLists2()">
          <el-option v-for="item in originOptions" :label="item.label" :value="item.value" :collapse-tags="true">
          </el-option>
        </el-select>
        <!-- 选择状态 -->
        <el-select v-model="analysisSearchData.status" placeholder="选择状态" style='max-width:150px' clearable @change="newLists3()">
          <el-option v-for="item in processingState" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="onSearch()">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <!-- 时间段选择 -->

        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="currentData">
          <el-radio-button label="1">今日</el-radio-button>
          <el-radio-button label="7">7天</el-radio-button>
          <el-radio-button label="30">30天</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table stripe ref="multipleTable" :data="getAnalysisList" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="taskName" label="任务名称" align='center'>
      </el-table-column>
      <el-table-column prop="siteName" label="站点" align='center'>
      </el-table-column>
      <el-table-column prop="searchSites" label="来源" align='center'>
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.searchSites=='0'">谷歌 </span>
          <span v-if="scope.row.searchSites=='1'">素描通 </span>
          <span v-if="scope.row.searchSites=='2'">亚马逊 </span>
        </template> -->
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态" align='center'>
      </el-table-column> -->
      <el-table-column prop="status" label="状态" align='center'>

        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">待处理</span>
          <span v-if="scope.row.status=='1'">处理成功</span>
          <span v-if="scope.row.status=='2'">处理失败</span>
        </template>
      </el-table-column>
      </el-table-column>

      <el-table-column prop="handle" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.taskId,scope.row.searchSites)" type="primary">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>

      <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 30, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
      </el-pagination> -->
      <!-- <el-pagination class="pull-right clearfix" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNo" :page-sizes="pageSizesList" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalDataNumber">
      </el-pagination> -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
import qs from "qs";
import _keyQueryVue from "./2_keyQuery.vue";
// import { trimAll } from "@/plugins/utils";

export default {
  // components: {
  //   vieCheck
  // },
  data() {
    return {
      userSelect: [],
      getAnalysisList: [], //请求过来的列表数据
      // pageNo: 1, //页数
      // pageSize: 10, //每页显示的条数
      // pageSizesList: [10, 15, 20, 30, 50], //选择的条数
      // tableData: [], //返回的结果集合
      // totalDataNumber: 0, //总条数,

      currentPage: null, //分页
      total: null, //总条数
      pageSize: null, //每页条数

      analysisData: [], //分析列表删除
      // 来源定义数据
      StatusOptions: [
        {
          value: "Google",
          label: "Google"
        },
        {
          value: "速卖通",
          label: "速卖通"
        },
        {
          value: "merchantwords",
          label: "merchantwords"
        }
      ],
      // 状态数据
      processingState: [
        {
          value: 0,
          label: "待处理"
        },
        {
          value: 1,
          label: "处理成功"
        },
        {
          value: 2,
          label: "处理失败"
        }
      ],
      addTask: false, //添加任务弹窗

      state: [],
      //  定义添加任务
      form: {
        platformId: null, //平台ID
        siteValue: [], // 站点
        sourceList: [], //来源列表
        keywords: "", //关键字
        taskName: null
      },
      // 校验
      rules: {
        keywords: [
          { required: true, message: "请输入关键字", trigger: "blur" },
          { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" }
        ],
        sourceList: [
          { required: true, message: "请选择来源", trigger: "blur" }
        ],
        siteValue: [
          { required: true, message: "请选择站点", trigger: "change" }
        ]
      },
      formLabelWidth: "120px",
      analysisSearchData: {
        keywords: "",
        searchSites: "",
        status: ""
      },

      // 、、、、、、、、、、、、、、、、、、、

      dialogFormVisible: false,

      siteData: [], // 定义站点接收赋值

      selectedOptions: [], // 级联选择最后结果数组
      // 弹窗中的搜索页数
      pageOptions: [
        {
          value: "选项1",
          label: "1"
        }
      ],
      pageValue: "",

      // 来源
      originOptions: [
        {
          value: "Google",
          label: "Google"
        },
        {
          value: "速卖通",
          label: "速卖通"
        },
        {
          value: "merchantwords",
          label: "merchantwords"
        }
      ],
      // 时间段  选择日期
      tabPosition: 1,
      // 分页
      currentPage3: 1
    };
  },
  created() {
    // this.getKeywordAnalysisListApi(); //关键词竞争分析列表

    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      pageNumber: 1,
      pageSize: 10
    };
    this.getKeywordApi(this.param); //关键词竞争分析列表
    this.getCategorList(); //获取站点
  },

  computed: {
    // id() {
    //   return this.$store.state.selectPlatform.platformId;
    // }
    // 选品工具
    // ...mapState("selectionTool", {
    //   getAnalysisList: state => state.getAnalysisList
    // })
    //获取站点
    // ...mapState("shopAuthorization", {
    //   getSiteListData: state => state.getSiteLists
    // })

    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
  },
  watch: {
    platformId(val) {
      this.getKeywordApi({ ...this.params, platformId: val });
    }
  },
  methods: {
    newLists1() {
      this.getKeywordApi(this.param); //关键词竞争分析列表
    },
    newLists2() {
      this.getKeywordApi(this.param); //关键词竞争分析列表
    },
    newLists3() {
      this.getKeywordApi(this.param); //关键词竞争分析列表
    },
    // getKeywordApi() {
    //   let params = {
    //     platformId: 2,
    //     pageNumber: 1,
    //     pageSize: 10
    //   };
    //   this.$axios
    //     .get("/taskKeywordCompete/list", { params: params })
    //     .then(res => {
    //       this.getAnalysisList = res.data.rows;
    //     });
    // },
    // 根据时间选择数据 今日 7日  30日
    currentData() {
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };
      return this.getKeywordApi(params);
    },
    // 请求列表
    getKeywordApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      //debugger;
      this.$axios.post("/TaskKeywordCompete/list", params).then(res => {
        // console.log(res);
        this.currentPage = res.data.pageNo; //分页
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.getAnalysisList = res.data.rows;
      });
    },

    //改变每页显示数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val,
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };

      this.getKeywordApi(params);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);

      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.selectPlatform.platformId
      };

      this.getKeywordApi(params);
    },

    //  改变页码的请求

    // getAndDraw(params) {
    //   this.$axios.get("/taskKeywordCompete/list", params).then(res => {
    //     if (resp.data.Data.Result.length > 0) {
    //       this.tableData = resp.data.Data.Result;
    //       this.totalDataNumber = resp.data.Data.Total;
    //       this.listLoading = false;
    //     } else {
    //       this.tableData = [];
    //       this.totalDataNumber = 0;
    //     }
    //   });
    // },

    // 选品工具
    // ...mapActions("selectionTool", ["getKeywordAnalysisListApi"]),
    ...mapMutations("selectionTool", {
      setWordList: "getAnalysisLists"
    }),
    //获取站点
    // ...mapActions("shopAuthorization", ["getSiteApi"]),
    // ...mapMutations("shopAuthorization", {
    //   setWordLists: "getSiteList"
    // }),

    onaddTask() {
      this.keywords = "111";
      this.sku = "";
      this.addTask = true;
    },
    // 获取站点方法
    getCategorList() {
      // console.log(this.getAnalysisList, "888");
      let params = {
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.$axios.post("/TaskSiteShare/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.siteData = res.data;
        // console.log(res.data);
      });
    },
    //添加任务-  关键字分析添加任务
    addTaskSubmit(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // let arr = this.form.sourceList;
          let str = this.form.keywords;
          let result = this.trimAll(str, "g");
          let params = {
            platformId: this.$store.state.selectPlatform.platformId,
            siteId: this.form.siteValue,
            searchSites: this.form.sourceList,
            // alue.split("").join("\n");
            keywords: this.form.keywords.split("\n"),
            taskName: this.form.taskName
          };

          _this.$axios.post("/TaskKeywordCompete/save", params).then(
            res => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$refs[formName].resetFields();
                this.addTask = false;
                //
                this.getKeywordApi(); //关键词竞争分析列表
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
    //删除列表   竞争分析列表
    deleteAnalysisList() {
      if (this.userSelect.length) {
        let a = this.analysisData;
        let s = new Set(a);
        let result = Array.from(s);
        // console.log(result, "7777");
        this.$axios
          .post("/TaskKeywordCompete/remove", { taskIds: result })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getKeywordApi(); //关键词竞争分析列表
              this.analysisData = [];
            }
            if (res.data.code == 500) {
              this.$message.error(res.data.msg);
              this.taskIds = [];
            }
          });
      } else {
        this.$message({
          message: "至少需要选择一个",
          type: "warning"
        });
      }

      // analysisData;
    },
    // 搜索
    onSearch() {
      if (
        this.analysisSearchData.keywords ||
        this.analysisSearchData.searchSites ||
        this.analysisSearchData.status ||
        this.analysisSearchData.status == 0
      ) {
        this.recordSearch(
          this.analysisSearchData.keywords,
          this.analysisSearchData.searchSites,
          this.analysisSearchData.status
        );
      }
    },
    // 记录搜索值
    recordSearch(keywords, searchSites, status) {
      let aaa = keywords;
      // let b = aaa.split();

      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        // taskName: JSON.stringify(aaa),
        taskName: aaa,
        searchSites: this.analysisSearchData.searchSites,
        status: this.analysisSearchData.status
      };

      this.$axios.post("/TaskKeywordCompete/list", params).then(res => {
        // if (res.data.code == 500) {
        //   this.$message.error(res.data.msg);
        //   return;
        // }
        if (res.data.rows.length) {
          // this.setWordList(res.data.rows);
          this.currentPage = res.data.pageNo; //分页
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.getAnalysisList = res.data.rows;
          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查询到相关的数据");
          return;
        }
      });
    },
    // 弹窗中的级联类目选择
    handleChange(value) {
      console.log(value);
    },
    // 关闭弹窗前的提示
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    // table选中
    handleSelectionChange(val) {
      console.log(val, "55555555555");
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.analysisData.push(item.taskId);
      });
    },

    // table的查看
    handleClick(taskId, searchSites) {
      this.$router.push({
        path: "/admin/center/KeywordIndexSee",
        query: {
          id: taskId,
          searchSites: searchSites
        }
      });
    }
  }
};
</script>

<style scoped>
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
/* 弹窗自定义区域 */
</style>
