<template>
  <!-- <div>待收货库存</div> -->
  <div>
    <el-tabs v-if="data._type !== 3" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="采购库存" name="first">
        <YtTableSelect ref="table" key="1" :url="url" :options="options"/>
      </el-tab-pane>
      <el-tab-pane label="退货库存" name="second" lazy>
        <YtTableSelect ref="table1" key="2" :url="url1" :options="options1"/>
      </el-tab-pane>
    </el-tabs>
    <YtTableSelect v-else ref="table" :url="url" :options="options"/>
  </div>
</template>

<script>
export default {
  // props: ['params', 'data'],
  props: {
    params: {
      default: () => ({})
    },
    data: {
      default: () => ({
        // type = 1 本地
        // type 2 海外
        // type 3 平台
        _type: 1
      })
    }
  },
  // data 直接打开时存在
  // params 嵌套弹窗时存在
  data() {
    let vm = this
    return {
      activeName: 'first',
      url: 'warehouse/wmInventoryPendingLocal',
      options: {
        // 表格项
        table: {
          selection: false,
          maxHeight: 500,
          searchDataFn(data) {
            let params = {}
            let { time = [], ...info } = data
            let [storeOutTimeStart, storeOutTimeEnd] = time
            if (vm.data) {
              let productType = vm.params.productType || (vm.data._level === 1 ? 3 : 1)
              params = {
                productId: vm.data.productId || vm.params.productId,
                productType
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
              value: 'shippingTime',
              label: '发货时间'
            },
            {
              value: 'shippingId',
              label: '发货ID'
            },
            {
              value: 'shippingName',
              label: '发货来源'
            },
            {
              value: 'count',
              label: '数量'
            },
            {
              value: 'arrivalTime',
              label: '预计到货时间'
            }
          ],
          border: true,
          reserveSelection: null
        }
      },
      url1: 'warehouse/wmInventoryPendingPlatformReturn',
      options1: {
        // 表格项
        table: {
          selection: false,
          maxHeight: 500,
          border: true,
          reserveSelection: null,
          searchDataFn(data) {
            let params = {}
            let { time = [], ...info } = data
            let [storeOutTimeStart, storeOutTimeEnd] = time
            if (vm.data) {
              let productType = vm.params.productType || (vm.data._level === 1 ? 3 : 1)
              params = {
                productId: vm.data.productId,
                productType
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
              value: 'shippingTime',
              label: '发货时间'
            },
            {
              value: 'shippingId',
              label: '发货ID'
            },
            {
              value: 'shippingName',
              label: '客户名称'
            },
            {
              value: 'count',
              label: '数量'
            },
            {
              value: 'arrivalTime',
              label: '预计到达时间'
            }
          ]
        }
      }
    }
  },
  // mounted() {
  //   if (!this.data) {
  //     // 如果直接打开，不用懒加载，需要取消此次请求， 否则在一开始打开的时候会请求两次
  //     this._initData()
  //   }
  // },
  methods: {
    handleClick(tab) {
      let vm = this
      // debugger
      let productType = vm.params.productType || (vm.data._level === 1 ? 3 : 1)
      let params = { productId: this.params.productId || this.data.productId, productType }
      switch (tab.name) {
        case 'first':
          this.$refs.table.getData(params, true)
          break
        case 'second':
          if (this.$refs.table1) {
            this.$refs.table1.getData(params, true)
          } else {
            this.$nextTick(() => this.$refs.table1.getData(params, true))
          }

          break

        default:
          break
      }
    },
    _initData() {
      // console.log(222);
      if (this.data) {
        this.setUrl1(this.data._type)

        this.url =
          this.data._type === 1
            ? `warehouse/wmInventoryPendingLocal`
            : this.data._type === 2
            ? `warehouse/wmInventoryPendingOverseas`
            : `warehouse/wmInventoryPendingPlatform`
      }
      this.$nextTick(() => this.$refs.table.getData())
    },
    _close() {
      this.activeName = 'first'
    },
    setUrl1(val) {
      switch (val) {
        case 1:
          this.url1 = 'warehouse/wmInventoryPendingLocalReturn'
          break
        case 2:
          this.url1 = 'warehouse/wmInventoryPendingOverseasReturn'
          break
        case 3:
          this.url1 = 'warehouse/wmInventoryPendingPlatformReturn'
          break

        default:
          break
      }
    }
  },
  watch: {
    'data._type'(val) {
      this.setUrl1(val)
    }
  }
}
</script>

<style>
</style>
