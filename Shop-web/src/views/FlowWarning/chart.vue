<template>
  <yt-dialog :options="chartOptions" :events="chartEvents">
    <el-form :inline="true" :model="chartQuery" ref="chartForm">
      <el-form-item prop="daterange">
        <el-date-picker v-model="chartQuery.daterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd" @change="handleFilter"></el-date-picker>
      </el-form-item>
    </el-form>
    <div ref="chart" style="height:400px;width:100%;" v-loading="echartsLoading" :key="echartsKey"></div>
  </yt-dialog>
</template>
<script>
const _ = require("lodash");
const dayjs = require("dayjs");
import echarts from "echarts";
export default {
  data() {
    let vm = this;
    return {
      chartOptions: {
        visible: false,
        width: "1024px",
        title: "数据展示",
        // okBtnText: "关闭"
        showFooter: false
      },
      chartEvents: {
        handleOkClick: () => {
          this.chartOptions.visible = false;
        }
      },
      chartQuery: {
        taskId: null,
        parentAsin: null,
        relateParentAsin: null,
        startTime: null,
        endTime: null,
        daterange: null
      },
      type: null, // keyword 关键词排名下降 flow 关联流量排名下降
      chart: null,
      echartsLoading: false,
      echartsKey: 0,
      option: {
        color: ["#5793f3", "#d14a61", "#675bba"],
        // title: {
        //     text: '折线图堆叠'
        // },
        // tooltip: {
        //     trigger: 'axis'
        // },
        legend: {
          // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
          data: []
        },
        grid: {
          left: "5%",
          right: "8%",
          bottom: "6%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: false
            }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          // data: ['周一','周二','周三','周四','周五','周六','周日']
          data: []
        },
        yAxis: {
          type: "value",
          inverse: true,
          name: "",
          min: 1,
          axisLabel: {
            formatter: function(value, index) {
              let texts = [];
              // debugger
              let max = vm.type === "keyword" ? vm.keywordMax : vm.flowMax;
              if (max === 0) {
                max = 2;
              }
             // console.log(max, value);
              if (value === 0) {
                return;
              } else if (max <= value) {
                return "∞";
              } else {
                return value;
              }
            }
          }
          // nameLocation: "start"
        },
        series: []
        // series: [
        //     {
        //         name:'邮件营销',
        //         type:'line',
        //         stack: '总量',
        //         data:[120, 132, 101, 134, 90, 230, 210]
        //     },
        //     {
        //         name:'联盟广告',
        //         type:'line',
        //         stack: '总量',
        //         data:[220, 182, 191, 234, 290, 330, 310]
        //     },
        //     {
        //         name:'视频广告',
        //         type:'line',
        //         stack: '总量',
        //         data:[150, 232, 201, 154, 190, 330, 410]
        //     },
        //     {
        //         name:'直接访问',
        //         type:'line',
        //         stack: '总量',
        //         data:[320, 332, 301, 334, 390, 330, 320]
        //     },
        //     {
        //         name:'搜索引擎',
        //         type:'line',
        //         stack: '总量',
        //         data:[820, 932, 901, 934, 1290, 1330, 1320]
        //     }
        // ]
      },
      tooltipMap: new Map()
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    showDialog(params) {
      this.type = params.type;
      this.chartOptions.visible = true;

      if (params.type == "keyword") {
        this.chartQuery.taskId = params.taskId;
        this.chartQuery.parentAsin = params.parentAsin;
      } else if (params.type == "flow") {
        this.chartQuery.parentAsin = params.parentAsin;
        this.chartQuery.relateParentAsin = params.relateParentAsin;
      }

      let nowTime = dayjs().format("YYYY-MM-DD");
      this.chartQuery.daterange = [nowTime, nowTime];

      if (this.chart == null) {
        this.$nextTick(function() {
          this.chart = echarts.init(this.$refs.chart);
          this.handleFilter([nowTime, nowTime]);
        });
      } else {
        this.chart.clear();
        this.handleFilter([nowTime, nowTime]);
      }
    },
    setOption() {
      this.chart.setOption(this.option, true);
    },
    handleFilter(val) {
      let vm = this;
      // let apiName ='taskFwRelateDetails'
      if (val !== null) {
        this.echartsLoading = true;
        this.chartQuery.startTime = val[0];
        this.chartQuery.endTime = val[1];
        let chartQuery = _.cloneDeep(this.chartQuery);
        let xAxisData = [val[0]];
        let _time = val[0];
        while (new Date(_time).getTime() < new Date(val[1]).getTime()) {
          _time = new Date(_time).getTime() + 24 * 3600 * 1000;
          xAxisData.push(this.$.formatDate(_time, "{y}-{m}-{d}"));
        }
        //console.log(xAxisData);
        delete chartQuery.daterange;

        let apiName = "taskFwKeywordDetails";
        if (this.type == "flow") {
          apiName = "taskFwRelateDetails";
          delete chartQuery.taskId;
        } else if (this.type == "keyword") {
          delete chartQuery.relateParentAsin;
        }

        this.$api[apiName](chartQuery)
          .then(res => {
            // debugger
            let { code, data } = res;
            if (code == 0) {
              if (data.length > 0) {
                this.tooltipMap.clear();
                if (this.type == "keyword") {
                  this.option.legend.data = ["排名"];
                  // this.option.color = ;
                  // let xAxisData = []
                  let seriesData = [];
                  let max = Math.max.apply(null, data.map(el => el.webRank));

                  this.keywordMax = parseInt(max * 1.6) || 2;
                  let xAxisData = [];
                  if (data) {
                    data.forEach(item => {
                      xAxisData.push(item.sendTime);
                    });
                  }
                  xAxisData.forEach(time => {
                    let el = data.find(el => el.sendTime === time);
                    seriesData.push(
                      el
                        ? el.webRank === 0
                          ? this.keywordMax
                          : el.webRank
                        : null
                    );
                    if (el) {
                      this.tooltipMap.set(
                        el.sendTime,
                        `&nbsp;第${el.webRankPages}页第${el.webPagesRank}名 (${
                          el.webRank
                        })`
                      );
                    }
                  });
                  this.option.xAxis.data = xAxisData;
                  this.option.series = [
                    {
                      name: "排名",
                      type: "line",
                      smooth: 0.4,
                      // stack: "总量",
                      data: seriesData
                    }
                  ];
                } else if (this.type == "flow") {
                  let legendData = [];
                  let series = [];
                  let list = data.map(el =>
                    Math.max.apply(null, el.list.map(el => el.webRank))
                  );
                  let max = Math.max.apply(null, list);

                  this.flowMax = parseInt(max * 1.6) || 2;
                  let xAxisData = [];
                  if (data) {
                    let maxLength=[];
                    data.forEach(i=>{
                      maxLength.push(i.list.length)
                    });
                     // console.log(maxLength);
                    //找出最大值
                    let newArr=maxLength;
                    let max = Math.max(...[...new Set(maxLength)])
                    // console.log(maxLength);
                    // console.log(newArr);
                    // console.log(max);
                    //找出最大值得位置
                    let maxIndex=maxLength.indexOf(max);
                    //  console.log(data);
                    //  console.log(maxIndex);
                    data[maxIndex].list.forEach(item => {
                      xAxisData.push(item.sendTime);
                    });
                    //console.log(xAxisData);
                  }
                  data.forEach(element => {
                    legendData.push(element.position);
                    // console.log(element.position);
                    let seriesData = [];
                    xAxisData.forEach(time => {
                      let el = element.list.find(el => el.sendTime === time);
                      seriesData.push(
                        el
                          ? el.webRank === 0
                            ? this.flowMax
                            : el.webRank
                          : null
                      );
                      if (el) {
                        this.tooltipMap.set(
                          element.position + el.sendTime,
                          `&nbsp;第${el.webRankPages}页第${el.webPagesRank}名 ${
                            el.webRankPages
                              ? `(${(el.webRankPages - 1) * 10 +
                                  el.webPagesRank})`
                              : ""
                          } `
                        );
                      }
                    });
                    //console.log(seriesData, "seriesData");
                    // element.list.forEach(el => {
                    //   seriesData.push(el.webRank === 0 ? this.flowMax : el.webRank);
                    //   this.tooltipMap.set(
                    //     element.position + el.sendTime,
                    //     `&nbsp;第${el.webRankPages}页第${el.webPagesRank}名 ${el.webRankPages ? `(${(el.webRankPages - 1) * 10 + el.webPagesRank})` : '' } `
                    //   );
                    // });
                    series.push({
                      name: element.position,
                      type: "line",
                      smooth: 0.4,
                      // stack: "总量",
                      data: seriesData
                    });
                  });

                  this.option.yAxis.max =
                    this.type === "keyword" ? this.keywordMax : this.flowMax;
                  this.option.legend.data = legendData;
                  this.option.xAxis.data = xAxisData;
                  this.option.series = series;
                  //console.log(this.option, "series");
                }
                this.option.tooltip = this.getTooltip();
                this.setOption();
              } else {
                this.chart.clear();
                this.chart.setOption({
                  title: {
                    left: "center", // 水平居中
                    top: "center", // 垂直居中
                    text: "暂无数据",
                    backgroundColor: "#EEEFF4",
                    textStyle: {
                      color: "#909399",
                      fontStyle: "normal",
                      fontWeight: "normal",
                      fontSize: 14
                    }
                  }
                });
              }
            }
            //console.log(data, "data");
            setTimeout(() => {
              this.echartsLoading = false;
            }, 500);
          })
          .catch(err => {
            console.log(err);
            this.echartsLoading = false;
          });
      }
    },
    getTooltip() {
      let tooltip = {
        trigger: "axis"
      };
      let self = this;
      tooltip.formatter = function(param) {
        // console.log("param", param);
        if (param.length === 1 && param[0].seriesName === "排名") {
          let tooltipStr = self.tooltipMap.get(param[0].name);
          return tooltipStr
            ? param[0].marker + `&nbsp;${param[0].axisValue}<br/>` + tooltipStr
            : "";
        } else if (param.length === 1 && param[0].seriesName !== "排名") {
          let tooltipStr0 = self.tooltipMap.get(
            param[0].seriesName + param[0].name
          );
          return tooltipStr0
            ? `${param[0].axisValue}<br/>` +
                param[0].marker +
                `&nbsp;` +
                tooltipStr0
            : "";
        } else if (param.length === 2) {
          let tooltipStr0 = self.tooltipMap.get(
            param[0].seriesName + param[0].name
          );
          let tooltipStr1 = self.tooltipMap.get(
            param[1].seriesName + param[1].name
          );
          let strs = [
            tooltipStr0 ? param[0].marker + `&nbsp;` + tooltipStr0 : "",
            tooltipStr1 ? param[1].marker + `&nbsp;` + tooltipStr1 : ""
          ];
          return `${param[0].axisValue}<br/>` + strs.join("<br>");
        }
      };
      return tooltip;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
