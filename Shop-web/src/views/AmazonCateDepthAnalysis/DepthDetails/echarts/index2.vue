<!-- 评价数表格 -->
<template>
  <div class="chartRank" v-loading="dialogLoading">
    <header style="position:relative">
      <div style="position:absolute;left:0px;top:-3px;">
        <el-date-picker :picker-options="cfuns.onlyTwoYear" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" @change="changeTime" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" @close="closeClear" :clearable="false" size="mini">
        </el-date-picker>
      </div>
      <div style="position:absolute;left:230px;top:-4px;">
        <el-select :popper-append-to-body="false" v-model="value2" style="width:80px;margin-left:10px;" @change="change" size="mini">
          <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <none-page v-if="!chartData.chartShow" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow">
        <echart auto-resize :options="echartData" id="ChartRank" :class="sizeClass"></echart>
      </div>
    </main>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
// console.log(echarts, "echarts");
import mock from "@/api/json.js";
import dayjs from 'dayjs';
export default {
  name: "chartRank",
  props: ["chartData"],
  data() {
    return {
      echartData: {},
      value: "1",
	  sizeClass:'smallSize',
      DateMsg: {
        DateValue: [
          dayjs().subtract(6,'month').format('YYYY-MM-DD'),
          this.cfuns.getDay().today
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
      value2: 1,
      dialogLoading: false,
      Loading: false, //
      list: null
    };
  },
  created() {},
  mounted() {},
  methods: {
	  changeClass(val){
	  		  if(val){
	  			  this.$set(this,'sizeClass','bigSize')
	  		  }else{
	  			  this.$set(this,'sizeClass','smallSize')
	  		  }		  
	  },
    // 获取chartRank表格数据
    showChartChild(parentAsin, startTime, endTime) {
      this.dialogLoading = true;
      let opts = {
        taskId: +this.$route.query.taskId,
        parentAsins: this.chartData.parentAsin,
        period: this.value2 || this.chartData.period,
        startTime: startTime || this.DateMsg.DateValue[0],
        endTime: endTime || this.DateMsg.DateValue[1],
        siteId: +this.siteId
      };
      this.$api["TaskCateDepthAnalysisSouqListToNewReviewCnByProductAmazon"](
        opts
      )
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
              let dom = document.getElementById("ChartRank");
              // 画图
              this.list = data.data;
              // console.log(list, "list");
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
        this.showChartChild(this.chartData.parentAsin);
        return;
      }
      // 有日期则往下走
      let startTime = this.DateMsg.DateValue[0],
        endTime = this.DateMsg.DateValue[1];
      this.showChartChild(this.chartData.parentAsin, startTime, endTime);
    },
    change() {
      this.showChartChild(this.chartData.parentAsin);
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
      let option = mock.rankData;
      option.yAxis.inverse = false;
      option.yAxis.min = 0;
      option.tooltip.formatter = function(params) {
        params = params.filter(
              el =>
                !(
                  el.data == 0 ||
                  el.data === '' ||
                  el.data == null ||
                  isNaN(el.data)
                )
            )
            if (!params.length) {
              return
            }
        // console.log(params, "formatter");
        let value = params[0].value !== null ? params[0].value : "--";
        let str = `日期 ：  ${params[0].axisValueLabel}</br>`;
        str += `${params[0].seriesName} : ${value}<br />`;
        return str;
      };
      // console.log(list, "排名数据");
      //legend
      option.legend.data = [];
      // legend 不可点击
      option.legend.selectedMode = false;
      option.grid.top = "12%";
			option.dataZoom=[
			    {
			        type: 'slider',
			        show: true,
			        showDetail:false,
			            handleIcon:
			"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
			    },
			]
      if (!list) {
        this.chartData.chartShow = false;
        this.dialogLoading = false;
        return;
      } else {
        this.chartData.chartShow = true;
      }
      list.forEach(item => {
        if (item.list != "") {
          option.legend.data.push(item.keyword);
        }
      });
      option.series = [];
      // console.log(list);
      // valueArr 用于计算最大值的集合
      let xArr = [];
      let arr = [];
      list.forEach((item, index) => {
        xArr.push(item.statTime);
        arr.push(item.cnt);
      });
      let max = Math.max(...arr);
      option.yAxis.max = this.cfuns.getBigNum(max);
      option.series = [];
      option.series = {
        name: "新增review数",
        type: "line",
        data: arr
      };
      if (option.series == "") {
        this.chartData.chartShow = false;
      } else {
        this.chartData.chartShow = true;
      }
      option.xAxis.type = "category";
      option.xAxis.data = xArr;
      this.echartData = option;
      this.dialogLoading = false;
    },
    closeClear() {
      let dom = document.getElementById("ChartRank");
      let et = echarts.init(dom);
      et.clear();
      this.chartData.chartShow = false;
    },
    // 关闭弹窗时清空日期
    clearDate() {
      this.DateMsg.DateValue = [
        dayjs().subtract(6,'month').format('YYYY-MM-DD'),
        this.cfuns.getDay().today
      ];
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
  overflow: hidden;
  header {
    height: 31px;
    line-height: 40px;
    width: 100%;
    background: #f5f7fa;
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
.smallSize{
	width:100%; height:300px
}
.bigSize{
	width:100%; height:700px
}
</style>
