<template>
  <TabChart reverse ref="chart" name="BSR变化" class="mt20" @timeChange="handleTimeChange" :data="data" chartHeight="400">
    <div slot="right" style="margin-right:10px">
      <!-- <ElCascader :options="options" v-model="category"></ElCascader> -->
      <el-select size="mini" collapse-tags multiple v-model="category" style="width:300px;">
        <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>
  </TabChart>
</template>

<script>
export default {
  props: ['asin', 'parent'],
  data() {
    let vm = this
    return {
      category: [],
      options: [],
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
          type: 'value',
          min: 1
        },
        series: []
      }
    }
  },
  created() {
    if (this.asin === undefined) {
      this.fetchData()
      this.getCategoryList()
    }
  },
  methods: {
    // 获取类目
    getCategoryList() {
      this.$api[`bigProductBsrCategoryList`]({
        taskId: this.$route.query.taskId,
        asin: this.parent ? null : this.asin || this.$route.query.asin
      })
        .then(data => {
          this.options = data.data
          this.category = this.options
        })
        .catch(() => {})
    },
    // 获取数据
    fetchData(params) {
      const { today, computedDay } = this.cfuns.getDay(29)
      params = params || {}
      Object.assign(params, {
        asin: this.asin,
        taskId: this.$route.query.taskId,
        startTime:
          (new Date(this.$route.query.startTime) < new Date(params.startTime)
            ? params.startTime
            : this.$route.query.startTime) || computedDay,
        endTime: params.endTime || today
      })
      this.loading = true
      this.$api[`bigProductRankDayList`](params)
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
        select = this.category,
        data = this.allData,
        timeArr = this.$.getTimeRanges(this.$refs.chart.date)
      if (!data) {
        return
      }
      xAxis = timeArr
      // timeArr.forEach(element => {
      //   let _el = data.find(el => el.aqDate === element)
      //   if (_el) {
      //     arr.push(_el.newAqCnt)
      //   } else {
      //     arr.push(0)
      //   }
      // })

      // debugger

      data.forEach(element => {
        let name = element.bsrCategory
        let data = timeArr.map(el => {
          let e = element.data.find(_e => _e.statTime === el)
          if (e) {
            return e.rank
          } else {
            return null
          }
        })
        console.log(data)

        if (!this.category.length) {
          legend.push(name)

          series.push({
            name,
            type: 'line',
            ...this.$const['CHART/ITEM_STYLE'],
            data: data
          })
        } else {
          if (select.indexOf(name) > -1) {
            legend.push(name)
            series.push({
              name,
              type: 'line',
              ...this.$const['CHART/ITEM_STYLE'],
              data: data
            })
          }
        }
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
    },
    asin: {
      immediate: true,
      handler(val) {
        this.fetchData()
        this.getCategoryList()
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
