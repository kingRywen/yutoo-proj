<template>
  <div class="product-type">
    <t-page
      :config="config"
      :dynamicSearch="dynamicSearch"
      :rightCostom="true"
      ref="page"
      :productId="productId"
      @sortChange="sortChange"
      :leftCustom="true"
    ></t-page>
  </div>
</template>

<script>
export default {
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      dynamicSearch: [],
      config: {
        url: 'finance/financeProductCostTypePage',
        id: 'productId',
        selectData: [],
        moreParams: {},
        searchForm(val) {
          for (const key in val) {
            if (val.hasOwnProperty(key)) {
              const element = val[key]
              if (key.indexOf('field') >= 0) {
                console.log(element)
                val[key + 'Start'] = element[0] == '' ? undefined : +element[0]
                val[key + 'End'] = element[1] == '' ? undefined : +element[1]
                delete val[key]
              }
            }
          }
          return val
        },
        searchConfig: [
          {
            label: '仓库SKU',
            value: 'productId',
            type: 'remote',
            url: 'finance/financeBooksVariantSkuList'
          }
        ],
        btnConfig: [
          {
            name: '导入商品费用',
            fn: () => {
              vm.$refs.page.$dialog({
                title: '导入商品费用',
                width: '500px',
                visible: true,
                footBtns: [
                  {
                    name: '关闭',
                    value: 'cancel'
                  }
                ],
                component: () => import('./handleTemplate')
              })
            }
          },
          {
            name: '导入日志',
            fn: () => {
              vm.$router.push({
                path: '/finance/cost/export'
              })
            }
          },
          {
            name: '删除费用',
            fn: () => {
              let productIds = vm.config.selectData.map(item => item.productId)
              return {
                url: 'finance/financeProductCostTypeBatchRemove',
                params: {
                  productIds
                },
                selectOptions: {
                  ids: productIds
                }
              }
            }
          },
          {
            name: '添加费用',
            fn: val => {
              console.log(val)
              let productIds = vm.config.selectData.map(item => item.productId)
              if (vm.$isEdit(productIds, false)) {
                return
              }
              vm.$refs.page.$dialog({
                title: '添加',
                width: '500px',
                visible: true,
                component: () => import('./addCost'),
                childFn: [
                  {
                    name: 'edit',
                    params: {
                      productIds
                    }
                  }
                ]
              })
            }
          }
        ],
        tableConfig: [],
        clickBtn(val) {
          console.log(val)
        }
      },
      productId: null
    }
  },
  created() {
    let vm = this
    vm.$api[`finance/financeProductCostTypeField`]({}).then(({ rows = [] }) => {
      vm.dynamicSearch = rows.map(item => {
        return {
          label: item.name,
          value: item.fieldName,
          type: 'extent'
        }
      })
      let tableConfig = [
        {
          label: '操作',
          btns: [
            {
              name: '查看所有成本',
              icon: 'el-icon-search',
              fn(index, row) {
                vm.productId = row.productId
                vm.$refs.page.$dialog({
                  title: '历史成本',
                  width: '1000px',
                  visible: true,
                  footBtns: [],
                  component: () => import('./viewAllCost')
                })
              }
            }
          ]
        },
        {
          label: '主图',
          type: 'img',
          style: {
            width: 30
          },
          value: 'imgUrl'
        },
        {
          label: '仓库自定义sku',
          value: 'skuCus'
        },
        {
          label: '开始时间',
          value: 'startTime',
          sortable: true,
          width: 130
        }
      ]
      tableConfig.push(
        ...rows.map(item => {
          return {
            label: item.name,
            value: item.fieldName,
            sortable: true
          }
        })
      )
      vm.$set(this.config, 'tableConfig', tableConfig)
    })
  },
  methods: {
    sortChange(val) {
      console.log(val)
    }
  },
  mounted() {}
}
</script>

<style lang='scss'>
.product-type {
  background: #fff;
}
</style>