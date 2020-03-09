<!-- 评价数表格 -->
<template>
  <div class="chartRank" v-loading="dialogLoading" style="margin-top:15px;">
    <header style="position:relative">
      <!-- <div class="title">
        销量报表
      </div> -->
      <div style="position:absolute;right:0px;top:-3px;">
        <el-date-picker :picker-options="cfuns.pacPickerOptions" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" @change="changeTime" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" size="mini">
        </el-date-picker>
      </div>
      <div style="position:absolute;right:240px;top:-4px;">
        <span class="title">统计方式 :</span>
        <el-select :popper-append-to-body="false" v-model="value2" style="width:160px;margin-left:10px;" @change="change" size="mini">
          <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </header>

    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;position: relative;">
	  <el-button   v-show="chartData.chartShow" class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:50px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel(1)"></el-button>
      <none-page v-if="!chartData.chartShow" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow">
        <echart auto-resize :options="echartData" id="ChartRank2" style="width:100%; height:300px"></echart>
      </div>
      <!-- {{list}} -->
    </main>


    <!-- 周一到周日 -->
    <el-table v-if="list&&list.listTotal1&&value2==1" :data="list.listTotal1" style="width: 100%" border>
      <el-table-column prop="statTime" label="太平洋时间" align="center" >
      </el-table-column>
	  <el-table-column label="订单数" align="center">
		  <el-table-column prop="orderCnt" label="订单数" align="center" sortable >
		  </el-table-column>
		  <el-table-column prop="proportion" label="占比" align="center" sortable >
			<template slot-scope="scope">
			  {{scope.row.proportion | _formatRate2}}
			</template>
		  </el-table-column>
	  </el-table-column>
	  <el-table-column label="访客数" align="center">
		  <el-table-column prop="sessions" label="访客数" align="center" sortable >
			  <template slot-scope="scope">
			    -
			  </template>
		  </el-table-column>
		  <el-table-column prop="sessionsProp" label="占比" align="center" sortable >
			<template slot-scope="scope">
			  {{scope.row.proportion | _formatRate2}}
			</template>
		  </el-table-column>
	  </el-table-column>
	  <el-table-column prop="conversionRate" label="转化率" align="center" sortable >
		  <template slot-scope="scope">
		    {{scope.row.conversionRate | _formatRate2}}
		  </template>
	  </el-table-column>
    </el-table>

    
    <!-- 周一到周日（0-24点） -->
    <div style="position:relative">
      <el-table v-if="list&&list.listTotal2_copy&&value2==2" :data="list.listTotal2_copy" style="width: 100%;" border>
        <el-table-column label="太平洋时间" align="center">
          <template slot-scope="scope">
            {{scope.row.statTime+"点"}}
          </template>
        </el-table-column>
        <el-table-column label="周一" align="center">
          <el-table-column prop="orderCnt_MON" label="订单数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="proportion_MON" label="占比" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.proportion_MON | _formatRate2}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="周二" align="center">
          <el-table-column prop="orderCnt_TUE" label="订单数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="proportion_TUE" label="占比" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.proportion_TUE | _formatRate2}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="周三" align="center">
          <el-table-column prop="orderCnt_WED" label="订单数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="proportion_WED" label="占比" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.proportion_WED | _formatRate2}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="周四" align="center">
          <el-table-column prop="orderCnt_THU" label="订单数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="proportion_THU" label="占比" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.proportion_THU | _formatRate2}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="周五" align="center">
          <el-table-column prop="orderCnt_FRI" label="订单数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="proportion_FRI" label="占比" align="center" sortable> 
            <template slot-scope="scope">
              {{scope.row.proportion_FRI | _formatRate2}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="周六" align="center">
          <el-table-column prop="orderCnt_SAT" label="订单数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="proportion_SAT" label="占比" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.proportion_SAT | _formatRate2}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="周日" align="center">
          <el-table-column prop="orderCnt_SUN" label="订单数" align="center" sortable>
          </el-table-column>
          <el-table-column prop="proportion_SUN" label="占比" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.proportion_SUN | _formatRate2}}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
	
	
    <!-- （0-24点） -->
    <div style="position:relative">
      <el-table v-if="list&&list.listTotal3&&value2==3" :data="list.listTotal3" style="width: 100%;" border>
        <el-table-column prop="statTime" label="太平洋时间" align="center" :key="Math.random()" >
          <template slot-scope="scope">
            {{scope.row.statTime+"点"}}
          </template>
        </el-table-column>
        <el-table-column prop="orderCnt" label="订单数" align="center" :key="Math.random()" sortable>
        </el-table-column>
        <el-table-column prop="proportion" label="占比" align="center" :key="Math.random()" sortable>
          <template slot-scope="scope">
            {{scope.row.proportion | _formatRate2}}
          </template>
        </el-table-column>
      </el-table>
    </div>

	
	<!-- 1月份-12月份 -->
	<el-table v-if="list&&list.listTotal4&&value2==4" :data="list.listTotal4" style="width: 100%" border>
	  <el-table-column prop="statTime" label="太平洋时间" align="center" >
	  </el-table-column>
	  <el-table-column label="订单数" align="center">
		  <el-table-column prop="orderCnt" label="订单数" align="center" sortable >
		  </el-table-column>
		  <el-table-column prop="proportion" label="占比" align="center" sortable >
			<template slot-scope="scope">
			  {{scope.row.proportion | _formatRate2}}
			</template>
		  </el-table-column>
	  </el-table-column>
	  <el-table-column label="访客数" align="center">
		  <el-table-column prop="sessions" label="访客数" align="center" sortable >
		  </el-table-column>
		  <el-table-column prop="sessionsProp" label="占比" align="center" sortable >
			<template slot-scope="scope">
			  {{scope.row.proportion | _formatRate2}}
			</template>
		  </el-table-column>
	  </el-table-column>
	  <el-table-column prop="conversionRate" label="转化率" align="center" sortable >
		  <template slot-scope="scope">
		    {{scope.row.conversionRate | _formatRate2}}
		  </template>
	  </el-table-column>
	</el-table>
	
	
	
	<!-- 每日完成曲线 -->
	<el-table v-if="list&&list.listTotal5&&value2==5" :data="list.listTotal5" style="width: 100%" border>
	  <el-table-column prop="statTime" label="太平洋时间" align="center" >
	  </el-table-column>
	  <el-table-column label="订单数" align="center">
		  <el-table-column prop="orderCnt" label="订单数" align="center" sortable >
		  </el-table-column>
		  <el-table-column prop="proportion" label="占比" align="center" sortable >
			<template slot-scope="scope">
			  {{scope.row.proportion | _formatRate2}}
			</template>
		  </el-table-column>
	  </el-table-column>
	  <el-table-column label="访客数" align="center">
		  <el-table-column prop="sessions" label="访客数" align="center" sortable >
		  </el-table-column>
		  <el-table-column prop="sessionsProp" label="占比" align="center" sortable >
			<template slot-scope="scope">
			  {{scope.row.proportion | _formatRate2}}
			</template>
		  </el-table-column>
	  </el-table-column>
	  <el-table-column prop="conversionRate" label="转化率" align="center" sortable >
		  <template slot-scope="scope">
		    {{scope.row.conversionRate | _formatRate2}}
		  </template>
	  </el-table-column>
	</el-table>
	
	

    <!-- 销量占比 -->
    <header style='margin-top:15px;height:30px;'></header>
      <main style="padding:10px 20px;box-size:border-box;width:100%;border:1px solid #dcdcdc;position: relative;">
		<el-button   v-show="chartData.chartShow4" class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:50px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel(2)"></el-button>
        <none-page v-if="!chartData.chartShow4" noBack>暂无数据</none-page>
        <div v-show="chartData.chartShow4">
          <echart auto-resize :options="echartData4" id="ChartRank4" style="width:100%; height:500px;overflow:visible"></echart>
        </div>
      </main>
      <main style="padding:10px 20px;box-size:border-box;width:100%;border:1px solid #dcdcdc;">
        <none-page v-if="!chartData.chartShow3" noBack>{{chartData.chartShow3Text}}</none-page>
        <div v-show="chartData.chartShow3">
          <echart auto-resize :options="echartData3" id="ChartRank3" style="width:100%; height:350px;overflow:visible"></echart>
        </div>
      </main>
      <div style="position:relative">
        <el-table ref="Table1" v-if="list&&list.listParentSku" :data="list.listParentSku" style="width: 100%;height:100%;" border>
          <el-table-column prop="parentSku" label="SKU" align="center">
            <template slot-scope="scope">
              {{scope.row.parentSku}}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="当前库存" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.quantity | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="orderCnt" label="订单数" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.orderCnt | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="proportion" label="占比" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.proportion | _formatRate2}}
            </template>
          </el-table-column>
        </el-table>
        <!-- 2 -->
        <!-- <el-table v-if="list&&list.listParentSku" :data="list.listParentSku" style="width: 100%;height:100%;overflow-y:auto;z-index:100;margin-top:20px" border >
          <el-table-column prop="parentSku" label="SKU" align="center">
            <template slot-scope="scope">
              {{scope.row.parentSku}}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="当前库存" align="center">
            <template slot-scope="scope">
              {{scope.row.quantity | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="orderCnt" label="订单数" align="center">
            <template slot-scope="scope">
              {{scope.row.orderCnt | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="proportion" label="占比" align="center">
            <template slot-scope="scope">
              {{scope.row.proportion | _formatRate2}}
            </template>
          </el-table-column>
        </el-table> -->
      </div>
    </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
import _sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';
import _reverse from 'lodash/reverse';
// console.log(echarts, "echarts");
import mock from "@/api/json.js";
import { downloadFile } from 'Utils/tools';
export default {
  name: "chartRank",
  data() {
    return {
      chartData: {
        chartShow: false,
        chartShow4: false,
        chartShow3: false,
        ChartShow3Text: "暂无数据"
      },
      echartData: {},
      echartData3: {},
      echartData4: {},
      value: "1",
      DateMsg: {
        DateValue: [
          this.cfuns.getDay(365).computedDay,
          dayjs().subtract(15,'hour').format('YYYY-MM-DD')
        ],
        // DateValue: [this.chartData.date[0], this.chartData.date[1]],
        width: "240px",
        type: "daterange"
      },
      dayOptions: [
        {
          value: 1,
          label: "周一到周日"
        },
        {
          value: 2,
          label: "周一到周日（0-24点）"
        },
        {
          value: 3,
          label: "0-24点"
        },
        {
          value: 4,
          label: "1月份~12月份"
        },
        {
          value: 5,
          label: "每日完成曲线"
        }
      ],
      sortMethod:(a,b)=>{
        console.log(a);
        console.log(b);
      },
      value2: 1,
      dialogLoading: false,
      Loading: false, //
      list: null,
      sortData: {}
    };
  },
  created() {},
  mounted() {},
  methods: {
	downloadExel(type){
		let params = {
			sellerId:this.sellerId,
			siteId:this.siteId,
			startTime:this.DateMsg.DateValue[0],
			endTime:this.DateMsg.DateValue[1],
			parentSkus: this.$store.state.common.select_parentSkuMain && this.$store.state.common.select_parentSkuMain.length ? this.$store.state.common.select_parentSkuMain : this.$store.state.common.parentSkusAll,
			skus : this.$store.state.common.select_childSku && this.$store.state.common.select_childSku.length ? this.$store.state.common.select_childSku : this.$store.state.common.childSkusAll
		}
		let PAr = this.$store.state.common.select_parentSkuMain
		let CHi = this.$store.state.common.select_childSku
		if( (PAr && PAr.length) || (CHi && CHi.length) ){
		  if(CHi && CHi.length) params.parentSkus = null
		  if( (PAr && PAr.length) && !(CHi && CHi.length) ) params.skus = null
		}
		if(type==1) params.statType = this.value2
		this.$api[`${type==1?'salesShopDayListReportExport':'salesShopDayListSkuExport'}`](params)
		  .then(data => {
		    downloadFile(data, `${type==1?'销量报表':'销量占比'}`)
		  })
		  .catch(() => {})
	},
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
        this.sortData = {};
        this.getList(); //请求列表
      } else {
        if (type === "desc") {
          this.sortData.sort = 0;
        } else {
          this.sortData.sort = 1;
        }
        this.sortData.prop = this.cfuns.toLine(sort_param.prop);
        let arg = {};
        arg.sort = this.sortData.sort;
        arg.sortField = this.sortData.prop;
        arg.startTime = this.DateMsg.DateValue[0];
        arg.endTime = this.DateMsg.DateValue[1];
        arg.sellerId = this.sellerId;
        arg.siteId = this.siteId;
        arg.value2 = this.value2;
        arg.parentSkus = this.$store.state.common.select_parentSkuMain && this.$store.state.common.select_parentSkuMain.length ? this.$store.state.common.select_parentSkuMain : this.$store.state.common.parentSkusAll;
		arg.skus = this.$store.state.common.select_childSku && this.$store.state.common.select_childSku.length ? this.$store.state.common.select_childSku : this.$store.state.common.childSkusAll;
		let PAr = this.$store.state.common.select_parentSkuMain
		let CHi = this.$store.state.common.select_childSku
		if( (PAr && PAr.length) || (CHi && CHi.length) ){
		  if(CHi && CHi.length) arg.parentSkus = null
		  if( (PAr && PAr.length) && !(CHi && CHi.length) ) arg.skus = null
		}
        this.$api["SalesShopDayListSku"](arg).then(data => {
          this.list.listParentSku = data.data;
        });
      }
    },
    // 获取chartRank表格数据
    showChartChild(startTime, endTime) {
      this.dialogLoading = true;
	  console.log(this.$store.state.common.select_parentSkuMain)
      var opts = {
        startTime: startTime || this.DateMsg.DateValue[0],
        endTime: endTime || this.DateMsg.DateValue[1],
        sellerId: this.sellerId,
        siteId: this.siteId,
        statType: this.value2,
        parentSkus: this.$store.state.common.select_parentSkuMain && this.$store.state.common.select_parentSkuMain.length ? this.$store.state.common.select_parentSkuMain : this.$store.state.common.parentSkusAll,
		skus : this.$store.state.common.select_childSku && this.$store.state.common.select_childSku.length ? this.$store.state.common.select_childSku : this.$store.state.common.childSkusAll
      };
	  let PAr = this.$store.state.common.select_parentSkuMain
	  let CHi = this.$store.state.common.select_childSku
	  if( (PAr && PAr.length) || (CHi && CHi.length) ){
		  if(CHi && CHi.length) opts.parentSkus = null
		  if( (PAr && PAr.length) && !(CHi && CHi.length) ) opts.skus = null
	  }
      this.$api["SalesShopDayListForParentSku"](opts)
        .then(data => {
          // console.log("历史排名返回", res);
          let code = data.code;
          if (code == 0) {
            let list;
            if (this.value2 == 1) {
              list = data.data.listTotal1;
            } else if (this.value2 == 2) {
              list = data.data.listTotal2;
            } else if (this.value2 == 3) {
              list = data.data.listTotal3;
            } else if (this.value2 == 4) {
              list = data.data.listTotal4;
            } else if (this.value2 == 5) {
              list = data.data.listTotal5;
            }
            // console.log(this.$refs);
            // this.$refs.Table1.clearSort();
            if (data.data == "") {
              this.list = null;
              this.chartData.chartShow = false;
              this.dialogLoading = false;
              return;
            }
            this.$nextTick(() => {
              this.chartData.chartShow = true;
              this.list = data.data;
              let l2 = this.list.listTotal2;
              let l2_ = [];
              l2.forEach(el => {
                l2_.push({
                  statTime: el.statTime
                });
              });
              l2.forEach(el => {
                let index = l2_.findIndex(i => {
                  return el.statTime === i.statTime;
                });
                // console.log(index,'index')
                if (index !== undefined) {
                  el.list.forEach(j => {
                    l2_[index]["orderCnt_" + j.statTime] = j.orderCnt;
                    l2_[index]["proportion_" + j.statTime] = j.proportion;
                  });
                }
              });
              this.list.listTotal2_copy = l2_;
              // console.log(l2_, "l2_");
              // console.log(this.list, "List");
              let dom = document.getElementById("ChartRank2");
              // 画图
              //   console.log(list, "list");
              this.drawEchart(dom, list);
              // 饼状图
              let dom3 = document.getElementById("ChartRank3");
              this.drawEchart3(dom3, data.data.listParentSku);
              // 柱状图
              let dom4 = document.getElementById("ChartRank4");
              this.drawEchart4(dom4, data.data.listParentSku);
            });
          } else if (code == 500) {
            this.chartData.chartShow = false;
          }
          this.dialogLoading = false;
        })
        .catch(err => {
          this.dialogLoading = false;
        });
    },
    changeTime(val) {
      if (!val) {
        this.showChartChild();
        return;
      }
      // 有日期则往下走
      let startTime = this.DateMsg.DateValue[0],
        endTime = this.DateMsg.DateValue[1];
      this.showChartChild(startTime, endTime);
    },
    change() {
      this.showChartChild();
    },
    //获取子组件传来按日按周按月
    getDayFromChild(childMsg) {
      this.value = childMsg;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },
    //图1
    drawEchart(dom, list) {
      this.dialogLoading = true;
      let et = echarts.init(dom);
      et.clear();
      let option = mock.ts1_2;
      option.title = {
        text: "销量报表",
        textStyle: {
          fontSize: "14px",
          color: "#909399"
        }
      };
      option.yAxis.inverse = false;
      option.yAxis.min = 0;
	  if(this.value2 != 3){
		  option.tooltip.formatter = function(params) {
				let value1 = params[0].value !== null ? params[0].value : "--";
		  		let value2 = params[1].value !== null ? params[1].value : "--";
		  		let value3 = params[2].value !== null ? params[2].value : "--";
		    let str = `时间段 ：  ${params[0].axisValueLabel}</br>`;
				str += `${params[0].seriesName} : ${value1}<br />`;
		  		str += `${params[1].seriesName} : ${value2}<br />`;
		  		str += `${params[2].seriesName} : ${value3}<br />`;
		    return str;
		  };
	  }else{
		  option.tooltip.formatter = function(params) {
		    let value1 = params[0].value !== null ? params[0].value : "--";
		    let str = `时间段 ：  ${params[0].axisValueLabel}</br>`;
		    str += `${params[0].seriesName} : ${value1}<br />`;
		    return str;
		  };
	  }
      
      if (this.value2 == 2) {
        option.tooltip.formatter = function(params) {
          // console.log(params, "formatter");
          let str = "时间段 ： " + params[0].axisValueLabel + "时</br>";
          params.forEach(el => {
            str += `${el.seriesName} ——`;
            str += `订单数 : ${el.data}<br />`;
          });
          return str;
        };
      }
      // console.log(list, "排名数据");
      //legend
      // option.legend.data = ["订单数"];
      // legend 不可点击
      // option.legend.selectedMode = false;
      if (!list) {
        this.chartData.chartShow = false;
        this.dialogLoading = false;
        return;
      } else {
        this.chartData.chartShow = true;
      }
      if (this.value2 == 2) {
        option.legend.data = [];
        var datas = [];
        list[0].list.forEach(el => {
          datas.push({
            name: el.statTime,
            data: []
          });
        });
        list.forEach((el, index) => {
          el.list.forEach((val, key) => {
            let item = datas.find(i => {
              return i.name === val.statTime;
            });
            if (item) {
              datas[key].data.push(val.orderCnt);
            }
          });
        });
        // console.log(datas, "datas");
        var xArr = [];
        list.forEach(el => {
          xArr.push(el.statTime);
        });
        list[0].list.forEach(el => {
          option.legend.data.push(el.statTime);
        });
        option.legend.selectedMode = true;
        option.series = [];
        datas.forEach(el => {
          option.series.push({
            name: el.name,
            type: "line",
            data: el.data
          });
        });
        // console.log(option, "option");
        // 最大值处理
        let max_arr = [];
        datas.forEach(el => {
          max_arr.push(...el.data);
        });
        var max = Math.max(...max_arr);
        option.yAxis.max = this.cfuns.getBigNum(max);
      } else if(this.value2 == 3){
		 option.series = [];
		 var xArr = [];
		 var arr = [];
		 let showArr = [{ name: '订单量', type: 'line', data: [] }]
		 list.forEach((item, index) => {
		   xArr.push(item.statTime);
		   showArr[0].data.push(item.orderCnt);
		 });
		 var max = Math.max(...arr);
		 option.yAxis.max = this.cfuns.getBigNum(max);
		 option.yAxis = {
		 	type:'value'
		 }
		 option.legend.data = ['订单量'];
		 option.series = [];
		 option.series = showArr 
	  }else {
        option.series = [];
        // console.log(list);
        // valueArr 用于计算最大值的集合
        var xArr = [];
        var arr = [];
		let showArr = [{ name: '订单量', type: 'line', data: [] },{ name: '访客数',  type: 'line', data: [] },{ name: '转化率', type: 'line', data: [] },]
        list.forEach((item, index) => {
          xArr.push(item.statTime);
          showArr[0].data.push(item.orderCnt);
		  showArr[1].data.push(item.sessions);
		  showArr[2].data.push(item.conversionRate);
        });
        var max = Math.max(...arr);
        option.yAxis.max = this.cfuns.getBigNum(max);
		option.yAxis = {
			type:'value'
		}
		option.legend.data = ['订单量','访客数','转化率'];
        option.series = [];
        option.series = showArr
      }
      if (option.series == "") {
        this.chartData.chartShow = false;
      } else {
        this.chartData.chartShow = true;
      }
      option.xAxis.type = "category";
      option.xAxis.data = xArr;
	  option.dataZoom=[
	      {
	          type: 'slider',
	          show: true,
	          showDetail:false,
	          handleIcon:"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
			  handleSize: "80%",
			  handleStyle: {
			    color: "#fff",
			    shadowBlur: 3,
			    shadowColor: "rgba(0, 0, 0, 0.6)",
			    shadowOffsetX: 2,
			    shadowOffsetY: 2
			  }
	      },
	  ]
	  
	  option.toolbox = {
		  top: '-50px',
          feature: {
            dataZoom:{
              yAxisIndex:"none"   //不启用y轴的选中
            }
          }
	  }
	  
      if (xArr.length > 7) {
        option.xAxis.axisLabel.rotate = 45;
      } else {
        option.xAxis.axisLabel.rotate = 0;
      }
      // delete option.dataZoom;
      this.echartData = option;
	  setTimeout(() => {
          et.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'dataZoomSelect',
            // 启动或关闭
            dataZoomSelectActive: true
          });
      });
      this.dialogLoading = false;
    },
    // 饼状图
    drawEchart3(dom, list) {
      let et = echarts.init(dom);
      et.clear();
      let option = mock.ts1_3;
      option.title = {
        text: "销量占比(此处不展示占比约为0%的数据)",
        textStyle: {
          fontSize: "14px",
          color: "#909399"
        }
      };
      option.tooltip.formatter = function(val) {
        // console.log(val);
        let percent = val.percent.toFixed(2) + "%";
        return `${val.seriesName}</br>${val.name}: ${
          val.data.value
        }(${percent})`;
      };
      // console.log(list, "排名数据");
      //legend
      option.legend.data = [];
      option.legend.left = "30%";
      // legend 不可点击
      if (!list) {
        this.chartData.chartShow3Text = "暂无数据";
        this.chartData.chartShow3 = false;
        return;
      } else {
        this.chartData.chartShow3 = true;
      }
      // console.log(list);
      option.series = [
        {
          name: "销量占比",
          type: "pie",
          radius: ["0%", "60%"],
          avoidLabelOverlap: true,
          labelLine: {
            normal: {
              lineStyle: {},
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {},
          data: []
        }
      ];
      // console.log(list, "list");
      list = _sortBy(list, 'orderCnt')
      list = _reverse(list)
      list.forEach((item, index) => {
        let parentSku = item.parentSku;
        if (item.proportion >= 0.01) {
          option.legend.data.push(parentSku); // legend
          // option.color.push(item.color); // legend
          option.series[0].data.push({
            // 使用直接push改变原来的数组对象
            value: item.orderCnt,
            name: parentSku
          }); // series 中的data
        }
      });
      if (option.series[0].data == "") {
        this.chartData.chartShow3 = false;
        this.chartData.chartShow3Text = "所有数据都为0，不显示图标";
      } else {
        this.chartData.chartShow3 = true;
      }
      this.echartData3 = option;
    },
    drawEchart4(dom, list) {
      let et = echarts.init(dom);
      // console.log(list, "list");
      et.clear();
      if (!list) {
        this.chartData.chartShow4 = false;
        return;
      } else {
        this.chartData.chartShow4 = true;
      }
      // 横坐标
      let dataAxis = [];
      // 纵坐标
      let data = [];
      list = _sortBy(list, 'orderCnt')
      list = _reverse(list)
      list.forEach((item, index) => {
        dataAxis.push(item.parentSku);
        data.push(item.orderCnt);
      });
      // 设置一下表格首次能看到几个数是
      let length = dataAxis.length;
      let start, end;
      if (length <= 15) {
        start = 0;
        end = 100;
      }
      if (length > 15 && length <= 30) {
        start = 0;
        end = 50;
      }
      if (length > 30 && length <= 50) {
        start = 0;
        end = 40;
      }
      if (length > 50) {
        start = 0;
        end = 30;
      }
      if (length > 100) {
        start = 0;
        end = 10;
      }
      let rotate;
      if (dataAxis.length < 5) {
        rotate = 0;
      }
      if (dataAxis.length >= 5) {
        rotate = 45;
      }
      let option = {
        title: {
          // text: "评分/评价数（提示：鼠标滑轮缩放,可左右拖拽）"
          // subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
        },
        xAxis: {
          zlevel:0,
          data: dataAxis,
          position: "bottom",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#999"
            },
            interval: 0, //,    // {number}
            rotate: rotate
          },
          // z: 10
        },
        toolbox: {
          feature: {}
        },
        grid: {
          top: "16%",
          left: "3%",
          right: "3%",
          bottom: 200
          // containLabel: true
        },
        yAxis: {
          name: "订单数",
          nameTextStyle: {
            fontSize: "13px",
            color: "#909399"
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        toolbox:{
          top: '-50px',
          feature: {
            dataZoom:{
              yAxisIndex:"none"   //不启用y轴的选中
            }
          }
        },
        dataZoom: [
          {
            type: "inside",
            // start: 0,
            realtime: true,
            zoomOnMouseWheel: false,
            start: 0,
            end: 14,
            zlevel: 2
          },
          {
            
            zlevel: 2,
            start: 0,
            end: end,
            minValueSpan: 0,
            maxValueSpan: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            barWidth: 20, //柱图宽度,
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0.05)"
              }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            animation: false
          },
          {
            type: "bar",
            barWidth: 20, //柱图宽度,
            itemStyle: {
              normal: {
                color: "#32CDD5",
                label: { show: true, position: "inside" }
              }
            },
            data: data
          }
        ]
      };
      option.title = {
        text: "销量占比",
        textStyle: {
          fontSize: "14px",
          color: "#909399"
        }
      };
      // console.log(list, "排名数据");
      // legend 不可点击
      if (length < 5) {
        delete option.dataZoom;
      }
      if (option.series == "") {
        this.chartData.chartShow4 = false;
      } else {
        this.chartData.chartShow4 = true;
      }
      this.echartData4 = option;
      setTimeout(() => {
          et.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'dataZoomSelect',
            // 启动或关闭
            dataZoomSelectActive: true
          });
      });
      
      // console.log(this.echartData4);
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.chartRank {
  border: 1px solid transparent;
  box-sizing: border-box;
  width: 100%;
  header {
    height: 31px;
    line-height: 40px;
    width: 100%;
    background: #f5f7fa;
    .title {
      font-size: 12px;
      color: #909399;
      margin-left: 15px;
      line-height: 33px;
    }
  }
}
// 选择新平，新品新增评价
.choose {
  margin-top: 8px;
  font-size: 14px;
  .button {
    display: inline-block;
    padding: 5px 14px;
    border: 1px solid #00c0de;
    text-align: center;
    color: #00c0de;
    border-radius: 5px;
    margin-left: 3px;
    cursor: pointer;
  }
  .active {
    background: #00c0de !important;
    color: #fafafa !important;
  }
}
</style>
