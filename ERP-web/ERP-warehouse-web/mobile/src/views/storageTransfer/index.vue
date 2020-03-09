<template>
  <div class="storage-transfer">
    <!-- <flexbox>
      <flexbox-item>
        <div class="bar-code bcolor">
          <x-input
            @on-enter="handleEnter(code)"
            placeholder="请输入库位&仓库SKU"
            title="库位&仓库SKU："
            @on-click-clear-icon="() => {code = ''}"
            v-model="code"
          ></x-input>
        </div>
      </flexbox-item>
    </flexbox>-->
    <scan :value.sync="code" title="库位&仓库SKU:" placeholder="请输入库位&仓库SKU" @click="handleEnter(code)"></scan>
    <!-- <flexbox v-if="codeFlag">
      <flexbox-item>
        <group>
          <x-input @on-enter="handleEnter(code)" placeholder="请输入库位&仓库SKU" title="库位&仓库SKU："  @on-click-clear-icon="() => {code = ''}" v-model="code"></x-input>
        </group>
      </flexbox-item>
    </flexbox>-->
    <flexbox>
      <flexbox-item>
        <x-input disabled placeholder="库位信息" title="库位：" v-model="locationInfo.wmLocationName"></x-input>
      </flexbox-item>
    </flexbox>
    <!-- <scan :value.sync="locationInfo.wmLocationName" :disabled="true" title="库位:" placeholder="请输入库位信息" @click="handleEnter(code)"></scan> -->
    <!-- 扫描库位 -->
    <!-- <location-search @change="val => locationInfo = val"></location-search>  -->
    <flexbox>
      <flexbox-item>
        <group>
          <x-button type="primary" :disabled="sureDisabled" @click.native="handleSure">确认出库</x-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      codeFlag: false,
      code: '',
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
          value: 'skuCus',
          width: '20%'
        },
        {
          label: '现有库存',
          width: '20%',
          value: 'repertory'
        },
        {
          label: '需出库',
          width: '20%',
          value: 'stockOut'
        },
        {
          label: '已扫描数',
          width: '20%',
          value: 'scannedOut'
        }
      ],
      locationInfo: {
        wmLocationName: ''
      },
      sureDisabled: true,
      wmMovePlanId: null
    }
  },
  methods: {
    handleEnter(code) {
      let vm = this
      vm.$api[`warehouse/moveScan`]({
        codes: code.split(',')
      })
        .then(({ rows }) => {
          if (rows) {
            let { locationInfo, productInfo, wmMovePlanId } = rows
            vm.wmMovePlanId = wmMovePlanId
            vm.locationInfo = locationInfo
            vm.tableData = productInfo
            vm.sureDisabled = false
          }
        })
        .catch(() => {
          vm.sureDisabled = true
        })
    },
    handleSure() {
      let vm = this
      vm.$api[`warehouse/moveStockout`]({
        codes: vm.code.split(','),
        wmLocationId: vm.locationInfo.wmLocationId,
        wmMovePlanId: vm.wmMovePlanId
      })
        .then(() => {
          vm.sureDisabled = true
        })
        .catch(() => {
          vm.sureDisabled = false
        })
    }
  }
}
</script>

<style lang="scss">
.storage-transfer {
  background: #fff;
  .bar-code {
    height: 3rem;
    margin: 0 auto;
    text-align: center;
  }
}
</style>
