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
      <span>日新增评价数-详情</span>
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
        <!-- 两大项 -->
        <section class="choose">
          <span>数据项：</span>
          <span class='button' :class="{'active' : item.isSelected2}" v-for="(item,i) in this.diagramList1" :key="i" @click="changeDiagramBtnSelect(item,i,0)">{{item.name}}</span>
        </section>
        <!-- 6选择 -->
        <section class='choose'>
          <span style='margin-left:1em;'>曲线：</span>
          <span class='button' :class="{'active' : item.isSelected2}" v-for="(item,i) in this.diagramList2" :key="i" @click="changeDiagramBtnSelect(item,i,1)">{{item.name}}</span>
        </section>
        <p v-if="!chartShow">暂无数据</p>
        <div v-if="chartShow" id="chart5" style="width:100%; height:600px;margin-top:30px;"></div>
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
  ShopReviewDetailList
} from "../../../../../../../api/myApi";
export default {
  name: "chart5",
  components: { selectDay, dateRange },
  props: {
    taskStatus: {}
  },
  data() {
    return {
      usefulIndex: [[0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5]],
      diagramList1: [
        {
          name: "所有产品",
          isSelected2: true,
          type: "0"
        },
        {
          name: "新品",
          isSelected2: true,
          type: "1"
        }
      ],
      diagramList2: [
        {
          isSelected2: true,
          name: "全选",
          type: -1
        },
        {
          isSelected2: false,
          name: "VP评",
          type: 0
        },
        {
          isSelected2: false,
          name: "好评",
          type: 1
        },
        {
          isSelected2: false,
          name: "差评",
          type: 2
        },
        {
          isSelected2: false,
          name: "直评",
          type: 3
        },
        {
          isSelected2: false,
          name: "好评带图",
          type: 4
        },
        {
          isSelected2: false,
          name: "好评带视频",
          type: 5
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
    this.getShopReviewDetailList(
      shopDefaultDay,
      null,
      null,
      parseInt(this.value),
      this.usefulIndex,
      true
    );
  },
  methods: {
    // 点击切换评论选择
    changeDiagramBtnSelect(item, i, index) {
      this.usefulIndex = [[], []];
      if (index == 0) {
        //点的是第一行的第一个
        if (this.diagramList1[i].isSelected2 === true) {
          this.diagramList1[i].isSelected2 = false;
          this.usefulIndex[i] = [];
          // 两处都要进行以下操作，因为有reture
          // 点了哪个，就设置哪个的背景色，并且遍历第二行的按钮，把第二行选中的放进二维数组
          this.diagramList1.forEach((item, index) => {
            if (item.isSelected2 === true) {
              this.diagramList2.forEach((v, k) => {
                //把第一行选中的，去第二行遍历有true的存到响应【】
                if (v.isSelected2 == true) {
                  this.usefulIndex[index].push(v.type);
                }
              });
            }
          });
          // console.log(this.usefulIndex, "usefulIndex");
          if (!this.DateMsg.DateValue) {
            this.getShopReviewDetailList(
              shopDefaultDay,
              null,
              null,
              this.value,
              this.usefulIndex,
              false
            );
          }
          if (this.DateMsg.DateValue) {
            this.getShopReviewDetailList(
              null,
              this.this.DateMsg.DateValue[0],
              this.this.DateMsg.DateValue[1],
              this.value,
              this.usefulIndex,
              false
            );
          }
          // console.log(usefulIndex);
          // let stateList = this.$store.state.competitive.IncrScoreCount; // 列表从vuex拿
          // if (stateList) {
          // this.contrIncrScoreCount(stateList, usefulIndex); // 画图
          // }
          return;
        }
        this.diagramList1[i].isSelected2 = true;
        this.diagramList1.forEach((item, index) => {
          if (item.isSelected2 === true) {
            this.diagramList2.forEach((v, k) => {
              //把第一行选中的，去第二行遍历有true的存到响应【】
              if (v.isSelected2 == true) {
                this.usefulIndex[index].push(v.type);
              }
            });
          }
        });
        // 两处都要进行以下操作，因为有reture
        // console.log(this.usefulIndex, "usefulIndex");
        if (!this.DateMsg.DateValue) {
          this.getShopReviewDetailList(
            shopDefaultDay,
            null,
            null,
            this.value,
            this.usefulIndex,
            false
          );
        }
        if (this.DateMsg.DateValue) {
          this.getShopReviewDetailList(
            null,
            this.this.DateMsg.DateValue[0],
            this.this.DateMsg.DateValue[1],
            this.value,
            this.usefulIndex,
            false
          );
        }
      }
      // 如果用户点击了点的是第2行
      if (index == 1) {
        // 点击第二行但点击的不是全部
        if (i != 0) {
          this.diagramList2[0].isSelected2 = false; // 点的不是全部，则去掉全部的背景色
          if (this.diagramList2[i].isSelected2 === true) {
            this.diagramList2[i].isSelected2 = false;
            // 两处都要进行以下操作，因为有reture
            // 点了哪个，就设置哪个的背景色，并且遍历第二行的按钮，把第二行选中的放进二维数组
            this.diagramList1.forEach((item, index) => {
              if (item.isSelected2 === true) {
                this.diagramList2.forEach((v, k) => {
                  //把第一行选中的，去第二行遍历有true的存到响应【】
                  if (v.isSelected2 == true) {
                    this.usefulIndex[index].push(v.type);
                  }
                });
              }
            });
            // console.log(this.usefulIndex, "usefulIndex");
            if (!this.DateMsg.DateValue) {
              this.getShopReviewDetailList(
                shopDefaultDay,
                null,
                null,
                this.value,
                this.usefulIndex,
                false
              );
            }
            if (this.DateMsg.DateValue) {
              this.getShopReviewDetailList(
                null,
                this.this.DateMsg.DateValue[0],
                this.this.DateMsg.DateValue[1],
                this.value,
                nthis.usefulIndex,
                false
              );
            }
            // console.log(usefulIndex);
            // let stateList = this.$store.state.competitive.IncrScoreCount; // 列表从vuex拿
            // if (stateList) {
            // this.contrIncrScoreCount(stateList, usefulIndex); // 画图
            // }
            return;
          }
          this.diagramList2[i].isSelected2 = true;
          this.diagramList1.forEach((item, index) => {
            if (item.isSelected2 === true) {
              this.diagramList2.forEach((v, k) => {
                //把第一行选中的，去第二行遍历有true的存到响应【】
                if (v.isSelected2 == true) {
                  this.usefulIndex[index].push(v.type);
                }
              });
            }
          });
          // 两处都要进行以下操作，因为有reture
          // console.log(this.usefulIndex, "usefulIndex");
          if (!this.DateMsg.DateValue) {
            this.getShopReviewDetailList(
              shopDefaultDay,
              null,
              null,
              this.value,
              this.usefulIndex,
              false
            );
          }
          if (this.DateMsg.DateValue) {
            this.getShopReviewDetailList(
              null,
              this.this.DateMsg.DateValue[0],
              this.this.DateMsg.DateValue[1],
              this.value,
              this.usefulIndex,
              false
            );
          }
        }
        // 点的是全部
        if (i == 0) {
          let isAll = this.diagramList2[0].isSelected2;
          if (isAll == false) {
            //如果本身没选中，则执行以下代码
            this.diagramList2[0].isSelected2 = true;
            this.diagramList2.forEach((v, j) => {
              this.diagramList2[j].isSelected2 = true;
            });
          }
          if (isAll == true) {
            //如果本身已经选中了全部，则执行以下代码
            this.diagramList2.forEach((v, j) => {
              this.diagramList2[j].isSelected2 = false;
            });
          }
          this.diagramList1.forEach((value, key) => {
            if (value.isSelected2 === true) {
              this.diagramList2.forEach((v, k) => {
                //把第一行选中的，去第二行遍历有true的存到响应【】
                if (v.isSelected2 == true && k != 0) {
                  this.usefulIndex[key].push(v.type);
                }
              });
            }
          });
          // console.log(this.usefulIndex, "usefulIndex");
          if (!this.DateMsg.DateValue) {
            this.getShopReviewDetailList(
              shopDefaultDay,
              null,
              null,
              this.value,
              this.usefulIndex,
              false
            );
          }
          if (this.DateMsg.DateValue) {
            this.getShopReviewDetailList(
              null,
              this.this.DateMsg.DateValue[0],
              this.this.DateMsg.DateValue[1],
              this.value,
              this.usefulIndex,
              false
            );
          }
        }
      }
      // let stateList = this.$store.state.competitive.IncrScoreCount;
      // if (stateList) {
      //   this.contrIncrScoreCount(stateList);
      // }
      // if (!stateList) {
      //   this.$message.error("暂无相关数据，请选择其他时间段");
      //   return;
      // }
      ///////////点的是第一行的第2个
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

    // 获取chart5表格数据
    getShopReviewDetailList(
      day,
      startTime,
      endTime,
      period,
      usefulIndex,
      isGetNew
    ) {
      this.Loading = true; // loading动画
      if (isGetNew === false) {
        //如果这个参数为false,则不需要请求新的数据。从vuex中取
        let list = this.$store.state.competitive.reviewDetailList;
        // console.log(list, 11111);
        this.drawChart(list, usefulIndex, isGetNew);
        return;
      }
      this.$axios
        .get(ShopReviewDetailList, {
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
          console.log("日新增评价数-详情", res);
          let list = res.data.data;
          // if (list == "") {
          //   setTimeout(() => {
          //     this.Loading = !this.Loading; // loading动画
          //   }, 300); // loading动画
          //   return;
          // }
          this.$store.commit("competitive/saveReviewDetailList", list);
          this.Loading = false; // loading动画
          this.drawChart(list, usefulIndex, isGetNew);
        })
        .catch(err => {
          console.log("chart3有错", err);
          this.Loading = false; // loading动画
        });
    },
    drawChart(list, usefulIndex, isGetNew) {
      // this.echart.isScoreCountShowLoading = false;
      let myChart = echarts.init(document.getElementById("chart5"));
      myChart.clear();
      //
      // console.log("要处理的日新增评价数-详情", list);
      // todom
      if (isGetNew == true) {
        this.diagramList1[0].isSelected2 = true; // 所有产品勾上
        this.diagramList1[1].isSelected2 = true; //新品勾上
        this.diagramList2[0].isSelected2 = true; //全选勾上
        this.diagramList2.forEach((item, index) => {
          // 其他去掉
          if (index > 0) {
            item.isSelected2 = false;
          }
        });
      }
      // if (list == "") {
      //   this.skuEchart.isScoreCountShow = true;
      //   skuScoreChart.clear();
      //   setTimeout(() => {
      //     this.skuEchart.isScoreCountShowLoading = false;
      //   }, 500);
      //   return;
      // }
      // if (usefulIndex) {
      //   let newList = [];
      //   list.forEach((item, index) => {
      //     arr.forEach((v, i) => {
      //       if (item.reviewType == i) {
      //         newList.push(item);
      //       }
      //     });
      //   });
      //   list = newList;
      // }
      this.Loading = true; // loading动画
      let option = {
        title: {
          // text: "日新增评价数-详情曲线图"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
            // restore: {}
          }
        },
        xAxis: {
          type: "category",
          name: "时间",
          boundaryGap: false,
          splitLine: {
            show: false,
            lineStyle: {
              // 使用深浅的间隔色
              color: ["#aaa", "#ddd"]
            }
          },
          data: []
        },
        yAxis: {
          type: "value",
          name: "数量"
          // splitLine:{
          // 	　　　　show:false
          // 	　　 }
        },
        legend: {
          selectedMode: false,
          data: []
        },
        splitLine: {
          show: false,
          lineStyle: {
            // 使用深浅的间隔色
            color: ["#aaa", "#ddd"]
          }
        },
        axisTick: {
          interval: 0
        },
        series: []
      };

      let XtimeArr = []; // 横坐标 横坐标拿其中一条数据的push进去
      list.forEach((item, index) => {
        // console.log(item, 121212121);
        item.reviewList.forEach((v, k) => {
          //新品
          if (item.productType == 0) {
            if (v.reviewType == 0) {
              v.list.forEach((vv, kk) => {
                XtimeArr.push(vv.statTime.slice(5, 10));
              });
            }
          }
        });
      });
      // console.log(XtimeArr, "横坐标只需要一个");
      // 纵坐标
      let Yarr = [[], []]; //创建新的数组对象，方便网series里面push数据
      list.forEach((item, index) => {
        // console.log(item);
        item.reviewList.forEach((v, k) => {
          console.log(v);
          //所有
          if (item.productType == 2) {
            if (v.reviewType == 0) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "所有产品VP评",
                data: data
              };
            }
            if (v.reviewType == 1) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "所有产品好评",
                data: data
              };
            }
            if (v.reviewType == 2) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "所有产品差评",
                data: data
              };
            }
            if (v.reviewType == 3) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "所有产品直评",
                data: data
              };
            }
            if (v.reviewType == 4) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "所有产品好评带图",
                data: data
              };
            }
            if (v.reviewType == 5) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "所有产品好评带视频",
                data: data
              };
            }
          }
          //新品
          if (item.productType == 0) {
            if (v.reviewType == 0) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "新品VP评",
                data: data
              };
            }
            if (v.reviewType == 1) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "新品好评",
                data: data
              };
            }
            if (v.reviewType == 2) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "新品差评",
                data: data
              };
            }
            if (v.reviewType == 3) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "新品直评",
                data: data
              };
            }
            if (v.reviewType == 4) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "新品好评带图",
                data: data
              };
            }
            if (v.reviewType == 5) {
              let data = []; // 每一条折线的纵坐标
              v.list.forEach((vv, kk) => {
                data.push(vv.cnt);
              });
              Yarr[index][k] = {
                name: "新品好评带视频",
                data: data
              };
            }
          }
        });
      });
      // console.log(Yarr, "series");
      // todom
      // 往series里面放值
      //       option.series.push({
      //   name: v.name,
      //   type: "line",
      //   data: v.data
      // });
      usefulIndex.forEach((item, index) => {
        item.forEach((v, k) => {
          if (v != -1) {
            option.legend.data.push(Yarr[index][v].name);
            option.series.push({
              name: Yarr[index][v].name,
              type: "line",
              data: Yarr[index][v].data,
              lineStyle: {
                width: 3
              }
            });
          }
        });
      });
      option.xAxis.data = XtimeArr;
      // console.log(option);
      //
      myChart.setOption(option);
      setTimeout(() => {
        this.Loading = false; // loading动画
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
        this.getShopReviewDetailList(
          shopDefaultDay,
          null,
          null,
          newVal,
          this.usefulIndex,
          true
        );
        return;
      }
      // 有日期则往下走
      let startTime = this.DateMsg.DateValue[0],
        endTime = this.DateMsg.DateValue[1];
      this.getShopReviewDetailList(
        null,
        startTime,
        endTime,
        newVal,
        this.usefulIndex,
        true
      );
    },
    // 监控日期组件
    "DateMsg.DateValue"(newVal, oldVal) {
      if (!newVal) {
        // 去掉日期的时候恢复默认
        this.getShopReviewDetailList(
          shopDefaultDay,
          null,
          null,
          parseInt(this.value),
          this.usefulIndex,
          true
        );
        return;
      }
      let startTime = newVal[0],
        endTime = newVal[1];
      this.getShopReviewDetailList(
        null,
        startTime,
        endTime,
        parseInt(this.value),
        this.usefulIndex,
        true
      );
    },
    category() {
      this.getShopReviewDetailList(
        shopDefaultDay,
        null,
        null,
        parseInt(this.value),
        this.usefulIndex,
        true
      );
    }
    // usefulIndex() {
    //   let date = this.DateMsg.DateValue;
    //   if (date == "") {
    //     // 去掉日期的时候恢复默认
    //     this.getShopReviewDetailList(
    //       shopDefaultDay,
    //       null,
    //       null,
    //       parseInt(this.value)
    //     );
    //     return;
    //   }
    //   let startTime = date[0],
    //     endTime = date[1];
    //   this.getShopReviewDetailList(
    //     null,
    //     startTime,
    //     endTime,
    //     parseInt(this.value)
    //   );
    // }
  }
};
</script>

<style lang='scss' scoped>
.chart3 {
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
