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
        url: 'finance/financeBooksCostTypeDetailPage',
        selectData: [],
        searchForm(val) {
          val.productId = +this.$route.query.productId
          val.type = this.$route.query.type
          return val
        },
        btnConfig: [
          {
            name: '导出',
            fn: () => {
              vm.$api[`finance/financeBooksCostTypeDetailExport`]({
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
            placeholder: '仓库',
            style: {
              width: '130px'
            },
            value: 'storeIds',
            type: 'multiple',
            children: vm.warehouseList
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
            label: '时间',
            value: 'time'
          },
          {
            label: '仓库',
            value: 'warehouseName'
          },
          
          {
            label: '数量',
            value: 'num',
            sortable: true
          },
          {
            label: '成本',
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
    computed: {
    ...mapState('finance', [
      'warehouseList',
    ])
  },
  },
  created() {
    this.getWarehouse(0)
    this.getGlobalSelect().then(() => {
      this.config.searchConfig[0].children = this.accountType
      this.config.searchConfig[1].children = this.accountItems
    })
  },
  watch: {},
  methods: {
    ...mapActions('finance', ['getWarehouse']),
    
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
}
</style>