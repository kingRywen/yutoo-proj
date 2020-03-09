<template>
  <!-- <div>基本信息</div> -->
  <div v-loading="$store.state.loading">
    <table class="gridtable">
      <tr>
        <td rowspan="6" class="txc">
          <img :key="data.imgPath" style="max-width:150px;max-height:150px" class="loadingImg" v-lazy="data.imgPath">
        </td>
      </tr>
      <tr>
        <td class="col-title">产品名称</td>
        <td>{{data.name}}</td>
        <td class="col-title">sku</td>
        <td>{{data.customSku}}</td>
      </tr>
      <tr>
        <td class="col-title">仓库名称</td>
        <td>{{data.wmNames ? data.wmNames.join('、') : '-'}}</td>
        <td class="col-title">仓库位置</td>
        <td>{{data.locationCount}}</td>
      </tr>
      <tr>
        <td class="col-title">合格数</td>
        <td>{{data.qualifiedCount}}</td>
        <td class="col-title">不合格数</td>
        <td>{{data.failedCount}}</td>
      </tr>
      <tr>
        <td class="col-title">锁定数</td>
        <td>{{data.lockingInventory}}</td>
        <td class="col-title">产品总数</td>
        <td>{{data.inventory}}</td>
      </tr>
      <tr>
        <td class="col-title">添加时间</td>
        <td>{{data.createTime}}</td>
        <td class="col-title">最后更新</td>
        <td>{{data.updateTime}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      data: {}
    }
  },
  methods: {
    initData() {
      this.$api[`warehouse/wmInventoryProductBase`]({
        productId: this.params.productId,
        productType: this.params.productType
      })
        .then(data => {
          // this.loading = false
          this.$store.commit('changeLoading', false)
          this.data = data.info
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
