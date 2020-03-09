<template>
  <v-chart v-if="data.length" style="width:100%" autoresize :options="data1" />
  <NoneData v-else></NoneData>
</template>
<script>
import vChart from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
export default {
  props: ['data'],
  components: {
    vChart
  },
  data() {
    return {
      data1: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '累计资产支出占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            clockwise: false,
            data: [],
            label: {
              normal: {
                position: 'outside',
                formatter: '{b} : ${c} ({d}%)',
                textStyle: {
                  color: '#999',
                  fontSize: 14
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#ffffff'
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#00acee', '#52cdd5', '#79d9f1', '#a7e7ff', '#c8efff'],
        backgroundColor: '#fff'
      }
    }
  },
  watch: {
    data(val) {
      if (val) {
        val = JSON.parse(JSON.stringify(val))
        this.data1.series[0].data = val.filter(el => el.value !== 0)
      }
    }
  }
}
</script>