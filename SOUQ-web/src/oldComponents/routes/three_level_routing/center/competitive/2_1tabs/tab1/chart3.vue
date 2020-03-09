<!-- 评价数表格 -->
<template>
  <div class="chart3" v-loading="Loading">
    <!-- 按日： {{this.value}}
    </br>
    日期：{{this.DateMsg}}
    </br>
    新品，新品新增评价数：{{this.usefulIndex}}
    </br>
    设置多少天的算新品{{this.newArrivalDay}} -->
    <header style="position:relative">
      <span>上新情况</span>
      <div style="position:absolute;right:380px;top:-1px;" v-if="chartShow">
        <!-- 按日按周选择组件 -->
        <selectDay :dayOptions="dayOptions" :value="value" v-on:chart3-day="getDayFromChild"></selectDay>
        <!-- 选择开始和结束时间组件 -->
      </div>
      <div style="position:absolute;right:20px;top:-1px;">
        <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <div>
        <section class="choose" v-if="chartShow">
          <span>数据项：</span>
          <span class='button' :class="{'active' : item.isSelected2}" v-for="(item,i) in this.diagramList" :key="i" @click="changeDiagramBtnSelect(item,i)">{{item.name}}</span>
        </section>
        <p v-if="!chartShow">暂无数据</p>
        <div v-if="chartShow" id="Chart3" style="width:100%; height:400px"></div>
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
import { shopDefaultDay, ShopNewestList } from "../../../../../../../api/myApi";
export default {
  name: "chart3",
  components: { selectDay, dateRange },
  props: {
    taskStatus: {}
  },
  data() {
    return {
      usefulIndex: ["0", "1"],
      diagramList: [
        {
          name: "新品数",
          isSelected2: true,
          type: "0"
        },
        {
          name: "新品新增评价数",
          isSelected2: true,
          type: "1"
        }
      ],
      dayOptions: [
        {
          value: "1",
          label: "按日"
        },
        {
          value: "14",
          label: "按周"
        },
        {
          value: "30",
          label: "按月"
        }
      ],
      value: "1",
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
    this.getShopNewestList(shopDefaultDay, null, null, parseInt(this.value));
  },
  methods: {
    // 点击切换评论选择
    changeDiagramBtnSelect(item, i) {
      this.usefulIndex = [];
      if (this.diagramList[i].isSelected2 === true) {
        this.diagramList[i].isSelected2 = false;
        // 两处都要进行以下操作，因为有reture
        this.diagramList.forEach((item, index) => {
          if (item.isSelected2 === true) {
            this.usefulIndex.push(item.type);
          }
        });
        // console.log(usefulIndex);
        // let stateList = this.$store.state.competitive.IncrScoreCount; // 列表从vuex拿
        // if (stateList) {
        // this.contrIncrScoreCount(stateList, usefulIndex); // 画图
        // }
        return;
      }
      this.diagramList[i].isSelected2 = true;
      // 两处都要进行以下操作，因为有reture
      this.diagramList.forEach((item, index) => {
        if (item.isSelected2 === true) {
          this.usefulIndex.push(item.type);
        }
      });
      // console.log(usefulIndex);
      // let stateList = this.$store.state.competitive.IncrScoreCount; // 列表从vuex拿
      // if (stateList) {
      // this.contrIncrScoreCount(stateList, usefulIndex); // 画图
      // }
    },
    //获取子组件传来按日按周按月
    getDayFromChild(childMsg) {
      this.value = childMsg;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      thit.DateMsg.DateValue = msg;
    },

    // 获取chart3表格数据
    getShopNewestList(day, startTime, endTime, period) {
      this.Loading = !this.Loading; // loading动画
      this.$axios
        .get(ShopNewestList, {
          params: {
            sellerId: this.$route.query.sellerId,
            category: this.category != "" ? this.category : "",
            startTime: startTime || getDay(day).computedDay,
            endTime: endTime || getDay().today,
            period: period || 1, // 按日还是按周按月
            monitorTo: this.taskStatus.monitorTo.slice(0, 10),
            newArrivalDay: this.newArrivalDay
          }
        })
        .then(res => {
          console.log("上新返回", res);
          let list = res.data.data;
          // if (list == "") {
          //   setTimeout(() => {
          //     this.Loading = !this.Loading; // loading动画
          //   }, 300); // loading动画
          //   return;
          // }
          this.drawChart(list, this.usefulIndex);
        })
        .catch(err => {
          console.log("chart3有错", err);
          this.Loading = !this.Loading; // loading动画
        });
    },
    drawChart(list, usefulIndex) {
      // this.echart.isScoreCountShowLoading = false;
      let ScoreChange = echarts.init(document.getElementById("Chart3"));
      ScoreChange.clear();
      //
      let date = [],
        dataNewPro = [], //第一条线  新品
        dataNewEval = []; // 第二条线 新品新增评价数
      console.log(1111, list);
      list.forEach((item, index) => {
        date.push(item.statTime.slice(0, 10));
        dataNewPro.push(item.newShelfProductCnt); // 新品数
        dataNewEval.push(item.newShelfReviewCnt); // 新品新增评价数
      });
      // 设置一下表格首次能看到几个数是
      let length = date.length;
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
      let option = {
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], "10%"];
          }
        },
        title: {
          left: "center",
          text: ""
        },
        legend: {
          selectedMode: false,
          data: []
        },
        toolbox: {
          feature: {
            // dataZoom: {
            // yAxisIndex: 'none'
            // },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          name: "时间",
          data: date
        },
        yAxis: {
          type: "value",
          name: "数量",
          boundaryGap: [0, "100%"]
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
          // {
          //   name: "新品数",
          //   type: "line",
          //   smooth: true,
          //   symbol: "none",
          //   sampling: "average",
          //   itemStyle: {
          //     normal: {
          //       color: "rgb(255, 70, 131)"
          //     }
          //   },
          //   areaStyle: {
          //     normal: {
          //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //         {
          //           offset: 0,
          //           color: "rgb(255, 158, 68)"
          //         },
          //         {
          //           offset: 1,
          //           color: "rgb(255, 70, 131)"
          //         }
          //       ])
          //     }
          //   },
          //   data: dataNewPro
          // },
          // {
          //   name: "新品新增评价数",
          //   type: "line",
          //   smooth: true,
          //   symbol: "none",
          //   sampling: "average",
          //   itemStyle: {
          //     normal: {
          //       color: "rgb(255, 70, 131)"
          //     }
          //   },
          //   areaStyle: {
          //     normal: {
          //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //         {
          //           offset: 0,
          //           color: "rgb(255, 158, 68)"
          //         },
          //         {
          //           offset: 1,
          //           color: "rgb(255, 70, 131)"
          //         }
          //       ])
          //     }
          //   },
          //   data: dataNewEval
          // }
        ]
      };
      // 创建一个新的数组，添加seies的name，data的
      let newArr = [];
      if (usefulIndex != "") {
        usefulIndex.forEach((item, index) => {
          if (item == "0") {
            newArr.push({
              name: "新品数",
              data: dataNewPro,
              color: "rgb(255,95,148)"
            });
          }
          if (item == "1") {
            newArr.push({
              name: "新品新增评价数",
              data: dataNewEval,
              color: "rgb(58,142,230)"
            });
          }
        });
      }
      newArr.forEach((item, index) => {
        // 遍历这个新组织好的数组，设置表格option的项
        option.legend.data.push(item.name); // 循环了里设置legend
        option.series.push({
          // 循环了里设置series
          name: item.name,
          type: "line",
          smooth: true,
          symbol: "none",
          sampling: "average",
          itemStyle: {
            normal: {
              color: item.color
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(104, 165, 229)"
                },
                {
                  offset: 1,
                  color: "rgb(238, 116, 156)"
                }
              ])
            }
          },
          data: item.data
        });
      });
      //
      ScoreChange.setOption(option);
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
    // 监控每日每周每月
    value(newVal, oldVal) {
      if (!this.DateMsg.DateValue.length) {
        // 如果没有日期
        this.getShopNewestList(shopDefaultDay, null, null, newVal);
        return;
      }
      // 有日期则往下走
      let startTime = this.DateMsg.DateValue[0],
        endTime = this.DateMsg.DateValue[1];
      this.getShopNewestList(null, startTime, endTime, newVal);
    },
    // 监控日期组件
    "DateMsg.DateValue"(newVal, oldVal) {
      if (!newVal) {
        // 去掉日期的时候恢复默认
        this.getShopNewestList(
          shopDefaultDay,
          null,
          null,
          parseInt(this.value)
        );
        return;
      }
      let startTime = newVal[0],
        endTime = newVal[1];
      this.getShopNewestList(null, startTime, endTime, parseInt(this.value));
    },
    usefulIndex() {
      let date = this.DateMsg.DateValue;
      if (date == "") {
        // 去掉日期的时候恢复默认
        this.getShopNewestList(
          shopDefaultDay,
          null,
          null,
          parseInt(this.value)
        );
        return;
      }
      let startTime = date[0],
        endTime = date[1];
      this.getShopNewestList(null, startTime, endTime, parseInt(this.value));
    },
    category() {
      this.getShopNewestList(shopDefaultDay, null, null, parseInt(this.value));
    }
  }
};
</script>

<style lang='scss' scoped>
.chart3 {
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
// 选择新平，新品新增评价
.choose {
  margin-top: 8px;
  font-size: 14px;
  .button {
    display: inline-block;
    padding: 5px 14px;
    border: 1px solid #3a8ee6;
    text-align: center;
    color: #3a8ee6;
    border-radius: 5px;
    margin-left: 3px;
    cursor: pointer;
  }
  .active {
    background: #3a8ee6 !important;
    color: #fafafa !important;
  }
}
</style>
