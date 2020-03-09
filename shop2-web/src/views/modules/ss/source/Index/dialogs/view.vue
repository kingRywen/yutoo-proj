
<template>
  <yt-table class="w600" :selection="false" :columns="columns" :data="data"></yt-table>
</template>
<script>
export default {
  props: ['row'],
  data() {
    return {
      data:
        (Array.isArray(this.row.dataSources) &&
          this.row.dataSources.map(e => ({ value: e }))) ||
        [],
      columns: [
        {
          label:
            this.row.taskId == 3
              ? '店铺ID'
              : this.row.taskId == 2
              ? '关键词'
              : '',
          value: 'value'
        }
      ]
    }
  }
}
</script>