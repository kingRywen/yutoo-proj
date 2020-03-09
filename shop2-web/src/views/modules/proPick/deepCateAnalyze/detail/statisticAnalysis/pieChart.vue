<template>
  <TabChart
    type="pie"
    :showDate="false"
    :limitTime="false"
    theme
    ref="chart"
    :name="name"
    :data="data"
    chartHeight="600"
  >
    <template slot="title">
      <slot name="edit"></slot>
    </template>

    <el-button type="text" icon="iconfont iconcaidan" slot="right" class="link" @click="showTable"></el-button>
  </TabChart>
</template>
<script>
export default {
  props: ['chartData', 'name'],
  computed: {
    data() {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: this.chartData,
            animation: false,
            label: {
              position: 'outer',
              alignTo: 'none',
              bleedMargin: 5
            }
          }
        ]
      }
    }
  },
  methods: {
    showTable() {
      this._openDialog({
        fullscreen: false,
        size: 'medium',
        title: this.name,
        params: {
          chartData: this.chartData
        },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/table.vue')
      })
    }
  }
}
</script>