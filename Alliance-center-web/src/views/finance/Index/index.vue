<template>
  <div>
    <ElRow :gutter="20">
      <ElCol :span="12">
        <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="收入" :moreFn="moreFn">
          <income @setData="val => inRateData = val" />
        </WidgetCardWrapper>
      </ElCol>
      <ElCol :span="12">
        <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="累计收入占比">
          <InrateChart :data="inRateData" />
        </WidgetCardWrapper>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20">
      <ElCol :span="12">
        <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="支出" :moreFn="moreFn1">
          <outcome @setData="val => outRateData = val" />
        </WidgetCardWrapper>
      </ElCol>
      <ElCol :span="12">
        <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="累计资产支出占比">
          <OutrateChart :data="outRateData" />
        </WidgetCardWrapper>
      </ElCol>
    </ElRow>
  </div>
</template>
<script>
import income from './income.vue'
import InrateChart from './InrateChart.vue'
import outcome from './outcome.vue'
import OutrateChart from './OutrateChart.vue'
import { mapActions } from 'vuex'
import { downloadFile1 } from 'Utils/tools'
export default {
  components: {
    income,
    outcome,
    OutrateChart,
    InrateChart
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      value: 0,
      date: [
        this.$.formatDate(Date.now() - 30 * 24 * 3600 * 1000, '{y}-{m}-{d}'),
        this.$.formatDate(Date.now(), '{y}-{m}-{d}')
      ],
      inRateData: [],
      outRateData: []
    }
  },
  created() {
    this.getCurrentM()
  },
  methods: {
    ...mapActions(['getCurrentM']),
    moreFn() {
      let vm = this
      this._openDialog({
        size: 'large',
        // title: '收入曲线',
        title: h => (
          <div class="flex-c">
            <span>收入曲线</span>
            <div class="flex-c" style="margin-right:30px">
              <el-select
                style="margin-right:8px;width:60px"
                size="mini"
                value={vm.value}
                on-change={e => (vm.value = e)}
              >
                <el-option value={0} label="日"></el-option>
                <el-option value={1} label="月"></el-option>
              </el-select>
              <el-date-picker
                value-format="yyyy-MM-dd"
                unlink-panels
                style="margin-right:8px;width: 240px"
                vModel={vm.date}
                pickerOptions={vm.pickerOptions}
                size="mini"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-button
                style="padding: 0;"
                type="text"
                on-click={() => {
                  vm.exp(1)
                }}
              >
                导出
              </el-button>
            </div>
          </div>
        ),
        params: { vmVue: vm },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/inChart.vue')
      })
    },
    moreFn1() {
      let vm = this
      this._openDialog({
        size: 'large',
        title: h => (
          <div class="flex-c">
            <span>支出曲线</span>
            <div class="flex-c" style="margin-right:30px">
              <el-select
                style="margin-right:8px;width:60px"
                size="mini"
                value={vm.value}
                on-change={e => (vm.value = e)}
              >
                <el-option value={0} label="日"></el-option>
                <el-option value={1} label="月"></el-option>
              </el-select>
              <el-date-picker
                value-format="yyyy-MM-dd"
                pickerOptions={vm.pickerOptions}
                unlink-panels
                style="margin-right:8px;width: 240px"
                vModel={vm.date}
                size="mini"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-button
                style="padding: 0;"
                type="text"
                on-click={() => {
                  vm.exp(0)
                }}
              >
                导出
              </el-button>
            </div>
          </div>
        ),
        params: { vmVue: vm, type: 'out' },
        cancelBtnText: '关闭',
        // okBtnText: '确认',
        component: () => import('./dialogs/inChart.vue')
      })
    },
    exp(type) {
      let [queryStartDate, queryEndDate] = this.date || []
      if (this.value) {
        queryStartDate = this.$.formatDate(queryStartDate, '{y}-{m}')
        queryEndDate = this.$.formatDate(queryEndDate, '{y}-{m}')
      }
      this.$api[`main/${type ? 'incomeExportData' : 'expendExportData'}`]({
        type: !this.value ? 'day' : 'month',
        queryStartDate,
        queryEndDate
      }).then(data => {
        if (data && data.code == 500) {
          return this.$message.error(data.msg)
        }
        downloadFile1(data, type ? '收入' : '支出')
      })
    }
  }
}
</script>