<template>
  <div class="view-all-cost">
    <t-page :searchFlag="false" :config="config" ref="pages" :pagination="false"></t-page>
  </div>
</template>

<script>
export default {
  props: ['productId'],
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      config: {
        url: 'finance/financeProductCostTypeAllList',
        selectData: [],
        moreParams: {
          productId: vm.productId
        },
        searchConfig: [],
        btnConfig: [
          {
            name: '添加',
            fn: val => {
              console.log(val)
              vm.openDialog('添加商品费用详情', {
                productIds: [vm.productId]
              })
            }
          },
          {
            name: '删除',
            fn: val => {
              console.log(val)
              return vm.handleDelete(vm.config.selectData)
            }
          }
        ],
        tableConfig: [
          {
            label: '操作',
            btns: [
              {
                name: '编辑',
                icon: 'el-icon-edit-outline',
                fn(index, row) {
                  console.log(index, row)
                  vm.openDialog('编辑商品费用详情', {
                    dataId: row.dataId,
                    productId: vm.productId
                  })
                }
              },
              {
                name: '删除',
                icon: 'el-icon-delete',
                fn(index, row) {
                  console.log(index, row)
                  return vm.handleDelete([row])
                }
              },
              {
                name: '复制添加',
                icon: 'anticon anticon-copy',
                fn(index, row) {
                  vm.openDialog('复制添加商品费用详情', {
                    dataId: row.dataId,
                    productIds: [row.productId],
                    copy: true
                  })
                }
              }
            ]
          },
          {
            label: '时间',
            value: 'startTime'
          }
        ],
        clickBtn(val) {
          console.log(val)
        }
      }
    }
  },
  async created() {
    let vm = this
    await vm.$api[`finance/financeProductCostTypeField`]({}).then(
      ({ rows = [] }) => {
        vm.config.tableConfig.push(
          ...rows.map(item => {
            return {
              label: item.name,
              value: item.fieldName
            }
          })
        )
      }
    )
  },
  methods: {
    openDialog(title, params = false) {
      this.$refs.pages.$dialog({
        title,
        width: '500px',
        visible: true,
        component: () => import('./addCost'),
        childFn: [
          {
            name: 'edit',
            params
          }
        ]
      })
    },
    handleDelete(arr) {
      let dataIds = arr.map(item => item.dataId)
      return {
        url: 'finance/financeProductCostTypeDataBatchRemove',
        params: {
          dataIds
        },
        selectOptions: {
          ids: dataIds
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.view-all-cost {
  background: #fff;
}
</style>