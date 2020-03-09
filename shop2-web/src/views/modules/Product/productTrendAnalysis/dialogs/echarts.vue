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
import _isEqual from 'lodash/isEqual'
import { formatDate } from 'Utils'
import { exportEXCEL } from 'Utils/xlsx'

export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      clearType: 1,
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
          change: () => {
            vm.lastSelect = []
            vm.fetchData()
          }
        },
        period: {
          widget: 'select',
          placeholder: '统计周期',
          change: () => {
            vm.lastSelect = []
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
        },
        evaluate: {
          width: '160px',
          widget: 'select',
          change: data => {
            vm.clearSelect(data, ['grading', 'curvilinear'], 'evaluate')
            if (!data.evaluate.length) {
              data.evaluate = [0]
            }
          },
          placeholder: '评价类型',
          multi: true,
          defaultVal: [0],
          options: [
            {
              label: '所有评价',
              value: 0
            },
            {
              label: 'VP',
              value: 1
            },
            {
              label: '直评',
              value: 2
            }
          ]
        },
        grading: {
          change: data => {
            vm.clearSelect(data, ['evaluate', 'curvilinear'], 'grading')
            if (!data.grading.length) {
              data.grading = [0]
            }
          },
          defaultVal: [0],
          width: '130px',
          widget: 'select',
          placeholder: '评价星级',
          multi: true,
          options: [
            {
              label: '所有',
              value: 0
            },
            {
              label: '1星',
              value: 1
            },
            {
              label: '2星',
              value: 2
            },
            {
              label: '3星',
              value: 3
            },
            {
              label: '4星',
              value: 4
            },
            {
              label: '5星',
              value: 5
            }
          ]
        },
        curvilinear: {
          change: data => {
            vm.clearSelect(data, ['evaluate', 'grading'], 'curvilinear')
            if (!data.curvilinear.length) {
              data.curvilinear = [0]
            }
          },
          defaultVal: [0],
          width: '150px',
          widget: 'select',
          placeholder: '评价内容',
          multi: true,
          options: [
            {
              label: '总数',
              value: 0
            },
            {
              label: '带图片',
              value: 1
            },
            {
              label: '带视频',
              value: 2
            },
            {
              label: '仅文字',
              value: 3
            }
          ]
        }
      },
      value: {}
    }
  },
  created() {
	//固定结束时间
	let { today, computedDay } = this.cfuns.getDay(30,this.dataTime)
	this.value = {
		time: [computedDay , this.dataTime],
		period:1
	}
	
    this.fetchData()
  },
  computed: {
    allSelect() {
      return [this.value.evaluate, this.value.grading, this.value.curvilinear]
    },
    taskId() {
      return this.params.taskIds[0]
    },
	dataTime(){
		return this.params.dataTime
	}
  },
  watch: {
    allSelect: {
      deep: true,
      handler() {
        this.handleDrawData()
      }
    }
  },
  methods: {
    clearSelect(data, arr, curKey) {
      if (this.clearType) {
        if (arr.find(key => data[key].length > 1)) {
          data[curKey].shift()
        }
      } else {
        for (const name of arr) {
          if (data[name].length > 1) {
            data[name].splice(0)
            data[name].push(0)
          }
        }
      }
    },
    handleCommand(item) {
      item.fn()
    },
    downloadExcel(csv) {
      let { series, xAxis } = this.data,
        titles = [],
        contents = [],
        time = xAxis.data
      series.forEach(el => {
        titles.push(el.name)

        el.data.forEach((e, index) => {
          if (!contents[index]) {
            contents.push([time[index], e])
          } else {
            contents[index].push(e)
          }
        })
      })
      let exportData = [['日期', ...titles], ...contents]
      // console.log(exportData)
      exportEXCEL(exportData, null, '新增评价数', csv)
    },
    // 获取数据
    fetchData(params) {
      let time
      ;({ time } = this.value), (params = params || {})
      time = time || []
      Object.assign(params, this.storeInfo, {
        taskId: this.taskId,
        period: this.value.period,
        startTime: time[0],
        endTime: time[1]
      })
      this.loading = true
      this.$api[`productAnalysis/ptReviewCrv`](params)
        .then(data => {
          this.loading = false

          this.allData = data.data
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
      let timeRange = this.value.time,
        timeArr = [],
        currentTime = timeRange[0]
      let data = this.allData
      let legend = [],
        xAxis = [],
        series = []

      if (!data || !data.length) {
        this.setOptions(legend, xAxis, series)
        return
      }

      if (this.value.period == 1) {
        while (new Date(currentTime) <= new Date(timeRange[1])) {
          timeArr.push(formatDate(currentTime, '{y}-{m}-{d}'))
          currentTime = new Date(currentTime).getTime() + 24 * 3600 * 1000
        }
      } else {
        timeArr = data[0].data.map(el => el.reviewTime)
      }

      // console.log(timeArr, '-------------------------')

      let select = this.doExchange(this.allSelect)
      if (_isEqual(select, this.lastSelect)) {
        return
      } else {
        this.lastSelect = select
      }
      // console.log(select)

      xAxis = timeArr
      select.forEach(name => {
        let currentData = data.find(el => el.comb.join('-') === name)
        // if (!currentData) {
        //   return
        // }
        let curLegend =
          name === '0-0-0'
            ? '新增评价数'
            : name
                .split('-')
                .map((el, index) => {
                  let obj =
                    index === 0
                      ? this.formSchema.evaluate.options
                      : index === 1
                      ? this.formSchema.grading.options
                      : this.formSchema.curvilinear.options
                  if (index === 1 && el == 0) {
                    return ''
                  }
                  return obj[el].label
                })
                .filter(el => el !== '')
                .join(' ')
        legend.push(curLegend)

        series.push({
          name: curLegend,
          type: 'line',
          ...this.$const['CHART/ITEM_STYLE'],
          data: timeArr.map(el => {
            let e =
              currentData && currentData.data.find(_el => _el.reviewTime === el)
            if (e) {
              return e.reviewCnt
            } else {
              return undefined
            }
          })
        })
      })
      this.setOptions(legend, xAxis, series)
    },
    setOptions(legend, xAxis, series) {
      this.$refs.chart && this.$refs.chart.clear()
      this.data.legend.data = legend
      this.data.xAxis.data = xAxis
      this.data.series = series
    },
    doExchange(array) {
      let len = array.length
      let results = []
      let indexs = {}
      function _sort(start) {
        start++
        if (start > len - 1) {
          return
        }
        if (!indexs[start]) {
          indexs[start] = 0
        }
        if (!(array[start] instanceof Array)) {
          array[start] = [array[start]]
        }
        for (
          indexs[start] = 0;
          indexs[start] < array[start].length;
          indexs[start]++
        ) {
          _sort(start)
          if (start == len - 1) {
            let temp = []
            for (let i = len - 1; i >= 0; i--) {
              if (!(array[start - i] instanceof Array)) {
                array[start - i] = [array[start - i]]
              }
              temp.push(array[start - i][indexs[start - i]])
            }
            results.push(temp.join('-'))
          }
        }
      }
      _sort(-1)
      return results
    }
  }
}
</script>

<style>
</style>
