<template>
  <div style="height: 100%;">
    <el-select size="mini" class="select" v-model="asin" @change="getCsv" placeholder>
      <el-option v-for="item in asins" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <div v-if="!noData" style="min-height: 600px;height: 100%;">
      <v-chart
        @legendselectchanged="handleLegendselectchanged"
        @datazoom="handleDatazoom"
        @hook:mounted="chartDone"
        ref="chart"
        :init-options="initOptions"
        style="width:100%;height:550px"
        :options="opts"
        auto-resize
      />
    </div>
    <NonePage v-else noBack />
  </div>
</template>
<script>
import ECharts from 'vue-echarts'
export default {
  props: ['params'],
  components: {
    'v-chart': ECharts
  },
  data() {
    let timeData = ['6/12 2:00']
    let splitLine = {
      show: true,
      lineStyle: {
        color: '#e6e6e6'
      }
    }
    return {
      asin: null,
      asins: [],
      csvType: {
        0: 'Amazon',
        1: 'New',
        2: 'Used',
        3: 'Sales Rank',
        4: 'List Price',
        7: 'New,3rd Party FBM',
        8: 'Lightning Deal',
        10: 'New,3rd Party FBA',
        18: 'Buy Box',
        19: 'Used,like new',
        20: 'Used,very good',
        21: 'Used,good',
        22: 'Used,acceptable',
        28: 'eBay New',
        29: 'eBay Used',
        11: 'New Offer Count',
        12: 'Used Offer Count',
        '-1': 'New Review Count',
        16: 'Rating',
        17: 'Review Count'
      },
      noData: false,
      initOptions: {
        renderer: 'canvas'
      },
      opts: {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            let str = ''
            let top = this.$.getChartTooltip(
              params.filter(e => e.axisIndex == 0)
            )
            let bottom = this.$.getChartTooltip(
              params.filter(e => e.axisIndex == 1)
            )
            if (top) {
              str +=
                this.$.getChartTooltip(params.filter(e => e.axisIndex == 0)) +
                '<br /><br /><br />'
            }
            if (bottom) {
              str += this.$.getChartTooltip(
                params.filter(e => e.axisIndex == 1)
              )
            }
            return str
          },
          axisPointer: {
            animation: false
          }
        },
        axisPointer: {
          link: { xAxisIndex: 'all' }
        },
        legend: [
          {
            data: [],
            orient: 'vertical',
            right: 20,
            top: 8,
            formatter: name => {
              if (name == 'eBay New' || name == 'eBay Used') {
                return name + ' {b|}'
              } else {
                return name
              }
            },
            textStyle: {
              rich: {
                b: {
                  height: 14,
                  align: 'left',
                  backgroundColor: {
                    image: require('./go.svg')
                  }
                }
              }
            },
            bottom: 20
          },
          {
            data: [],
            orient: 'vertical',
            right: 20,
            top: '65%',
            bottom: 20
          }
        ],
        dataZoom: [
          {
            show: false,
            realtime: true,
            start: 0,
            end: 100,
            xAxisIndex: [0, 1]
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100,
            // zoomOnMouseWheel: false,
            xAxisIndex: [0, 1]
          },
          {
            start: 0,
            end: 100,
            xAxisIndex: [0, 1],
            handleIcon:
              'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        grid: [
          {
            left: 120,
            top: 20,
            right: 250,
            height: '49%'
          },
          {
            left: 120,
            right: 250,
            top: '65%',
            height: '25%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            data: timeData,
            axisLabel: {
              margin: 16,
              minInterval: 1
            },
            splitLine
          },
          {
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            axisLabel: {
              show: false,
              minInterval: 1
            },
            splitLine,
            data: timeData,
            position: 'top'
          }
        ],
        toolbox: {
          top: '-50px',
          feature: {
            dataZoom: {
              yAxisIndex: 'none' //不启用y轴的选中
            }
          }
        },
        yAxis: [
          {
            name: '',
            type: 'value',
            max: function(value) {
              return parseInt(value.max) + 20
            },
            axisLabel: {
              formatter: '$ {value}'
            },
            axisLine: { onZero: true },
            splitLine
          },
          {
            gridIndex: 1,
            name: '',
            type: 'value',
            inverse: false,
            position: 'right',
            axisLine: { onZero: true },
            splitLine
          },
          {
            name: '',
            type: 'value',
            max: function(value) {
              return parseInt(value.max) + 20
            },
            axisLabel: {
              formatter: '# {value}'
            },
            axisLine: { onZero: true },
            splitLine
          }
        ],
        graphic: [
          {
            type: 'group',
            right: 20,
            top: 440,
            children: [
              {
                type: 'image',
                left: 0,
                top: 0,
                style: {
                  image: require('./date.png'),
                  width: 16,
                  height: 16
                }
              },
              {
                type: 'text',
                left: 20,
                top: 3,
                style: {
                  text: 'Range'
                }
              },
              {
                type: 'group',
                left: 70,
                top: 3,
                children: [
                  {
                    type: 'text',
                    top: 0,
                    style: {
                      text: 'Day',
                      font: '12px Microsoft YaHei'
                    },
                    onclick: this.dayClick
                  },
                  {
                    type: 'text',
                    top: 14,
                    style: {
                      text: 'Week',
                      font: '12px Microsoft YaHei'
                    },
                    onclick: this.dayClick
                  },
                  {
                    type: 'text',
                    top: 28,
                    style: {
                      text: 'Mouth',
                      font: '12px Microsoft YaHei'
                    },
                    onclick: this.dayClick
                  },
                  {
                    type: 'text',
                    top: 42,
                    style: {
                      text: '3 Mouths',
                      font: '12px Microsoft YaHei'
                    },
                    onclick: this.dayClick
                  },
                  {
                    type: 'text',
                    top: 56,
                    style: {
                      text: 'Year',
                      font: '12px Microsoft YaHei'
                    },
                    onclick: this.dayClick
                  },
                  {
                    type: 'text',
                    top: 70,
                    style: {
                      text: 'All(- days)',
                      font: '12px Microsoft YaHei'
                    },
                    onclick: this.dayClick
                  },
                  {
                    type: 'rect',
                    id: 'rect',
                    top: 70,
                    left: -8,
                    shape: {
                      width: 4,
                      height: 11
                    }
                  }
                ]
              }
            ]
          }
        ],
        series: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleDatazoom() {
      // console.log(e)
      this.opts.graphic[0].children[2].children[6].top = 2000
    },
    handleLegendselectchanged(e) {
      if (e.name === 'eBay New' || e.name === 'eBay Used') {
        let id = this.asins.find(el => el.value === this.asin).ebayListingIds
        id = JSON.parse(id)
        window.open(
          `https://www.ebay.com/itm/${e.name === 'eBay New' ? id[0] : id[1]}`,
          '_blank'
        )
      }
    },
    dayClick(e) {
      let val = e.topTarget.position[1] / 14,
        startValue,
        start = undefined,
        end = undefined,
        endValue,
        timeData = this.opts.xAxis[0].data
      if (val == 0) {
        endValue = timeData.slice().pop()
        startValue = timeData[timeData.length - 1]
      } else if (val == 1) {
        endValue = timeData[timeData.length - 1]
        startValue = timeData[timeData.length - 8]
      } else if (val == 2) {
        endValue = timeData[timeData.length - 1]
        startValue = timeData[timeData.length - 31]
      } else if (val == 3) {
        endValue = timeData[timeData.length - 1]
        startValue = timeData[timeData.length - 91]
      } else if (val == 4) {
        endValue = timeData[timeData.length - 1]
        startValue = timeData[timeData.length - 366]
      } else if (val == 5) {
        endValue = undefined
        startValue = undefined
        start = 0
        end = 100
      }
      this.opts.dataZoom[1].start = start
      this.opts.dataZoom[1].end = end
      this.opts.dataZoom[0].start = start
      this.opts.dataZoom[0].end = end
      this.opts.dataZoom[1].startValue = startValue
      this.opts.dataZoom[1].endValue = endValue
      this.opts.dataZoom[0].startValue = startValue
      this.opts.dataZoom[0].endValue = endValue
      this.opts.graphic[0].children[2].children[6].top = e.topTarget.position[1]

      //
    },
    chartDone() {
      this.$nextTick(() => {
        // debugger
        this.$refs.chart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'dataZoomSelect',
          // 启动或关闭
          dataZoomSelectActive: true
        })
      })
    },
    async init() {
      let data = await this.$api[`kpProductSelect`](this.params)
      this.asins = data.data.map(el => ({
        label: el.asin,
        value: el.asin,
        ebayListingIds: el.ebayListingIds,
        trackingDays: el.trackingDays
      }))
      this.asin = this.asins[0].value
      this.getCsv()
    },
    getCsv(asin) {
      this.$api[`kpProductCsv`]({
        ...this.params,
        asin: asin || this.params.asin
      }).then(data => {
        if (!data.data.length) {
          this.noData = true
        } else {
          this.handlerData(data.data)
        }
      })
    },
    handlerData(data) {
      let minTime,
        maxTime,
        allTime = [],
        timeArr = [],
        legendData = [],
        seriesData = []
      const arr = [11, 12, 16, 17, '-1']
      data.forEach(el => {
        if (el.data) {
          el.data.forEach(e => {
            if (!minTime || minTime > e.xAxis) {
              minTime = e.xAxis
            }
            if (!maxTime || maxTime < e.xAxis) {
              maxTime = e.xAxis
            }
            if (allTime.indexOf(e.xAxis) === -1) {
              allTime.push(e.xAxis)
            }
          })
        }
      })
      while (new Date(minTime) <= new Date(maxTime)) {
        timeArr.push(this.$.formatDate(minTime, '{y}-{m}-{d}'))
        minTime = new Date(minTime).getTime() + 24 * 3600 * 1000
      }

      data.forEach(el => {
        legendData.push(this.csvType[el.csvType])

        if (el.data) {
          let i = 0
          const _data = []
          let obj = {}
          timeArr.forEach(time => {
            const cur = el.data.find(e => e.xAxis === time)
            if (cur) {
              i++
              _data.push(cur.yAxis)
            } else {
              _data.push(null)
            }
          })

          obj = {
            name: this.csvType[el.csvType],
            type: 'line',
            symbolSize: 5,
            showAllSymbol: i < 60 ? true : 'auto',
            legendHoverLink: true,
            hoverAnimation: false,
            data: _data,
            connectNulls: false,
            yAxisIndex: el.csvType == 3 ? 2 : 0
          }

          if (arr.indexOf(el.csvType) > -1 || el.csvType == -1) {
            Object.assign(obj, { xAxisIndex: 1, yAxisIndex: 1 })
          }
          seriesData.push(obj)
        }
      })

      const legend1 = [
        'Amazon',
        'New',
        'Used',
        'Sales Rank',
        'List Price',
        'New,3rd Party FBM',
        'Lightning Deal',
        'New,3rd Party FBA',
        'Buy Box',
        'Used,like new',
        'Used,very good',
        'Used,good',
        'Used,acceptable',
        'eBay New',
        'eBay Used'
      ]
      const legend2 = [
        'New Offer Count',
        'Used Offer Count',
        'New Review Count',
        'Rating',
        'Review Count'
      ]
      // 获取到所有时间，生成时间轴
      this.opts.xAxis[0].data = this.opts.xAxis[1].data = timeArr
      this.opts.legend[0].data = legend1.filter(
        name => legendData.indexOf(name) > -1
      )
      this.opts.legend[1].data = legend2.filter(
        name => legendData.indexOf(name) > -1
      )
      this.opts.series = seriesData
      this.opts.graphic[0].children[2].children[5].style.text = `All(${
        this.asins.find(el => el.value == this.asin).trackingDays
      } days)`

      // this.chartDone()
    }
  }
}
</script>
<style lang="scss" scoped>
.select {
  float: right;
  z-index: 33333;
}
</style>