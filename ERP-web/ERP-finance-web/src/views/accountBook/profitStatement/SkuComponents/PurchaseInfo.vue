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
        url: 'finance/financeBooksPurchaseDetailPage',
        selectData: [],
        searchForm(val) {
          val.productId = +vm.$route.query.productId
          return val
        },
        btnConfig: [
          {
            name: '导出',
            fn: () => {
              vm.$api[`finance/financeBooksPurchaseDetailExport`]({
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
            placeholder: '采购仓库',
            value: 'platformIds',
            type: 'multiple',
            style: {
              width: '130px'
            },
            children: [],
          },
          {
            placeholder: '供应商',
            value: 'platformIds',
            type: 'multiple',
            style: {
              width: '130px'
            },
            children: [],
          },
          {
            style: {
              width: '240px'
            },
            // label: '退款时间',
            value: 'time',
            type: 'time'
          }
        ],
        tableConfig: [
          {
            label: '时间',
            value: 'orderTime'
          },
          {
            label: '供应商',
            value: 'supplierName'
          },
          {
            label: '采购仓库',
            value: 'warehouseName',
            sortable: true
          },
          {
            label: '采购数量',
            value: 'num',
            sortable: true
          },
          {
            label: '采购成本',
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
      'supplierList',
      'warehouseList',
    ])
  },
  created() {
    this.getWarehouse(0).then(() => {
      this.config.searchConfig[0].children = this.warehouseList
    })
    this.getWarehouse(1).then(() => {
      this.config.searchConfig[1].children = this.supplierList
    })
  },
  watch: {},
  methods: {
    ...mapActions('finance', ['getWarehouse'])
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
}
</style>