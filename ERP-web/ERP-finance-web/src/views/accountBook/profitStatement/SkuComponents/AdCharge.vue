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
        url: 'finance/financeBooksAdvertisementDetailPage',
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
              vm.$api[`finance/financeBooksAdvertisementDetailExport`]({
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
            value: 'rptDate'
          },
          
          {
            label: '广告系列',
            value: 'campaignName'
          },
          {
            label: '花费',
            value: 'costRmb',
            sortable: true
          },
          
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