<!-- 评价数表格 -->
<template>
  <div class="chartRank" v-loading="dialogLoading">
    <!-- {{chartData}} -->
    <header style="position:relative">
      <!-- 选择关键词 -->
      <div style="position:absolute;right:0px;top:-4px;" v-if="this.chartData.itemType===1?true:false">
        <el-select :popper-append-to-body="false" @change="selectAll" v-model="value5" placeholder="默认全部关键词,可筛选" style='min-width:250px' :multiple="true" collapse-tags size="mini">
          <el-option v-for="item in options" :key="item.value" :label="item.keyword" :value="item.value">
          </el-option>
        </el-select>
        <el-button size="mini" type="primary" @click="Copy" ref="copy" class="copy" data-clipboard-action="copy" data-clipboard-target="#text">复制已选关键词</el-button>
        <table id="text" style="position:fixed;left:-4000px">
          <tbody>
            <tr v-for="item in select_keyword">
              {{item.keyword}}
            </tr>
          </tbody>
        </table>
      </div>
      <div style="position:absolute;left:0px;top:-3px;">
        <el-date-picker :picker-options="onlyOneYear" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" @change="changeTime" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" @close="closeClear" :clearable="false" size="mini">
        </el-date-picker>
      </div>
    </header>
    <main style="padding:10px 20px;border:1px solid #e4e4e4;box-size:border-box;">
      <none-page v-if="!chartData.chartShow" noBack>暂无数据</none-page>
      <div v-show="chartData.chartShow" >
        <echart auto-resize :options="echartData" id="ChartRank" style="width:100%;height:400px;" :style="{height:fullscreen?'700px':'400px'}"></echart>
      </div>
    </main>
  </div>
</template>

<script>
import Clipboard from "clipboard";
let echarts = require("echarts/lib/echarts");
// console.log(echarts, "echarts");
import mock from "@/api/json.js";
export default {
  name: "chartRank",
  props: ["chartData",'createTime','fullscreen','xAxisName','yAxisName'],
  data() {
    let vm=this;
    return {
      echartData: {
        yAxis:{
          name:"排名"
        }
      },
       onlyOneYear:{
        disabledDate: (time)=> {
            if(this.createTime){
              //console.log(new Date().getTime() );
              let timeTismp=this.createTime.split(' ')[0];
              return time.getTime() > Date.now() || time.getTime() < new Date(timeTismp).getTime()-24*60*60*1000 ;
            }else{
                return time.getTime() > Date.now();
            }
        },
        // //前后限制一年
        // onPick(date) {
        //     // 当前时间
        //     let date_min = date.minDate;
        //     let date_max = date.maxDate;
        //     // console.log(date_min);
        //     if (date_max === null) {
        //         this.disabledDate = function (time) {
        //             let curDate = date_min.getTime();
        //             let one_year = 365 * 24 * 3600 * 1000;
        //             // 上一年
        //             let curr_year = curDate - one_year;
        //             // 下一年
        //             let next_year = curDate + one_year;
        //             let small;
        //             if (next_year > Date.now()) {
        //                 // 如果下一年，比现在的时间大，则选择现在的时间禁用
        //                 small = Date.now()
        //             } else {
        //                 // 如果下一年都比当前时间少，则选择下一年为禁用
        //                 small = next_year
        //             }
        //             return time.getTime() < curr_year || time.getTime() > small;
        //         }
        //     } else {
        //         // 两个值都有的时候，表示重新打开时间框或者选好了。重置一下
        //         this.disabledDate = function (time) {
        //             return time.getTime() > Date.now();
        //         }
        //     }
        // },
        shortcuts: [{
            text: '今日',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '7天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();

                let setTime='';
                if(vm.createTime){
                    let time=vm.createTime.split(' ')[0];
                    let timeTismp=new Date(time);
                    // console.log(timeTismp);
                    // console.log(start.getTime() - 3600 * 1000 * 24 * 7);

                    if( (start.getTime() - 3600 * 1000 * 24 * 6) < timeTismp){
                        setTime=timeTismp;
                    }else{
                        setTime=start.getTime() - 3600 * 1000 * 24 * 6;
                    }
                }else{
                    setTime=start.getTime() - 3600 * 1000 * 24 * 6;
                   //console.log('6+d5wqe');
                };

                start.setTime(setTime);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '30天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();

                let setTime='';
                if(vm.createTime){
                    let time=vm.createTime.split(' ')[0];
                    let timeTismp=new Date(time);
                    // console.log(timeTismp);
                    // console.log(start.getTime() - 3600 * 1000 * 24 * 7);

                    if( (start.getTime() - 3600 * 1000 * 24 * 29) < timeTismp){
                        setTime=timeTismp;
                    }else{
                        setTime=start.getTime() - 3600 * 1000 * 24 * 29;
                    };

                }else{
                    setTime=start.getTime() - 3600 * 1000 * 24 * 29;
                   //console.log('6+d5wqe');
                };

                start.setTime(setTime);
                picker.$emit('pick', [start, end]);
            }
        }]
      },
      value: "1",
      DateMsg: {
        DateValue: [this.cfuns.getDay().today, this.cfuns.getDay().today],
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
      list: null,
      // 用于复制已选关键词的隐藏渲染
      select_keyword: []
    };
  },
  created() {
    //console.log(1111116000);
    console.log(this.createTime);
  },
  mounted() {
    // this.DateMsg.DateValue = [
    //   this.chartData.monitorFrom,
    //   this.chartData.monitorTo
    // ];
  },
  methods: {
    // 复制
    Copy() {
      // this.$message({
      //   dangerouslyUseHTMLString: true,
      //   message: "这是</br>片段"
      // });
      if (this.select_keyword.length === 0) {
        this.$message.warning("复制失败，请选择关键词");
        return;
      }
      this.clipboard = new Clipboard(".copy");
      let _this = this;
      this.clipboard.on("success", e => {
        this.$message({
          type: "success",
          message: "复制成功"
        });
        // 释放内存
        _this.clipboard.destroy();
      });
      this.clipboard.on("error", e => {
        // 不支持复制
        this.$message.error("浏览器不支持复制");
        // 释放内存
        _this.clipboard.destroy();
      });
    },
    // 选择
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
        // 自然搜索和广告搜索排名才对关键词进行处理
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
          // 用于复制数据
          this.select_keyword = this.options.slice(1);
        }
        // console.log(this.options, "this.options");
        // console.log(this.value5, "this.value5");
        // console.log(this.oldOptions, "this.oldOptions");
      } // 关键词处理end
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
      this.$api[this.chartData.url](opts)
        .then(data => {
          // console.log("历史排名返回", res);
          let code = data.code;
          if (code == 0) {
            let list = data.data;
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
                this.list = data.data;
                // console.log(list, "list");
                this.drawEchart(dom, list, type);
              } else if (this.chartData.itemType == 2) {
                // 画类目图
                this.list = null;
                this.drawEchart_cate(dom, list, type, this.chartData.asin);
              } else if (this.chartData.itemType == 4) {
                // 关联广告图
                this.list = null;
                this.drawEchart_adv(dom, list, type);
                // console.log(list, "list关联广告");
              } else if (this.chartData.itemType == 5) {
                this.list = null;
                this.drawEchart_flow(dom, list, type);
              }
            });
          } else if (code == 500) {
            this.chartData.chartShow = false;
          }
          this.dialogLoading = false;
        })
        .catch(err => {
          //   console.log("历史排名报错");
          this.chartData.chartShow = false;
          this.dialogLoading = false;
        });
    },
    //画关键词图
    drawEchart(dom, list, type, arr) {
      this.dialogLoading = true;
      let et = echarts.init(dom);
      et.clear();
      let option = mock.rankData;
      //   console.log(option, "option");
      option.tooltip.formatter = function(params) {
        // 1
        let str = `${params[0].name}<br />`;
        params.forEach(item => {
          // console.log(item, "formatter_item");
          let marker = item.marker;
          let name = item.seriesName;
          // console.log(item.data.formatter_data);
          if (item.data.formatter_data) {
            if (
              item.data.formatter_data.webRankPages != null &&
              item.data.formatter_data.webPagesRank != null
            ) {
              str += `${marker} ${name}关键词排名：第 ${
                item.data.formatter_data.webRankPages
              }页第${item.data.formatter_data.webPagesRank}名<br/>`;
            } 
            // else {
            //   str += `${marker} ${name}关键词排名：--<br/>`;
            // }
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
                value: [v.sendTime, v.webRank],
                formatter_data: {
                  webPagesRank: v.webPagesRank,
                  webRankPages: v.webRankPages
                }
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
      //   console.log(datas, "处理好的数据");
      //   let newDatas = datas.filter(item => {
      //去除为如果没一项都是null则不继续
      //     if (
      //       item.data.every((v, index, arr) => {
      //         return v.value[1] === null;
      //       })
      //     ) {
      //       return false;
      //     } else {
      //       return true;
      //     }
      //   });
      let newDatas = JSON.parse(JSON.stringify(datas));
      //   console.log(newDatas);
      // console.log(valueArr);
      let max = Math.max(...valueArr);
      option.yAxis.max = this.cfuns.getBigNum(max);
      option.series = [];
      // arr是选择的关键词
      if (arr) {
        let arr_ = JSON.parse(JSON.stringify(arr));
        if (arr_.includes("all")) {
          arr_.splice(0, 1);
        }
        let keyword_arr = [];
        // 用于复制数据
        this.select_keyword = [];
        arr_.forEach(item => {
          let data = this.options.find(el => el.value === item);
          if (data) {
            keyword_arr.push(data.keyword);
            // 用于复制数据
            this.select_keyword.push({ keyword: data.keyword });
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
              data: item.data,
              
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
      option.xAxis.name = this.xAxisName;
      option.yAxis.name = this.yAxisName;
      option.yAxis.nameLocation = "start";
      // option.xAxis.data = xArr;
      this.echartData = option;
      this.dialogLoading = false;
    },
    //类目图
    drawEchart_cate(dom, list, type, asin) {
      this.dialogLoading = true;
      let et = echarts.init(dom);
      et.clear();
      let option = mock.rankData;
      option.tooltip.formatter = function(params) {
        // 1
        let str = `${params[0].name}<br />`;
        params.forEach(item => {
          // console.log(item, "formatter_item");
          let marker = item.marker;
          let name = item.seriesName;
          // console.log(item.data.formatter_data);
          if (item.data.formatter_data) {
            if (
              item.data.formatter_data.webRankPages != null &&
              item.data.formatter_data.webPagesRank != null
            ) {
              str += `${marker} ${name}类目排名：第 ${
                item.data.formatter_data.webRankPages
              }页第${item.data.formatter_data.webPagesRank}名<br/>`;
            } else {
              str += `${marker} ${name}类目排名：--<br/>`;
            }
          }
        });
        return str;
      };
      // console.log(list, "11");
      option.legend.data = [asin];
      // legend 不可点击
      option.legend.selectedMode = false;
      option.grid.top = "10%";
      // console.log(list, "排名数据");
      // // 横坐标
      // option.xAxis.data = xArr;
      let valueArr = [];
      let data = [];
      list.forEach((item, index) => {
        if (type === 1) {
          // if (item.webRank !== null) {
          data.push({
            name: item.sendTime,
            value: [item.sendTime, item.webRank],
            formatter_data: {
              webPagesRank: item.webPagesRank,
              webRankPages: item.webRankPages
            }
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
      option.yAxis.max = this.cfuns.getBigNum(max);

      // end
      option.xAxis.type = "time";
      option.series = [];
      // console.log(data, "类目处理好的data");
      option.series.push({
        name: asin,
        type: "line",
        data: data
      });
      option.xAxis.name = this.xAxisName;
      option.yAxis.name = this.yAxisName;
      option.yAxis.nameLocation = "start";
      // console.log(option.series, "类目series");
      this.echartData = option;
      this.dialogLoading = false;
      // console.log(option.yAxis);
    },
    // 画关联广告图
    drawEchart_adv(dom, list, type) {
      this.dialogLoading = true;
      let et = echarts.init(dom);
      et.clear();
      let option = mock.rankData;
      option.tooltip.formatter = function(params) {
        let str = `${params[0].name}<br />`;
        params.forEach(item => {
          // console.log(item, "formatter_item");
          let marker = item.marker;
          let name = item.seriesName;
          // console.log(item.data.formatter_data);
          if (item.data.formatter_data) {
            if (
              item.data.formatter_data.adPagesRank != null &&
              item.data.formatter_data.adRankPages != null
            ) {
              str += `${marker} ${name}排名：第 ${
                item.data.formatter_data.adRankPages
              }页第${item.data.formatter_data.adPagesRank}名<br/>`;
            } else {
              str += `${marker} ${name}排名：--<br/>`;
            }
          }
        });
        return str;
      };
      // console.log(list, "11");
      option.legend.data = [];
      list.forEach(item => {
        if (item.adLevel === 1) {
          option.legend.data.push("位置1");
        } else if (item.adLevel === 2) {
          option.legend.data.push("位置2");
        } else if (item.adLevel === 3) {
          option.legend.data.push("位置3");
        }
      });
      // legend 可点击
      option.legend.selectedMode = true;
      option.grid.top = "10%";
      // console.log(list, "排名数据");
      // // 横坐标
      // option.xAxis.data = xArr;
      let valueArr = [];
      let datas = [];
      option.series = [];
      // console.log(list);
      // valueArr 用于计算最大值的集合
      list.forEach((item, index) => {
        let position = item.adLevel;
        if (position === 1) {
          position = "位置1";
        } else if (position === 2) {
          position = "位置2";
        } else if (position === 3) {
          position = "位置3";
        }
        datas.push({
          name: position,
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
                value: [v.sendTime, v.adRank],
                formatter_data: {
                  adPagesRank: v.adPagesRank,
                  adRankPages: v.adRankPages
                }
              });
              // }
              // 最大值
              valueArr.push(v.adRank);
            }
          });
        }
      });
      // console.log(datas, "datas");
      //   option.series.push({
      //     name: "类目排名",
      //     type: "line",
      //     data: data
      //   });
      // 最大值
      let max = Math.max(...valueArr);
      option.yAxis.max = this.cfuns.getBigNum(max);
      datas.forEach((item, index) => {
        if (item.data.length > 0) {
          option.series.push({
            name: item.name,
            type: "line",
            formatter_data: item.formatter_data,
            // showSymbol: false,
            // hoverAnimation: false,
            data: item.data
          });
        }
      });
      if (option.series == "") {
        this.chartData.chartShow = false;
      } else {
        this.chartData.chartShow = true;
      }
      option.xAxis.type = "time";
      delete option.xAxis.data;
      option.xAxis.name = this.xAxisName;
      option.yAxis.name = this.yAxisName;
      option.yAxis.nameLocation = "start";
      // option.xAxis.data = xArr;
      this.echartData = option;
      this.dialogLoading = false;
    },
    // 画关联流量图
    drawEchart_flow(dom, list, type) {
      this.dialogLoading = true;
      let et = echarts.init(dom);
      et.clear();
      let option = mock.rankData;
      option.tooltip.formatter = function(params) {
        // 1
        let str = `${params[0].name}<br />`;
        params.forEach(item => {
          // console.log(item, "formatter_item");
          let marker = item.marker;
          let name = item.seriesName;
          // console.log(item.data.formatter_data);
          if (item.data.formatter_data) {
            if (
              item.data.formatter_data.flowPagesRank != null &&
              item.data.formatter_data.flowRankPages != null
            ) {
              str += `${marker} ${name}排名：第 ${
                item.data.formatter_data.flowRankPages
              }页第${item.data.formatter_data.flowPagesRank}名<br/>`;
            } else {
              str += `${marker} ${name}排名：--<br/>`;
            }
          }
        });
        return str;
      };
      // console.log(list, "11");
      option.legend.data = [];
      list.forEach(item => {
        if (item.flowType === 0) {
          option.legend.data.push("买了有买");
        } else if (item.flowType === 1) {
          option.legend.data.push("看了又看");
        }
      });
      // legend 可点击
      option.legend.selectedMode = true;
      option.grid.top = "10%";
      // console.log(list, "排名数据");
      // // 横坐标
      // option.xAxis.data = xArr;
      let valueArr = [];
      let datas = [];
      option.series = [];
      // console.log(list);
      // valueArr 用于计算最大值的集合
      list.forEach((item, index) => {
        let flowType = item.flowType;
        if (flowType === 0) {
          flowType = "买了有买";
        } else if (flowType === 1) {
          flowType = "看了又看";
        }
        datas.push({
          name: flowType,
          data: []
        });
        if (item.list != "") {
          item.list.forEach((v, k) => {
            // console.log(v);
            if (type === 1) {
              // if (v.webRank)
              // if (v.webRank !== null) {
              // 2
              datas[index].data.push({
                name: v.sendTime,
                value: [v.sendTime, v.flowRank],
                formatter_data: {
                  flowPagesRank: v.flowPagesRank,
                  flowRankPages: v.flowRankPages
                }
              });
              // }
              // 最大值
              valueArr.push(v.flowRank);
            }
          });
        }
      });
      // console.log(datas, "datas");
      //   option.series.push({
      //     name: "类目排名",
      //     type: "line",
      //     data: data
      //   });
      // 最大值
      let max = Math.max(...valueArr);
      option.yAxis.max = this.cfuns.getBigNum(max);
      datas.forEach((item, index) => {
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
      if (option.series == "") {
        this.chartData.chartShow = false;
      } else {
        this.chartData.chartShow = true;
      }
      option.xAxis.type = "time";
      option.xAxis.name = this.xAxisName;
      option.yAxis.name = this.yAxisName;
      option.yAxis.nameLocation = "start";
      delete option.xAxis.data;
      // option.xAxis.data = xArr;
      this.echartData = option;
      this.dialogLoading = false;
    },
    closeClear() {
      let dom = document.getElementById("ChartRank");
      let et = echarts.init(dom);
      et.clear();
      this.chartData.chartShow = false;
    },
    // 关闭弹窗时清空日期
    clearDate() {
      this.DateMsg.DateValue = [
        this.cfuns.getDay().today,
        this.cfuns.getDay().today
      ];
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.chartRank {
  border: 1px solid transparent;
  box-sizing: border-box;
  width: 100%;
  // overflow: hidden;
  header {
    height: 31px;
    line-height: 40px;
    width: 100%;
    background: #f5f7fa;
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
