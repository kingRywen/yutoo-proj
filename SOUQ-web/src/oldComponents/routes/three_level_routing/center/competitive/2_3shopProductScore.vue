<!-- tab1  char789列表 -->
<template>
  <div v-if="this.taskStatusAndType">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" v-if="$route.path !== '/admin/dashboard'">
      <el-breadcrumb-item :to="{ path: '/admin/competitive/checkShopAnalysis' }">店铺分析</el-breadcrumb-item>
      <el-breadcrumb-item>查看</el-breadcrumb-item>
    </el-breadcrumb>
    <section class="container" le="">
      <header class="h1" v-if="this.clickItem">
        <span class="s1"></span>
        <span>评分在</span>
        <span>{{this.clickItem.range}}</span>
        <span>之间的</span>
        <span>{{this.clickItem.newOrOld}}</span>
      </header>
      <div v-loading="searchLoading">
        <!-- 搜索 -->
        <inputSearch :Fun="getShopProductHistoryList" :page="page" v-on:table-type="getTableType" v-on:child-input-text="getInputText"></inputSearch>
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
    </section>
  </div>
</template>

<script>
import inputSearch from "./2_1tabs/tab2/inputSearch"; // 搜索
import myTable from "@/components/common/myTable"; // table
import PageVue from "../../../../common/page.vue"; //分页
import { ShopProductHistoryList } from "../../../../../api/myApi";
import { getDay } from "../../../../../api/functions.js";
export default {
  components: { inputSearch, myTable, PageVue },
  data() {
    return {
      inputText: "",
      searchLoading: false,
      //table子组件
      table: {
        height: "600px",
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
      columns: [
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
          width: "600"
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
      tableHandle: {
        //保存table的一些设置
        // multipleSelection: [],
        // selectTaskIdArr: [],
        // 记录是搜索返回的数据，还是列表数据 1列表数据，-1搜索数据
        tableType: "-1" //处于搜索状态下还是列表内容下
      },
      page: {
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
  mounted() {
    if (this.clickItem == "" && this.taskStatusAndType == "") {
      this.$router.push("/admin/competitive/shopAnalysis");
    }
    // 如果vuex有用户点击的chart789的选项，以及保存有类型和店铺状态，才发起请求，否则，上面hi跳转到其他页面
    if (this.clickItem && this.taskStatusAndType) {
      this.getShopProductHistoryList();
    }
    this.$store.commit(
      "common/pathFromCheckProductAnalysis",
      "/admin/competitive/shopAnalysis"
    );
  },
  methods: {
    getTableType(childMsg) {
      this.tableHandle.tableType = childMsg;
    },
    // 获取子组件输入
    getInputText(childMsg) {
      this.inputText = childMsg;
    },
    // 监听分页(chart789从弹窗进去)
    getSizeChange(size) {
      this.page.Size = size;
    },
    getPage(currentPage) {
      this.page.currentPage = currentPage;
    },
    getShopProductHistoryList(pageNumber, pageSize, sku) {
      this.searchLoading = true; //loading
      this.$axios
        .get(ShopProductHistoryList, {
          params: {
            sellerId: this.taskStatusAndType.taskStatus.sellerId,
            pageNumber: pageNumber || this.page.currentPage,
            pageSize: pageSize || this.page.Size,
            sku: sku || "", //整个方法除了用来load列表以外，还用来总搜索的功能。这个参数是用来在做搜索用的，所以会由的子组件传来。而vuex里面那个会分发到各个表格，用作watch其变化请求信的图标数据。
            type: this.taskStatusAndType.type, //暂时在前面加一个2写死，改
            productType: this.clickItem.productType,
            // range: "1001~5000" || this.clickItem.range, //改
            range: this.clickItem.range, //已改
            statTime: getDay().today,
            newArrivalDay: this.newArrivalDay,
            // monitorTo:
            //   "2018-06-13" ||
            //   this.taskStatusAndType.taskStatus.monitorTo.slice(0, 10) //改
            monitorTo: this.taskStatusAndType.taskStatus.monitorTo.slice(0, 10) //已改
          }
        })
        .then(res => {
          if (res.status == 200) {
            console.log("商品列表以及搜索要用的函数", res);
            this.table.data = res.data.rows;
            this.page.total = res.data.total;
            this.page.pageNo = res.data.pageNo;
            this.page.totalPages = res.data.totalPages;
            if (sku) {
              this.tableHandle.tableType = "1";
            }
            if (!sku) {
              this.tableHandle.tableType = "-1";
            }
            setTimeout(() => {
              this.searchLoading = false;
            }, 300);
          }
        })
        .then()
        .catch(err => {
          console.log("类目列表，类目搜索出错", err);
          this.searchLoading = false;
        });
    },
    // 点击查看商品详情 （chart789和tab3一样的函数）只是monitorTo在这里是从vuex里面取得
    checkProduct(item) {
      console.log(item.row, "点击查看商品详情");
      this.$router.push(
        // 记得把监控to的时间传过去，因为从这跳过去的没有taskId所以那边无法使用taskid去获取monitorTo
        "/admin/competitive/checkProductAnalysis?sku=" +
          item.row.sku +
          "&monitorTo=" +
          this.taskStatusAndType.taskStatus.monitorTo
      );
      // 从店铺分析的商品跳转到竞品分析的时候，往vuex里面保存一下路由的fullpath.方便给竞品分析的面包屑使用
      //   this.$store.commit("competitive/fullPath", this.$route.fullPath);
    }
  },
  computed: {
    // 获取vuex用户点击了哪一个数据进来的
    clickItem() {
      return this.$store.state.competitive.DialogItem;
    },
    // 获取vuex里面的店铺状态taskStatus和用户点击的chart的数据类型(0-评分产品分布，1-BSR排名产品分布，2-评价数产品分布)。方便请求新数据使用。
    taskStatusAndType() {
      return this.$store.state.competitive.taskStatusAndType;
    },
    // 从vuex从获取多少天才属于新品的一个设定
    newArrivalDay() {
      return this.$store.state.competitive.newProDay;
    }
  },
  watch: {
    // 监听页码大小
    "page.Size"() {
      if (this.tableHandle.tableType == -1) {
        // 非搜索状态下请求全部
        this.getShopProductHistoryList(this.page.currentPage, this.page.size);
      } else if (this.tableHandle.tableType == 1) {
        // 搜索状态下请求相对应的类目
        this.getShopProductHistoryList(
          this.page.currentPage,
          this.page.Size,
          this.inputText
        );
      }
    },
    // 监听页数
    "page.currentPage"() {
      if (this.tableHandle.tableType == -1) {
        this.getShopProductHistoryList(this.page.currentPage, this.page.size);
      } else if (this.tableHandle.tableType == 1) {
        this.getShopProductHistoryList(
          this.page.currentPage,
          this.page.Size,
          this.inputText
        );
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  border: 1px solid #ebeef5;
  padding: 10px 15px;
  margin-top: 16px;
  .h1 {
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: bold;
    color: #424f62;
    .s1 {
      display: inline-block;
      width: 2px;
      height: 18px;
      background: #0094e9;
      position: relative;
      top: 4px;
      margin-right: 5px;
    }
  }
}
</style>
