<template>
  <div class="warehousing">
    <!-- <flexbox>
      <flexbox-item>
        <div class="bar-code bcolor">
          <x-input
            @on-click-clear-icon="() => {code = ''}"
            @on-enter="handleEnter"
            placeholder="请输入仓库唯一标识"
            title="仓库唯一标识"
            v-model="code"
          ></x-input>
        </div>
      </flexbox-item>
    </flexbox>-->
    <scan :value.sync="code" title="仓库唯一标识:" placeholder="请输入仓库唯一标识" @click="handleEnter"></scan>
    <!-- <flexbox v-if="codeFlag">
      <flexbox-item>
        <group>
          <x-input @on-click-clear-icon="() => {code = ''}" @on-enter="handleEnter" placeholder="请输入仓库唯一标识" title="仓库唯一标识" v-model="code"></x-input>
        </group>
      </flexbox-item>
    </flexbox>-->
    <flexbox>
      <flexbox-item>
        <group>
          <x-input disabled placeholder="库位名字" title="库位：" v-model="locationInfo.wmLocationName"></x-input>
        </group>
      </flexbox-item>
    </flexbox>
    <!-- 扫描库位 -->
    <location-search @change="val => locationInfo = val"></location-search>
    <flexbox>
      <flexbox-item>
        <group>
          <yt-table @selectChange="selectChange" :select="true" :radio="true" :columns="columns" :data="data"></yt-table>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <x-button type="primary" :disabled="sureDisabled" @click.native="handleSure">确认入库</x-button>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <yt-table :columns="tableColumns" :data="tableData"></yt-table>
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
      code: null,
      tableColumns: [
        {
          label: '主图',
          value: 'imageBase',
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
          value: 'stockIn'
        },
        {
          label: '已扫描数',
          value: 'currentScan'
        }
      ],
      tableData: [],

      columns: [
        {
          label: '订单号',
          value: 'orderNumber'
        },
        {
          label: '订单来源',
          value: 'storeName'
        },
        {
          label: '数量',
          value: 'total'
        },
        {
          label: '客户名称',
          value: 'customerName'
        }
      ],
      data: [],
      locationInfo: {
        wmLocationName: ''
      },
      wmReturnId: null,
      sureDisabled: true,
      selectData: []
    }
  },
  methods: {
    selectChange(val) {
      let vm = this
      vm.selectData = val
      let _data = val[0] || {}
      let wmReturnId = _data.wmReturnId || null
      vm.wmReturnId = wmReturnId
      let wmLocationId = vm.locationInfo.wmLocationId
      let code = vm.code
      vm.$api[`warehouse/returnChoose`]({
        wmReturnId,
        wmLocationId,
        code
      }).then(({ rows = [] }) => {
        vm.tableData = rows
      })
    },
    handleEnter() {
      let vm = this
      vm.$api[`warehouse/returnScan`]({
        code: vm.code
      })
        .then(({ rows = {} }) => {
          let { locationInfo, orderInfo } = rows
          vm.locationInfo = locationInfo
          vm.data = orderInfo
          vm.sureDisabled = false
          if (vm.selectData.length) {
            vm.selectChange(vm.selectData)
          }
        })
        .catch(() => {
          vm.sureDisabled = true
        })
    },
    handleSure() {
      let vm = this
      let wmReturnId = vm.wmReturnId || null
      let wmLocationId = vm.locationInfo.wmLocationId
      let code = vm.code
      vm.$api[`warehouse/returnStockin`]({
        wmReturnId,
        code,
        wmLocationId
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