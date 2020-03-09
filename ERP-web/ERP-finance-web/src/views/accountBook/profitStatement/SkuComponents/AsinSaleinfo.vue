<template>
  <div class="purchase-contract">
    <t-page :config="config" ref="page"></t-page>
  </div>
</template>

<script>
import { downloadFile } from 'Utils/tools.js'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    // eslint-disable-next-line
    let vm = this
    let listUrl = 'financeBooksSalesDetailPage'
    let exportUrl = 'financeBooksSalesDetailExport'
    return {
      config: {
        url: `finance/${listUrl}`,
        selectData: [],
        searchForm(val) {
          val.type = vm.$route.query.type
          val.productId = +vm.$route.query.productId

          return val
        },
        btnConfig: [
          {
            name: '导出',
            fn: () => {
              vm.$api[`finance/${exportUrl}`]({
                type: vm.$route.query.type,
                productId: +vm.$route.query.productId,
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
            value: 'orderNumPlatform',
            type: 'input',
            placeholder: '订单号'
          },
          {
            style: {
              width: '300px'
            },
            value: 'time',
            type: 'time'
          }
        ],
        tableConfig: [
          {
            label: '下单时间',
            value: 'orderTime'
          },
          {
            label: '订单号',
            value: 'orderNumPlatform',
            render(h, scope) {
              return (
                <el-button
                  type="text"
                  onClick={() => {
                    vm.$jumpOrderInfo(scope.row)
                  }}
                >
                  {scope.row.orderNumPlatform}
                </el-button>
              )
            }
          },
          {
            label: '买家名称',
            value: 'buyerName',
            sortable: true
          },
          {
            label: '订购数量',
            value: 'num',
            sortable: true
          },
          {
            label: '订购金额',
            value: 'amount',
            sortable: true
          },
          {
            label: vm.$route.query.title == '正常订单佣金' ? '佣金' : '配送费',
            value: 'cost',
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
    ...mapState('finance', [
      'accountType',
      'accountItems',
      'platformList',
      'siteList',
      'storeList'
    ])
  },
  created() {
    if (this.$route.query.title === '销售总额') {
      this.config.tableConfig.pop()
    }
    this.getGlobalSelect().then(() => {
      this.config.searchConfig[0].children = this.accountType
      this.config.searchConfig[1].children = this.accountItems
    })
  },
  watch: {},
  methods: {
    ...mapActions('finance', ['getGlobalSelect', 'getMerchantList'])
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
}
</style>