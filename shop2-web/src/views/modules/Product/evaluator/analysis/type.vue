<template>
  <div>
    <div class="main-layout">
      <div class="header">评价类型分布</div>
      <yt-table :selection="false" :data="data" :columns="columns"></yt-table>
    </div>
  </div>
</template>
<script>
export default {
  props: ['data', 'originSearchVal'],
  data() {
    return {
      queryMap: {
        VP带图: 'vpImageFlag',
        VP带视频: 'vpVideoFlag',
        VP仅文字: 'vpTextFlag',
        直评带图: 'directImageFlag',
        直评带视频: 'directVideoFlag',
        直评仅文字: 'directTextFlag'
      },
      columns: [
        {
          label: '评价类型',
          value: 'range'
        },
        {
          label: '评价者数',
          value: 'cnt',
          numZero: true,
          sortable: true,
          url: true,
          btnClick: scope => {
            this._openDialog({
              size: 'medium',
              title: '评价者',
              params: {
                showHearder: false,
                defaultSearchData: this.originSearchVal,
                mustQueries: {
                  [this.queryMap[scope.row.range]]: 1
                }
              },
              cancelBtnText: '关闭',
              component: () => import('../list')
            })
          }
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  font-size: 14px;
  padding: 14px;
  border-color: #e4e4e4;
  border-width: 1px 1px 0;
  border-style: solid;
  // background-color: #f5f5f5;
}
</style>