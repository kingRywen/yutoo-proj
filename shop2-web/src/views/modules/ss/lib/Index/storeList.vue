<template>
  <div>
    <main-layout
      :showSelection="false"
      :isShowPag="false"
      :outerParams="{...storeInfo,siteId: this.$store.state.selling.curSiteId, asin, sellingFlag: true, fareTempFlag: false}"
      :columns="columns"
      url="ss/sellingMySellerList"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['asin'],
  data() {
    return {
      columns: [
        {
          label: '店铺名称',
          value: 'sellerAlias'
        },
        {
          label: '跟卖状态',
          value: 'status',
          _enum: this.cfuns.arrayToObj([
            { label: '待跟卖', value: 0 },
            { label: '暂停', value: 1 },
            { label: '跟卖中', value: 2 },
            { label: '暂停', value: 3 },
            { label: '暂停', value: 4 }
          ])
        },
        {
          label: '暂停原因',
          value: 'status',
          _enum: this.cfuns.arrayToObj([
            { label: '不可采购', value: 1 },
            { label: '非跟卖时间修改库存为0', value: 3 },
            { label: '非跟卖时间删除SKU', value: 4 }
          ])
        },
        {
          label: '跟卖时间',
          value: 'sellingTime'
        },
        {
          label: '首次跟卖时间',
          value: 'firstSellingTime'
        },
      ]
    }
  }
}
</script>