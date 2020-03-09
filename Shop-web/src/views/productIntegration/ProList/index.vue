<!--  -->
<template>
  <div>
    <!-- <template>
      <div class="title_h1 margin_bottom8">
        <span class="title_icon"></span>
        <span class="color_666">任务名称 :</span>
        <span class="titleBox">{{this.$route.query.problemType | filterProblemName}}</span>
      </div>
    </template> -->
    <template>
      <el-search :search="search" :clearSearch.sync="clearSearch" :clearfield='clearfield'  style="margin-bottom: 20px;"></el-search>
    </template>
    <template>
      <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
    </template>
    <template>
      <el-dialog :close-on-click-modal="false" title="问题类型" :visible.sync="visible" height='505px' width="820px">
        <el-table ref="multipleTable" :data="table2.rows" style="width: 100%;position:relative;top:-20px;" :stripe="true" v-loading="table2.loading">
          <el-table-column prop="problemName" label="问题项">
            <template slot-scope="scope">
              {{scope.row.problemName | _formatData}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="quantityReceivable" label="应收/应赔">
            <template slot-scope="scope">
              {{scope.row.quantityReceivable | _formatData111(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityActual" label="实收/实赔">
            <template slot-scope="scope">
              {{scope.row.quantityActual | _formatData111(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityDifference" label="差额">
            <template slot-scope="scope">
              {{scope.row.quantityDifference | _formatData111(scope.row)}}
            </template>
          </el-table-column> -->
          <el-table-column prop="handle" label="操作">
            <template slot-scope="scope">
              <span class="__pointer common_color" @click="toDetails(scope.row)">
                {{scope.row.handle}}
              </span>
            </template>
          </el-table-column>
        </el-table>

      </el-dialog>
    </template>
  </div>
</template>

<script>
export default {
  components: {},
  provide() {
    return {
      getList: this.getList,
      showDialog: this.showDialog
    };
  },
  filters: {
    // filterProblemName(val) {
    //   if (val == 1) {
    //     return "FBA配送费不对(商品费用情况)";
    //   } else if (val == 2) {
    //     return "佣金不对(商品费用情况)";
    //   } else if (val == 3) {
    //     return "仓储费不对(商品费用情况)";
    //   } else if (val == 4) {
    //     return "客户退款为退货，亚马逊未赔偿(商品费用情况)";
    //   } else if (val == 5) {
    //     return "入库丢件亚马逊未赔偿(商品费用情况)";
    //   } else if (val == 6) {
    //     return "亚马逊损坏未赔偿";
    //   } else if (val == "all") {
    //     return "查看所有商品费用情况";
    //   }
    // }
  },
  data() {
    return {
      // 搜索
      search: {
        loading: false,
        asin2: true,
        date: true,
        onepstatus: true,
        plist: true,
        default: [this.$route.query.startTime, this.$route.query.endTime]
      },
      clearfield:['asin','startTime','endTime','status','problemTypes'],
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
          asin3: true,
          saleStatus: true,
          imageUrl: true,
          amountReceived: true,
          amountSales: true,
          amountReimbursement: true,
          amountFulfillment: true,
          amountCommission: true,
          amountStorage: true,
          amountRefund: true,
          amountRefundLoss: true,
          amountRemove: true,
          amountDisposal: true,
          amountAdvert: true,
          pro: true
          //   Handle: {
          // edit: true,
          // refresh: true,
          // check: true
          //   }
        }
      },
      // 表格
      table2: {
        loading: false,
        // rowKey: "taskId",
        rows: []
      },
      userSelect: [],
      visible: false
    };
  },

  created() {},
  mounted() {
    this.$nextTick(() => {
      if (this.sellerId && this.siteId) {
        let problemTypes = this.$route.query.problemType;
        let flag;
        if (problemTypes != "all") {
          // problemTypes = [this.$route.query.problemType];
          flag = this.$route.query.problemType;
        } else {
          // problemTypes = null;
          flag = 0;
        }
        this.date = [this.$route.query.startTime, this.$route.query.endTime];
        this.getList({
          // problemTypes: problemTypes,
          flag: flag,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime
        });
      }
    });
  },
  methods: {
    // 列表
    getList(arg) {
      let problemTypes = this.$route.query.problemType;
      let flag;
      if (problemTypes != "all") {
        // problemTypes = [this.$route.query.problemType];
        flag = this.$route.query.problemType;
      } else {
        // problemTypes = null;
        flag = 0;
      }
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        siteId: this.siteId, //上线要改
        sellerId: this.sellerId, //上线要改
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        skus: this.$store.state.common.selectChildSkus,
        flag: flag,
        // problemTypes: problemTypes,
        ...arg
      };
      // 如果与日期，要分开赋值
      if (params.date) {
        params.startTime = params.date[0];
        params.endTime = params.date[1];
        this.date = [params.date[0], params.date[1]];
      }
      params = this.$.dealObjectValue(params);
      if (!params.siteId) {
        return;
      }
      this.table.loading = true;
      let URL;
      if (this.$route.query.type) {
        URL = "inventoryDetailList";
      } else {
        URL = "productInfoChargeDetailList";
      }
      return this.$api[URL](params)
        .then(data => {
          this.table.loading = false;
          this.table.rows = data.rows;
          // console.log(data.rows == "");
          this.table.pageNumber = data.pageNo;
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          return true;
        })
        .catch(err => {
          console.log(err);
          this.table.loading = false;
          return true;
        });
    },
    backFun() {
      this.$router.push("/productIntegration");
    },
    showDialog(row) {
      this.visible = true;
      this.table2.rows = row.problemList;
      this.table2.rows.forEach(el => {
        el.handle = "查看详情";
      });
      // console.log(row, "row");
    },
    toDetails(row) {
	  console.log(row)
      let type = row.problemType;
      let URL;
      let pt = row.problemType;
      if (type == 1) {
        URL = "fulfillmentErrorList";
      } else if (type == 2) {
        URL = "commissionErrorList";
      } else if (type == 3) {
        URL = "storageErrorList";
      } else if (type == 4) {
        URL = "refundErrorList";
      } else if (type == 7) {
        URL = "financeProfitError";
      } else if (type == 8) {
        URL = "financeRefundLossErrorList";
      } else if (type == 9) {
        URL = "financeAdvertProportionError";
      }
      this.$router.push({
        name: "ProlistDetails",
        query: {
          fullPath: this.$route.fullPath,
          URL: URL,
          pt: pt,
          startTime: this.date[0],
          endTime: this.date[1],
          sku: row.sku,
		  name:row.problemName
        }
      });
      // console.log(row, "row");
    }
  },
  computed: {},
  watch: {
    sellerData() {
      // this.$router.replace("/dash");
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
