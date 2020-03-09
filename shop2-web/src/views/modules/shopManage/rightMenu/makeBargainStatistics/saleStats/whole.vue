<template>
  <div>
    <TabChart
      name="整店销量报表"
      :limitTime="false"
      :showDateBtn="false"
      ref="chart"
      :data="data"
      :exp="exp"
      @timeChange="getData"
      chartHeight="600"
      v-loading="loading"
    >
      <el-select
        style="width:70px"
        size="mini"
        slot="right"
        v-model="dateType"
        @change="getData($refs.chart.date, $event)"
      >
        <el-option v-for="item in dates" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </TabChart>
  </div>
</template>
<script>
import { exportEXCEL } from 'Utils/xlsx'
export default {
  data() {
    return {
      loading: false,
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
      data: {
        xAxis: {
          type: 'time'
        },
        yAxis: {
          type: 'value',
          name: '订单数'
        },
        series: [
          {
            data: [],
            name: '订单数',
            type: 'line'
          }
        ]
      },
      dateType: 30,
      dates: [
        {
          label: '按日',
          value: 1
        },
        {
          label: '按周',
          value: 7
        },
        {
          label: '按月',
          value: 30
        }
      ]
    }
  },
  methods: {
    downloadExcel(csv) {
      let { series } = this.data,
        contents = []
      series[0].data.map(el => {
        contents.push(el.value)
      })
      let exportData = [['日期', '订单数'], ...contents]
      // console.log()
      exportEXCEL(
        exportData,
        null,
        '整店销量报表 ' + this.$refs.chart.date.join('~'),
        csv
      )
    },
    getData(date) {
      this.loading = true
      let params = {
        ...this.storeInfo,
        startTime: date[0],
        endTime: date[1],
        period: this.dateType
      }
      this.$api[`so/salesOrderList`](params).then(data => {
        data = data.data
        this.loading = false
        this.data.series[0].data = data.map(el => ({
          name: new Date(el.statTime).toString(),
          value: [el.statTime, el.cnt]
        }))
      })
    }
  }
}
</script>