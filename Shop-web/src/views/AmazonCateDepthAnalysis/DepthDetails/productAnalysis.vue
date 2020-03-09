<!-- 查看 -->
<template>
  <div class="___common">
    <!-- 1 -->
    <a v-show="false" ref="exportExcel"></a>
    <template>
      <el-search :search="search" :clearSearch.sync="clearSearch"  :clearfield='clearfield' ></el-search>
    </template>
    <template>
      <section class="__relative">
        <template>
          <el-handler :userSelect="userSelect" :loading="btnLoading" :hander="hander"></el-handler>
        </template>
      </section>
    </template>
    <template>
      <el-table-pagination ref="table" :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect" :stripe='false'></el-table-pagination>
    </template>
    <template>
      <el-dialog :close-on-click-modal="false" :title="showCate.title" :visible.sync="showCate.visible" v-if='showCate.visible' height='505px' width="1200px">
        <el-table-pagination :table="showCate.table" :pageNumber.sync="showCate.table.pageNumber" :pageSize.sync="showCate.table.pageSize" :total="showCate.table.total" v-loading="showCate.table.loading" :userSelect.sync="showCate.userSelect" :stripe='false' :selection="false" :getShowCateList="getShowCateList" style="padding-bottom:15px;"></el-table-pagination>
      </el-dialog>
    </template>
    <!-- 图表 -->
    <el-dialog :fullscreen="isFull" :append-to-body="true" :close-on-click-modal="false" :title="chartData.title" :visible.sync="chartData.visible" width="950px" @close="closeDialog" @closed="closedDialog">
      <div slot="title" style="font-size:18px;">
        <span v-if="chartData.title">{{chartData.title}}</span>
    	<i class="iconfont1 iconfangda bigIcon" @click="isFullMethod" ></i>
      </div>
      <detail-chart :chartData.sync="chartData" ref="child"></detail-chart>
    </el-dialog>
  </div>
</template>
<script>
import { CONST_PORT_CONFIG } from "Config";
import detailChart from "./echarts/index2";
const { BASE_URL } = CONST_PORT_CONFIG;
export default {
  components: { detailChart },
  provide() {
    return {
      getList: this.getList,
      check__: this.check__,
      draw__: this.draw__,
      addTask: this.addTask,
      showBuyBoxSellerCnt__: this.showBuyBoxSellerCnt__,
      clearSort: this.clearSortable,
      // 2
      download: this.downloadFun
    };
  },
  data() {
    return {
      btnLoading: false,
		isFull:false,
		clearfield:['parentAsin','fbpFlag'],
      // 搜索
      search: {
        taskName: false,
        parentAsin: true,
        fbpFlagAmazon: true
      },
      // 控件
      hander: {
        analysysAmazon: true,
        addTask3__: true,
        addButton: "加入深度分析",
        // 3
        download: true,
        downloadText: "导出数据"
        // deleteAuthCate: true
      },
      clearSearch: null,
      chartData: {
        visible: false,
        chartShow: true,
        title: "新增review数",
        category: "",
        siteId: ""
      },
      // 表格
      table: {
        loading: false,
        rows: [],
        // rowKey: "parentAsin",
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          parentAsinAmazon: true,
          asinProp: "parentAsin",
          imageUrl: true,
          skuCnt: true,
          starCnt: true,
          reviewCnt: true,
          releaseDate: true,
          brand: true,
          fbpFlagAmazon: true,
          sellerCnt: true,
          Stars: {
            s1: true,
            s2: true,
            s3: true,
            s4: true,
            s5: true
          },
          buyBoxSellerCnt: true,
          // salesRank: true,
          price: true,
          aqCnt: true,
          BSR: true,
          Handle: {
            reviewItem: true
          }
        }
      },
      userSelect: [],
      showCate: {
        visible: false,
        title: "卖家详情",
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
            sellerNameAmazon: true,
            sellerSkuCnt: true,
            sellYourselfFlag: true,
            newFeedbackCntD30Amazon: true,
            productCntAmazon: true
          }
        }
      },
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
	  closedDialog(){
	  	this.isFull = false
		this.$refs.child.changeClass(false)
	  },
	  isFullMethod(){
	  		this.$set(this,'isFull',!this.isFull)
			this.$refs.child.changeClass(this.isFull)
	  },
    // 4导出todo
    downloadFun() {
      let params = {
        taskId: this.$route.query.taskId,
        siteId: +this.$route.query.siteId__
      };
      let parentAsins = [];
      if (this.userSelect.length > 0) {
        this.userSelect.forEach(el => {
          parentAsins.push(el.parentAsin);
        });
        params.parentAsins = parentAsins;
      }
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.btnLoading = true
      this.$ajax({
        method: "post",
        url: BASE_URL + "taskCategoryDepthAnalysis/exportProductDetails",
        data: params,
        responseType: "blob"
      })
        .then(data => {
          this.btnLoading = false
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "Amazon深度分析产品分析.xlsx");
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
        taskId: +this.$route.query.taskId,
        siteId: +this.siteId,
        ...arg
      };
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["TaskCateDepthAnalysisSouqProductDetailsAmazon"](params)
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
    check__(arg) {
      // console.log(arg);
      this.$router.push("/Amazon/souqCateDepthAnalysis");
    },
    // 画图 五
    draw__(row) {
      this.chartData.visible = true;
      this.chartData.parentAsin = row.parentAsin;
      if (typeof row.parentAsin === "string") {
        this.chartData.parentAsin = [this.chartData.parentAsin];
      }
      this.chartData.siteId =
        +this.$store.state.common.siteId__ || +this.$route.query.siteId__;
      this.$nextTick(() => {
        this.$refs.child.showChartChild(this.chartData.parentAsin);
      });
    },
    // 关闭弹窗时调用子组件方法清空日期 六
    closeDialog() {
      this.$refs.child.clearDate();
    },
    showBuyBoxSellerCnt__(row) {
      //   console.log(arg);
      this.showCate.parentAsin = row.parentAsin;
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
        parentAsin: this.showCate.parentAsin,
        siteId: +this.siteId,
        taskId: +this.$route.query.taskId,
        ...arg
      };
      params = this.$.dealObjectValue(params);
      this.showCate.table.loading = true;
      this.$api["TaskCategoryDepthAnalysisListToBuyBoxSellerByProductAmazon"](
        params
      )
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
    backFun() {
      let fromCate = this.$route.query.fromCate;
      if (fromCate) {
        // 如果是从类目跳转过来的话
        this.$router.push(fromCate);
        return;
      }
      this.$router.push("/Amazon/AmazonCateDepthAnalysis");
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

<style scoped="scoped">
	.bigIcon{
		  float: right;
		  margin-right: 20px;
		  cursor: pointer;
		  font-size: 14px;
		  color:#909399;
		  margin-top: 0.8px;
	}
	.bigIcon:hover{
		  color: #377EA8
	}
</style>
