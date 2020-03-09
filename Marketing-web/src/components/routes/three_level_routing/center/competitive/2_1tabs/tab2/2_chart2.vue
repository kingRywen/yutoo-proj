<!-- 评价数表格 -->
<template>
  <div class="chart2">
    <header>产品评分分布图
      <el-tooltip class="item" effect="dark" content="店铺产品评分分布图" placement="right-end">
        <i class="iconfont icon-wenhao1"></i>
      </el-tooltip>
    </header>
    <main v-loading="chart1Loading" style="padding:10px 20px;width:100%;">
      <div style="width:100%;position:relative">
        <!-- <p v-if="!chartData">暂无数据</p> -->
        <none-page v-if="!isShow" noBack Height="350px">暂无数据</none-page>
        <div class="export" @click="downloadExl" v-show="isShow">
          <i class="el-icon-download"></i>
        </div>
        <!-- <el-button v-show="isShow" type="text" @click="downloadExl" class="echart_buttom_right2">导出数据</el-button> -->
        <!-- <el-button v-show="!isShow" type="text" @click="downloadExl_1" class="echart_buttom_right">导出数据</el-button> -->
        <echart auto-resize :options="echartData" v-show="isShow" id="cate_chart2" style="width:100%; height:350px"></echart>
      </div>
    </main>
  </div>
</template>

<script>
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
import { ShopReviewStarList } from "@/api/myApi";
export default {
  name: "scoreMap",
  components: {},
  data() {
    return {
      echartData: {},
      chartData: "",
      // 1
      cdata: [],
      chart1Loading: true,
      isShow: true
    };
  },
  created() {},
  mounted() {
    this.ShopReviewStarList();
  },
  methods: {
    downloadExl() {
      let data = [];
      this.chartData.forEach(element => {
        let productRate = 0;
        if (!(isNaN(element.productRate) || element.productRate == 0)) {
          productRate = (element.productRate * 10000 / 100).toFixed();
        }
        let category = this.category ? this.category : "（无类目）";
        data.push({
          评分区间: element.starRange,
          产品数: element.productCnt,
          占比: productRate + "%",
          类目: category
        });
      });
      data = JSON.parse(JSON.stringify(data));
      let name = this.$route.query.sellerId + "的产品评分.xlsx";
      this.$store.commit("common/downName", name);
      this.$nextTick(() => {
        this.$.downloadExlShop(data, null, this.$route.query.sellerId);
      });
    },
    // excellList(list) {
    //   console.log(list, "chart2");
    //   list.forEach(item => {
    //     this.cdata.push({
    //       分段: item.starRange,
    //       评价数: item.reviewCnt,
    //       产品数量: item.productCnt
    //     });
    //   });
    // },
    ShopReviewStarList(newArrivalDay) {
      this.chart1Loading = true;
      let opts = {
        sellerId: this.$route.query.sellerId,
        newArrivalDay: newArrivalDay || this.newArrivalDay,
        category: this.category
      };
      // console.log(opts);
      this.$axios.post(ShopReviewStarList, opts).then(res => {
        // console.log("产品评分分布返回", res);
        let code = res.data.code;
        if (code === 0) {
          this.chartData = res.data.data;
          // alert(this.chart2 == "");
          if (this.chartData != "") {
            this.isShow = true;
            let list = res.data.data;
            this.drawChart(list);
            // this.excellList(list);
            // this.isShow = false;
          } else {
            this.isShow = false;
          }
        } else {
          this.isShow = false;
        }
        this.chart1Loading = false;
      });
    },
    drawChart(list) {
      // let ScoreChange = echarts.init(document.getElementById("ScoreChart2"));
      // ScoreChange.clear();
      //   this.echart.isScoreCountShow = false;
      let option = {
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
          // 1
          formatter: function(val) {
            // console.log(val);
            let percent = val.percent.toFixed(0) + "%";
            return `${val.seriesName}</br>${val.name}: ${
              val.data.value
            }(${percent})`;
          }
        },
        color: [],
        toolbox: {
          // feature: {
          // dataZoom: {
          // yAxisIndex: 'none'
          // },
          // restore: {},
          // saveAsImage: { title: "保存" }
          // }
        },
        legend: {
          // orient: "vertical",
          orient: "horizontal",
          // x: "left",
          formatter: function(name) {
            // console.log(name);
            return name;
            // return name.length > 8 ? name.slice(0, 8) + "..." : name;
          },
          //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
          data: []
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "6%",
          bottom: "1%",
          containLabel: true
        },
        series: [
          {
            name: "评分占比",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            labelLine: {
              normal: {
                lineStyle: {},
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            // itemStyle: {
            //   normal: {
            //     // color: "#c23531",
            //     shadowBlur: 200,
            //     shadowColor: "rgba(0, 0, 0, 0.5)"
            //   }
            // },
            // label: {
            //   normal: {
            //     show: false,
            //     position: "center"
            //   },
            //   emphasis: {
            //     show: true,
            //     textStyle: {
            //       fontSize: "20",
            //       fontWeight: "bold"
            //     }
            //   }
            // },
            // labelLine: {
            //   normal: {
            //     show: false
            //   }
            // },
            data: [
              //   { value: 335, name: "直接访问" },
              //   { value: 310, name: "邮件营销" },
              //   { value: 234, name: "联盟广告" },
              //   { value: 135, name: "视频广告" },
              //   { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      };
      list.forEach((item, index) => {
        if (index == 0) {
          item.color = "#FB6D6B";
        }
        if (index == 1) {
          item.color = "#47C2E1";
        }
        if (index == 2) {
          item.color = "#FDC74E";
        }
        if (index == 3) {
          item.color = "#D48265";
        }
        if (index == 4) {
          item.color = "#28C432";
        }
        if (index == 5) {
          item.color = "#00c0de";
        }
        if (index == 6) {
          item.color = "#272b2c";
        }
      });
      list.forEach((item, index) => {
        let starRange = item.starRange + "分";
        option.legend.data.push(starRange); // legend
        option.color.push(item.color); // legend
        option.series[0].data.push({
          // 使用直接push改变原来的数组对象
          value: item.productCnt,
          name: starRange
        }); // series 中的data
      });
      // console.log(option, 222222);
      this.echartData = option;
      // ScoreChange.setOption(option);
      //   setTimeout(() => {
      // this.echart.isScoreCountShowLoading = false;
      //   }, 300);
    }
  },
  computed: {
    category() {
      return this.$store.state.competitive.categoryChange;
    },
    newArrivalDay() {
      return this.$store.state.competitive.newProDay;
    }
  },
  watch: {
    newArrivalDay(newV) {
      this.ShopReviewStarList(newV);
    }
    // category() {
    //   this.ShopReviewStarList();
    // }
  }
};
</script>

<style lang='scss' scoped>
.chart2 {
  border: 1px solid #e4e4e4;
  box-sizing: border-box;
  width: 96%;
  overflow: hidden;
  header {
    height: 32px;
    line-height: 32px;
    width: 100%;
    background: #f2f2f2;
    padding-left: 20px;
  }
  .export {
    position: absolute;
    top: 16px;
    right: 40px;
    z-index: 2000;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
}
</style>
