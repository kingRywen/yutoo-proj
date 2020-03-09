<!-- 评价数表格 -->
<template>
  <div class="chartRank" v-loading="dialogLoading">
    <header style="position:relative">
      <!-- <div class="title">
                整店销量报表
            </div> -->
      <div style="position:absolute;right:0px;top:-3px;">
        <el-date-picker :picker-options="cfuns.pacPickerOptions" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" @change="changeTime" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" size="mini">
        </el-date-picker>
      </div>
      <div style="position:absolute;right:240px;top:-4px;">
        <el-select :popper-append-to-body="false" v-model="value2" style="width:80px;margin-left:10px;" @change="change" size="mini">
          <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;position: relative;">
	  
	  <el-button  v-show="chartData.chartShow" class="export-btn" type="text" icon="el-icon-download" style="position:absolute;right:50px;top:0px;" :loading="$store.state.isloading || $store.state.loading" @click="downloadExel"></el-button>
      <none-page v-if="!chartData.chartShow" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow">
        <echart auto-resize :options="echartData" id="ChartRank1" style="width:100%; height:300px"></echart>
      </div>
    </main>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
import dayjs from 'dayjs';
// console.log(echarts, "echarts");
import mock from "@/api/json.js";
import { downloadFile } from 'Utils/tools';
export default {
  name: "chartRank",
  data() {
    return {
      chartData: {
        chartShow: false
      },
      echartData: {},
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
          label: "按日"
        },
        {
          value: 7,
          label: "按周"
        },
        {
          value: 30,
          label: "按月"
        }
      ],
      value2: 30,
      dialogLoading: false,
      Loading: false, //
      list: null
    };
  },
  created() {},
  mounted() {},
  methods: {
	downloadExel(){
		let params = {
			sellerId:this.sellerId,
			siteId:this.siteId,
			startTime:this.DateMsg.DateValue[0],
			endTime:this.DateMsg.DateValue[1],
			period: this.value2,
		}
		this.$api['salesShopDayListExport'](params)
		  .then(data => {
		    downloadFile(data, '整店销量报表')
		  })
		  .catch(() => {})
	},
    // 获取chartRank表格数据
    showChartChild(startTime, endTime) {
      this.dialogLoading = true;
      let opts = {
        startTime: startTime || this.DateMsg.DateValue[0],
        endTime: endTime || this.DateMsg.DateValue[1],
        period: this.value2,
        sellerId: this.sellerId,
        siteId: this.siteId
      };
      this.$api["SalesShopDayList"](opts)
        .then(data => {
          // console.log("历史排名返回", res);
          let code = data.code;
          if (code == 0) {
            let list = data.data;
            if (list == "") {
              this.list = null;
              this.chartData.chartShow = false;
              this.dialogLoading = false;
              return;
            }
            this.$nextTick(() => {
              this.chartData.chartShow = true;
              let dom = document.getElementById("ChartRank1");
              // 画图
              this.list = data.data;
              //   console.log(list, "list");
              this.drawEchart(dom, list);
            });
          } else if (code == 500) {
            this.chartData.chartShow = false;
          }
          this.dialogLoading = false;
        })
        .catch(err => {
          this.chartData.chartShow = false;
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
    //画关键词图
    drawEchart(dom, list) {
      this.dialogLoading = true;
      let et = echarts.init(dom);
      et.clear();
      let option = mock.ts1_1;
      option.title = {
        text: "整店销量报表",
        textStyle: {
          fontSize: "14px",
          color: "#909399"
        }
      };
      option.yAxis.inverse = false;
      option.yAxis.min = 0;
      option.tooltip.formatter = function(params) {
        // console.log(params, "formatter");
        let value = params[0].value !== null ? params[0].value : "--";
        let str = `日期 ：  ${params[0].axisValueLabel}</br>`;
        str += `${params[0].seriesName} : ${value}<br />`;
        return str;
      };
      // console.log(list, "排名数据");
      //legend
      option.legend.data = ["订单数"];
      // legend 不可点击
      option.legend.selectedMode = false;
      option.grid.top = "16%";
      if (!list) {
        this.chartData.chartShow = false;
        this.dialogLoading = false;
        return;
      } else {
        this.chartData.chartShow = true;
      }
      option.series = [];
      // console.log(list);
      // valueArr 用于计算最大值的集合
      let xArr = [];
      let arr = [];
      list.forEach((item, index) => {
        xArr.push(item.statTime);
        arr.push(item.orderCnt);
      });
      let max = Math.max(...arr);
      option.yAxis.max = this.cfuns.getBigNum(max);
      option.series = [];
      option.series = {
        name: "订单数",
        type: "line",
        data: arr
      };
	  
	  option.toolbox = {
		  top: '-50px',
          feature: {
            dataZoom:{
              yAxisIndex:"none"   //不启用y轴的选中
            }
          }
	  }
	  
      if (option.series == "") {
        this.chartData.chartShow = false;
      } else {
        this.chartData.chartShow = true;
      }
      option.xAxis.type = "category";
      option.xAxis.data = xArr;
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
