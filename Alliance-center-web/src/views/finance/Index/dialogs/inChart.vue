<template>
  <v-chart ref="chart" v-if="show" style="width:100%;height: 530px" autoresize :options="data" />
</template>
<script>
import vChart from 'vue-echarts'
import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
const graphic = require('echarts/lib/util/graphic')
export default {
  props: {
    vmVue: Object,
    type: {
      default: 'in'
    }
  },
  components: {
    vChart
  },
  watch: {
    'vmVue.value'() {
      this.getData()
    },
    'vmVue.date'() {
      this.getData()
    }
  },
  data() {
    return {
      show: true,
      data: {
        backgroundColor: '#FFF',
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
          left: '2%',
          top: '18%',
          right: '4%',
          containLabel: true
        },
        xAxis: {
          name: '日期',
          type: 'category',
          nameLocation: 'end',
          axisLine: {
            lineStyle: {
              color: '#777'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 12
          },
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: this.type == 'in' ? '收入 $' : '支出 $',
          nameTextStyle: {
            color: '#777',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: '#EEEEEE'
            }
          },
          type: 'value',
          axisLabel: {
            show: true,
            interval: '0',
            color: '#666'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#eeeeee',
              type: 'solid'
            }
          }
        },
        series: []
      },
      colors: [
        ['#2390FF', '#cae4ff'],
        ['#3143FE', '#d1d5fe'],
        ['#d2db71', '#fcffe1'],
        ['#58e1cd', '#eafffc'],
        ['#e95057', '#ffeded'],
        ['#5f7df4', '#edf0ff'],
        ['#5b9bd5', '#edf6ff'],
        ['#2535ae', '#e2e5ff'],
        ['#4caf50', '#e3ffe4'],
        ['#9c27b0', '#fcecff'],
        ['#ff9800', '#fff6e8'],
        ['#607d8b', '#ecf9ff'],
        ['#673ab7', '#faf6ff'],

        ['#0c3da3', '#ebf2ff'],
        ['#749f83', '#e5f8ec'],
        ['#e177f9', '#fcedff']
      ],
      index: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    refresh() {
      this.data.xAxis.data = []
      this.data.legend.data = []
      this.data.series = []
    },
    getGradient(cla, clb) {
      return new graphic.LinearGradient(
        0,
        0,
        1,
        0,
        [
          {
            offset: 1,
            color: cla // 0% 处的颜色
          },
          {
            offset: 0,
            color: clb // 100% 处的颜色
          }
        ],
        false
      )
    },
    getSeries(data, name) {
      if (this.index >= this.colors.length) {
        this.index = 0
      }
      let [c1, c2] = this.colors[this.index++]
      return {
        name: name,
        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 3 //折线宽度
            },
            // color: this.getGradient('#f72806', '#fbfa96'),
            color: c1
            // opacity: 0.4
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: c2 // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#fff' // 100% 处的颜色
              }
            ],
            globalCoord: false // 缺省为 false
          }
        },
        data
      }
    },
    getData() {
      if (this.$refs.chart) {
        this.$refs.chart.clear()
      }
      this.refresh()

      let { value: type, date } = this.vmVue
      let [queryStartDate, queryEndDate] = date || []
      if (type) {
        queryStartDate = this.$.formatDate(queryStartDate, '{y}-{m}')
        queryEndDate = this.$.formatDate(queryEndDate, '{y}-{m}')
      }
      this.index = 0
      this.$api[
        `main/${
          this.type === 'in' ? 'incomeStatisticsGraph' : 'expendStatisticsGraph'
        }`
      ]({
        type: type ? 'month' : 'day',
        queryStartDate,
        queryEndDate
      }).then(({ rows: data }) => {
        if (data.length) {
          // this.data.series
          data.forEach((el, index) => {
            let { name, data } = el
            if (index == 0) {
              let time = el.data.map(el => el.time)
              this.data.xAxis.data = time
            }
            if (data && data.length && data.some(el => el.data !== 0)) {
              this.data.legend.data.push(name)
              this.data.series.push(this.getSeries(data.map(e => e.data), name))
            }
          })
        }
      })
    },
    _close() {
      this.vmVue.value = 0
      this.vmVue.date = [
        this.$.formatDate(Date.now() - 30 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
        this.$.formatDate(Date.now(), '{y}-{m}-{d}')
      ]
    }
  }
}
</script>