<template>
  <TabChart ref="chart" name="FIT率" class="mt20" @timeChange="handleTimeChange" :data="data" chartHeight="400"></TabChart>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      data: {
        color: this.$const['CHART/COLOR'],
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            return vm.$.getChartTooltip(params)
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
          type: 'value'
        },
        series: []
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData(params) {
      const { today, computedDay } = this.cfuns.getDay(29)
      params = params || {}
      Object.assign(params, {
        taskId: this.$route.query.taskId,
        startTime: ((new Date(this.$route.query.startTime) < new Date(params.startTime)) ? params.startTime : this.$route.query.startTime) || computedDay,
        endTime: params.endTime || today
      })
      this.loading = true
      this.$api[`bigProductDayFitList`](params)
        .then(data => {
          this.loading = false
          this.allData = data.data
          this.handleDrawData()
        })
        .catch(() => {})
    },
    // 处理渲染数据
    handleDrawData() {
      let legend = [],
        xAxis,
        series = [],
        data = this.allData,
        arr = [],
        timeArr = this.$.getTimeRanges(this.$refs.chart.date)
      xAxis = timeArr
      timeArr.forEach(element => {
        let e = data.find(el => el.statTime == element)
        arr.push(e ? e.fitRate : null)
      })
      series.push({
        name: 'FIT率',
        type: 'line',
        ...this.$const['CHART/ITEM_STYLE'],
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
    category(val) {
      this.handleDrawData()
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
