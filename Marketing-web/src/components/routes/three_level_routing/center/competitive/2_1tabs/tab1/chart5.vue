<!-- 评价数表格 -->
<template>
  <div class="chart5" v-loading="Loading">
    <header style="position:relative">
      <span>日新增评价数-详情</span>
      <el-tooltip class="item" effect="dark" content="店铺产品每日新增评价数详情" placement="right-end">
        <i class="iconfont icon-wenhao1"></i>
      </el-tooltip>
      <div style="position:absolute;right:260px;top:-1px;">
        <!-- 按日按周选择组件 -->
        <selectDay :dayOptions="dayOptions" :value="value" v-on:chart3-day="getDayFromChild"></selectDay>
        <!-- 选择开始和结束时间组件 -->
      </div>
      <div style="position:absolute;right:20px;top:0px;">
        <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <none-page v-show="!this.chartShow" noBack>暂无数据</none-page>
      <div v-show="this.chartShow">
        <!-- 两大项 -->
        <section class="choose">
          <span class="commonColor">数据项：</span>
          <button class='button' :class="{'active' : item.isSelected2,'canClick':!item.canClick}" :disabled="!item.canClick" v-for="(item,i) in this.diagramList1" :key="i" @click="changeDiagramBtnSelect(item,i,0)">{{item.name}}</button>
        </section>
        <!-- 6选择 -->
        <section class='choose'>
          <span style='margin-left:1em;' class="commonColor">曲线：</span>
          <span class='button' :class="{'active' : item.isSelected2}" v-for="(item,i) in this.diagramList2" :key="i" @click="changeDiagramBtnSelect(item,i,1)">{{item.name}}</span>
        </section>
        <!-- <p v-if="!chartShow">暂无数据</p> -->
        <div class="export" @click="downloadExl">
          <i class="el-icon-download"></i>
        </div>
        <echart auto-resize :options="echartData" id="chart5" style="width:98%; height:400px;margin-top:30px;"></echart>
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
import { shopDefaultDay, ShopReviewDetailList } from "@/api/myApi";
export default {
  name: "chart5",
  components: { selectDay, dateRange },
  props: {
    taskStatus: {},
    category: ""
  },
  data() {
    return {
      ex_data: null,
      echartData: {},
      usefulIndex: [[0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5]],
      diagramList1: [
        {
          name: "所有产品",
          isSelected2: true,
          canClick: true,
          type: "0"
        },
        {
          name: "新品",
          isSelected2: true,
          canClick: true,
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
          isSelected2: true,
          name: "VP评",
          type: 0
        },
        {
          isSelected2: true,
          name: "好评",
          type: 1
        },
        {
          isSelected2: true,
          name: "差评",
          type: 2
        },
        {
          isSelected2: true,
          name: "直评",
          type: 3
        },
        {
          isSelected2: true,
          name: "好评带图",
          type: 4
        },
        {
          isSelected2: true,
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
      chartShow: false,
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
    downloadExl() {
      // console.log(this.ex_data, "ex_data");
      let { xAxis } = this.echartData;
      let arr = [[], []];
      let usefulIndex = JSON.parse(JSON.stringify(this.usefulIndex));
      usefulIndex.forEach(item => {
        if (item.includes(-1)) {
          item.splice(0, 1);
        }
      });
      // console.log(this.usefulIndex, "usefulIndex");
      usefulIndex.forEach((item, index) => {
        item.forEach((v, k) => {
          arr[index].push(this.ex_data[index][v]);
        });
      });
      console.log(arr);
      let data = [];
      xAxis.data.forEach((item, index) => {
        data.push({
          日期: item
        });
      });
      data.forEach((item, index) => {
        arr.forEach((v, k) => {
          v.forEach((i, j) => {
            if (i) {
              let name = i.name + "";
              item[name] = i.data[index];
            }
          });
        });
      });
      // console.log(data, "data");
      if (arr[0] == "" && arr[1] == "") {
        this.$message.warning("请选择新品、非新品");
        return;
      }
      data = JSON.parse(JSON.stringify(data));
      let name = this.$route.query.sellerId + "的日新增评价数-详情.xlsx";
      this.$store.commit("common/downName", name);
      this.$nextTick(() => {
        this.$.downloadExlShop(data, null, this.$route.query.sellerId);
      });
      // this.$.downloadExl(data, "日新增评价数-详情");
      // let { series, xAxis } = this.echartData;
      // let data = [];
      // for (let i = 0; i < xAxis.data.length; i++) {
      //   data.push({
      //     时间: xAxis.data[i],
      //     所有产品VP评: series[0].data[i],
      //     所有产品好评: series[1].data[i],
      //     所有产品差评: series[2].data[i],
      //     所有产品直评: series[3].data[i],
      //     所有产品好评带图: series[4].data[i],
      //     所有产品好评带视频: series[5].data[i],
      //     新品VP评: series[6].data[i],
      //     新品好评: series[7].data[i],
      //     新品差评: series[8].data[i],
      //     新品直评: series[9].data[i],
      //     新品好评带图: series[10].data[i],
      //     新品好评带视频: series[11].data[i]
      //   });
      // }
      // this.$.downloadExl(data, "日新增评价数-详情");
    },
    // 点击切换评价选择
    changeDiagramBtnSelect(item, i, index) {
      // 如果按钮是不可以点击的，则没事发生
      if (item.canClick === false) {
        return;
      }
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
              this.DateMsg.DateValue[0],
              this.DateMsg.DateValue[1],
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
            this.DateMsg.DateValue[0],
            this.DateMsg.DateValue[1],
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
                this.DateMsg.DateValue[0],
                this.DateMsg.DateValue[1],
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
              this.DateMsg.DateValue[0],
              this.DateMsg.DateValue[1],
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
              this.DateMsg.DateValue[0],
              this.DateMsg.DateValue[1],
              this.value,
              this.usefulIndex,
              false
            );
          }
        }
      }
    },
    //获取子组件传来按日按周按月
    getDayFromChild(childMsg) {
      this.value = childMsg;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },
    // 筛选有没有，有一个还有有两个的函数。
    screen(list, usefulIndex, isGetNew) {
      if (isGetNew == true) {
        // console.log(usefulIndex, "下标");
        // console.log(this.diagramList1[0], this.diagramList1[1]);
        if (usefulIndex[0].length > 0) {
          this.diagramList1[0].isSelected2 = true; // 所有产品勾上
          usefulIndex[0].forEach(item => {
            // console.log(item, "所有的");
            this.diagramList2.forEach((item, index) => {
              if (index === item) {
                item.isSelected2 = true;
              }
            });
          });
          // 如果长度为6，全部勾选上
          if (usefulIndex[0].length === 6) {
            this.diagramList2[0].isSelected2 = true;
          }
        }
        if (usefulIndex[1].length > 0) {
          this.diagramList1[1].isSelected2 = true; //新品勾上
          usefulIndex[1].forEach(item => {
            // console.log(item, "新品的");
            this.diagramList2.forEach((item, index) => {
              if (index === item) {
                item.isSelected2 = true;
              }
            });
          });
          // 如果长度为6，全部勾选上
          if (usefulIndex[1].length === 6) {
            this.diagramList2[0].isSelected2 = true;
          }
        }
      } else {
        // console.log(usefulIndex);
        if (usefulIndex[0].length === 6 || usefulIndex[1].length === 6) {
          this.diagramList2[0].isSelected2 = true;
        }
      }
      // 检测出有一个的长度为空。则表示抓不到数据
      if (list.length > 0) {
        let isDataIndex = [];
        for (let i = 0; i < list.length; i++) {
          if (list[i].reviewList.length == 0) {
            isDataIndex.push(i);
          }
        }
        // 如果所有产品和非新品都有保存有下标，则表示两个都没抓到数据
        if (isDataIndex.length == 2) {
          this.chartShow = false;
          return;
        }
        this.chartShow = true;

        this.drawChart(list, usefulIndex, isGetNew, isDataIndex);
      }
      if (list.length == 0) {
        this.chartShow = false;
      }
    },
    // 获取chart5表格数据
    getShopReviewDetailList(
      day,
      startTime,
      endTime,
      period,
      usefulIndex,
      isGetNew,
      newArrivalDay
    ) {
      this.Loading = true; // loading动画
      if (isGetNew === false) {
        //如果这个参数为false,则不需要请求新的数据。从vuex中取
        let list = this.$store.state.competitive.reviewDetailList;
        // 筛选
        this.screen(list, usefulIndex, isGetNew);
        // console.log(list, 11111);

        return;
      }
      this.$axios
        .post(ShopReviewDetailList, {
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
          // console.log("日新增评价数-详情1", res);
          let code = res.data.code;
          if (code === 0) {
            let list = res.data.data;
            this.$store.commit("competitive/saveReviewDetailList", list);
            // 筛选
            if (list != "") {
              this.chartShow = true;
              this.screen(list, usefulIndex, isGetNew);
            } else {
              this.chartShow = false;
            }
          } else {
            this.chartShow = false;
          }
          this.Loading = false; // loading动画
        })
        .catch(err => {
          // console.log("chart5有错", err);
          this.Loading = false; // loading动画
        });
    },
    drawChart(list, usefulIndex, isGetNew, isDataIndex) {
      // this.echart.isScoreCountShowLoading = false;
      let myChart = echarts.init(document.getElementById("chart5"));
      // myChart.clear();
      //
      // console.log("要处理的日新增评价数-详情", list);
      // todom
      // add

      // if (isGetNew == true) {
      //   this.diagramList1[0].isSelected2 = true; // 所有产品勾上
      //   this.diagramList1[1].isSelected2 = true; //新品勾上
      //   this.diagramList2[0].isSelected2 = true; //全选勾上
      //   this.diagramList2.forEach((item, index) => {
      //     // 其他选上
      //     if (index > 0) {
      //       item.isSelected2 = true;
      //     }
      //   });
      // }
      // 根据筛选来让哪个按键不能点击来处理勾选。
      isDataIndex.forEach((item, index) => {
        // alert("没数据的下标是" + item);
        this.diagramList1[item].isSelected2 = false; //取消没有数据的勾勾
        this.diagramList1[item].canClick = false; // 设置为不可点击，改变一下颜色
      });
      this.Loading = true; // loading动画
      let option = {
        title: {
          // text: "日新增评价数-详情曲线图"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        toolbox: {
          feature: {
            // saveAsImage: { title: "保存" }
            // restore: {}
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
          // name: "时间",
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          },
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
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          minInterval: 1,
          type: "value",
          // name: "数量",
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
          // splitLine:{
          // 	　　　　show:false
          // 	　　 }
        },
        legend: {
          selectedMode: false,
          data: []
        },
        splitLine: {
          show: true,
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
          if (item.productType == 2) {
            if (v.reviewType == 0) {
              v.list.forEach((vv, kk) => {
                XtimeArr.push(vv.reviewDate.slice(0, 10));
              });
            }
          }
        });
      });
      // console.log(XtimeArr, "横坐标只需要一个");
      // 如果拿不到横坐标则继续拿新品的时间作为横坐标
      if (XtimeArr.length === 0) {
        list.forEach((item, index) => {
          // console.log(item, 121212121);
          item.reviewList.forEach((v, k) => {
            //新品
            if (item.productType == 0) {
              if (v.reviewType == 0) {
                v.list.forEach((vv, kk) => {
                  XtimeArr.push(vv.reviewDate.slice(0, 10));
                });
              }
            }
          });
        });
      }
      // 纵坐标
      let Yarr = [[], []]; //创建新的数组对象，方便网series里面push数据
      list.forEach((item, index) => {
        // console.log(item);
        if (item.reviewList.length) {
          item.reviewList.forEach((v, k) => {
            // console.log(v);
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
        }
      });
      // 为下载用
      this.ex_data = Yarr;
      // 为下载用end
      // console.log(Yarr, "chart5");
      // todom
      // 往series里面放值
      //       option.series.push({
      //   name: v.name,
      //   type: "line",
      //   data: v.data
      // });
      // console.log("usefulIndex", usefulIndex);
      usefulIndex.forEach((item, index) => {
        if (item.length) {
          item.forEach((v, k) => {
            if (v != -1) {
              // console.log("Yarr", Yarr);
              // todonow
              if (Yarr[index] != "") {
                option.legend.data.push(Yarr[index][v].name);
                option.series.push({
                  name: Yarr[index][v].name,
                  type: "line",
                  data: Yarr[index][v].data,
                  lineStyle: {
                    width: 2
                  }
                });
              }
            }
          });
        }
      });
      option.xAxis.data = XtimeArr;
      // console.log(option);
      //
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
        option.grid.bottom = "5%";
      }
      this.echartData = option;
      this.Loading = false; // loading动画
    }
  },
  computed: {
    newArrivalDay() {
      return this.$store.state.competitive.newProDay;
    }
    // category() {
    //   return this.$store.state.competitive.categoryChange;
    // }
  },
  watch: {
    newArrivalDay(newV) {
      this.getShopReviewDetailList(
        shopDefaultDay,
        null,
        null,
        parseInt(this.value),
        this.usefulIndex,
        true,
        newV
      );
    },
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
    }
  }
};
</script>

<style lang='scss' scoped>
.chart5 {
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
    left: 96.5%;
    z-index: 2000;
    cursor: pointer;
    i {
      font-size: 20px;
    }
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
    background: #fff;
    border-radius: 3px;
    margin-left: 3px;
    cursor: pointer;
  }
  .active {
    background: #00c0de !important;
    color: #fafafa !important;
  }
  .canClick {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
