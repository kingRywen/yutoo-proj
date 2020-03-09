<!-- 店铺分析的查看 -->
<template>
  <div class='checkShopAnalysis'>
    <div class="main">
      <!-- 详情子组件 -->
      <main style="padding:14px;">
        <shopMsg v-if="shopDetail" :childDetail="shopDetail"></shopMsg>
        <!-- 左右两个图，评价数，产品评价分布图 -->
        <section class="chartPart1">

          <div class="c1">
            <!-- 表一 -->
            <evalChart></evalChart>
          </div>

          <div class="c2">
            <!-- 表二 -->
            <scoreMap></scoreMap>
          </div>
        </section>
        <!-- 左右两个图，上新情况和总数量 -->
        <section class="chartPart1">

          <div class="c1">
            <!-- 表三 -->
            <chartThree v-if="taskStatus" :taskStatus="taskStatus"></chartThree>
          </div>

          <div class="c2">
            <!-- 表四 -->
            <chartFour v-if="taskStatus" :taskStatus="taskStatus"></chartFour>
          </div>
        </section>
        <!-- 表5，独占一大行 -->
        <section>
          <chartFive v-if="taskStatus" :taskStatus="taskStatus"></chartFive>
        </section>
        <!-- 表6，独占一大行 -->
        <section>
          <chartSix v-if="taskStatus" :taskStatus="taskStatus"></chartSix>
        </section>
        <!-- 左右两个图，上新情况和总数量 -->
        <section class="chartPart1">

          <div class="c1">
            <!-- 表7 -->
            <chartSeven v-if="taskStatus" :taskStatus="taskStatus"></chartSeven>
          </div>

          <div class="c2">
            <!-- 表8 -->
            <chartEight v-if="taskStatus" :taskStatus="taskStatus"></chartEight>
          </div>
        </section>
        <!-- 表9，独占一大行 -->
        <section>
          <chartNight v-if="taskStatus" :taskStatus="taskStatus"></chartNight>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
// todoi
import shopMsg from "./2_1tabs/tab2/shopMsg";
import evalChart from "./2_1tabs/tab2/2_chart1"; // 评分数
import scoreMap from "./2_1tabs/tab2/2_chart2"; // 产品评分分布图
import chartThree from "./2_1tabs/tab2/2_chart3"; // 新品，新平评分
import chartFour from "./2_1tabs/tab2/2_chart4"; // 总数量
import chartFive from "./2_1tabs/tab2/2_chart5"; // 日新增评价数-详情
import chartSix from "./2_1tabs/tab2/2_chart6"; // 新增评价数
import chartSeven from "./2_1tabs/tab2/2_chart7"; // 评分产品分布
import chartEight from "./2_1tabs/tab2/2_chart8"; // BSR排名
import chartNight from "./2_1tabs/tab2/2_chart9"; // 评分数
import inputSearch from "./2_1tabs/tab2/inputSearch"; // 搜索
import myTable from "@/components/common/myTable"; // table
import PageVue from "@/components/common/page.vue"; //分页
import { mapActions, mapGetters } from "vuex";
import {
  ShopAnalysisInfoUrl,
  ShopDetailUrl,
  ShopCategoryList,
  ShopProductList
} from "@/api/myApi";
import { getDay, oArrToTwoArr, clearArrTrim } from "@/api/functions.js";
export default {
  name: "thisCom",
  props: ["category"],
  components: {
    shopMsg,
    evalChart,
    scoreMap,
    chartThree,
    chartFour,
    chartFive,
    chartSix,
    chartSeven,
    chartEight,
    chartNight,
    inputSearch,
    myTable,
    PageVue
  },
  data() {
    return {
      shopLoading: true,
      isShowMoniContrl: this.tabNumber == "0" ? false : true, //是否显示新品时间的切换
      tabNumber: "0", //默认选中哪个大tab
      taskStatus: "", //产品详情的一些状态
      shopDetail: "", //店铺详情
      childDay: "30", // 新品的时间
      //input子组件
      inputText: "", //接受保存子组件的input框的输入内容
      searchLoading: false, //loading
      //table子组件
      table: {
        stripe: true,
        height: "614px",
        //table的一些参数
        data: [],
        function: {
          //传到子组件的一些函数
        },
        isShowChecked: false //是否显示选择框
      },
      columns: [
        //table的页头，宽度以及对应的那一项的一些设置label是页头，prop是是该页头下的列的竖向的td内容
        {
          label: "类目名称",
          prop: "category",
          width: "550"
        },
        {
          label: "类目产品数量",
          prop: "productCnt",
          width: ""
        },
        {
          label: "新增评价数量",
          prop: "newReviewCnt",
          width: ""
        },
        {
          label: "总评价数量",
          prop: "reviewCnt",
          width: ""
        },
        {
          label: "操作",
          operations: [
            {
              label: "点击查看类目分析",
              func: this.checkCategory
            }
          ]
        }
      ],
      tableHandle: {
        tableType: "-1" //处于搜索状态下还是列表内容下
      },
      page: {
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1,
        placeholder: "输入类目名称"
      },
      // tab3 todod
      inputTextTab3: "",
      searchLoadingTab3: false,
      //table子组件
      tableTab3: {
        stripe: false,
        height: "600px",
        //table的一些参数
        data: [],
        function: {
          //传到子组件的一些函数
        },
        isShowChecked: false //是否显示选择框
      },
      columnsTab3: [
        //table的页头，宽度以及对应的那一项的一些设置label是页头，prop是是该页头下的列的竖向的td内容
        {
          label: "ASIN",
          prop: "sku",
          width: ""
        },
        {
          label: "图片",
          prop: "imageUrl",
          width: "",
          operations: [
            {
              img: true
            }
          ]
        },
        {
          label: "标题",
          prop: "title",
          width: "550"
        },
        {
          label: "卖家",
          prop: "sellerName",
          width: ""
        },
        {
          label: "操作",
          operations: [
            {
              label: "查看",
              func: this.checkProduct
            }
          ]
        }
      ],
      // tableSelect: "", //保存子组件table选中的项
      tableHandleTab3: {
        tableType: "-1" //处于搜索状态下还是列表内容下
      },
      pageTab3: {
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1,
        placeholder: "输入ASIN"
      }
    };
  },
  created() {},
  async mounted() {
    let data = await this.getShopInfo();
    this.getShopDetail();
    //获取类目列表
    // this.getShopCategoryList(this.page.currentPage, this.page.Size);
    //获取产品列表
    // this.getProductList(this.page.currentPage, this.page.Size);
  },
  methods: {
    // 获取任务详情
    async getShopInfo() {
      return this.$axios
        .post(ShopAnalysisInfoUrl, {
          taskId: parseInt(this.$route.query.taskId)
        })
        .then(res => {
          this.taskStatus = Object.assign({}, res.data.data);
          // console.log("店铺任务详情", res);
          return res;
        })
        .catch(err => {
          // console.log("任务详情接口", err);
        });
    },
    // 获取店铺信息
    getShopDetail() {
      if (!this.$route.query.sellerId) {
        this.$router.push("/admin/competitive/shopAnalysis");
      }
      this.$axios
        .post(ShopDetailUrl, {
          sellerId: this.$route.query.sellerId
        })
        .then(res => {
          if (res.status == 200 && res.data.code == 0) {
            // console.log("单个店铺查看返回", res.data.data);
            this.shopDetail = res.data.data;
            this.shopDetail.taskId = this.$route.query.taskId;
          } else {
            // this.$alert("暂无数据");
            // this.$router.push("/admin/competitive/shopAnalysis");
          }
          this.shopLoading = false;
        })
        .then()
        .catch(err => {
          // console.log("单个产品接口", err);
          this.shopLoading = false;
        });
    },
    // 切换大tab
    async ChangTABS(val) {
      if (val.index == 0) {
        this.isShowMoniContrl = true;
      }
      // 如果点了tab的sku
      if (val.index == 1) {
        this.isShowMoniContrl = false;
      }
      if (val.index == 2) {
        this.isShowMoniContrl = false;
      }
    },
    // 获取子组件传来的新品时间切换不需调用
    getChildDay(msg) {
      this.childDay = msg;
    },
    // tab2
    // 获取类目详情列表todom  tab2
    getShopCategoryList(pageNumber, pageSize, category) {
      this.searchLoading = true; //loading
      if (category) {
        category = category.replace(/>/g, ":");
      }
      this.$axios
        .post(ShopCategoryList, {
          sellerId: this.$route.query.sellerId,
          pageNumber: pageNumber || this.page.currentPage,
          pageSize: pageSize || this.page.Size,
          category: category || ""
        })
        .then(res => {
          if (res.status == 200) {
            // console.log("类目列表，类目搜索", res.data.rows);
            res.data.rows.forEach((item, index) => {
              if (item.category && item.category != "") {
                item.category = item.category.replace(/:/g, ">>");
              }
            });
            this.table.data = res.data.rows;
            this.page.total = res.data.total;
            this.page.pageNo = res.data.pageNo;
            this.page.totalPages = res.data.totalPages;
            // console.log(this.table.data);
            if (category) {
              this.tableHandle.tableType = "1";
            }
            if (!category) {
              this.tableHandle.tableType = "-1";
            }
            setTimeout(() => {
              this.searchLoading = false;
            }, 300);
          }
        })
        .then()
        .catch(err => {
          // console.log("类目列表，类目搜索出错", err);
          this.searchLoading = false;
        });
    },
    // 监听输入框清空的时候改变的type  tab2
    getTableType(childMsg) {
      this.tableHandle.tableType = childMsg;
    },
    // 获取子组件输入框的内容tab2
    getInputText(childMsg) {
      this.inputText = childMsg;
    },
    // 监听分页tab2
    getSizeChange(size) {
      this.page.Size = size;
    },
    getPage(currentPage) {
      this.page.currentPage = currentPage;
    },
    // 点击查看类目分析 tab2
    checkCategory(item) {
      // console.log(item.row, "点击查看类目分析");
      let category = item.row.category;
      this.$store.commit("competitive/categoryChange", category);
      this.tabNumber = "0"; //类目查看是把tab切到店铺详情（tab1），而tab3中的产品查看则是跳转到竞品分析的产品详情（竞品分析的tab1）
      // console.log(this.category);
    },
    // 监听输入框清空的时候改变的type  tab2
    getTableTypeTab3(childMsg) {
      this.tableHandleTab3.tableType = childMsg;
    },
    // 获取子组件输入框的内容tab2
    getInputTextTab3(childMsg) {
      this.inputTextTab3 = childMsg;
    },
    // 监听分页tab3
    getSizeChangeTab3(size) {
      this.pageTab3.Size = size;
    },
    getPageTab3(currentPage) {
      this.pageTab3.currentPage = currentPage;
    },
    // todom
    //获取产品列表tab3
    getProductList(pageNumber, pageSize, sku) {
      this.searchLoadingTab3 = true; //loading
      this.$axios
        .post(ShopProductList, {
          sellerId: this.$route.query.sellerId,
          pageNumber: pageNumber || this.page.currentPage,
          pageSize: pageSize || this.page.Size,
          taskType: 1,
          taskId: parseInt(this.$route.query.taskId),
          sku: sku || "" //整个方法除了用来load列表以外，还用来总搜索的功能。这个参数是用来在tab3做搜索用的，所以会tab3的子组件传来。而vuex里面那个会分发到各个表格，用作watch其变化请求信的图标数据。
        })
        .then(res => {
          if (res.status == 200) {
            // console.log("产品列表以及搜索要用的函数", res);
            this.tableTab3.data = res.data.rows;
            this.pageTab3.total = res.data.total;
            this.pageTab3.pageNo = res.data.pageNo;
            this.pageTab3.totalPages = res.data.totalPages;
            if (sku) {
              this.tableHandleTab3.tableType = "1";
            }
            if (!sku) {
              this.tableHandleTab3.tableType = "-1";
            }
            setTimeout(() => {
              this.searchLoadingTab3 = false;
            }, 300);
          }
        })
        .then()
        .catch(err => {
          // console.log("类目列表，类目搜索出错", err);
          this.searchLoadingTab3 = false;
        });
    }
  },
  computed: {},
  watch: {
    // 监听页码大小
    "page.Size"() {
      if (this.tableHandle.tableType == -1) {
        // 非搜索状态下请求全部
        this.getShopCategoryList(this.page.currentPage, this.page.size);
      } else if (this.tableHandle.tableType == 1) {
        // 搜索状态下请求相对应的类目
        this.getShopCategoryList(
          this.page.currentPage,
          this.page.Size,
          this.inputText
        );
      }
    },
    // 监听页数
    "page.currentPage"() {
      if (this.tableHandle.tableType == -1) {
        this.getShopCategoryList(this.page.currentPage, this.page.size);
      } else if (this.tableHandle.tableType == 1) {
        this.getShopCategoryList(
          this.page.currentPage,
          this.page.Size,
          this.inputText
        );
      }
    },
    // tab3
    // 监听页码大小tab3
    "pageTab3.Size"() {
      if (this.tableHandleTab3.tableType == -1) {
        // 非搜索状态下请求全部
        this.getProductList(this.pageTab3.currentPage, this.pageTab3.size);
      } else if (this.tableHandleTab3.tableType == 1) {
        // 搜索状态下请求相对应的类目
        this.getProductList(
          this.pageTab3.currentPage,
          this.pageTab3.Size,
          this.inputTextTab3
        );
      }
    },
    // 监听页数tab3
    "pageTab3.currentPage"() {
      if (this.tableHandleTab3.tableType == -1) {
        this.getProductList(this.pageTab3.currentPage, this.pageTab3.size);
      } else if (this.tableHandleTab3.tableType == 1) {
        this.getProductList(
          this.pageTab3.currentPage,
          this.pageTab3.Size,
          this.inputTextTab3
        );
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.main {
  border-top: 2px solid #f0f3fa;
  position: relative;
  width: 100%;
  main {
    width: 100%;
  }
}
.chartPart1 {
  margin-top: 20px;
  width: 100%;
  display: flex;
  // border: 1px solid #333;
  box-sizing: border-box;
  .c1,
  .c2 {
    width: 50%;
  }
}
</style>
