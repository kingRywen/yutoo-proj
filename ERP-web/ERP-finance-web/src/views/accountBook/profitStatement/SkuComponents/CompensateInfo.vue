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
        url: 'finance/financeBooksReimbursementDetailPage',
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
              vm.$api[`finance/financeBooksReimbursementDetailExport`]({
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
            placeholder: '赔偿ID',
            style: {
              width: '130px'
            },
            value: 'reimbursementNum',
            type: 'input'
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
            value: 'reimbursementTime'
          },
          {
            label: '赔偿ID',
            value: 'reimbursementNum'
          },

          {
            label: '原因',
            value: 'reason'
          },
          {
            label: '数量',
            value: 'quantityReimbursedTotal',
            sortable: true
          },
          {
            label: '赔偿金额',
            value: 'amountTotalRmbStr',
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
    ...mapState('finance', ['warehouseList'])
  },
  created() {
    this.getWarehouse(0)
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