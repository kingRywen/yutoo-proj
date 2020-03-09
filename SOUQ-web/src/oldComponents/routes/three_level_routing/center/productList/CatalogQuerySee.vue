<!-- 类目查询查看 -->
<template>
  <div class='CatalogQuerySee'>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between" style="padding-bottom:10px;">
      <!-- 输入框 -->
      <el-col :span="20">

        类目
        <span v-model="category">{{category}}</span>

      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="onExport()">导出</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="catalogSeeData" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="id" label="图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题">
      </el-table-column>
      <el-table-column prop="sku" label="ASIN">
      </el-table-column>
      <el-table-column prop="releaseDate" sortable label="上架时间">
      </el-table-column>
      <el-table-column prop="reviewCnt" sortable label="评分数">
      </el-table-column>
      <el-table-column prop="starCnt" sortable label="评分">
      </el-table-column>
      <el-table-column prop="rank" sortable label="BSR排名">
      </el-table-column>
    </el-table>
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
export default {
  // components: {
  //   vieCheck
  // },
  data() {
    return {
      catalogSeeData: [], //请求查看列表的数据
      category: this.$route.query.category,
      onCategoryTaskDiakig: false, //添加任务弹窗
      // 添加任务弹窗数据
      queryForm: {
        platformId: this.$store.state.selectPlatform.platformId,

        siteValue: null, // 站点
        pageValue: null, //页数
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
      formLabelWidth: "120px", //公用宽度
      siteData: [], // 定义站点接收赋值
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

      skuListw: [], //定义添加任务的类目类别
      props: {
        value: "categoryId",
        children: "recursionList",
        label: "categoryName"
        //  value: "categoryName",
      },
      // 类目选择
      props: {
        value: "categoryId",
        children: "recursionList",
        label: "categoryName"
        //  value: "categoryName",
      },
      selectData: [], //选中的ID
      // 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
      // 关键词
      inputText: "",
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
      StatusOptions: [
        {
          value: "选项1",
          label: "抓取中"
        },
        {
          value: "选项2",
          label: "抓取成功"
        }
      ],
      StatusValue: "",
      // 时间段
      tabPosition: "top",
      // 表格数据

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1
    };
  },
  created() {
    this.getLists(); // 请求查看列表

    // this.$store.dispatch("menu/addCompeteKeywordAnalysisApi", {
    //   platformId: 7,
    //   merchantId: 5,
    //   siteId: 6,
    //   searchSites: "0,1,2",
    //   keywords: ["keyword", "keyword", "keyword", "keyword", "keyword"]
    // });
  },

  computed: {
    // ...mapState("selectionTool", {
    //   getCategory: state => state.getCategorys
    // })
  },
  methods: {
    // ...mapActions("selectionTool", ["getCategoryListApi"]),
    // ...mapMutations("selectionTool", {
    //   setWordList: "getCategoryLists"
    // }),

    //获取查看列表
    getLists() {
      let params = {
        taskId: this.$route.query.taskId,
        category: this.$route.query.category,
        pageNumber: 1,
        pageSize: 10
      };
      console.log(params, "参数");
      this.$axios
        .get("/TaskCategoryQueryRt/list", { params: params })
        .then(res => {
          if (res.data.code == 500) {
            this.$message.error(res.data.msg);
          }
          if (res.data.rows.length) {
            this.catalogSeeData = res.data.rows;
          }

          if (!res.data.rows.length) {
            this.$message.error("没有相关数据");
          }
        });
    },
    //导出   --选品工具---类目查询--查看---导出
    onExport() {
      let a = this.selectData;
      let s = new Set(a);
      let result = Array.from(s);
      console.log(result, "4444");

      this.$axios
        .get("/TaskCategoryQueryRt/exportData", { taskRtIdArray: result })
        .then(res => {
          if (res.data) {
            //成功返回的数据
            window.open(
              "http://192.168.0.101:8080/img//exportData/10002?token=" +
                localStorage.getItem("token")
            );
            this.$message({
              message: res.data.msg,
              type: "success"
            });

            return;
          } else if (res.data.code == 500) {
            this.$message.error(res.data.msg);
            return;
          }
        });
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.selectData.push(item.taskId);
      });
    },
    // // 点击添加弹窗
    // onCategoryTask() {
    //   this.onCategoryTaskDiakig = true;
    // },
    //获取站点
    // 获取站点方法
    // getCategorList() {
    //   // console.log(this.getAnalysisList, "888");
    //   let params = {
    //     platformId: 2
    //   };
    //   this.$axios.get("/taskSiteShare/list", { params: params }).then(res => {
    //     if (res.data.code == 500) {
    //       this.$message.error(res.data.msg);
    //       return;
    //     }
    //     this.siteData = res.data;
    //     console.log(res.data);
    //   });
    // },

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
</style>
