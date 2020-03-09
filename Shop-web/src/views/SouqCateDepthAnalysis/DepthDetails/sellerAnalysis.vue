<!-- 查看 -->
<template>
  <div class="___common">
    <a v-show="false" ref="exportExcel"></a>
    <template>
      <el-search :search="search" :clearSearch.sync="clearSearch" :backFun="backFun"></el-search>
    </template>
    <template>
      <section class="__relative">
        <template>
          <el-handler :userSelect="userSelect" :hander="hander"></el-handler>
        </template>
      </section>
    </template>
    <template>
      <el-table-pagination ref="table" :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect" :stripe='false'></el-table-pagination>
    </template>
    <template>
      <el-dialog :close-on-click-modal="false" :title="showCate.title" :visible.sync="showCate.visible" height='505px' width="950px">
        <el-table-pagination :table="showCate.table" :pageNumber.sync="showCate.table.pageNumber" :pageSize.sync="showCate.table.pageSize" :total="showCate.table.total" v-loading="showCate.table.loading" :userSelect.sync="showCate.userSelect" :stripe='false' :selection="false" :getShowCateList="getShowCateList" style="padding-bottom:15px;"></el-table-pagination>
      </el-dialog>
    </template>
    <!-- 图表 -->
    <el-dialog :close-on-click-modal="false" :title="chartData.title" :visible.sync="chartData.visible" height='505px' width="950px" @close="closeDialog">
      <detail-chart :chartData.sync="chartData" ref="child"></detail-chart>
    </el-dialog>
  </div>
</template>
<script>
import { CONST_PORT_CONFIG } from "Config";
import detailChart from "./echarts";
const { BASE_URL } = CONST_PORT_CONFIG;
export default {
  components: { detailChart },
  provide() {
    return {
      getList: this.getList,
      check__: this.check__,
      draw__: this.draw__,
      addTask: this.addTask,
      showCate__: this.showCate__,
      clearSort: this.clearSortable,
      // 2
      download: this.downloadFun
    };
  },
  data() {
    return {
      // 搜索
      search: {
        taskName: false,
        sellerName: true
      },
      // 控件
      hander: {
        addTask3__: true,
        addButton: "加入深度分析",
        // 3
        download: true,
        downloadText: "导出数据"
        // deleteAuthCate: true
      },
      clearSearch: null,
      showCate: {
        visible: false,
        title: "类目查看",
        sellerId: null,
        // 表格
        table: {
          loading: false,
          rows: [],
          //   rowKey: "sellerId",
          pageNumber: 1,
          pageSize: 10,
          total: 0,
          show: {
            category: true,
            productCnt: true,
            fbsProductCnt: true,
            fbmProductCnt: true
          }
        }
      },
      chartData: {
        visible: false,
        chartShow: true,
        title: "新增评价",
        sellerId: "",
        siteId: ""
      },
      // 表格
      table: {
        loading: false,
        rows: [],
        // rowKey: "sellerId",
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          sellerName1: true,
          productCnt: true,
          brandCnt: true,
          positiveRate: true,
          newFeedbackCntD30: true,
          newFeedbackCntD90: true,
          feedbackCnt: true,
          openTime: true,
          categoryCnt: true,
          Handle: {
            showChart: true
          }
        }
      },
      userSelect: [],
      handlerButtonLoading: {
        funCopyButtonLoading: false,
        funExportButtonLoading: false,
        funAddButtonLoading: false
      }
    };
  },

  created() {
    // this.getList();
  },
  mounted() {},
  filters: {
    strReplece(val) {
      val = val.replace(/:/g, " >> ");
      return val;
    }
  },
  methods: {
    // 4导出todo
    downloadFun() {
      let params = {
        taskId: this.$route.query.taskId,
        siteId: +this.$route.query.siteId__
      };
      let sellerIds = [];
      if (this.userSelect.length > 0) {
        this.userSelect.forEach(el => {
          sellerIds.push(el.sellerId);
        });
        params.sellerIds = sellerIds;
      }
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.$ajax({
        method: "post",
        url: BASE_URL + "taskCateDepthAnalysisSouq/exportSellerDetails",
        data: params,
        responseType: "blob"
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "souq深度分析卖家分析.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    clearSortable() {
      this.$refs.table.clearSortable();
    },
    // 列表
    getList(arg) {
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        taskId: this.$route.query.taskId,
        siteId: +this.$route.query.siteId__,
        ...arg
      };
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["TaskCateDepthAnalysisSouqSellerDetails"](params)
        .then(data => {
          this.table.loading = false;
          this.table.rows = data.rows;
          // console.log(data.rows == "");
          if (
            data.rows == "" &&
            data.pageNo !== null &&
            data.pageNo !== "" &&
            data.pageNo !== 1
          ) {
            let a = {
              pageSize: this.table.pageSize,
              pageNumber: 1
            };
            this.getList(a);
            return;
          } else {
            this.table.pageNumber = data.pageNo;
          }
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          return true;
        })
        .catch(err => {
          this.table.loading = false;
          console.log(err);
          return true;
        });
    },
    addTask(arg) {
      this.$api["TaskCateDepthAnalysisSouqSave"](arg).then(data => {
        this.getList();
      });
    },
    // 点击类目数，显示弹窗表格
    showCate__(row) {
      //   console.log(arg);
      this.showCate.sellerId = row.sellerId;
      this.showCate.visible = true;
      let params = {
        pageSize: 10,
        pageNumber: 1
      };
      this.getShowCateList(params);
    },
    getShowCateList(arg) {
      let params = {
        pageSize: this.showCate.table.pageSize,
        pageNumber: this.showCate.table.pageNumber,
        sellerId: this.showCate.sellerId,
        siteId: +this.$route.query.siteId__,
        taskId: +this.$route.query.taskId,
        ...arg
      };
      params = this.$.dealObjectValue(params);
      this.showCate.table.loading = true;
      this.$api["TaskCateDepthAnalysisSouqListToCategoryBySeller"](params)
        .then(data => {
          this.showCate.table.loading = false;
          this.showCate.table.rows = data.rows;
          // console.log(data.rows == "");
          this.showCate.table.pageNumber = data.pageNo;
          this.showCate.table.pageSize = data.pageSize;
          this.showCate.table.total = data.total;
        })
        .catch(err => {
          this.showCate.table.loading = false;
          console.log(err);
        });
    },
    // 画图 五
    draw__(row) {
      //   console.log(row);
      this.chartData.visible = true;
      this.chartData.sellerId = row.sellerId;
      this.chartData.siteId =
        +this.$store.state.common.siteId__ || +this.$route.query.siteId__;
      this.$nextTick(() => {
        this.$refs.child.showChartChild(this.chartData.sellerId);
      });
    },
    // 关闭弹窗时调用子组件方法清空日期 六
    closeDialog() {
      this.$refs.child.clearDate();
    },
    backFun() {
      let fromCate = this.$route.query.fromCate;
      if (fromCate) {
        // 如果是从类目跳转过来的话
        this.$router.push(fromCate);
        return;
      }
      let siteId__ = this.$route.query.siteId__;
      if (siteId__) {
        this.$router.push({
          path: "/SOUQ/souqCateDepthAnalysis",
          query: {
            siteId__: siteId__
          }
        });
      } else {
        this.$router.push("/SOUQ/souqCateDepthAnalysis");
      }
    }
  },
  computed: {},
  watch: {
    // sellerData(val) {
    //   if (
    //     val.sellerId !== this.$route.query.sellerId ||
    //     val.siteId != this.$route.query.siteId
    //   ) {
    //     this.$router.replace("/dash");
    //   } else {
    //     this.getList();
    //   }
    // }
  }
};
</script>

<style lang='scss' scoped>
</style>
