<template>
  <div>
    <div class="main-layout">
      <div class="header">评价产品的类目分布</div>
      <yt-table :selection="false" :data="curData" :columns="columns"></yt-table>
    </div>
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  props: ['data', 'originSearchVal'],
  mixins: [mixin],
  data() {
    return {
      unit: '个',
      columns: [
        {
          label: '类目个数',
          value: 'range'
        },
        {
          label: '评价者数',
          value: 'cnt',
          numZero: true,
          sortable: true,
          url: true,
          btnClick: scope => {
            let { _range } = scope.row
            let [categoryCntMin, categoryCntMax] = _range
              .split('-')
              .map(el => (el === '' ? null : Number(el)))
            if (categoryCntMin && categoryCntMax === undefined) {
              categoryCntMax = categoryCntMin
            }
            this._openDialog({
              size: 'medium',
              title: '评价者',
              params: {
                showHearder: false,
                defaultSearchData: this.originSearchVal,
                mustQueries: {
                  categoryCntMax,
                  categoryCntMin
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