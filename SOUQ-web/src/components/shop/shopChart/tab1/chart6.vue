<!-- 评价数表格 -->
<template>
  <div class="chart6" v-loading="Loading">
    <!-- 按日： {{this.value}}
    </br>
    日期：{{this.DateMsg}}
    </br>
    新品，新品新增评价数：{{this.usefulIndex}}
    </br>
    设置多少天的算新品{{this.newArrivalDay}} -->
    <header style="position:relative">
      <span>新增评价数</span>
      <div style="position:absolute;right:550px;top:-1px;" v-if="chartShow">
        <!-- 按日按周选择组件 -->
        <selectDay :dayOptions="dayOptions" :value="value" v-on:chart3-day="getDayFromChild"></selectDay>
        <!-- 选择开始和结束时间组件 -->
      </div>
      <div style="position:absolute;right:160px;top:-1px;">
        <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange>
      </div>
      <div style="position:absolute;right:50px;top:-1px;">
        <span class="iconfont cursor" style="margin-left:20px" v-for="(item,index) in chartBtn" :class="item.iconClassName" :style="{color:item.color}" @click="Handler(item,index)"></span>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <div>
        <p v-if="!chartShow">暂无数据</p>
        <div v-if="chartShow" id="chart6" style="width:100%; height:600px;margin-top:30px;"></div>
      </div>
    </main>
  </div>
</template>

<script>
import selectDay from "@/components/common/selectDay"; //按日按周
import dateRange from "@/components/common/datePick"; //日期
import { getDay } from "@/api/functions.js";
// 引入基本模板
// let echarts = require("echarts/lib/echarts");
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
import { isInArray } from "../../../../api/functions.js";
import { shopDefaultDay, ShopReviewList } from "../../../../api/myApi";
export default {
  name: "chart6",
  components: { selectDay, dateRange },
  props: {
    taskStatus: {}
  },
  data() {
    return {
      chartType: "bar",
      chartBtn: [
        {
          isSelected: true,
          iconClassName: "icon-zhuzhuangtu",
          type: "bar",
          color: "#7CB5EC !important"
        },
        {
          isSelected: false,
          iconClassName: "icon-zhexiantu",
          type: "line",
          color: "#c3c3c3 !important"
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
      Loading: false, //
      preClick: "" //上一次点击的class
    };
  },
  created() {},
  mounted() {
    this.getShopReviewList(
      shopDefaultDay,
      null,
      null,
      parseInt(this.value),
      true
    );
  },
  methods: {
    // 点击切换图形的类型
    Handler(item, index) {
      if (item.isSelected === true) {
        return;
      }
      this.chartBtn.forEach((v, k) => {
        if (index == k) {
          this.$set(this.chartBtn[k], "isSelected", true);
          this.$set(this.chartBtn[k], "color", "#7CB5EC !important");
        }
        if (index != k) {
          this.$set(this.chartBtn[k], "isSelected", false);
          this.$set(this.chartBtn[k], "color", "#3C3C3C !important");
        }
        if (index == 1) {
          this.chartType = this.chartBtn[index].type;
        }
        if (index == 0) {
          this.chartType = this.chartBtn[index].type;
        }
        console.log(this.chartType);
      });
      console.log(this.chartBtn);
    },
    //获取子组件传来按日按周按月
    getDayFromChild(childMsg) {
      this.value = childMsg;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      thit.DateMsg.DateValue = msg;
    },

    // 获取chart6表格数据
    getShopReviewList(day, startTime, endTime, period, isGetNew) {
      // 获取数据的时候要注重list的来源直接请求还是从vuex中取
      this.Loading = true; // loading动画
      if (isGetNew === false) {
        //如果这个参数为false,则不需要请求新的数据。从vuex中取
        let list = this.$store.state.competitive.ShopReviewList;
        console.log(list, "vuex的list");
        this.drawChart(list, isGetNew);
        return;
      }
      this.$axios
        .post(ShopReviewList, {
          sellerId: this.$route.query.sellerId,
          category: this.category != "" ? this.category : "",
          startTime: startTime || getDay(day).computedDay,
          endTime: endTime || getDay().today,
          period: period || 1, // 按日还是按周按月
          // monitorTo: this.taskStatus.monitorTo.slice(0, 10),
          newArrivalDay: this.newArrivalDay
        })
        .then(res => {
          console.log("新增评价数", res);
          let list = res.data.data;
          // if (list == "") {
          //   setTimeout(() => {
          //     this.Loading = !this.Loading; // loading动画
          //   }, 300); // loading动画
          //   return;
          // }
          this.$store.commit("competitive/saveShopReviewList", list);
          this.Loading = false; // loading动画
          console.log(list);
          this.drawChart(list, isGetNew);
        })
        .catch(err => {
          console.log("chart6有错", err);
          this.Loading = false; // loading动画
        });
    },
    drawChart(list, isGetNew) {
      // this.echart.isScoreCountShowLoading = false;
      let myChart = echarts.init(document.getElementById("chart6"));
      myChart.clear();
      //
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["新品", "非新品", "所有产品"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        xAxis: {
          type: "category",
          name: "时间",
          data: []
        },
        toolbox: {
          feature: {
            saveAsImage: {},
            restore: {}
          }
        },
        series: [
          // {
          //   name: "直接访问",
          //   type: "bar",
          //   stack: "总量",
          //   label: {
          //     normal: {
          //       show: true,
          //       position: "insideRight"
          //     }
          //   },
          //   data: [320, 302, 301, 334, 390, 330, 320]
          // }
        ]
      };
      // 横坐标
      let XtimeArr = []; // 横坐标 横坐标拿其中一条数据的push进去
      list[0].list.forEach((item, index) => {
        XtimeArr.push(item.statTime.slice(5, 10));
      });
      option.xAxis.data = XtimeArr;
      // series
      list.forEach((item, index) => {
        let name =
          item.productType == 0
            ? "新品"
            : item.productType == 1 ? "非新品" : "所有产品";
        let data = [];
        item.list.forEach((v, k) => {
          data.push(v.cnt);
        });
        option.series.push({
          name: name,
          type: this.chartType,
          stack: "总量",
          barWidth: 40, //柱图宽度,
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: data
        });
      });
      console.log(option.series, "series");
      myChart.setOption(option);
      setTimeout(() => {
        this.Loading = false; // loading动画
      }, 300);
    }
  },
  computed: {
    newArrivalDay() {
      return this.$store.state.competitive.newProDay; //新品时间
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
        this.getShopReviewList(shopDefaultDay, null, null, newVal, true);
        return;
      }
      // 有日期则往下走
      let startTime = this.DateMsg.DateValue[0],
        endTime = this.DateMsg.DateValue[1];
      this.getShopReviewList(null, startTime, endTime, newVal, true);
    },
    // 监控日期组件
    "DateMsg.DateValue"(newVal, oldVal) {
      if (!newVal) {
        // 去掉日期的时候恢复默认
        this.getShopReviewList(
          shopDefaultDay,
          null,
          null,
          parseInt(this.value),
          true
        );
        return;
      }
      let startTime = newVal[0],
        endTime = newVal[1];
      this.getShopReviewList(
        null,
        startTime,
        endTime,
        parseInt(this.value),
        true
      );
    },
    chartType(newVal) {
      if (this.DateMsg.DateValue == "") {
        // 去掉日期的时候恢复默认
        this.getShopReviewList(
          shopDefaultDay,
          null,
          null,
          parseInt(this.value),
          false
        );
        return;
      }
      let startTime = newVal[0],
        endTime = newVal[1];
      this.getShopReviewList(
        null,
        startTime,
        endTime,
        parseInt(this.value),
        false
      );
    },
    category() {
      this.getShopReviewList(
        shopDefaultDay,
        null,
        null,
        parseInt(this.value),
        true
      );
    }
  }
};
</script>

<style lang='scss' scoped>
.chart6 {
  margin-top: 35px;
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
.actived {
  color: #0094e9 !important;
}
.cursor {
  cursor: pointer;
  padding: 4px;
}
</style>
