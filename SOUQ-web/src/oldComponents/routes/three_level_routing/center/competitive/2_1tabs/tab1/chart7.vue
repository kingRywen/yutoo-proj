<!-- 评分产品分布 -->
<template>
  <div class="chart7" v-loading="Loading">
    <!-- 按日： {{this.value}}
    </br>
    日期：{{this.DateMsg}}
    </br>
    新品，新品新增评价数：{{this.usefulIndex}}
    </br>
    设置多少天的算新品{{this.newArrivalDay}} -->
    <header style="position:relative">
      <span>评分产品分布</span>
      <div style="position:absolute;right:50px;top:-1px;">
        <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <div>
        <p v-if="!chartShow">暂无数据</p>
        <div v-if="chartShow" id="chart7" style="width:100%; height:500px;margin-top:25px;" @click="showDialog"></div>
      </div>
    </main>
    <!-- 弹窗 todoh-->
    <dialogChart :dialog="dialog">
    </dialogChart>
  </div>
</template>

<script>
import selectDay from "@/components/common/com_shop_check/selectDay"; //按日按周
import dialogChart from "./chartDialog";
import dateRange from "@/components/common/datePick"; //日期
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
import { isInArray } from "../../../../../../../api/functions.js";
import { shopDefaultDay, ShopStarList } from "../../../../../../../api/myApi";
export default {
  name: "chart7",
  components: { selectDay, dateRange, dialogChart },
  props: {
    taskStatus: {}
  },
  data() {
    return {
      chartType: "bar",
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
        type: "date"
      },
      chartShow: true,
      Loading: false, //
      // 弹窗组件
      dialog: {
        width: "40%",
        title: "列表展示",
        dialogShow: false,
        list: [], // 传给弹窗组件的数据，包括新品和非新品的数字
        setToVuex: {
          type: 0, // 0-评分产品分布，1-BSR排名产品分布，2-评价数产品分布
          taskStatus: this.taskStatus
        }
      }
    };
  },
  created() {},
  mounted() {
    this.getShopStarList(shopDefaultDay, getDay().today, true); //改
  },
  methods: {
    //获取子组件传来按日按周按月
    getDayFromChild(childMsg) {
      this.value = childMsg;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      thit.DateMsg.DateValue = msg;
    },

    // 获取chart7表格数据
    getShopStarList(day, statTime, isGetNew) {
      // 获取数据的时候要注重list的来源直接请求还是从vuex中取
      this.Loading = true; // loading动画
      if (isGetNew === false) {
        //如果这个参数为false,则不需要请求新的数据。从vuex中取
        let list = this.$store.state.competitive.ShopStarList;
        console.log(list, "vuex的list");
        this.drawChart(list, isGetNew);
        return;
      }
      this.$axios
        .get(ShopStarList, {
          params: {
            sellerId: this.$route.query.sellerId,
            category: this.category != "" ? this.category : "",
            statTime: statTime || getDay().today,
            monitorTo: this.taskStatus.monitorTo.slice(0, 10),
            newArrivalDay: this.newArrivalDay
          }
        })
        .then(res => {
          console.log("评分分布返回", res);
          let list = res.data.data;
          // console.log(list, 2121212121);
          this.dialog.list = list;
          // if (list == "") {
          //   setTimeout(() => {
          //     this.Loading = !this.Loading; // loading动画
          //   }, 300); // loading动画
          //   return;
          // }
          this.$store.commit("competitive/saveShopStarList", list);
          this.Loading = false; // loading动画
          console.log(list);
          this.drawChart(list, isGetNew);
        })
        .catch(err => {
          console.log("chart7有错", err);
          this.Loading = false; // loading动画
        });
    },
    drawChart(list, isGetNew) {
      // this.echart.isScoreCountShowLoading = false;
      let myChart = echarts.init(document.getElementById("chart7"));
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
          data: ["非新品", "新品"]
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: {
          type: "value",
          name: "数量"
        },
        xAxis: {
          type: "category",
          name: "评分",
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
      list.forEach((item, index) => {
        XtimeArr.push(item.range);
      });
      option.xAxis.data = XtimeArr;
      console.log(XtimeArr);
      // series
      let oldPro = [],
        newPro = [];
      list.forEach((item, index) => {
        console.log(item);
        oldPro.push(item.oldShelfProductCnt);
        newPro.push(item.newShelfProductCnt);
      });
      let newList = [
        {
          name: "非新品",
          data: oldPro
        },
        {
          name: "新品",
          data: newPro
        }
      ];
      newList.forEach((item, index) => {
        option.series.push({
          name: item.name,
          type: this.chartType,
          stack: "总量",
          barWidth: 40, //柱图宽度,
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: item.data
        });
      });

      console.log(option.series, "series");
      myChart.setOption(option);
      setTimeout(() => {
        this.Loading = false; // loading动画
      }, 300);
    }
    // 点击弹窗弹出chart7,8,9 mainjs上的混合有
    // showDialog() {
    //   this.dialog.dialogShow = true;
    //   // 当弹窗打开的那一刹那，保存一下数据。当用户点击新品或者非新品的数字时，备用于跳转到相关的页面时作为请求参数。
    //   this.$store.commit(
    //     "competitive/saveTaskStatusAndType",
    //     this.dialog.setToVuex
    //   );
    //   // console.log(this.dialog.setToVuex, 212121);
    // }
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
    // 监控日期组件
    "DateMsg.DateValue"(newVal, oldVal) {
      if (!newVal) {
        // 去掉日期的时候恢复默认
        this.getShopStarList(shopDefaultDay, getDay().today, true);
        return;
      }
      let statTime = newVal;
      this.getShopStarList(null, statTime, true);
    },
    category() {
      this.getShopStarList(shopDefaultDay, getDay().today, true); //改
    }
  }
};
</script>

<style lang='scss' scoped>
.chart7 {
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
