<template>
  <TabChart :style="heiSty" blank v-loading="loading" ref="chart" class="mb20" @timeChange="handleTimeChange" :data="data" chartHeight="400" :limitTime='startDate'></TabChart>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      loading: false,
      allData: [],
      data: {
        color: this.$const['CHART/COLOR'],
        tooltip: {
          trigger: 'axis',
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
      },
			heiSty:{
				height:'400px'
			}
    }
  },
  computed: {
    startDate() {
      return this.params && this.$.formatDate(this.params.startTime, '{y}/{m}/{d}')
    }
  },
  methods: {
		//改变尺寸
		echratsResize(type){
				if(!type){
					this.heiSty.height = '400px'
				}else{
					this.heiSty.height = '700px'
				}
		},
    // 获取数据
    fetchData(params) {
      const { today, computedDay } = this.cfuns.getDay(29)
      let startTime
      if (this.params && this.params.startTime) {
        startTime = this.params.startTime > computedDay ? this.params.startTime : computedDay
      } else {
        startTime = ((new Date(this.$route.query.startTime) < new Date(params.startTime)) ? params.startTime : this.$route.query.startTime)
      }
      params = params || {}
      Object.assign(params, {
        startTime,
        endTime: params.endTime || today,
        recordId: this.params.recordId
      })
      this.loading = true
      this.$api[`bigProductKrItemList`](params)
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
      xAxis = data[0].data.map(el => el.sendTime)
      data.forEach(element => {
        let name = element.adFlag ? '广告排名' : '自然排名'
        legend.push(name)
        let seriesData = []
        element.data.forEach(el => {
          seriesData.push(el.webRank)
        })
        series.push({
          type: 'line',
          ...this.$const['CHART/ITEM_STYLE'],
          name,
          
          data: seriesData
        })
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
    _initData() {
      this.$nextTick(() => {
        this.handleTimeChange(this.$refs.chart.date)
      })
    }
  },
  // watch: {
  //   asin: {
  //     immediate: true,
  //     handler() {
  //       this.fetchData()
  //     }
  //   }
  // }
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
