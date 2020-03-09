<template>
  <div>
    <div class="flex just-sb">
      <new-form :inline="true" ref="form" label-width="120px" :form-schema="formSchema" v-model="value"></new-form>
      <div>
        <el-dropdown
          v-if="exp"
          @command="handleCommand"
          type="primary"
          szie="mini"
          @click="exp[0].fn"
          class="downexl-btn"
          v-setplain
          split-button
          slot="download"
        >
          <span class="el-dropdown-link">{{exp[0].name ||'导出 EXCEL'}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in exp.slice(1)" :key="index" :command="item">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <TabChart
      :limitTime="false"
      ref="chart"
      :blank="true"
      class="mt20"
      :data="data"
      chartHeight="600"
      v-loading="loading"
    ></TabChart>
  </div>
</template>

<script>
import _chunk from 'lodash/chunk'
import { exportEXCEL } from 'Utils/xlsx'
import { formatDate } from 'Utils'
import chartsMixin from '@/mixins/charts'

export default {
  mixins: [chartsMixin],
  // props: ['merchantTaskId', 'category', 'name'],
  props: {
    defaultTime: {
      type: Number,
      default: 180
    },
    // 默认多少月
    defaultMonth: Number,
    merchantTaskId: Number,
    category: String,
    name: String,
    type: String
  },
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
      noData: false,
      data: {
        color: this.$const['CHART/COLOR'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          confine: false,
          textStyle: {
            fontSize: 10
          },
          formatter(params) {
            if (!params) {
              return
            }

            params.sort((a, b) => b.data - a.data)
            params = params.filter(
              el => !(el.data == 0 || el.data === '' || el.data == null)
            )
            if (!params.length) {
              return
            }
            if (params.every(el => el.data == null)) {
              return
            }

            let paramsC = _chunk(params, 42)
            let html = ''
            paramsC.forEach(arr => {
              html +=
                '<div class="mr10">' +
                arr.reduce((total, cur) => {
                  if (cur.data == null) {
                    return total
                  }
                  return (
                    total +
                    `<div>${cur.marker} ${cur.seriesName}：${
                      cur.data == null ? '' : cur.data
                    }</div>`
                  )
                }, '') +
                '</div>'
            })
            html = `<div style="font-weight:bold">${params[0].axisValue}</div><br><div class="flex">${html}</div>`
            // let div = document.createElement('div')
            // div.innerHTML = html
            // document.body.appendChild(div)
            //
            return html
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
          name: '评价数',
          type: 'value',
          minInterval: 1,
          max: function(value) {
            return Math.ceil(1.4 * value.max)
          }
        },
        series: []
      },
      loading: false,
      lastSelectDate: null,
      formSchema: {
        time: {
          widget: 'daterange',
          clearable: false,
          pickerOptions: {
            onPick({ maxDate, minDate }) {
              console.log(maxDate, minDate)
              if (!maxDate && minDate) {
                // 选第一个日期的时候
                vm.lastSelectDate = new Date(minDate).getTime()
              }
            },
            disabledDate(date) {
              if (!vm.lastSelectDate) {
                // return date.getTime() > Date.now()
                return date.getTime() > new Date(vm.dataTime).getTime()
              }
              return (
                date.getTime() >
                  Math.min(
                    Date.now(),
                    vm.lastSelectDate + 365 * 24 * 3600 * 1000
                  ) ||
                date.getTime() < vm.lastSelectDate - 365 * 24 * 3600 * 1000
              )
            }
          },
          change: data => {
            if (data.period == 7 && this.cfuns.timeInterval(data.time) < 7) {
              this.$message.warning('请选择1周以上的时间跨度')
              this.allData = []
              return
            }
            if (data.period == 30 && this.cfuns.timeInterval(data.time) < 30) {
              this.$message.warning('请选择1个月以上的时间跨度')
              this.allData = []
              return
            }
            vm.fetchData()
          }
        },
        period: {
          widget: 'select',
          placeholder: '统计周期',
          change: data => {
            if (data.period == 7 && this.cfuns.timeInterval(data.time) < 7) {
              this.$message.warning('请选择1周以上的时间跨度')
              this.allData = []
              return
            }
            if (data.period == 30 && this.cfuns.timeInterval(data.time) < 30) {
              this.$message.warning('请选择1个月以上的时间跨度')
              this.allData = []
              return
            }
            vm.fetchData()
          },
          clearable: false,
          width: '100px',
          options: [
            {
              label: '按月',
              value: 30
            },
            {
              label: '按周',
              value: 7
            },
            {
              label: '按日',
              value: 1
            }
          ]
        }
      },
      value: {}
    }
  },
  created() {
    //固定结束时间
    let computedDay, today
    if (this.defaultMonth) {
      today = formatDate(new Date(), '{y}-{m}-{d}')
      computedDay = formatDate(
        new Date().setMonth(new Date().getMonth() - this.defaultMonth),
        '{y}-{m}-{d}'
      )
    } else {
      ({ today, computedDay } = this.cfuns.getDay(
        this.defaultTime,
        this.dataTime
      ))
    }
    this.value = {
      time: [computedDay, today],
      period: 1
    }

    this.fetchData()
  },
  methods: {
    handleCommand(item) {
      item.fn()
    },
    downloadExcel(csv) {
      let { series, xAxis } = this.data,
        d = series[0].data,
        time = xAxis.data,
        contents = []

      time.forEach((t, index) => {
        contents.push([t, d[index]])
      })

      let exportData = [['日期', '评价数'], ...contents]
      exportEXCEL(
        exportData,
        null,
        '新增评价数-' + this.category || this.name,
        csv
      )
    },
    // 获取数据
    fetchData(params) {
      let time
      ;({ time } = this.value), (params = params || {})
      time = time || []
      Object.assign(params, this.storeInfo, {
        category: this.category,
        asin: this.$attrs.asin,
        type: this.styleName ? 0 : 1,
        name: this.styleName || this.name,
        merchantTaskId: this.merchantTaskId,
        startTime: time[0],
        period: this.value.period,
        endTime: time[1]
      })
      this.loading = true
      this.$api[
        `proPick/${
          this.type == 'depth'
            ? 'categoryDepthTaskMerchantListToNewReviewCntByProduct'
            : 'listToNewReviewCntByCate'
        }`
      ](params)
        .then(data => {
          this.loading = false

          this.allData = this.trimData(data.data, 'cnt')
          this.handleDrawData()
        })
        .catch(err => {
          if (err instanceof Error) {
            console.error(err)
          }
          this.loading = false
        })
    },
    // 处理渲染数据
    handleDrawData() {
      let xAxis = [],
        series = {
          name: '新增评价数',
          type: 'line',
          ...this.$const['CHART/ITEM_STYLE'],
          data: []
        }
      this.allData.forEach(e => {
        xAxis.push(e.statTime)
        series.data.push(e.cnt)
      })
      this.setOptions([], xAxis, [series])
    },
    setOptions(legend, xAxis, series) {
      this.$refs.chart && this.$refs.chart.clear()
      this.data.legend.data = legend
      this.data.xAxis.data = xAxis
      this.data.series = series
    }
  }
}
</script>

<style>
</style>
