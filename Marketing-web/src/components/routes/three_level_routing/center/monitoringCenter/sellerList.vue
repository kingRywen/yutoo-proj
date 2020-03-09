<template>
  <!-- 跟卖监控查看 -->
  <div class='sellerList'>
    <div style="padding:0px 2px 8px;" class="font_14px" v-model="skutitle">
      <span class="title_icon"></span>
      <span class="color_666">ASIN:</span>
      <span class="titleBox">{{skutitle}}</span>
    </div>
    <!-- 布局 -->
    <el-row style="margin-bottom: 8px;height:30px" type="flex" justify="space-between">
      <!-- 输入框 关键词输入 -->
      <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
        <el-input placeholder="请输入卖家名称" v-model.trim="searchListData.sellerName" clearable style='max-width:150px;'>
        </el-input>
        <!-- 搜索按钮 -->
        <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="searchSonSku">搜索</el-button> -->
        <el-button type="success" icon="el-icon-search" @click="searchSonSku">搜索</el-button>
        <!-- 搜索按钮 -->
        <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="reSearchSonSku" style="margin-left:5px !important">清空</el-button>
      </el-col>
      <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
        <!-- todoh -->
        <el-date-picker unlink-panels :picker-options="pickerOptions" :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="newTime">
        </el-date-picker>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <!-- <div style="padding:20px 10px;">ASIN:BKDEGGTCEDG</div> -->

    <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="saveSalesMonitoringSeeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortable">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="sellerName" label="卖家" align='center'>
      </el-table-column>
      <el-table-column prop="soldBeginTime" label="跟卖开始时间" align='center' sortable='custom'>
        <template slot-scope="scope">
          <div>{{scope.row.soldBeginTime | _formatData}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="soldEndTime" label="跟卖结束时间" align='center' sortable='custom'>
        <template slot-scope="scope">
          <div>{{scope.row.soldEndTime | _formatData}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="minPrice" label="最低价" align='center' sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.minPrice | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="maxPrice" label="最高价" align='center' sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.maxPrice | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fbpFlag" label="发货方式" align='center'>
        <template slot-scope="scope">
          <span>{{scope.row.fbpFlag==0?"自发货":scope.row.fbpFlag==1?"FBA":scope.row.fbpFlag==2?"自发货+FBA":"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cartRate" label="购物车占有率" align='center' sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.cartRate | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--查看详情研创-->
    <sellerDetail :dialog="dialog" ref="sellerDetail">

    </sellerDetail>
  </div>
</template>
<script>
/* eslint-disable */
import { isDisabled, getDay } from "@/api/functions";
import { mapActions, mapState, mapMutations } from "vuex";
import sellerDetail from "./sellerListChild/sellerDetail"; // 竞品——查看-tab2中的点击跟卖数量的弹窗
export default {
  components: { sellerDetail },
  data() {
    return {
      // 弹窗组件
      dialog: {
        url: "",
        title: "查看跟卖-子ASIN",
        width: "900px",
        dialogShow: false,
        sellParentLoading: false,
        list: [], // 传给弹窗组件的数据，包括新品和非新品的数字
        page: {
          //page的也放这里了跟别的组件不太一样
          Size: this.vuexSize || 10,
          currentPage: this.vuexCurrentPage || 1,
          total: 0,
          pageNo: 1,
          totalPages: 1,
          sku: ""
        }
      },
      DateMsg: {
        width: "140px",
        DateValue:
          this.$route.query.statTime != ""
            ? this.$route.query.statTime
            : getDay().today,
        type: "date"
      },
      // 定义添加监控只能是30天之内
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let one = 30 * 24 * 3600 * 1000;
          let oneMonths = curDate - one;
          return time.getTime() > Date.now() || time.getTime() < oneMonths;
        }
      },
      isDisabled: true,
      hrefData: null,
      loading: true,
      saveSalesMonitoringSeeList: [],
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      tabPosition: 30,
      searchListData: {
        sellerName: ""
      },
      skutitle: this.$route.query.sku,
      taskId: "",
      multipleSelection: [],
      sellerName1: true,
      sellerName2: false,
      title1: true,
      title2: false,
      sort: null
    };
  },
  watch: {
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.isDisabled = isDisabled(newV);
        if (this.isDisabled === true) {
          this.getchildSkuList();
        }
        //要干的事情
      },
      deep: true
    },
    $route(to, from, next) {
      if (to.name === "preventSalesMonitoringSee") {
        this.getchildSkuList();
        this.skutitle = this.$route.params.sku; //传参
      }
    }
  },
  created() {
    this.$store.commit(
      "common/pathFromCheckProductAnalysis",
      "/admin/monitoringCenter/salesMonitoring"
    );
    this.getchildSkuList();
  },
  mounted() {},
  computed: {},
  methods: {
    newTime(val) {
      this.pageSize = 10;
      this.pageNumber = 1;
      if (!val) {
        // 去掉日期的时候恢复默认
        this.DateMsg.DateValue = "";
        this.getchildSkuList();
        return;
      }
      this.DateMsg.DateValue = val;
      this.getchildSkuList();
    },
    //传父文件的参数过来，请求数据
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
        this.sort = null;
        this.getchildSkuList(); //请求列表
      } else {
        let prop = this.toLine(sort_param.prop);
        this.sort = prop + " " + type;
        this.getchildSkuList(); //请求列表
      }
    },
    getchildSkuList() {
      const { pageSize, pageNumber } = this;
      let taskId = parseInt(this.$route.query.taskId);
      let sku = this.$route.query.sku;
      let statTime = this.DateMsg.DateValue;
      let params = this.$.dealObjectValue({
        pageSize,
        pageNumber,
        taskId,
        sku,
        statTime,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        ...this.searchListData
      });
      if (this.sort === null) {
        delete params.sort;
      } else {
        params.sort = this.sort;
      }
      this.loading = true;
      this.$axios.post("/productSellingDay/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          this.loading = false;
          //   return;
        }
        this.loading = false;
        // 假数据
        // res.data = {
        //   offset: 0,
        //   limit: 2147483647,
        //   pageNo: 1,
        //   pageSize: 10,
        //   rows: [
        //     {
        //       taskId: 4361,
        //       sellerId: "sdrevsdd",
        //       parentSku: "B00IGQRMRO",
        //       sellerName: "dfgsdfg",
        //       sellerUrl: "dfgsdfg",
        //       fbpFlag: 0,
        //       minPrice: "$9.99",
        //       maxPrice: "$11.00",
        //       cartRate: 0.21,
        //       soldBeginTime: "2018-09-28 15:53:21",
        //       soldEndTime: "2018-09-28 23:59:59"
        //     }
        //   ],
        //   total: 1,
        //   totalPages: 1,
        //   first: 1
        // };
        // 假数据end
        this.pageNumber = res.data.pageNo; //分页
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.saveSalesMonitoringSeeList = res.data.rows;
        // 处理购物车占有率显示
        this.saveSalesMonitoringSeeList = this.saveSalesMonitoringSeeList.map(
          item => {
            if (item.cartRate !== null && item.cartRate !== "") {
              let num = item.cartRate * 10000 / 100;
              if (/^\d+\.\d+$/.test(num)) {
                item.cartRate = num.toFixed(2) + "%";
              } else {
                item.cartRate = num + "%";
              }
              return item;
            }
          }
        );
      });
    },
    //搜索子SKU
    searchSonSku() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getchildSkuList();
    },
    // 清空搜索
    reSearchSonSku() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.searchListData = { sellerName: "" };
      // this.getchildSkuList();
    },
    // table选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    //改变每页显示数量
    handleSizeChange(val) {
      this.pageSize = val;
      this.getchildSkuList();
    },
    //改变页数
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getchildSkuList();
    },
    // 查看详情弹窗todom
    handleClick(row) {
      console.log(row);
      this.dialog.dialogShow = true;
      this.dialog.sku = this.$route.query.sku;
      this.dialog.taskId = this.$route.query.taskId;
      this.dialog.statTime = this.DateMsg.DateValue;
      this.dialog.sellerId = row.sellerId;
      this.dialog.title = "查看跟卖-" + row.sellerName;
      this.dialog.url = "/productSellingSum/list";
      this.$refs.sellerDetail.getProductSellingDetailList();
    }
  }
};
</script>

<style scoped>
.titleBox {
  text-indent: 1em;
  color: #777;
  font-weight: 900;
}
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
</style>
