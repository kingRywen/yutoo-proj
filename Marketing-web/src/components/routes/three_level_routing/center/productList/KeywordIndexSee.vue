<!-- 竞争者分析页面 -->
<template>
  <div class='KeywordIndexSee'>
    <!-- <el-row :gutter="24" type='flex' justify="space-between" style="margin-bottom:12px">
      <el-col :span="15" style="line-height: 30px;">
        <template>
          <div class="font_14px">
            <span class="color_666">来源 :</span>
            <div v-model="searchSites" v-for="item in searchSites" class="titleBox" style="display:inline-block">
              <span v-if="item==0">Google</span>
              <span v-if="item==1">速卖通</span>
              <span v-if="item==2">merchantwords</span>
            </div>
          </div>
        </template>
      </el-col>
      <el-col :span="9" style="text-align:right">
        <el-button type="success" @click="onExport">导出</el-button>
      </el-col>
    </el-row> -->
    <template>
      <div class="title_h1">
        <span class="title_icon"></span>
        <span class="color_666">任务名称 :</span>
        <span class="titleBox">{{this.$route.query.taskName}}</span>
        <!-- <span class="color_666">来源 :</span> -->
        <div v-model="searchSites" v-for="item in searchSites" class="titleBox" style="display:inline-block">
          <span v-if="item==0">Google</span>
          <span v-if="item==1">速卖通</span>
          <span v-if="item==2">merchantwords</span>
        </div>
      </div>
    </template>
    <Search :buttonLoading="buttonLoading" v-on:event='getChild' v-on:event2='childSearchData'></Search>
    <!-- 复制导出加入关注 -->
    <Handler :buttonLoading="handlerButtonLoading" :data='userSelect' :onExport="onExport"></Handler>
    <!-- 表格数据 -->
    <el-table :max-height="12000" :data="seeListData" v-loading="loading" style="width:100%" @selection-change="handleSelectionChange" @sort-change="sortable">
      <el-table-column type="selection" align='center'>
      </el-table-column>
      <!-- todo1 -->
      <el-table-column prop="index" label="序号" width="50" align='center'>
      </el-table-column>
      <el-table-column prop="keyword" label="关键词" align="center" :formatter="_formatter">
      </el-table-column>
      <el-table-column v-if="this.searchSites.indexOf('0') > -1" label="Google" align="center">
        <el-table-column label="搜索量" prop="searchGoogle" align="center" sortable='custom'>

        </el-table-column>
        <el-table-column label="竞争度" prop="competitiveGoogle" align="center" sortable='custom'>
          <template slot-scope="scope">
            <span>{{scope.row.competitiveGoogle===null?"∞":scope.row.competitiveGoogle}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="this.searchSites.indexOf('1') > -1" label="速卖通" align="center">
        <el-table-column label="搜索量" prop="searchAliexpress" align="center" sortable='custom'>

        </el-table-column>
        <el-table-column label="竞争度" prop="competitiveAliexpress" align="center" sortable='custom'>
          <template slot-scope="scope">
            <span>{{scope.row.competitiveAliexpress===null?"∞":scope.row.competitiveAliexpress}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="this.searchSites.indexOf('2') > -1" label="merchantwords" align="center">
        <el-table-column label="搜索量" prop="searchMerchantwords" align="center" sortable='custom'>

        </el-table-column>
        <el-table-column label="竞争度" prop="competitiveMerchantwords" align="center" sortable='custom'>
          <template slot-scope="scope">
            <span>{{scope.row.competitiveMerchantwords===null?"∞":scope.row.competitiveMerchantwords}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column sortable='custom' prop="productAmount" label="产品数量" align="center">
      </el-table-column>
      <el-table-column prop="unit" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="链接" placement="top-start">
            <a rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.url?scope.row.url:false" style="text-decoration:none;">
              <span class="iconfont icon-lianjie">
              </span>
            </a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="加入关注" placement="top-start">
            <span class="iconfont icon-guanzhu" @click="funAddShow(scope.row)"></span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" :page-count="totalPages">
      </el-pagination>
    </div>
    <!-- 添加关注 -->
    <el-dialog :close-on-click-modal="false" title="添加关注" :visible.sync="dialog.addFollowShow" width="600px">
      <div slot="title">
        <span class="el-dialog__title">添加关注</span>
      </div>
      <div class="box __box_wrapper addFollow">
        <el-form :model="dialog.form" ref="ruleForm" style="width:100%;">
          <el-form-item label="选择分组: " prop="group" label-width="80px" style="width:100%;">
            <el-cascader placeholder="" v-model="dialog.groupId" :options="dialog.options" :show-all-levels="true" :props="dialog.props"></el-cascader>
            <el-button type="primary" @click="dialog.groupDialog.addGroupShow=true">添加分组</el-button>
          </el-form-item>
          <el-form-item label-width="80px">
            <el-button type="primary" style="width:280px" @click.stop="addFollowSubmit()" :loading="dialog.loading">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 添加分组 -->
    <el-dialog :close-on-click-modal="false" title="添加分组" :visible.sync="dialog.groupDialog.addGroupShow" width="600px">
      <div slot="title">
        <span class="el-dialog__title">添加分组</span>
      </div>
      <div class="box __box_wrapper addFollow">
        <el-form :model="dialog.form" ref="ruleForm" style="width:100%;">
          <el-form-item label="分组名称: " prop="new_group" label-width="100px" style="width:100%;">
            <el-input v-model.trim="dialog.groupDialog.new_group" placeholder="请输入新分组" style="width:82%"></el-input>
          </el-form-item>
          <el-form-item label="选择上级分组: " label-width="100px" style="width:100%;" v-if="dialog.groupDialog.options==''?false:true">
            <el-cascader placeholder="默认根目录" :options="dialog.groupDialog.options" :show-all-levels="true" :props="dialog.groupDialog.props" v-model="dialog.groupDialog.parentGroupId" change-on-select style="width:82%;" clearable></el-cascader>
          </el-form-item>
          <el-form-item label-width="100px">
            <el-button :disabled="dialog.groupDialog.new_group.trim()!==''?false:true" :loading="dialog.groupDialog.loading" type="primary" style="width:280px" @click="addGroupSubmit()">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'
import { mapActions, mapState, mapMutations } from "vuex";
import Search from "./1_child/search";
import Handler from "./1_child/handler";
const d = require("@/plugins/download.js");
export default {
  components: {
    Search,
    Handler
  },
  data() {
    return {
      // 5
      selectRow: null,
      // todod
      buttonLoading: {
        childSearchLoading: false,
        childClearSearchLoading: false
      },
      SearchData: null,
      handlerButtonLoading: {
        funCopyButtonLoading: false,
        funExportButtonLoading: false,
        funAddButtonLoading: false,
        funAddCompButtonLoading: false
      },
      sortData: {},
      // 添加关注弹窗
      dialog: {
        keywords: [],
        loading: false,
        addFollowShow: false,
        form: {},
        options: [],
        props: {
          value: "groupId",
          children: "groupingVOS",
          label: "groupName"
        },
        groupId: [-1],
        // 添加任务弹窗
        groupDialog: {
          addGroupShow: false,
          options: [],
          props: {
            value: "groupId",
            children: "groupingVOS",
            label: "groupName"
          },
          new_group: "",
          parentGroupId: [0],
          loading: false
        },
        add_disabled: false
      },
      loading: true,
      userSelect: [],
      currentPage: 1, //当前页
      total: null, //总条数
      pageSize: 10, //每页条数
      pageNumber: null, //页数
      totalPages: null,
      // 时间段  选择日期
      tabPosition: 30,
      searchSites: this.$route.query.searchSites,
      seeListData: [], //定义接收参数请求的数据
      listKeyword: [],
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
      // // 状态数据
      // processingState: [
      //   // {
      //   //   value: 1,
      //   //   label: "待处理"
      //   // },
      //   {
      //     value: 2,
      //     label: "处理成功"
      //   },
      //   {
      //     value: 3,
      //     label: "处理失败"
      //   }
      // ],
      addTask: false, //添加任务弹窗

      state: [],
      //  定义添加任务
      form: {
        platformId: null, //平台ID
        siteValue: [], // 站点
        sourceList: [], //来源列表
        keywords: "" //关键词
      },
      // 校验
      rules: {
        keywords: [
          { required: true, message: "请输入关键词", trigger: "blur" }
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
      tabPosition: "top"
      // 分页
    };
  },

  created() {
    this.$store.commit(
      "common/pathFromCheckProductAnalysis",
      "/admin/center/KeywordIndex"
    );
    // console.log(this.searchSites, "55555");
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
    // todom
    // 排序
    sortable(sort_param) {
      // console.log(sort_param.prop);
      let type;
      if (sort_param.order === "descending") {
        type = "desc";
      } else {
        type = "asc";
      }
      // console.log(this.params.sort);
      if (sort_param.prop === null) {
        this.sortData = {};
        this.getLists(); //请求列表
      } else {
        if (type === "desc") {
          this.sortData.sort = 0;
        } else {
          this.sortData.sort = 1;
        }
        this.sortData.prop = this.toLine(sort_param.prop);
        this.getLists(); //请求列表
      }
    },
    // 搜索从第一页开始 清空排序
    childSearchData(child) {
      this.pageSize = 10;
      this.currentPage = 1;
      // this.sortData = {};
      this.buttonLoading.childSearchLoading = true;
      this.SearchData = child;
      this.getLists();
    },
    // 清除搜索从第一页开始 清空排序
    getChild(child) {
      this.pageSize = 10;
      this.currentPage = 1;
      // this.sortData = {};
      this.SearchData = {};
      this.buttonLoading.childClearSearchLoading = true;
      this.getLists();
    },
    // 加入关注弹窗
    funAddShow(row, cb) {
      this.selectRow = row;
      this.dialog.addFollowShow = true;
      this.dialog.keywords = [];
      if (row) {
        this.dialog.keywords.push(row.keyword);
      }
      this.$axios
        .post("/Grouping/list", {
          platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ","
          )[0],
          siteId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ","
          )[1],
          groupType: 0
        })
        .then(res => {
          // 3
          if (cb) {
            cb(res);
            return;
          }
          // console.log(res.data.data.groupingVOS, "目录返回");
          let code = res.data.code;
          if (code === 0) {
            //第一个弹窗的分组
            this.dialog.options = Object.assign([], res.data.data.groupingVOS);
            // 4
            // this.dialog.options.forEach((item, index) => {
            //   if (item.groupName === "未分组") {
            //     item.groupName = "默认分组";
            //   }
            // });
            // 第二个弹窗的选择上级分组
            this.dialog.groupDialog.options = Object.assign(
              [],
              res.data.data.groupingVOS
            );
            // this.dialog.groupDialog.options.forEach((item, index) => {
            //   if (item.groupName === "默认分组") {
            //     this.dialog.groupDialog.options.splice(index);
            //   }
            // });
            this.dialog.groupDialog.options = this.dialog.groupDialog.options.filter(
              function(item) {
                return item.groupName !== "未分组";
              }
            );
            // console.log(this.dialog.groupDialog.options);
          } else {
            this.dialog.options = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 确认添加分组
    addGroupSubmit() {
      // 1
      const ids = JSON.parse(
        JSON.stringify(this.dialog.groupDialog.parentGroupId)
      );
      const name = this.dialog.groupDialog.new_group;
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        groupName: this.dialog.groupDialog.new_group,
        parentGroupId:
          this.dialog.groupDialog.parentGroupId == ""
            ? 0
            : this.dialog.groupDialog.parentGroupId[
                this.dialog.groupDialog.parentGroupId.length - 1
              ],
        groupType: 0
      };
      this.dialog.groupDialog.loading = true;
      this.$axios
        .post("/Grouping/save", params)
        .then(res => {
          let code = res.data.code;
          if (code === 0) {
            this.$message.success(res.data.msg);
            this.dialog.groupDialog.addGroupShow = false;
            // 2
            this.funAddShow(this.selectRow, res => {
              if (res.data.code === 0) {
                this.dialog.options = res.data.data.groupingVOS;
                let lastId = this.$.findGroupIdsByName(
                  name,
                  ids,
                  this.dialog.options
                );
                ids.push(lastId);
                this.dialog.groupId = ids;
              }
            });
          } else if (res.data.code === 500) {
            this.$message.warning(res.data.msg);
          }
          this.dialog.groupDialog.new_group = "";
          this.dialog.groupDialog.loading = false;
        })
        .catch(err => {
          this.dialog.groupDialog.loading = false;
        });
    },
    // 加入关注
    addFollowSubmit() {
      this.dialog.loading = true;
      // let keywords = [];
      // this.data.forEach((item, index) => {
      //   if (item.keyword !== "" && item.keyword !== "-") {
      //     keywords.push(item.keyword);
      //   }
      // });
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        groupId: this.dialog.groupId[this.dialog.groupId.length - 1],
        keywords: this.dialog.keywords
      };
      this.$axios
        .post("/KeywordLib/save", params)
        .then(res => {
          // console.log(res);
          let code = res.data.code;
          if (code === 0) {
            this.$message.success(res.data.msg);
            this.dialog.addFollowShow = false;
          } else if (res.data.code === 500) {
            this.$message.warning(res.data.msg);
          }
          this.dialog.loading = false;
        })
        .catch(err => {
          this.dialog.loading = false;
        });
    },
    // 获取查看列表
    getLists() {
      // console.log(params, "?????????????");
      // debugger;
      let params = {
        taskId: Number(this.$route.query.id),
        // searchSites: this.$route.query.searchSites,
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        ...this.SearchData
      };
      params = this.$.dealObjectValue(params);
      if (this.sortData) {
        params.sort = this.sortData.sort;
        params.field = this.sortData.prop;
      }
      if (params.keyword) {
        params.keyword = params.keyword
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== "");
      }
      if (params.include) {
        params.include = params.include
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== "");
      }
      if (params.barring) {
        params.barring = params.barring
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== "");
      }
      if (params.exclude) {
        params.exclude = params.exclude
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== "");
      }
      if (params.productMin) {
        params.productMin = parseInt(
          params.productMin +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      if (params.productMax) {
        params.productMax = parseInt(
          params.productMax +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      // 异或运算大小对调
      if (params.productMin > params.productMax) {
        params.productMin =
          (params.productMax =
            (params.productMin ^= params.productMax) ^ params.productMax) ^
          params.productMin;
      }
      if (params.googleMin) {
        params.googleMin = parseInt(
          params.googleMin +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      if (params.googleMax) {
        params.googleMax = parseInt(
          params.googleMax +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      // 异或运算大小对调
      if (params.googleMin > params.googleMax) {
        params.googleMin =
          (params.googleMax =
            (params.googleMin ^= params.googleMax) ^ params.googleMax) ^
          params.googleMin;
      }
      if (params.merchantwordsMin) {
        params.merchantwordsMin = parseInt(
          params.merchantwordsMin +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      if (params.merchantwordsMax) {
        params.merchantwordsMax = parseInt(
          params.merchantwordsMax +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      // 异或运算大小对调
      if (params.merchantwordsMin > params.merchantwordsMax) {
        params.merchantwordsMin =
          (params.merchantwordsMax =
            (params.merchantwordsMin ^= params.merchantwordsMax) ^
            params.merchantwordsMax) ^ params.merchantwordsMin;
      }
      this.loading = true;
      this.$axios.post("/TaskKeywordCompeteRt/list", params).then(res => {
        this.buttonLoading.childClearSearchLoading = false;
        this.buttonLoading.childSearchLoading = false;
        this.loading = false;
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.currentPage = res.data.pageNo;
          this.totalPages = res.data.totalPages;
          // this.pageNumber = res.data.pageNo; //分页
          // this.total = res.data.total;
          // this.pageSize = res.data.pageSize;
          // this.currentPage = res.data.pageNo;
          // // this.currentPage = res.data.handleCurrentChange;
          // todo2
          res.data.rows.forEach((item, index) => {
            item.index = index + 1;
          });
          this.seeListData = res.data.rows;
          this.seeListData.forEach((item, index) => {
            for (let key in item) {
              // console.log(item[key]);
              // if (item[key] === 0) {
              //   item[key] = "-";
              // }
            }
          });
        }
        if (!res.data.rows.length) {
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.totalPages = res.data.totalPages;
          this.currentPage = res.data.pageNo;
          this.seeListData = res.data.rows;
        }
      });
    },
    // 导出  关键词竞争分析导出
    onExport() {
      let params;
      let keywords = this.userSelect.map(el => el.keyword);

      if (keywords.length == 0) {
        params = { ...this.SearchData };
        params.taskId = Number(this.$route.query.id);
        if (params.keyword) {
          params.keyword = params.keyword
            .split(/[\n|\r\n|\,|\，]/)
            .map(el => el.trim())
            .filter(el => el !== "");
        }
        if (params.include) {
          params.include = params.include
            .split(/[\n|\r\n|\,|\，]/)
            .map(el => el.trim())
            .filter(el => el !== "");
        }
        if (params.barring) {
          params.barring = params.barring
            .split(/[\n|\r\n|\,|\，]/)
            .map(el => el.trim())
            .filter(el => el !== "");
        }
        if (params.exclude) {
          params.exclude = params.exclude
            .split(/[\n|\r\n|\,|\，]/)
            .map(el => el.trim())
            .filter(el => el !== "");
        }
        if (params.productMin) {
          params.productMin = parseInt(
            params.productMin +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        if (params.productMax) {
          params.productMax = parseInt(
            params.productMax +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        // 异或运算大小对调
        if (params.productMin > params.productMax) {
          params.productMin =
            (params.productMax =
              (params.productMin ^= params.productMax) ^ params.productMax) ^
            params.productMin;
        }
        if (params.googleMin) {
          params.googleMin = parseInt(
            params.googleMin +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        if (params.googleMax) {
          params.googleMax = parseInt(
            params.googleMax +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        // 异或运算大小对调
        if (params.googleMin > params.googleMax) {
          params.googleMin =
            (params.googleMax =
              (params.googleMin ^= params.googleMax) ^ params.googleMax) ^
            params.googleMin;
        }
        if (params.merchantwordsMin) {
          params.merchantwordsMin = parseInt(
            params.merchantwordsMin +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        if (params.merchantwordsMax) {
          params.merchantwordsMax = parseInt(
            params.merchantwordsMax +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        // 异或运算大小对调
        if (params.merchantwordsMin > params.merchantwordsMax) {
          params.merchantwordsMin =
            (params.merchantwordsMax =
              (params.merchantwordsMin ^= params.merchantwordsMax) ^
              params.merchantwordsMax) ^ params.merchantwordsMin;
        }
      } else {
        params = {
          taskId: parseInt(this.$route.query.id),
          keywords
        };
      }
      params = this.$.dealObjectValue(params);
      this.$axios({
        method: "post",
        url: "/TaskKeywordCompeteRt/exportData",
        data: params,
        responseType: "blob"
      })
        .then(res => {
          let a = document.createElement("a");
          let url = window.URL.createObjectURL(new Blob([res.data]));
          a.href = url;
          a.setAttribute("download", "关键词竞争分析详情列表.xlsx");
          a.click();
          window.URL.revokeObjectURL(a.href);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // 弹窗中的级联类目选择
    handleChange(value) {
      // console.log(value);
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      // this.userSelect.forEach(item => {
      //   this.analysisData.push(item.taskId);
      //   this.listKeyword.push(item.keyword);
      // });
    },
    //改变每页显示数量  OK
    handleSizeChange(val) {
      this.pageSize = val;
      this.getLists(); //待定明天1？
    },
    // 翻页 OK
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLists(); //待定明天2？
    }
  }
};
</script>

<style scoped>
/* body {
  margin: 0;
} */
.titleBox {
  text-indent: 1em;
  color: #777;
  font-weight: 600;
}
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
/* 弹窗自定义区域 */
</style>
