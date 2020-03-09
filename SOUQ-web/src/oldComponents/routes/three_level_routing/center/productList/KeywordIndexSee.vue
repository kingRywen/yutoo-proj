<!-- 竞争者分析页面 -->
<template>
  <div class='KeywordIndexSee'>
    <el-row class='paddingBobbtom'>
    </el-row>
    <el-row :gutter="24" type='flex' justify="space-between">
      <el-col :span="15">
        <template>
          <div style="display:inline; margin-left:10px;">
            来源
            <span v-model="searchSites">{{searchSites}}</span>
          </div>
        </template>
      </el-col>
      <el-col :span="9" style="padding-bottom:20px;">

        <el-button type="success" icon="el-icon-search" style="margin-left:70%;" @click="onExport($event.currentTarget)">导出</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-row justify="space-between">
      <el-table :data="seeListData" style="width:100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" align="center">
        </el-table-column>
        <el-table-column label="搜索量" align="center">
          <el-table-column prop="searchGoogle" label="Google" align="center">
          </el-table-column>
          <el-table-column prop="searchAliexpress" label="速卖通" align="center">
          </el-table-column>
          <el-table-column prop="searchMerchantwords" label="merchantwords" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="productAmount" label="产品数量" align="center">
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="100" layout="prev, pager, next, jumper" :total="1000">
      </el-pagination>
    </div>
  </div>

</template>

<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'
import { mapActions, mapState, mapMutations } from "vuex";

const d = require("@/plugins/download.js");
export default {
  // components: {
  //   vieCheck
  // },
  data() {
    return {
      userSelect: [],
      searchSites: this.$route.query.searchSites,
      seeListData: [], //定义接收参数请求的数据

      analysisData: [], //导出选中数据
      // 来源定义数据
      StatusOptions: [
        {
          value: 0,
          label: "Google"
        },
        {
          value: 1,
          label: "速卖通"
        },
        {
          value: 2,
          label: "merchantwords"
        }
      ],
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
      addTask: false, //添加任务弹窗

      state: [],
      //  定义添加任务
      form: {
        platformId: null, //平台ID
        siteValue: [], // 站点
        sourceList: [], //来源列表
        keywords: "" //关键字
      },
      // 校验
      rules: {
        keywords: [
          { required: true, message: "请输入关键字", trigger: "blur" }
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
        searchKeywords: "",
        searchSources: "",
        searchStatus: ""
      },

      // 、、、、、、、、、、、、、、、、、、、

      // 来源
      originOptions: [
        {
          value: 0,
          label: "Google"
        },
        {
          value: 1,
          label: "速卖通"
        },
        {
          value: 2,
          label: "merchantwords"
        }
      ],
      // 时间段  选择日期
      tabPosition: "top",
      // 分页
      currentPage3: 1
    };
  },

  created() {
    this.getLists(); //获取查看列表
  },

  computed: {
    // 选品工具
    ...mapState("selectionTool", {
      getAnalysisList: state => state.getAnalysisList
    })
    //获取站点
    // ...mapState("shopAuthorization", {
    //   getSiteListData: state => state.getSiteLists
    // })
  },
  methods: {
    // 选品工具
    ...mapActions("selectionTool", ["getKeywordAnalysisListApi"]),
    ...mapMutations("selectionTool", {
      setWordList: "getAnalysisLists"
    }),

    // 获取查看列表
    getLists() {
      let params = {
        taskId: this.$route.query.id,
        searchSites: this.$route.query.searchSites,
        pageNumber: 1,
        pageSize: 10
      };
      debugger;
      this.$axios.post("/TaskKeywordCompeteRt/list", params).then(res => {
        console.log(res, "4444");
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
        if (res.data.rows.length) {
          this.seeListData = res.data.rows;
        }

        if (!res.data.rows.length) {
          this.$message.error("没有相关数据");
        }
      });
    },
    // 导出  关键词竞争分析导出
    onExport(x) {
      console.log(this.analysisData, "555");
      let a = this.analysisData;
      let s = new Set(a);
      let result = Array.from(s);
      console.log(result, "4444");
      this.$axios
        .post("/TaskKeywordCompeteRt/exportData", {
          taskRtIdArray: result
        })
        .then(res => {
          d.download(
            new Blob([res.data], { type: "application/vnd.ms-excel" }),
            "file.xls",
            "application/vnd.ms-excel"
          );
        });
    },
    // 弹窗中的级联类目选择
    handleChange(value) {
      console.log(value);
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.analysisData.push(item.taskRtId);
      });
    },
    // table的查看
    handleClick(index, rowDetail) {
      console.log(index, rowDetail);
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
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
