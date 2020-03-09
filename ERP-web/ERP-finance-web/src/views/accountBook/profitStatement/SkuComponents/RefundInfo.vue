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
    // console.log(this.$route.query);
    return {
      config: {
        url: 'finance/financeBooksDrawBackDetailPage',
        selectData: [],
        searchForm(val) {
          val.type = vm.$route.query.type
          val.productId = +vm.$route.query.productId
          let {refundTime, time, ...info} = val
          let [startTime, endTime] = time || []
          let [refundTimeStart, refundTimeEnd] = refundTime || []
          return {startTime, endTime, refundTimeStart, refundTimeEnd, ...info}
        },
        btnConfig: [
          {
            name: '导出',
            fn: () => {
              vm.$api[`finance/financeBooksDrawBackDetailExport`]({
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
            // label: '账号类型',
            value: 'time',
            type: 'time',
            style: {
              width: '240px'
            },
            label: '下单时间'
          },
          {
            style: {
              width: '240px'
            },
            label: '退款时间',
            value: 'refundTime',
            type: 'time'
          }
        ],
        tableConfig: [
          {
            label: '下单时间',
            value: 'orderTime'
          },
          {
            label: '退款时间',
            value: 'refundTime'
          },
          {
            label: '订单号',
            value: 'orderNumPlatform',
            render(h, scope) {
              return <el-button type="text" onClick={() => {
                vm.$jumpOrderInfo(scope.row)
              }}>{scope.row.orderNumPlatform}</el-button>
            },
          },
          {
            label: '客户名称',
            value: 'buyerName'
          },
          
          {
            label: '退款数量',
            value: 'num',
            sortable: true
          },
          {
            label: '退款金额',
            value: 'amount',
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
    this.getGlobalSelect().then(() => {
      this.config.searchConfig[0].children = this.accountType
      this.config.searchConfig[1].children = this.accountItems
    })
  },
  watch: {},
  methods: {
    ...mapActions('finance', ['getGlobalSelect', 'getMerchantList']),
    
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
}
</style>