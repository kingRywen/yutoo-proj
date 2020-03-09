<!-- 评价数表格 -->
<template>
  <div class="chart1">
    <header>评价数</header>
    <main style="border:1px solid #E4E4E4;padding:20px 20px 30px">
      <div>
        <p v-if="!chartShow">暂无数据</p>
        <table v-if="chartShow" class="table1">
          <thead class="thead1">
            <th class="th1"></th>
            <th>30天</th>
            <th>90天</th>
            <th>12个月</th>
            <th>累计</th>
          </thead>
          <tbody v-if="this.chart1">
            <tr>
              <td class="td1">好评</td>
              <td>
                <span class="green">{{chart1.positive30dRate}}</span>
                <span>%</span>
              </td>
              <td>
                <span class="green">{{chart1.positive90dRate}}</span>
                <span>%</span>
              </td>
              <td>
                <span class="green">{{chart1.positive1yRate}}</span>
                <span>%</span>
              </td>
              <td>
                <span class="green">{{chart1.positiveAllRate}}</span>
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td class="td1">中评</td>
              <td>{{chart1.neutral30dRate}}%</td>
              <td>{{chart1.neutral90dRate}}%</td>
              <td>{{chart1.neutral1yRate}}%</td>
              <td>{{chart1.neutralAllRate}}%</td>
            </tr>
            <tr>
              <td class="td1">差评</td>
              <td>
                <span class="red">{{chart1.negative30dRate}}</span>
                <span>%</span>
              </td>
              <td>
                <span class="red">{{chart1.negative90dRate}}</span>
                <span>%</span>
              </td>
              <td>
                <span class="red">{{chart1.negative1yRate}}</span>
                <span>%</span>
              </td>
              <td>
                <span class="red">{{chart1.negativeAllRate}}</span>
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td class="td1">计数</td>
              <td>{{chart1.review30dCnt}}</td>
              <td>{{chart1.review90dCnt}}</td>
              <td>{{chart1.review1yCnt}}</td>
              <td>{{chart1.reviewAllCnt}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script>
import { ShopReviewSummaryInfo } from "../../../../../../../api/myApi";
export default {
  name: "evalChart",
  components: {},
  data() {
    return {
      chart1: "",
      chartShow: true
    };
  },

  created() {},
  mounted() {
    this.getEval();
  },
  methods: {
    getEval() {
      this.$axios
        .get(ShopReviewSummaryInfo, {
          params: {
            sellerId: this.$route.query.sellerId,
            category: this.category
          }
        })
        .then(res => {
          this.chart1 = res.data.data;
          console.log(1111, this.chart1);
          if (this.chart1 == "") {
            this.chartShow = !this.chartShow;
          }
          for (let key in this.chart1) {
            let value = this.chart1[key];
            if (value == "") {
              this.chart1[key] = "暂无";
            }
            if (value < 1 && value != "") {
              this.chart1[key] = Number(value * 100);
            }
          }
          console.log(this.chart1, 2222);
        });
    }
  },
  computed: {
    category() {
      return this.$store.state.competitive.categoryChange;
    }
  },
  watch: {
    category() {
      this.getEval();
    }
  }
};
</script>

<style lang='scss' scoped>
.chart1 {
  border: 1px solid transparent;
  box-sizing: border-box;
  width: 96%;
  overflow: hidden;
  header {
    height: 40px;
    line-height: 40px;
    background: #f2f2f2;
    padding-left: 20px;
  }
}
// 评价数
.table1 {
  width: 100%;
  height: 45px;
  line-height: 45px;
  border: 1px solid #f3f3f3;
  border-collapse: collapse;
  .thead1 {
    .th1 {
      width: 15%;
    }
    th {
      background: #f1f1f1;
      border-bottom: 3px solid #eee;
    }
  }
  tbody {
    text-align: center;
    tr {
      .td1 {
        font-weight: bold;
        font-size: 15px;
      }
      td {
        border-top: 1px solid #eeeeee;
      }
    }
    tr:nth-child(even) {
      background: #f2f2f2;
    }
  }
}
.green {
  color: #26d70a;
}
.red {
  color: #f5251d;
}
</style>
