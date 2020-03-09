<!-- 评价数表格 -->
<template>
  <div class="chart2" v-if="this.chartShow">
    <header>产品评分分布图</header>
    <main style="padding:10px 20px;">
      <div>
        <p v-if="!chartShow">暂无数据</p>
        <div v-if="chartShow" id="ScoreChart" style="width:100%; height:263px"></div>
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
import { ShopReviewStarList } from "../../../../api/myApi";
export default {
  name: "scoreMap",
  components: {},
  data() {
    return {
      chartShow: true
    };
  },
  created() {},
  mounted() {
    this.ShopReviewStarList();
  },
  methods: {
    ShopReviewStarList() {
      let opts = {
        sellerId: this.$route.query.sellerId
      };
      if (this.category != "") {
        opts.category = this.category;
      }
      this.$axios.post(ShopReviewStarList, opts).then(res => {
        console.log("产品评分分布返回", res);
        let list = res.data.data;
        if (list == "") {
          this.chartShow = !this.chartShow;
          return;
        }
        this.drawChart(list);
      });
    },
    drawChart(list) {
      let ScoreChange = echarts.init(document.getElementById("ScoreChart"));
      ScoreChange.clear();
      //   this.echart.isScoreCountShow = false;
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        toolbox: {
          feature: {
            // dataZoom: {
            // yAxisIndex: 'none'
            // },
            // restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          orient: "vertical",
          x: "left",
          //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
          data: []
        },
        series: [
          {
            name: "评分占比",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
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
        option.legend.data.push(item.starRange); // legend
        option.series[0].data.push({
          // 使用直接push改变原来的数组对象
          value: item.productCnt,
          name: item.starRange
        }); // series 中的data
      });
      console.log(option, 222222);
      ScoreChange.setOption(option);
      //   setTimeout(() => {
      // this.echart.isScoreCountShowLoading = false;
      //   }, 300);
    }
  },
  computed: {
    category() {
      return this.$store.state.competitive.categoryChange;
    }
  },
  watch: {
    category() {
      this.ShopReviewStarList();
    }
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
    height: 40px;
    line-height: 40px;
    width: 100%;
    background: #f2f2f2;
    padding-left: 20px;
  }
}
</style>
