<template>
  <div class="purchase-contract">
    <t-page :config="config" ref="page"></t-page>
  </div>
</template>

<script>
/* eslint-disable */
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
        url: 'finance/financeBooksAccountPage',
        selectData: [],
        searchForm(val) {
          return val
        },
        btnConfig: [
          {
            name: '导出',
            fn: () => {
              vm.$api[`finance/financeBooksAccountListExport`]({
                fmAccountTotalIds: vm.config.selectData.map(
                  item => item.fmAccountTotalId
                ),
                ...vm.$refs.page.getSearchData()
              })
                .then(row => {
                  downloadFile(row.path)
                })
                .catch(() => {})
            }
          }
        ],
        searchConfig: [
          {
            // label: '账号类型',
            value: 'accountType',
            type: 'select',
            placeholder: '账号类型',
            children: [],
            change: data => {
              vm.getAccount(data)
            }
          },
          {
            placeholder: '账号',
            value: 'account',
            type: 'select',
            children: [],
            show: data => {
              return !!data.accountType
            }
          },

          {
            value: 'time',
            type: 'time'
          }
        ],
        tableConfig: [
          {
            label: '操作',
            btns: [
              {
                name: '查看',
                icon: 'el-icon-search',
                fn(index, row) {
                  vm.$router.push({ name: 'financeAccountBookAccountStated' })
                }
              }
            ]
          },
          {
            label: '账号',
            value: 'account'
          },
          {
            label: '出账',
            value: 'chargeOffStr',
            sortable: true
          },
          {
            label: '入账',
            value: 'chargeInStr',
            sortable: true
          },
          {
            label: '方向',
            value: 'direction'
          },
          {
            label: '结余',
            value: 'surplusStr',
            sortable: true
          }
        ],
        clickBtn(val) {
          console.log(val)
        }
      }
    }
  },
  computed: {
    ...mapState('finance', ['accountItems'])
  },
  created() {
    this.getGlobalSelect().then(() => {
      this.config.searchConfig[0].children = this.accountItems
    })
  },
  watch: {},
  methods: {
    ...mapActions('finance', ['getGlobalSelect']),
    getAccount(paymentMode) {
      if (paymentMode == null || paymentMode === '') {
        this.config.searchConfig[1].children = []
      } else {
        this.$api[`finance/financePaymentAccountNumber`]({ paymentMode }).then(
          data => {
            this.config.searchConfig[1].children = data.rows.map(el => ({
              label: el.name,
              value: el.id
            }))
          }
        )
      }
    }
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
}
</style>