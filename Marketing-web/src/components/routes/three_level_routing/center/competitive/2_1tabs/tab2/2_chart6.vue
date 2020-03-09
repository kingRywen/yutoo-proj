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
      <el-tooltip class="item" effect="dark" content="店铺新品和非新品评价数" placement="right-end">
        <i class="iconfont icon-wenhao1"></i>
      </el-tooltip>
      <div style="position:absolute;right:360px;top:-1px;">
        <!-- 按日按周选择组件 -->
        <selectDay :dayOptions="dayOptions" :value="value" v-on:chart3-day="getDayFromChild"></selectDay>
        <!-- 选择开始和结束时间组件 -->
      </div>
      <div style="position:absolute;right:120px;top:0px;">
        <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange>
      </div>
      <div style="position:absolute;right:30px;top:1px;">
        <span class="iconfont cursor" style="margin-left:20px" v-for="(item,index) in chartBtn" :class="item.iconClassName" :style="{color:item.color}" @click="Handler(item,index)"></span>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;width:100%">
      <none-page v-show="!this.chartShow" noBack>暂无数据</none-page>
      <div v-show="this.chartShow">
        <!-- <p v-if="!chartShow">暂无数据</p> -->
        <div class="export" @click="downloadExl">
          <i class="el-icon-download"></i>
        </div>
        <echart auto-resize :options="echartData" id="cate_chart6" style="width:95%; height:400px;margin-top:30px;"></echart>
      </div>
    </main>
  </div>
</template>

<script>
import selectDay from "@/components/common/com_shop_check/selectDay"; //按日按周
import dateRange from "@/components/common/datePick"; //日期
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
import { isInArray } from "@/api/functions.js";
import { shopDefaultDay, ShopReviewList } from "@/api/myApi";
export default {
  name: "chart6",
  components: { selectDay, dateRange },
  props: {
    taskStatus: {}
  },
  data() {
    return {
      echartData: {},
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
          value: "7",
          label: "按周"
        },
        {
          value: "30",
          label: "按月"
        }
      ],
      value: "1",
      DateMsg: {
        width: "240px",
        DateValue: [getDay(shopDefaultDay).computedDay, getDay().today],
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
    downloadExl() {
      let data = [];
      let { series, xAxis } = this.echartData;
      let category = this.category ? this.category : "（无类目）";
      for (let index = 0; index < xAxis.data.length; index++) {
        data.push({
          // 所有产品: series[0].data[index],
          时间: xAxis.data[index],
          新品: series[0].data[index],
          非新品: series[1].data[index],
          类目: category
        });
      }
      data = JSON.parse(JSON.stringify(data));
      let name = this.$route.query.sellerId + "的新增评价数.xlsx";
      this.$store.commit("common/downName", name);
      this.$nextTick(() => {
        this.$.downloadExlShop(data, null, this.$route.query.sellerId);
      });
      // let category = this.category ? this.category : "无";
      // this.$.downloadExl(data, `新增评价数(类目:${category})`);
    },
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
        // console.log(this.chartType);
      });
      // console.log(this.chartBtn);
    },
    //获取子组件传来按日按周按月
    getDayFromChild(childMsg) {
      this.value = childMsg;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },

    // 获取chart6表格数据
    getShopReviewList(
      day,
      startTime,
      endTime,
      period,
      isGetNew,
      newArrivalDay
    ) {
      // 获取数据的时候要注重list的来源直接请求还是从vuex中取
      this.Loading = true; // loading动画
      if (isGetNew === false) {
        //如果这个参数为false,则不需要请求新的数据。从vuex中取
        let list = this.$store.state.competitive.ShopReviewList;
        // console.log(list, "vuex的list");
        // 调用筛选函数
        this.screen(list, isGetNew);
        return;
      }
      this.$axios
        .post(ShopReviewList, {
          sellerId: this.$route.query.sellerId,
          category: this.category != "" ? this.category : "",
          startTime: startTime || getDay(day).computedDay,
          endTime: endTime || getDay().today,
          period: period || 1, // 按日还是按周按月
          taskType: 1,
          taskId: parseInt(this.$route.query.taskId),
          // monitorTo: this.taskStatus.monitorTo
          //   ? this.taskStatus.monitorTo.slice(0, 10)
          //   : getDay().today,
          newArrivalDay: newArrivalDay || this.newArrivalDay
        })
        .then(res => {
          // console.log("新增评价数", res);
          let code = res.data.code;
          if (code === 0) {
            let list = res.data.data;
            this.$store.commit("competitive/saveShopReviewList", list);
            if (list != "") {
              this.chartShow = true;
              // 调用筛选函数
              this.screen(list, isGetNew);
            } else {
              this.chartShow = false;
            }
          } else {
            this.chartShow = false;
          }
          this.Loading = false; // loading动画
        })
        .catch(err => {
          // console.log("chart6有错", err);
          this.Loading = false; // loading动画
        });
    },
    // 筛选
    screen(list, isGetNew) {
      let saveData = [];
      // 遍历每一项的list，如果长度存在，则保存。
      list.forEach((item, index) => {
        if (
          (typeof item.list.length !== "undefined" && item.list.length) ||
          item.list != ""
        ) {
          saveData.push(index);
        }
      });
      // 判断数组，如果没数据，则显示暂无数据的图片
      if (saveData.length == 0) {
        this.chartShow = false;
        return;
      }
      // 判断数组，如果有数据，则进行画图
      if (saveData.length > 0) {
        this.chartShow = true;
        this.drawChart(list, isGetNew);
      }
    },
    drawChart(list, isGetNew) {
      // this.echart.isScoreCountShowLoading = false;
      let myChart = echarts.init(document.getElementById("cate_chart6"));
      // myChart.clear();
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
          // data: ["新品", "非新品", "所有产品"]
          data: []
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          minInterval: 1,
          type: "value",
          name: "数量",
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: "category",
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          },
          // name: "时间",
          data: []
        },
        toolbox: {
          feature: {
            // restore: {},
            // saveAsImage: { title: "保存" }
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
        XtimeArr.push(item.reviewDate.slice(0, 10));
      });
      if (XtimeArr.length === 0) {
        list[1].list.forEach((item, index) => {
          XtimeArr.push(item.reviewDate.slice(0, 10));
        });
      }
      option.xAxis.data = XtimeArr;
      // series
      list.forEach((item, index) => {
        // 柱状图颜色
        let color;
        // 新品
        if (item.productType == 0) {
          color = "#F6C14B";
        }
        // 非新品
        if (item.productType == 1) {
          color = "#47C2E1";
        }
        // 所有产品
        if (item.productType == 2) {
          color = "#FB6D6B";
        }
        // 名字
        let name =
          item.productType == 0
            ? "新品"
            : item.productType == 1 ? "非新品" : "所有产品";
        // legend(不能抓到数据的则隐藏)
        if (item.list.length) {
          option.legend.data.push(name);
        }
        let data = [];
        item.list.forEach((v, k) => {
          data.push(v.cnt);
        });
        if (name !== "所有产品") {
          option.series.push({
            name: name,
            type: this.chartType,
            stack: "总量",
            barWidth: 40, //柱图宽度,
            itemStyle: {
              normal: {
                color: color,
                label: { show: true, position: "top" }
              }
            },
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: data
          });
        }
      });
      // console.log(option.series, "series");
      // myChart.setOption(option);

      if (option.xAxis.data.length > 5) {
        option.grid.bottom = "13%";
        option.dataZoom = [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
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
        ];
      } else {
        option.grid.bottom = "6%";
      }
      this.echartData = option;
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
    newArrivalDay(newV) {
      this.getShopReviewList(
        shopDefaultDay,
        null,
        null,
        parseInt(this.value),
        true,
        newV
      );
    },
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
      let list = this.$store.state.competitive.ShopReviewList;
      // console.log(list, "vuex的list");
      // 调用筛选函数
      try {
        this.screen(list, false);
      } catch (e) {}
      // return;
      // if (this.DateMsg.DateValue == "") {
      //   // 去掉日期的时候恢复默认
      //   this.getShopReviewList(
      //     shopDefaultDay,
      //     null,
      //     null,
      //     parseInt(this.value),
      //     false
      //   );
      //   return;
      // }
      // let startTime = newVal[0],
      //   endTime = newVal[1];
      // this.getShopReviewList(
      //   null,
      //   startTime,
      //   endTime,
      //   parseInt(this.value),
      //   false
      // );
    }
    // category() {
    //   this.getShopReviewList(
    //     shopDefaultDay,
    //     null,
    //     null,
    //     parseInt(this.value),
    //     true
    //   );
    // }
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
    height: 29px;
    line-height: 29px;
    width: 100%;
    background: #f2f2f2;
    padding-left: 20px;
  }
  .export {
    position: relative;
    top: 15px;
    left: 96%;
    z-index: 2000;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
}
.actived {
  color: #00c0de !important;
}
.cursor {
  cursor: pointer;
  padding: 4px;
}
</style>
