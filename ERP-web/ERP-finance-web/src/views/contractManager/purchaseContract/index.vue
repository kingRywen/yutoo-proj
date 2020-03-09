<template>
  <div class="purchase-contract">
    <t-page :config="config" ref="page"></t-page>
  </div>
</template>

<script>
import { mixins } from '../../dailyOperation/common/mixins'
import { downloadFile } from 'Utils/tools.js'
import { mapActions, mapState } from 'vuex'
export default {
  mixins: [mixins],
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      config: {
        url: 'finance/financePurchaseContractList',
        id: 'purchaseContractId',
        selectData: [],
        searchForm(val) {
          return val
        },
        btnConfig: [
          {
            name: '导出',
            fn: () => {
              return {
                url: 'finance/financePurchaseContractExport',
                params: {
                  purchaseContractIds: vm.config.selectData.map(
                    item => item.purchaseContractId
                  )
                },
                fn({ path = '' }) {
                  downloadFile(path)
                }
              }
            }
          },
          {
            name: '打印',
            fn: () => {
              if (vm.$isEdit(vm.config.selectData)) {
                return
              }
              vm.$jumpContractInfo(vm.config.selectData[0])
            }
          }
        ],
        searchConfig: [
          {
            label: '合同编号',
            value: 'contractNumber',
            type: 'input'
          },
          {
            label: '采购单号',
            value: 'purchaseNumber',
            type: 'input'
          },
          {
            label: '下单号',
            value: 'lowerSingleNumber',
            type: 'input'
          },
          {
            placeholder: '采购人员',
            value: 'purchasersIds',
            type: 'multiple',
            children: []
          },
          {
            placeholder: '供应商',
            value: 'supplierIds',
            type: 'multiple',
            children: []
          },
          {
            label: '合同日期',
            value: 'time',
            type: 'time'
          }
        ],
        tableConfig: [
          {
            label: '序号',
            value: 'purchaseContractId'
          },
          {
            label: '采购单号',
            value: 'purchaseNumber',
            width: 130,
            render(h, scope) {
              return (
                <el-button
                  type="text"
                  onClick={vm._purchasingOrderDetails.bind(vm, scope.row)}
                >
                  {scope.row.purchaseNumber}
                </el-button>
              )
            }
          },
          {
            label: '下单号',
            value: 'lowerSingleNumber',
            width: 130,
            render(h, scope) {
              return (
                <el-button
                  type="text"
                  onClick={vm._purchasingOrderInfo.bind(vm, scope.row, 'page')}
                >
                  {scope.row.lowerSingleNumber}
                </el-button>
              )
            }
          },
          {
            label: '合同编号',
            value: 'contractNumber',
            width: 130,
            render(h, scope) {
              return (
                <el-button
                  type="text"
                  onClick={vm.$jumpContractInfo.bind(vm, scope.row)}
                >
                  {scope.row.contractNumber}
                </el-button>
              )
            }
          },
          {
            label: '采购人员',
            value: 'purchasersName'
          },
          {
            label: '是否开票',
            value: 'billingFlagName'
          },
          {
            label: '开票税点',
            value: 'billingTaxPoint'
          },
          {
            label: '合同金额（含税）',
            value: 'contractAmount',
            width: 120
          },
          {
            label: '开票税点',
            value: 'billingTaxPoint'
          },
          {
            label: '合同日期',
            value: 'contractDate'
          },
          {
            label: '备注',
            value: 'contractRemark'
          }
        ],
        clickBtn(val) {
          console.log(val)
        }
      }
    }
  },
  watch: {
    supplierListAll(val) {
      if (val) {
        this.$set(this.config.searchConfig[4], 'children', val)
      }
    },
    rtHandleOperator(val) {
      if (val) {
        this.$set(this.config.searchConfig[3], 'children', val)
      }
    }
  },
  created() {
    this.getSupplierListAll()
    this.getOperator()
  },
  computed: {
    ...mapState('finance', ['rtHandleOperator']),
    ...mapState('common', ['supplierListAll'])
  },
  methods: {
    ...mapActions('finance', ['getOperator']),
    ...mapActions('common', ['getSupplierListAll']),
    _purchasingOrderInfo(row, compName) {
      let { lowerSingleNumber, purchaseNumber } = row
      this._requiredParams({ lowerSingleNumber, purchaseNumber })
      this.$refs[compName].$dialog({
        title: '下单详情 - ' + purchaseNumber,
        visible: true,
        width: '980px',
        component: () => import('Views/dailyOperation/common/queryOrderForm'),
        childFn: [
          {
            name: 'getListData',
            params: lowerSingleNumber
          }
        ]
      })
    }
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
}
</style>