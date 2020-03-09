<!--  -->
<template>
  <div>
    <main style="padding:5px 15px;border:1px solid #e4e4e4;box-size:border-box;margin-top:-20px;">
      <div>
        <!-- {{this.taskStatus}} -->
        <!-- 12选择 -->
        <section class='choose'>
          <!-- <span style='margin-left:1em;' class="commonColor">曲线：</span> -->
          <el-button class='button' v-if="item.disabled" :class="{'active' : item.isSelected2}" v-for="(item,i) in this.diagramList2" :key="i" @click="changeDiagramBtnSelect(item,i,1)">{{item.name}}</el-button>
        </section>
        <!-- todoh -->
        <section style="margin-top:20px;width:100%;position:relative">
          <div style="position: absolute; right: 0px; top: 4px; z-index: 999;">
            <!-- <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate></dateRange> -->
            <el-date-picker @change="changeTime" unlink-panels :picker-options="onlyOneYear" v-model="DateMsg.DateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
            </el-date-picker>
          </div>
          <el-tabs type="border-card" v-model="tabNumber" @tab-click="ChangTABS">
            <el-tab-pane label="图表视图" name="0">
              <div v-loading="chartLoading">
                <none-page v-show="!this.chartShow" noBack Height="500px">暂无数据</none-page>
                <div style="width:100%" v-show="this.chartShow">
                  <!--图例-->
                  <div id="legend_div" class="legend-class" style="z-index: 10000">
                  </div>
                  <div class="export" @click="downloadExl_6">
                    <i class="el-icon-download echart_buttom_right" style="top:25px" type="text">
                    </i>
                  </div>
                  <echart auto-resize :options="echartsData" id="tab3Chart" style="width:100%; height:500px;margin-top:30px;"></echart>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="列表视图" name="1">
              <!-- todoh -->
              <!-- {{this.tableData}} -->
              <el-table :data="tableData" style="width: 100%;overflow:auto;" height="530px">
                <el-table-column prop="occurredTime" align="center" label="时间" width="180">
                </el-table-column>
                <el-table-column prop="newReviewCnt" align="center" label="新增评价数" width="120">
                  <template slot-scope="scope">
                    <span class="color">{{scope.row.newReviewCnt}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="rank" align="center" label="BSR排名" width="120">
                  <template slot-scope="scope">
                    <span class="color">{{scope.row.rank!=0?scope.row.rank:"-"}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" align="center" label="调整项" width="140">
                  <template slot-scope="scope">
                    <span class="color">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="eventOld" align="left" label="调整内容">
                  <template slot-scope="scope">
                    <span>{{scope.row.name}}变动</span>
                    <span class="detail color" @click="handleShow(scope.row)">【详情】</span>
                    <div v-show="scope.row.show">
                      <section>
                        <span class="color">调整前：</span>
                        <span>{{scope.row.eventOld?scope.row.eventOld:"-"}}</span>
                      </section>
                      <section>
                        <span class="color">调整后：</span>
                        <span>{{scope.row.eventNew?scope.row.eventNew:"-"}}</span>
                      </section>
                    </div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="eventNew" align="center" label="调整后">
                </el-table-column> -->
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import {
  proDefaultDay,
  ProductReviewDayCurrentList,
  ProductEventList
} from "@/api/myApi";
import { getDay, isInArray, getBigNum } from "@/api/functions.js";
import dateRange from "@/components/common/datePick"; //日期
let echarts = require("echarts/lib/echarts");
export default {
  components: { dateRange },
  //   task为了拿到parentSkus
  props: ["taskStatus"],
  data() {
    return {
      detailShow: false,
      chartShow: false,
      chartLoading: false,
      echartsData: {},
      tabNumber: "0",
      usefulIndex: [],
      // todod
      diagramList2: [
        {
          isSelected2: true,
          name: "全选",
          type: -1,
          disabled: false
        },
        {
          isSelected2: true,
          name: "上下架",
          type: 0,
          disabled: false
        },
        {
          isSelected2: true,
          name: "标题",
          type: 1,
          disabled: false
        },
        {
          isSelected2: true,
          name: "图片",
          type: 2,
          disabled: false
        },
        {
          isSelected2: true,
          name: "价格",
          type: 3,
          disabled: false
        },
        {
          isSelected2: true,
          name: "行业",
          type: 4,
          disabled: false
        },
        {
          isSelected2: true,
          name: "best seller",
          type: 5,
          disabled: false
        },
        {
          isSelected2: true,
          name: "sku",
          type: 6,
          disabled: false
        },
        {
          isSelected2: true,
          name: "FBA",
          type: 7,
          disabled: false
        },
        {
          isSelected2: true,
          name: "BUY BOX",
          type: 8,
          disabled: false
        },
        {
          isSelected2: true,
          name: "跟卖卖家数量",
          type: 9,
          disabled: false
        },
        {
          isSelected2: true,
          name: "第一个评价",
          type: 10,
          disabled: false
        },
        {
          isSelected2: true,
          name: "促销活动",
          type: 11,
          disabled: false
        },
        {
          isSelected2: true,
          name: "合并与分离",
          type: 12,
          disabled: false
        }
      ],
      // 日期选择传送到子组件
      DateMsg: {
        DateValue: [getDay(proDefaultDay).computedDay, getDay().today],
        type: "daterange"
      },
      // mouseover在mark点上显示变化项
      markPoint: "",
      // 保存重新处理过的event数据，内含图标，颜色等
      eventData: "",
      // 列表视图的所有数据todod
      tableData: [
        // {
        //   date: "2016-05-02",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄"
        // },
        // {
        //   date: "2016-05-04",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1517 弄"
        // },
        // {
        //   date: "2016-05-01",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1519 弄"
        // },
        // {
        //   date: "2016-05-03",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1516 弄"
        // }
      ],
      tool: { x: "" }
    };
  },

  created() {},
  async mounted() {
    // let _this = this;
    // _this.echartsRelize(
    //   _this,
    //   document.getElementById("tab3Chart"),
    //   window,
    //   450,
    //   550
    // );
    // window.onresize = function() {
    //   _this.echartsRelize(
    //     _this,
    //     document.getElementById("tab3Chart"),
    //     window,
    //     450,
    //     550
    //   );
    // };
    let events = await this.getProductEventList(proDefaultDay);
    // console.log(events);
    this.getProductReviewDayCurrentList(proDefaultDay, true);
    // let events = await this.getProductEventList(
    //   proDefaultDay,
    //   "2018-06-11",
    //   "2018-06-16"
    // );
    // this.getProductReviewDayCurrentList(
    //   proDefaultDay,
    //   "2018-6-10",
    //   "2018-6-15",
    //   true
    // );
  },
  methods: {
    //this.tableData.length > 0
    downloadExl_6() {
      // 如果有
      if (this.echartsData) {
        let name = this.$route.query.sku + "动态追踪.xlsx";
        // console.log(this.tableData);
        let arr = [];
        if (this.tableData.length > 0) {
          // 如果有变化项数据，从this.tableData获取所有下载数据
          let data = JSON.parse(JSON.stringify(this.tableData));
          data.forEach((item, index) => {
            for (let key in item) {
              if (item[key] === "" || item[key] === null) {
                item[key] = "-";
              }
            }
            arr.push({
              日期: item.occurredTime,
              新增评价数: item.newReviewCnt,
              BSR排名: item.rank != 0 ? item.rank : "-",
              变化项: item.name,
              变化前: item.eventOld,
              变化后: item.eventNew
            });
          });
        } else {
          // 如果没有变化项数据，从this.echartsData获取两条线的数据下载
          // console.log(this.echartsData, "this.echartsData");
          let series = JSON.parse(JSON.stringify(this.echartsData.series));
          let xAx = JSON.parse(JSON.stringify(this.echartsData.xAxis.data));
          // console.log(series, "series");
          // console.log(xAx, "xAx");
          xAx.forEach((item, index) => {
            arr.push({
              日期: item,
              BSR排名: series[0].data[index],
              新增评价数: series[1].data[index]
            });
          });
          // console.log(arr, "arr");
        }
        this.$store.commit("common/downName", name);
        this.$nextTick(() => {
          this.download(arr, null, this.$route.query.sku);
        });
        return;
      } else {
        this.$message.warning("暂无变化项数据");
      }
    },
    // todom
    handleShow(row) {
      let data = this.tableData;
      for (let i = 0; i < data.length; i++) {
        if (data[row.index].show === false) {
          data[row.index].show = true;
          this.$nextTick(() => {
            this.tableData = Object.assign([], data);
          });
          return;
        }
        if (data[row.index].show === true) {
          data[row.index].show = false;
          this.$nextTick(() => {
            this.tableData = Object.assign([], data);
          });
          return;
        }
      }
    },
    async changeFun() {
      let events = await this.getProductEventList(null);
      // console.log(events);
      if (events) {
        this.getProductReviewDayCurrentList(null, true);
      }
    },
    changeTime() {
      this.changeFun();
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },

    //获取echart新增评价数据todom1
    getProductReviewDayCurrentList(day, isGetNew) {
      //   this.Loading = true; // loading动画
      if (isGetNew === false) {
        //如果这个参数为false,则不需要请求新的数据。
        let list = this.$store.state.competitive.ProductReviewDayCurrentList;
        // console.log(list, "vuex的list");
        this.drawChart(list, this.usefulIndex);
        return;
      }
      this.chartLoading = true;
      this.$axios
        .post(ProductReviewDayCurrentList, {
          sku: this.taskStatus.sku || this.$route.query.sku,
          startTime: this.DateMsg.DateValue[0],
          endTime: this.DateMsg.DateValue[1],
          taskType: parseInt(this.$route.query.taskType) || 0,
          taskId: parseInt(this.$route.query.taskId)
          // monitorTo:
          //   this.taskStatus.monitorTo ||
          //   this.$route.query.monitorTo ||
          //   getDay().today
        })
        .then(res => {
          // console.log("正在做：监控跟踪——新增评价数", res.data.data);
          let code = res.data.code;
          if (code != 0) {
            this.chartLoading = false;
            this.chartShow = false;
            return;
          }
          let list = res.data.data; //新增评价数
          if (list == "") {
            this.chartShow = false;
            this.chartLoading = false;
            this.echartsData = {};
            return;
          } else {
            this.chartShow = true;
          }
          // 如果是重新请求数据，则要在数据成功请求回来之后设置按钮选项为全部。并且usefulIndex也要设置成全选
          if (isGetNew === true) {
            this.diagramList2.forEach((item, index) => {
              item.isSelected2 = true;
            });
          }
          // if (list == "") {
          //     this.Loading = !this.Loading; // loading动画
          //   return;
          // }
          //   this.Loading = false; // loading动画
          //假数据
          // list = [
          //   {
          //     statTime: "2018-07-12",
          //     cnt: "60"
          //   },
          //   {
          //     statTime: "2018-07-13",
          //     cnt: "70"
          //   },
          //   {
          //     statTime: "2018-07-14",
          //     cnt: "80"
          //   },
          //   {
          //     statTime: "2018-07-15",
          //     cnt: "60"
          //   }
          // ];
          //
          this.$store.commit(
            "competitive/saveProductReviewDayCurrentList",
            list
          );
          this.drawChart(list, this.usefulIndex);
        })
        .catch(err => {
          this.chartLoading = false;
          // console.log("tab3的chart有错getProductReviewDayCurrentList", err);
          //   this.Loading = false; // loading动画
        });
    },
    // todom
    drawChart(list, usefulIndex) {
      this.chartLoading = true;
      // _this保存一下this.给下面formatter使用
      let _this = this;
      let myChart = echarts.init(document.getElementById("tab3Chart"));
      myChart.clear();
      let data0 = []; // 新增评分
      let data1 = []; // BSR排名
      let timeArr = []; // 横坐标值
      // console.log(list, "list6");
      for (let i = 0; i < list.length; i++) {
        // console.log(list[0]);
        let item = list[i];
        timeArr.push(list[i].statTime.slice(0, 10)); //横坐标
        data0.push(list[i].cnt); //新增评分纵坐标
        data1.push(list[i].rank); // BSR排名
      }
      // console.log(data1, "BSR");
      let length = timeArr.length;
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
        title: {
          text: ""
        },
        tooltip: {
          enterable: true,
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          },
          // todom
          formatter: function(
            params //数据格式
          ) {
            // mouseover横坐标显示——
            var relVal = "日期：" + params[0].axisValue + "<br/>";
            relVal += `${params[0].seriesName} ： ${params[0].data}<br/>
                        ${params[1].seriesName} ： ${params[1].data}<br/>
                      `;
            // console.log(params, "formatter_params");
            if (_this.markPoint != "") {
              // 1.有变化项的显示
              if (typeof _this.markPoint.data.name == "undefined") {
                return relVal;
              } else {
                // console.log(_this.markPoint);
                let str = `变化项 : ${_this.markPoint.name}</br>`;
                relVal = str + relVal;
              }
              return relVal;
            } else {
              // 2.正常显示
              return relVal;
            }
          }
        },
        legend: {
          data: [
            {
              name: "BSR排名",
              textStyle: { fontWeight: "bold", color: "#61A0A8" }
            },
            {
              name: "新增评价数",
              textStyle: { fontWeight: "bold", color: "#C23531" }
            }
          ]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        toolbox: {
          // x: this.tool.x,
          // show: true,
          feature: {
            // restore: {},
            // saveAsImage: { title: "保存" }
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
          data: []
          // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        calculable: true,
        yAxis: [
          {
            type: "value",
            name: "BSR排名",
            nameLocation: "start",
            inverse: true,
            min: 1,
            // max: 222,
            minInterval: 1,
            position: "left",
            axisLine: {
              lineStyle: {
                color: "#61A0A8"
              }
            }
          },
          {
            type: "value",
            name: "新增评价数",
            min: 0,
            // max: 55,
            position: "right",
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#C23531"
              }
            }
          }
        ],
        axisTick: {
          interval: 0
        },
        dataZoom: [
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
        ],
        series: []
      };
      if (length < 11) {
        delete option.dataZoom;
      }
      // 获取this中保存的事件markList,对其进行整理，整理成eventData，方便series进行push
      let eventData = []; // 保存改造数据用的空数组
      this.markList.forEach((item, index) => {
        // console.log(item, "this.markList的item");
        let name = "";
        let image = "";
        switch (item.eventType) {
          case 0:
            name = "上下架";
            image =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAYAAAAj6qa3AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABN9JREFUaN7tWH9MlGUc/zwv975iuSSXW2m+qC280xA9rFlebjZKxQzHDBUPa4XeH5Yjay7InEQeATp1qU0F2SSdQjHSqDmbK8WZKEIgcAcLdqf8KJioEw7vvXu//QEvupjjvfe4w5qff57tu+f74/N5n+f7Ps8DPMIjBAWXL0UbAZ63Pzaxht81c6b9VvhUoSM2dmDstyvzglUXC1Tg+q8n3BZ+iYjgeN0nKExLo/P0DUbFxeEzNgX7w8IeWNAGABu6uhCPRbh94oQsebYjwWo1fNj6hDumoeGhFYAIABizx00q4+9s3cq62FU2PS2NDsKKdp1Oc4Gv0h6IkiT/jaXUaLXqcY1JLD2dsXtZR1QAhXjDRrFemHHkCFmwEI2rVg2XsIMKTiIzZh49GlF+zeq+bDb7KwTnb0HKFw80cQVUwL5FdWJiw0nRJIzZssXfeJoFUPY4u4AbbFZqaqCJD0IOzBi3eXPDV+FzhfkGQ9AFGGhu59gHcPrQtQ9iLOa6XOhFJ9LPnx8YFbtKKL2FqukdGDdtCpoAym9qoKurRSoO4N2LF70O3R0uVq/Xz3L2uFNNJmWUF4Q0cjqDAUX4GCvLy1XH7UQmdHFxWn+fPjdBe9PkYn5jVBS55RS2p6pqSIf+L6sQn/FdU3Pvp07ng6bX/TglNPS18HCu3SvI3TYbTAhDZWjokESM3lLKjoqa1tMSKaVUV6vl4/sW2EEObveECarnG6BDfEXFUMQVTH+zubf3jMOBOfBgWUWF2jRkY4e47T7UpVUAFkoGquLU+82BHS7m80pja+kEutTnYVkhItp8z+P7CniJLaQvWlpUzy/Ac/jZaFSW9lDT6ymcRtHkyWRh8fht9mzVefI9MfIOH+rSKsDtqU9FS0W1texzRGF+T8+QDmtxC7+PHs1VerPkZwsLHySEQpz9ROtpRWGh6r3/Nt7C693drd0tkVJKXZ2vfDSfBG254hJh7PHjMKEGroQE1Y5luInZvb2D9vhl6FASHa2W+ACWIBsTjx3T/+lc6W72/SCm+YxOLvD4vqCAAUCsDwLcT7By3rz77JrAFrE25jx8GHu1+Ws+CHXPHe90x5w6xZKogr5sb9caRyuYEV2U3dbWusfx0V3v6dNa42gWYM6LFVcASUIe3mDGnJxgC0C/0g22OitrAQMAjyfoAigQIrkr7ph9+1CM5ZR3/XrAmQsIo12trY+fo03u8QcO+Btu2N4D6utFkefXrWMMYGz//kDxZ0nsL3o+OXnaJcddqTYvz994fq8ABXq90ylJubksiQ4h5cKFYWfef0eIKHfclWrz84cr7LAJ0HcGk2VyUSm9YrEoLzl+x12LNDzt8XARbAO5LBYlz0MngAL91es7pWU1NfQyxlFVZqa/8eSzZCHHtm0RKxxMKlJx+RppARRM++GaSRqTno5mKqbkM2d8DmDG+zh49mzfG2BGRqDqDJgAylLlVtMR3ZNr1qAL7yGjs3NIxzJkILujg2uSb4Y0JCb2xfF6A1Vn0GBfH75zVMjixbYS0SSMkWWbTRQFgWhgVOzPTOoQji5dOtL1Bgy2F8QVfElm5r8FsF8Ud/OnrdaRri/g6HvA5jjbKTGH/6OkxJY86SR/rLS0zx4SEux6NF+GtELpDbXLXeVSlNkMoPye/X+w1x/hP4Z/ACtJIYnR1MfBAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA3LTI3VDEwOjE3OjQ5KzA4OjAwyvrcPwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wNy0yN1QxMDoxNzo0OSswODowMLunZIMAAABNdEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL2hvbWUvYWRtaW4vaWNvbi1mb250L3RtcC9pY29uXzV1ZzI2Z21ka3NlL21hcC1tYXJrZXIuc3ZnI5ZWNgAAAABJRU5ErkJggg==";
            break;
          case 1:
            name = "标题";
            image =
              "data:image/png;base64,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";
            break;
          case 2:
            name = "图片";
            image =
              "data:image/png;base64,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";
            break;
          case 3:
            name = "价格";
            image =
              "data:image/png;base64,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";
            break;
          case 4:
            name = "行业";
            image =
              "data:image/png;base64,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";
            break;
          case 5:
            name = "best seller";
            image =
              "data:image/png;base64,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";
            break;
          case 6:
            name = "sku";
            image =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAMZQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2vqLrAAAAEF0Uk5TAAUuSiag7+4Bgfv6gKalfyn2xJ/IHh/JL/dJw0hLxjAg9cr0BKmnTOfmcm8I4+UJZmMCLb3BAxvr6v5Nh4awtQzzx1ebAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAASAAAAEgARslrPgAAAP9JREFUOMutkm1bglAMhgdKKmrpSSFJxbJXtVIqzXf3//9UsnUZOxz45PNp23Ofa4wN4Lyy7ELBtjLtonOBR5WcotEuV1z8U7VWNvh1TOgyTVRQ6CrVvyoBt6EBDtebSjU5utbmo+/HVhvA8yksyWlv+H07jr0OJbYAAqrdcqIo6QqgRzXFSZ+SQAAht/DieGBqYd1R0T8Sg3sKhw9yjEcerqMUv8cn7T88o6ZAA6wX6b9qHQBGEhinljV5S/rvH+l9T5PAzHAwUf/f9yPTSX2eNu6GYNTpZmpmH6Iv9r/nGQAsfmJ/uYBMBSvE1RpytEHc5vkQ7fbzXAAOBzi3fgF+OkpLYpEeigAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNy0yN1QxMDoxODowNiswODowMEnz+aEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDctMjdUMTA6MTg6MDYrMDg6MDA4rkEdAAAATXRFWHRzdmc6YmFzZS11cmkAZmlsZTovLy9ob21lL2FkbWluL2ljb24tZm9udC90bXAvaWNvbl9paTh4NG51aG4xZy9tYXAtbWFya2VyLnN2ZwzJt7wAAAAASUVORK5CYII=";
            break;
          case 7:
            name = "FBA";
            image =
              "data:image/png;base64,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";
            break;
          case 8:
            name = "BUY BOX";
            image =
              "data:image/png;base64,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";
            break;
          case 9:
            name = "跟卖卖家数量";
            image =
              "data:image/png;base64,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";
            break;
          case 10:
            name = "第一个评价";
            image =
              "data:image/png;base64,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";
            break;
          case 11:
            name = "促销活动";
            image =
              "data:image/png;base64,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";
            break;
          case 12:
            name = "合并与分离";
            image =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAYAAAAj6qa3AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABSdJREFUaN7tWW1MU2cUfk6xUipMNGiMOmmzhYCLc9Itjsim2/wYM5EZTReVkOmWQTJN5EOHiIwO+RowFo2C4uYmYrTTiRLMQMaCMxF1JWQGXFC54CiYgaACbWc/zn5A0bgQ2tsWXObz5ya973nOeZ77vud97y3wDP9v0NilOlCkCpVKJykfZPeEhoTwYkkFvTp79nAhtbaV/Ft7+4DwXNLU+uvXgZhYXb3Z/J81YGJ1fpLydFCQ1y1ei7+SkyHHbhRHRlIMwnHX33+kOD6KDVjY24su6PHW2bPWF+gkpmdmPlyakC2sbm5+ig1gBoh8uvM7lNVpabQczdyZnIw/oKPUCRNE06rwM5eYzXyBz9GizEwjJUIgjQYgGsw57gYMCpdfzVcrNpWWYjEW0i/r1rnP2CeyLaMSTjh2zHgmvqF1c1SUq0Z4uVqQT7ffJ8pqjYbmo5f2bN7sKeF2UAvm06V586ST69b6v8JsNlT132utrRXLJxEbaF/jtBofs2zHDk8L/xfm8DF8lJLim1JQHPh6SIhYGtFrc7i56RBA8VKpw4HRuIeXjEbIaS9vqK8f/t3AW6g0NBRH4I9GH59ReYZ6i/Uzayb9uH07AGDBxo3O6hAxAwa3M3tXdzhMhSUIunzZprBMosbgYMNXCfdb14WH26+2ZnSgOiQEQciD5coVh3mlaEROZORwXZ42QN7eL72bMnfuaNvZMIaeuG2l5Tw1q9WmpKQdLcLt208OM9UkfiuY2tpsU/EeutRqrEEsfEym0egpCqW4PGWK/XzhcQPwPR/ntpkzHR4/AxbO0OlGEj6SEZhGs3iXTudoGs7xmmErdqIu0Qb8xCe99kocj3tAhWgi57dbPbeQwYk8N2x++Nr5PM4bsIUrrbf0eofHDzU32dt5m5SywMDRhntzAQeyQoGJ8Eb+ggWOpqFDfEPS6ERdYg0wqCf3BKgaGxFL6VhlMIwaMNTVJT04h2la7UhG2IV7vWg9Sf1aLU6hCEaZbFT+BMgRNzAwIPQLc4qbmpzVI/okKD+YJyjXnDiBrTiFerXa4UB7c3tyjXexntJVKoeF21FGO1F0/LhhecLfwgrnT6Diz+hpdABRJSUABzhlwLBA3kXJixY9dqdIVB1X+U1b05EjAM6LCRd9EjR0+CqmpldWci9CMefOHbE8ovEQZ/BOZ6dhZ1+VYut5UeJdMsD+vs4SqsLW3Nyx1s+vIY71OTmAhmrJYhkHAwZhkj7Isr2/fz9m41Pe297uceVSrEJsR4fxkuRLS/DBg67SuWwAoKE2MpnQjn3oTk/3uAHvch0CUlOB+Lr2AqPRVTo3fhD5nAGJRP6BX4/ym4sXUY7D2B0W5jb6oXcEQ0Nfp/BnWBigIcBmc5XWDTPAjsGCyEeyknbHxNi/5LhMGwwVf2GxINm2x3Y7JsZdwj1gwCAGvouvaxGuXePTOESmrCxX+VjHSygqI8Og3q5uo4YGd9frdgPsMAb0zRSWajQch9X8YU2N0wR74AfvCxeMFPiDQJ7rLR4z4NFUlWyw3IuO5l/xkPO7u0eL4nqkcFlXFwuSw+aI9esBtRqwWj1V5Zj9LyDPyFsWWBARgQL8LimvqIAB2yA89vYmRy6UzKznXFgjI43e26KF2vJyT9fl8kdRR2GuqWq5X3nz5oS45Sv8Z8lkVIfnqS883H6fU8mPI7KzjW8kprUeLSwcq7rGAUPb5cv505WJZWU+HXlSRVZFBaDVAl5j9kCeAuxbO1fr6/vo+gzPMB74B9HIMmki19l7AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA3LTI3VDEwOjI5OjAzKzA4OjAwbevbOQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wNy0yN1QxMDoyOTowMyswODowMBy2Y4UAAABMdEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL2hvbWUvYWRtaW4vaWNvbi1mb250L3RtcC9pY29uX2Y5NHEwZjloeGEvbWFwLW1hcmtlci5zdmdGvZIfAAAAAElFTkSuQmCC";
            break;
          default:
        }
        // alert(item.eventList.length);
        // 如果检查到每一个item的eventList的数组不是空，则继续遍历这个eventList,在遍历的时候push一些上面switch的参数和eventList里面的东西到eventData
        if (item.eventList.length > 0) {
          //遍历eventList
          item.eventList.forEach((v, k) => {
            eventData.push({
              eventType: item.eventType, //类型,第一层遍历的item,
              name: name, //给类型定名字  witch中的出来的s
              image: image, //给每一个类型起一个图片，3个字以下的没有icon上面switch将其设置为空
              markPointItem: {
                // 变更前
                eventOld: v.eventOld,
                // 变更后
                eventNew: v.eventNew,
                //评价数
                newReviewCnt: v.newReviewCnt,
                // BSR
                rank: v.rank,
                // 时间
                occurredTime: v.occurredTime,
                chartItem: "变化追踪",
                //name是上面的12项
                name: name
              }
            });
          });
        }
        //保存一下这个数据的格式，在列表模式中hi用到
      }); // this.markList forEach end
      this.eventData = Object.assign([], eventData);
      // console.log(eventData, "eventData重新整理的数据");
      //遍历整理好的数据，把每一项的markPointItem   push到新建的空数组tableListData中  列表视图要用到
      let tableListData = [];
      this.eventData.forEach((vItem, vIndex) => {
        tableListData.push(vItem.markPointItem);
      });
      // 列表数据（没usefulIndex）
      this.tableData = tableListData;
      if (this.tableData.length > 0) {
        this.tableData.forEach((item, index) => {
          item.show = false;
          item.index = index;
        });
      }
      // console.log(this.tableData, "this.tableData");
      //"画图时传入了usefulIndex" 对eventData和tableData再做一些筛选处理
      if (usefulIndex) {
        let newEventData = [];
        // console.log(this.usefulIndex, "画图时传入了usefulIndex");
        eventData.forEach((evItem, evIndex) => {
          // 判断元素是否存在于数组
          if (isInArray(this.usefulIndex, evItem.eventType) === true) {
            newEventData.push(evItem);
          }
        });
        // console.log(newEventData, 121212121);
        this.eventData = Object.assign([], newEventData);
        //在有usefulIndex的情况下。对eventData改造完成之后，改变tableData
        let tableListData = [];
        this.eventData.forEach((vItem, vIndex) => {
          tableListData.push(vItem.markPointItem);
        });
        // 列表数据（有usefulIndex）
        this.tableData = tableListData;
      }
      this.tableData.forEach(item => {
        if (item.eventOld == item.eventNew) {
          item.eventNew = "未调整";
        }
      });
      // 创建新的空数组，用于存放series中的markPoint的样式以及data 表现形式如下
      //   [{
      //     // markpoint的名字
      //     name: "上下架1",
      //     // 坐标点
      //     coord: ["07-12", 60],
      //     // 图片
      //     symbol:
      //       "image://https://images-na.ssl-images-amazon.com/images/I/41fKaKiocmL._SR38,50_.jpg"
      //   },
      //   {
      //     name: "上下架",
      //     coord: [2, 60]
      //   }]
      let seriesMarkPointStyleAndData = [];
      this.eventData.forEach((item, index) => {
        seriesMarkPointStyleAndData.push({
          name: item.name,
          coord: [
            item.markPointItem.occurredTime.slice(0, 10),
            // 跟哪条线
            item.markPointItem.rank
          ]
        });
        // 如果项内的图片不为空，则设置新数组的对象index的图片
        if (item.image != "") {
          seriesMarkPointStyleAndData[index].symbol = "image://" + item.image;
        }
        if (item.image == "") {
          seriesMarkPointStyleAndData[index].label = "#ccc";
        }
      }); // this.eventData forEach end
      // console.log(seriesMarkPointStyleAndData, "seriesMarkPointStyleAndData");
      option.series = [
        {
          name: "BSR排名",
          type: "line",
          yAxisIndex: 0,
          symbolSize: 4,
          data: data1,
          color: "#61A0A8",
          markPoint: {
            symbolSize: 40,
            symbolOffset: ["0%", "-80%"],
            // itemStyle: {
            //   normal: {
            //     label: {
            //       show: true,
            //       formatter: function(params, ticket, callback) {
            //         //格式化展现（标签+值）如果类型的名字长度3以下，则显示，如果长度大于3则显示图片
            //         // if (params.name.length <= 3) {
            //         // return params.name;
            //         // } else {
            //         return "";
            //         // }
            //       }
            //     }
            //   }
            // },
            // 用上面整理好的数据
            data: seriesMarkPointStyleAndData
            // data: [
            // {
            // markpoint的名字
            // name: "上下架",
            // 坐标点
            // coord: ["07-12", 60]
            // 图片
            // symbol:
            // "image://https://images-na.ssl-images-amazon.com/images/I/41fKaKiocmL._SR38,50_.jpg",
            // },
            // {
            //   name: "上下架",
            //   coord: [2, 60]
            // }
            // ]
          }
        },
        {
          name: "新增评价数",
          type: "line",
          yAxisIndex: 1,
          symbolSize: 4,
          data: data0,
          color: "#C23531"
          // markPoint: {
          //   symbolSize: 40,
          //   symbolOffset: ["0%", "-50%"],
          //   itemStyle: {
          //     normal: {
          //       label: {
          //         show: true,
          //         formatter: function(params, ticket, callback) {
          //           //格式化展现（标签+值）如果类型的名字长度3以下，则显示，如果长度大于3则显示图片
          //           // if (params.name.length <= 3) {
          //           // return params.name;
          //           // } else {
          //           return "";
          //           // }
          //         }
          //       }
          //     }
          //   },
          //   // 用上面整理好的数据
          //   data: seriesMarkPointStyleAndData
          //   // data: [
          //   // {
          //   // markpoint的名字
          //   // name: "上下架",
          //   // 坐标点
          //   // coord: ["07-12", 60]
          //   // 图片
          //   // symbol:
          //   // "image://https://images-na.ssl-images-amazon.com/images/I/41fKaKiocmL._SR38,50_.jpg",
          //   // },
          //   // {
          //   //   name: "上下架",
          //   //   coord: [2, 60]
          //   // }
          //   // ]
          // }
        }
      ]; // end series
      // todom
      // 最大值
      let max0 = Math.max(...data0);
      let max1 = Math.max(...data1);
      option.yAxis[1].max = getBigNum(max0);
      option.yAxis[0].max = getBigNum(max1);
      option.xAxis.data = timeArr;
      // myChart.setOption(option);
      this.echartsData = option;
      // 以下这个mouseover时间并不是横坐标事件，横坐标事件是默认的。是上面的xAxis中的formatter，以下的事件是鼠标出现在markpoint上以及圆点上时触发的事件，需要将其中的数据保存到this中，给formatter事件使用。
      myChart.on("mouseover", e => {
        // console.log(e);
        // 将markpoint的数据保存到this.用于上面横坐标xAxis的formatter
        this.markPoint = e;
      });
      myChart.on("mouseout", () => {
        this.markPoint = "";
      });
      this.chartLoading = false;
    },
    // 获取chart标记数据todonow
    getProductEventList(day) {
      return this.$axios
        .post(ProductEventList, {
          parentSku: this.taskStatus.parentSku || this.$route.query.sku,
          startTime: this.DateMsg.DateValue[0],
          endTime: this.DateMsg.DateValue[1],
          taskType: parseInt(this.$route.query.taskType) || 0,
          taskId: parseInt(this.$route.query.taskId)
          // monitorTo:
          //   this.taskStatus.monitorTo ||
          //   this.$route.query.monitorTo ||
          //   getDay().today
        })
        .then(res => {
          // console.log("mark点事件", res.data);
          let code = res.data.code;
          if (code == 0) {
            let data = res.data.data;
            // console.log(data);
            // todonow
            if (data.length > 0) {
              data.forEach((item, index) => {
                // console.log(item);
                let type = item.eventType;
                this.usefulIndex.push(item.eventType);
                if (this.usefulIndex.length > 0) {
                  this.diagramList2.forEach((v, k) => {
                    this.diagramList2[0].isSelected2 = true;
                    this.diagramList2[0].disabled = true;
                    if (type + 1 == k) {
                      this.diagramList2[k].isSelected2 = true;
                      this.diagramList2[k].disabled = true;
                    }
                    // else if (item.eventType + 1 != k) {
                    //   this.diagramList2[k].isSelected2 = false;
                    //   this.diagramList2[k].disabled = true;
                    // }
                  });
                }
              });
              this.markList = data; //mark点数据
              // console.log(this.usefulIndex);
            } else {
              this.markList = [];
              this.tableData = [];
            }
          } else {
            // 如果没有返回事件变化项
            this.diagramList2.forEach((item, index) => {
              item.disabled = true;
            });
          }
          return res.data.data;
          //假数据
          // this.markList = [
          //   {
          //     eventType: 0,
          //     eventList: [
          //       {
          //         newReviewCnt: 60,
          //         eventOld: "上架",
          //         eventNew: "下架",
          //         occurredTime: "2018-07-12 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 70,
          //         eventOld: "上架",
          //         eventNew: "下架",
          //         occurredTime: "2018-07-13 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 1,
          //     eventList: [
          //       {
          //         newReviewCnt: 40,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-12 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 50,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       }
          //     ]
          //   },
          //   ,
          //   {
          //     eventType: 2,
          //     eventList: [
          //       {
          //         newReviewCnt: 60,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-12 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 50,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 3,
          //     eventList: [
          //       {
          //         newReviewCnt: 70,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 50,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 14:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 4,
          //     eventList: [
          //       {
          //         newReviewCnt: 50,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-14 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 30,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-15 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 5,
          //     eventList: [
          //       {
          //         newReviewCnt: 40,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 20,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-14 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 6,
          //     eventList: [
          //       {
          //         newReviewCnt: 10,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-12 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 15,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 7,
          //     eventList: [
          //       {
          //         newReviewCnt: 20,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-12 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 25,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 8,
          //     eventList: [
          //       {
          //         newReviewCnt: 50,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-14 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 60,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-15 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 9,
          //     eventList: [
          //       {
          //         newReviewCnt: 55,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 60,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-14 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 10,
          //     eventList: [
          //       {
          //         newReviewCnt: 40,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-12 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 30,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 11,
          //     eventList: [
          //       {
          //         newReviewCnt: 10,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-12 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 60,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       }
          //     ]
          //   },
          //   {
          //     eventType: 12,
          //     eventList: [
          //       {
          //         newReviewCnt: 40,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-12 15:47:47"
          //       },
          //       {
          //         newReviewCnt: 60,
          //         eventOld:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra-c",
          //         eventNew:
          //           "Champion Women's Freedom Seamless Racerback Sport Bra",
          //         occurredTime: "2018-07-13 15:47:47"
          //       }
          //     ]
          //   }
          // ];
          //假数据end
        })
        .catch(err => {
          // console.log("tab3的getProductEventList有错", err);
          //   this.Loading = false; // loading动画
        });
    },
    // 点击切换评价选择todonow
    changeDiagramBtnSelect(item, i) {
      this.usefulIndex = [];
      // 如果用户点击了
      if (i != 0) {
        if (this.diagramList2[i].isSelected2 === true) {
          this.diagramList2[i].isSelected2 = false;
          this.diagramList2[0].isSelected2 = false; // 点的不是全部，则去掉全部的背景色
          // 两处都要进行以下操作，因为有reture
          // 点了哪个，就设置哪个的背景色，并且遍历第二行的按钮，把第二行选中的放进二维数组
          this.diagramList2.forEach((v, k) => {
            if (v.isSelected2 == true) {
              this.usefulIndex.push(v.type);
            }
          });
          // console.log(this.usefulIndex, "usefulIndex");
          // 传入一个false表示不需要请求信的数据。所以其他参数随便传。
          this.getProductReviewDayCurrentList(null, false);
          // let stateList = this.$store.state.competitive.IncrScoreCount; // 列表从vuex拿
          // if (stateList) {
          // this.contrIncrScoreCount(stateList, usefulIndex); // 画图
          // }
          return;
        }
        this.diagramList2[i].isSelected2 = true;
        let isAllSelect = true; //用于判断未隐藏的选项是否全选中
        this.diagramList2.forEach((v, k) => {
          if (v.isSelected2 == true) {
            this.usefulIndex.push(v.type);
          }
          if (k !== 0) {
            if (v.disabled === true) {
              if (v.isSelected2 === false) {
                isAllSelect = false;
              }
            }
          }
        });
        // console.log(this.diagramList2);
        // 如果未隐藏的选项全选中，则让全部也选中
        if (isAllSelect === true) {
          this.diagramList2[0].isSelected2 = true; // 全部的背景色
        }
        // 两处都要进行以下操作，因为有reture
        // console.log(this.usefulIndex, "usefulIndex");
        this.getProductReviewDayCurrentList(null, false);
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
        this.diagramList2.forEach((v, k) => {
          if (v.isSelected2 == true && k != 0) {
            this.usefulIndex.push(v.type);
          }
        });
        // console.log(this.usefulIndex, "usefulIndex");
        this.getProductReviewDayCurrentList(null, false);
      }
    },
    // todom
    async ChangTABS(val) {
      if (val.index == 0) {
      }
      // 如果点了tab的sku
      if (val.index == 1) {
      }
    }
    // 与列表视图相关的函数。
  },
  computed: {},
  watch: {
    // 监控日期组件
    // "DateMsg.DateValue"(newVal, oldVal) {
    //   if (!newVal) {
    //     // 去掉日期的时候恢复默认
    //     (async () => {
    //       let events = await this.getProductEventList(
    //         proDefaultDay,
    //         null,
    //         null
    //       );
    //       this.getProductReviewDayCurrentList(proDefaultDay, null, null, true);
    //     })();
    //     return;
    //   }
    //   // 不是清空时间的请求方式
    //   let startTime = newVal[0],
    //     endTime = newVal[1];
    //   (async () => {
    //     let events = await this.getProductEventList(
    //       //上线要改
    //       proDefaultDay,
    //       startTime,
    //       endTime
    //     );
    //     this.getProductReviewDayCurrentList(null, startTime, endTime, true);
    //   })();
    // }
  }
};
</script>

<style lang='scss' scoped>
.choose {
  font-size: 14px;
  padding: 0px 5px 0px 0px;
  .button {
    display: inline-block;
    padding: 5px 14px;
    border: 1px solid #00c0de;
    text-align: center;
    color: #00c0de;
    border-radius: 5px;
    margin-left: 5px !important;
    // cursor: pointer;
    margin-top: 10px;
  }
  button:disabled {
    opacity: 0.8;
  }
  .active {
    background: #00c0de !important;
    color: #fafafa !important;
  }
}
.color {
  color: #e07c5a;
}
.detail {
  cursor: pointer;
}
.export {
  position: absolute;
  top: 0px;
  right: 40px;
  z-index: 2000;
  cursor: pointer;
  i {
    font-size: 20px;
  }
}
</style>
