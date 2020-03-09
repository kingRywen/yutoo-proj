<!-- 类目查询查看 -->
<template>
  <div class='CatalogQuerySee __wrapper_i'>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between" class="margin_bottom8">
      <!-- 输入框 -->
      <el-col :span="20">
        <span class="title_icon"></span>
        <span class="color_666">类目 :</span>
        <div v-model="category" class="titleBox">{{category}}</div>
      </el-col>
    </el-row>
    <a v-show="false" ref="exportExcel"></a>
    <!-- 帅选条件 -->
    <Search :buttonLoading="buttonLoading" v-on:event='getChild' v-on:event2='childSearchData'></Search>
    <!-- 复制导出加入关注 -->
    <Handler :buttonLoading="handlerButtonLoading" :data='userSelect' :onExport="onExport"></Handler>
    <!-- 表格数据 -->
    <el-table :max-height="12000" v-loading="loading" :data="catalogSeeData" border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortable">
      <el-table-column type="selection" align='center'>
      </el-table-column>
      <el-table-column prop="index" label="序号" width="50" align='center'>
      </el-table-column>
      <el-table-column prop="id" label="图片" width="80" align='center'>
        <template slot-scope="scope">
          <!-- <div class="__img_wrapper">
            <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
          </div> -->
          <el-popover placement="right" title="" trigger="hover">
            <img :src="scope.row.imageUrl" />
            <div class="__img_wrapper" slot="reference">
              <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" align='center' :formatter="_formatter">
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title | _formatData}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.title">
            <div class="fix__row_2">
              {{ scope.row.title!=""?scope.row.title:"-"}}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="sku" label="ASIN" align='center' :formatter="_formatter">
        <template slot-scope="scope">
          <span v-if="scope.row.sku" style="text-decoration:none;cursor:pointer" class="color_blue" @click="showDetails(scope)">{{ scope.row.sku}}</span>
          <span v-else style="text-decoration:none;">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="releaseDate" sortable="custom" label="上架时间" align='center' :formatter="_formatter">
      </el-table-column>
      <el-table-column prop="reviewCnt" sortable="custom" label="评价数" align='center' :formatter="_formatter">
      </el-table-column>
      <el-table-column prop="starCnt" sortable="custom" label="评分" align='center' :formatter="_formatter">
      </el-table-column>
      <el-table-column prop="qaCnt" sortable="custom" label="Q&A数" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.qaCnt?scope.row.qaCnt:"-"}}</div>
        </template>
      </el-table-column>

      <el-table-column prop="skuCnt" sortable="custom" label="可售变体数" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.skuCnt?scope.row.skuCnt:"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="fbpFlag" label="发货方式" align='center'>
        <template slot-scope="scope">
          <span>{{scope.row.fbpFlag | FBA_Filter_Intable}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rank" sortable="custom" label="BSR排名" align='center' :formatter="_formatter">
      </el-table-column>
      <el-table-column prop="bsrCategory" label="BSR类目" align='center'>
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.bsrCategory === '' || scope.row.bsrCategory == null">{{scope.row.bsrCategory | _formatData}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.bsrCategory">
            <div class="fix__row_2">
              {{ scope.row.bsrCategory | _formatData}}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="brand" label="品牌名" align='center'>
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.brand === '' || scope.row.brand == null">{{scope.row.brand | _formatData}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.brand">
            <div class="fix__row_2">
              {{ scope.row.brand | _formatData}}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="操作" align="center">

        <template slot-scope="scope">
          <div class="no-hidden">
            <el-tooltip class="item" effect="dark" content="链接" placement="top-start">
              <a rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl?scope.row.productUrl:false" style="text-decoration:none;">
                <span class="iconfont icon-lianjie">
                </span>
              </a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="加入关注" placement="top-start">
              <span class="iconfont icon-guanzhu" @click="funAddShow(scope.row)"></span>
            </el-tooltip>
            <el-tooltip v-if="showAddComBut" class="item" effect="dark" content="加入竞品分析" placement="top-start">
              <span class="iconfont icon-jingzhengduishou" @click="funAddComp(scope.row)"></span>
            </el-tooltip>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
    <!-- 点击ASIN 弹窗 -->
    <el-dialog :close-on-click-modal="false" :title="skuDialog.title" :visible.sync="skuDialog.show" :width="skuDialog.width || '900px'" :before-close="skuDialog.modalClose" :modal-append-to-body="false">
      <commonSkuShow :data="skuDialog"></commonSkuShow>
    </el-dialog>
  </div>
</template>

<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'
import Search from "./2_child/search";
import addCom from "./2_child/addCom";
import Handler from "./2_child/handler";
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import commonSkuShow from "@/components/common/commonSkuShow";
export default {
  components: { Search, Handler, addCom, commonSkuShow },
  data() {
    return {
      selectRow: null,
      sortData: {},
      skuDialog: {
        title: "详情",
        show: false,
        width: "",
        data: ""
      },
      SearchData: {},
      // 单条添加关注
      // 添加关注弹窗
      dialog: {
        skus: [],
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
      userSelect: [],
      loading: true, //loading效果
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      // 时间段  选择日期
      tabPosition: 30,
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
      exportData: [],
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
    // 请求分组数据
    this.GroupingList();
    this.$store.commit(
      "common/pathFromCheckProductAnalysis",
      "/admin/SelectionTool/CatalogQuery"
    );
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
    ...mapGetters("common", ["siteId", "platformId"]),
    showAddComBut() {
      let id = this.$store.state.common.savePlatformIdAndSiteId.split(",")[0];
      if (id == 1) {
        return true;
      }
      return false;
    }
    // ...mapState("selectionTool", {
    //   getCategory: state => state.getCategorys
    // })
  },
  methods: {
    // ...mapActions("selectionTool", ["getCategoryListApi"]),
    // ...mapMutations("selectionTool", {
    //   setWordList: "getCategoryLists"
    // }),
    showDetails(s) {
      // 点击sku显示弹窗
      // console.log(s.row);
      this.skuDialog.show = true;
      this.skuDialog.data = s.row;
    },
    // 请求分组
    GroupingList() {
      let params = {
        siteId: this.siteId,
        platformId: this.platformId,
        // 此处要加入的是竞品分析，所以类型是1
        groupType: 1
      };
      this.$axios.post("/Grouping/list", params).then(res => {
        // console.log(res);
        let code = res.data.code;
        if (code === 0) {
          let data = res.data.data.groupingVOS;
          // if (data != "") {
          //   data.forEach((item, index) => {
          //     if (item.groupName === "未分组") {
          //       item.groupName = "默认分组";
          //     }
          //   });
          // }
          this.$store.commit("common/groupingVOS", data);
        }
      });
    },
    // 单个加入关注
    // 加入关注弹窗
    funAddShow(row, cb) {
      // 4
      this.selectRow = row;
      this.dialog.addFollowShow = true;
      this.dialog.row = [];
      if (row) {
        this.dialog.row.push(row);
      }
      this.$axios
        .post("/Grouping/list", {
          platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ","
          )[0],
          siteId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ","
          )[1],
          groupType: 1
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
            // this.dialog.options.forEach((item, index) => {
            //   if (item.groupName === "未分组") {
            //     item.groupName = "默认分组";
            //   }
            // });
            // 第二个弹窗的选择上级分组
            this.dialog.groupDialog.options = Object.assign(
              [],
              res.data.data.productGroupVOS
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
        groupType: 1
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
          this.dialog.groupDialog.loading = false;
        })
        .catch(err => {
          this.dialog.groupDialog.loading = false;
        });
    },
    // 加入关注
    addFollowSubmit() {
      this.dialog.loading = true;
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        groupId: this.dialog.groupId[this.dialog.groupId.length - 1],
        products: this.dialog.row,
        groupType: 1
      };

      this.$axios
        .post("/ProductLib/saveByProduct", params)
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
      this.$store.commit("competitive/type_textarea", row.sku);
      this.addDialog.show = true;
    },
    // 搜索从第一页开始 清空排序
    childSearchData(child) {
      this.pageSize = 10;
      this.pageNumber = 1;
      // this.sortData = {};
      this.buttonLoading.childSearchLoading = true;
      this.SearchData = child;
      this.getLists();
    },
    // 清除搜索从第一页开始 清空排序
    getChild(child) {
      this.pageSize = 10;
      this.pageNumber = 1;
      // this.sortData = {};
      this.SearchData = {};
      this.buttonLoading.childClearSearchLoading = true;
      this.getLists();
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
    //获取查看列表
    getLists() {
      let params = {
        taskId: Number(this.$route.query.taskId), //路由传过来的参数
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        ...this.SearchData
      };
      params = this.$.dealObjectValue(params);
      if (this.sortData) {
        params.sort = this.sortData.sort;
        params.field = this.sortData.prop;
      }
      if (params.reviewCntMin) {
        params.reviewCntMin = parseInt(
          params.reviewCntMin +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      if (params.reviewCntMax) {
        params.reviewCntMax = parseInt(
          params.reviewCntMax +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      // 异或运算大小对调
      if (params.reviewCntMin > params.reviewCntMax) {
        params.reviewCntMin =
          (params.reviewCntMax =
            (params.reviewCntMin ^= params.reviewCntMax) ^
            params.reviewCntMax) ^ params.reviewCntMin;
      }
      if (params.starCntMin) {
        params.starCntMin = Number(
          params.starCntMin +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      if (params.starCntMax) {
        params.starCntMax = Number(
          params.starCntMax +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      // 异或运算大小对调
      if (params.starCntMin > params.starCntMax) {
        params.starCntMin =
          (params.starCntMax =
            (params.starCntMin ^= params.starCntMax) ^ params.starCntMax) ^
          params.starCntMin;
      }
      if (params.qaCntMin) {
        params.qaCntMin = parseInt(
          params.qaCntMin +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      if (params.qaCntMax) {
        params.qaCntMax = parseInt(
          params.qaCntMax +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      // 异或运算大小对调
      if (params.qaCntMin > params.qaCntMax) {
        params.qaCntMin =
          (params.qaCntMax =
            (params.qaCntMin ^= params.qaCntMax) ^ params.qaCntMax) ^
          params.qaCntMin;
      }
      if (params.rankMin) {
        params.rankMin = parseInt(
          params.rankMin +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      if (params.rankMax) {
        params.rankMax = parseInt(
          params.rankMax +
            ""
              .split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== "")
        );
      }
      // 异或运算大小对调
      if (params.rankMin > params.rankMax) {
        params.rankMin =
          (params.rankMax =
            (params.rankMin ^= params.rankMax) ^ params.rankMax) ^
          params.rankMin;
      }
      // 上架时间处理
      if (params.datePickValue) {
        params.releaseDateMin = params.datePickValue[0];
        params.releaseDateMax = params.datePickValue[1];
      }
      // 发货方式处理
      if (params.fbpFlag) {
        //[0],[1]
        if (params.fbpFlag.length === 1) {
          params.fbpFlag = parseInt(params.fbpFlag[0]);
        } else if (params.fbpFlag.length === 2) {
          // 3表示两种都选 [0,1]
          params.fbpFlag = 3;
        }
      }
      this.loading = true;
      this.$axios.post("/TaskCategoryQueryRt/list", params).then(res => {
        this.loading = false; //
        this.buttonLoading.childClearSearchLoading = false;
        this.buttonLoading.childSearchLoading = false;
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
        if (res.data.rows.length) {
          this.pageNumber = res.data.pageNo; //分页
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          // todo2
          res.data.rows.forEach((item, index) => {
            item.index = index + 1;
          });
          this.catalogSeeData = res.data.rows;
        }
        if (!res.data.rows.length) {
          this.pageNumber = res.data.pageNo; //分页
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.catalogSeeData = res.data.rows;
        }
      });
    },
    //导出   --选品工具---类目查询--查看---导出
    onExport() {
      let params;
      let arr = this.userSelect;
      let sequencesArr = arr.map(item => item.sequence);
      let taskIdArr = [];
      this.catalogSeeData.forEach(i => {
        taskIdArr.push(i.taskId);
      });
      let resultarr = [...new Set(taskIdArr)];
      if (sequencesArr.length == 0) {
        params = { ...this.SearchData };
        params.taskId = parseInt(this.$route.query.taskId);
        if (params.reviewCntMin) {
          params.reviewCntMin = parseInt(
            params.reviewCntMin +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        if (params.reviewCntMax) {
          params.reviewCntMax = parseInt(
            params.reviewCntMax +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        // 异或运算大小对调
        if (params.reviewCntMin > params.reviewCntMax) {
          params.reviewCntMin =
            (params.reviewCntMax =
              (params.reviewCntMin ^= params.reviewCntMax) ^
              params.reviewCntMax) ^ params.reviewCntMin;
        }
        if (params.starCntMin) {
          params.starCntMin = Number(
            params.starCntMin +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        if (params.starCntMax) {
          params.starCntMax = Number(
            params.starCntMax +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        // 异或运算大小对调
        if (params.starCntMin > params.starCntMax) {
          params.starCntMin =
            (params.starCntMax =
              (params.starCntMin ^= params.starCntMax) ^ params.starCntMax) ^
            params.starCntMin;
        }
        if (params.qaCntMin) {
          params.qaCntMin = parseInt(
            params.qaCntMin +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        if (params.qaCntMax) {
          params.qaCntMax = parseInt(
            params.qaCntMax +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        // 异或运算大小对调
        if (params.qaCntMin > params.qaCntMax) {
          params.qaCntMin =
            (params.qaCntMax =
              (params.qaCntMin ^= params.qaCntMax) ^ params.qaCntMax) ^
            params.qaCntMin;
        }
        if (params.rankMin) {
          params.rankMin = parseInt(
            params.rankMin +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        if (params.rankMax) {
          params.rankMax = parseInt(
            params.rankMax +
              ""
                .split(/[\n|\r\n|\,|\，]/)
                .map(el => el.trim())
                .filter(el => el !== "")
          );
        }
        // 异或运算大小对调
        if (params.rankMin > params.rankMax) {
          params.rankMin =
            (params.rankMax =
              (params.rankMin ^= params.rankMax) ^ params.rankMax) ^
            params.rankMin;
        }
        // 上架时间处理
        if (params.datePickValue) {
          params.releaseDateMin = params.datePickValue[0];
          params.releaseDateMax = params.datePickValue[1];
        }
        // 发货方式处理
        if (params.fbpFlag) {
          //[0],[1]
          if (params.fbpFlag.length === 1) {
            params.fbpFlag = parseInt(params.fbpFlag[0]);
          } else if (params.fbpFlag.length === 2) {
            // 3表示两种都选 [0,1]
            // params.fbpFlag = "";
            delete params.fbpFlag;
          }
        }
      } else {
        params = {};
        params.taskId = parseInt(this.$route.query.taskId);
        params.sequences = sequencesArr;
      }
      params = this.$.dealObjectValue(params);
      this.$axios({
        method: "post",
        url: "/TaskCategoryQueryRt/exportData",
        data: params,
        responseType: "blob"
      })
        .then(res => {
          let a = document.createElement("a");
          let url = window.URL.createObjectURL(new Blob([res.data]));
          a.href = url;
          a.setAttribute("download", "类目查询列表.xlsx");
          a.click();
          window.URL.revokeObjectURL(a.href);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.$store.commit("common/userSelect", val);
      // this.userSelect.forEach(item => {
      //   this.selectData.push(item.taskRtId);
      //   this.exportData.push(item.sku);
      // });
    },
    // table的查看
    handleClick(index, rowDetail) {
      // console.log(index, rowDetail);
    },
    // 分页
    //改变每页显示数量 ok
    handleSizeChange(val) {
      this.pageSize = val;
      this.getLists(); //明天见3
    },
    //翻页OK
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getLists(); //明天见4
    }
  }
};
</script>

<style scoped>
.titleBox {
  display: inline;
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
</style>
