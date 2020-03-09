<template>
  <div class="box __Analyse">
    <el-collapse v-model="collapseItem">
      <el-collapse-item name="query">
        <template slot="title">
          <el-button type="info" @click.stop="comeBack" style="margin-right: 10px;">返回列表</el-button>{{pageTitle}}
        </template>

        <div class="query-select-body">
          <div class="query-title">父SKU</div>
          <el-input style="width:400px" v-model="textareaParentSKU" placeholder="请输入内容，一行一个父SKU" class="width-input" type="textarea" :rows="3" @blur="handleChildrenSku"></el-input>
          <div class="query-title">子SKU</div>
          <el-input style="width:400px" v-model="textareaSKU" placeholder="请输入内容，一行一个子SKU" class="width-input" type="textarea" :rows="3" @blur="handleChildrenSku"></el-input>

          <el-checkbox :indeterminate="checkParentSKU.isIndeterminate" v-model="checkParentSKU.checkAll" @change="handleCheckAllChange" class="check-all" :disabled="checkParentSKU.disabled">全选</el-checkbox>
          <el-select :popper-append-to-body="false" style="width:400px" v-model="listQuery.parentSellerSkus" multiple collapse-tags placeholder="请选择" class="medium-width-select" @change="restSkus">
            <el-option v-for="item in parentSkuOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

          <el-checkbox :indeterminate="checkSKU.isIndeterminate" v-model="checkSKU.checkAll" @change="handleCheckAllChange" class="check-all" :disabled="checkSKU.disabled">全选</el-checkbox>
          <el-select :popper-append-to-body="false" style="width:400px" v-model="listQuery.sellerSkus" multiple collapse-tags placeholder="请选择" class="medium-width-select" @change="restParentSKU">
            <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

          <div class="query-title">显示方式</div>
          <div class="set-vertical">
            <el-select :popper-append-to-body="false" v-model="listQuery.showType" placeholder="请选择" class="small-width-select">
              <el-option label="按日" value="0">
              </el-option>
              <el-option label="按周" value="1">
              </el-option>
              <el-option label="按月" value="2">
              </el-option>
            </el-select>
            <el-date-picker v-model="daterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="query-title">统计方式</div>

          <div>
            <el-select :popper-append-to-body="false" v-model="listQuery.statType" placeholder="请选择" class="small-width-statType-select">
              <el-option label="按父asin产品统计" value="1">
              </el-option>
              <el-option label="按子asin产品统计" value="0">
              </el-option>
            </el-select>

            <el-button type="success" @click="handleFilter" style="margin-left: 3px;margin-right: 3px;">搜索</el-button>
            <el-button type="success" @click="exportExcel" v-if="pType==='sale_sale'">下载数据</el-button>
            <a ref="downloadFile" v-show="false"></a>

            <!-- <div class="download-query-btn">
                <div class="query-btn" :style="queryBtnStyle">
                  <el-button type="success" @click="handleFilter">搜索</el-button>
                </div>
                <div v-if="pType==='sale_sale'"> -->
            <!--
                    :disabled="(listQuery.parentSellerSkus.length===0&&listQuery.sellerSkus.length===0)"
                  -->
            <!-- <el-button type="success" class="download-btn" @click="exportExcel">下载数据</el-button>
                  <a ref="downloadFile" v-show="false"></a>
                </div>
              </div> -->

          </div>
        </div>

      </el-collapse-item>
    </el-collapse>

    <div class="echarts-body">
      <div class="echarts-content-title">
        {{echartsContentTitle}}
      </div>
      <div class="echarts-body-content">
        <el-radio-group v-model="dataType" @change="changeDataType" v-if="pType!=='sale_sale'" :disabled="(this.barData.sessions.length===0)">
          <el-radio-button label="sessions">访客数</el-radio-button>
          <el-radio-button label="pageViews">浏览量</el-radio-button>
          <el-radio-button label="viewConversionRate">转化率</el-radio-button>
        </el-radio-group>

        <c-chart :option="lineOption" id="lineContainer"></c-chart>
        <c-chart :option="barOption" id="barContainer"></c-chart>
      </div>
    </div>

  </div>
</template>
<script>
import CChart from "./Chart";

export default {
  components: {
    CChart
  },
  props: ["pParams", "pType", "pSite"],
  data() {
    return {
      collapseItem: "query",
      pageTitle: null,
      echartsContentTitle: null,
      // queryBtnStyle: {
      //   marginBottom: "10px"
      // },
      queryAsins: null,
      queryParentAsins: null,
      daterange: [],

      checkParentSKU: {
        checkAll: false,
        isIndeterminate: false,
        disabled: true
      },
      checkSKU: {
        checkAll: false,
        isIndeterminate: false,
        disabled: true
      },

      textareaSKU: null,
      textareaParentSKU: null,
      queryChildrenAsin: {
        sellerId: null,
        sellerSkus: null,
        parentSellerSkus: null
      },
      listQuery: {
        // siteId: 1,  产品流量报告-历史流量分析 用到；
        sellerId: null,

        startTime: null,
        endTime: null,

        sellerSkus: [],
        parentSellerSkus: [],
        statType: "1",
        showType: "0"
      },

      parentSkuOptions: [],
      skuOptions: [],
      dataType: "sessions",

      lineOption: null,
      lineData: {
        sku: null,
        sessions: null,
        pageViews: null,
        viewConversionRate: null,
        statTime: null,

        countSKU: null,
        boughtDate: null,
        count: null
      },

      barOption: null,
      barData: {
        sessions: null,
        pageViews: null,
        viewConversionRate: null,
        statTime: null,

        boughtDate: null,
        count: null
      },
      dataZoom: {
        show: true,
        end: 50
      }
    };
  },
  created() {
    let pType = this.pType;
    let pageTitle = null;
    let echartsContentTitle = null;
    if (pType === "sale_sale") {
      //历史销量分析
      pageTitle = "产品历史销量分析";
      echartsContentTitle = "订单数";
      // this.queryBtnStyle.marginBottom = "0";
      this.setFluxOrTrendInitParam();
    } else if (pType === "sale_flux") {
      //产品流量分析
      pageTitle = "产品历史流量分析";
      echartsContentTitle = "访客数/浏览量/转化率";
      this.setFluxOrTrendInitParam();
    } else if (pType === "flux_trend") {
      //更多趋势
      pageTitle = "产品历史流量分析";
      echartsContentTitle = "访客数/浏览量/转化率";
      this.setFluxOrTrendInitParam();
    }
    this.pageTitle = pageTitle;
    this.echartsContentTitle = echartsContentTitle;
  },
  watch: {
    daterange(newP, oldP) {
      // 设置显示方式
      if (newP !== null) {
        this.listQuery.showType = this.getShowType(newP[0], newP[1]);
      } else {
        this.listQuery.showType = "0";
      }
    },
    "pSite.id"(newP, oldP) {
      this.handleFilter();
    },
    "listQuery.parentSellerSkus"(newP, oldP) {
      let checkedCount = newP.length;
      this.checkParentSKU.checkAll =
        checkedCount === this.parentSkuOptions.length;
      this.checkParentSKU.isIndeterminate =
        checkedCount > 0 && checkedCount < this.parentSkuOptions.length;
    },
    "listQuery.sellerSkus"(newP, oldP) {
      let checkedCount = newP.length;
      this.checkSKU.checkAll = checkedCount === this.skuOptions.length;
      this.checkSKU.isIndeterminate =
        checkedCount > 0 && checkedCount < this.skuOptions.length;
    }
  },
  methods: {
    comeBack() {
      let pType = this.pType;
      if (pType === "sale_sale" || pType === "sale_flux") {
        this.$emit("comeBack", "sale");
      } else {
        this.$emit("comeBack", "flux");
      }
    },
    // 父asin与子asin 双向绑定
    restSkus(val) {
      let selectSKU = [];
      val.forEach(element => {
        this.skuOptions.forEach(el => {
          let parentSkus = el.value.split("_")[0];
          if (element === parentSkus) {
            selectSKU.push(el.value);
          }
        });
      });
      this.listQuery.sellerSkus = selectSKU;
    },
    restParentSKU(valSku) {
      if (valSku.length === 0) {
        this.listQuery.parentSellerSkus = [];
      } else {
        let parentSkuArr = [];
        valSku.forEach(element => {
          let parentSkus = element.split("_")[0];
          parentSkuArr.push(parentSkus);
          // if(parentAsins!=='init'){
          //   parentAsinsArr.push(parentAsins);
          // }
        });
        // 排重
        for (var i = 0; i < parentSkuArr.length; i++) {
          if (parentSkuArr.indexOf(parentSkuArr[i]) != i) {
            parentSkuArr.splice(i, 1);
            i--;
          }
        }
        this.listQuery.parentSellerSkus = parentSkuArr;
      }
    },
    handleCheckAllChange(val) {
      this.checkParentSKU.checkAll = val;

      this.checkSKU.checkAll = val;

      if (val) {
        let parentAsins = [];
        this.parentSkuOptions.forEach(element => {
          parentAsins.push(element.value);
        });
        this.listQuery.parentSellerSkus = parentAsins;
        let asins = [];
        this.skuOptions.forEach(element => {
          asins.push(element.value);
        });
        this.listQuery.sellerSkus = asins;
      } else {
        this.listQuery.parentSellerSkus = [];
        this.listQuery.sellerSkus = [];
        // this.checkParentAsins.disabled =!val
        // this.checkAsin.disabled =!val
      }
    },

    // 产品流量分析 或 更多趋势 初始化参数
    setFluxOrTrendInitParam() {
      this.daterange = [this.pParams.startTime, this.pParams.endTime];
      this.listQuery.showType = this.getShowType(
        this.pParams.startTime,
        this.pParams.endTime
      );

      let statType = this.pParams.statType; // 1 父 0 子
      let pType = this.pType;

      let parentSku = this.pParams.parentSku;
      let sku = this.pParams.sku;

      let obj = this.getSiteIdAndsellerId(this.pSite.id);
      let queryParams = {
        parentSellerSkus: null,
        sellerId: obj.sellerId,
        sellerSkus: null
      };
      let url = "/ProductFlowReport/getChildrenSku";
      if (pType === "sale_sale") {
        url = "/productSaleReport/getChildrenSku";
      } else {
        queryParams.siteId = obj.siteId;
      }

      // 初始化 ,value:'init_'+asinName
      // 加上 _ 用于 父asin与 子asin 关联
      let item = { label: sku };
      // if (statType == "1") {
      //   queryParams.parentSellerSkus =[sku]
      //   this.textareaParentSKU =sku
      // } else if (statType == "0") {
      //   queryParams.sellerSkus =[sku]
      //   this.textareaSKU =sku
      // }

      queryParams.parentSellerSkus = parentSku === null ? null : [parentSku];
      queryParams.sellerSkus = sku === null ? null : [sku];
      // this.textareaParentSKU =parentSku
      // this.textareaSKU =sku

      this.$axios.post(url, queryParams).then(res => {
        let { code, data } = res.data;
        if (code !== 0) {
          return;
        }

        let parentSkuOptions = [];
        let skuOptions = [];

        let parentSkuVal = [];
        let sellerSkusVal = [];
        data.forEach(element => {
          let parentSellerSku = element.parentSellerSku;
          let parentItem = { label: parentSellerSku, value: parentSellerSku };
          parentSkuOptions.push(parentItem);
          parentSkuVal.push(parentItem.value);

          element.sellerSkus.forEach(el => {
            let item = { label: el, value: parentSellerSku + "_" + el };
            skuOptions.push(item);
            sellerSkusVal.push(item.value);
          });
        });
        this.parentSkuOptions = parentSkuOptions;
        this.skuOptions = skuOptions;

        this.listQuery.parentSellerSkus = parentSkuVal;
        this.listQuery.sellerSkus = sellerSkusVal;

        this.listQuery.statType = statType.toString();

        if (statType == "0") {
          // 子
          setCheck(this);
        } else if (statType == "1") {
          // 父
          setCheck(this);
        }
        this.handleFilter();
      });

      function setCheck(self) {
        self.checkParentSKU.isIndeterminate = false;
        self.checkParentSKU.checkAll = true;
        self.checkParentSKU.disabled = false;
        if (self.parentSkuOptions.length === 0) {
          self.checkParentSKU.checkAll = false;
          self.checkParentSKU.disabled = true;
        }
        self.checkSKU.isIndeterminate = false;
        self.checkSKU.checkAll = true;
        self.checkSKU.disabled = false;
        if (self.skuOptions.length === 0) {
          self.checkSKU.checkAll = false;
          self.checkSKU.disabled = true;
        }
      }
    },
    getSiteIdAndsellerId(id) {
      let siteArr = this.pSite.data.filter(element => {
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
    getShowType(sT, eT) {
      let sTime = new Date(sT);
      let eTime = new Date(eT);
      let dateDiff = (eTime.getTime() - sTime.getTime()) / (1000 * 3600 * 24);

      if (dateDiff < 30) {
        // 按日
        return "0";
      } else if (dateDiff < 365) {
        // 按周
        return "1";
      } else {
        // 按月
        return "2";
      }
    },
    // 删除数组空格
    removeArrSpaces(arr) {
      return arr.split("\n").filter(function(val) {
        return typeof val === "string" ? !(val.trim() === "") : val;
      });
    },
    handleChildrenSku() {
      // 剔除空格
      let skuArr = null;
      if (this.textareaSKU !== null) {
        skuArr = this.removeArrSpaces(this.textareaSKU);

        if (skuArr.length === 0) {
          skuArr = null;
        }
      }
      let parentSKUArr = null;
      if (this.textareaParentSKU !== null) {
        parentSKUArr = this.removeArrSpaces(this.textareaParentSKU);

        if (parentSKUArr.length === 0) {
          parentSKUArr = null;
        }
      }

      this.queryChildrenAsin.sellerSkus = skuArr;
      this.queryChildrenAsin.parentSellerSkus = parentSKUArr;

      let obj = this.getSiteIdAndsellerId(this.pSite.id);

      let pType = this.pType;
      let url = "/ProductFlowReport/getChildrenSku";
      if (pType === "sale_sale") {
        url = "/productSaleReport/getChildrenSku";
        this.queryChildrenAsin.sellerId = obj.sellerId;
      } else if (pType === "flux_trend" || pType === "sale_flux") {
        this.queryChildrenAsin.siteId = obj.siteId;
        this.queryChildrenAsin.sellerId = obj.sellerId;
      }

      this.$axios.post(url, this.queryChildrenAsin).then(res => {
        let { code, data, msg } = res.data;
        if (code === 0) {
          this.parentSkuOptions = [];
          this.skuOptions = [];
          this.listQuery.parentSellerSkus = [];
          this.listQuery.sellerSkus = [];
          // 加上 _ 是关联 子asin与父asin
          data.forEach(element => {
            let parentSellerSku = {
              label: element.parentSellerSku,
              value: element.parentSellerSku
            };
            this.parentSkuOptions.push(parentSellerSku);
            // 选中
            this.listQuery.parentSellerSkus.push(parentSellerSku.value);

            element.sellerSkus.forEach(el => {
              let sellerSku = {
                label: el,
                value: element.parentSellerSku + "_" + el
              };
              this.skuOptions.push(sellerSku);
              // 选中
              this.listQuery.sellerSkus.push(sellerSku.value);
            });
          });

          let parentAsinsFalg = this.listQuery.parentSellerSkus.length === 0;
          this.checkParentSKU.isIndeterminate = false;
          this.checkParentSKU.checkAll = !parentAsinsFalg;
          this.checkParentSKU.disabled = parentAsinsFalg;

          let asinFalg = this.listQuery.sellerSkus.length === 0;
          this.checkSKU.isIndeterminate = false;
          this.checkSKU.checkAll = !asinFalg;
          this.checkSKU.disabled = asinFalg;
        } else if (code === 500) {
          this.$message.error(msg);
        }
      });
    },
    toPercent(point) {
      if (isNaN(point) || point == 0) {
        return 0;
      }
      return Number(point * 100).toFixed();
    },
    handleFilter() {
      this.dataType = "sessions";
      let pType = this.pType;
      let daterange = this.daterange;
      if (daterange !== null && daterange.length !== 2) {
        this.$message.warning("请输入时间");
        return;
      }
      let obj = this.getSiteIdAndsellerId(this.pSite.id);
      if (obj === null) {
        this.$message.error("店铺还未授权!");
        return;
      }
      let params = JSON.parse(JSON.stringify(this.listQuery));

      // 不要改变 this.listQuery里的数据，改变后下拉菜单有问题
      let url = "/productSaleReport/historySaleList";
      if (pType === "flux_trend" || pType === "sale_flux") {
        params.siteId = obj.siteId;
        params.sellerId = obj.sellerId;
        url = "/ProductFlowReport/historyFlowList";
      } else if (pType === "sale_sale") {
        // B07G98W2ZC
        // params.asins= ['B07G98W2ZC'],
        // params.parentAsins=null
        params.sellerId = obj.sellerId;
      }

      let skuArr = [];
      this.listQuery.sellerSkus.forEach(element => {
        skuArr.push(element.split("_")[1]);
      });

      if (skuArr.length === 0) {
        params.sellerSkus = null;
      } else {
        params.sellerSkus = skuArr;
      }

      if (params.parentSellerSkus.length === 0) {
        params.parentSellerSkus = null;
      }

      params.startTime = daterange[0];
      params.endTime = daterange[1];

      this.$axios.post(url, params).then(res => {
        let { code, summary, data } = res.data;
        if (code === 0) {
          let summaryBar = [];
          let dataLine = {};

          if (pType === "flux_trend" || pType === "sale_flux") {
            let summarySessions = [];
            let summaryPageViews = [];
            let summaryViewConversionRate = [];
            let summaryStatTime = [];
            summary.forEach(element => {
              summarySessions.push(element.sessions);
              summaryPageViews.push(element.pageViews);
              let vcr = this.toPercent(element.viewConversionRate); // 乘100
              summaryViewConversionRate.push(vcr);
              summaryStatTime.push(element.statTime);
            });
            this.barData.sessions = summarySessions;
            this.barData.pageViews = summaryPageViews;
            this.barData.viewConversionRate = summaryViewConversionRate;
            this.barData.statTime = summaryStatTime;

            summaryBar = summarySessions;
            /********************/

            let dataSKU = [];

            let dataSessions = {};
            let dataPageViews = {};
            let dataViewConversionRate = {};
            let dataStatTime = [];

            let sessions = [];
            let pageViews = [];
            let viewConversionRate = [];

            data.forEach(element => {
              dataSKU.push(element.sellerSku);
              sessions = [];
              pageViews = [];
              viewConversionRate = [];

              element.productFlowReportVOs.forEach(el => {
                sessions.push(el.sessions);
                pageViews.push(el.pageViews);
                let vcr = this.toPercent(el.viewConversionRate); // 乘100
                viewConversionRate.push(vcr);
              });

              dataSessions[element.sellerSku] = sessions;
              dataPageViews[element.sellerSku] = pageViews;
              dataViewConversionRate[element.sellerSku] = viewConversionRate;
            });

            dataLine = dataSessions;

            // 确定每个 asin 的productFlowReportVOs 的长度一样，相同的数组坐标的日期一样
            if (data.length > 0) {
              data[0].productFlowReportVOs.forEach(element => {
                dataStatTime.push(element.statTime);
              });
            }

            this.lineData.sku = dataSKU;
            this.lineData.sessions = dataSessions;
            this.lineData.pageViews = dataPageViews;
            this.lineData.viewConversionRate = dataViewConversionRate;
            this.lineData.statTime = dataStatTime;
          } else if (pType === "sale_sale") {
            let summaryCount = [];
            let summaryBoughtDate = [];
            summary.forEach(element => {
              summaryCount.push(element.count);
              summaryBoughtDate.push(element.boughtDate);
            });

            this.barData.count = summaryCount;
            this.barData.boughtDate = summaryBoughtDate;

            summaryBar = summaryCount;
            //countAsin
            let dataSKU = [];

            // let dataBoughtDate={}
            let dataCount = {};
            let dataBoughtDate = [];

            let boughtDate = [];
            let count = [];
            data.forEach(element => {
              dataSKU.push(element.sellerSku);
              boughtDate = [];
              count = [];
              element.productSaleReportVOs.forEach(el => {
                boughtDate.push(el.boughtDate);
                count.push(el.count);
              });
              dataCount[element.sellerSku] = count;
              dataBoughtDate[element.sellerSku] = boughtDate; // 其实这个没用
            });

            if (data.length > 0) {
              data[0].productSaleReportVOs.forEach(element => {
                dataBoughtDate.push(element.boughtDate);
              });
            }

            this.lineData.countSKU = dataSKU;
            this.lineData.count = dataCount;
            this.lineData.boughtDate = dataBoughtDate;

            dataLine = dataCount;
          }

          // 默认
          this.setBarOption(summaryBar);
          // 默认
          this.setLineData(dataLine);
        }
      });
    },
    getBarYAxis(pType, dataType) {
      let yAxis = [{ type: "value" }];
      if (pType === "flux_trend" || pType === "sale_flux") {
        if (dataType === "viewConversionRate") {
          yAxis = [
            {
              type: "value",
              axisLabel: {
                show: true,
                interval: "auto",
                formatter: "{value} %"
              },
              show: true
            }
          ];
        }
      }
      return yAxis;
    },
    getBarTooltip(pType, dataType) {
      let tooltip = {
        trigger: "item",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        },
        show: true
      };
      if (pType === "flux_trend" || pType === "sale_flux") {
        if (dataType === "viewConversionRate") {
          // tooltip.formatter = "{a} </br>{b}:&nbsp;{c}%";可以使用模板，但缺少小圆点
          tooltip.formatter = function(param) {
            return (
              param.seriesName +
              "<br>" +
              param.marker +
              param.name +
              ":&nbsp;" +
              param.value +
              "%"
            );
          };
          // tooltip.show = true;
        }
      } else {
        tooltip.formatter = function(param) {
          return param.marker + param.name + ":&nbsp;" + param.value;
        };
      }
      return tooltip;
    },
    getLineTooltip(pType, dataType) {
      let tooltip = { trigger: "axis" }; // item
      if (pType === "flux_trend" || pType === "sale_flux") {
        if (dataType === "viewConversionRate") {
          tooltip.formatter = function(param) {
            return (
              param[0].seriesName +
              "<br>" +
              param[0].marker +
              param[0].name +
              ":&nbsp;" +
              param[0].value +
              "%"
            );
          };
          tooltip.show = true;
        }
      }
      return tooltip;
    },
    setBarOption(seriesData) {
      if (seriesData.length === 0) {
        this.barOption = null;
      } else {
        let pType = this.pType;
        let xAxisData = this.barData.statTime;
        if (pType === "sale_sale") {
          xAxisData = this.barData.boughtDate;
        }

        let yAxis = this.getBarYAxis(pType, this.dataType);
        let tooltip = this.getBarTooltip(pType, this.dataType);
        let option = {
          color: ["#3398DB"],
          tooltip,
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: xAxisData,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                rotate: 45
              }
            }
          ],
          yAxis
          // dataZoom: this.dataZoom
        };
        let series = null;
        if (pType === "flux_trend" || pType === "sale_flux") {
          let dataType = this.dataType;
          let name = "转化率";
          if (dataType === "sessions") {
            name = "访客数";
          } else if (dataType === "pageViews") {
            name = "浏览量";
          }
          series = [
            {
              name,
              type: "bar",
              barWidth: "30",

              data: seriesData
            }
          ];
          if (this.dataType === "viewConversionRate") {
            series = [
              {
                name,
                type: "bar",
                barWidth: "30",

                data: seriesData,
                itemStyle: {
                  normal: {
                    label: {
                      // show: true,
                      // position: "top",
                      formatter: "{b}\n{c} %"
                    }
                  }
                }
              }
            ];
          }
        } else if (pType === "sale_sale") {
          series = [
            {
              type: "bar",
              barWidth: "30",
              data: seriesData
            }
          ];
        }
        option.series = series;

        // if (xAxisData.length < 11) {
        //   option.dataZoom.show = false;
        // } else {
        //   option.dataZoom.show = true;
        // }
        this.barOption = option;
      }
    },
    setLineData(seriesData) {
      if (JSON.stringify(seriesData) === "{}") {
        this.lineOption = null;
      } else {
        let pType = this.pType;
        let xAxisData = this.lineData.statTime;
        let legendData = this.lineData.sku;
        if (pType === "sale_sale") {
          xAxisData = this.lineData.boughtDate;
          legendData = this.lineData.countSKU;
        }
        let yAxis = this.getBarYAxis(pType, this.dataType);
        let tooltip = this.getLineTooltip(pType, this.dataType);

        let option = {
          tooltip,
          legend: {
            // 太多时设置分页
            type: "scroll",
            show: true,
            top: 10,
            left: 50,
            itemWidth: 14,
            itemHeight: 10,
            itemGap: 48,
            width: "95%",
            height: 80,
            align: "auto",
            textStyle: {
              color: "#000",
              fontSize: 14
            },
            selectedMode: true,
            orient: "horizontal",
            // backgroundColor: '#eee',
            data: legendData
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: false
              }
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xAxisData,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis
          // dataZoom: this.dataZoom
        };

        let series = [];
        if (pType === "flux_trend" || pType === "sale_flux") {
          this.lineData.sku.forEach(element => {
            let data = seriesData[element];
            let serie = {
              name: element,
              type: "line",
              stack: "总量",
              data
            };
            series.push(serie);
          });
        } else if (pType === "sale_sale") {
          this.lineData.countSKU.forEach(element => {
            let data = seriesData[element];
            let serie = {
              name: element,
              type: "line",
              stack: "总量",
              data
            };
            series.push(serie);
          });
        }
        option.series = series;
        // if (xAxisData.length < 11) {
        //   option.dataZoom.show = false;
        // } else {
        //   option.dataZoom.show = true;
        // }

        this.lineOption = option;
      }
    },
    changeDataType(label) {
      if (label === "sessions") {
        this.setBarOption(this.barData.sessions);
        this.setLineData(this.lineData.sessions);
      } else if (label === "pageViews") {
        this.setBarOption(this.barData.pageViews);
        this.setLineData(this.lineData.pageViews);
      } else {
        this.setBarOption(this.barData.viewConversionRate);
        this.setLineData(this.lineData.viewConversionRate);
      }
    },
    exportExcel() {
      let obj = this.getSiteIdAndsellerId(this.pSite.id);
      if (obj === null) {
        this.$message.error("店铺还未授权!");
        return;
      }
      let daterange = this.daterange;
      if (daterange !== null && daterange.length !== 2) {
        this.$message.warning("请输入时间");
        return;
      }

      let params = JSON.parse(JSON.stringify(this.listQuery));
      params.sellerId = obj.sellerId;

      let skuArr = [];
      this.listQuery.sellerSkus.forEach(element => {
        skuArr.push(element.split("_")[1]);
      });

      if (skuArr.length === 0) {
        params.sellerSkus = null;
      } else {
        params.sellerSkus = skuArr;
      }

      if (params.parentSellerSkus.length === 0) {
        params.parentSellerSkus = null;
      }
      params.startTime = daterange[0];
      params.endTime = daterange[1];

      this.$axios({
        method: "post",
        url: "/productSaleReport/exportData",
        data: params,
        responseType: "blob"
      }).then(res => {
        // 失败时 res 无法解析, responseType: "blob" 注释掉就可以解析
        // 返回也要是文件流格式
        let { data } = res;
        if (data.type !== "application/octet-stream") {
          this.$message.error("导出失败");
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = this.$refs.downloadFile;
        link.href = url;
        link.setAttribute("download", "历史销售分析.xlsx");
        link.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  // height: 750px;

  // overflow-y: auto;
  // overflow-x: hidden;
  .query-select-body {
    padding: 10px;
    border: 1px solid #d7d7d7;
    display: grid;
    grid-template: ~"70px 30px 30px/ 60px 380px 80px auto";
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    /deep/.width-input {
      width: 325px;
    }
    /deep/.small-width-select {
      width: 100px;
    }
    /deep/.small-width-statType-select {
      width: 150px;
    }
    /deep/.medium-width-select {
      width: 325px;
    }
    .check-all {
      /deep/.el-checkbox__label {
        padding-left: 7px;
      }
    }
    /deep/.el-date-editor--daterange {
      width: 220px;
      vertical-align: -2px;
    }
    .query-title,
    .check-all {
      align-self: center;
      justify-self: end;
    }
  }
  // .download-btn {
  //   margin-bottom: 10px;
  // }
  .echarts-body {
    border: 1px solid #d7d7d7;
    // height: 700px;
    .echarts-content-title {
      font-size: 13px;
      font-weight: bold;
      padding: 10px;
      border-bottom: 1px solid #d7d7d7;
      background-color: #f7f7f7;
    }
    .echarts-body-content {
      // height: 580px;
      // overflow-y: auto;
      padding: 10px;
    }
  }
  .el-collapse {
    margin-top: 10px;
    .el-button--info {
      background-color: #ecf5ff;
      color: #606266;
      border-color: #dcdfe6;
    }
    /deep/.el-collapse-item__header {
      background-color: #f5f7fa;
      padding-left: 10px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    /deep/.el-collapse-item__content {
      padding-bottom: 0;
    }
    /deep/.el-collapse-item__wrap {
      border-bottom-width: 0;
    }
  }
  // .download-query-btn {
  //   display: flex;
  //   margin-top: 10px;
  //   .query-btn {
  //     margin-right: 10px;
  //   }
  // }
}
</style>