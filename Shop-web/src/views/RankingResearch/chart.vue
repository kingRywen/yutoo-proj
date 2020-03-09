<template>
  <div ref="chart" style="height: 600px;margin-top: 50px;"></div>
</template>
<script>
const _ = require('lodash')
import echarts from 'echarts'
import {handleColors} from '@/utils/tools.js';
export default {
  props: ['pQuerys'],
  data() {
    let vm =this
    return {
      chart: null,
      yAxisOptions: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        }
      },
      option: {
        color: this.$const['CHART/COLOR'],
        // title: {
        //     text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis',
          position:  function (point, params, dom, rect, size) {
              // 固定在顶部
              return [point[0], '0%'];
          },
          formatter(params) {
            return vm.$.getChartTooltip(params, param => `$${param.data}`)
          }
        },

        legend: {
          data: [],
          type: 'scroll' //设置分页
        },
        grid: {
          left: '5%',
          right: '8%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: false
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: [
          {
            name: '自然搜索排名',
            type: 'value'
          }
        ],
        series: []
      },
      optionSeries: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  computed: {
    arrOptions() {
      let arr = this.pQuerys.columnOptions.slice()
      let index = arr.findIndex(el => el.label === '自然搜索排名')
      if (index > -1) {
        let el = arr.splice(index, 1)
        arr.unshift(el[0])
        return arr
      }
      return arr
    }
  },

  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart)
      if (this.option && typeof this.option === 'object') {
        // this.chart.clear()
        //
        this.noData()
      }
    },
    noData() {
      this.chart.clear()
      this.chart.setOption({
        title: {
          left: 'center', // 水平居中
          top: 'center', // 垂直居中
          text: '暂无数据',
          backgroundColor: '#EEEFF4',
          textStyle: {
            color: '#909399',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 14
          }
        }
      })
    },
    handleFilter(params) {

      let vm = this
      params.columnTypes = params.columnTypes.filter(el => el !== 'ALL_SELECT')
      if (params !== null && params.columnTypes.length > 0) {
        let query = _.cloneDeep(params)
        delete query.columnTypes
        vm.$emit('loading', true)
        vm.$api['krDataCurveList'](query).then(res => {
          vm.$emit('loading', false)
          let { code, data } = res
          let dataIndex = data.findIndex(el => el.dataType == 17)
          if (dataIndex) {
            let el = data.splice(dataIndex, 1)
            data.unshift(el[0])
          }
          if (code == 0) {
            let yAxis = []
            // let legendData =[]
            let legendDataTmp = []
            // let columnMap= vm.pParams.columnMap
            let columnMap = new Map()
            vm.arrOptions.forEach(element => {
              columnMap.set(element.value, element.label)
            })

            let series = []
            let seriesTmp = []
            if (data.length > 0) {
              data.forEach((element, index) => {
                let cValue = columnMap.get(element.dataType.toString())
                // legendData.push(cValue)
                let seriesData = []
                element.list.forEach(el => {
                  if (el.yAxis === null || el.yAxis === 'null') {
                    seriesData.push(null)
                  } else {
                    if (element.dataType == 2) {
                      seriesData.push(Number(el.yAxis).toFixed(1))
                    } else if (element.dataType == 7) {
                      // 霸占排名子sku价格 $13.99
                      let arr7 = el.yAxis.split('$')
                      if (arr7.length == 2) {
                        seriesData.push(Number(arr7[1]))
                      } else {
                        seriesData.push(null)
                      }
                    } else if (element.dataType == 9) {
                      // FIT率 乘以100
                      seriesData.push(Number(el.yAxis * 100))
                    } else {
                      seriesData.push(Number(el.yAxis))
                    }
                  }

                  // seriesData.push(parseInt(el.yAxis))
                })
                series.push({
                  name: cValue,
                  type: 'line',
                  // stack: '总量',
                  smooth: 0.4,
                  data: seriesData,
                  yAxisIndex: index
                })

                // console.log(params.columnTypes)
                
                
                params.columnTypes.forEach((elm, _i) => {
                  if (element.dataType == elm) {
                    let cValueTmp = columnMap.get(element.dataType.toString())
                    legendDataTmp.push(cValueTmp)
                    let seriesDataTmp = []
                    element.list.forEach(el => {
                      if (el.yAxis === null || el.yAxis === 'null') {
                        seriesDataTmp.push(null)
                      } else {
                        if (element.dataType == 2) {
                          seriesDataTmp.push(Number(el.yAxis).toFixed(1))
                        } else if (element.dataType == 7) {
                          // 霸占排名子sku价格 $13.99
                          let arr7 = el.yAxis.split('$')
                          if (arr7.length == 2) {
                            seriesDataTmp.push(Number(arr7[1]))
                          } else {
                            seriesDataTmp.push(null)
                          }
                        } else if (element.dataType == 9) {
                          // FIT率 乘以100
                          seriesDataTmp.push(Number(el.yAxis * 100))
                        } else {
                          seriesDataTmp.push(Number(el.yAxis))
                        }
                      }
                    })
                    seriesTmp.push({
                      name: cValueTmp,
                      type: 'line',
                      smooth: 0.4,
                      // stack: '总量',
                      data: seriesDataTmp,
                      yAxisIndex: _i
                    })
                    // let max = Math.max(...seriesDataTmp)
                    let options = {
                      offset: 0,
                      type: 'value',
                      // max: max ? parseInt(1.4 * max) : 100,
                      name: cValueTmp,
                      smooth: true,
                      position: cValueTmp === '自然搜索排名' ? 'left' : 'right',
                      show: cValueTmp === '自然搜索排名'
                    }

                    
                    
                    yAxis.push(
                      cValueTmp !== '自然搜索排名'
                        ? Object.assign(options, this.yAxisOptions)
                        : options
                    )
                  }
                })
              })
              let xAxisData = []
              data[0].list.forEach(element => {
                xAxisData.push(element.statTime)
              })

              let hasNatureLabel = params.columnTypes.indexOf('17')

              if (hasNatureLabel) {
               delete yAxis[0].show
               delete yAxis[0].axisLine
               delete yAxis[0].axisTick
               delete yAxis[0].axisLabel
               yAxis[0].position = 'left'
              }
							
							
							
              vm.option.legend.data = legendDataTmp
              vm.option.series = seriesTmp
              vm.option.xAxis.data = xAxisData
              vm.option.yAxis = yAxis
			 //  let yName = legendDataTmp[0]
				// vm.option.yAxis = {
				// 	name:yName,
				// 	type:'value'
				// }
				

				for (let i of vm.option.series) {
					let color = handleColors();
					i['itemStyle']={color:color}
				}
							
              // vm.optionLegendData=legendData
              vm.optionSeries = series

              // console.log(params)
              vm.chart.clear()
              // vm.option.tooltip = vm.getTooltip()
              if (xAxisData.length > 14) {
                vm.option.dataZoom = [
                  {
					  type: 'slider',
					  show: true,
					  //showDetail:false
					  handleIcon:
			  "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
				  },
                ]
              }
              vm.chart.setOption(vm.option, true)
              // vm.chart.on('legendselectchanged', function(obj) {
              //    console.log(obj)
              // })
            } else {
              // vm.chart.clear()
              vm.noData()
            }
          }
        })
      } else {
        vm.noData()
      }
    },
    getTooltip() {
      let tooltip = {
        trigger: 'axis',
        // axisPointer: {
        //     // 坐标轴指示器，坐标轴触发有效
        //     type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        // },
        // show: true,
        formatter: function(param) {
          if (param.length > 0) {
            // console.log(param)
            let str = `${param[0].name}<br>`
            console.log(param.length)
            for (let index = 0; index < param.length; index++) {
              const element = param[index]
              let seriesName = element.seriesName
              let value = element.value
              if (value === undefined) {
                value = '-'
              }
              if (seriesName === '霸占排名子sku价格') {
                value = `$${value}`
              }
              if (index % 2 == 0) {
                if (param.length === index + 1) {
                  str += `<div style="width:200px;">${
                    element.marker
                  }${seriesName}: ${value}</div>`
                } else {
                  str += `<div style="display: flex;"><div style="width:200px;">${
                    element.marker
                  }${seriesName}: ${value}</div>`
                }
              } else {
                str += ` <div style="width:200px;">${
                  element.marker
                }${seriesName}: ${value}</div></div>`
              }
            }
            // param.forEach(element => {
            //     let seriesName =element.seriesName
            //     let value =element.value
            //     if(value===undefined){
            //         value ='-'
            //     }
            //     if(seriesName==='霸占排名子sku价格'){
            //         value =`$${value}`
            //     }
            //     str +=`${element.marker}${seriesName}: ${value}`
            // });
            return str
          }
        }
      }

      return tooltip
    },
    setColumnTypes(val) {
      let valTmp = _.cloneDeep(val)
      let selList = _.remove(valTmp, function(n) {
        return n !== 'ALL_SELECT'
      })
      if (selList.length > 0) {
        let columnMap = new Map()
        this.arrOptions.forEach(element => {
          if (selList.indexOf(element.value) !== -1) {
            columnMap.set(element.value, element.label)
          }
        })
        // console.log(columnMap)
        let legendData = []
        columnMap.forEach(element => {
          legendData.push(element)
          // console.log(element)
        })
        // let legendData = this.optionLegendData
        // let series = this.optionSeries
        let series = [],
          yAxis = [],
          i = 0
        this.optionSeries.forEach((element, index) => {
          if (legendData.indexOf(element.name) !== -1) {
            series.push({ ...element})
            // let max = Math.max(...element.data)
            // console.log(max)
            let options = {
              type: 'value',
              // max: max ? parseInt(1.4 * max) : 100,
              name: element.name,
              show: element.name === '自然搜索排名',
              position: element.name === '自然搜索排名' ? 'left' : 'right',
              smooth: true
            }
            yAxis.push(
              element.name !== '自然搜索排名'
                ? Object.assign(options, this.yAxisOptions)
                : options
            )

            i++
          }
        })

        let hasNatureLabel = columnMap.get('17')

        if (!hasNatureLabel) {
          delete yAxis[0].show
          delete yAxis[0].axisLine
          delete yAxis[0].axisTick
          delete yAxis[0].axisLabel
          yAxis[0].position = 'left'
        }

        this.option.series = series
        this.option.yAxis = yAxis
        this.chart.clear()
        console.log(this.option);
        this.chart.setOption(this.option, true)
      } else {
        this.noData()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  display: flex;
}
</style>
