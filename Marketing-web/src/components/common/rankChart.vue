<!-- 评价数表格 -->
<template>
  <div class="chartRank" v-loading="dialogLoading">
    <header style="position:relative">
      <!-- 选择关键词 -->
      <div style="position:absolute;left:0px;top:-6px;" v-if="this.chartData.itemType===1?true:false">
        <el-select :popper-append-to-body="false" @change="selectAll" v-model="value5" placeholder="默认全部关键词,可筛选" style='min-width:120px' :multiple="true" collapse-tags>
          <el-option v-for="item in options" :key="item.value" :label="item.keyword" :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-button type="success" @click='drawByKeywords'>确定</el-button> -->
      </div>
      <div style="position:absolute;right:20px;top:-4px;">
        <!-- <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate"></dateRange> -->
        <el-date-picker :picker-options="onlyOneYear" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" @change="changeTime" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" @close="closeClear" :clearable="false">
        </el-date-picker>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <none-page v-if="!chartData.chartShow" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow">
        <echart auto-resize :options="echartData" id="ChartRank" style="width:100%; height:460px"></echart>
      </div>
    </main>
  </div>
</template>

<script>
import mock from "@/api/json.js";
import selectDay from "@/components/common/com_shop_check/selectDay";
import dateRange from "@/components/common/datePick";
import { getDay, getBigNum } from "@/api/functions.js";
let echarts = require("echarts/lib/echarts");
export default {
  name: "chartRank",
  props: ["chartData"],
  components: { selectDay, dateRange },
  data() {
    return {
      echartData: {},
      value: "1",
      DateMsg: {
        DateValue: [getDay().today, getDay().today],
        // DateValue: [this.chartData.date[0], this.chartData.date[1]],
        width: "240px",
        type: "daterange"
      },
      dialogLoading: false,
      Loading: false, //
      // value5: ["all", 0, 1],
      value5: [],
      // oldOptions: ["all", 0, 1],
      oldOptions: [],
      // options: [
      //   {
      //     value: "all",
      //     keyword: "全部"
      //   },
      //   {
      //     value: 0,
      //     keyword: "oppo11111111111111111111111111111111111111111111111111111"
      //   },
      //   {
      //     value: 1,
      //     keyword: "oppo1"
      //   }
      // ],
      options: [],
      list: null
    };
  },
  created() {},
  mounted() {
    // this.DateMsg.DateValue = [
    //   this.chartData.monitorFrom,
    //   this.chartData.monitorTo
    // ];
  },
  methods: {
    // changeKeyword(val) {
    // },
    selectAll(val) {
      // 1正选
      if (this.oldOptions.includes("all") && !val.includes("all")) {
        this.value5 = [];
        // 每次都要把选中的值保存
        this.oldOptions = this.value5;
        this.drawByKeywords();
        return;
      }
      // 2反选
      if (!this.oldOptions.includes("all") && val.includes("all")) {
        this.value5 = [];
        this.options.forEach(item => {
          this.value5.push(item.value);
        });
        this.oldOptions = [];
        // 每次都要把选中的值保存
        this.oldOptions = this.value5;
        this.drawByKeywords();
        return;
      }
      // 3其他选项未全部选中
      if (this.oldOptions.includes("all") && val.includes("all")) {
        const index = val.indexOf("all");
        val.splice(index, 1);
        this.value5 = val;
        // 每次都要把选中的值保存
        this.oldOptions = this.value5;
        this.drawByKeywords();
        return;
      }
      // 4其他选项已经全部选中
      if (!this.oldOptions.includes("all") && !val.includes("all")) {
        if (val.length === this.options.length - 1) {
          this.value5 = ["all"].concat(val);
          // 每次都要把选中的值保存
          this.oldOptions = this.value5;
        }
        this.drawByKeywords();
        return;
      }
    },
    drawByKeywords() {
      let dom = document.getElementById("ChartRank");
      this.drawEchart(dom, this.list, this.chartData.type, this.value5);
    },
    changeTime(val) {
      if (!val) {
        this.showChartChild(this.chartData.taskId, this.chartData.type);
        return;
      }
      // 有日期则往下走
      let startTime = this.DateMsg.DateValue[0],
        endTime = this.DateMsg.DateValue[1];
      this.showChartChild(
        this.chartData.taskId,
        this.chartData.type,
        startTime,
        endTime
      );
    },
    //获取子组件传来按日按周按月
    getDayFromChild(childMsg) {
      this.value = childMsg;
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },
    // 获取chartRank表格数据
    showChartChild(taskId, type, startTime, endTime, key_arr) {
      // 首次不传key_arr的时候默认全部
      if (key_arr === undefined && this.chartData.itemType === 1) {
        let key_arr;
        this.options = [];
        this.value5 = [];
        this.oldOptions = [];
        if (this.chartData.keywor != "") {
          key_arr = this.chartData.keywords.split(",");
          this.options = [
            {
              value: "all",
              keyword: "全部"
            }
          ];
          key_arr.forEach((item, index) => {
            this.options.push({
              value: index,
              keyword: item
            });
          });
          this.options.forEach((item, index) => {
            this.value5.push(item.value);
            this.oldOptions.push(item.value);
          });
        }
        // console.log(this.options, "this.options");
        // console.log(this.value5, "this.value5");
        // console.log(this.oldOptions, "this.oldOptions");
      } else {
      }
      this.dialogLoading = true;
      let opts = {
        taskId: taskId,
        startTime: this.DateMsg.DateValue[0],
        endTime: this.DateMsg.DateValue[1]
      };
      if (startTime) {
        opts.startTime = startTime;
      }
      if (endTime) {
        opts.endTime = endTime;
      }
      this.$axios
        .post(this.chartData.url, opts)
        .then(res => {
          // console.log("历史排名返回", res);
          let code = res.data.code;
          if (code == 0) {
            let list = res.data.data;
            if (list == "") {
              this.list = null;
              this.chartData.chartShow = false;
              this.dialogLoading = false;
              return;
            }
            this.$nextTick(() => {
              this.chartData.chartShow = true;
              let dom = document.getElementById("ChartRank");
              if (this.chartData.itemType == 1) {
                // 画关键词图
                this.list = res.data.data;
                this.drawEchart(dom, list, type);
              } else {
                // 画类目图
                this.list = null;
                this.drawEchart_cate(dom, list, type);
              }
            });
          } else if (code == 500) {
            this.chartData.chartShow = false;
          }
          this.dialogLoading = false;
        })
        .catch(err => {
          // console.log("历史排名报错");
          this.dialogLoading = false;
        });
    },

    //画关键词图
    drawEchart(dom, list, type, arr) {
      this.dialogLoading = true;
      let et = echarts.init(dom);
      et.clear();
      let option = mock.rankData;
      option.tooltip.formatter = function(params) {
        let str = `${params[0].name}<br />`;
        params.forEach(item => {
          if (item.data.value[1] !== null) {
            str += `${item.marker} 关键词：${item.seriesName} (${
              item.data.value[1]
            }名)<br/>`;
          } else {
            str += `${item.marker} 关键词：${item.seriesName} ( -- )<br/>`;
          }
        });
        return str;
      };
      // console.log(list, "排名数据");
      //legend
      option.legend.data = [];
      // legend 不可点击
      option.legend.selectedMode = false;
      option.grid.top = "17%";
      if (!list) {
        this.chartData.chartShow = false;
        this.dialogLoading = false;
        return;
      } else {
        this.chartData.chartShow = true;
      }
      list.forEach(item => {
        if (item.list != "") {
          option.legend.data.push(item.keyword);
        }
      });
      // 默认从第一个开始
      // let selected = {};
      // option.legend.data.forEach((item, index) => {
      //   if (index === 0) {
      //     // selected
      //     selected[item + ""] = true;
      //   } else {
      //     // selected
      //     selected[item + ""] = false;
      //   }
      // });
      // option.legend.selected = selected;
      // 默认从第一个开始 end
      // 横坐标
      // let xArr = [];
      // if (list[0].list != "") {
      //   list[0].list.forEach(v => {
      //     xArr.push(v.sendTime);
      //   });
      // }
      // // 纵坐标
      // let yArr = [];
      let datas = [];
      option.series = [];
      // console.log(list);
      // valueArr 用于计算最大值的集合
      let valueArr = [];
      list.forEach((item, index) => {
        datas.push({
          name: item.keyword,
          data: []
        });
        if (item.list != "") {
          item.list.forEach((v, k) => {
            // console.log(v);
            if (type === 1) {
              // if (v.webRank)
              // if (v.webRank !== null) {
              datas[index].data.push({
                name: v.sendTime,
                value: [v.sendTime, v.webRank]
              });
              // }
              // 最大值
              valueArr.push(v.webRank);
            }
            if (type === 2) {
              // if (v.appRank !== null) {
              datas[index].data.push({
                name: v.sendTime,
                value: [v.sendTime, v.appRank]
              });
              // }
              valueArr.push(v.appRank);
              // 最大值
            }
          });
        }
      });
      // console.log(datas, "处理好的数据");
      // let newDatas = datas.filter(item => {
      //   if (
      //     item.data.every((v, index, arr) => {
      //       return v.value[1] === null;
      //     })
      //   ) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // });
      let newDatas = JSON.parse(JSON.stringify(datas));
      // console.log(newDatas);
      // console.log(valueArr);
      let max = Math.max(...valueArr);
      option.yAxis.max = getBigNum(max);
      option.series = [];
      // 点击确认按钮的todonow
      if (arr) {
        let arr_ = JSON.parse(JSON.stringify(arr));
        if (arr_.includes("all")) {
          arr_.splice(0, 1);
        }
        let keyword_arr = [];
        arr_.forEach(item => {
          let data = this.options.find(el => el.value === item);
          if (data) {
            keyword_arr.push(data.keyword);
          }
        });
        let options_arr = [];
        keyword_arr.forEach(item => {
          let data = newDatas.find(el => el.name === item);
          if (data) {
            options_arr.push(data);
          }
        });
        // console.log(keyword_arr, "选择了关键词，value5");
        // console.log(options_arr, "newDatas");
        options_arr.forEach((item, index) => {
          if (item.data.length > 0) {
            option.series.push({
              name: item.name,
              type: "line",
              // showSymbol: false,
              // hoverAnimation: false,
              data: item.data
            });
          }
        });
      } else {
        newDatas.forEach((item, index) => {
          if (item.data.length > 0) {
            option.series.push({
              name: item.name,
              type: "line",
              // showSymbol: false,
              // hoverAnimation: false,
              data: item.data
            });
          }
        });
      }
      // console.log(valueArr, "最大值集合");
      // console.log(option.series, "series");
      if (option.series == "") {
        this.chartData.chartShow = false;
      } else {
        this.chartData.chartShow = true;
      }
      option.xAxis.type = "time";
      delete option.xAxis.data;
      // list.forEach((item, index) => {
      //   let yArr = [];
      //   item.list.forEach((v, k) => {
      //     if (type === 1) {
      //       if (v.webRank !== null) {
      //         yArr.push(v.webRank);
      //       }
      //     }
      //     if (type === 2) {
      //       if (v.appRank !== null) {
      //         yArr.push(v.appRank);
      //       }
      //     }
      //   });
      //   option.series.push({
      //     type: "line",
      //     name: item.keyword,
      //     data: yArr
      //   });
      // });
      // option.xAxis.data = xArr;
      this.echartData = option;
      // legend 点击事件
      // var _this = this;
      // et.on("legendselectchanged", function(param) {
      //   //console.log(param);
      //   console.log(param.selected, "点击legend");
      //   let arr = [];
      //   for (let key in param.selected) {
      //     if (param.selected[key] === true) {
      //       arr.push(key);
      //     }
      //   }
      //   // console.log(arr);
      //   if (arr.length > 0) {
      //     arr.forEach(item => {
      //       let value = _this.options.find(el => el.keyword === item).value;
      //       if (value) {
      //         console.log(value);
      //       }
      //     });
      //   }
      // });
      this.dialogLoading = false;
    },
    //类目图
    drawEchart_cate(dom, list, type) {
      this.dialogLoading = true;
      let et = echarts.init(dom);
      et.clear();
      let option = mock.rankData;
      option.tooltip.formatter = function(params) {
        let str = `${params[0].name}<br />`;
        params.forEach(item => {
          let name = item.seriesName;
          let num = name.split(">").length - 1 + 1;
          if (item.data.value[1] !== null) {
            str += `${item.marker} 排名： ${item.data.value[1]}名<br/>`;
          } else {
            str += `${item.marker} 排名： ( -- )<br/>`;
          }
        });
        return str;
      };
      // console.log(list, "11");
      option.legend.data = ["类目排名搜索"];
      // legend 不可点击
      option.legend.selectedMode = false;
      option.grid.top = "10%";
      // console.log(list, "排名数据");
      // // 横坐标
      // let xArr = [];
      // // // 纵坐标
      // let yArr = [];
      // list.forEach(item => {
      //   if (item.sendTime != "") {
      //     xArr.push(item.sendTime.slice(0, 10));
      //     if (type === 1) {
      //       yArr.push(item.webRank);
      //     }
      //     if (type === 2) {
      //       yArr.push(item.appRank);
      //     }
      //   }
      // });
      // option.xAxis.data = xArr;
      let valueArr = [];
      let data = [];
      list.forEach((item, index) => {
        if (type === 1) {
          // if (item.webRank !== null) {
          data.push({
            name: item.sendTime,
            value: [item.sendTime, item.webRank]
          });
          valueArr.push(item.webRank);
          // }
        }
        if (type === 2) {
          // if (item.appRank !== null) {
          data.push({
            name: item.sendTime,
            value: [item.sendTime, item.appRank]
          });
          valueArr.push(item.appRank);
          // }
        }
      });
      if (data == "") {
        this.chartData.chartShow = false;
        this.dialogLoading = false;
        return;
      }
      // 最大值
      let max = Math.max(...valueArr);
      option.yAxis.max = getBigNum(max);
      // end
      option.xAxis.type = "time";
      option.series = [];
      // console.log(data, "类目处理好的data");
      option.series.push({
        name: "类目搜索排名",
        type: "line",
        data: data
      });
      // console.log(option.series, "类目series");
      this.echartData = option;
      this.dialogLoading = false;
      // console.log(option.yAxis);
    },
    closeClear() {
      let dom = document.getElementById("ChartRank");
      let et = echarts.init(dom);
      et.clear();
      this.chartData.chartShow = false;
    },
    // 关闭弹窗时清空日期
    clearDate() {
      this.DateMsg.DateValue = [getDay().today, getDay().today];
    }
  },
  computed: {},
  watch: {
    // "chartData.keywords": {
    //   immediate: true,
    //   handler: function(val) {
    //     // console.log(val, "keywords");
    //     this.options = [
    //       {
    //         value: "all",
    //         keyword: "全部"
    //       }
    //     ];
    //     this.value5 = ["all"];
    //     this.oldOptions = ["all"];
    //     let key_arr;
    //     if (val != "") {
    //       key_arr = val.split(",");
    //       key_arr.forEach((item, index) => {
    //         this.options.push({
    //           value: index,
    //           keyword: item
    //         });
    //       });
    //       this.options.forEach((item, index) => {
    //         this.value5.push(item.value);
    //         this.oldOptions.push(item.value);
    //       });
    //     }
    //   }
    // }
    // shouldGetDate() {
    //   this.showChartChild(this.chartData.taskId, this.chartData.type);
    // },
    // 监控每日每周每月
    // "DateMsg.DateValue"(newVal, oldVal) {
    //   // console.log(newVal === null);
    //   if (newVal === null) {
    //     // 如果没有日期
    //     this.showChartChild(this.chartData.taskId, this.chartData.type);
    //     return;
    //   }
    //   // 有日期则往下走
    //   let startTime = this.DateMsg.DateValue[0],
    //     endTime = this.DateMsg.DateValue[1];
    //   this.showChartChild(
    //     this.chartData.taskId,
    //     this.chartData.type,
    //     startTime,
    //     endTime
    //   );
    // }
  }
};
</script>

<style lang='scss' scoped>
.chartRank {
  border: 1px solid transparent;
  box-sizing: border-box;
  width: 96%;
  // overflow: hidden;
  header {
    height: 29px;
    line-height: 40px;
    width: 100%;
    background: #f5f7fa;
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
    border: 1px solid #00c0de;
    text-align: center;
    color: #00c0de;
    border-radius: 5px;
    margin-left: 3px;
    cursor: pointer;
  }
  .active {
    background: #00c0de !important;
    color: #fafafa !important;
  }
}
</style>
