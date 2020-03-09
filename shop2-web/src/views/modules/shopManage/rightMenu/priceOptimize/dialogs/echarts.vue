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
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div v-if="isData">
      <div v-loading="echartsLoading" class="chart-body" ref="chart" auto-resize></div>
    </div>
    <div v-else style="line-height:400px;text-align:center;">暂无数据</div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'Components/TabChart/src/theme.js'
import { getBigNumMethod } from 'Utils/tools.js'
export default {
  props: ['params'],
  data() {
	let vm = this
	
    return {
      selectDate: null,
      echartsLoading: false,
      formInline: {},
      echartsData: null,
      isData: true
    }
  },
  methods: {
    dateChange(v = []) {
      this.formInline.startTime = v && v.length ? v[0] : null
      this.formInline.endTime = v && v.length ?  v[1] : null
      this.getData()
    },
    initEcharts() {
	  let vm = this
      this.chart = echarts.init(this.$refs.chart,'walden')
      this.chart.resize()
      let Xdata = [],
        datas = []
      this.echartsData.forEach(i => {
        Xdata.push(i.seoTime)
		if(i.price){
			datas.push(i.price)
		}else{
			datas.push(null)
		}       
      })
      this.chart.setOption({
        xAxis: {
          type: 'category',
          name: '时间',
          data: Xdata,
          axisLabel: {
            rotate: 45
          },
        },
        legend: {
          data: ['排名']
        },
   //      tooltip: {
   //        trigger: 'axis',
		 //  axisPointer: {
			// type: 'cross'
		 //  },
   //        // formatter: '时间 : {b} <br> {a} : {c}',
		 //  formatter: function (params, ticket, callback) {
			// let showField1 = params[0].axisValue
			// let showField2 = vm.echartsData.find(e=>e.seoTime == showField1).rankPages
			// let showField3 = vm.echartsData.find(e=>e.seoTime == showField1).pagesRank
			// return `第${showField2 === 0 ? '-' : showField2}页第${showField3 === 0 ? '-' : showField3}名`;
		 //    //return `时间 : ${showField1} <br> 第${showField2 === 0 ? '-' : showField2}页第${showField3 === 0 ? '-' : showField3}名`;
		 //  }
   //      },
        // 布局
        grid: {
          left: '6%',
          right: '8%',
          bottom: '11%', // 防止 dataZoom 重叠
          containLabel: true
        },
		toolbox:{
		  top: '-50px',
		  feature: {
			dataZoom:{
			  yAxisIndex:"none" 
			}
		  }
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
          name: '排名',
		  nameLocation:'start',
		  // inverse:true,
        },
        series: [
          {
            data: datas,
            name: '排名',
            type: 'line',
			smooth:true,
			itemStyle : {
				normal : {
					color:'#5793F3', 
					lineStyle:{
						color:'#5793F3' 
					}
				}
			},
          }
        ]
      })
	  setTimeout(() => {
			this.chart.dispatchAction({
			  type: 'takeGlobalCursor',
			  key: 'dataZoomSelect',
			  // 启动或关闭
			  dataZoomSelectActive: true
			});
		});
		
		window.onresize = function() {
		  vm.chart.resize()
		}
    },
    getData() {
      this.echartsLoading = true
      this.$api['shopManage/priceSeoSeoCrv'](this.formInline)
        .then(data => {
          this.echartsLoading = false
		  if(!data.data) data.data = []
          this.echartsData = data.data
          if (!this.echartsData.length) {
            this.isData = false
          } else {
            this.isData = true
			this.$nextTick(() => {
			  this.initEcharts()
			})
          }
        })
        .catch(() => {
		  this.isData = false
          this.echartsLoading = false
        })
    },
  },
  created() {
	const { today, computedDay } = this.cfuns.getDay(7)
    this.formInline = {
		...this.params,
		rangeTime: [computedDay,today],
		startTime: computedDay,
		endTime: today,
	}
    this.getData()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
	window.onresize = null
  },
}
</script>

<style scoped >
.chart-body {
  height: 700px;
  width: 100%;
  //border: 1px solid @borderColor;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
