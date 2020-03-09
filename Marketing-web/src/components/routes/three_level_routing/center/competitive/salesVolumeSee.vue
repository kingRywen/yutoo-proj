<template>
  <div class="_wrapper" v-loading.lock="fullscreenLoading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基础信息</span>
      </div>
      <div class="box">
        <table class="showGridTable">
          <tr>
            <td rowspan="4" class="img">
              <img :src="base.imageUrl" height="150" style="max-width:150px;max-height:150px;width:100%;height:auto">
            </td>
            <td class="title">
              产品名称
            </td>
            <td colspan="5" :title="base.title">
              <el-button type="text" @click="openLink" style="margin-left:0 !important;padding-left:0 !important">
                <strong>{{base.title || '-'}}</strong>
              </el-button>
              <!-- <a :href="base.productUrl"><strong>{{base.title || '-'}}</strong></a> -->

            </td>

          </tr>
          <tr>
            <td class="title">
              ASIN
            </td>
            <td :title="base.sku">
              {{base.sku || '-'}}
            </td>
            <td class="title">
              所在类目
            </td>
            <td colspan="3" :title="base.category">
              <div :title="base.category || '-'" class="fix__row_2">{{base.category || '-'}}</div>

            </td>

          </tr>
          <tr>
            <td class="title">
              评分
            </td>
            <td :title="base.starCnt">
              {{base.starCnt || '-'}}
            </td>
            <td class="title">
              品牌
            </td>
            <td :title="base.brand">
              {{base.brand || '-'}}
            </td>
            <td class="title">
              价格
            </td>
            <td :title="base.price">
              {{base.price || '-'}}
            </td>

          </tr>
          <tr>
            <td class="title">
              上架时间
            </td>
            <td :title="base.releaseDate">
              {{base.releaseDate || '-'}}
            </td>
            <td class="title">发货方式</td>
            <td>
              <span>{{base.fbpFlag==0?"自发货":base.fbpFlag==1?"FBA":base.fbpFlag==2?"自发货+FBA":"-"}}</span>
            </td>
            <td colspan="2"></td>
          </tr>
        </table>
      </div>
    </el-card>

    <div class='chart-spe _custom' v-loading="loading">
      <header class='header'>
        <span class="title">销量报表</span>
        <el-select v-if="asinsList.length" :popper-append-to-body="false" v-model="first.skus" placeholder="选择ASIN" multiple collapse-tags style="width:240px" @change="handleSaleChange">
          <el-option v-for="item in asinsList" :key="item.sku" :label="item.sku" :value="item.sku"></el-option>
        </el-select>
        <el-button style="height: 29px;line-height: 7px;" type="primary" @click="handleSure">确认</el-button>
      </header>
      <header class='right1 header'>
        <el-date-picker :picker-options="onlyOneYear" unlink-panels v-model="first.time" value-format="yyyy-MM-dd" @change="handleTimeChange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </header>

      <el-tabs class="box-card moveTabItem" type="border-card" v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="7天" name="7">
        </el-tab-pane>
        <!-- <el-tab-pane label="30天" name="30">
        </el-tab-pane> -->
        <!-- <el-tab-pane v-if="customDay" :label="`${customDay}`" name="cus">
        </el-tab-pane> -->
        <el-tabs class="moveTabItem2" type="border-card" v-model="activeName1">
          <el-tab-pane label="时间段订单占比" name='first'>
            <div v-show="showChart1" class="chart1">
              <echart ref="chart1" auto-resize :options="echartsData.first" id="skuScoreChart" :style="{width: '98%', height: '500px'}"></echart>
              <div class="export" @click="downloadExcel">
                <i class="el-icon-download"></i>
              </div>
            </div>
            <none-page v-show="!showChart1" no-back />
            <el-table :data="sumByHourList" style="margin-bottom:16px">
              <el-table-column label="中国时间" prop="groupTime">
                <template slot-scope="scope">
                  {{scope.row.groupTime}}-{{scope.row.groupTime != 24 ? +scope.row.groupTime+1 : 0}}点
                </template>
              </el-table-column>
              <el-table-column label="订单数" prop="orderCnt" sortable>

              </el-table-column>
              <el-table-column label="占比" prop="rate" sortable>
                <template slot-scope="scope">
                  {{((scope.row.rate*10000)/100).toFixed(2)}}%
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="ASIN销量占比">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>销量占比</span>
              </div>
              <el-row v-show="showChart2" :gutter="20">
                <el-col :span="24" style="margin-bottom:20px">
                  <echart auto-resize :options="echartsData.sencond" id="skuScoreChart" :style="{width: '98%', height: '400px'}"></echart>

                </el-col>
                <el-col :span="24">
                  <echart auto-resize :options="echartsData.three" id="skuScoreChart" :style="{width: '98%', height: '400px'}"></echart>
                </el-col>
              </el-row>
              <none-page v-show="!showChart2" no-back />
              <el-table :data="rateList" style="margin-bottom:16px">
                <el-table-column label="ASIN" prop="sku">
                </el-table-column>
                <el-table-column label="当前库存" prop="currentStock" sortable>
                  <template slot-scope="scope">
                    {{scope.row.currentStock == 999 ? '999+' : scope.row.currentStock === 0 ? '-' : scope.row.currentStock}}
                  </template>
                </el-table-column>
                <el-table-column label="最新库存" prop="latestStock" sortable>
                  <template slot-scope="scope">
                    {{scope.row.latestStock == 999 ? '999+' : scope.row.latestStock === 0 ? '-' : scope.row.latestStock}}
                  </template>
                </el-table-column>
                <el-table-column label="订单数" prop="orderCnt" sortable>
                </el-table-column>
                <el-table-column label="占比" prop="rate" sortable>
                  <template slot-scope="scope">
                    {{((scope.row.rate*10000)/100).toFixed(2)}}%
                  </template>
                </el-table-column>
              </el-table>

            </el-card>
          </el-tab-pane>
        </el-tabs>

      </el-tabs>
    </div>

  </div>
</template>

<script>
import NonePage from '@/components/common/NonePage'
import XLSX from 'xlsx'
import { debounce } from 'throttle-debounce'
export default {
  components: {
    NonePage
  },

  data() {
    let vm = this
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = (i / 180) * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }
    var colors = [
      '#5793f3',
      '#d14a61',
      '#675bba',
      '#FB6D6B',
      '#47C2E1',
      '#FDC74E',
      '#D48265',
      '#28C432',
      '#00c0de',
      '#607d8b'
    ]
    return {
      activeName1: 'first',
      selectedArr: [],
      selectedOldArr: true,
      exportFirstData: [],
      fullscreenLoading: false,
      showChart1: false,
      showChart2: false,
      loading: false,
      Day7: vm.$.getRangeDay(7),
      Day30: vm.$.getRangeDay(30),
      base: {},
      customDay: null,
      taskId: vm.$route.query.taskId,
      asin: vm.$route.query.asin,
      activeName: '7',
      asinsList: [],
      rateList: [],
      echartsData: {
        first: {
          color: colors,
          tooltip: {
            confine: true,
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            type: 'scroll',
            data: []
          },
          grid: {
            left: '6%',
            right: '6%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1]
              }
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return (
                    '订单数  ' +
                    params.value +
                    (params.seriesData.length
                      ? '：' + params.seriesData[0].data
                      : '')
                  )
                }
              }
            },
            data: []
          },
          yAxis: {
            type: 'value',
            name: '订单数',
            minInterval: 1
          },
          series: [
            {
              name: '订单数',
              type: 'line',
              smooth: 1,

              data: []
            }
          ],
          animationDuration: 1000
        },
        sencond: {
          color: colors,
          title: {
            text: '销量占比',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },

          legend: {
            type: 'scroll',
            top: 40,
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          series: [
            {
              name: '销量占比',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' }
              ],
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '12',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              }
            }
          ]
        },
        three: {
          color: colors,
          title: {
            text: '订单数',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100,
              minValueSpan: 0,
              maxValueSpan: 31
            },
            {
              start: 0,
              end: 100,
              minValueSpan: 0,
              maxValueSpan: 31,
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
          grid: {
            left: '7%',
            right: '7%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisLabel: {
                // interval: 0
                rotate: 45
              },
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              minInterval: 1
            }
          ],
          series: [
            {
              name: '订单数',
              type: 'bar',
              barWidth: '40%',
              barMaxWidth: '30',
              data: [10, 52, 200, 334, 390, 330, 220]
            }
          ]
        }
      },
      sumByHourList: [],
      first: {
        asins: [],
        time: vm.$.getRangeDay(7),
        skus: []
      }
    }
  },
  created() {
    this.initData()
    this.debGetData = debounce(800, false, this.getData)
    this.$store.commit(
      'common/pathFromCheckProductAnalysis',
      '/admin/competitive/salesVolume'
    )
  },
  methods: {
    downloadExcel() {
      console.log(123)
      let vm = this
      let data = []
      let _list = vm.exportFirstData[0].list.map(el => el.sendTime)
      _list.forEach(el => {
        let sub = {}
        vm.exportFirstData.forEach(__el => {
          let listEl = __el.list.find(_el => _el.sendTime === el)

          sub[__el.sku] = listEl ? listEl.orderCnt : '-'
        })

        let total = 0

        vm.exportFirstData.forEach(curEl => {
          let listEl = curEl.list.find(e => e.sendTime === el)
          total += listEl ? listEl.orderCnt : 0
        })

        data.push({
          日期: el,
          父产品: total,
          ...sub
        })
      })
      data = JSON.parse(JSON.stringify(data))
      let name = this.$route.query.asin + '的销量报表.xlsx'
      this.$store.commit('common/downName', name)
      this.$nextTick(() => {
        this.$.downloadExlShop(data, null, this.$route.query.asin)
      })
      // this.$.downloadExl(data, "销量报表");
    },
    openLink() {
      window.open(this.base.productUrl)
    },
    handleSaleChange(selected) {
      this.$nextTick(() => {
        if (this.selectedOldArr && !selected.length) {
          this.first.skus = this.asinsList
            .filter(el => '父产品' !== el.sku)
            .map(el => el.sku)
          return
        }
        if (selected.indexOf('父产品') == 0 && selected.length > 1) {
          let index = selected.findIndex(el => el === '父产品')
          selected.splice(index, 1)
        }
        if (selected.indexOf('父产品') === selected.length - 1) {
          selected.splice(0)
          this.$set(selected, 0, '父产品')
        }
      })
    },
    handleSure() {
      this.getData()
    },
    handleTimeChange(val) {
      this.getData(val)
      if (val[0] === this.Day7[0] && val[1] === this.Day7[1]) {
        this.activeName = '7'
      }
      if (val[0] === this.Day30[0] && val[1] === this.Day30[1]) {
        this.activeName = '30'
      }
    },
    handleTabClick(tabVm) {
      if (tabVm.name === 'cus') {
        this.first.time = tabVm.label.split('~')
      } else {
        this.first.time = this.$.getRangeDay(+tabVm.name)
      }

      this.getData(this.first.time)
    },
    initData() {
      console.log('object')
      this.fullscreenLoading = true
      Promise.all([
        this.getBaseInfo(),
        this.getSubAsin(),
        this.getSumByHour(),
        this.getRateList(),
        this.getFirst()
      ]).then(res => {
        this.$nextTick(() => {
          this.fullscreenLoading = false
        })
      })
    },
    getBaseInfo() {
      return this.$axios
        .post('/salesProduct/info', {
          taskId: +this.$route.query.taskId
        })
        .then(res => {
          this.$.handlerCode(res, () => {
            this.base = res.data.data
          })
        })
    },
    // 子ASIN列表
    getSubAsin() {
      return this.$axios
        .post('/salesProduct/selectAsin', {
          taskId: +this.$route.query.taskId
        })
        .then(res => {
          this.$.handlerCode(res, () => {
            this.asinsList = res.data.data
            // this.asinsList = [
            //   {
            //     sku: "BBB00000",
            //     fbpFlag: 0
            //   },
            //   {
            //     sku: "Bb111111",
            //     fbpFlag: 1
            //   }
            // ];
            this.asinsList.unshift({
              sku: '父产品',
              fbpFlag: null
            })
            this.first.skus = ['父产品']
          })
        })
    },
    // 销量分析按小时分段汇总
    getSumByHour(time, skus) {
      if (!time) {
        time = this.Day7
      }
      const startTime = time[0]
      const endTime = time[1]
      return this.$axios
        .post('/salesRec/sumByHour', {
          taskId: +this.$route.query.taskId,
          skus,
          startTime,
          endTime
        })
        .then(res => {
          this.$.handlerCode(res, () => {
            this.sumByHourList = res.data.data
          })
        })
    },
    getRateList(time, skus) {
      if (!time) {
        time = this.Day7
      }
      const startTime = time[0]
      const endTime = time[1]
      return this.$axios
        .post('/salesDay/rateList', {
          taskId: +this.$route.query.taskId,
          skus,
          startTime,
          endTime
        })
        .then(res => {
          this.$.handlerCode(res, () => {
            this.rateList = res.data.data
            if (res.data.data.length === 0) {
              this.showChart2 = false
              return
            }
            this.showChart2 = true
            this.getSencond(res)
            this.getThree(res)
          })
        })
    },
    // 获取数据
    getData(time) {
      console.log('获取数据')
      let skus = this.first.skus
      if (skus[0] === '父产品') {
        skus = []
      }

      if (!time) {
        time = this.first.time
      }
      this.loading = true
      try {
        Promise.all([
          this.getSumByHour(time, skus),
          this.getRateList(time, skus),
          this.getFirst(time, skus)
        ]).then(res => {
          this.loading = false
        })
      } catch (error) {
        this.loading = false
        this.$message.error('服务器请求错误')
        console.error(error)
      }
    },

    getFirst(time, skus = []) {
      let vm = this
      if (!time) {
        time = this.Day7
      }
      const startTime = time[0]
      const endTime = time[1]
      return this.$axios
        .post('/salesDay/list', {
          taskId: +this.$route.query.taskId,
          skus,
          startTime,
          endTime
        })
        .then(res => {
          vm.$.handlerCode(res, () => {
            const { data } = res.data
            vm.showChart1 = true
            if (!(data && data[0])) {
              vm.showChart1 = false
              return
            }

            this.exportFirstData = res.data.data

            let axis = []
            data.forEach(el => {
              axis.push(...el.list.map(el => el.sendTime))
            })

            axis = [...new Set(axis)].sort(
              (a, b) => new Date(a).getTime() - new Date(b).getTime()
            )
            const legend = data.map(el => el.sku)

            vm.echartsData.first.xAxis.data = axis
            vm.echartsData.first.legend.data = legend
            vm.echartsData.first.series.splice(0)

            vm.echartsData.first.series = data.map(el => {
              let _data = new Array(data.length)
              axis.forEach((time, index) => {
                let finded = el.list.find(_el => _el.sendTime === time)
                if (finded) {
                  _data[index] = finded.orderCnt
                } else {
                  _data[index] = 0
                }
              })
              return {
                name: el.sku,
                type: 'line',

                smooth: true,
                data: _data
              }
            })

            vm.echartsData.first = JSON.parse(
              JSON.stringify(vm.echartsData.first)
            )
          })
        })
    },

    getSencond(res) {
      let vm = this
      const { data } = res.data
      data.sort((a, b) => b.orderCnt - a.orderCnt)
      const axis = data.map(el => el.sku)
      vm.echartsData.sencond.legend.data = axis
      vm.echartsData.sencond.series[0].data = data.map(el => ({
        value: el.orderCnt,
        name: el.sku
      }))
      vm.echartsData.sencond = JSON.parse(
        JSON.stringify(vm.echartsData.sencond)
      )
    },

    getThree(res) {
      let vm = this
      let { data } = res.data
      data = data.sort((a, b) => a - b)
      const axis = data.map(el => el.sku)
      vm.echartsData.three.xAxis[0].data = axis
      if (axis.length <= 15) {
        vm.echartsData.three.dataZoom[0].end = 100
        vm.echartsData.three.dataZoom[1].end = 100
      }
      if (axis.length > 15 && axis.length <= 30) {
        vm.echartsData.three.dataZoom[0].end = 50
        vm.echartsData.three.dataZoom[1].end = 50
      }
      if (axis.length > 50) {
        vm.echartsData.three.dataZoom[0].end = 30
        vm.echartsData.three.dataZoom[1].end = 30
      }

      if (axis.length < 13) {
        vm.echartsData.three.xAxis[0].axisLabel.rotate = 0
      } else {
        vm.echartsData.three.xAxis[0].axisLabel.rotate = 45
      }

      vm.echartsData.three.series[0].data = data.map(el => el.orderCnt)
      vm.echartsData.three = JSON.parse(JSON.stringify(vm.echartsData.three))
    }
  },
  watch: {
    'first.skus'(val, oldVal) {
      console.log(val, oldVal)
      if (!val.length && oldVal.length === 1 && oldVal[0] === '父产品') {
        this.selectedOldArr = true
      } else {
        this.selectedOldArr = false
      }
    },
    'first.time'(val) {
      const day7 = this.$.getRangeDay(7)
      const day30 = this.$.getRangeDay(30)
      if (val[0] === day7[0] && val[1] === day7[1]) {
        this.activeName = '7'
      } else if (val[0] === day30[0] && val[1] === day30[1]) {
        this.activeName = '30'
      } else {
        this.customDay = val[0] + '~' + val[1]
        this.activeName = 'cus'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chart1 {
  position: relative;
  .export {
    position: absolute;
    top: 16px;
    right: 40px;

    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
}
._wrapper {
  overflow: auto;
  height: 100%;
}
.box {
  display: flex;
  .text {
    margin-left: 20px;
    .main {
      margin-bottom: 10px;
    }
    .info {
      font-size: 14px;
      display: block;
      margin-bottom: 10px;
      line-height: 24px;
      &.title {
        font-weight: bold;
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
}
.box-card {
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.moveTabItem {
  .el-tabs__content {
    overflow: initial;
  }
}
.chart-spe {
  position: relative;
  .header {
    & > .title {
      margin-right: 6px;
    }
    padding-left: 15px;
    position: absolute;
    z-index: 9;
    top: 1px;
    left: 1px;
    background: #f5f7fa;
    height: 38px;
    border-bottom: 1px solid #e4e7ed;
    line-height: 37px;
  }
  .right1 {
    right: 50px;
    left: inherit;
    line-height: 41px;
  }
  .box-card {
    .el-tabs__nav {
      // float: right;
      // transform: translateX(-380px) !important;
    }
  }
}

._custom {
  .el-loading-spinner {
    top: 50px;
  }
}
</style>

