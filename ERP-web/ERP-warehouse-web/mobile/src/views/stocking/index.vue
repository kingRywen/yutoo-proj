<template>
  <div class="stocking">
    <!-- 盘点批次号 -->
    <scan :value.sync="batchCode" title="盘点批次号:" placeholder="请输入盘点批次号" @click="handleEnter" @clear="batchClear"></scan>

    <!-- 库位条码 -->
    <scan :value.sync="locationCode" title="库位条码:" placeholder="请输入库位条码" @click="handleEnter"></scan>
    <flexbox>
      <flexbox-item>
        <group v-if="locationInfo.wmLocationName">库位名字：{{locationInfo.wmLocationName}}</group>
      </flexbox-item>
    </flexbox>
    <flexbox>
      <flexbox-item>
        <group>
          <x-button type="default" :disabled="scanFlag" @click.native="rfCodesFlag = true;clickScanFlag=true">点击扫描所有产品</x-button>
        </group>
      </flexbox-item>
      <flexbox-item>
        <group>
          <span @click="() => selectProblem = !selectProblem">
            <x-button type="default" :disabled="badBtnFlag" @click.native="handleBad">点击扫描损坏库存</x-button>
          </span>
        </group>
      </flexbox-item>
    </flexbox>
    <div v-if="clickScanFlag">
      <div v-if="rfCodesFlag">
        <scan :value.sync="rfCodes" type="textarea" title="扫描所有产品:" placeholder="扫描产品" @click="handleEnterAllProduct"></scan>
      </div>
      <div v-else>
        <!-- 转移库位 -->
        <div v-if="issueType == 6">
          <flexbox>
            <flexbox-item>
              <location-search @change="row => {targetLocationId = row.wmLocationId;wmLocationName=row.wmLocationName}"></location-search>
              <group v-if="wmLocationName">库位名字：{{wmLocationName}}</group>
            </flexbox-item>
          </flexbox>
        </div>
        <scan
          :value.sync="uniqueLabels"
          type="textarea"
          title="扫描损坏产品:"
          placeholder="损坏扫描产品"
          @click="handleEnterIssueProduct"
        ></scan>
        <flexbox>
          <flexbox-item>
            <group>
              <!-- <selector title="问题类型" :options="list" v-model="issueType"></selector> -->
              <yt-select :list="list" :placeholder="'选择问题类型'" :title="'问题类型:'" :value.sync="issueType"></yt-select>
            </group>
          </flexbox-item>
        </flexbox>
        <div v-if="issueType == 7">
          <flexbox>
            <flexbox-item>
              <!--原标 -->
              <scan :value.sync="uniqueLabel.originalUniqueLabel" title="原标:" placeholder="原标"></scan>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item>
              <!-- 现标 -->
              <scan :value.sync="uniqueLabel.currentUniqueLabel " title="现标:" placeholder="现标"></scan>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item>
              <!-- 确认扫描下一个 -->
              <x-button type="primary" :disabled="scanNextFlag" @click.native="handleScanNext(uniqueLabel)">{{scanNext}}</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
    <flexbox>
      <flexbox-item>
        <group>
          <x-button type="primary" :disabled="sureDisabled" @click.native="handleSure">确认盘点</x-button>
        </group>
      </flexbox-item>
    </flexbox>
    <flexbox v-if="!scanFlag">
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
      uniqueLabel: {
        originalUniqueLabel: '',
        currentUniqueLabel: ''
      },
      wmAppInventoryId: null,
      wmLocationName: null,
      targetLocationId: null,
      scanNext: '确认并扫描下一个',
      scanNextFlag: false,
      badBtnFlag: true, // 点击损坏按钮
      clickScanFlag: false,
      batchCodeFlag: false,
      locationCodeFlag: false,
      rfCodesFlag: false,
      issueFlag: false,
      uniqueLabels: '',
      number: null,
      selectProblem: false,
      issueType: null,
      list: [],
      tableColumns: [
        {
          label: '主图',
          value: 'imageBase',
          type: 'img'
        },
        {
          label: '应有库存',
          value: 'repertory'
        },
        {
          label: '最终盘点数量',
          value: 'finalRepertory'
        }
      ],
      tableData: [],
      batchCode: '',
      locationCode: '',
      rfCodes: null,
      locationInfo: {
        wmLocationId: null
      },
      inventoryPlanInfo: {
        wmInventoryPlanId: null
      }
      // sureDisabled: true
    }
  },
  created() {},
  watch: {
    issueType(val) {
      console.log(val)
    }
  },
  computed: {
    sureDisabled() {
      let vm = this
      if (
        vm.locationInfo.wmLocationId &&
        vm.inventoryPlanInfo.wmInventoryPlanId
      ) {
        return false
      } else {
        return true
      }
    },
    scanFlag() {
      let vm = this
      if (
        vm.locationInfo.wmLocationId &&
        vm.inventoryPlanInfo.wmInventoryPlanId
      ) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    handleChange(row) {
      console.log(row)
    },
    handleEnter() {
      let vm = this
      if (!vm.locationCode || !vm.batchCode) {
        let message = ''
        if (vm.locationCode) {
          message = '请输入盘点批次号'
        } else {
          message = '请输入库位条码'
        }
        this.$msg(message)
        return
      }
      let params = {
        locationCode: vm.locationCode,
        batchCode: vm.batchCode
      }
      vm.$api[`warehouse/inventoryScan`](params).then(({ rows }) => {
        let {
          locationInfo = {},
          inventoryPlanInfo = {},
          products = [],
          headers = [],
          wmAppInventoryId = null
        } = rows
        vm.wmAppInventoryId = wmAppInventoryId
        if (rows.again) {
          vm.MessageBox.confirm('该库位已经盘点完毕，是否需要重新盘点？').then(
            action => {
              vm.$api[`warehouse/wmAppInventoryAgain`]({
                wmAppInventoryId: vm.wmAppInventoryId
              }).then(() => {
                vm.handleEnter()
              })
            }
          )
          return
        }

        vm.locationInfo = locationInfo
        vm.inventoryPlanInfo = inventoryPlanInfo
        vm.tableColumns.splice(0)
        vm.tableColumns = headers.map(item => {
          if (!Object.keys(item).length) {
            return
          }
          if (Object.keys(item)[0] == 'image') {
            return {
              label: item[Object.keys(item)[0]],
              value: Object.keys(item)[0],
              type: 'img'
            }
          }
          return {
            label: item[Object.keys(item)[0]],
            value: Object.keys(item)[0]
          }
        })
        vm.tableData = products.map(el => {
          let { issueEntities = [] } = el
          issueEntities.map(item => {
            if (JSON.stringify(vm.tableColumns).indexOf(item.desc) < 0) {
              vm.tableColumns.push({
                label: item.issueName,
                value: item.desc
              })
              el[item.desc] = item.amount
            }
          })
          return el
        })
      })
    },
    handleEnterAllProduct() {
      let vm = this
      let params = {
        rfCodes: vm.$trim(vm.rfCodes),
        wmInventoryPlanId: vm.inventoryPlanInfo.wmInventoryPlanId,
        wmLocationId: vm.locationInfo.wmLocationId
      }
      vm.$api[`warehouse/inventoryProductNormal`](params).then(() => {
        vm.badBtnFlag = false
        vm.handleEnter()
      })
    },
    handleEnterIssueProduct() {
      let vm = this

      if (!vm.uniqueLabels) {
        vm.$msg('请扫描已损坏产品')
        return
      }
      if (!vm.issueType) {
        vm.$msg('请先选择问题类型')
        return
      }
      if (vm.issueType == 6 && !vm.targetLocationId) {
        vm.$msg('请先扫描库位')
        return
      }
      let params = {
        rfCodes: vm.$trim(vm.uniqueLabels),
        wmInventoryPlanId: vm.inventoryPlanInfo.wmInventoryPlanId,
        wmLocationId: vm.locationInfo.wmLocationId,
        issueType: vm.issueType,
        targetLocationId: vm.targetLocationId
      }
      vm.$api[`warehouse/inventoryProductDamage`](params).then(
        ({ rows = {}, uniqueLabels }) => {
          vm.scanNext = '确认并扫描下一个'
          vm.scanNextFlag = false

          if (typeof uniqueLabels == 'object') {
            vm.uniqueLabel = uniqueLabels
          }
          vm.handleEnter()
        }
      )
    },
    handleScanNext(uniqueLabel) {
      let vm = this
      vm.$api[`warehouse/wmAppInventoryLabelError`]({
        ...uniqueLabel,
        wmAppInventoryId: vm.wmAppInventoryId,
        wmLocationId: vm.locationInfo.wmLocationId
      }).then(data => {
        if (data.nextAble == false) {
          vm.scanNext = '已扫描完'
          vm.scanNextFlag = true
          vm.uniqueLabel = {}
        } else {
          vm.uniqueLabel = data.uniqueLabels
        }
      })
    },
    batchClear() {
      this.locationCode = ''
      this.tableData = []
      this.locationInfo = {
        wmLocationId: null
      }
      this.inventoryPlanInfo = {
        wmInventoryPlanId: null
      }
    },
    handleBad() {
      let vm = this
      vm.rfCodesFlag = false
      vm.clickScanFlag = true
      vm.$api[`warehouse/issueTypeList`]({}).then(({ rows }) => {
        vm.list = rows.map(item => {
          return {
            label: item.value,
            value: item.key
          }
        })
      })
    },
    handleSure() {
      let vm = this
      let params = {
        wmInventoryPlanId: vm.inventoryPlanInfo.wmInventoryPlanId,
        wmLocationId: vm.locationInfo.wmLocationId
      }
      vm.$api[`warehouse/inventoryConfirm`](params)
    }
  }
}
</script>

<style lang="scss">
.stocking {
  background: #fff;
  .bar-code {
    height: 3rem;
    margin: 0 auto;
    text-align: center;
  }
}
</style>