<template>
  <div class="warehousing">
    <!-- <flexbox>
      <flexbox-item>
        <div class="bar-code bcolor">
          <x-input
            @on-enter="handleEneter"
            placeholder="请输入SKU&库位条码"
            title="SKU&库位条码："
            @on-click-clear-icon="() => {code = ''}"
            v-model="code"
          ></x-input>
        </div>
      </flexbox-item>
    </flexbox>-->
    <scan :value.sync="code" title="SKU&库位条码:" placeholder="请输入SKU&库位条码" @click="handleEneter"></scan>
    <!-- <flexbox v-if="codeFlag">
      <flexbox-item>
        <group>
          <x-input @on-enter="handleEneter" placeholder="请输入SKU&库位条码" title="SKU&库位条码：" v-model="code"></x-input>
        </group>
      </flexbox-item>
    </flexbox>-->
    <flexbox>
      <flexbox-item>
        <!-- <x-input v-if="!locationList.length" placeholder="库位名称" title="库位：" v-model="locationInfo.wmLocationId"></x-input> -->
        <location-search
          ref="locationSearch"
          v-if="!locationList.length"
          @change="el => {locationInfo.wmLocationId = el.wmLocationId}"
        ></location-search>
        <yt-select
          v-else
          :list="locationList"
          :placeholder="'请选择库位：'"
          :title="'库位名称:'"
          :value.sync="locationInfo.wmLocationId"
        ></yt-select>
      </flexbox-item>
    </flexbox>
    <!-- 扫描库位 -->
    <location-search v-if="locaFlag" @change="val => {locationInfo = val;locationFlag = true}"></location-search>
    <flexbox>
      <flexbox-item>
        <group>
          <x-button type="primary" :disabled="sureDisabled" @click.native="handleSure">提交</x-button>
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
      locationList: [],
      columns: [
        {
          label: '主图',
          value: 'imageBase',
          type: 'img',
          width: '2'
        },
        {
          label: '自定义sku',
          value: 'skuCus',
          width: '2'
        },
        {
          label: '现有库存',
          value: 'repertory',
          width: '2'
        },
        {
          label: '需入库',
          value: 'stockOut',
          width: '2'
        },
        {
          label: '已扫描数',
          value: 'scannedIn',
          width: '2'
        }
      ],
      locationInfo: {
        wmLocationName: ''
      },
      locaFlag: false,
      locationFlag: false,
      wmMovePlanId: null
    }
  },
  computed: {
    sureCode: {
      get() {
        let vm = this
        if (vm.locationFlag) {
          return vm.code
        }
      },
      set() {}
    },
    sureDisabled: {
      get() {
        let vm = this
        if (
          vm.sureCode &&
          (vm.wmMovePlanId || vm.wmMovePlanId == 0) &&
          (vm.locationInfo.wmLocationId || vm.locationInfo.wmLocationId == 0)
        ) {
          return false
        } else {
          return true
        }
      },
      set() {}
    }
  },
  methods: {
    handleSure(val) {
      let vm = this
      if (!vm.locationInfo.wmLocationId && vm.locationInfo.wmLocationId != 0) {
        if (!vm.locationList.length) {
          this.$msg('请扫描库位')
        } else {
          this.$msg('请選擇库位')
        }
        return
      }
      vm.$api[`warehouse/stockin`]({
        code: vm.sureCode,
        wmMovePlanId: vm.wmMovePlanId,
        wmLocationId: vm.locationInfo.wmLocationId
      })
    },
    handleEneter() {
      let vm = this
      if (!vm.locationList.length) {
        vm.$refs['locationSearch'].clear()
      }
      vm.locationInfo = {}
      vm.$api[`warehouse/stockinScan`]({
        code: vm.code
      }).then(async ({ rows = {} }) => {
        let {
          locationInfo,
          productInfo = [],
          locationFlag = false,
          wmMovePlanId = null
        } = rows
        if (!locationInfo) {
          return
        }
        vm.locationFlag = locationFlag
        vm.wmMovePlanId = wmMovePlanId
        if (locationFlag) {
          vm.locationInfo = locationInfo
        } else {
          vm.locaFlag = true
          if (!Object.keys(vm.locationInfo).length) {
            vm.locationInfo = locationInfo
          }
        }
        vm.tableData = productInfo

        vm.locationList = locationInfo.map(item => {
          return {
            label: item.wmLocationName,
            value: item.wmLocationId
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.warehousing {
  background: #fff;
  .bar-code {
    height: 3rem;
    margin: 0 auto;
    text-align: center;
  }
}
</style>