<template>
  <div v-if="blank === false" class="tabchart-wrapper">
    <div class="tabchart-header">
      <span class="tabchart-title">
        {{name}}
        <ElTooltip v-if="tooltip" :content="tooltip" placement="right">
          <i class="el-icon-info"></i>
        </ElTooltip>
        <slot name="title"></slot>
      </span>
      <div class="right">
        <slot name="right"></slot>
        <template v-if="showDate">
          <el-radio-group v-if="showDateBtn" v-model="day" size="mini" @change="handleDayChange">
            <el-radio-button :label="7" :disabled="btn7disabled">7天</el-radio-button>
            <el-radio-button :label="15" :disabled="btn15disabled">15天</el-radio-button>
            <el-radio-button :label="30" :disabled="btn30disabled">30天</el-radio-button>
          </el-radio-group>
          <el-date-picker
            size="mini"
            @change="handleDatePickerChange"
            :picker-options="pickerOptions"
            style="width:230px;margin-left:10px"
            v-model="date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="~"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </template>
        <slot name="download">
          <el-dropdown
            v-if="exp && !noData"
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
        </slot>
      </div>
    </div>
    <slot name="middle" v-if="!noData"></slot>
    <!-- <canvas></canvas> -->
    <div :style="!$slots.table ? {width:'100%',height:`${parseInt(chartHeight, 10)}px`} : null">
      <template v-if="!$slots.table">
        <v-chart
          v-on="$listeners"
          :theme="theme"
          @hook:mounted="chartDone"
          @click="handleChartClick"
          @mousemove="$emit('mousemove', $event)"
          @mouseover="$emit('mouseover')"
          @mouseout="$emit('mouseout', $event)"
          v-if="!noData"
          ref="chart"
          :init-options="initOptions"
          style="width:100%"
          :options="opts"
          :auto-resize="false"
        />
        <NonePage v-else noBack />
      </template>

      <ElTabs class="mt10" type="card" v-model="activeName" v-else @tab-click="handleTabClick">
        <ElTabPane name="first" label="图标视图">
          <slot name="chartbtn"></slot>
          <div :style="{width:'100%',height:`${parseInt(chartHeight, 10)}px`}">
            <template v-if="showChart">
              <v-chart
                v-on="$listeners"
                :theme="theme"
                @hook:mounted="chartDone"
                @click="handleChartClick"
                @mousemove="$emit('mousemove', $event)"
                @mouseover="$emit('mouseover', $event)"
                @mouseout="$emit('mouseout', $event)"
                ref="chart"
                v-if="!noData"
                :init-options="initOptions"
                style="width:100%"
                :options="opts"
                :auto-resize="false"
              />
              <NonePage v-else noBack />
            </template>
          </div>
        </ElTabPane>
        <ElTabPane name="second" label="列表视图">
          <div style="margin:12px 20px 20px">
            <slot name="table"></slot>
          </div>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
  <div v-else :style="{width:'100%',height:`${parseInt(chartHeight, 10)}px`}" class="mb20">
    <el-date-picker
      v-if="showBlankDate"
      size="mini"
      @change="$emit('timeChange', $event, day)"
      :picker-options="pickerOptions"
      style="width:230px;margin-left:10px"
      v-model="date"
      value-format="yyyy-MM-dd"
      type="daterange"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <v-chart
      v-on="$listeners"
      :theme="theme"
      @hook:mounted="chartDone"
      v-if="!noData"
      @click="handleChartClick"
      @mousemove="$emit('mousemove', $event)"
      @mouseover="$emit('mouseover')"
      @mouseout="$emit('mouseout', $event)"
      ref="chart"
      :init-options="initOptions"
      style="width:100%"
      :options="opts"
      :auto-resize="false"
    />
    <NonePage v-else noBack />
  </div>
</template>

<script>
// import 'echarts'
// import VueECharts from 'vue-echarts'
import chartDataZoom from './json'
import _assign from 'lodash/assign'

import { addResizeListener, removeResizeListener } from 'Utils/resize-event'

export default {
  name: 'TabChart',
  components: {
    'v-chart': () =>
      Promise.all([
        import('echarts'),
        import('vue-echarts'),
        import('./theme.js')
      ]).then(
        // eslint-disable-next-line no-unused-vars
        ([e, v]) => v
      )
  },
  props: {
    theme: {
      default: 'walden'
    },
    showDate: {
      default: true
    },
    showDateBtn: {
      default: true
    },
    // 限制结束时间
    limitEndDate: String,
    showBlankDate: {
      default: false
    },
    exp: Array,
    zoomRange: {
      type: Array,
      default: () => [0, 100]
    },
    maxDisplay: Number,
    // 是否逆序排列
    reverse: {
      default: false
    },
    // 图表的坐标轴显示方式，默认cross
    axisCross: {
      default: true
    },
    // 是否限制开始时间
    limitTime: {
      type: [String, Boolean],
      default() {
        return this.$route.query.startTime
      }
    },
    blank: {
      default: false
    },
    tooltip: String,
    chartHeight: {
      type: [String, Number],
      default: '350px'
    },
    name: String,
    defaultDay: {
      default: 30
    },
    type: {
      default: 'line'
    },
    // 传入的表格数据
    data: {
      type: Object,
      default: () => ({})
    }
  },

  created() {
    if (!this.defaultDay) {
      return
    }
    const { today, computedDay } = this.cfuns.getDay(29, this.limitEndDate)
    const { computedDay: computedDay15 } = this.cfuns.getDay(
      14,
      this.limitEndDate
    )
    const { computedDay: computedDay30 } = this.cfuns.getDay(
      29,
      this.limitEndDate
    )
    // 如果限制开始时间
    if (!this.limitTime) {
      this.day = 30
      this.date = [computedDay, today]
    } else {
      const limitDate = new Date(this.limitTime).getTime()
      // 判断开始时间是否在30天前
      if (limitDate <= new Date(computedDay).getTime()) {
        // 在30天前
        this.date = [computedDay, today]
        this.day = 30
      } else {
        // 30天内
        this.date = [this.limitTime, today]
      }
      // 禁用不能选的时间btn
      if (limitDate > new Date(computedDay).getTime()) {
        this.btn7disabled = true
        this.btn30disabled = true
        this.btn15disabled = true
      } else if (
        limitDate === new Date(computedDay).getTime() ||
        limitDate > new Date(computedDay15).getTime()
      ) {
        this.btn15disabled = true
        this.btn30disabled = true
      } else if (
        limitDate === new Date(computedDay15).getTime() ||
        limitDate > new Date(computedDay30).getTime()
      ) {
        this.btn30disabled = true
      }
    }
    this.$emit('timeChange', this.date, this.day)
  },
  beforeDestroy() {
    if (this.$refs.chart) {
      this.$refs.chart.chart.dispose()
      removeResizeListener(this.$refs.chart.$el, this.resizeChart)
    }
  },

  data() {
    // console.log(dataZoom)
    let vm = this
    return {
      btn7disabled: false,
      btn15disabled: false,
      btn30disabled: false,
      showChart: true,
      activeName: 'first',
      chartOpts: {
        toolbox: {
          top: '-50px',
          feature: {
            dataZoom: {
              yAxisIndex: 'none' //不启用y轴的选中
            }
          }
        },
        dataZoom: chartDataZoom.rankData.dataZoom,
        grid: {
          left: '6%',
          right: '6%',
          bottom: '12%',
          containLabel: true
        },
        animationDuration: 600
      },
      pickerOptions: {
        disabledDate: date => {
          return (
            date.getTime() > Date.now() ||
            date.getTime() <
              new Date(vm.limitTime).getTime() - 24 * 3600 * 1000 ||
            (vm.selectMaxDate && date.getTime() > vm.selectMaxDate) ||
            (vm.selectMinDate && date.getTime() < vm.selectMinDate)
          )
        },
        onPick: ({ maxDate, minDate }) => {
          // console.log(maxDate, minDate);
          if (maxDate && minDate) {
            vm.selectMaxDate = null
            vm.selectMinDate = null
          } else {
            vm.selectMaxDate = minDate.getTime() + 24 * 3600 * 365 * 1000
            vm.selectMinDate = minDate.getTime() - 24 * 3600 * 365 * 1000
          }
          // this.selectMaxDate = minDate.getTime() + 24 * 3600 * 365 * 1000
          // this.selectMinDate = minDate.getTime() - 24 * 3600 * 365 * 1000
        }
      },
      selectMaxDate: null,
      selectMinDate: null,
      initOptions: {
        renderer: 'canvas'
      },
      date: [],
      day: null
    }
  },
  watch: {
    zoomRange: {
      deep: true,
      immediate: true,
      handler(val) {
        let dataZoom = chartDataZoom.rankData.dataZoom.map(el => {
          return { ...el, start: val[0], end: val[1] }
        })
        // console.log(dataZoom)

        this.chartOpts.dataZoom = dataZoom
      }
    }
  },
  computed: {
    opts() {
      let vm = this
      let axisPointer = {
        type: 'cross',
        formatter: params => {
          return vm.cfuns.getChartTooltip(params)
        }
      }
      // this.data.yAxis.splitLine = {
      //   lineStyle: {
      //     color: '#ebeef5'
      //   }
      // }
      // let sort = {}
      let defaultTooltip = {
        show: true,
        trigger: 'none',
        axisPointer
      }

      if (this.type !== 'line') {
        return this.data
      }
      let data = _assign({}, this.chartOpts, this.data, defaultTooltip, {
        series: this.data.series.map(el => ({
          ...el,
          ...this.$const['CHART/ITEM_STYLE']
        })),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: this.data.series[0].type == 'bar' ? 'shadow' : 'cross'
          },
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          confine: false,
          textStyle: {
            fontSize: 10
          },
          formatter:
            this.data.xAxis.type !== 'time' ? axisPointer.formatter : null
        }
      })
      // let data = _merge(this.chartOpts, this.data, defaultTooltip)
      if (this.reverse !== false) {
        // data.xAxis && (data.xAxis.position = 'top')
        data.yAxis && (data.yAxis.inverse = true)
        data.yAxis && (data.yAxis.nameLocation = 'start')
      }

      return data
    },
    noData() {
      // return true
      return (
        (this.type == 'line' ? !this.data.xAxis : false) ||
        (this.data &&
          (!this.data.series[0] ||
            (this.data.series.length &&
              this.data.series.every(el =>
                el.data.every(e =>
                  typeof e === 'object' && e !== null
                    ? e.value == null
                    : e == null
                )
              ))))
      )
      // return this.opts && this.opts.series[0] && this.opts.series[0].data && this.opts.series[0].data[0]
    }
  },
  methods: {
    handleCommand(item) {
      item.fn()
    },
    handleTabClick() {
      // if (this.activeName === 'first') {

      // }
      setTimeout(() => {
        this.chartDone()
      }, 300)
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
        addResizeListener(this.$refs.chart.$el, this.resizeChart)
      })
    },
    handleChartClick(e) {
      this.$emit('chartClick',e)
      if (e.componentType === 'markPoint') {
        this.activeName = 'second'
      }
    },
    resizeChart() {
      this.$refs.chart &&
        this.$refs.chart.resize({ width: this.$refs.chart.offsetWidth })
    },
    handleDatePickerChange(val) {
      const { today, computedDay } = this.cfuns.getDay(6, this.limitEndDate)
      const { computedDay: computedDay15 } = this.cfuns.getDay(
        14,
        this.limitEndDate
      )
      const { computedDay: computedDay30 } = this.cfuns.getDay(
        29,
        this.limitEndDate
      )
      const [startTime, endTime] = val || []
      if (startTime === computedDay && endTime === today) {
        this.day = 7
      } else if (startTime === computedDay15 && endTime === today) {
        this.day = 15
      } else if (startTime === computedDay30 && endTime === today) {
        this.day = 30
      } else {
        this.day = null
        // console.log(val)
        this.$emit('timeChange', val, this.day)
      }
    },
    refresh() {
      this.showChart = false
      this.$nextTick(() => {
        this.showChart = true
      })
    },
    clear() {
      this.$refs.chart && this.$refs.chart.clear()
    },
    handleDayChange(val) {
      // console.log('daychange')
      const { today, computedDay } = this.cfuns.getDay(
        val - 1,
        this.limitEndDate
      )
      const date = [computedDay, today]
      this.date = date
      console.log(date)
      this.$emit('timeChange', date, this.day)
    }
  }
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.tabchart-wrapper {
  border: 1px solid #dcdfe6;
  padding-bottom: 20px;
  .tabchart-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    align-items: center;
    background: #f5f5f5;
    padding: 10px 16px;
    .tabchart-title {
      font-size: 14px;
    }
    .right {
      display: flex;
      align-items: center;
      font-size: 12px;
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #9e9e9e;
        border-color: #9e9e9e;
        box-shadow: -1px 0 0 0 #9e9e9e;
      }
    }
  }
}
</style>