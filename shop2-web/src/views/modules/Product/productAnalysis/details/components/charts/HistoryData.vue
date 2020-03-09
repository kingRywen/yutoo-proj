<template>
  <div class="tabchart-wrapper mt20" v-loading="loading">
    <div class="tabchart-header">
      <span class="tabchart-title">历史数据</span>
      <div>
        <el-select size="mini" class="select" v-model="statType" @change="handleStatChange">
          <el-option v-for="item in times" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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

    <div style="height: 100%;">
      <div v-if="!noData" style="min-height: 600px;height: 100%;position:relative">
        <v-chart
          @datazoom="handleDatazoom"
          @hook:mounted="chartDone"
          ref="chart"
          :init-options="initOptions"
          style="width:100%;height:550px"
          :options="opts"
          auto-resize
        />
        <a
          target="_blank"
          :href="`https://www.ebay.com/itm/${ebayListingIds[0]}`"
          v-if="showEbayNewBtn"
          :style="{position:'absolute', top:(showEbayNewBtn) + 'px',right: '54px', padding: '12px 0' }"
          type="text"
        >🚚</a>
        <a
          target="_blank"
          :href="`https://www.ebay.com/itm/${ebayListingIds[1]}`"
          v-if="showEbayUsedBtn && ebayListingIds[1]"
          :style="{position:'absolute', top:(showEbayUsedBtn) + 'px',right: '50px', padding: '12px 0'}"
          type="text"
        >🚚</a>
      </div>
      <NonePage v-else noBack />
    </div>
  </div>
</template>
<script>
import { addResizeListener, removeResizeListener } from 'Utils/resize-event'
import { formatDate } from 'Utils'
import { exportEXCEL, exportImg } from 'Utils/xlsx'

export default {
  props: ['asin'],
  components: {
    'v-chart': () =>
      Promise.all([import('echarts'), import('vue-echarts')]).then(
        // eslint-disable-next-line no-unused-vars
        ([e, v]) => v
      )
  },
  data() {
    // let timeData = ['6/12 2:00']
    let splitLine = {
      show: true,
      lineStyle: {
        color: '#e6e6e6'
      }
    }
    return {
      showEbayNewBtn: false,
      showEbayUsedBtn: false,
      ebayListingIds: [],
      exp: [
        {
          name: '导出 EXCEL',
          fn: () => this.downloadExcel()
        },
        {
          name: '导出 CSV',
          fn: () => this.downloadExcel(true)
        },
        {
          name: '导出图片',
          fn: () => this.downloadImg()
        }
      ],
      taskId: +this.$route.query.taskId,
      statType: 1,
      times: [
        {
          label: '按日',
          value: 1
        },
        {
          label: '所有',
          value: 0
        }
      ],
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
      csvTypeMap: {
        0: { unit: '$', position: [10, -80] },
        1: { unit: '$', position: [10, -40] },
        2: { unit: '$', position: [10, -120] },
        3: { unit: '#', position: [-80, -40] },
        4: { unit: '$', position: [-80, 10] },
        7: { unit: '$', position: [-120, -80] },
        8: { unit: '$', position: [-100, -120] },
        10: { unit: '$', position: [-120, -160] },
        18: { unit: '', position: [80, -80] },
        19: { unit: '$', position: [60, -80] },
        20: { unit: '$', position: [60, -120] },
        21: { unit: '$', position: [60, -160] },
        22: { unit: '$', position: [60, -200] },
        28: { unit: '$', position: [60, -40] },
        29: { unit: '$', position: [10, -160] },
        11: { unit: '', position: [60, 0] },
        12: { unit: '', position: [60, 40] },
        '-1': { unit: '', position: [30, 10] },
        16: { unit: '', position: [-30, 10] },
        17: { unit: '', position: [-60, 40] }
      },
      csvTypeLineColor: {
        0: '#febd69',
        1: '#888ad5',
        2: '#444444',
        3: '#99b896',
        4: '#b36aa0',
        7: '#398194',
        8: '#a09d00',
        10: '#9e9e9e',
        18: '#a05900',
        19: '#e91e63',
        20: '#f44336',
        21: '#74fbfd',
        22: '#3f9688',
        28: '#009688',

        29: '#acff00',
        11: '#a09d00',
        12: '#444444',
        '-1': '#f56c6c',
        16: '#409eff',
        17: '#67c23a'
      },
      noData: false,
      loading: false,
      initOptions: {
        renderer: 'canvas'
      },
      opts: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            snap: false
          },
          formatter: () => {
            return
            // console.log(params)
            // let str = ''
            // let top = this.getChartTooltip(params.filter(e => e.axisIndex == 0))
            // let bottom = this.getChartTooltip(
            //   params.filter(e => e.axisIndex == 1)
            // )
            // if (top) {
            //   str +=
            //     this.getChartTooltip(params.filter(e => e.axisIndex == 0)) +
            //     '<br /><br /><br /><br /><br />'
            // }
            // if (bottom) {
            //   str += this.getChartTooltip(
            //     params.filter(e => e.axisIndex == 1),
            //     null,
            //     true
            //   )
            // }
            // return str
          }
        },
        axisPointer: {
          triggerTooltip: false,
          snap: false,
          type: 'cross',
          link: { xAxisIndex: 'all' },
          label: {
            show: true,
            backgroundColor: '#f8f8f8',
            color: '#000',
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            shadowBlur: 4
          }
        },
        legend: [
          {
            data: [],
            orient: 'vertical',
            right: 20,
            top: 60,
            icon: 'pin',
            // formatter: name => {
            //   return name
            //   // if (name == 'eBay New' || name == 'eBay Used') {
            //   //   return name + ' {b|}'
            //   // } else {
            //   //   return name
            //   // }
            // },
            // textStyle: {
            //   rich: {
            //     b: {
            //       height: 14,
            //       align: 'left',
            //       backgroundColor: {
            //         image: require('./go.svg')
            //       }
            //     }
            //   }
            // },
            bottom: 20
          },
          {
            data: [],
            icon: 'pin',
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
            // start: 0,
            // end: 100,
            startValue: null,
            endValue: null,
            xAxisIndex: [0, 1]
          },
          {
            type: 'inside',
            realtime: true,
            // start: 0,
            // end: 100,
            startValue: null,
            endValue: null,
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
            left: '6%',
            top: 60,
            right: 250,
            height: '49%'
          },
          {
            left: '6%',
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
            axisLabel: {
              // interval: 20
              // margin: 16,
              minInterval: 1
            },
            data: [],
            min: null,
            max: null,
            splitLine
          },
          {
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            min: null,
            max: null,
            data: [],
            axisLabel: {
              // interval: 20,
              show: false,
              minInterval: 1
            },
            splitLine,
            position: 'top'
          }
        ],
        toolbox: {
          top: '-50px',
          feature: {
            dataZoom: {
              yAxisIndex: 'none' //不启用y轴的选中
            },
            saveAsImage: {
              type: 'jpeg',
              name: this.asin + '-历史数据'
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
            // minInterval: 1,
            axisLine: { onZero: true },
            splitLine
          },
          {
            name: '',
            type: 'value',
            max: function(value) {
              return parseInt(value.max) + 20
            },
            minInterval: 1,
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
                // top: 3,
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
        series: [],
        dataset: []
      }
    }
  },
  created() {
    this.init()
  },
  watch: {
    asin() {
      this.init()
    }
  },
  beforeDestroy() {
    this.$refs.chart &&
      removeResizeListener(this.$refs.chart.$el, this.resizeChart)
  },
  methods: {
    getChartTooltip(params, cb, noTitle) {
      params = params.filter(
        el =>
          !(
            el.data.yaxis == 0 ||
            el.data.yaxis === '' ||
            el.data.yaxis == null ||
            isNaN(el.data.yaxis)
          )
      )
      if (!params.length) {
        return
      }
      let html = []
      if (!noTitle) {
        html.push(`${params[0].axisValue}`)
      }
      html.push(
        ...params.map(
          el => `${el.marker} ${el.seriesName}: ${cb ? cb(el) : el.data.yaxis}`
        )
      )
      return html.join('<br>')
    },
    handleCommand(item) {
      item.fn()
    },
    async downloadExcel(csv) {
      let data = await this.getCsv(null, true)
      // console.log(data)

      if (data) {
        // 只导新增评价数、bsr、评分
        const exported = {
          '-1': '新增评价数',
          3: 'bsr排名',
          16: '评分'
        }
        let { crvData, timeArr } = data,
          row = []

        // return console.log(timeArr)

        crvData.forEach(el => {
          let { crvType, data } = el
          if (exported[crvType]) {
            let rowData = timeArr.map(el => {
              let i
              if (this.statType == 0) {
                i = data.find(e => e.xaxis === el)
              } else {
                i = data.find(e => formatDate(e.xaxis, '{y}-{m}-{d}') === el)
              }
              return (i && i.yaxis) || ''
            })
            row.push([exported[crvType], ...rowData])
          }
        })
        // console.log(row)
        // return
        exportEXCEL(
          [['', ...timeArr], ...row],
          null,
          this.$route.query.asin + '-历史数据',
          csv
        )
      } else {
        this.$message.error('暂无数据可导出')
      }
    },
    downloadImg() {
      exportImg(this.$refs.chart, this.asin + '-历史数据.jpeg')
    },
    handleDatazoom({ batch }) {
      if (!batch) {
        return
      }

      // console.log(batch[0].startValue, batch[0].endValue)
      this.opts.dataZoom[0].startValue = batch[0].startValue
      this.opts.dataZoom[0].endValue = batch[0].endValue
      this.opts.dataZoom[1].startValue = batch[0].startValue
      this.opts.dataZoom[1].endValue = batch[0].endValue
      // let { startValue, endValue } = batch
      // this.opts.graphic[0].children[2].children[6].top = 2000
      // this.$nextTick(() => {
      //   this.opts.dataZoom[0].startValue = startValue
      //   this.opts.dataZoom[0].endValue = endValue
      //   this.opts.dataZoom[1].startValue = startValue
      //   this.opts.dataZoom[1].endValue = endValue
      // })
    },
    // handleLegendselectchanged(e) {
    //   if (e.name === 'eBay New' || e.name === 'eBay Used') {
    //     let id = this.ebayListingIds
    //     window.open(
    //       `https://www.ebay.com/itm/${e.name === 'eBay New' ? id[0] : id[1]}`,
    //       '_blank'
    //     )
    //   }
    // },
    dayClick(e) {
      this.curPos = e.topTarget.position[1]
      this.selectDate(this.curPos)
    },
    findDateFromArr(date, num, arr) {
      // 在数据arr中找到比此日期小的日期
      let findDate =
          new Date(date.split(' ')[0]).getTime() + num * 24 * 3600 * 1000,
        ret
      for (let index = 0; index < arr.length; index++) {
        const element = new Date(arr[index]).getTime()
        if (element <= findDate) {
          ret = arr[index]
        } else {
          break
        }
      }
      return ret
    },
    /**
     * @param{string} val 选择图表日期的位置
     */
    selectDate(pos) {
      console.log(pos)

      let val = pos / 14,
        startValue,
        start,
        end,
        endValue,
        timeData = this.opts.xAxis[0].data

      endValue = timeData.slice().pop()
      if (val == 0) {
        // [1,2]
        // endValue = timeData.slice().pop()
        // startValue = timeData[timeData.length - 1]
        startValue = this.findDateFromArr(endValue, -1, timeData)
      } else if (val == 1) {
        // endValue = timeData[timeData.length - 1]
        startValue = this.findDateFromArr(endValue, -8, timeData)
      } else if (val == 2) {
        // endValue = timeData[timeData.length - 1]
        startValue = this.findDateFromArr(endValue, -31, timeData)
      } else if (val == 3) {
        // endValue = timeData[timeData.length - 1]
        startValue = this.findDateFromArr(endValue, -91, timeData)
      } else if (val == 4) {
        // endValue = timeData[timeData.length - 1]
        startValue = this.findDateFromArr(endValue, -366, timeData)
      } else if (val == 5) {
        endValue = this._maxTime
        startValue = this._minTime
        // if (this.statType !== 1) {
        //   start = 0
        //   end = 100
        // }
        // start = 0
        // end = 100
      }
      console.log(startValue, endValue)

      this.opts.dataZoom[1].start = start
      this.opts.dataZoom[1].end = end
      this.opts.dataZoom[0].start = start
      this.opts.dataZoom[0].end = end
      // 找到附近的日期，切换按日/所有时可能不能放大缩小
      this.opts.dataZoom[1].startValue = startValue
      this.opts.dataZoom[1].endValue = endValue
      this.opts.dataZoom[0].startValue = startValue
      this.opts.dataZoom[0].endValue = endValue

      this.opts.graphic[0].children[2].children[6].top = pos
    },
    chartDone() {
      this.$nextTick(() => {
        console.log(22)

        // debugger
        this.$refs.chart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'dataZoomSelect',
          // 启动或关闭
          dataZoomSelectActive: true
        })
        addResizeListener(this.$refs.chart.$el, this.resizeChart)
      })
    },
    resizeChart() {
      this.$refs.chart &&
        this.$refs.chart.resize({ width: this.$refs.chart.offsetWidth })
    },
    async init() {
      this.getCsv()
    },
    async handleStatChange() {
      this.getCsv(null).then(() => {
        // 重置图表的日期选择
        // console.log(3)
        this.selectDate(70)
      })
    },
    getCsv(asin, isExport) {
      this.loading = true
      this.noData = false
      return this.$api[`productAnalysis/paKpCrv`]({
        ...this.storeInfo,
        statType: this.statType,
        taskId: this.taskId,
        asin: asin || this.asin
      })
        .then(data => {
          this.loading = false
          if (!data.data || !data.data.crvData.length) {
            this.noData = true
          } else {
            if (isExport) {
              data.data.timeArr = []
              this.getTime(data.data.timeArr, data.data.crvData)
              return data.data
            }
            this.handlerData(data.data)
            // setTimeout(() => {
            //   this.handlerData(data.data)
            //   console.log(2)
            // }, 0)
          }
        })
        .catch(() => {
          this.loading = false
          this.noData = true
        })
    },
    getTime(timeArr, data) {
      console.time('getTime')
      this._dataMap = {}
      let minTime,
        maxTime,
        allTime = []
      data.forEach(el => {
        if (el.data) {
          el.data.forEach(e => {
            if (this.statType == 0) {
              // 所有，时间都要选出来
              // console.log(e.xaxis)

              allTime.push(e.xaxis)
            } else {
              if (!minTime || minTime > e.xaxis) {
                minTime = e.xaxis
              }
              if (!maxTime || maxTime < e.xaxis) {
                maxTime = e.xaxis
              }
              if (allTime.indexOf(e.xaxis) === -1) {
                allTime.push(e.xaxis)
              }
            }
          })
        }
      })
      console.timeEnd('getTime', allTime)
      if (this.statType == 0) {
        // 所有，时间都要选出来
        timeArr.push(
          ...allTime.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          )
        )
      } else {
        console.time('while')
        // 按日
        while (new Date(minTime) <= new Date(maxTime)) {
          timeArr.push(formatDate(minTime, '{y}-{m}-{d}'))
          minTime = new Date(minTime).getTime() + 24 * 3600 * 1000
        }
        console.timeEnd('while')
      }
      console.log(timeArr)

      // this.curTimeArr = timeArr
    },
    handlerData(Odata = []) {
      let { crvData: data, trackingDays, ebayListingIds } = Odata
      let series = []
      let minTime,
        maxTime,
        timeArr = []
      this.getTime(timeArr, data)
      this._minTime = minTime = timeArr[0]
      this._maxTime = maxTime = timeArr.slice().pop()
      this.ebayListingIds = ebayListingIds ? JSON.parse(ebayListingIds) : []
      // console.log(timeArr)
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

      const arr = [11, 12, 16, 17, '-1']
      // const legend2 = [
      //   'New Offer Count',
      //   'Used Offer Count',
      //   'New Review Count',
      //   'Rating',
      //   'Review Count'
      // ]
      let index = 0,
        ebayIndex = 0,
        ebayNew,
        ebayUsed
      for (const i of data) {
        let el = i,
          { csvType, csvTypeLineColor } = this,
          crvName = csvType[el.crvType],
          curLengend =
            legend1.indexOf(crvName) > -1
              ? this.opts.legend[0]
              : this.opts.legend[1]

        curLengend.data.push(crvName)

        series.push({
          z: 55,
          name: crvName,
          type: 'line',
          symbolSize: 5,
          emphasis: {
            label: {
              show: true,
              color: '#333',
              padding: 4,
              borderWidth: 1,
              fontFamily: 'Microsoft YaHei',
              borderColor: this.cfuns.toRgb(
                this.csvTypeLineColor[el.crvType],
                1
              ),
              backgroundColor: this.cfuns.toRgb(
                this.csvTypeLineColor[el.crvType],
                0.7
              ),
              formatter: params => {
                // console.log(params)
                const {
                  data: { yaxis },
                  seriesName
                } = params
                return `${seriesName}\n${
                  this.csvTypeMap[el.crvType].unit
                } ${yaxis}`
              },
              position: this.csvTypeMap[el.crvType].position
            }
          },
          showAllSymbol: false,
          legendHoverLink: true,
          hoverAnimation: false,
          step: 'end',
          sampling: 'average',
          itemStyle: {
            color:
              csvTypeLineColor[el.crvType] === ''
                ? undefined
                : csvTypeLineColor[el.crvType]
          },

          // dimensions: [null, null, '年龄', '满意度'],
          datasetIndex: index++,
          // data: _data,
          connectNulls: false,
          yAxisIndex: arr.indexOf(el.crvType) > -1 || el.crvType == -1 ? 1 : 0,
          xAxisIndex: arr.indexOf(el.crvType) > -1 || el.crvType == -1 ? 1 : 0
        })
        if (!(arr.indexOf(el.crvType) > -1 || el.crvType == -1)) {
          ebayIndex++
        }
        if (el.crvType == 28) {
          ebayNew = ebayIndex
        }
        if (el.crvType == 29) {
          ebayUsed = ebayIndex
        }
        el.source = el.data
        delete el.data
      }
      // if (arr.indexOf(el.crvType) > -1 || el.crvType == -1) {
      //             Object.assign(obj, { xAxisIndex: 1, yAxisIndex: 1 })
      //           }
      this.opts.series = series
      this.opts.dataset = data
      console.log(minTime, maxTime)

      this.opts.xAxis[0].min = minTime
      this.opts.xAxis[1].min = minTime
      this.opts.xAxis[0].max = maxTime
      this.opts.xAxis[1].max = maxTime
      this.opts.xAxis[0].data = timeArr
      this.opts.xAxis[1].data = timeArr
      this.opts.graphic[0].children[2].children[5].style.text = `All(${trackingDays} days)`
      this.loading = false
      // 设置ebay链接
      if (ebayNew != null) {
        this.showEbayNewBtn = 25 * (ebayNew + 1)
      }
      if (ebayUsed != null) {
        this.showEbayUsedBtn = 25 * (ebayUsed + 1)
      }
    },
    // old
    // handlerData(Odata) {
    //   let { crvData: data, trackingDays, ebayListingIds } = Odata,
    //     timeArr = [],
    //     legendData = [],
    //     seriesData = []
    //   // positions = [
    //   //   'top',
    //   //   'left',
    //   //   'right',
    //   //   'bottom',
    //   //   'inside',
    //   //   'insideLeft',
    //   //   'insideRight',
    //   //   'insideTop',
    //   //   'insideBottom',
    //   //   'insideTopLeft',
    //   //   'insideBottomLeft',
    //   //   'insideTopRight',
    //   //   'insideBottomRight'
    //   // ]
    //   this.ebayListingIds = ebayListingIds ? JSON.parse(ebayListingIds) : []
    //   const arr = [11, 12, 16, 17, '-1']
    //   this.getTime(timeArr, data)
    //   console.time('setData')
    //   return this.handleWorkerData(
    //     data,
    //     legendData,
    //     timeArr,
    //     arr,
    //     seriesData,
    //     trackingDays
    //   )
    // },
    handleWorkerData(data, legendData, timeArr, arr, seriesData, trackingDays) {
      let vm = this
      let { statType, csvType, csvTypeLineColor, _dataMap } = this
      this.loading = true
      this.$worker
        .run(
          (
            data,
            legendData,
            timeArr,
            arr,
            seriesData,
            statType,
            csvType,
            csvTypeLineColor,
            _dataMap
          ) => {
            function formatDate(time, cFormat) {
              if (!time) {
                return null
              }
              time = new Date(time).getTime()
              if (arguments.length === 0) return null
              if ((time + '').length === 10) {
                time = +time * 1000
              }
              const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
              let date
              // debugger
              // if (typeof(time) === 'object') {
              //   date = time
              // } else {
              //   date = new Date(time)
              // }
              date = new Date(time)
              var formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
              }
              var timeStr = format.replace(
                /{(y|m|d|h|i|s|a)+}/g,
                (result, key) => {
                  var value = formatObj[key]
                  if (key === 'a')
                    return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
                  if (result.length > 0 && value < 10) {
                    value = '0' + value
                  }
                  return value || 0
                }
              )
              return timeStr
            }

            console.log(_dataMap)
            // timeArr.forEach(time => {
            //   timeEl = _dataMap[time]

            // })

            data.forEach(el => {
              let lastY
              legendData.push(csvType[el.crvType])
              if (el.data) {
                const _data = []
                let obj = {}
                timeArr.forEach(time => {
                  // console.log(time)

                  const cur =
                    statType == 0
                      ? el.data.find(e => e.xaxis === time)
                      : el.data.find(
                          e => formatDate(e.xaxis, '{y}-{m}-{d}') === time
                        )

                  if (cur) {
                    _data.push((lastY = cur.yaxis))
                  } else {
                    _data.push(lastY)
                  }
                })

                // console.log(
                //   el.crvType,
                //   (el.crvType + 100) % positions.length,
                //   positions[(el.crvType + 100) % positions.length]
                // )

                obj = {
                  name: csvType[el.crvType],
                  type: 'line',
                  symbolSize: 5,
                  showAllSymbol: false,
                  legendHoverLink: true,
                  hoverAnimation: false,
                  step: 'start',
                  sampling: 'average',
                  itemStyle: {
                    color:
                      csvTypeLineColor[el.crvType] === ''
                        ? undefined
                        : csvTypeLineColor[el.crvType]
                  },
                  data: _data,
                  connectNulls: false,
                  yAxisIndex: el.crvType == 3 ? 2 : 0
                  // emphasis: {
                  //   label: {
                  //     show: true,
                  //     fontSize: 12,
                  //     align: 'left',
                  //     lineHeight: 14,
                  //     formatter: '{a} \n{c}',
                  //     backgroundColor: 'auto',
                  //     borderColor: 'auto',
                  //     color: '#fff',
                  //     position: positions[(el.crvType + 100) % positions.length],
                  //     distance: ((i / positions.length) | 0) + 1,
                  //     padding: [4, 4, 4, 4]
                  //   }
                  // }
                }

                if (arr.indexOf(el.crvType) > -1 || el.crvType == -1) {
                  Object.assign(obj, { xAxisIndex: 1, yAxisIndex: 1 })
                }
                seriesData.push(obj)
                console.time('setData')
              }
            })
            return { legendData, seriesData }
          },
          [
            data,
            legendData,
            timeArr,
            arr,
            seriesData,
            statType,
            csvType,
            csvTypeLineColor,
            _dataMap
          ]
        )
        .then(({ legendData, seriesData }) => {
          console.log(legendData, seriesData)

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
          vm.opts.xAxis[0].data = vm.opts.xAxis[1].data = timeArr
          vm.opts.legend[0].data = legend1.filter(
            name => legendData.indexOf(name) > -1
          )
          vm.opts.legend[1].data = legend2.filter(
            name => legendData.indexOf(name) > -1
          )
          vm.opts.series = seriesData
          vm.opts.graphic[0].children[2].children[5].style.text = `All(${trackingDays} days)`
          vm.loading = false
        }) // logs 'vm.$worker run 1: Function in other thread'
        .catch(console.error) // logs any possible error
    }
  }
}
</script>