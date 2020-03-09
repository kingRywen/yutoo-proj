<template>
  <div class="wrap">
    <router-link to="purchase">
      <x-button type="primary" class="martop15">采购入库</x-button>
    </router-link>
    <router-link to="storageTransfer">
      <x-button type="primary" class="martop15">库位转移</x-button>
    </router-link>
    <router-link to="warehousing">
      <x-button type="primary" class="martop15">入库</x-button>
    </router-link>
    <router-link to="salesReturn">
      <x-button type="primary" class="martop15">退货入库</x-button>
    </router-link>
    <router-link to="stocking">
      <x-button type="primary" class="martop15">盘点</x-button>
    </router-link>
    <router-link to="pickingTask">
      <x-button type="primary" class="martop15">拣货任务</x-button>
    </router-link>
    <router-link to="packagingCheck">
      <x-button type="primary" class="martop15">打包核对</x-button>
    </router-link>
    <router-link to="qualityTesting">
      <x-button type="primary" class="martop15">质检</x-button>
    </router-link>
    <router-link to="sorting">
      <x-button type="primary" class="martop15">分拣</x-button>
    </router-link>
    <router-link to="/app/nav/correlation">
      <x-button type="primary" class="martop15">关联解除/射频</x-button>
    </router-link>

    <!-- <router-link to="recommendLabrary">
            <x-button type="primary" class="martop15">推荐调库</x-button>
        </router-link>
        <router-link to="inventoryPlan">
            <x-button type="primary" class="martop15">移库计划</x-button>
        </router-link>
        <router-link to="/app/nav/stockingPlan">
            <x-button type="primary" class="martop15">盘点计划</x-button>
    </router-link>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  methods: {
    getValue(ref) {
      this.$router.push('choseWarehouse')
    },
    goBack() {
      this.$router.back(-1)
    }
  },
  watch: {}
}
</script>

<style lang="scss">
.wrap {
  .top50 {
    margin-top: 50%;
  }
}
</style>
