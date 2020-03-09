<template>
  <div class="purchase-contract" v-if="$route.name == 'financeAccountBookProfitStatementDetails'">
    <t-page :config="config" ref="page" :defaultValue="defaultValue"></t-page>
  </div>
  <router-view v-else></router-view>
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
    // console.log(this.$route.query);
    return {
      defaultValue: {
        platformIds: [],
        siteIds: [],
        storeIds: []
      },
      config: {
        url: 'finance/financeBooksCostDetailPage',
        selectData: [],
        searchForm(val) {
          val.type = vm.$route.query.type
          return val
        },
        btnConfig: [
          {
            name: '导出',
            fn: () => {
              vm.$api[`finance/financeBooksCostDetailsExport`]({
                type: vm.$route.query.type,
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
            placeholder: '平台',
            value: 'platformIds',
            type: 'multiple',
            style: {
              width: '130px'
            },
            children: vm.platformList,

            change(val, data) {
              vm.changeItem('platform', val, data)
            }
          },
          {
          placeholder: '站点',
          value: 'siteIds',
          type: 'multiple',
          style: {
            width: '130px'
          },
          children: vm.siteList,
          show(data) {
            return data.platformIds && data.platformIds[0] != null
          },
          change(val, data) {
            vm.changeItem('siteId', val, data)
          }
        },
        {
          placeholder: '店铺',
          style: {
            width: '130px'
          },
          value: 'storeIds',
          type: 'multiple',
          children: vm.storeList,
          show(data) {
            return data.siteIds && data.siteIds[0] != null
          },
          change(val, data) {
            vm.changeItem('storeId', val, data)
          }
        },
          {
          placeholder: '父产品',
          value: 'parentIds',
          type: 'multiple',
          style: {
            width: '300px'
          },
          children: [],
          change(val, data) {
            data.variantIds = []
          }
        },
        {
          placeholder: '子产品',
          value: 'variantIds',
          type: 'multiple',
          style: {
            width: '300px'
          },
          children: [],
          change(val, data) {
            data.parentIds = []
          }
        },
          
          {
            placeholder: '站点',
            value: 'siteIds',
            type: 'multiple',
            style: {
              width: '130px'
            },

            children: vm.siteList,
            show(data) {
              return data.platformIds && data.platformIds[0] != null
            },

            change(val, data) {
              vm.changeItem('siteId', val, data)
            }
          },
          {
            placeholder: '店铺',
            style: {
              width: '130px'
            },
            show(data) {
              return data.siteIds && data.siteIds[0] != null
            },
            value: 'storeIds',
            type: 'multiple',
            children: vm.storeList,
            change(val, data) {
              vm.changeItem('storeId', val, data)
            }
          },
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
            label: '操作',
            btns: [
              {
                name: '查看',
                icon: 'el-icon-search',
                fn(index, row) {
                  vm.$router.push({
                    name: 'financeAccountBookProfitStatementSkuDetails',
                    query: {
                      title: vm.$route.query.title,
                      sku: row.sku,
                      productId: row.productId,
                      type: vm.$route.query.type
                    }
                  })
                }
              }
            ]
          },
          {
            label: 'SKU',
            value: 'sku',
            render(h, scope) {
              return (
                <el-button
                  type="text"
                  onClick={() => {
                    vm.$router.push({
                      name: 'financeAccountBookProfitStatement',
                      params: { sku: scope.row.sku }
                    })
                  }}
                >
                  {scope.row.sku || '-'}
                </el-button>
              )
            }
          },
          {
            label: '主图',
            type: 'img',
            value: 'imageUrl',
            style: {
              width: 40
            }
          },
          {
            label: '标题',
            value: 'title'
          },
          {
            label: '费用',
            value: 'cost',
            sortable: true
          },
          {
            label: '占比',
            value: 'rate',
            sortable: true,
            render(h, scope) {
              return <span>{((scope.row.rate * 10000).toFixed(0))/ 100}%</span>
            },
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
      'storeList',
      'warehouseList',
      'supplierWarehouseList'
    ])
  },
  created() {
    this.setUrl()
    this.getAllParentSku()
    this.getAllVariantSku()
  },
  watch: {
    platformList(val) {
      this.config.searchConfig[1].children = val
    },
    siteList(val) {
      this.config.searchConfig[2].children = val
    },
    storeList(val) {
      this.config.searchConfig[3].children = val
    }
  },
  methods: {
    ...mapActions('finance', [
      'getGlobalSelect',
      'getMerchantList',
      'getWarehouse'
    ]),
    // 获取所有父产品
    getAllParentSku() {
      this.$api[`finance/financeBooksParentSkuList`]({}).then(data => {
        this.config.searchConfig[3].children = data.rows.map(el => ({
          label: el.skuCus,
          value: el.productId
        }))
      })
    },
    // 获取所有子产品
    getAllVariantSku() {
      this.$api[`finance/financeBooksVariantSkuList`]({}).then(data => {
        this.config.searchConfig[4].children = data.rows.map(el => ({
          label: el.skuCus,
          value: el.variantId
        }))
      })
    },
    changeItem(type, val, data) {
      // console.log(type);

      if (type == 'platform') {
        if (!val || !val.length) {
          this.$store.commit('finance/setMerchantList', { rows: [], type: 1 })
          return
        }
        this.$set(data, 'siteIds', [])
        this.$set(data, 'storeIds', [])
        this.getMerchantList({ type: 1, params: { platformIds: val } })
      }
      if (type == 'siteId') {
        if (!val || !val.length) {
          this.$store.commit('finance/setMerchantList', { rows: [], type: 2 })
          return
        }
        this.$set(data, 'storeIds', [])
        this.getMerchantList({ type: 2, params: { siteIds: val } })
      }
    },
    setUrl() {
      let vm = this
      this.getMerchantList({ type: 0 }).then(() => {
        this.config.searchConfig[0].children = this.platformList
      })

      if (this.$route.query.title == '店铺费用') {
        // 店铺费用详情
        this.config.url = 'finance/financeBooksShopCostDetailPage'

        this.config.btnConfig[0].fn = () => {
          this.$api[`finance/financeBooksShopCostDetailExport`]({
            type: this.$route.query.type,
            ...this.$refs.page.getSearchData()
          })
            .then(row => {
              downloadFile(row.path)
            })
            .catch(() => {})
        }

        this.config.searchConfig = [
          {
            placeholder: '订单来源店铺',
            style: {
              width: '130px'
            },
            value: 'storeIds',
            type: 'multiple',
            children: vm.storeList
          },
          {
            style: {
              width: '300px'
            },
            placeholder: '统计时间',
            value: 'time',
            type: 'time'
          }
        ]

        this.config.tableConfig = [
          {
            label: '时间',
            value: 'chargeTime'
          },
          {
            label: '店铺名称',
            value: 'storeName'
          },
          {
            label: '费用',
            value: 'subscriptionFeeRmbStr',
            sortable: true
          }
        ]
      }
      if (this.$route.query.title == '运输成本') {
        // 运输成本
        this.getWarehouse(0)
        this.getMerchantList(2)
        this.config.url = 'finance/financeBooksTransportDetailPage'

        this.config.btnConfig[0].fn = () => {
          this.$api[`finance/financeBooksTransportDetailExport`]({
            type: this.$route.query.type,
            ...this.$refs.page.getSearchData()
          })
            .then(row => {
              downloadFile(row.path)
            })
            .catch(() => {})
        }

        this.config.searchConfig = [
          {
            placeholder: '订单来源店铺',
            style: {
              width: '130px'
            },
            value: 'storeIds',
            type: 'multiple',
            children: vm.storeList
          },
          {
            placeholder: '发货仓库',
            style: {
              width: '130px'
            },
            value: 'storeIds',
            type: 'multiple',
            children: vm.warehouseList
          }
        ]

        this.config.tableConfig = [
          {
            label: '时间',
            value: 'orderTime'
          },
          {
            label: '订单来源店铺',
            value: 'storeName'
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
            label: '发货仓库',
            value: 'warehouseName'
          },
          {
            label: '运输费用',
            value: 'amount'
          }
        ]
      }
    }
  }
}
</script>

<style lang='scss'>
.purchase-contract {
  background: #fff;
  padding: 12px;
}
.appMain > div {
  padding: 0 !important;
}
</style>