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
        cellClassName: ({row, column, rowIndex, columnIndex}) => {
          if (row.invalidFlag) {
            return 'info'
          }
        },
        url: 'finance/financeBooksAccountDetailPage',
        selectData: [],
        searchForm(val) {
          return val
        },
        btnConfig: [
          {
            name: '导入',
            fn: () => {
              vm.$refs.page.$dialog({
                title: '导入明细账',
                visible: true,
                width: '500px',
                component: () => import('./Import.vue'),
                fnName: 'initData'
              })
            }
          },
          {
            name: '导出',
            fn: () => {
              vm.$api[`finance/financeBooksAccountDetailListExport`]({
                fmAccountDetailIds: vm.config.selectData.map(
                  item => item.fmAccountDetailId
                ),
                ...vm.$refs.page.getSearchData()
              })
                .then(({ path }) => {
                  downloadFile(path)
                })
                .catch(() => {})
            }
          },
          {
            name: '添加',
            fn: () => {
              vm.$refs.page.$dialog({
                title: '添加明细账',
                visible: true,
                width: '500px',
                component: () => import('./Add.vue'),
                fnName: 'initData',
                submit(val) {
                  let url = 'financeBooksAccountDetailSave'
                  return vm.$api[`finance/${url}`](val).catch(() => {})
                }
              })
            }
          }
        ],
        searchConfig: [
          {
            placeholder: '账目类型',
            value: 'itemType',
            type: 'select',
            children: []
          },
          {
            placeholder: '请输入摘要',
            value: 'digest',
            type: 'input',
            max: 100
          },
          {
            placeholder: '收款方',
            value: 'receiveAccount',
            type: 'auto',
            querySearch: vm.getAccountData(0)
          },
          {
            placeholder: '付款方',
            value: 'paymentAccount',
            type: 'auto',
            querySearch: vm.getAccountData(1)
          },

          {
            // label: '合同日期',
            value: 'time',
            type: 'time'
          }
        ],
        tableConfig: [
          {
            label: '时间',
            value: 'paymentTime'
          },
          {
            label: '账目类型',
            value: 'itemTypeStr'
          },
          {
            label: '摘要',
            value: 'digest'
          },
          {
            label: '付款方',
            value: 'paymentAccount'
          },
          {
            label: '收款方',
            value: 'receiveAccount'
          },
          {
            label: '金额',
            value: 'surplusStr'
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
    // type: 0 收款帐号 1 付款账号
    getAccountData(type) {
      let params = {
        first: 0,
        limit: 100
      }

      return text => {
        if (type) {
          params.paymentAccount = text
        } else {
          params.receiveAccount = text
        }
        return this.$api[`finance/financeBooksAccountDetailAccountList`](
          params
        ).then(data => {
          return data.rows.map(el => ({ value: el }))
        })
      }
    }
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
}
.info {
  color: #bbb
}
</style>