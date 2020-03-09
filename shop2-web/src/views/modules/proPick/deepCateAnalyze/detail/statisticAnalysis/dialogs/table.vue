<template>
  <div>
    <yt-table :columns="columns" :data="chartData" :selection="false"></yt-table>
  </div>
</template>
<script>
export default {
  props: ['chartData'],
  data() {
    return {
      columns: [
        {
          label: '区间',
          value: 'name'
        },
        {
          label: '新增评价数',
          value: 'value'
        },
        {
          label: '占比',
          value: 'rate',
          isPercent: true
        }
      ]
    }
  }
}
</script>