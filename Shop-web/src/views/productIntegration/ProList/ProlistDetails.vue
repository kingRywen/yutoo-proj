<!--  -->
<template>
  <div>
    <template>
      <el-search :search="search" :clearSearch.sync="clearSearch"  :clearfield='clearfield'></el-search>
    </template>
    <a v-show="false" ref="exportExcel"></a>
    <div class="margin_bottom8 margin_top8">
      <el-button type="primary" :loading="buttonLoading.funExportButtonLoading" @click="funExport" size="mini" plain v-if="!userSelect.length">导出</el-button>
      <el-button v-else type="primary" :loading="buttonLoading.funExportButtonLoading" @click="funExport" size="mini" plain>导出</el-button>
    </div>
    <template>
      <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
    </template>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from "Config";
export default {
  components: {},
  provide() {
    return {
      getList: this.getList,
      showDialog: this.showDialog
    };
  },
  data() {
    return {
	  clearfield:['orderId','date'],
      Disabled: true,
      buttonLoading: {
        funExportButtonLoading: false
      },
      // 搜索
      search: {
        loading: false,
        default: [this.$route.query.startTime, this.$route.query.endTime]
        // time3: true
        // asin2: true,
        // date: true,
        // timeText: "统计时间",
        // pstatus: true,
        // plist: true
      },
      clearSearch: null,
      // 表格
      table: {
        loading: false,
        // rowKey: "taskId",
        rows: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          //   warnTime: true,
          //   ShipmentId: true,
          //   quantityDifference: true
          //   amountReceivable: true,
          //   amountActual: true,
          //   amountDifference: true
          //   amountReimbursement: true,
          //   amountFulfillment: true,
          //   amountCommission: true,
          //   amountStorage: true,
          //   amountRefund: true,
          //   amountRefundLoss: true,
          //   amountRemove: true,
          //   amountDisposal: true,
          //   amountAdvert: true,
          //   pro: true
          //   Handle: {
          // edit: true,
          // refresh: true,
          // check: true
          //   }
        }
      },
      userSelect: [],
      downloadUrl: ""
    };
  },

  created() {},
  mounted() {
    this.date = [this.$route.query.startTime, this.$route.query.endTime];
    if (this.$route.query.pt == 1) {
      this.table.show = {
        orderId1: true,
        amountReceivable1: true,
        amountActual1: true,
        amountDifference1: true
      };
      this.search = {
        loading: false,
        orderId2: true,
        default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/fulfillmentErrorExport";
    } else if (this.$route.query.pt == 2) {
      this.table.show = {
        orderId2: true,
        amountReceivable2: true,
        amountActual2: true,
        quantity2: true,
        amountDifference2: true
      };
      this.search = {
        loading: false,
        orderId2: true,
        default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/commissionErrorExport";
    } else if (this.$route.query.pt == 3) {
      this.table.show = {
        statTime3: true,
        invAge0To90Days3: true,
        amount0To90Days3: true,
        invAge91To180Days3: true,
        amount91To180Days3: true,
        invAge181To270Days3: true,
        amount181To270Days3: true,
        invAge271To365Days3: true,
        amount271To365Days3: true,
        invAge365PlusDays3: true,
        amount365PlusDays3: true,
        amountReceivable3: true,
        amountActual3: true,
        amountDifference3: true
      };
      this.search = {
        loading: false,
        orderId2: false,
		date:true,
		timeText:'预警时间',
        // default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/storageErrorExport";
    } else if (this.$route.query.pt == 4) {
      this.table.show = {
        orderId4: true,
        quantityReceivable4: true,
        quantityActual4: true,
        quantityRefund4: true,
        quantityReturn4: true
      };
      this.search = {
        loading: false,
		orderId2: true,
        // time11: true,
        // default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/refundErrorExport";
    } else if (this.$route.query.pt == 5) {
      this.table.show = {
        createTime5: true,
        shipmentId5: true,
        quantityReceivable5: true,
        quantityActual5: true,
        quantityShipped5: true,
        quantityReceived5: true,
        quantityDifference5: true
      };
      this.search = {
        loading: false,
        time11: true,
        default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/amazonLossErrorExport";
    } else if (this.$route.query.pt == 6) {
      this.table.show = {
        warnTime6: true,
        quantityReceivable6: true,
        quantityActual6: true,
        quantityReceivableReturn6: true,
        quantityActualReturn6: true,
        quantityDifference6: true
      };
      this.search = {
        loading: false,
        time11: true,
        default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/amazonErrorExport";
    } else if (this.$route.query.pt == 7) {
      this.table.show = {
        // 店铺收款
        amountReceived7: true,
        // 销售额
        amountSales7: true,
        // 赔偿
        amountReimbursement7: true,
        // 正常FBA配送费
        amountFulfillment7: true,
        // 正常订单佣金
        amountCommission7: true,
        // 仓储费
        amountStorage7: true,
        // 退款金额
        amountRefund7: true,
        // 退款损失
        amountRefundLoss7: true,
        // 移除费用
        amountDisposal7: true,
        // 销毁费
        amountRemove7: true,
        // 广告费
        amountAdvert7: true,
        // 成本
        amountCost7: true,
        // 利润
        amountProfit7: true
      };
      this.search = {
        loading: false,
        time11: true,
        default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/profitErrorExport";
    } else if (this.$route.query.pt == 8) {
      this.table.show = {
        // 订单号
        orderId8: true,

        // 订单金额
        amountTotal8: true,

        // 退货数量
        quantity8: true,

        // 退款金额
        refundAmount8: true,

        // 正常FBA配送费
        fulfillmentFee8: true,

        // 正常订单佣金
        commission8: true,

        // 退款损失
        refundLoss8: true
      };
      this.search = {
        loading: false,
		orderId2: true,
        time11: true,
        default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/refundLossErrorExport";
    } else if (this.$route.query.pt == 9) {
      this.table.show = {
        // 销售额
        amountSales9: true,

        // 退款金额
        amountRefund9: true,

        // 广告费用
        amountAdvert9: true,

        // 广告占未退款比率
        advertProportion9: true
      };
      this.search = {
        loading: false,
        time11: true,
        default: [this.$route.query.startTime, this.$route.query.endTime]
      };
      this.downloadUrl = "finance/advertProportionErrorExport";
    }
    this.$nextTick(() => {
      if (this.sellerId && this.siteId) {
        let problemTypes = this.$route.query.problemType;
        if (problemTypes != "all") {
          problemTypes = [this.$route.query.problemType];
        } else {
          problemTypes = [1, 2, 3, 4, 7, 8, 9];
        }
        this.getList({
          problemTypes: problemTypes,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime
        });
      }
    });
  },
  methods: {
    //导出
    funExport() {
      this.onExport();
    },
    //导出 todo
    onExport() {
      let arr = this.userSelect;
      let params;
      params = {
        siteId: this.siteId, //上线要改
        sellerId: this.sellerId, //上线要改
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        sku: this.$route.query.sku
      };
      let ids;
      if (arr.length) {
        if (this.$route.query.pt == 1) {
          ids = arr.map(item => item.orderId);
          params.ids = ids;
        } else if (this.$route.query.pt == 2) {
          ids = arr.map(item => item.orderId);
          params.ids = ids;
        } else if (this.$route.query.pt == 3) {
          params.startQueryTime = this.date[0];
          params.endQueryTime = this.date[1];
        } else if (this.$route.query.pt == 4) {
          ids = arr.map(item => item.orderId);
          params.ids = ids;
        } else if (this.$route.query.pt == 5) {
          ids = arr.map(item => item.shipmentId);
          params.ids = ids;
        } else if (this.$route.query.pt == 6) {
          ids = arr.map(item => item.id);
          params.ids = ids;
        }
      } else {
        if (this.$route.query.pt == 3) {
          params.startQueryTime = this.date[0];
          params.endQueryTime = this.date[1];
        }
      }
      params = this.$.dealObjectValue(params);
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.$ajax({
        method: "post",
        url: BASE_URL + this.downloadUrl,
        data: params,
        responseType: "blob"
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "列表.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // 列表
    getList(arg) {
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        siteId: this.siteId, //上线要改
        sellerId: this.sellerId, //上线要改
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        sku: this.$route.query.sku,
        ...arg
      };
      // 如果与日期，要分开赋值
      if (params.date) {
        params.startTime = params.date[0];
        params.endTime = params.date[1];
        this.date = params.date;
      }

      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api[this.$route.query.URL](params)
        .then(data => {
          this.table.loading = false;
          this.table.rows = data.rows;
          this.table.pageNumber = data.pageNo;
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          // 修正数据 7  9 两个没有分页。要处理成分页数据结构
          let url = this.$route.query.URL;
          if (
            url === "financeProfitError" ||
            url === "financeAdvertProportionError"
          ) {
            this.table.rows = [data.data];
            this.table.pageNumber = 1;
            this.table.pageSize = 1;
            this.table.total = 1;
          }

          if (this.table.rows) {
            // console.log(data.rows == "");
            this.table.rows.forEach(el => {
              el.problemType = this.$route.query.pt;
            });
          }
          return true;
        })
        .catch(err => {
          console.log(err);
          this.table.loading = false;
          return true;
        });
    },
    backFun() {
      //   console.log(this.$route);
      this.$router.push(this.$route.query.fullPath);
    }
  },
  computed: {},
  watch: {
    sellerData() {
      // this.$router.replace("/dash");
    },
    userSelect(n) {
      if (n.length > 0) {
        this.Disabled = false;
      } else {
        this.Disabled = true;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
