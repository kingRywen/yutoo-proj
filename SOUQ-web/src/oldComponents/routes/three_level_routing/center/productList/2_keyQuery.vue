<!-- 关键字查询 -->
<template>
  <div class="keyQuerys">
    <el-button type="success" @click="onaddKeywordTask">添加任务</el-button>

    <el-dialog title="添加产品" :visible.sync="addKeywordDialog" style="min-width:1200px;padding-right:100px;" width="437px">
      <el-form :rules="rules" :model="queryForm" ref="ruleForm" style="width:100%; padding-right:100px; ">
        <el-form-item label="选择站点: " prop="siteValue" :label-width="formLabelWidth">
          <el-select v-model="queryForm.siteValue">
            <el-option v-for="(item,index) in siteData" :label="item.siteName" :value="item.siteId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关键词: " prop="keywords" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="queryForm.keywords" style="width:217px;" />
        </el-form-item>

        <el-form-item label="页数: " prop="pageValue" :label-width="formLabelWidth">
          <el-select v-model="queryForm.pageValue" placeholder="请选择">
            <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
        <el-button type="primary" style="width:100%;" @click="addTaskSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-button type="success" plain @click="deleteList()">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between" style="margin-top:10px">
      <!-- 输入框 -->
      <el-col :span="15">
        <el-input placeholder="请输入关键字" v-model="searchListData.keyword" clearable style='max-width:200px;' @change="newLists1()">
        </el-input>

        <el-select v-model="searchListData.status" placeholder="选择状态" style='max-width:150px' clearable @change="newLists2()">
          <el-option v-for="item in keywordsOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="searchData()">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <!-- 时间段选择 -->
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="currentTimeData">
          <el-radio-button label="1">今日</el-radio-button>
          <el-radio-button label="7">7天</el-radio-button>
          <el-radio-button label="30">30天</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table stripe ref="multipleTable" :data="geQueryLists" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>

      <el-table-column prop="keyword" label="关键词" align='center'>
      </el-table-column>
      <el-table-column prop="siteName" label="站点" align='center'>
      </el-table-column>
      <el-table-column prop="status" label="状态" align='center'>

        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">待处理</span>
          <span v-if="scope.row.status=='1'">处理成功</span>
          <span v-if="scope.row.status=='2'">处理失败</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="结果生成时间" align='center'>
      </el-table-column>

      <el-table-column prop="handle" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.taskId,scope.row.keyword)" type="primary">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'

import { mapActions, mapState, mapMutations } from "vuex";

export default {
  // components: {
  //   vieCheck
  // },
  data() {
    return {
      userSelect: [],
      currentPage: null, //分页
      total: null, //总条数
      pageSize: null, //每页条数

      geQueryLists: [], //定义列表数据
      deleteData: [], //选中定义的数据
      addKeywordDialog: false, //定义添加任务弹窗

      queryForm: {
        platformId: this.$store.state.selectPlatform.platformId,

        siteValue: null, // 站点
        pageValue: null, //页数
        keywords: "" //关键字
      },

      // 状态数据
      processingState: [
        {
          value: 1,
          label: "待处理"
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

      // 校验
      rules: {
        keywords: [
          { required: true, message: "请输入关键字", trigger: "blur" },
          { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" }
        ],
        pageValue: [{ required: true, message: "请选择页数", trigger: "blur" }],
        siteValue: [
          { required: true, message: "请选择站点", trigger: "change" }
        ]
      },
      formLabelWidth: "120px",
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
        keywords: "" //关键字
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

      ////////////////////////////////////////
      dialogFormVisible: false,

      // 来源
      originOptions: [
        {
          value: "选项1",
          label: "Google"
        },
        {
          value: "选项2",
          label: "速卖通"
        },
        {
          value: "选项3",
          label: "merchantwords"
        }
      ],
      originValue: "",
      // 状态
      keywordsOptions: [
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
      StatusValue: "",
      // 时间段
      tabPosition: 1
    };
  },

  created() {
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      pageNumber: 1,
      pageSize: 10
    };
    this.getQueryListApi(this.params); //获取列表
    this.getCategorList(); //获取站点
  },
  computed: {
    // ...mapState("selectionTool", {
    //   geQueryLists: state => state.geQueryList
    // })
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
  },
  watch: {
    platformId(val) {
      this.getQueryListApi({
        ...this.params,
        platformId: val
      });
    }
  },
  methods: {
    newLists1() {
      this.getQueryListApi(this.param); //关键词竞争分析列表
    },
    newLists2() {
      this.getQueryListApi(this.param); //关键词竞争分析列表
    },
    // ...mapActions("selectionTool", ["getKeywordQueryListApi"]),
    ...mapMutations("selectionTool", {
      setWordList: "getKeywordList"
    }),
    // 请求列表   注意参数要写到函数内
    getQueryListApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/TaskKeywordQuery/list", params).then(res => {
        console.log(res);
        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.geQueryLists = res.data.rows;
      });
    },
    // 分页 改变条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getQueryListApi(params);
    },
    // 改变页数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getQueryListApi(params);
    },
    currentTimeData() {
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };
      console.log(params);
      return this.getQueryListApi(params);
    },
    //点击添加任务按钮
    onaddKeywordTask() {
      this.addKeywordDialog = true;
    },
    //添加任务  关键字查询任务添加
    addTaskSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            platformId: this.$store.state.selectPlatform.platformId,
            siteId: this.queryForm.siteValue,
            keyword: this.queryForm.keywords.split("\n"),
            searchPages: this.queryForm.pageValue
          };
          this.$axios.post("/TaskKeywordQuery/save", params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
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
        console.log(res.data);
      });
    },
    //删除
    deleteList() {
      if (this.userSelect.length) {
        let a = this.deleteData;
        let s = new Set(a);
        let result = Array.from(s);
        this.$axios
          .post("/TaskKeywordQuery/remove", { taskIds: result })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getQueryListApi(this.param); //关键词竞争分析列表
              this.deleteData = [];
            }
          });
      } else {
        this.$message({
          message: "至少需要选择一个",
          type: "warning"
        });
      }
    },
    //搜索
    searchData() {
      if (
        this.searchListData.keyword ||
        this.searchListData.status ||
        this.searchListData.status === 0
      ) {
        this.recordSearch(
          this.searchListData.keyword,
          this.searchListData.status
        );
      }
    },
    recordSearch(keyword, status) {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        keyword,
        status
      };
      this.$axios.post("/TaskKeywordQuery/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.currentPage = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.geQueryLists = res.data.rows;
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
        this.deleteData.push(item.taskId);
      });
    },
    // table删除
    // deleteRow(tableData) {
    //   console.log(tableData);
    //   tableData.splice(
    //     tableData.splice(tableData.findIndex(item => item.name === "美国"))
    //   );

    // },
    // table的查看
    handleClick(taskId, keyword) {
      this.$router.push({
        path: "/admin/center/keyQuerySee",
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
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
</style>
