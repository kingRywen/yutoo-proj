<!-- 评分产品分布 -->
<template>
  <div class="chart8" v-loading="Loading">
    <!-- 按日： {{this.value}}
    </br>
    日期：{{this.DateMsg}}
    </br>
    新品，新品新增评价数：{{this.usefulIndex}}
    </br>
    设置多少天的算新品{{this.newArrivalDay}} -->
    <header style="position:relative">
      <span>BSR排名产品分布</span>
      <el-tooltip class="item" effect="dark" content="店铺产品bsr排名分布图" placement="right-end">
        <i class="iconfont icon-wenhao1"></i>
      </el-tooltip>
      <div style="position:absolute;right:20px;top:-1px;">
        <dateRange onlyOne :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange>
      </div>
    </header>
    <main id="main_chart8" style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <none-page v-show="!this.chartShow" noBack Height="424px">暂无数据</none-page>
      <div v-show="chartShow">
        <div class="export" @click="downloadExl">
          <i class="el-icon-download"></i>
        </div>
        <echart auto-resize :options="echartData" id="cate_chart8" style="width:100%; height:400px;margin-top:25px;"></echart>
      </div>
    </main>
    <!-- 弹窗 todoh-->
    <dialogChart :dialog="dialog"></dialogChart>
  </div>
</template>

<script>
import selectDay from "@/components/common/com_shop_check/selectDay"; //按日按周
import dateRange from "@/components/common/datePick"; //日期
import { getDay } from "@/api/functions.js";
import { isInArray } from "../../../../../../../api/functions.js";
import { shopDefaultDay, ShopRankList } from "../../../../../../../api/myApi";
import dialogChart from "./chartDialog"; //弹窗
let echarts = require("echarts/lib/echarts");
export default {
  name: "chart8",
  components: { selectDay, dateRange, dialogChart },
  props: {
    taskStatus: {}
  },
  data() {
    return {
      echartData: {},
      chartType: "bar",
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
        width: "140px",
        DateValue: getDay().today,
        type: "date"
      },
      chartShow: true,
      Loading: false, //
      // 弹窗组件
      dialog: {
        title: "BSR排名产品分布列表数据（基于最新数据）",
        type: "排名",
        width: "40%",
        dialogShow: false,
        list: [], // 传给弹窗组件的数据，包括新品和非新品的数字
        setToVuex: {
          type: 1, // 0-评分产品分布，1-BSR排名产品分布，2-评价数产品分布
          taskStatus: this.taskStatus
        }
      },
      tool: { chart8_x: "" }
    };
  },
  created() {},
  mounted() {
    this.getShopRankList(shopDefaultDay, null, true); //改
  },
  methods: {
    downloadExl() {
      let data = [];
      let category = this.category ? this.category : "（无类目）";
      let { series, xAxis } = this.echartData;
      for (let index = 0; index < xAxis.data.length; index++) {
        data.push({
          BSR排名区间: xAxis.data[index],
          非新品: series[0].data[index],
          新品: series[1].data[index],
          类目: category
        });
      }
      data = JSON.parse(JSON.stringify(data));
      let name = this.$route.query.sellerId + "的BSR排名产品分布.xlsx";
      this.$store.commit("common/downName", name);
      this.$nextTick(() => {
        this.$.downloadExlShop(data, null, this.$route.query.sellerId);
      });
      // let category = this.category ? this.category : "无";
      // this.$.downloadExl(data, `BSR排名产品分布(类目:${category})`);
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
    getShopRankList(day, statTime, isGetNew, newArrivalDay) {
      // 获取数据的时候要注重list的来源直接请求还是从vuex中取
      this.Loading = true; // loading动画
      if (isGetNew === false) {
        //如果这个参数为false,则不需要请求新的数据。从vuex中取
        let list = this.$store.state.competitive.ShopRankList;
        // console.log(list, "vuex的list");
        this.screen(list, isGetNew);
        return;
      }
      this.$axios
        .post(ShopRankList, {
          sellerId: this.$route.query.sellerId,
          category: this.category != "" ? this.category : "",
          statTime: statTime || getDay().today,
          taskType: 1,
          taskId: parseInt(this.$route.query.taskId),
          // monitorTo: this.taskStatus.monitorTo
          //   ? this.taskStatus.monitorTo.slice(0, 10)
          //   : getDay().today,
          newArrivalDay: newArrivalDay || this.newArrivalDay
        })
        .then(res => {
          // console.log("BSR排名柱状图返回", res);
          let code = res.data.code;
          if (code === 0) {
            let list = res.data.data;
            this.dialog.list = list;
            // if (list == "") {
            //   setTimeout(() => {
            //     this.Loading = !this.Loading; // loading动画
            //   }, 300); // loading动画
            //   return;
            // }
            this.$store.commit("competitive/saveShopRankList", list);
            // console.log(list);
            if (list != "") {
              this.chartShow = true;
              this.screen(list, isGetNew);
            } else {
              this.chartShow = false;
            }
            // this.chartShow = false;
          } else {
            this.chartShow = false;
          }
          this.Loading = false; // loading动画
        })
        .catch(err => {
          // console.log("chart8有错", err);
          this.Loading = false; // loading动画
        });
    },
    screen(list, isGetNew) {
      if (typeof list.length != "undefined" && list.length == 0) {
        this.chartShow = false;
        return;
      }
      this.chartShow = true;
      this.drawChart(list, isGetNew);
    },
    drawChart(list, isGetNew) {
      // this.echart.isScoreCountShowLoading = false;
      let myChart = echarts.init(document.getElementById("cate_chart8"));
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
          data: ["非新品", "新品"]
        },
        grid: {
          left: "3%",
          right: "6%",
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
          // name: "排名",
          axisLabel: {
            show: true,
            interval: 0, //,    // {number}
            rotate: 45,
            textStyle: {
              color: "#999"
            }
            // margin: 8
          },
          data: []
        },
        toolbox: {
          tool: this.tool.chart8_x,
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
      // console.log(list, 212121212121212112);
      let XtimeArr = []; // 横坐标 横坐标拿其中一条数据的push进去
      list.forEach((item, index) => {
        XtimeArr.push(item.range);
      });
      if (XtimeArr.length < 5) {
        option.xAxis.axisLabel.rotate = 0;
      }
      option.xAxis.data = XtimeArr;
      // console.log(XtimeArr);
      // series
      let oldPro = [],
        newPro = [];
      list.forEach((item, index) => {
        // console.log(item);
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
      // newList.forEach((item, index) => {
      //   option.series.push({
      //     name: item.name,
      //     type: this.chartType,
      //     stack: "总量",
      //     barWidth: 40, //柱图宽度,
      //     label: {
      //       normal: {
      //         show: true,
      //         position: "insideRight"
      //       }
      //     },
      //     data: item.data
      //   });
      // });
      option.series = [
        {
          name: newList[0].name,
          type: this.chartType,
          stack: "总量",
          barWidth: 40, //柱图宽度,
          itemStyle: {
            normal: {
              color: "#47C2E1"
            }
          },
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: newList[0].data
        },
        {
          name: newList[1].name,
          type: this.chartType,
          stack: "总量",
          barWidth: 40, //柱图宽度,
          itemStyle: {
            normal: {
              color: "#F6C14B"
            }
          },
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: newList[1].data
        }
      ];
      // console.log(option.series, "series");
      // myChart.setOption(option);
      this.echartData = option;
      myChart.on("click", this.showDialog);
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
    newArrivalDay(newV) {
      this.getShopRankList(shopDefaultDay, null, true, newV); //改
    },
    // 监控日期组件
    "DateMsg.DateValue"(newVal, oldVal) {
      if (!newVal) {
        // 去掉日期的时候恢复默认
        this.getShopRankList(shopDefaultDay, null, true);
        return;
      }
      let statTime = newVal;
      this.getShopRankList(null, statTime, true);
    }
    // category() {
    //   this.getShopRankList(shopDefaultDay, null, true); //改
    // }
  }
};
</script>

<style lang='scss' scoped>
.chart8 {
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
