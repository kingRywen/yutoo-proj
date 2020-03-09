<template>
  <!-- <div>占用库位详情</div> -->
  <div>
    <YtTableSelect ref="table" url="warehouse/wmInventoryProductLocationInventory" :options="options"/>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      options: {
        // 表格项
        table: {
          selection: false,
          maxHeight: 560,
          searchDataFn(data) {
            let params = {}
            let { time = [], ...info } = data
            let [storeOutTimeStart, storeOutTimeEnd] = time
            if (vm.data) {
              params = {
                productId: vm.data.productId || vm.params.productId,
                productType: vm.data._level === 1 ? 3 : 1
              }
            }
            return {
              storeOutTimeStart,
              storeOutTimeEnd,
              ...info,
              ...vm.params,
              ...params
            }
          },
          columns: [
            {
              value: 'locationCode',
              label: '库位'
            },
            {
              value: 'inventory',
              label: '数量'
            },
            {
              value: 'lockingInventory',
              label: '锁定库存'
            },
            {
              value: 'historyOutCount',
              label: '历史出库'
            },
            {
              value: 'historyInCount',
              label: '历史入库'
            }
          ],
          border: true,
          reserveSelection: null
        }
      }
    }
  },
  mounted() {
    // this.$nextTick(() => this.$refs.table.getData())
  },
  methods: {
    _initData() {
      this.$nextTick(() => this.$refs.table.getData())
    }
  }
  // activated() {
  //   this._initData()
  // }
}
</script>

<style>
</style>
