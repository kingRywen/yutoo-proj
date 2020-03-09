<template>
  <div class="box">
    <div class="query-select-body">
      <div>
        <span class="select-title">日期</span>
        <el-date-picker v-model="queryDaterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd" @change="handleFilter">
        </el-date-picker>

        <span class="select-title" style="margin-left: 10px;">统计方式</span>
        <el-select :popper-append-to-body="false"v-model="listQuery.statType" placeholder="请选择" @change="handleFilter" :disabled="statTypeDisabled">
          <el-option label="按父asin产品统计" value="1">
          </el-option>
          <el-option label="按子asin产品统计" value="0">
          </el-option>
        </el-select>
      </div>
      <div style="display:flex;">
        <el-button-group>
          <el-button type="success" @click="showDialog('dialogExport')" :disabled="statTypeDisabled">数据下载</el-button>
          <el-button type="success" @click="showDialog('dialogImport')">数据导入</el-button>
        </el-button-group>
        <a ref="downloadFile" v-show="false"></a>
      </div>
    </div>

    <div class="order-count-title">
      <!-- 截至 2018/08/16 00:25:48 Pacific Standard Time ，您当日： -->
    </div>
    <el-table :data="list" v-loading="listLoading" :key='tableKey' style="width: 100%" tooltip-effect="light" :max-height="12000" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" :selectable="checkSelecTable" width="55">
      </el-table-column>
      <el-table-column align='center' width="150px" label="图片">
        <template slot-scope="scope">
          <div v-if="scope.row.productFlowReportId===null">总计/平均</div>
          <div v-else>
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
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="parentAsin" label="父ASIN" min-width="120" v-if="listQuery.statType===1||listQuery.statType==='1'">
      </el-table-column>
      <el-table-column prop="asin" label="子ASIN" min-width="120" v-else-if="listQuery.statType===0||listQuery.statType==='0'">
      </el-table-column> -->

      <el-table-column :render-header="renderAsin" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.productFlowReportId!==null" key="idIsNull">
            <div v-if="listQuery.statType==1" key="statType-1">
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
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column
            label="产品名称"
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

      <el-table-column prop="sessions" label="访客数" min-width="80" sortable>
      </el-table-column>
      <el-table-column prop="pageViews" label="浏览数" min-width="80" sortable>
      </el-table-column>
      <el-table-column prop="buyBox" label="购买按钮浏览次数" min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="unitsOrdered" label="已订购产品数量" min-width="110" sortable>
      </el-table-column>
      <el-table-column prop="orderedProductSales" min-width="120" label="订购产品销售额" sortable show-overflow-tooltip :formatter="currencyFormat">
      </el-table-column>
      <el-table-column prop="orderConversionRate" label="订单转化率" min-width="100" sortable :formatter="formatterOrderConversionRate">
      </el-table-column>
      <el-table-column prop="viewConversionRate" label="浏览转化率" min-width="100" sortable :formatter="formatterViewConversionRate">
      </el-table-column>
      <el-table-column prop="buyBoxPercentage" label="购物车获得率" min-width="100" sortable :formatter="formatterBuyBoxPercentage">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.productFlowReportId!==null">
            <el-button @click="selectAnalyse('flux_trend',scope.row)" type="text" size="small">更多趋势</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--
            分页不要加 background，否则显示不正常
        -->
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,50,100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogImportOrExportVisible" width="400px" class="dialog-import-export">
      <el-table :data="tableImportData" style="width: 100%" @selection-change="handleExportSelectionChange" ref="multipleExportTable" :header-row-style="{fontSize:'12px',color:'#666'}" :header-cell-style="{paddingTop:'8px',paddingBottom:'8px'}" :row-style="{fontSize:'12px'}" :cell-style="{paddingTop:'8px',paddingBottom:'8px'}" v-if="dialogImportOrExportType ==='dialogExport'">
        <!--
          :selectable="checkSelecTableData"
        -->
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="label" label="字段名称">
        </el-table-column>
      </el-table>
      <div v-else-if="dialogImportOrExportType ==='dialogImport'">
        <el-select :popper-append-to-body="false"v-model="sellerSalesSiteId" placeholder="请选择" class="select-import">
          <el-option v-for="item in siteOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-upload ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleFileChange" :file-list="fileList" :on-remove="handleFileRemove" :auto-upload="false">
          <el-button slot="trigger" size="small" type="success">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只支持xlsx,xls,zip,csv格式，文件不超过2M</div>
        </el-upload>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleData">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
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
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      queryDaterange: [],
      statTypeDisabled: false,
      statTypeLabel: "ASIN",
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        sortOrder: "asc",

        siteId: null,
        sellerId: null,
        startTime: null,
        endTime: null,
        statType: "1"
      },
      tableImportData: [
        {
          name: "imgUrl",
          label: "图片"
        },
        {
          name: "parentAsin",
          label: "父ASIN"
        },
        {
          name: "asin",
          label: "子ASIN"
        },
        {
          name: "parentSellerSku",
          label: "父SKU"
        },
        {
          name: "sellerSku",
          label: "子SKU"
        },
        {
          name: "title",
          label: "标题"
        },
        {
          name: "sessions",
          label: "访客数"
        },
        {
          name: "pageViews",
          label: "浏览数"
        },
        {
          name: "buyBox",
          label: "购买按钮浏览次数"
        },
        {
          name: "unitsOrdered",
          label: "已订购产品数量"
        },
        {
          name: "orderedProductSales",
          label: "订购产品销售额"
        },
        {
          name: "orderConversionRate",
          label: "订单转化率"
        },
        {
          name: "viewConversionRate",
          label: "浏览转化率"
        },
        {
          name: "buyBoxPercentage",
          label: "购物车获得率"
        }
      ],
      dialogImportOrExportVisible: false,
      dialogImportOrExportType: "dialogImport",
      dialogTitle: "选择",
      sortProp: {
        field: null,
        sort: null
      },
      multipleSelection: [],
      multipleExportSelection: [],
      // sellerSalesSiteId: null,
      fileList: [],
      siteOptions: []
    };
  },
  computed: {
    sellerSalesSiteId() {
      return this.$parent.sellerSalesSiteId;
    }
  },
  created() {
    //默认一周
    let endDay = new Date();
    let startDay = new Date();
    startDay.setTime(startDay.getTime() - 3600 * 1000 * 24 * 7);
    // this.queryDaterange = [
    //   startDay.toLocaleDateString().replace(/\//g, "-"),
    //   endDay.toLocaleDateString().replace(/\//g, "-")
    // ];

    if (this.$parent.salesSite.data.length) {
      this.setQueryTimeFromSiteIndex(0);
    }

    this.getList();
  },
  watch: {
    queryDaterange(newP, oldP) {
      if (newP === null) {
        this.statTypeDisabled = true;
      } else {
        this.statTypeDisabled = false;
      }
    },
    // "pSite.id"(newP, oldP) {
    //   this.getList();
    // },
    sellerSalesSiteId(val) {
      console.log(val);
      const index =
        this.$parent.salesSite.data &&
        this.$parent.salesSite.data.findIndex(
          el => el.sellerSalesSiteId === val
        );
      if (index != null) {
        this.setQueryTimeFromSiteIndex(index);
        this.getList();
      }
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
      this.sortProp.field = prop.replace(/[A-Z]{1}/g, function(str) {
        return "_" + str.toLowerCase();
      });
      this.sortProp.sort = order === "ascending" ? 1 : 0; // ? "asc" : "desc"
      this.getList();
      // asc 1
      // desc 0
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
          }}
        >
          {this.options.map(item => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      );
    },
    setQueryTimeFromSiteIndex(index) {
      const aftTime = this.$parent.salesSite.data[index].lastStatTime;
      if (!aftTime) {
        this.queryDaterange = [
          this.$.formatTime(
            new Date().getTime() - 24 * 3600 * 1000 * 6,
            "{y}-{m}-{d}"
          ),
          this.$.formatTime(new Date(), "{y}-{m}-{d}")
        ];
        return;
      }
      const bfTime = this.$.formatTime(
        new Date(aftTime).getTime() - 24 * 3600 * 1000 * 6,
        "{y}-{m}-{d}"
      );

      this.queryDaterange = [bfTime, aftTime];
    },
    openWindow(url) {
      window.open(url, "", "height=500,width=960,scrollbars=yes,status =yes");
    },
    formatterOrderConversionRate(row, column) {
      return this.toPercent(row.orderConversionRate);
    },
    formatterViewConversionRate(row, column) {
      return this.toPercent(row.viewConversionRate);
    },
    formatterBuyBoxPercentage(row, column) {
      return this.toPercent(row.buyBoxPercentage);
    },
    toPercent(point) {
      if (isNaN(point) || point == 0) {
        return "0%";
      }
      let str = Number(point * 100).toFixed();
      str += "%";
      return str;
    },
    getSiteIdAndsellerId(id) {
      let siteArr =
        this.pSite.data &&
        this.pSite.data.filter(element => {
          return element.sellerSalesSiteId === id;
        });
      if (siteArr.length === 1) {
        return {
          siteId: siteArr[0].siteId,
          sellerId: siteArr[0].sellerId
        };
      } else {
        return null;
      }
    },
    showDialog(t) {
      if (t === "dialogImport") {
        this.sellerSalesSiteId = null;
        let options = [];
        this.pSite.data &&
          this.pSite.data.forEach(element => {
            let label = element.sellerAlias;
            if (element.siteName !== null) {
              label = element.siteName + "-" + element.sellerAlias;
            }
            let item = {
              label,
              value: element.sellerSalesSiteId
            };
            options.push(item);
          });
        this.siteOptions = options;

        this.dialogImportOrExportType = "dialogImport";
        this.dialogTitle = "数据导入";
        this.fileList = [];
        this.dialogImportOrExportVisible = true;
      } else if (t === "dialogExport") {
        this.dialogImportOrExportType = "dialogExport";
        this.dialogTitle = "选择";
        this.dialogImportOrExportVisible = true;
        this.$refs.multipleExportTable.clearSelection();
      }
    },
    selectAnalyse(type, row) {
      let statType = this.listQuery.statType;
      // let parentSku =null;
      // let sku = null;
      // if (statType === "1") {
      //   sku = row.parentSellerSku;
      // } else if (statType === "0") {
      //   sku = row.sellerSku;
      // }
      let parentSku = row.parentSellerSku;
      let sku = row.sellerSku;
      if (parentSku === null && sku === null) {
        this.$message.error("SKU为空!");
        return;
      }
      let params = {
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime,
        statType,
        parentSku,
        sku
      };
      let data = { type, params };
      this.$emit("changePage", data);
    },
    getList() {
      if (this.queryDaterange !== null && this.queryDaterange.length === 2) {
        this.listQuery.startTime = this.queryDaterange[0];
        this.listQuery.endTime = this.queryDaterange[1];
      } else {
        this.$message.warning("请输入时间");
        return;
      }

      // 设置 siteId 和 sellerId
      let obj = this.getSiteIdAndsellerId(this.pSite.id);
      if (obj === null) {
        this.$message.error("店铺还未授权!");
        return;
      }
      this.listQuery.siteId = obj.siteId;
      this.listQuery.sellerId = obj.sellerId;
      if (this.sortProp.field) {
        this.listQuery.field = this.sortProp.field;
        this.listQuery.sort = this.sortProp.sort;
      } else {
        delete this.listQuery.field;
        delete this.listQuery.sort;
      }

      this.listLoading = true;
      this.$axios.post("/ProductFlowReport/list", this.listQuery).then(res => {
        let { code, msg, summary, data } = res.data;

        if (code === 0) {
          // 总计/平均 summary
          let { rows, total } = data;
          let list = rows;
          if (list.length !== 0) {
            summary.productFlowReportId = null;
            list.unshift(summary);
            this.list = rows;
          } else {
            this.list = rows;
          }
          this.total = total;
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000);
        } else if(code === 500) {
          this.$message.error(msg);
          this.listLoading = false;
        }
      });
    },
    handleFilter() {
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
    checkSelecTable(row) {
      return row.productFlowReportId !== null;
    },
    checkSelecTableData(row) {
      let sku = "parentSellerSku,asin,sellerSku";
      if (this.listQuery.statType == 1) {
        if (this.statTypeLabel === "SKU") {
          sku = "parentAsin,asin,sellerSku";
        }
      } else {
        if (this.statTypeLabel === "ASIN") {
          sku = "parentAsin,parentSellerSku,sellerSku";
        } else if (this.statTypeLabel === "SKU") {
          sku = "parentAsin,parentSellerSku,asin";
        }
      }
      return sku.indexOf(row.name) === -1;
    },
    handleData() {
      if (this.dialogImportOrExportType === "dialogExport") {
        if (this.multipleExportSelection.length === 0) {
          this.$message.warning("请输选择字段");
          return;
        }
        let customExport = [];
        this.multipleExportSelection.forEach(element => {
          customExport.push(element.name);
        });

        let obj = this.getSiteIdAndsellerId(this.pSite.id);
        if (obj === null) {
          this.$message.error("店铺还未授权!");
          return;
        }

        let params = {
          siteId: obj.siteId,
          sellerId: obj.sellerId,
          startTime: this.listQuery.startTime,
          endTime: this.listQuery.endTime,
          statType: this.listQuery.statType,
          customExport
        };
        this.$axios({
          method: "post",
          url: "/ProductFlowReport/exportData",
          data: params,
          responseType: "blob"
        }).then(res => {
          // 失败时 res 无法解析
          let { data } = res;
          if (data.type !== "application/octet-stream") {
            this.$message.error("导出失败");
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = this.$refs.downloadFile;
          link.href = url;
          link.setAttribute("download", "产品流量报告.xlsx");
          link.click();
          window.URL.revokeObjectURL(url);
        });

        this.dialogImportOrExportVisible = false;
      } else if (this.dialogImportOrExportType === "dialogImport") {
        // if (this.sellerSalesSiteId === null) {
        //   this.$message.warning("请选择站点");
        //   return;
        // }

        if (this.fileList.length === 0) {
          this.$message.warning("请选择文件");
          return;
        }
        // const isCSV = this.fileList[0].raw.type === "application/vnd.ms-excel";
        // const isZIP =
        //   this.fileList[0].raw.type === "application/x-zip-compressed";

        // if (!isCSV && !isZIP) {
        //   this.$message.warning("上传文件只能是 csv 或 zip 格式!");
        //   return;
        // }
        const isLt2M = this.fileList[0].raw.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.warning("上传文件大小不能超过 2MB!");
          return;
        }
        let siteArr =
          this.pSite.data &&
          this.pSite.data.filter(element => {
            return element.sellerSalesSiteId === this.sellerSalesSiteId;
          });

        let obj = this.getSiteIdAndsellerId(this.sellerSalesSiteId);
        if (obj === null) {
          this.$message.error("店铺还未授权!");
          return;
        }

        // 后端的 @RestController 要改成 @Controller
        let params = new FormData();
        params.append("siteId", obj.siteId);
        params.append("sellerId", obj.sellerId);
        params.append("file", this.fileList[0].raw);
        let headers = { headers: { "Content-Type": "multipart/form-data" } };
        this.$axios
          .post("/ProductFlowReport/importData", params, headers)
          .then(res => {
            let { code, msg } = res.data;
            if (code === 0) {
              this.$message.success(msg);
              this.handleFilter();
              this.dialogImportOrExportVisible = false;
              // 更新站点
              this.$emit("restSellerSite");
            } else if(code === 500){
              this.$message.error(msg);
            }
          });
      }
    },
    handleExportSelectionChange(val) {
      this.multipleExportSelection = val;
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleFileRemove(file, fileList) {
      this.fileList = [];
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  margin-top: 20px;
  .el-table {
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
  }
  .query-select-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #d7d7d7;
    margin-top: 15px;
    margin-bottom: 5px;
    padding: 10px;
    .select-title {
      margin-right: 5px;
    }
  }
  .pagination-container {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .order-count-title {
    margin-top: 15px;
    margin-bottom: 8px;
  }
  /deep/.el-date-editor--daterange {
    width: 270px;
  }
  .dialog-import-export {
    /deep/.el-dialog__body {
      padding: 15px;
    }
    /deep/.el-dialog__footer {
      display: flex;
      justify-content: center;
      padding: 10px 20px 20px 20px;
    }
    .select-import {
      margin-bottom: 10px;
    }
  }
}
</style>