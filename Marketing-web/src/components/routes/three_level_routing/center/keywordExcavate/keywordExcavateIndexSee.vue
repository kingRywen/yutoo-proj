<!-- 关键词挖掘查看 -->
<template>
  <div class='keywordExcavateIndexSee'>
    <template>
      <div class="title_h1 margin_bottom8">
        <span class="title_icon"></span>
        <span class="color_666">任务名称 :</span>
        <span class="titleBox">{{this.$route.query.taskName}}</span>
      </div>
    </template>
    <!-- 导出提示文字隐藏 -->
    <a v-show="false" ref="exportExcel"></a>
    <!-- 帅选条件 -->
    <Search :buttonLoading="buttonLoading" v-on:event='getChild' v-on:event2='childSearchData'></Search>
    <!-- 复制导出加入关注 -->
    <Handler :buttonLoading="handlerButtonLoading" :data='userSelect' :onExport="onExport"></Handler>
    <!-- 表格数据 -->
    <el-table :max-height="12000" v-loading="loading" :data="catalogSeeData" style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortable">
      <el-table-column type="selection" align='center'>
      </el-table-column>
      <!-- todo1 -->
      <el-table-column prop="index" label="序号" width="50" align='center'>
      </el-table-column>
      <el-table-column prop="keywordSrc" :label="keyName" width="180">
        <template slot-scope="scope">
          {{scope.row.keywordSrc?scope.row.keywordSrc:"-"}}
        </template>
      </el-table-column>
      <el-table-column prop="keyword" label="关键词">
        <template slot-scope="scope">
          {{scope.row.keyword?scope.row.keyword:"-"}}
        </template>
      </el-table-column>
      <el-table-column prop="keywordType" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.keywordType=='0'">相关词</span>
          <span v-if="scope.row.keywordType=='1'">下拉词</span>
          <span v-if="scope.row.keywordType=='2'">联想词</span>
          <span v-if="scope.row.keywordType=='3'">TAG词</span>
          <span v-if="scope.row.keywordType=='4'">AdWords</span>
          <span v-if="scope.row.keywordType=='-1'">-</span>
        </template>
      </el-table-column>
      <el-table-column sortable='custom' prop="depth" label="深度">
        <template slot-scope="scope">
          {{scope.row.keywordType==2||scope.row.keywordType==3||scope.row.keywordType==4?"-":scope.row.depth==""?"-":scope.row.depth}}
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="链接" placement="top-start">
            <a v-if="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?scope.row.url:false" style="text-decoration:none;">
              <span class="iconfont icon-lianjie">
              </span>
            </a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="加入关注" placement="top-start">
            <span class="iconfont icon-guanzhu" @click="funAddShow(scope.row)"></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="加入关键词竞争分析" placement="top-start">
            <span class="iconfont icon-jingzhengduishou" @click="funAddComp(scope.row)"></span>
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
    <!-- 加入竞争分析弹窗 -->
    <addCom :data="addDialog"></addCom>
  </div>
</template>

<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'
import addCom from "@/components/common/addCom";
import { mapActions, mapState, mapMutations } from "vuex";
import Search from "./child/search";
import Handler from "./child/handler";
export default {
  components: {
    Search,
    Handler,
    addCom
  },
  data() {
    return {
      // 单条添加关注
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
      // 加入竞争分弹窗
      addDialog: {
        show: false,
        type: ""
      },
      buttonLoading: {
        childSearchLoading: false,
        childClearSearchLoading: false
      },
      handlerButtonLoading: {
        funCopyButtonLoading: false,
        funExportButtonLoading: false,
        funAddButtonLoading: false,
        funAddCompButtonLoading: false
      },
      loading: false,
      total: null, //总条数
      currentPage: 1, //分页
      pageSize: 10, //每页条数
      totalPages: null,
      tabPosition: 30, //默认今日列表
      userSelect: [],
      catalogSeeData: [], //请求查看列表的数据
      category: this.$route.query.category,
      onCategoryTaskDiakig: false, //添加任务弹窗
      // 添加任务弹窗数据
      queryForm: {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteValue: null, // 站点
        pageValue: null, //页数
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
      formLabelWidth: "120px", //公用宽度
      siteData: [], // 定义站点接收赋值
      sortData: {},
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
      deleteData: [], //定义删除的列表
      exportData: [], //导出的参数
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

      // 5
      selectRow: null,
      StatusValue: "",
      // 时间段
      tabPosition: "top",
      // 表格数据

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1,
      // todod
      SearchData: null
    };
  },
  created() {
    this.$store.commit("common/pathFromCheckProductAnalysis", "/admin/center");
    // this.getCategoryListApi(); //请求类目查询列表
    this.getCategorList(); //请求站点
    this.getLists(); // 请求查看列表
  },
  mounted() {
    if (this.$store.state.common.key_index_charge === "") {
      // 请求扣点 关键词竞争分析扣点
      this.$axios.post("/FunctionMkt/keywordCompete/list").then(res => {
        this.$store.commit("common/key_index_charge", res.data.data.charge);
      });
    }
  },
  computed: {
    ...mapState("selectionTool", {
      getCategory: state => state.getCategorys
    }),
    keyName() {
      let k;
      if (this.$route.query.keywordTypes == 3) {
        k = "原产品ID";
      }
      if (this.$route.query.keywordTypes != 3) {
        k = "源关键词";
      }
      return k;
    }
  },
  methods: {
    // ...mapActions("selectionTool", ["getCategoryListApi"]),
    ...mapMutations("selectionTool", {
      setWordList: "getCategoryLists"
    }),
    // 加入关注
    // 加入关注弹窗
    funAddShow(row, cb) {
      // 4
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
          // console.log(res, "options");
          // console.log(res.data.data.groupingVOS, "目录返回");
          let code = res.data.code;
          if (code === 0) {
            //第一个弹窗的分组
            this.dialog.options = Object.assign([], res.data.data.groupingVOS);
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
      params = this.$.dealObjectValue(params);
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
    // 加入竞争分析
    funAddComp(row) {
      // console.log(row);
      this.$store.commit("common/type_keyword", row.keyword);
      this.addDialog.show = true;
    },
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
    //获取查看列表
    getLists() {
      this.loading = true;
      let params = {
        taskId: Number(this.$route.query.taskId), //路由传过来的参数
        pageNumber: this.currentPage || 1,
        pageSize: this.pageSize || 10,
        ...this.SearchData
      };
      params = this.$.dealObjectValue(params);
      if (this.sortData) {
        params.sort = this.sortData.sort;
        params.field = this.sortData.prop;
      }
      if (params.keywordSrc) {
        params.keywordSrc = params.keywordSrc
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
      this.$axios.post("/TaskKeywordDigRt/list", params).then(res => {
        this.loading = false;
        this.buttonLoading.childClearSearchLoading = false;
        this.buttonLoading.childSearchLoading = false;
        // console.log(res, "options");
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          this.buttonLoading.childClearSearchLoading = false;
          this.buttonLoading.childSearchLoading = false;
        }
        if (res.data.rows.length) {
          this.currentPage = res.data.pageNo; //分页
          this.total = res.data.total;
          this.totalPages = res.data.totalPages;
          this.pageSize = res.data.pageSize;
          // todo2
          res.data.rows.forEach((item, index) => {
            item.index = index + 1;
          });
          this.catalogSeeData = res.data.rows;
        }
        if (!res.data.rows.length) {
          this.currentPage = res.data.pageNo; //分页
          this.total = res.data.total;
          this.totalPages = res.data.totalPages;
          this.pageSize = res.data.pageSize;
          this.catalogSeeData = res.data.rows;
        }
      });
    },
    //导出 todo
    onExport() {
      let arr = this.userSelect;
      let params;
      let taskRtIdArray = arr.map(item => item.keyword);
      let taskIdArr = [];
      this.catalogSeeData.forEach(i => {
        taskIdArr.push(i.taskId);
      });
      let resultarr = [...new Set(taskIdArr)];
      if (taskRtIdArray.length == 0) {
        params = { ...this.SearchData };
        params.taskId = parseInt(this.$route.query.taskId);
        // 有搜索条件的导出要把搜索条件带上，搜索的每一条处理成数组
        if (params.keywordSrc) {
          params.keywordSrc = params.keywordSrc
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
      } else {
        params = {};
        params.taskId = parseInt(this.$route.query.taskId);
        params.keywords = taskRtIdArray;
      }
      params = this.$.dealObjectValue(params);
      this.$axios({
        method: "post",
        url: "/TaskKeywordDigRt/exportData",
        data: params,
        responseType: "blob"
      })
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "关键词挖掘分析列表.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.$store.commit("common/userSelect", val);
      this.userSelect.forEach(item => {
        this.deleteData.push(item.taskId);
        this.exportData.push(item.taskId);
      });
    },
    // 点击添加弹窗
    onCategoryTask() {
      this.onCategoryTaskDiakig = true;
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
        this.siteData = res.data;
        // console.log(res.data);
      });
    },
    // table的查看
    handleClick(index, rowDetail) {
      // console.log(index, rowDetail);
    },
    // 分页 ok
    handleSizeChange(val) {
      this.pageSize = val;
      // let params = {
      //   pageSize: val, //条数
      //   pageNumber: this.currentPage, //当前页
      //   taskId: this.$route.query.taskId //路由传过来的参数
      // };
      this.getLists(); //待定明天3？
    },
    //翻页ok
    handleCurrentChange(val) {
      this.currentPage = val;
      // console.log(`当前页: ${val}`);
      // let params = {
      //   pageSize: this.pageSize, //条数
      //   pageNumber: val, //当前页
      //   taskId: this.$route.query.taskId //路由传过来的参数
      // };
      this.getLists(); //待定明天4？
    }
  }
};
</script>

<style scoped>
.paddingBobbtom {
  padding-bottom: 10px;
}
</style>
