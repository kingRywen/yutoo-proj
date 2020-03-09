<template>
  <div class="currency-rate">
    <t-page :config="config" ref="page"></t-page>
  </div>
</template>

<script>
import { downloadFile } from 'Utils/tools.js'
export default {
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      config: {
        url: 'finance/financeCurrencyRateList',
        selectData: [],
        id: 'currencyRateId',
        moreParams: {},
        searchConfig: [
          {
            label: '币种名称',
            value: 'currencyName',
            type: 'input'
          },
          {
            label: '币种代码',
            value: 'currencyCode',
            type: 'input'
          }
        ],
        btnConfig: [
          {
            name: '手动更新汇率',
            fn: () => {
              return {
                url: 'finance/financeCurrencyRateSync'
              }
            }
          },
          {
            name: '编辑自定义汇率',
            fn: () => {
              if (vm.$isEdit(vm.config.selectData, false)) {
                return
              } else {
                vm.$refs.page.$dialog({
                  title: '编辑自定义费率',
                  width: '500px',
                  visible: true,
                  component: () => import('./editRate'),
                  childFn: [
                    {
                      name: 'edit',
                      params: {
                        currencyRateIds: vm.config.selectData.map(
                          item => item.currencyRateId
                        )
                      }
                    }
                  ]
                })
              }
            }
          },
          {
            name: '清空自定义汇率',
            fn: () => {
              let currencyRateIds = vm.config.selectData.map(
                item => item.currencyRateId
              )
              return {
                url: 'finance/financeCurrencyRateClear',
                params: {
                  currencyRateIds
                },
                selectOptions: {
                  ids: currencyRateIds
                }
              }
            }
          },
          {
            name: '导出',
            fn: () => {
              return {
                url: 'finance/financeCurrencyRateExport',
                params: {
                  currencyRateIds: vm.config.selectData.map(
                    item => item.currencyRateId
                  )
                },
                fn({ path = '' }) {
                  downloadFile(path)
                }
              }
            }
          }
        ],
        tableConfig: [
          {
            label: '币种中文名称',
            value: 'currencyName'
          },
          {
            label: '币种代码',
            value: 'currencyCode'
          },
          {
            label: '兑人民币汇率',
            value: 'rateRmb'
          },
          {
            label: '自定义汇率',
            value: 'rateCustom'
          },
          {
            label: '是否激活',
            value: 'activatedFlagName'
          },
          {
            label: '最后更新时间',
            value: 'modifyTime'
          }
        ],
        clickBtn(val) {
          console.log(val)
        }
      }
    }
  },
  created() {},
  methods: {
    judgeSelectData(url) {
      let vm = this
      return vm.$api[`finance/${url}`]({
        currencyRateIds: vm.config.selectData.map(item => item.currencyRateId)
      }).then(({ path = '' }) => {
        return Promise.resolve(path)
      })
    }
  }
}
</script>

<style lang='scss'>
.currency-rate {
  background: #fff;
}
</style>