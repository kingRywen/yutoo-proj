<template>
  <div>
    <ElTable :data="data">
      <ElTableColumn label="店铺SKU"></ElTableColumn>
      <ElTableColumn label="仓库名称">
        <ElTableColumn label="库存"></ElTableColumn>
        <ElTableColumn label="价格"></ElTableColumn>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script>
import apis from 'apis';
import { fetchData, handlerCode, showToast } from 'common/common';

export default {
  props: ['storeProductId', 'productType'],
  data() {
    return {
      data:[]
    }
  },
  created() {
    let data = {storeProductId: this.storeProductId, productType: this.productType}
    fetchData({
      ...apis.storeProductWishWarehouseInfo,
      data,
    }).then(res => {
      handlerCode(
        res,
        () => {
          this.data = res.data.rows
        },
        () => {
          showToast('error', res.data.msg)
        },
        true
      )
    })
  },
}
</script>

<style>

</style>
