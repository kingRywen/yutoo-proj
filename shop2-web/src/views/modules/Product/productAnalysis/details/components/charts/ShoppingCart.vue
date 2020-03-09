<template>
  <TabChart
    v-loading="loading"
    ref="chart"
    name="购物车获得率"
    class="mt20"
    @timeChange="handleTimeChange"
    :data="data"
    chartHeight="400"
  ></TabChart>
</template>

<script>
export default {
  props: ['asin'],
  data() {
    return {
      loading: false,
      allData: [],
      data: {
        color: this.$const['CHART/COLOR'],
        tooltip: {
          trigger: 'axis'
          // formatter: '{b} <br />$ {c}'
        },
        legend: {
          type: 'scroll',
          left: '3%',
          right: '4%',
          top: '3%',
          data: []
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
    }
  },
  // created() {
  //   this.fetchData()
  // },
  methods: {
    // 获取数据
    fetchData(params) {
      const { today, computedDay } = this.cfuns.getDay(29)
      params = params || {}
      Object.assign(params, {
        taskId: this.$route.query.taskId,
        startTime:
          (new Date(this.$route.query.startTime) < new Date(params.startTime)
            ? params.startTime
            : this.$route.query.startTime) || computedDay,
        endTime: params.endTime || today,
        asin: this.asin
      })
      this.loading = true
      this.$api[`bigProductSellingDayList`](params)
        .then(data => {
          this.loading = false
          this.allData = data.data
          this.handleDrawData()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 处理渲染数据
    handleDrawData() {
      let legend = [],
        xAxis,
        series = [],
        data = this.allData,
        arr = []
      if (!data[0]) {
        series = []
      } else {
        xAxis = data[0].data.map(el => el.sendTime)
        console.log(22)

        data.forEach(element => {
          legend.push(element.sellerName)
          let seriesData = []
          element.data.forEach(el => {
            seriesData.push(el.cartRate)
          })
          series.push({
            type: 'line',
            name: element.sellerName,
            ...this.$const['CHART/ITEM_STYLE'],
            data: seriesData
          })
        })
      }

      this.setOptions(legend, xAxis, series)
    },
    setOptions(legend, xAxis, series) {
      this.$refs.chart.clear()
      this.data.legend.data = legend
      this.data.xAxis.data = xAxis
      this.data.series = series
    },
    handleTimeChange(val) {
      let [startTime, endTime] = val || []
      this.fetchData({ startTime, endTime })
    }
  },
  watch: {
    asin: {
      immediate: true,
      handler() {
        this.fetchData()
      }
    }
  }
}
</script>

<style lang='scss'>
.inputButton {
  .el-checkbox-button__inner {
    padding: 2px 15px;
    .el-input--small .el-input__inner {
      height: 24px !important;

      margin: 4px 0;
    }
  }
}
</style>
