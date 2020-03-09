<template>
  <TabChart
    tooltip="自发货有运费为1；自发货免运费为2、FBA为3"
    v-loading="loading"
    ref="chart"
    name="发货方式"
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
          trigger: 'axis',
          formatter(params) {
            // console.log(data);
            // 自发货有运费为1；自发货免运费为2、FBA为3
            // console.log(params);
            let data = params[0].data
            return data == 1
              ? '自发货有运费'
              : data == 2
              ? '自发货免运费'
              : 'FBA'
          }
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
          type: 'value',
          minInterval: 1
          // min: 3
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
      this.$api[`bigProductDayShippingList`](params)
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
      console.log(22);
      
      let legend = [],
        xAxis,
        series = [],
        data = this.allData,
        arr = [],
        timeArr = this.$.getTimeRanges(this.$refs.chart.date)
      xAxis = timeArr
      timeArr.forEach(element => {
        let e = data.find(el => el.statTime === element)
        arr.push(e ? e.shippingType : null)
      })

      series.push({
        type: 'line',
        ...this.$const['CHART/ITEM_STYLE'],
        name: '发货方式',
        data: arr
      })

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
