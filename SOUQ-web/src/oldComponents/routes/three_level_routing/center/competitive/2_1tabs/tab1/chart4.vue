<!-- 评价数表格 -->
<template>
  <div class="chart4" v-loading="Loading">
    <!-- 日期：{{this.DateMsg}} -->
    <!-- </br> -->
    <!-- 设置多少天的算新品{{this.newArrivalDay}} -->
    <header style="position:relative">
      <span>总数量</span>
      <div style="position:absolute;right:20px;top:-1px;">
        <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;height: 438px;">
      <div>
        <p v-if="!chartShow">暂无数据</p>
        <div v-if="chartShow" id="chart4" style="width:100%; height:440px"></div>
      </div>
    </main>
  </div>
</template>

<script>
import selectDay from "@/components/common/com_shop_check/selectDay";
import dateRange from "@/components/common/datePick";
import { getDay } from "@/api/functions.js";
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入组件
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
require("echarts/lib/component/legend");
require("echarts/lib/chart/lines");
require("echarts/lib/chart/pie");
require("echarts/lib/component/grid");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/timeline");
require("echarts/lib/component/toolbox");
import {
  shopDefaultDay,
  ShoPproductTotalList
} from "../../../../../../../api/myApi";
export default {
  name: "chart4",
  components: { selectDay, dateRange },
  props: {
    taskStatus: {}
  },
  data() {
    return {
      DateMsg: {
        DateValue: "",
        type: "daterange"
      },
      chartShow: true,
      Loading: false //
    };
  },
  created() {},
  mounted() {
    this.getShoPproductTotalList(shopDefaultDay, null, null);
  },
  methods: {
    //获取子组件传来的日期
    getChildDate(msg) {
      thit.DateMsg.DateValue = msg;
    },

    // 获取chart4表格数据
    getShoPproductTotalList(day, startTime, endTime) {
      this.Loading = !this.Loading; // loading动画
      this.$axios
        .get(ShoPproductTotalList, {
          params: {
            sellerId: this.$route.query.sellerId,
            category: this.category != "" ? this.category : "",
            startTime: startTime || getDay(day).computedDay,
            endTime: endTime || getDay().today,
            monitorTo: this.taskStatus.monitorTo.slice(0, 10)
          }
        })
        .then(res => {
          console.log("总数量", res);
          let list = res.data.data;
          // if (list == "") {
          //   setTimeout(() => {
          //     this.Loading = !this.Loading; // loading动画
          //   }, 300); // loading动画
          //   return;
          // }
          this.drawChart(list);
        })
        .catch(err => {
          console.log("chart4有错", err);
          this.Loading = !this.Loading; // loading动画
        });
    },
    drawChart(list) {
      // this.echart.isScoreCountShowLoading = false;
      let myChart = echarts.init(document.getElementById("chart4"));
      myChart.clear();
      let dataAxis = [],
        data = [];
      list.forEach((item, index) => {
        dataAxis.push(item.statTime.slice(0, 10));
        data.push(item.productCnt);
      });
      //
      let rotate;
      if (dataAxis.length < 13) {
        rotate = 0;
      }
      if (dataAxis.length >= 13) {
        rotate = 45;
      }
      let option = {
        title: {
          text: ""
          // subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
        },
        xAxis: {
          data: dataAxis,
          name: "时间",
          position: "bottom",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0, //,    // {number}
            rotate: rotate
            // margin: 8
            // formatter: function(value) {
            //   if (dataAxis.length > 9) {
            //     return value.split("").join("\n");
            //   }
            //   return value;
            // }
          },
          z: 10
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "12%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {},
            restore: {}
          }
        },
        yAxis: {
          name: "数量",
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
        dataZoom: [
          {
            show: true,
            realtime: true,
            startValue: 0,
            // 结束位置的数值
            endValue: 12
          },
          {
            type: "inside",
            show: true,
            xAxisIndex: [0],
            startValue: 0,
            // 结束位置的数值
            endValue: 12
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            barWidth: 30, //柱图宽度,
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
            barWidth: 30, //柱图宽度,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ]),
                label: { show: true, position: "top" }
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: data
          }
        ]
      };
      // Enable data zoom when user click bar.
      var zoomSize = 6;
      myChart.on("click", function(params) {
        // console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        myChart.dispatchAction({
          type: "dataZoom",
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
            dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        });
      });
      //
      myChart.setOption(option);
      setTimeout(() => {
        this.Loading = !this.Loading; // loading动画
      }, 300);
    }
  },
  computed: {
    newArrivalDay() {
      return this.$store.state.competitive.newProDay;
    },
    category() {
      return this.$store.state.competitive.categoryChange;
    }
  },
  watch: {
    // 监控日期组件
    "DateMsg.DateValue"(newVal, oldVal) {
      if (!newVal) {
        // 去掉日期的时候恢复默认
        this.getShoPproductTotalList(shopDefaultDay, null, null);
        return;
      }
      let startTime = newVal[0],
        endTime = newVal[1];
      this.getShoPproductTotalList(null, startTime, endTime);
    },
    category() {
      this.getShoPproductTotalList(shopDefaultDay, null, null);
    }
  }
};
</script>

<style lang='scss' scoped>
.chart4 {
  border: 1px solid transparent;
  box-sizing: border-box;
  width: 96%;
  overflow: hidden;
  header {
    height: 40px;
    line-height: 40px;
    width: 100%;
    background: #f2f2f2;
    padding-left: 20px;
  }
}
</style>
