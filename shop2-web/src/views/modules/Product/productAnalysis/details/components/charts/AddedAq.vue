<template>
  <TabChart
    v-loading="loading"
    :limitTime="false"
    :limitEndDate="$route.query.endTime"
    ref="chart"
    name="新增QA数"
    class="mt20"
    @timeChange="handleTimeChange"
    :data="data"
    :exp="exp"
    chartHeight="400"
  >
    <!-- <ElButton slot="download" type="text" class="ml10 btnp0" icon="el-icon-download" @click="downloadExcel">下载</ElButton> -->
  </TabChart>
</template>

<script>
import { exportEXCEL } from 'Utils/xlsx'
export default {
  props: ['asin'],
  data() {
    let vm = this
    return {
      exp: [
        {
          name: '导出 EXCEL',
          fn: () => this.downloadExcel()
        },
        {
          name: '导出 CSV',
          fn: () => this.downloadExcel(true)
        }
      ],
      loading: false,
      data: {
        color: this.$const['CHART/COLOR'],
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            return vm.cfuns.getChartTooltip(params)
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
          minInterval: 1,
          max: function(value) {
            return Math.ceil(1.4 * value.max)
          }
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
      // console.log(params)

      const { today, computedDay } = this.cfuns.getDay(29)
      params = params || {}
      Object.assign(params, this.storeInfo, {
        taskId: +this.$route.query.taskId,
        startTime: params.startTime || computedDay,
        endTime: params.endTime || today
      })
      this.loading = true
      this.$api[`productAnalysis/paQaCrv`](params)
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
        arr = [],
        timeArr = this.cfuns.getTimeRanges(this.$refs.chart.date)

      xAxis = timeArr
      // console.log(timeArr)
      if (!data || !data.length) {
        data = []
        // return this.setOptions(legend, xAxis, series)
      }
      timeArr.forEach(element => {
        let _el = data.find(el => el.qaDate === element)
        if (_el) {
          arr.push(_el.newQaCnt)
        } else {
          arr.push(0)
        }
      })
      // console.log(timeArr, arr)
      series.push({
        name: '新增QA数',
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
    },
    downloadExcel(csv) {
      let { series, xAxis } = this.data,
        time = xAxis.data,
        data = time.map((t, index) => [t, series[0].data[index]]),
        exportData = [['日期', '新增QA数'], ...data]
      console.log(exportData)
      exportEXCEL(exportData, null, this.$route.query.asin + '-新增评价数', csv)
    }
  },
  watch: {
    category() {
      this.handleDrawData()
    }
  }
}
</script>

