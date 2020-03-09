<template>
  <main-layout
    class="w1100"
    :outerParams="storeInfo"
    :columns="columns"
    :isShowPag="false"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    url="fba/FbaReplenishInfoView"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  props: ['replenishInfoId'],
  data() {
    return {
      columns: [
        {
          label: 'SKU',
          value: 'seller_sku'
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: '主图',
          img: true,
          value: 'img'
        },
        {
          label: '数量',
          sortable: true,
          value: 'count'
        }
      ],
      topBatchBtn: {
        title: '产品',
        options: [
          {
            label: '修改数量'
          }
        ]
      }
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      if (val[0] == '修改数量') {
        this._openDialog({
          size: 'medium',
          title: '修改数量',
          params: {
            data: {
              replenishInfoId: this.replenishInfoId,
              data: sel.map(el => ({
                sellerSKU: el.seller_sku,
                count: el.count
              }))
            },
            fn: () => {
              this.$refs.layout.getList()
            }
          },
          cancelBtnText: '取消',
          okBtnText: '确认',
          component: () => import('./editNum.vue')
        })
      }
    }
  }
}
</script>