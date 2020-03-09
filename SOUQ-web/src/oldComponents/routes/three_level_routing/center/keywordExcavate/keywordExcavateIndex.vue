<!-- 关键词挖掘主页 -->
<template>
  <div class='keywordIndexContainer'>
    <el-row class='paddingBobbtom'>
      <!-- 添加任务 -->
      <el-button type="success" @click="onExcavateTask">添加任务</el-button>

      <!-- 添加任务弹窗 -->
      <el-dialog title="添加产品" :visible.sync="onExcavateTaskDiakig" style="min-width:1200px;padding-right:100px;" width="35%">
        <el-form :rules="rules" :model="excavateForm" ref="ruleForm" style="width:100%; ">
          <el-form-item label="选择站点: " prop="siteId" :label-width="formLabelWidth">

            <el-select v-model="excavateForm.siteId">
              <el-option v-for="(item,index) in siteDatas" :label="item.siteName" :value="item.siteId">
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="是否tag词: " :label-width="formLabelWidth" style="posttion:absolute;left:10px;top:10px;">
            <el-checkbox v-model="checked" @change="selectedEvents"></el-checkbox>
          </el-form-item>

          <div v-show="box">
            <el-form-item :label-width="formLabelWidth" prop="keywordTypes" label="选择类型: ">
              <el-checkbox-group v-model="excavateForm.keywordTypes">
                <el-checkbox label=0>相关词 </el-checkbox>
                <el-checkbox label=1>下拉词 </el-checkbox>
                <el-checkbox label=2>联想词</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" v-if="depthBox" prop="depth">
              深度{{excavateForm.depth}}
              <el-select v-model="excavateForm.depth" style='max-width:150px'>
                <el-option v-for="item in depth" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            {{excavateForm.keywords}}
            <el-form-item prop="keywords" label="关键词: " :label-width="formLabelWidth" style="margin-right: 18%;">
              <el-input type="textarea" v-model="excavateForm.keywords" />
            </el-form-item>

          </div>

          <div v-show="box3">
            {{excavateForm.keywords}}

            <el-form-item label="商品id:" :label-width="formLabelWidth" style="    margin-right: 18%;" prop="keywords">
              <el-input type="textarea" v-model="excavateForm.keywords" />
            </el-form-item>

          </div>

          <el-form-item :label-width="formLabelWidth" style="padding-right:15%;" label="任务名称: ">

            <el-input v-model="excavateForm.name" placeholder="请输入内容"></el-input>

          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" style="width:100%;" @click="addTaskSubmit('ruleForm',)">确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="success" plain @click="deleteList()">删除</el-button>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 -->
      {{searchData.keyword}}
      <el-col :span="15">
        <el-input placeholder="输入关键词名称" prop="" v-model="searchData.keyword" clearable style='max-width:200px;' @change="newLists1()">
        </el-input>
        <!-- 选择来源 -->
        <el-select v-model="searchData.site" placeholder="选择站点" style='max-width:150px' clearable @change="newLists2()">
          <el-option v-for="item in siteDataList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 选择类型 -->
        <el-select v-model="searchData.type" placeholder="选择类型" style='max-width:150px' clearable @change="newLists3()">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 选择状态 -->
        <el-select v-model="searchData.status" placeholder="选择状态" style='max-width:150px;margin-top:10px;,' clearable @change="newLists4()">
          <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 搜索按钮 -->
        <el-button type="success" icon="el-icon-search" style="margin-bottom:10px;" @click="searchLists()">搜索</el-button>
      </el-col>
      <el-col :span="9">
        <!-- 时间段选择 -->
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="changeTime()">
          <el-radio-button label="1">今日</el-radio-button>
          <el-radio-button label="7">7天</el-radio-button>
          <el-radio-button label="30">30天</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table stripe ref="multipleTable" :data="getKeywordMiningData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="taskName" label="任务名称" align='center'>
      </el-table-column>
      <el-table-column prop="siteName" label="站点" align='center'>
      </el-table-column>
      <el-table-column label="类型" align='center'>
        <template slot-scope="scope">
          <template v-for="item in scope.row.keywordTypes">
            <span v-if="item==0">相关词</span>
            <span v-if="item==1">下拉词</span>
            <span v-if="item==2">联想词</span>
          </template>
        </template>

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
          <el-button @click="handleClick(scope.row.taskId)" type="primary">查看</el-button>
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
      total: null, //总条数
      currentPage: null, //分页
      pageSize: null, //每页条数
      tabPosition: 1, //默认今日列表
      getKeywordMiningData: [], //列表数据
      input: "", //任务名称
      checkList: [], //复选框
      checked: false, //是否tag词
      // checked: false, //相关词
      // checked: false, //下拉词
      box: true, //  是否tag词控制
      depthBox: false, //深度
      box3: false, //深度
      // checked3: false, //商品ID
      onExcavateTaskDiakig: false, //添加任务弹窗
      // 定义添加任务的数据
      excavateForm: {
        platformId: this.$store.state.selectPlatform.platformId,
        siteId: null, //站点
        keywordTypes: [], //类型
        depth: null, //深度
        keywords: "", //关键字
        name: null
      },
      formLabelWidth: "120px", //公用宽度
      skuListw: [], //定义添加任务的类目类别
      props: {
        value: "categoryId",
        children: "recursionList",
        label: "categoryName"
        //  value: "categoryName",
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
        status: null
      },
      // 校验
      rules: {
        // 站点
        siteId: [{ required: true, message: "选择站点", trigger: "change" }],
        //关键字
        keywords: [{ required: true, message: "请输入关键字", trigger: "blur" }]
        //深度

        //关键字类型
        // keywordTypes: [
        //   { required: true, message: "请选择关键词类型", trigger: "blur" }
        // ],
        //类型
      },
      siteDatas: [], // 定义站点接收赋值

      // 、、、、、、、、、、、、、、、、、、、、、、
      siteDataList: [
        {
          value: 3,
          label: "日本站"
        },
        {
          value: 2,
          label: "中国站"
        },
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
        }
      ],
      typeValue: "",
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
      depth: [
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
    this.params = {
      platformId: this.$store.state.selectPlatform.platformId,
      pageNumber: 1,
      pageSize: 10
    };

    this.getMiningListsApi(this.params); // 关键词挖掘列表请求

    this.getCategorList(); //请求站点
  },

  computed: {
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    })
    // ...mapState("KeywordMining", {
    //   getKeywordMiningData: state => state.KeywordMiningData
    // })
  },
  watch: {
    platformId(val) {
      this.getMiningListsApi({ ...this.params, platformId: val });
    },
    // 监听相关类型的选中事件，控制是否显示深度

    "excavateForm.keywordTypes"(val) {
      console.log(val);
      if (val) {
        this.$set(this.rules, "keywordTypes", {
          required: true,
          message: "请选择关键词类型"
          // trigger: "blur"
        });

        console.log(val);
        if (val.find((item, index) => item == 0 || item == 1)) {
          this.depthBox = true;

          this.$set(this.rules, "depth", {
            required: true,
            message: "请选择深度"
            // trigger: "change"
          });
        } else if (val.find(item => item == 2)) {
          this.depthBox = false;
          for (let key in this.rules) {
            if (key == "depth") {
              delete this.rules[key];
            }
          }
        } else if (!val.length) {
          this.depthBox = false;
          for (let key in this.rules) {
            if (key == "depth") {
              delete this.rules[key];
            }
          }
        }
      } else {
        for (let key in this.rules) {
          if (key == "keywordTypes") {
            delete this.rules[key];
          }
        }
      }
    },

    // checkList(val) {

    // },
    checked(val) {
      console.log(val, "4444");
      if (!val) {
        // console.log(this.keywordTypes.length, "1111");
        this.$set(this.rules, "keywordTypes", {
          required: true,
          message: "请选择关键词类型",
          trigger: "blur"
        });
      }
    }
  },
  methods: {
    newLists1() {
      this.getMiningListsApi(this.params); // 关键词挖掘列表请求
    },
    newLists2() {
      this.getMiningListsApi(this.params); // 关键词挖掘列表请求
    },
    newLists3() {
      this.getMiningListsApi(this.params); // 关键词挖掘列表请求
    },
    newLists4() {
      this.getMiningListsApi(this.params); // 关键词挖掘列表请求
    },
    ...mapActions("KeywordMining", ["getKeywordMiningListsApi"]), //引入方法

    ...mapMutations("KeywordMining", {
      //引入方法
      setWordList: "getKeywordMiningData"
    }),
    ...mapActions("menu", ["addCompeteKeywordAnalysisApi"]),

    // 请求列表
    getMiningListsApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/TaskKeywordDig/list", params).then(res => {
        // console.log(res, "??");

        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;

        this.getKeywordMiningData = res.data.rows;
      });
    },
    // 分页
    handleSizeChange(val) {
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getMiningListsApi(params);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize, //条数
        pageNumber: val, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getMiningListsApi(params);
    },

    // 改变日期选择列表
    changeTime() {
      let a = Number(this.tabPosition);
      const params = {
        carateTime: a, //选择时间
        pageSize: this.pageSize, //条数
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getMiningListsApi(params);
    },

    // 是否TAG词
    selectedEvents() {
      if (this.checked) {
        this.box = false;
        this.box3 = true;
      } else if (!this.checked) {
        this.box = true;
        this.box3 = false;
      }
    },
    //点击添加任务
    onExcavateTask() {
      this.onExcavateTaskDiakig = true;
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
        this.siteDatas = res.data;
        console.log(res.data);
      });
    },
    //添加任务????????????????????
    addTaskSubmit(formName) {
      if (!this.checked) {
        this.$set(this.rules, "keywordTypes", {
          required: true,
          message: "请选择关键词类型",
          trigger: "change"
        });
      } else {
        for (let key in this.rules) {
          if (key == "keywordTypes") {
            delete this.rules[key];
          }
        }
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          let a = this.checkList;
          this.keywordTypes = [Number(a)];
          let b = [this.excavateForm.keywords];

          let params = {
            platformId: this.$store.state.selectPlatform.platformId,
            siteId: this.excavateForm.siteId, //站点
            keywordTypes: this.excavateForm.keywordTypes,
            depth: this.excavateForm.depth, //深度
            keywords: this.excavateForm.keywords.split("\n"), //去除换行
            taskName: this.excavateForm.name //任务名称

            //       siteNames: null, //站点
            // category: null, //类目
            // pageList: null, //页数
            // siteId: this.excavateForm.siteNames,
            // category: Number(this.excavateForm.category),
          };
          this.$axios.post("/TaskKeywordDig/save", params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$refs[formName].resetFields(); //清除数据记录
              this.onExcavateTaskDiakig = false; //关闭弹窗
              this.getMiningListsApi(); //请求类目查询列表
              return;
            }
            if (res.data.code == 500) {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 删除????????????
    deleteList() {
      if (this.userSelect.length) {
        let a = this.deleteData;
        let s = new Set(a);
        let result = Array.from(s);
        this.$axios
          .post("/TaskKeywordDig/remove", { taskIds: result })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getMiningListsApi(); // 关键词挖掘列表请求
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
    //  keyword: "",
    //     site: null,
    //     type: null,
    //     status: null
    // 搜索?????????
    searchLists() {
      this.recordSearch(
        this.searchData.keyword ||
          this.searchData.site ||
          this.searchData.type ||
          this.searchData.status
      );
    },
    //记录搜索值?????
    recordSearch(keyword, site, type, status) {
      let b = String(this.searchData.type);
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        taskName: this.searchData.keyword,
        siteId: this.searchData.site,
        keywordTypes: b,
        status: this.searchData.status
      };

      this.$axios.post("/TaskKeywordDig/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.getKeywordMiningData = res.data.rows;

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

    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.deleteData.push(item.taskId);
      });
    },

    // table的查看
    handleClick(taskId) {
      this.$router.push({
        path: "/admin/center/keywordExcavateIndexSee",
        query: {
          taskId
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
