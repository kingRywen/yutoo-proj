<!-- 竞争者分析页面 -->
<template>
  <div class='keywordIndexContainer'>
    <!-- 添加任务 -->
    <el-button type="success" @click="onCategoryTask">添加任务</el-button>
    <el-dialog title="添加产品" :visible.sync="onCategoryTaskDiakig" style="min-width:1200px;padding-right:100px;" width="28%">
      <el-form :rules="rules" :model="siteForm" ref="ruleForm" style="width:100%; padding-right:100px; " label-position="left">
        <el-form-item label="选择站点: " prop="siteNames" :label-width="formLabelWidth">
          <el-select v-model="siteForm.siteNames">
            <el-option v-for="(item,index) in siteData" :label="item.siteName" :value="item.siteId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类目:" :label-width="formLabelWidth" prop="category">
          <div class="block">
            <el-cascader placeholder="可以输入或者点击选择" v-model="siteForm.category" :change-on-select="true" :options="skuListw" :props="props" @focus="getCategor" filterable style=" width:217px;"></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="页 数: " prop="pageList" :label-width="formLabelWidth" style="    margin-right: 18%;">
          <el-select v-model="siteForm.pageList" placeholder="请选择">
            <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer " style="padding: 0 100px 30px 20px;">
        <el-button type="primary" style="width:80%;" @click="addTaskSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-button type="success" plain @click="deleteList">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between" style="margin-top:10px">
      <!-- 输入框 -->
      <el-col :span="15">
        <el-input placeholder="请输入类目名称" v-model="searchLists.sku" clearable style='max-width:200px;' @change="newLists1()">
        </el-input>
        <!-- 选择来源 -->
        <!-- <el-select v-model="originValue" placeholder="选择来源" style='max-width:150px'>
          <el-option
            v-for="item in originOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <!-- 选择状态 -->
        <el-select v-model="searchLists.status" placeholder="选择状态" style='max-width:150px' clearable @change="newLists2()">
          <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" @click="searchData()">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <!-- 时间段选择 -->
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="currentTimeList()">
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

      <el-table-column prop="category" label="类目" align='center'>
        <template slot-scope="scope">
          {{scope.row.category.replace(":",">>")}}
        </template>
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
      <el-table-column prop="resultTime" label="结果生成时间" align='center'>
      </el-table-column>
      <el-table-column prop="handle" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.taskId,scope.row.category)" type="primary">查看</el-button>
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
      geQueryLists: [], //接收请求列表数据
      currentPage: null,
      pageSize: null,
      total: null,
      tabPosition: 1, //默认 选择今日

      searchLists: {
        sku: "",
        status: ""
      },
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
        siteNames: [{ required: true, message: "请选择站点", trigger: "blur" }],
        category: [{ required: true, message: "请选择类目", trigger: "blur" }],
        pageList: [{ required: true, message: "请选择页数", trigger: "blur" }]
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

      // 类目选择
      props: {
        value: "name",
        children: "recursionList",
        label: "name"
        //  value: "categoryName",
      },
      deleteData: [], //定义删除的列表
      // 定义添加任务的数据
      siteForm: {
        platformId: this.$store.state.selectPlatform.platformId,

        siteNames: null, //站点
        category: null, //类目
        pageList: null //页数
      },
      // 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

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

      // 表格数据

      // 放删除选中的数组
      multipleSelection: []
      // 分页
    };
  },
  created() {
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      pageNumber: 1,
      pageSize: 10
    };
    this.getCategoryApi(this.params); //请求类目查询列表
    this.getCategorList(); //请求站点
    this.getCategor(); //添加类目
  },

  computed: {
    // ...mapState("selectionTool", {
    //   getCategory: state => state.getCategorys
    // })
    // })
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
  },
  watch: {
    platformId(val) {
      this.getCategoryApi({ ...this.params, platformId: val });
    }
  },
  methods: {
    newLists1() {
      this.getCategoryApi(this.params); //请求类目查询列表
    },
    newLists2() {
      this.getCategoryApi(this.params); //请求类目查询列表
    },
    // ...mapActions("selectionTool", ["getCategoryListApi"]),
    // ...mapMutations("selectionTool", {
    //   setWordList: "getCategoryLists"
    // }),
    // 请求列表
    getCategoryApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/TaskCategoryQuery/list", params).then(res => {
        // console.log(res, "444");
        this.currentPage = res.data.pageNo;
        this.pageSize = res.data.pageSize;
        this.total = res.data.total;
        this.geQueryLists = res.data.rows;
      });
    },
    // 分页 改变条数
    handleSizeChange(val) {
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //页数
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getCategoryApi(params);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize, //条数
        pageNumber: val, //页数
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getCategoryApi(params);
    },
    // 根据日期选择列表数据
    currentTimeList() {
      let a = Number(this.tabPosition);

      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage
      };
      this.getCategoryApi(params);
    },
    // 类目排名添加  类目获取
    getCategor() {
      if (this.skuListw.length) {
        return;
      }
      console.log(this.$store.state.selectPlatform.platformId, "11111111111");
      let params = {
        platformId: this.$store.state.selectPlatform.platformId
      };

      this.$axios.post("/TaskCategoryRank/getCategory", params).then(res => {
        if (res.data.code == 0) {
          console.log(res, 22222222);
          console.log(res.data.data, 3333333333);
          this.skuListw = res.data.data;
          // console.log(this.skuList, "4545");
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    //添加任务
    addTaskSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let a = this.siteForm.category;
          let b = a.join(":");
          let params = {
            merchantId: 4,
            platformId: this.$store.state.selectPlatform.platformId,
            siteId: this.siteForm.siteNames,
            category: b,

            searchPages: this.siteForm.pageList
          };
          this.$axios.post("/TaskCategoryQuery/save", params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$refs[formName].resetFields(); //清除数据记录
              this.onCategoryTaskDiakig = false; //关闭弹窗
              this.getCategoryApi(); //请求类目查询列表
              return;
            }
            if (res.data.code == 500) {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    //  删除列表
    deleteList() {
      if (this.userSelect.length) {
        let a = this.deleteData;
        let s = new Set(a);
        let result = Array.from(s);
        this.$axios
          .post("/TaskCategoryQuery/remove", { taskIds: result })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getCategoryApi(this.params); //请求类目查询列表
              this.deleteData = [];
            }
            if (res.data.code == 500) {
              this.$message.error("内部服务错误，请联系管理员");
            }
          });
      } else {
        this.$message({
          message: "至少需要选择一个",
          type: "warning"
        });
      }
    },
    // 搜索
    searchData() {
      if (
        this.searchLists.sku ||
        this.searchLists.status ||
        this.searchLists.status === 0
      ) {
        this.recordSearch(this.searchLists.sku, this.searchLists.status);
      }
    },
    // 记录搜索值
    recordSearch(sku, status) {
      let a = this.searchLists.sku;
      let b = a.replace(/[>]{2}/gi, ","); //将>>转译成 ,  间隔

      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        categorys: b,
        status: this.searchLists.status
      };

      this.$axios.post("/TaskCategoryQuery/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.currentPage = res.data.pageNo;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.geQueryLists = res.data.rows;

          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查询到相关的数据");
          return;
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
    // 点击添加弹窗
    onCategoryTask() {
      this.onCategoryTaskDiakig = true;
    },
    //获取站点
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

    // table的查看
    handleClick(taskId, category) {
      this.$router.push({
        path: "/admin/center/CatalogQuerySee",
        query: {
          taskId,
          category
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
