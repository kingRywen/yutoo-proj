<!-- 评价数表格 -->
<template>
  <div class="chartRank" v-loading="dialogLoading">
    <header style="position:relative">
      <div style="position:absolute;left:0px;top:-3px;">
        <el-select :popper-append-to-body="false" v-model="propsValue" style="width:100px;margin-left:0px;position:relative;top:-1px;" size='mini' @change="showChartChild">
          <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select :popper-append-to-body="false" v-model="propsValue2" style="width:100px;margin-left:0px;position:relative;top:-1px;" size='mini' @change="draw">
          <el-option v-for="item in Options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker :picker-options="cfuns.onlyOneYear" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" @change="showChartChild" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" @close="closeClear" :clearable="false" size="mini">
        </el-date-picker>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <none-page v-if="!chartData.chartShow" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow">
        <echart auto-resize :options="echartData" id="ChartRank" style="width:100%; height:300px"></echart>
      </div>
    </main>
  </div>
</template>

<script>
import Clipboard from "clipboard";
let echarts = require("echarts/lib/echarts");
// console.log(echarts, "echarts");
import mock from "@/api/json.js";
export default {
  name: "chartRank",
  props: ["chartData"],
  data() {
    return {
      propsValue: 1,
      propsValue2: 1,
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
      Options: [
        {
          value: 1,
          label: "销售额"
        },
        {
          value: 2,
          label: "订单量"
        },
        {
          value: 3,
          label: "花费"
        }
      ],
      echartData: {},
      value: "1",
      DateMsg: {
        DateValue: [this.cfuns.getDay().today, this.cfuns.getDay().today],
        // DateValue: [this.chartData.date[0], this.chartData.date[1]],
        width: "240px",
        type: "daterange"
      },
      dialogLoading: false,
      Loading: false, //
      list: null,
      chartData: {
        chartShow: false
      }
    };
  },
  created() {},
  mounted() {
    // this.DateMsg.DateValue = [
    //   this.chartData.monitorFrom,
    //   this.chartData.monitorTo
    // ];
  },
  methods: {
    // 获取chartRank表格数据
    showChartChild() {
      this.dialogLoading = true;
      let opts = {
        keywordId: this.chartData.keywordId,
        period: this.propsValue,
        taskId: this.chartData.taskId,
        startTime: this.DateMsg.DateValue[0],
        endTime: this.DateMsg.DateValue[1]
      };
      //   if (startTime) {
      //     opts.startTime = startTime;
      //   }
      //   if (endTime) {
      //     opts.endTime = endTime;
      //   }
      this.$api[this.chartData.url](opts)
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
              // 画关键词图
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
          //   console.log("历史排名报错");
          this.chartData.chartShow = false;
          this.dialogLoading = false;
        });
    },
    draw() {
      let dom = document.getElementById("ChartRank");
      // 画关键词图
      // console.log(list, "list");
      this.drawEchart(dom, this.list, this.propsValue2);
    },
    //画关键词图
    drawEchart(dom, list, type) {
      let vm = this
      let option = {
        title: {
          //   text: "世界人口总量",
          //   subtext: "数据来自网络"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter(params) {
            return vm.$.getChartTooltip(params)
          }
        },
        legend: {
          data: ["2011年", "2012年"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "0%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: ["巴西", "印尼", "美国", "印度", "中国", "世界人口(万)"]
        },
        series: [
          {
            name: "2011年",
            type: "bar",
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name: "2012年",
            type: "bar",
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      };
      console.log(list, "list");
      option.legend.data = [
        list[list.length - 2].statTime,
        list[list.length - 1].statTime
      ];
      option.yAxis.data = [""];
      let data1, data2;
      if (!type || type == 1) {
        // 默认销售额
        data1 = list[list.length - 2].attrSales30dSameSkuAfter;
        data2 = list[list.length - 1].attrSales30dSameSkuAfter;
      } else if (type == 2) {
        // 订单量
        data1 = list[list.length - 2].attrSales30dAfter;
        data2 = list[list.length - 1].attrSales30dAfter;
      } else if (type == 3) {
        // 花费
        data1 = list[list.length - 2].dailyBudgetAfter;
        data2 = list[list.length - 1].dailyBudgetAfter;
      }
      option.series = [
        {
          name: "优化前",
          type: "bar",
          barWidth: 40, //柱图宽度,
          data: [data1]
        },
        {
          name: "优化后",
          type: "bar",
          barWidth: 40, //柱图宽度,

          data: [data2]
        }
      ];
      this.echartData = option;
    },
    closeClear() {
      let dom = document.getElementById("ChartRank");
      let et = echarts.init(dom);
      et.clear();
      this.chartData.chartShow = false;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },
    // 关闭弹窗时清空日期
    clearDate() {
      this.DateMsg.DateValue = [
        this.cfuns.getDay().today,
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
  width: 96%;
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
</style>
