<template>
  <!-- <div>仓库库存</div> -->
  <div>
    <YtTableSelect ref="table" url="warehouse/wmInventoryProductInventory" :options="options"/>
    <el-dialog :title="title" :visible.sync="visible" width="1100px" append-to-body @opened="handleOpened">
      <keep-alive>
        <component :is="com" :params="queryData" ref="OccupyLocation"/>
      </keep-alive>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['data'],
  components: {
    OccupyLocation: () => import('./OccupyLocation.vue'),
    InventoryToreceived: () => import('./InventoryToreceived.vue')
  },
  data() {
    let vm = this
    return {
      com: 'OccupyLocation',
      visible: false,
      title: '占用库位详情',
      queryData: {},
      options: {
        // 表格项
        table: {
          selection: false,
          maxHeight: 320,
          searchDataFn(data) {
            let { time = [], ...info } = data
            let [storeOutTimeStart, storeOutTimeEnd] = time
            return {
              storeOutTimeStart,
              storeOutTimeEnd,
              ...info,
              productId: vm.data.productId,
              productType: vm.data._level === 1 ? 3 : 1
            }
          },
          columns: [
            {
              value: 'wmName',
              label: '仓库名称'
            },
            {
              value: 'locationCount',
              label: '占用库位',
              render(h, scope) {
                return (
                  <el-button
                    onClick={() => {
                      vm.title = '占用库位详情'
                      vm.openDialog('OccupyLocation', scope)
                    }}
                    type="text"
                  >
                    <b>{scope.row.locationCount}</b>
                  </el-button>
                )
              }
            },
            {
              value: 'inventory',
              label: '在库库存'
            },
            {
              value: 'purchaseInventory',
              label: '采购中'
            },
            {
              value: 'pendingInventory',
              label: '待收货库存',
              render(h, scope) {
                return (
                  <el-button
                    onClick={() => {
                      vm.title = '待收货库存详情'
                      vm.openDialog('InventoryToreceived', scope)
                    }}
                    type="text"
                  >
                    <b>{scope.row.pendingInventory}</b>
                  </el-button>
                )
              }
            },
            {
              value: 'availableInventory',
              label: '可用库存'
            },
            {
              value: 'lockingInventory',
              label: '锁定库存'
            },
            {
              value: 'historyInCount',
              label: '历史入库'
            },
            {
              value: 'historyOutCount',
              label: '历史出库'
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
    handleOpened() {
      this.$refs.OccupyLocation._initData()
    },
    _initData() {
      this.$nextTick(() => this.$refs.table.getData())
    },
    openDialog(name, scope) {
      let vm = this
      this.com = name
      vm.visible = true
      let { productId } = vm.data
      vm.queryData = {
        productId,
        productType: vm.data._level === 1 ? 3 : 1,
        wmWarehouseId: scope.row.wmWarehouseId
      }

      vm.$nextTick(() => {
        if (vm.$refs.OccupyLocation) {
          vm.$refs.OccupyLocation._initData()
        }
      })
    }
  }
}
</script>

<style>
</style>
