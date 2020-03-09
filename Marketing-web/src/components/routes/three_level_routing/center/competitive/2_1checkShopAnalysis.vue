<!-- 店铺分析的查看 -->
<template>
  <div class='checkShopAnalysis' v-loading="shopLoading">
    <div class="main">
      <!-- 中间时间和开关监控 -->
      <moniContrl v-if="taskStatus" :childStatus="taskStatus" :callback="getShopInfo" v-on:child-day="getChildDay" :isShowMoniContrl="isShowMoniContrl">
      </moniContrl>
      <!-- tabs选项卡 -->
      <el-tabs type="border-card" v-model="tabNumber" @tab-click="ChangTABS">

        <!-- tab1店铺详情 -->
        <el-tab-pane label="店铺详情" name="0">
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
        </el-tab-pane>
        <!-- tab2 -->
        <!-- 类目查询-->
        <el-tab-pane label="类目详情" name="1">
          <div style="position:relative;top:-5px;color:#00c0de" v-if="copy.show">
            <el-button @click="copy.show=false" style="padding:6px 15px;background:#ECF5FF;color:#00C0DE !impotant">&nbsp;返回列表</el-button>
            <span style="margin-left:10px;font-size:13px;color:#00C0DE !impotant"> 当前类目({{copy.category|_formatData_cate}})</span>
          </div>
          <div v-loading="searchLoading" v-if="!copy.show">
            <!-- 搜索 -->
            <inputSearch :Fun="getShopCategoryList" :page="page" v-on:table-type="getTableType" v-on:child-input-text="getInputText"></inputSearch>
            <!-- 表格 -->
            <section>
              <myTable :table="table" :columns="columns" style="margin-top:15px;">
              </myTable>
            </section>
            <!-- 分页 -->
            <section>
              <PageVue v-bind:childPages="page" v-on:size-change="getSizeChange" v-on:current-page="getPage" style="margin-top:10px"></PageVue>
            </section>
          </div>
          <!-- 隐藏显示类目详情todoh -->
          <copy v-if="copy.show"></copy>
        </el-tab-pane>
        <!-- tab3 -->
        <!-- 产品 todoh-->
        <el-tab-pane label="产品" name="2">
          <div v-loading="searchLoadingTab3">
            <!-- 搜索 -->
            <inputSearch :Fun="getProductList" :page="pageTab3" v-on:table-type="getTableTypeTab3" v-on:child-input-text="getInputTextTab3"></inputSearch>
            <!-- 表格 -->
            <section>
              <myTable :table="tableTab3" :columns="columnsTab3" style="margin-top:15px;">
              </myTable>
            </section>
            <!-- 分页 -->
            <section>
              <PageVue v-bind:childPages="pageTab3" v-on:size-change="getSizeChangeTab3" v-on:current-page="getPageTab3" style="margin-top:10px"></PageVue>
            </section>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
    <!-- </section> -->
  </div>
</template>

<script>
// todoi
import copy from "./2_1copy";
import moniContrl from "./2_1component/moniContrl";
import shopMsg from "./2_1tabs/tab1/shopMsg";
import evalChart from "./2_1tabs/tab1/chart1"; // 评分数
import scoreMap from "./2_1tabs/tab1/chart2"; // 产品评分分布图
import chartThree from "./2_1tabs/tab1/chart3"; // 新品，新平评分
import chartFour from "./2_1tabs/tab1/chart4"; // 总数量
import chartFive from "./2_1tabs/tab1/chart5"; // 日新增评价数-详情
import chartSix from "./2_1tabs/tab1/chart6"; // 新增评价数
import chartSeven from "./2_1tabs/tab1/chart7"; // 评分产品分布
import chartEight from "./2_1tabs/tab1/chart8"; // BSR排名
import chartNight from "./2_1tabs/tab1/chart9"; // 评分数
import inputSearch from "./2_1tabs/tab2/inputSearch"; // 搜索
import myTable from "@/components/common/myTable"; // table
import PageVue from "@/components/common/page.vue"; //分页
import { mapActions, mapGetters, mapState } from "vuex";
import {
  ShopAnalysisInfoUrl,
  ShopDetailUrl,
  ShopCategoryList,
  ShopProductList
} from "@/api/myApi";
import { getDay, oArrToTwoArr, clearArrTrim, Trim } from "@/api/functions.js";
export default {
  components: {
    moniContrl,
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
    PageVue,
    copy
  },
  data() {
    return {
      obj: null,
      // 传给组件copy的
      copy: {
        category: "",
        show: false
      },
      shopLoading: true,
      isShowMoniContrl: this.tabNumber == "0" ? false : true, //是否显示新品时间的切换
      tabNumber: this.$route.query.tabNumber
        ? this.$route.query.tabNumber + ""
        : "0", //默认选中哪个大tab
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
        data: [
          // {
          //   category: "大旭",
          //   productCnt: "2017-3-17-10:30",
          //   newReviewCnt: "100",
          //   reviewCnt: "111"
          // },
          // {
          //   category: "大旭",
          //   productCnt: "2017-3-17-10:30",
          //   newReviewCnt: "100",
          //   reviewCnt: "111"
          // }
        ],
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
          operations: [
            {
              category: true
            }
          ]
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
              label: "查看类目分析",
              func: this.checkCategory
            }
          ]
        }
      ],
      // tableSelect: "", //保存子组件table选中的项
      tableHandle: {
        //保存table的一些设置
        // multipleSelection: [],
        // selectTaskIdArr: [],
        // 记录是搜索返回的数据，还是列表数据 1列表数据，-1搜索数据
        tableType: "-1" //处于搜索状态下还是列表内容下
      },
      page: {
        isRemoveMiddleSpace: false,
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
        height: 12000,
        //table的一些参数
        data: [
          // {
          //   ASIN: "BBB464G",
          //   imageUrl: "http://",
          //   title: "标题1111",
          //   sellerName: "卖家名字"
          // }
        ],
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
          operations: [
            {
              title: true
            }
          ]
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
        //保存table的一些设置
        // multipleSelection: [],
        // selectTaskIdArr: [],
        // 记录是搜索返回的数据，还是列表数据 1列表数据，-1搜索数据
        tableType: "-1" //处于搜索状态下还是列表内容下
      },
      pageTab3: {
        isRemoveMiddleSpace: true,
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
    // 到达这里存一下整个路径matched，给子组件做面包屑插入
    let obj = {};
    obj.path = this.$route.matched[this.$route.matched.length - 1].path;
    obj.name = this.$route.matched[this.$route.matched.length - 1].name;
    obj.meta = this.$route.matched[this.$route.matched.length - 1].meta;
    obj.query = this.$route.query;
    this.obj = obj;
    this.$store.commit("competitive/saveMatchedForChild", this.obj);
    //end
    if (this.$route.query.sellerId && this.$route.query.sellerId === "null") {
      this.$router.push("/admin/competitive/shopAnalysis");
      return;
    }
    if (!this.$route.query.sellerId || !this.$route.query.taskId) {
      this.$router.push("/admin/competitive/shopAnalysis");
      return;
    }
    let data = await this.getShopInfo();
    this.getShopDetail();
    //获取类目列表
    this.getShopCategoryList(this.page.currentPage, this.page.Size);
    //获取产品列表
    this.getProductList(this.page.currentPage, this.page.Size);
    this.$store.commit(
      "common/pathFromCheckProductAnalysis",
      "/admin/competitive/shopAnalysis"
    );
  },
  methods: {
    // 用户点击全部，则往vuex的类目传入一个空值，则表示重新loading全部的类目
    // reloadAll() {
    //   this.$store.commit("competitive/categoryChange", "");
    // },
    // 获取任务详情
    async getShopInfo() {
      return this.$axios
        .post(ShopAnalysisInfoUrl, {
          taskId: parseInt(this.$route.query.taskId)
        })
        .then(res => {
          this.taskStatus = Object.assign({}, res.data.data);
          // console.log("店铺任务详情", res);
          this.shopLoading = false;
          return res;
        })
        .catch(err => {
          // console.log("任务详情接口", err);
          this.shopLoading = false;
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
        })
        .catch(err => {
          // console.log("单个产品接口", err);
        });
    },
    // 切换大tab
    async ChangTABS(val) {
      if (val.index == 0) {
        this.obj.query.tabNumber = 0;
        this.$store.commit("competitive/saveMatchedForChild", this.obj);
        this.isShowMoniContrl = true;
      }
      // 如果点了tab的sku
      if (val.index == 1) {
        this.obj.query.tabNumber = 1;
        this.isShowMoniContrl = false;
      }
      if (val.index == 2) {
        this.obj.query.tabNumber = 2;
        this.$store.commit("competitive/saveMatchedForChild", this.obj);
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
      let params = {
        sellerId: this.$route.query.sellerId,
        pageNumber: pageNumber || this.page.currentPage,
        pageSize: pageSize || this.page.Size,
        category: category || ""
      };
      params = this.$.dealObjectValue(params);
      this.$axios
        .post(ShopCategoryList, params)
        .then(res => {
          if (res.status == 200) {
            // console.log("类目列表，类目搜索", res.data.rows);
            res.data.rows.forEach((item, index) => {
              // if (item.category && item.category != "") {
              //   item.category = item.category.replace(/:/g, ">>");
              // }
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
      // todon
      this.page.currentPage = 1;
      this.inputText = childMsg;
    },
    // 监听分页tab2
    getSizeChange(size) {
      this.page.Size = size;
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
    getPage(currentPage) {
      this.page.currentPage = currentPage;
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
    // 点击查看类目分析 tab2 todon
    checkCategory(item) {
      // console.log(item.row, "点击查看类目分析");
      // let category = item.row.category.replace(/>>/g, ":");
      let category = item.row.category;
      this.$store.commit("competitive/categoryChange", category);
      // 显示
      // this.copy.category = category.trim().replace(/：|》|>>/g, ":");
      this.copy.category = category.trim();
      this.copy.show = true;
      // this.tabNumber = "0"; //类目查看是把tab切到店铺详情（tab1），而tab3中的产品查看则是跳转到竞品分析的产品详情（竞品分析的tab1）
      // console.log(this.category);
    },
    // getAllCategory() {
    //   //清除的输入框则改变当前的表格显示的数据状态，切回到全部显示，-1
    //   this.$emit("table-type", "-1");
    //   this.Fun(this.page.currentPage, this.page.Size);
    // },
    // getAllProduct() {
    //   //清除的输入框则改变当前的表格显示的数据状态，切回到全部显示，-1
    //   this.$emit("table-type", "-1");
    //   this.Fun(this.page.currentPage, this.page.Size);
    // },
    // tab3
    // 监听输入框清空的时候改变的type  tab2
    getTableTypeTab3(childMsg) {
      this.tableHandleTab3.tableType = childMsg;
    },
    // 获取子组件输入框的内容tab2
    getInputTextTab3(childMsg) {
      this.pageTab3.currentPage = 1;
      this.inputTextTab3 = childMsg;
    },
    // 监听分页tab3
    getSizeChangeTab3(size) {
      this.pageTab3.Size = size;
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
    getPageTab3(currentPage) {
      this.pageTab3.currentPage = currentPage;
      if (this.tableHandleTab3.tableType == -1) {
        this.getProductList(this.pageTab3.currentPage, this.pageTab3.size);
      } else if (this.tableHandleTab3.tableType == 1) {
        this.getProductList(
          this.pageTab3.currentPage,
          this.pageTab3.Size,
          this.inputTextTab3
        );
      }
    },
    // todom
    //获取产品列表tab3
    getProductList(pageNumber, pageSize, sku) {
      this.searchLoadingTab3 = true; //loading
      let params = {
        sellerId: this.$route.query.sellerId,
        pageNumber: pageNumber || this.pageTab3.currentPage,
        pageSize: pageSize || this.pageTab3.Size,
        taskType: 1,
        taskId: parseInt(this.$route.query.taskId),
        sku: sku || "" //整个方法除了用来load列表以外，还用来总搜索的功能。这个参数是用来在tab3做搜索用的，所以会tab3的子组件传来。而vuex里面那个会分发到各个表格，用作watch其变化请求信的图标数据。
      };
      params = this.$.dealObjectValue(params);
      this.$axios
        .post(ShopProductList, params)
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
        .catch(err => {
          // console.log("类目列表，类目搜索出错", err);
          this.searchLoadingTab3 = false;
        });
    },
    // 点击查看产品详情 tab3
    checkProduct(item) {
      // console.log(item.row, "点击查看产品详情");
      this.$router.push(
        // 记得把监控to的时间传过去，因为从这跳过去的没有taskId所以那边无法使用taskid去获取monitorTo
        "/admin/competitive/productAnalysis/checkProductAnalysis?sku=" +
          item.row.sku +
          "&taskId=" +
          this.$route.query.taskId +
          "&taskType=1"
      );
      // 从店铺分析的产品跳转到竞品分析的时候，往vuex里面保存一下路由的fullpath.方便给竞品分析的面包屑使用
      // this.$store.commit("competitive/fullPath", this.$route.fullPath);
    }
  },
  computed: {},
  watch: {
    // 监听页码大小
    // "page.Size"() {
    //   if (this.tableHandle.tableType == -1) {
    //     // 非搜索状态下请求全部
    //     this.getShopCategoryList(this.page.currentPage, this.page.size);
    //   } else if (this.tableHandle.tableType == 1) {
    //     // 搜索状态下请求相对应的类目
    //     this.getShopCategoryList(
    //       this.page.currentPage,
    //       this.page.Size,
    //       this.inputText
    //     );
    //   }
    // },
    // 监听页数
    // "page.currentPage"() {
    //   if (this.tableHandle.tableType == -1) {
    //     this.getShopCategoryList(this.page.currentPage, this.page.size);
    //   } else if (this.tableHandle.tableType == 1) {
    //     this.getShopCategoryList(
    //       this.page.currentPage,
    //       this.page.Size,
    //       this.inputText
    //     );
    //   }
    // },
    // tab3
    // 监听页码大小tab3
    // "pageTab3.Size"() {
    //   if (this.tableHandleTab3.tableType == -1) {
    //     // 非搜索状态下请求全部
    //     this.getProductList(this.pageTab3.currentPage, this.pageTab3.size);
    //   } else if (this.tableHandleTab3.tableType == 1) {
    //     // 搜索状态下请求相对应的类目
    //     this.getProductList(
    //       this.pageTab3.currentPage,
    //       this.pageTab3.Size,
    //       this.inputTextTab3
    //     );
    //   }
    // },
    // 监听页数tab3
    // "pageTab3.currentPage"() {
    //   if (this.tableHandleTab3.tableType == -1) {
    //     this.getProductList(this.pageTab3.currentPage, this.pageTab3.size);
    //   } else if (this.tableHandleTab3.tableType == 1) {
    //     this.getProductList(
    //       this.pageTab3.currentPage,
    //       this.pageTab3.Size,
    //       this.inputTextTab3
    //     );
    //   }
    // }
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
