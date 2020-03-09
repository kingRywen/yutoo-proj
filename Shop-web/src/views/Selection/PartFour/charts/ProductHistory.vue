<template>
  <TabChart
    :axisCross="false"
    ref="chart"
    reverse
    name="产品历史变化动态记录"
    class="mt20"
    @timeChange="handleTimeChange"
    :data="data"
    @mouseout="handleMouseout"
    chartHeight="400"
  >
    <template slot="chartbtn">
      <div class="btns">
        <span class="label">追踪变化类型:</span>
        <!-- <el-radio-group size="small" class="mr10" v-model="selectAll">
          <el-radio border label="all">全选</el-radio>
          <el-radio border label="none">取消全选</el-radio>
        </el-radio-group>-->
        <el-checkbox v-model="selectAll" label="选中所有" class="ml10 mr10" border></el-checkbox>

        <el-checkbox-group v-model="trackingChangeType" size="default">
          <el-checkbox-button
            v-for="item in $const['OTHER/eventType'].slice(0, -1)"
            :label="item.value"
            :key="item.label"
          >{{item.label}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </template>
    <template slot="table">
      <yt-table :data="tableData" :columns="columns" border></yt-table>
    </template>
  </TabChart>
</template>

<script>
import bg from './dialog.png'
export default {
  data() {
    return {
      hasEventDatas: [],
      currentList: [],
      eventType: [],
      // selectAll: ['all'],
      trackingChangeType: [],
      tableData: [],
      columns: [
        {
          label: '时间',
          value: 'time',
          render: (h, scope) => {
            let { data } = scope.row
            return <span>{data[0].occurredTime}</span>
          }
        },
        {
          label: 'BSR排名',
          value: 'time',
          render: (h, scope) => {
            let { data } = scope.row
            return <span>{data[0].rank}</span>
          }
        },
        {
          label: '调整内容',
          value: 'time',

          render: (h, scope) => {
            let { eventType } = scope.row
            let list = this.$const['OTHER/eventType']
            let el = list.find(el => el.value === eventType)
            return <span>{el.label}</span>
          }
        },
        {
          label: '',
          render(h, scope) {
            let { data, eventType } = scope.row
            const eventContentList = data[0].eventContentList
            return eventContentList ? (
              <el-popover placement="left" trigger="click">
                <div>
                  {eventContentList.map(el => (
                    <div>
                      <p>
                        <span style="vertical-align: top;">调整前：</span>
                        {eventType === 5 ? (
                          <img
                            style="vertical-align: top;"
                            width="120"
                            src={el.eventOld}
                          />
                        ) : eventType === 9 ? (
                          (+el.eventOld).toFixed(2)
                        ) : (
                          el.eventOld
                        )}
                      </p>
                      <p>
                        <span style="vertical-align: top;" class="danger">
                          调整后：
                        </span>
                        {eventType === 5 ? (
                          <img
                            style="vertical-align: top;"
                            width="120"
                            src={el.eventNew}
                          />
                        ) : eventType === 9 ? (
                          (+el.eventNew).toFixed(2)
                        ) : (
                          el.eventNew
                        )}
                      </p>
                    </div>
                  ))}
                </div>
                <el-button slot="reference" type="text">
                  【详情】
                </el-button>
              </el-popover>
            ) : (
              '-'
            )
          }
        }
      ],
      data: {
        color: this.$const['CHART/COLOR'],
        tooltip: {
          show: true,
          backgroundColor: 'rgba(0,0,0,0.6)',
          textStyle: {
            color: '#fff',
            textBorderColor: '5793f3',
            textBorderWidth: 2
          },
          formatter: params => {
            params = params[0]
            const { axisValue, seriesName, data, marker } = params
            if (this.hasEventDatas.indexOf(axisValue) > -1) {
              return
            }
            if (!data || !data.value) {
              return null
            }
            return `${marker} ${axisValue}<br>${seriesName}: ${data &&
              data.value}`
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
          min: 1,
          type: 'value',
          name: 'BSR排名',
          max: function(value) {
            return Math.ceil(value.max * 1.2)
          }
        },
        series: []
        // grid: {
        //   left: '6%',
        //   right: '6%',
        //   bottom: '6%',
        //   containLabel: true
        // }
      }
    }
  },
  created() {
    this.eventType = this.$const['OTHER/eventType']
    this.trackingChangeType = this.eventType.map(el => el.value)
    this.fetchData()
  },
  methods: {
    handleMousemove(e) {
      if (e.componentType === 'markPoint') {
        this.showTooltip(e)
      } else {
        return
      }
    },
    handleMouseout(e) {
      console.log(e)

      if (e.componentType === 'markPoint') {
        this.hideTooltip()
      }
    },
    showTooltip(e) {
      let chart = this.$refs.chart.$refs.chart
      chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: 1
      })
    },
    hideTooltip(e) {
      let chart = this.$refs.chart.$refs.chart
      chart.dispatchAction({
        type: 'hideTip'
      })
    },
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
        endTime: params.endTime || today
      })
      this.loading = true
      Promise.all([
        this.$api[`bigProductEventList`](params),
        this.$api[`bigProductDayCurrentList`](params)
      ])
        .then(res => {
          const fails = res.filter(el => el.code !== 0)
          if (fails.length) {
            this.$message.error(fails[0].msg)
          } else {
            let [data1, data2] = res
            // bsr排名数据
            let currentList = data2.data,
              // 历史变化动态记录
              eventList = data1.data
            this.currentList = currentList
            this.eventList = eventList
            this.tableData = eventList
            this.handleDrawData()
          }
        })
        .catch(() => {})
    },
    // 处理渲染数据
    handleDrawData() {
      this.obj = {}
      let legend = [],
        xAxis = [],
        series = [],
        currentList = this.currentList,
        eventList = this.eventList,
        // 需要显示的标记
        showTags = this.trackingChangeType,
        // 标记点
        markPoint,
        seriesData = [],
        timeArr = this.$.getTimeRanges(this.$refs.chart.date)
      // 日新增图表
      xAxis = timeArr
      // debugger
      timeArr.forEach(element => {
        let el = currentList.find(e => e.statTime === element)
        // xAxis.push(element.statTime)
        if (el) {
          this.obj[el.statTime] = el.rank
        }
        seriesData.push({
          value: el ? el.rank : null,
          tooltip: {
            // position: ['50%', '50%']
          }
        })
      })

      // console.log(seriesData);

      series.push({
        type: 'line',
        name: 'BSR排名',
        label: {
          show: false,
          position: 'bottom',
          textStyle: {
            color: '#5793f3'
          }
        },
        ...this.$const['CHART/ITEM_STYLE'],
        markPoint: this.getMarkPoint(showTags),
        data: seriesData
      })

      this.setOptions(legend, xAxis, series)
    },
    setOptions(legend, xAxis, series) {
      this.$refs.chart.clear()
      this.data.legend.data = legend
      this.data.xAxis.data = xAxis
      this.data.series = series
    },
    // 获取需标记的点
    getMarkPoint(showTags) {
      this.hasEventDatas = []
      const eventList = this.eventList
      let data = [],
        vm = this,
        currentEvent = {}
      //

      if (!eventList) {
        return
      }

      eventList.forEach(el => {
        if (showTags.indexOf(el.eventType) > -1) {
          el.data.forEach(_el => {
            let _time = _el.occurredTime
            if (currentEvent[_time]) {
              currentEvent[_time].event.push({
                ..._el,
                eventType: el.eventType
              })
            } else {
              currentEvent[_time] = {
                event: [{ ..._el, eventType: el.eventType }],
                rank: _el.rank,
                occurredTime: _time
              }
            }
          })
        }
      })

      for (const key in currentEvent) {
        this.hasEventDatas.push(key)
        if (currentEvent.hasOwnProperty(key)) {
          const el = currentEvent[key]
          let type, symbol, changes
          if (el.event.length === 1) {
            // type = this.eventType[el.event[0].eventType]
            type = this.eventType.find(e => el.event[0].eventType === e.value)
          } else {
            type = this.eventType[11]
          }
          symbol = type.symbol
          changes = el.event.map(_el => {
            let list = this.$const['OTHER/eventType']
            let e = list.find(el => el.value === _el.eventType)
            return e.label
          })

          data.push({
            symbol: 'path://' + symbol,
            name,
            zlevel: 222,
            // symbolOffset: [0, -20],
            xAxis: el.event[0].occurredTime,
            yAxis: el.event[0].rank,
            label: {
              zlevel: 222,
              show: false,
              distance: 30,
              position:
                el.event[0].occurredTime !== this.$refs.chart.date[1]
                  ? 'right'
                  : 'left',
              emphasis: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 5,
                color: '#FFF',
                padding: [8, 20, 8, 6],
                width: 100,
                formatter: [
                  // `{pd|${el.event[0].occurredTime}}`
                  `{c|${el.event[0].occurredTime}}`,
                  `{b|BSR排名：${el.rank}}`,

                  '{pd|}',
                  '{hr|}',
                  '{pd|}',
                  '{a|变化项：}',
                  ...changes.map(el => `{a|${el}}`)
                ].join('\n'),
                rich: {
                  bg: {
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#FFF',
                    padding: [20, 0, 20, 10]
                  },
                  br: {
                    width: '100%',
                    height: '100%'
                  },
                  a: {
                    fontSize: 14,
                    lineHeight: 20
                  },
                  c: {
                    fontSize: 14,
                    lineHeight: 12
                  },
                  b: {
                    fontSize: 14,
                    lineHeight: 24
                  },
                  pd: {
                    padding: [0, 0, 0, 0]
                  },

                  hr: {
                    borderColor: '#eee',
                    width: '100%',
                    borderWidth: 0.2,
                    height: 0
                  }
                }
              }
            }
          })
        }
      }

      return {
        // 图标尺寸
        symbolSize: [28, 34],
        symbolKeepAspect: true,
        // 图标偏移坐标
        symbolOffset: [0, '-60%'],
        // 是否不触发
        // silent: true,
        // 图标样式
        itemStyle: {
          color: '#22b900'
        },

        // markpoint数据
        data
      }
    },
    handleTimeChange(val) {
      let [startTime, endTime] = val || []
      this.fetchData({ startTime, endTime })
    },
    getImg(eventType) {
      let name, svg
      return { name, svg }
    }
  },
  computed: {
    selectAll: {
      get() {
        if (this.trackingChangeType.length === this.eventType.length) {
          return ['选中所有']
        } else {
          return []
        }
      },
      set(val) {
        if (val.length) {
          this.trackingChangeType = this.eventType.map(el => el.value)
        } else {
          this.trackingChangeType = []
        }
      }
    }
  },
  watch: {
    // selectAll(val) {
    //   if (val === 'all') {
    //     this.trackingChangeType = this.eventType.map(el => el.value)
    //   }
    //   if (val === 'none') {
    //     this.trackingChangeType.splice(0)
    //   }
    // },
    trackingChangeType(val) {
      // const all = this.eventType.map(el => el.value)
      // if (all.every(el => val.indexOf(el) > -1)) {
      //   this.selectAll = 'all'
      // } else if (all.every(el => val.indexOf(el) === -1)) {
      //   this.selectAll = 'none'
      // } else {
      //   this.selectAll = ''
      // }
      //
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
