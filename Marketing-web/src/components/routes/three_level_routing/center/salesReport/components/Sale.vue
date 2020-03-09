<template>
  <div class="box">
    <div class="order-count-title">
      <!-- 截至 2018/08/16 00:25:48 Pacific Standard Time ，您当日：{{pId}} -->
      <!-- Pacific Standard Time: {{$.formatTime(Date.now(), '{y}/{m}/{d}')}} -->
      Pacific Standard Time: {{amazonOrderCurrentTime}}
    </div>
    <el-table :data="amazonOrderList" style="width: 100%" class="table-count">
      <el-table-column prop="orderNumbers" label="总订单数">
      </el-table-column>
      <el-table-column prop="productNumbers" label="单品销量">
      </el-table-column>
      <el-table-column prop="averageSales" label="每单平均销量">
      </el-table-column>
      <el-table-column prop="orderTotal" label="销售额" :formatter="currencyFormat">
      </el-table-column>
      <el-table-column prop="unitPrice" label="客单价" :formatter="currencyFormat">
      </el-table-column>
    </el-table>
    <div class="query-select-body">
      <span class="select-title">配送渠道</span>
      <el-select :popper-append-to-body="false"v-model="listQuery.deliveryType" placeholder="请选择" @change="handleFilter(null)">
        <el-option label="全部" value="">
        </el-option>
        <el-option label="FBA" value="AMAZON">
        </el-option>
        <el-option label="自发货" value="MERCHANT">
        </el-option>
      </el-select>

      <span class="select-title" style="margin-left: 10px;">统计方式</span>
      <!-- <el-cascader expand-trigger="hover" :options="statTypeOptions" v-model="selectedStatTypeOptions" @change="changeStatType">
      </el-cascader> -->
      <el-select :popper-append-to-body="false"v-model="selectedStatTypeOptions" placeholder="请选择" @change="changeStatType">
        <el-option label="按父产品统计" value="1">
        </el-option>
        <el-option label="按子产品统计" value="0">
        </el-option>
      </el-select>
    </div>
    <el-table :data="list" v-loading="listLoading" :key='tableKey' style="width: 100%" tooltip-effect="light" :max-height="12000" @sort-change="handleSortChange">
      <el-table-column align='center' width="150px" label="图片">
        <template slot-scope="scope">
          <div v-if="scope.row.imgUrl===undefined||scope.row.imgUrl===null">
            <img src="../imgs/wutu.png" />
          </div>
          <div v-else>
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imgUrl" />
              <div class="__img_wrapper" slot="reference">
                <img class="loadingImg" v-if="scope.row.imgUrl" :key="scope.row.imgUrl" v-lazy="scope.row.imgUrl?scope.row.imgUrl:'-'">
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column :label="statTypeLabel" :render-header="renderAsin" min-width="150">
        <template slot-scope="scope">
          <div v-if="statTypeLabel==='ASIN'" key="ASIN">{{scope.row.asin || scope.row.parentAsin}}</div>
          <div v-else key="SKU">{{ scope.row.sellerSku}}</div>
        </template>
      </el-table-column> -->

      <el-table-column :render-header="renderAsin" min-width="150">
        <template slot-scope="scope">
          <div v-if="selectedStatTypeOptions==1" key="statType-1">
            <div v-if="statTypeLabel==='ASIN'" key="statType-1-ASIN">
              {{scope.row.parentAsin}}
            </div>
            <div v-else-if="statTypeLabel==='SKU'" key="statType-1-SKU">
              {{scope.row.parentSellerSku}}
            </div>
          </div>
          <div v-else key="statType-0">
            <div v-if="statTypeLabel==='ASIN'" key="statType-0-ASIN">
              {{scope.row.asin}}
            </div>
            <div v-else-if="statTypeLabel==='SKU'" key="statType-0-SKU">
              {{scope.row.sellerSku}}
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column
            label="商品名称"
            min-width="200"
            show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.productUrl===null||scope.row.productUrl===undefined">{{scope.row.title}}</div>
                  <a href="#" v-else @click="openWindow(scope.row.productUrl)">{{scope.row.title}}</a>
                </template>
            </el-table-column> -->
      <el-table-column prop="title" label="标题" align='center' min-width="200">
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title | _formatData}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.title">
            <div>
              <a rel="noopener noreferrer nofollow" class="aLink fix__row_2" target="_blank" :href="scope.row.productUrl?scope.row.productUrl:false" style="text-decoration:none;">{{ scope.row.title | _formatData}}
              </a>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="今日" label-class-name="table-column-root" :render-header="renderHeaderDaterange">
        <el-table-column prop="number" label="销量" min-width="100" :sortable="'custom'">
        </el-table-column>
        <el-table-column prop="amount" label="销售额" min-width="100" :sortable="'custom'" :formatter="currencyFormat">
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" min-width="100" :sortable="'custom'" :formatter="currencyFormat">
        </el-table-column>
      </el-table-column>
      <el-table-column label="昨日" label-class-name="table-column-root" :render-header="renderHeaderDaterangeRight">
        <el-table-column prop="numberRight" label="销量" min-width="100" :sortable="'custom'">
        </el-table-column>
        <el-table-column prop="amountRight" label="销售额" min-width="100" :sortable="'custom'" :formatter="currencyFormat">
        </el-table-column>
        <el-table-column prop="unitPriceRight" label="单价" min-width="100" :sortable="'custom'" :formatter="currencyFormat">
        </el-table-column>
      </el-table-column>

      <el-table-column prop="stockSupply" label="可售库存" min-width="100" :sortable="'custom'">
      </el-table-column>
      <el-table-column prop="boundSupply" label="待接收库存" min-width="100" :sortable="'custom'">
      </el-table-column>
      <el-table-column prop="transferSupply" label="转库中库存" min-width="100" :sortable="'custom'">
      </el-table-column>
      <el-table-column prop="address" label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button @click="selectAnalyse('sale_sale',scope.row)" type="text" size="small">历史销量分析</el-button>
          <el-button @click="selectAnalyse('sale_flux',scope.row)" type="text" size="small">产品流量分析</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,50,100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <query-dialog :p-dialog-visible="columnDialogVisible" :p-client-x-y="columnLabelXY" :p-type="pType" @close="columnDialogVisible = false" v-on:query="handleFilter">
    </query-dialog>

  </div>
</template>
<script>
import QueryDialog from "./QueryDialog";
export default {
  components: {
    QueryDialog
  },
  props: ["pSite"],
  data() {
    return {
      options: [
        {
          value: "ASIN",
          label: "ASIN"
        },
        {
          value: "SKU",
          label: "SKU"
        }
      ],
      // selectedStatTypeOptions: ["1", "1"],
      selectedStatTypeOptions: "1",
      // statTypeOptions: [
      //   {
      //     value: "1",
      //     label: "按父产品统计"
      //     // children: [
      //     //   {
      //     //     value: "1",
      //     //     label: "ASIN"
      //     //   }
      //     // ]
      //   },
      //   {
      //     value: "0",
      //     label: "按子产品统计"
      //     // children: [
      //     //   {
      //     //     value: "0",
      //     //     label: "ASIN"
      //     //   },
      //     //   {
      //     //     value: "2",
      //     //     label: "SKU"
      //     //   }
      //     // ]
      //   }
      // ],
      amazonOrderList: null,
      amazonOrderCurrentTime: null,
      tableKey: 0,
      sortProp: null,
      list: null,
      total: null,
      listLoading: false,
      statTypeLabel: "ASIN",
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        sortOrder: "asc",

        sellerId: null,
        deliveryType: "",
        startTime: null,
        // endTime: null,
        startTimeRight: null,
        // endTimeRight: null,
        statType: 1
      },
      columnDialogVisible: false,
      pType: null,
      columnLabelXY: []
    };
  },
  created() {
    this.getAmazonOrderList();

    this.getDefaultTime();
    this.getList();
  },
  watch: {
    "pSite.id"(newP, oldP) {
      this.getAmazonOrderList();
      this.getList();
    }
  },
  methods: {
    currencyFormat(row, column, cellValue, index) {
      return cellValue != null ? "$ " + cellValue : "-";
    },
    handleSortChange({ column, prop, order }) {
      if (!prop) {
        this.sortProp = null;
        this.getList();
        return;
      }
      console.log(column, prop, order);
      const sortOrder = `${prop.replace(/[A-Z]{1}/g, function(str) {
        return "_" + str.toLowerCase();
      })} ${order === "ascending" ? "asc" : "desc"}`;
      this.sortProp = sortOrder;
      this.getList();
    },
    openWindow(url) {
      window.open(url, "", "height=500,width=960,scrollbars=yes,status =yes");
    },
    getDefaultTime() {
      //默认今天
      // this.listQuery.startTime = new Date()
      //   .toLocaleDateString()
      //   .replace(/\//g, "-");
      // this.listQuery.endTime =
      //   new Date().toLocaleDateString().replace(/\//g, "-");

      // 默认昨天
      const endRight = new Date();
      const startRight = new Date();
      endRight.setTime(endRight.getTime() - 3600 * 1000 * 24);
      startRight.setTime(startRight.getTime() - 3600 * 1000 * 24);
      // this.listQuery.startTimeRight = startRight
      //   .toLocaleDateString()
      //   .replace(/\//g, "-");
      // this.listQuery.endTimeRight =
      //   endRight.toLocaleDateString().replace(/\//g, "-");
    },
    getSiteIdAndsellerId(id) {
      let siteArr =
        this.pSite.data &&
        this.pSite.data.filter(element => {
          return element.sellerSalesSiteId === id;
        });
      if (siteArr && siteArr.length === 1) {
        return {
          siteId: siteArr[0].siteId,
          sellerId: siteArr[0].sellerId
        };
      } else {
        return null;
      }
    },
    selectAnalyse(type, row) {
      let statType = this.listQuery.statType;

      // if (statType === 0) {
      //   asinOrSku = row.asin;
      // } else if (statType === 1) {
      //   asinOrSku = row.parentAsin || row.sellerSku;
      // } else if (statType === 2) {
      //   asinOrSku = row.sellerSku;
      // }

      // if (statType == 0) {
      //   sku = row.sellerSku

      // } else if (statType == 1) {
      //   sku = row.parentSellerSku
      // }
      // if(sku===null){
      //   this.$message.error("SKU为空!");
      //   return
      // }
      let parentSku = row.parentSellerSku;
      let sku = row.sellerSku;
      if (parentSku === null && sku === null) {
        this.$message.error("SKU为空!");
        return;
      }

      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      let params = {
        //默认一周
        // startTime: start.toLocaleDateString().replace(/\//g,'-')+' 00:00:00',
        // endTime: end.toLocaleDateString().replace(/\//g,'-')+' 23:59:59',
        startTime: start.toLocaleDateString().replace(/\//g, "-"),
        endTime: end.toLocaleDateString().replace(/\//g, "-"),
        statType,
        parentSku,
        sku
      };
      let data = { type, params };
      this.$emit("changePage", data);
    },
    renderHeaderDaterange(h, { column, $index }) {
      return this.handlerRenderHeader(h, { column, $index }, "daterange");
    },
    renderHeaderDaterangeRight(h, { column, $index }) {
      return this.handlerRenderHeader(h, { column, $index }, "daterangeRight");
    },
    renderAsin(h, { column, $index }) {
      return (
        <el-select
          value={this.statTypeLabel}
          class="customSelect"
          props={{ size: "mini" }}
          style={{ width: "120px" }}
          onChange={e => {
            this.statTypeLabel = e;
            this.changeStatTypeForList();
          }}
        >
          {this.options.map(item => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      );
    },
    changeStatTypeForList() {
      if (this.selectedStatTypeOptions === "0") {
        let statTypeLabel = this.statTypeLabel;
        if (statTypeLabel === "ASIN") {
          this.listQuery.statType = 0;
          this.getList();
        } else if (statTypeLabel === "SKU") {
          this.listQuery.statType = 2;
          this.getList();
        }
      }
    },
    handlerRenderHeader(h, { column, $index }, t) {
      let func = null;
      if (t === "daterange") {
        return (
          <span>
            <el-button
              type="text"
              style="padding-right: 0!important;"
              onClick={this.clickHandlerDaterange}
            >
              {column.label}
            </el-button>
          </span>
        );
      } else if (t === "daterangeRight") {
        return (
          <span>
            <el-button
              type="text"
              style="padding-right: 0!important;"
              onClick={this.clickHandlerDaterangeRight}
            >
              {column.label}
            </el-button>
          </span>
        );
      } else {
        return <span>{column.label}</span>;
      }
    },

    clickHandlerDaterange(e) {
      e.stopPropagation();
      if (!this.columnDialogVisible) {
        this.columnLabelXY = [e.clientX - 150, e.clientY + 10];
        this.pType = "daterange";
        this.columnDialogVisible = true;
      }
    },
    clickHandlerDaterangeRight(e) {
      e.stopPropagation();

      if (!this.columnDialogVisible) {
        this.columnLabelXY = [e.clientX - 150, e.clientY + 10];
        this.pType = "daterangeRight";
        this.columnDialogVisible = true;
      }
    },
    getList(sortOrder) {
      if (this.listQuery.startTime === null) {
        this.getDefaultTime();
      }
      let obj = this.getSiteIdAndsellerId(this.pSite.id);
      if (obj === null) {
        this.toAuthPage();
        // this.$message.error("店铺还未授权!");
        return;
      }
      // this.listQuery.sellerId ='A2RR0WNDOGGG2Y' // 'A2RR0WNDOGGG2Y'  obj.sellerId
      this.listQuery.sellerId = obj.sellerId;
      this.listLoading = true;
      let params = JSON.parse(JSON.stringify(this.listQuery));
      params.statType = Number(this.listQuery.statType);

      if (this.sortProp) {
        params.sortOrder = this.sortProp;
      } else {
        delete params.sortOrder;
      }

      if (this.listQuery.deliveryType === "") {
        params.deliveryType = null;
      }

      params = this.$.dealObjectValue(params);

      this.$axios.post("/productSaleReport/list", params).then(res => {
        let { code, rows, total, msg } = res.data;
        if (code === undefined) {
          this.list = rows;
          this.total = total;
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000);
        } else if (code === 500) {
          this.$message.error(msg);
        }
      });
    },
    handleFilter(params) {
      this.columnDialogVisible = false;
      if (params !== null) {
        let { key, value } = params;
        if (key === "daterange") {
          if (value !== null && value.length !== 0) {
            this.listQuery.startTime = value;
            // this.listQuery.endTime = value[1];
          } else {
            this.$message.warning("请输入时间");
            return;
          }
        } else if (key === "daterangeRight") {
          if (value !== null && value.length !== 0) {
            this.listQuery.startTimeRight = value;
            // this.listQuery.endTimeRight = value[1];
          } else {
            this.$message.warning("请输入时间");
            return;
          }
        }
      }
      this.listQuery.pageNumber = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getList();
    },

    toAuthPage() {
      // this.$message.error("店铺还未授权!");
      // this.$parent.showAuthPage = true;
    },

    getAmazonOrderList() {
      let obj = this.getSiteIdAndsellerId(this.pSite.id);
      if (obj === null) {
        this.toAuthPage();
        return;
      }

      let params = { sellerId: obj.sellerId };
      this.$axios.post("/amazonOrder/list", params).then(res => {
        let { code, data, msg } = res.data;
        if (code === 0) {
          this.amazonOrderList = [data];
          this.amazonOrderCurrentTime = data.currentTime;
          if (data.currentTime === null) {
            this.amazonOrderCurrentTime = this.$.formatTime(
              Date.now(),
              "{y}-{m}-{d}"
            );
          }
        } else if (code === 500) {
          this.$message.error(msg);
        }
      });
    },
    changeStatType(val) {
      this.listQuery.statType = val;
      // this.listQuery.statType = +val;
      // let tmp = val[0] + val[1];
      // if (tmp === "11") {
      //   this.listQuery.statType = 1;
      //   this.statTypeLabel = "ASIN";
      // } else if (tmp === "20") {
      //   this.listQuery.statType = 0;
      //   this.statTypeLabel = "ASIN";
      // } else if (tmp === "22") {
      //   this.listQuery.statType = 2;
      //   this.statTypeLabel = "SKU";
      // }
      this.handleFilter(null);

      // 1 按父产品统计 只显示 asin
      // 2 按子产品统计 显示 asin或sku
      // listQuery.statType
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  margin-top: 20px;
  .order-count-title {
    margin-bottom: 8px;
  }
  .table-count {
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
  }
  .query-select-body {
    background-color: #efefef;
    margin-top: 25px;
    margin-bottom: 5px;
    padding: 5px;
    .select-title {
      margin-right: 5px;
    }
  }
  .el-cascader {
    /deep/.el-cascader__label {
      font-size: 12px;
    }
  }

  .el-table {
    /deep/.table-column-root {
      text-align: center;
    }
    /deep/.el-table__row td {
      border-right-width: 0;
    }
  }
  .pagination-container {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.el-cascader-menu__item {
  font-size: 12px;
}
.customSelect {
  .el-input__suffix {
    right: 14px;
  }
}
</style>


