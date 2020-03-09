<template>
  <div class="ch">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="时间范围:">
        <el-date-picker
          v-model="formInline.rangeTime"
          type="daterange"
          size="mini"
          unlink-panels
          @change="dateChange"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="统计周期:">
        <el-select v-model="formInline.period" placeholder="请选择" size="mini" @change="Selectchange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div style="position:absolute;right:30px;top:0" v-loading="$store.state.isloading || $store.state.loading">
      <el-button type="text" icon="el-icon-download" @click="downloadExel">下载</el-button>
    </div>
    <div v-if="isData">
      <div v-loading="echartsLoading" class="chart-body" ref="chart" auto-resize></div>
    </div>
    <div v-else style="line-height:400px;text-align:center;">暂无数据</div>
    <!-- {{params}} -->
  </div>
</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import { downloadFile } from 'Utils/tools'
export default {
  props: ['params'],
  data() {
    return {
      chartStyle: {
        height: '400px'
      },
      selectDate: null,
      echartsLoading: false,
      options: [
        { value: 1, label: '日' },
        { value: 7, label: '周' },
        { value: 30, label: '月' }
      ],
      formInline: {
        rangeTime: null,
        period: 1,
        sellerId: null,
        siteId: null,
        platformId: null,
        startTime: null,
        endTime: null,
        strategyType: null,
        objectId: null
      },
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > (Date.now() - 15 * 60 * 60 * 1000) || (this.selectDate && ((time.getTime() > this.selectDate + 365 * 24 * 60 * 60 * 1000) || (time.getTime() < this.selectDate - 365 * 24 * 60 * 60 * 1000)))
        },
        onPick: ({ maxDate, minDate }) => {
          console.log(maxDate, minDate);
          this.selectDate = maxDate || minDate
        }
      },
      echartsData: null,
      isData: true
    }
  },
  methods: {
    //下载excel表格
    downloadExel() {
      this.$api['adManualExportSeoData'](this.formInline)
        .then(data => {
          downloadFile(data, '数据展示')
        })
        .catch(() => {})
    },
    //选择时间范围改变
    dateChange(v = []) {
      this.formInline.startTime = v[0]
      this.formInline.endTime = v[1]
      this.getData()
    },
    // //选择日月周改变
    // Selectchange(v) {
    //   this.formInline.period = v
    //   this.getData()
    // },
    echratsResize() {
      //console.log(1);
      this.$nextTick(function() {
        let div = document.querySelectorAll('.ch')[0], scroll = div
        while ([].slice.call(scroll.classList).indexOf('el-scrollbar') == -1) {
          scroll = scroll.parentNode
        }
         this.chart && this.chart.resize({
           height: scroll.offsetHeight - 100
         })
      })
    },
    initEcharts() {
      this.chart = echarts.init(this.$refs.chart)
      this.chart.resize()
      let Xdata = [],
        datas = []
      this.echartsData.forEach(i => {
        Xdata.push(i.seoTime)
        datas.push(i.bid)
      })
      this.chart.setOption({
        xAxis: {
          type: 'category',
          name: '时间',
          data: Xdata,
          axisLabel: {
            rotate: 45
          }
        },
        legend: {
          data: [this.params.showCpc ? '关键词出价' : this.params.showGroup ? '默认出价' : '预算']
        },
        tooltip: {
          trigger: 'axis',
          formatter: '时间 : {b} <br> {a} : {c}',
        },
        // 布局
        grid: {
          left: '6%',
          right: '8%',
          bottom: '11%', // 防止 dataZoom 重叠
          containLabel: true
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            //showDetail:false
            handleIcon:
              'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'
          }
        ],
        yAxis: {
          type: 'value',
          name: this.params.showCpc ? '关键词出价' : this.params.showGroup ? '默认出价' : '预算'
        },
        series: [
          {
            data: datas,
            name: this.params.showCpc ? '关键词出价' : this.params.showGroup ? '默认出价' : '预算',
            type: 'line'
          }
        ]
      })
    },
    getData() {
      this.echartsLoading = true
      this.$api['adManualSeoList'](this.formInline)
        .then(data => {
          this.echartsLoading = false
          this.echartsData = data.data
          if (!this.echartsData.length) {
            this.isData = false
          } else {
            this.isData = true
          }
          this.$nextTick(() => {
            this.initEcharts()
          })
        })
        .catch(() => {
          this.echartsLoading = false
        })
    }
  },
  created() {
    let time = dayjs().format('YYYY-MM-DD') //获取当前时间
    this.formInline.startTime = dayjs(
      Date.now() - 30 * 24 * 60 * 60 * 1000 - 15 * 60 * 60 * 1000
    ).format('YYYY-MM-DD')
    this.formInline.endTime = dayjs(Date.now() - 15 * 60 * 60 * 1000).format(
      'YYYY-MM-DD'
    )
    this.formInline.rangeTime = [
      this.formInline.startTime,
      this.formInline.endTime
    ]
    this.formInline.sellerId = this.sellerId //卖家id
    this.formInline.siteId = this.siteId
    this.formInline.platformId = this.platformId
    this.formInline.strategyType = this.params.strategyType
    this.formInline.objectId = this.params.objectId || 0
    this.getData()

    GLOBAL.vbus.$on('dialog.fullscreen', (full) =>{
      setTimeout(() => {
        // this.chartStyle.height = full ? '600px' : '400px'
        this.echratsResize()
      });
      
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
}
</script>

<style scoped lang="less">
.chart-body {
  height: 400px;
  width: 100%;
  //border: 1px solid @borderColor;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
