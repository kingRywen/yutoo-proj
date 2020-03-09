<template>
  <div style="position:relative"><TabChart
    v-loading="loading"
    :axisCross="false"
    :limitTime="false"
    :limitEndDate="$route.query.endTime"
    ref="chart"
    name="产品评价数和评分对比"
    class="mt20"
    :defaultDay="0"
    :zoom-range="zoomRange"
    @mouseover="handleMouseover"
    @mouseout="handleMouseout"
    @timeChange="handleTimeChange"
    :data="data"
    @chartClick="chartClick"
    chartHeight="300"
    :exp="exp"
  >
    <!-- <ElButton slot="download" type="text" class="ml10 btnp0" icon="el-icon-download" @click="downloadExcel">下载</ElButton> -->
  </TabChart><el-tooltip v-if="showTip" :value="true" placement="bottom" effect="dark">
    <div slot="content" v-html="tipContent"></div>
    <span :style="tipStyle" class="_span"></span>
    </el-tooltip></div>
</template>

<script>
import { exportEXCEL } from 'Utils/xlsx'
// import _flatten from 'lodash/flatten'
export default {
  props: {
    skuData: {
      default: () => []
    }
  },
  data() {
    let firstZ = '评分',
      secondZ = '评价数'
    return {
      showTip:false,
tipStyle:{left:0, top: 0},
tipContent: '',
      zoomRange: [0, 100],
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
      firstZ,
      secondZ,
      data: {
        // color: ['#30a9d8', '#b7e6f8'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
          // formatter(params) {
          //   return vm.cfuns.getChartTooltip(params)
          // }
        },
        legend: {
          type: 'scroll',
          // left: '3%',
          right: '4%',
          top: '3%',

          data: []
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          triggerEvent:true,

          axisLabel: {
            rotate: 20
          },
          data: []
        },
        yAxis: [
          {
            type: 'value',
            name: firstZ,
            position: 'right',
            offset: -380,
            min: 0,
            max: 5,
            // minInterval: 1,
            show: false
          },
          {
            type: 'value',
            minInterval: 1,
            max: function(value) {
              return Math.ceil((value.max * 1.5) / 10) * 10
            },
            
            position: 'left',
            name: secondZ
          }
        ],
        series: []
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleMouseout(e) {
      if (e &&e.componentType == 'xAxis') {
        this.showTip = false
      }
    },
    handleMouseover(e) {
      console.log(e);
      
      if (e &&e.componentType == 'xAxis') {
        this.tipStyle.left = e.event.offsetX +'px'
        this.tipStyle.top = e.event.offsetY +70+'px'
        this.tipContent = this.skuData.find(el => el.asin == e.value).skuAttrList.map(e => e.attrName + '：' + e.attrValue + '<br>').join('')
        this.showTip = true
      } else {
        this.showTip =false
      }
      
    },
    chartClick(e) {
      if (e.componentType == 'xAxis') {
        this.$copyText(e.value).then(() =>{
          this.$message.success('复制成功')
        })
      }
    },
    getFromSlide() {
      this.allData = this.skuData.sort((b, a) => a.reviewCnt - b.reviewCnt)
      console.log(this.allData)

      this.handleDrawData()
    },
    // 获取数据
    fetchData(params) {
      if (!params || !params.startTime) {
        this.getFromSlide()
        return
      }
      params = params || {}
      Object.assign(params, this.storeInfo, {
        taskId: +this.$route.query.taskId,
        startTime: params.startTime,
        endTime: params.endTime
      })
      this.loading = true
      this.$api[`productAnalysis/paReviewComparedCrv`](params)
        .then(data => {
          this.loading = false
          this.allData = data.data.sort((b, a) => a.reviewCnt - b.reviewCnt)
          this.handleDrawData()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 处理渲染数据
    handleDrawData() {
      let legend = [],
        xAxis = [],
        series = [],
        data = this.allData,
        label = {
          normal: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize: 14,
              color: '#333'
            }
          }
        }
      data.forEach(el => {
        xAxis.push(el.asin)
        let rate = series.find(e => e.name === this.firstZ)
        let num = series.find(e => e.name === this.secondZ)
        if (!rate) {
          legend.push(this.firstZ)
          series.push({
            name: this.firstZ,
            type: 'bar',
            label,
            barGap: 0,
            data: [el.starCnt],
            barMaxWidth: 30
          })
        } else {
          rate.data.push(el.starCnt)
        }
        if (!num) {
          legend.push(this.secondZ)
          series.push({
            name: this.secondZ,
            type: 'bar',
            yAxisIndex: 1,
            label,
            barGap: 0,
            data: [el.reviewCnt],
            barMaxWidth: 30
          })
        } else {
          num.data.push(el.reviewCnt)
        }
      })
      // console.log(timeArr, arr)
      if (series[0].data.length > 15) {
        // console.log(Math.ceil((15 / series[0].data.length) * 10000) / 100)

        this.zoomRange = [
          0,
          Math.ceil((14 / series[0].data.length) * 10000) / 100
        ]
      }
      this.setOptions(legend, xAxis, series)
    },
    setOptions(legend, xAxis, series) {
      this.$refs.char && this.$refs.chart.clear()
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
        data = time.map((t, index) => [
          t,
          series[0].data[index],
          series[1].data[index]
        ]),
        exportData = [['ASIN', '评分', '评价数'], ...data]
      console.log(exportData)
      exportEXCEL(
        exportData,
        null,
        this.$route.query.asin + '-产品评价数和评分对比',
        csv
      )
    }
  },
  watch: {
    category() {
      this.handleDrawData()
    }
  }
}
</script>
<style lang="scss" scope>
  ._span {
    position: absolute
  }
</style>