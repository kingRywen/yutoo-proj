<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="formInline.abscissaType" size="mini" placeholder="请选择">
          <el-option v-for="item in tiemOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="searchJobType"
          placeholder="请选择"
          size="mini"
          @change="selectAll"
          style="width:230px;"
          multiple
          collapse-tags
          clearable
        >
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围:">
        <el-date-picker
          v-model="formInline.rangeTime"
          type="daterange"
          size="mini"
          @change="dateChange"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          range-separator="至"
		  unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" plain size="mini" @click="rearchMethod">确认搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="position:absolute;right:30px;top:0">
      <el-button
        class="export-btn"
        type="text"
        icon="el-icon-download"
        :loading="$store.state.isloading || $store.state.loading"
        @click="downloadExel"
      ></el-button>
    </div>
    <div v-if="isData">
      <div v-loading="echartsLoading" :class="echartsClass" ref="chart"></div>
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
      searchJobType: [],
      searchJobType0: [
        '全部',
        '曝光量',
        '点击量',
        '点击率',
        '订单量',
        '转化率',
        'CPC',
        '花费',
        '广告销售总额',
        'ACOS',
        '排名'
      ],
      searchJobType1: ['全部', '曝光量', 'CPC'],
      oldSearchJobType: [],
      selectList: [],
      echartsLoading: false,
      options: [],
      options0: [
        { name: '全部', value: '全部' },
        { name: '曝光量', value: '曝光量' },
        { name: '点击量', value: '点击量' },
        { name: '点击率', value: '点击率' },
        { name: '订单量', value: '订单量' },
        { name: '转化率', value: '转化率' },
        { name: 'CPC', value: 'CPC' },
        { name: '花费', value: '花费' },
        { name: '广告销售总额', value: '广告销售总额' },
        { name: 'ACOS', value: 'ACOS' },
        { name: '排名', value: '排名' }
      ],
      options1: [
        { name: '全部', value: '全部' },
        { name: '曝光量', value: '曝光量' },
        { name: 'CPC', value: 'CPC' }
      ],
      formInline: {
        rangeTime: null,
        abscissaType: 0
      },
      pickerOptions: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() <
              new Date(this.params.resultTime).getTime() - 24 * 60 * 60 * 1000
          )
        }
      },
      echartsData: null,
      isData: true,
      tiemOptions: [
        { name: '时间', value: 0 },
        { name: '点击率', value: 1 },
        { name: '转化率', value: 2 }
      ],
      echartsClass: 'chart-body'
    }
  },
  methods: {
    downloadExel() {
      this.$api['newAdDataAdKeywordHistoryStatExport'](this.formInline)
        .then(data => {
          downloadFile(data, '数据展示')
        })
        .catch(() => {})
    },
    echratsResize(type) {
      if (type) {
        this.echartsClass = 'chart-big'
      } else {
        this.echartsClass = 'chart-body'
      }
      this.$nextTick(function() {
        this.chart && this.chart.resize()
      })
    },
    selectAll(val) {
      const allValues = []
      for (const item of this.options) {
        allValues.push(item.value)
      }
      const oldVal =
        this.oldSearchJobType.length === 1 ? this.oldSearchJobType[0] : []

      if (val.includes('全部')) this.searchJobType = allValues
      if (oldVal.includes('全部') && !val.includes('全部'))
        this.searchJobType = []
      if (oldVal.includes('全部') && val.includes('全部')) {
        const index = val.indexOf('全部')
        val.splice(index, 1)
        this.searchJobType = val
      }
      if (
        !oldVal.includes('全部') &&
        !val.includes('全部') &&
        !this.oldSearchJobType.length
      )
        this.searchJobType = []
      if (
        !oldVal.includes('全部') &&
        val.includes('全部') &&
        !this.oldSearchJobType.length
      ) {
        const index = val.indexOf('全部')
        val.splice(index, 1)
        this.searchJobType = val
      }
      //用来选最后一项的时候把全部也勾选上
      if (
        !val.includes('全部') &&
        val.length === 18 &&
        this.searchJobType.length
      ) {
        val.unshift('全部')
        this.searchJobType = val
      }
      this.oldSearchJobType[0] = this.searchJobType
    },
    rearchMethod() {
      this.getData()
    },
    //选择时间范围改变
    dateChange(v) {
      this.formInline.startTime = v[0]
      this.formInline.endTime = v[1]
    },
    //初始化echarts
    initChart(data) {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      if (!data.length) {
        return
      }
      this.chart = echarts.init(this.$refs.chart)

      switch (this.formInline.abscissaType) {
        case 0:
          var Xdata = [] //横坐标
          var datas = [
            { name: '曝光量', value: 'impressions', type: 'line', data: [] },
            { name: '点击量', value: 'clicks', type: 'line', data: [] },
            { name: '点击率', value: 'clickRates', type: 'line', data: [] },
            { name: '订单量', value: 'adOrderCnt', type: 'line', data: [] },
            {
              name: '转化率',
              value: 'adConversionRates',
              type: 'line',
              data: []
            },
            { name: 'CPC', value: 'cpc', type: 'line', data: [] },
            { name: '花费', value: 'cost', type: 'line', data: [] },
            { name: '广告销售总额', value: 'adSales', type: 'line', data: [] },
            { name: 'ACOS', value: 'acos', type: 'line', data: [] },
            { name: '排名', value: 'rank', type: 'line', data: [] }
          ] //数据
          var legendData = [] //标题数组
          datas.forEach(i => {
            legendData.push(i.name)
          })
          data.forEach(i => {
            Xdata.push(i.statTime)
          })
          for (var i = 0; i < datas.length; i++) {
            for (var j = 0; j < data.length; j++) {
              for (var k in data[j]) {
                if (datas[i].value == k) datas[i].data.push(data[j][k])
              }
            }
          }
          for (var i = 0; i < datas.length; i++) {
            var flag = false
            for (var v = 0; v < this.searchJobType.length; v++) {
              if (datas[i].name === this.searchJobType[v]) {
                flag = true
              }
            }
            if (!flag) {
              delete datas[i]
            }
          }
          break
        case 1:
          var Xdata = [] //横坐标
          var datas = [
            { name: '曝光量', value: 'impressions', type: 'line', data: [] },
            { name: 'CPC', value: 'cpc', type: 'line', data: [] }
          ] //数据
          var legendData = [] //标题数组
          datas.forEach(i => {
            legendData.push(i.name)
          })
          data.forEach(i => {
            Xdata.push(i.clickRates)
          })
          for (var i = 0; i < datas.length; i++) {
            for (var j = 0; j < data.length; j++) {
              for (var k in data[j]) {
                if (datas[i].value == k) datas[i].data.push(data[j][k])
              }
            }
          }
          for (var i = 0; i < datas.length; i++) {
            var flag = false
            for (var v = 0; v < this.searchJobType.length; v++) {
              if (datas[i].name === this.searchJobType[v]) {
                flag = true
              }
            }
            if (!flag) {
              delete datas[i]
            }
          }
          break
        case 2:
          var Xdata = [] //横坐标
          var datas = [
            { name: '曝光量', value: 'impressions', type: 'line', data: [] },
            { name: 'CPC', value: 'cpc', type: 'line', data: [] }
          ] //数据
          var legendData = [] //标题数组
          datas.forEach(i => {
            legendData.push(i.name)
          })
          data.forEach(i => {
            Xdata.push(i.adConversionRates)
          })
          for (var i = 0; i < datas.length; i++) {
            for (var j = 0; j < data.length; j++) {
              for (var k in data[j]) {
                if (datas[i].value == k) datas[i].data.push(data[j][k])
              }
            }
          }
          for (var i = 0; i < datas.length; i++) {
            var flag = false
            for (var v = 0; v < this.searchJobType.length; v++) {
              if (datas[i].name === this.searchJobType[v]) {
                flag = true
              }
            }
            if (!flag) {
              delete datas[i]
            }
          }
          break
      }
	  if(this.formInline.abscissaType == 1 || this.formInline.abscissaType == 2){
		  Xdata = Xdata.map((e)=>{
			  return e*100 + '%'
		  })
	  }
      this.chart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Xdata,
          name:
            this.formInline.abscissaType == 0
              ? '时间'
              : this.formInline.abscissaType == 1
              ? '点击率'
              : '转化率'
        },
        legend: {
          data: legendData,
          type: 'scroll'
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
        tooltip: {
          trigger: 'axis',
          confine: true,
          padding: [0, 5, 10, 5],
          formatter: (params, ticket, callback) => {
            //let index=params[0].dataIndex;
            //console.log(params);
            let str = params[0].axisValue
            params = params.filter(
              el =>
                !(
                  el.data == 0 ||
                  el.data === '' ||
                  el.data == null ||
                  isNaN(el.data)
                )
            )
            if (!params.length) {
              return
            }
            params.forEach(i => {
              if (
                i.seriesName.indexOf('率') !== -1 ||
                i.seriesName.indexOf('ACOS') !== -1
              ) {
                str +=
                  '<div>' +
                  '<i style="background-color: ' +
                  i.color +
                  '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> ' +
                  i.seriesName +
                  ':' +
                  Math.ceil(i.data * 10000) / 100 +
                  '%' +
                  '</div>'
              } else {
                str +=
                  '<div>' +
                  '<i style="background-color: ' +
                  i.color +
                  '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> ' +
                  i.seriesName +
                  ':' +
                  i.data +
                  '</div>'
              }
            })
            // let str='第'+this.echartsData[index].webRankPages+"页第"+this.echartsData[index].webPagesRank+"名";
            return str
          }
        },
        yAxis: {
          type: 'value'
        },
        series: datas
      })
    },
    getData() {
      this.echartsLoading = true
      this.isData = true
      if (this.chart) {
        this.chart.dispose()
      }
      this.$api[this.params.url](this.formInline).then(data => {
        if (data.code === 0) {
          this.echartsLoading = false
          this.echartsData = data.data
          this.initChart(this.echartsData)
          if (this.echartsData.length === 0) {
            this.isData = false
          }
        }
      })
    }
  },
  created() {
    let endTime = dayjs().format('YYYY-MM-DD')
    let startTime = dayjs()
      .subtract(1, 'year')
      .format('YYYY-MM-DD')
    this.formInline.platformId = this.platformId
    this.formInline.siteId = this.siteId
    this.formInline.sellerId = this.sellerId
    this.formInline.startTime = startTime
    this.formInline.endTime = endTime
    this.formInline.rangeTime = [startTime, endTime]
    this.formInline.objectId = this.params.objectId
    this.searchJobType = this.searchJobType0
    this.options = this.options0
    this.getData()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    'formInline.abscissaType': {
      handler(val) {
        switch (val) {
          case 0:
            this.searchJobType = this.searchJobType0
            this.options = this.options0
            break
          case 1:
            this.searchJobType = this.searchJobType1
            this.options = this.options1
            break
          case 2:
            this.searchJobType = this.searchJobType1
            this.options = this.options1
            break
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.chart-body {
  height: 400px;
  width: 100%;
  //border: 1px solid @borderColor;
  padding-top: 10px;
  padding-bottom: 10px;
}
.chart-big {
  height: 700px;
  width: 100%;
  //border: 1px solid @borderColor;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
