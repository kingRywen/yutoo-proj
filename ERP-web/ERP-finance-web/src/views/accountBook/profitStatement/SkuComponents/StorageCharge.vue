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
        url: 'finance/financeBooksStorageFeeDetailPage',
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
              vm.$api[`finance/financeBooksStorageFeeDetailExport`]({
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
          // {
          //   // label: '账号类型',
          //   value: 'orderNumPlatform',
          //   type: 'input',
          //   placeholder: '订单号'
          // },
          {
            style: {
              width: '300px'
            },
            placeholder: '统计时间',
            value: 'time',
            type: 'time'
          }
        ],
        tableConfig: [
          {
            label: '时间',
            value: 'statTime'
          },
          
          {
            label: '1~29天库存数量',
            value: 'quantityOne',
            sortable: true
          },
          {
            label: '30~59天库存数量',
            value: 'quantityTwo',
            sortable: true
          },
          {
            label: '60~89天库存数量',
            value: 'quantityThree',
            sortable: true
          },
          {
            label: '90~179天库存数量',
            value: 'quantityFour',
            sortable: true
          },
          {
            label: '180~270天库存数量',
            value: 'quantityFive',
            sortable: true
          },
          {
            label: '180~270天库存数量',
            value: 'quantitySix',
            sortable: true
          },
          {
            label: '365~天库存数量',
            value: 'quantitySeven',
            sortable: true
          },
          {
            label: '收费',
            value: 'amountTotalRmb',
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