<template>
  <div>
    <el-form label-width="120px" size="small" :model="formData" :rules="rules">
      <ElFormItem label="安全库存天数" prop="inventoryDaysSafety">
        <ElInputNumber
          :min="1"
          class="mr10"
          :precision="0"
          controls-position="right"
          v-model="formData.inventoryDaysSafety"
          placeholder
        ></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="滞销库存天数" prop="inventoryDaysUnsalable">
        <ElInputNumber
          :min="1"
          class="mr10"
          :precision="0"
          controls-position="right"
          v-model="formData.inventoryDaysUnsalable"
          placeholder
        ></ElInputNumber>
      </ElFormItem>
      <ElFormItem label="是否设置产品标准价">
        <el-checkbox :true-label="1" :false-label="0" v-model="formData.standardPriceFlag" label="是否设置产品标准价"></el-checkbox>
      </ElFormItem>

      <template v-if="formData.standardPriceFlag">
        <el-table v-loading="$store.state.loading" :data="formData.standardPriceList">
          <ElTableColumn label="平台" prop="platformName"></ElTableColumn>
          <ElTableColumn label="店铺" prop="storeName"></ElTableColumn>
          <ElTableColumn label="站点" prop="siteName"></ElTableColumn>
          <ElTableColumn label="标准价 USD" min-width="140px" :render-header="handleRenderHeader">
            <template slot-scope="scope">
              <el-form-item
                label
                label-width="0"
                :prop="`standardPriceList.${scope.$index}.standardPrice`"
                :rules="[{ required: true, message: '请输入价格' }]"
              >
                <el-input-number
                  class="per100"
                  controls-position="right"
                  :min="0.01"
                  :max="99999999999"
                  :precision="2"
                  size="small"
                  v-model="scope.row.standardPrice"
                ></el-input-number>
              </el-form-item>
            </template>
          </ElTableColumn>
        </el-table>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      rules: {
        inventoryDaysSafety: [
          { required: true, message: '请输入安全库存天数' }
        ],
        inventoryDaysUnsalable: [
          { required: true, message: '请输入滞销库存天数' }
        ]
      },
      formData: {
        inventoryDaysSafety: undefined,
        inventoryDaysUnsalable: undefined,
        standardPriceFlag: 0,
        standardPriceList: []
      }
    }
  },
  // watch: {
  //   'formData.standardPriceFlag'(val) {
  //     if (val) {

  //       this.getData()
  //       // if (!this.formData.standardPriceList.length) {
  //       //   this.getData()
  //       // }
  //       //  else {
  //       //   this.formData.standardPriceList = this.formData.standardPriceList.map(
  //       //     el => ({ ...el, standardPrice: undefined })
  //       //   )
  //       // }
  //     }
  //   }
  // },
  methods: {
    // eslint-disable-next-line
    handleRenderHeader(h, { column, $index }) {
      let vm = this
      return (
        <div class="flex">
          <span>标准价 USD</span>
          <el-input-number
            onChange={val => {
              let list = vm.formData.standardPriceList
              list.forEach(el => {
                el.standardPrice = val
              })
            }}
            precision={2}
            min={0.01}
            max={99999999999}
            controls={false}
            size="small"
          />
        </div>
      )
    },
    getData() {
      this.$api[`warehouse/wmInventoryPlatformStandardprice`]({
        productId: this.data.productId,
        productType: this.data.productType
      })
        .then(data => {
          const {
            inventoryDaysSafety,
            inventoryDaysUnsalable,
            standardPriceFlag
          } = data
          this.formData.inventoryDaysSafety = inventoryDaysSafety
          this.formData.inventoryDaysUnsalable = inventoryDaysUnsalable
          this.formData.standardPriceFlag = standardPriceFlag
          this.formData.standardPriceList = data.standardPriceList
        })
        .catch(() => {})
    },
    _initData() {
      this.getData()
    },
    _close() {
      this.formData.standardPriceFlag = 0
      this.formData.standardPriceList = []
    },
    submit() {
      let { standardPriceList, ...info } = this.formData
      let params = {
        productId: this.data.productId,
        productType: this.data.productType,
        standardPriceList: standardPriceList.map(el => {
          let { siteId, platformId, storeId, standardPrice } = el
          return { siteId, platformId, storeId, standardPrice }
        }),
        ...info
      }
      return this.$api[`warehouse/wmInventoryProductEarlyWarning`](params)
    }
  }
}
</script>

<style lang='scss'>
.el-table th div.flex {
  @include flex-wrapper;
}
</style>
