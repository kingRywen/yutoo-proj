<template>
  <div class="purchase">
    <!-- <flexbox>
      <flexbox-item>
        <div class="bar-code bcolor">
    
          <x-input
            @on-enter="handleEnter"
            placeholder="采购条码"
            title="采购条码："
            @on-click-clear-icon="() => {purchaseProductCode = ''}"
            v-model="purchaseProductCode"
          ></x-input>
        </div>
      </flexbox-item>
    </flexbox>-->
    <scan :value.sync="purchaseProductCode" title="采购条码:" placeholder="采购条码" @click="handleEnter"></scan>
    <!-- <flexbox>
      <flexbox-item>
        <group>
          <x-input
            @on-enter="handleEnterUniqueLabel"
            :disabled="purchaseId == null"
            placeholder="请输入射频"
            title="射频号："
            v-model="rfCodes"
          ></x-input>
        </group>
      </flexbox-item>
    </flexbox>-->
    <scan :value.sync="rfCodes" type="textarea" title="射频号:" placeholder="射频码" @click="handleEnterUniqueLabel"></scan>
    <!-- <flexbox>
      <flexbox-item>
        <group>
          <x-input placeholder="请输入库位" title="库位：" v-model="locationInfo.wmLocationName"></x-input>
        </group>
      </flexbox-item>
    </flexbox>-->
    <scan :value.sync="locationInfo.wmLocationName" title="库位:" placeholder="请输入库位"></scan>
    <!-- 扫描库位 -->
    <location-search @change="val => locationInfo = val"></location-search>
    <flexbox>
      <flexbox-item>
        <group>
          <x-button type="primary" @click.native="handleSure" :disabled="sureDisabled">确认入库</x-button>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <yt-table :columns="columns" :data="tableData"></yt-table>
        </group>
      </flexbox-item>
    </flexbox>
    <!-- <flexbox>
      <flexbox-item>
        <group>
          <x-button>
            <icon type="success"></icon>打包
          </x-button>
        </group>
      </flexbox-item>
    </flexbox>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      wmLocationName: '',
      purchaseProductCode: '',
      rfCodes: '',
      tableData: [],
      columns: [
        {
          label: '主图',
          value: 'imageBase',
          width: '20%',
          type: 'img'
        },
        {
          label: '自定义sku',
          value: 'skuCus'
        },
        {
          label: '现有库存',
          value: 'repertory'
        },
        {
          label: '需入库',
          value: 'unwarehouse'
        },
        {
          label: '已扫描数',
          value: 'scanned'
        }
      ],
      locationInfo: {
        wmLocationName: ''
      },
      sureDisabled: true,
      purchaseId: null,
      purchaseProductCodeFlag: false
    }
  },
  watch: {
    purchaseProductCode(val) {
      console.log(val)
    }
  },
  methods: {
    handleEnter() {
      let vm = this
      let purchaseProductCode = vm.purchaseProductCode
      vm.$api[`warehouse/purchaseScan`]({ purchaseProductCode })
        .then(({ rows }) => {
          let { locationInfo, productInfo, purchaseId } = rows
          vm.tableData = productInfo
          vm.locationInfo = locationInfo
          vm.sureDisabled = false
          vm.purchaseId = purchaseId
        })
        .catch(() => {
          vm.sureDisabled = true
        })
    },
    handleSure() {
      let vm = this
      let wmLocationId = vm.locationInfo.wmLocationId
      vm.$api[`warehouse/purchaseStockin`]({
        purchaseId: vm.purchaseId,
        wmLocationId
      })
        .then(() => {
          vm.handleEnter()
          vm.sureDisabled = true
        })
        .catch(() => {
          vm.sureDisabled = false
        })
    },
    handleEnterUniqueLabel() {
      let vm = this
      let params = {
        rfCodes: vm.$trim(vm.rfCodes),
        purchaseId: vm.purchaseId
      }
      vm.$api[`warehouse/purchaseScanUniqueLabel`](params).then(data => {
        vm.handleEnter()
      })
    }
  }
}
</script>

<style lang="scss">
.purchase {
  background: #fff;
  .bar-code {
    height: 3rem;
    margin: 0 auto;
    text-align: center;
    // line-height: 3;
  }
}
</style>