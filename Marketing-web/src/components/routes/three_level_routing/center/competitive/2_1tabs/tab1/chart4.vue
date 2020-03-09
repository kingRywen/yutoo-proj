<!-- 评价数表格 -->
<template>
  <div class="chart4" v-loading="Loading">
    <!-- 日期：{{this.DateMsg}} -->
    <!-- </br> -->
    <!-- 设置多少天的算新品{{this.newArrivalDay}} -->
    <header style="position:relative">
      <span>总数量</span>
      <el-tooltip class="item" effect="dark" content="店铺每日产品总数量" placement="right-end">
        <i class="iconfont icon-wenhao1"></i>
      </el-tooltip>
      <div style="position:absolute;right:20px;top:0px;">
        <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <div>
        <!-- <p v-if="!chartShow">暂无数据</p> -->
        <none-page v-show="!this.chartShow" noBack Height="399px">暂无数据</none-page>
        <div class="export" @click="downloadExl">
          <i class="el-icon-download"></i>
        </div>
        <echart auto-resize :options="echartData" v-show="this.chartShow" id="chart4" style="width:100%; height:360px;margin-top:39px;"></echart>
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
// // 引入组件
// require("echarts/lib/chart/line");
// require("echarts/lib/chart/bar");
// require("echarts/lib/component/legend");
// require("echarts/lib/chart/lines");
// require("echarts/lib/chart/pie");
// require("echarts/lib/component/grid");
// require("echarts/lib/component/tooltip");
// require("echarts/lib/component/title");
// require("echarts/lib/component/dataZoom");
// require("echarts/lib/component/timeline");
// require("echarts/lib/component/toolbox");
import { shopDefaultDay, ShoPproductTotalList } from "@/api/myApi";
export default {
  name: "chart4",
  components: { selectDay, dateRange },
  props: {
    taskStatus: {},
    category: ""
  },
  data() {
    return {
      echartData: {},
      DateMsg: {
        DateValue: [getDay(shopDefaultDay).computedDay, getDay().today],
        width: "240px",
        type: "daterange"
      },
      chartShow: "",
      chartData: "",
      list: "",
      Loading: false //
    };
  },
  created() {},
  mounted() {
    this.getShoPproductTotalList(shopDefaultDay, null, null);
    let _this = this;
    try {
      window.addEventListener("resize", () => {
        _this.drawChart(this.list);
      });
    } catch (err) {}
  },
  methods: {
    downloadExl() {
      let data = [];
      this.list.forEach(element => {
        data.push({
          时间: element.statTime,
          数量: element.productCnt
        });
      });
      data = JSON.parse(JSON.stringify(data));
      let name = this.$route.query.sellerId + "的总数量.xlsx";
      this.$store.commit("common/downName", name);
      this.$nextTick(() => {
        this.$.downloadExlShop(data, null, this.$route.query.sellerId);
      });
      // this.$.downloadExl(data, "总数量");
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },

    // 获取chart4表格数据
    getShoPproductTotalList(day, startTime, endTime) {
      this.Loading = true; // loading动画
      this.$axios
        .post(ShoPproductTotalList, {
          sellerId: this.$route.query.sellerId,
          category: this.category != "" ? this.category : "",
          startTime: startTime || getDay(day).computedDay,
          endTime: endTime || getDay().today,
          taskType: 1,
          taskId: parseInt(this.$route.query.taskId)
          // monitorTo: this.taskStatus.monitorTo
          //   ? this.taskStatus.monitorTo.slice(0, 10)
          //   : getDay().today
        })
        .then(res => {
          // console.log("总数量", res);
          let code = res.data.code;
          if (code === 0) {
            let list = res.data.data;
            this.list = list;
            if (list != "") {
              this.chartShow = true;
              this.drawChart(list);
            }
            if (list == "") {
              this.chartShow = false;
            }
          } else {
            this.chartShow = false;
          }
          this.Loading = false; // loading动画
          // this.chartShow = false; //
        })
        .catch(err => {
          // console.log("chart4有错", err);
          this.Loading = false; // loading动画
        });
    },
    drawChart(list) {
      // this.echart.isScoreCountShowLoading = false;
      try {
        let myChart = echarts.init(document.getElementById("chart4"));
        // myChart.clear();
        let dataAxis = [],
          data = [];
        try {
          list.forEach((item, index) => {
            dataAxis.push(item.statTime.slice(0, 10));
            data.push(item.productCnt);
          });
        } catch (err) {
          console.log("list.forEach");
        }
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
        //设置一下倾斜
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
            // name: "时间",
            position: "bottom",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              interval: 0, //,    // {number}
              rotate: rotate,
              textStyle: {
                color: "#999"
              }
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
            bottom: "15%",
            top: "11%",
            containLabel: true
          },
          toolbox: {
            feature: {
              // restore: {},
              // saveAsImage: { title: "保存" }
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
            minInterval: 1,
            axisLabel: {
              textStyle: {
                color: "#999"
              }
            }
          },
          dataZoom: [
            {
              type: "inside",
              start: 0,
              end: end
            },
            {
              start: 0,
              end: end,
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
              // itemStyle: {
              //   normal: {
              //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //       { offset: 0, color: "#83bff6" },
              //       { offset: 0.5, color: "#188df0" },
              //       { offset: 1, color: "#188df0" }
              //     ]),
              //     label: { show: true, position: "top" }
              //   },
              //   emphasis: {
              //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //       { offset: 0, color: "#2378f7" },
              //       { offset: 0.7, color: "#2378f7" },
              //       { offset: 1, color: "#83bff6" }
              //     ])
              //   }
              // },
              itemStyle: {
                normal: {
                  color: "#32CDD5",
                  label: { show: true, position: "top" }
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
              dataAxis[
                Math.min(params.dataIndex + zoomSize / 2, data.length - 1)
              ]
          });
        });
        //
        // myChart.setOption(option);
        if (length < 11) {
          delete option.dataZoom;
          option.grid.bottom = "6%";
        }
        if (length >= 6) {
          let canvas_width = document.body.clientWidth;
          // console.log(canvas_width);
          if (canvas_width <= 1474) {
            option.xAxis.axisLabel.rotate = 45;
          }
        }
        this.echartData = option;
        setTimeout(() => {
          this.Loading = false; // loading动画
        }, 300);
      } catch (err) {}
    }
  },
  computed: {},
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
    }
    // category() {
    //   this.getShoPproductTotalList(shopDefaultDay, null, null);
    // }
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
    height: 29px;
    line-height: 29px;
    width: 100%;
    background: #f2f2f2;
    padding-left: 20px;
  }
  .export {
    position: relative;
    top: 35px;
    left: 96.5%;
    z-index: 2000;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
}
</style>
