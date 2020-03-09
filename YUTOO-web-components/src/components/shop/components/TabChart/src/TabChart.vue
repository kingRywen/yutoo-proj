<template>
  <div v-if="blank === false" class="tabchart-wrapper">
    <div class="tabchart-header">
      <span class="tabchart-title">
        {{name}}
        <ElTooltip v-if="tooltip" :content="tooltip" placement="right">
          <i class="el-icon-question"></i>
        </ElTooltip>
      </span>
      <div class="right">
        <slot name="right"></slot>
        <el-radio-group v-model="day" size="mini" @change="handleDayChange">
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
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <slot name="middle"></slot>
    <!-- <canvas></canvas> -->
    <div :style="!$slots.table ? {width:'100%',height:`${parseInt(chartHeight, 10)}px`} : null">
      <template v-if="!$slots.table">
        <v-chart
          @mousemove="$emit('mousemove', $event)"
          @mouseover="$emit('mouseover')"
          @mouseout="$emit('mouseout', $event)"
          v-if="!noData"
          ref="chart"
          :init-options="initOptions"
          style="width:100%"
          :options="opts"
          auto-resize
        />
        <NonePage v-else noBack/>
      </template>

      <ElTabs class="mt10" type="card" v-model="activeName" v-else>
        <ElTabPane name="first" label="图标视图">
          <slot name="chartbtn"></slot>
          <div :style="{width:'100%',height:`${parseInt(chartHeight, 10)}px`}">
            <template v-if="showChart">
              <v-chart
                @mousemove="$emit('mousemove', $event)"
                @mouseover="$emit('mouseover', $event)"
                @mouseout="$emit('mouseout', $event)"
                ref="chart"
                v-if="!noData"
                :init-options="initOptions"
                style="width:100%"
                :options="opts"
                auto-resize
              />
              <NonePage v-else noBack/>
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
      size="mini"
      @change="$emit('timeChange', $event)"
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
      v-if="!noData"
      @mousemove="$emit('mousemove', $event)"
      @mouseover="$emit('mouseover')"
      @mouseout="$emit('mouseout', $event)"
      ref="chart"
      :init-options="initOptions"
      style="width:100%"
      :options="opts"
      auto-resize
    />
    <NonePage v-else noBack/>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'

export default {
  name: 'TabChart',
  components: {
    'v-chart': ECharts
  },
  props: {
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
      default: 7
    },
    // 传入的表格数据
    data: {
      type: Object,
      default: () => ({})
    }
  },

  created() {
    const { today, computedDay } = this.cfuns.getDay(6)
    const { computedDay: computedDay15 } = this.cfuns.getDay(14)
    const { computedDay: computedDay30 } = this.cfuns.getDay(29)
    // 如果限制开始时间
    if (!this.limitTime) {
      this.day = 7
      this.date = [computedDay, today]
    } else {
      const limitDate = new Date(this.limitTime).getTime()
      // 判断开始时间是否在7天前
      if (limitDate <= new Date(computedDay).getTime()) {
        // 在7天前
        this.date = [computedDay, today]
        this.day = 7
      } else {
        // 7天内
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
  },

  data() {
    return {
      btn7disabled: false,
      btn15disabled: false,
      btn30disabled: false,
      showChart: true,
      activeName: 'first',
      chartOpts: {
        grid: {
          left: '6%',
          right: '6%',
          bottom: '6%',
          containLabel: true
        },
        animationDuration: 600
      },
      pickerOptions: {
        disabledDate: date => {
          return (
            date.getTime() > Date.now() ||
            date.getTime() <
              new Date(this.limitTime).getTime() - 24 * 3600 * 1000 ||
            (this.selectMaxDate && date.getTime() > this.selectMaxDate) ||
            (this.selectMinDate && date.getTime() < this.selectMinDate)
          )
        },
        onPick: ({ maxDate, minDate }) => {
          // console.log(maxDate, minDate);
          this.selectMaxDate = minDate.getTime() + 24 * 3600 * 365 * 1000
          this.selectMinDate = minDate.getTime() - 24 * 3600 * 365 * 1000
        }
      },
      selectMaxDate: null,
      selectMinDate: null,
      initOptions: {
        renderer: 'canvas'
      },
      date: [],
      day: null,
      polar: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ],
        animationDuration: 2000
      }
    }
  },
  computed: {
    opts() {
      this.data.yAxis.splitLine = {
        lineStyle: {
          color: '#ebeef5'
        }
      }
      return Object.assign(this.chartOpts, this.data)
    },
    noData() {
      // return true
      return (
        this.data &&
        !this.data.series[0] &&
        !this.data.series.some(el => el.data.length > 0)
      )
      // return this.opts && this.opts.series[0] && this.opts.series[0].data && this.opts.series[0].data[0]
    }
  },
  methods: {
    handleDatePickerChange(val) {
      const { today, computedDay } = this.cfuns.getDay(6)
      const { computedDay: computedDay15 } = this.cfuns.getDay(14)
      const { computedDay: computedDay30 } = this.cfuns.getDay(29)
      const [startTime, endTime] = val || []
      if (startTime === computedDay && endTime === today) {
        this.day = 7
      } else if (startTime === computedDay15 && endTime === today) {
        this.day = 15
      } else if (startTime === computedDay30 && endTime === today) {
        this.day = 30
      } else {
        this.day = null
        console.log(val);
        this.$emit('timeChange', val)
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
      const { today, computedDay } = this.cfuns.getDay(val - 1)
      const date = [computedDay, today]
      this.date = date
      this.$emit('timeChange', date)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabchart-wrapper {
  border: 1px solid #dcdfe6;
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
    }
  }
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
