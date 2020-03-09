<template>
  <div class="cost-type">
    <t-page :config="config" ref="page"></t-page>
  </div>
</template>

<script>
import { downloadFile } from 'Utils/tools'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      config: {
        url: 'finance/financeCostTypePage',
        id: 'costSign',
        selectData: [],
        moreParams: {},
        searchForm(val) {
          if (vm.utils.isArrLength(val.createTime)) {
            val.createStartTime = val.createTime[0]
            val.createEndTime = val.createTime[1]
            delete val.createTime
          }
          return val
        },
        searchConfig: [
          {
            placeholder: '类型名称',
            value: 'costTypeName',
            type: 'input'
          },
          {
            placeholder: '是否启用',
            value: 'displayFlag',
            type: 'select',
            children: [
              {
                label: '是',
                value: 1
              },
              {
                label: '否',
                value: 0
              }
            ]
          },
          {
            label: '添加时间',
            value: 'createTime',
            type: 'time'
          },
          {
            label: '应用平台',
            value: 'platformIds',
            type: 'multiple',
            children: []
          },
          {
            placeholder: '是否纳入利润统计',
            value: 'calculateFlag',
            type: 'select',
            children: [
              {
                label: '是',
                value: 1
              },
              {
                label: '否',
                value: 0
              }
            ]
          },
          {
            placeholder: '是否需要导入成本',
            value: 'importFlag',
            type: 'select',
            children: [
              {
                label: '是',
                value: 1
              },
              {
                label: '否',
                value: 0
              }
            ]
          }
        ],
        btnConfig: [
          {
            name: '添加',
            fn: () => {
              vm.openDialog('添加成本类型')
            }
          },
          {
            name: '删除',
            fn: () => {
              let costSignList = vm.config.selectData.map(item => item.costSign)
              return {
                url: 'finance/financeCostTypeBatchRemove',
                params: {
                  costSignList
                },
                selectOptions: {
                  ids: costSignList
                }
              }
            }
          },
          {
            name: '导出',
            fn: () => {
              let costSignList = vm.config.selectData.map(item => item.costSign)
              return {
                url: 'finance/financeCostTypeListExport',
                params: {
                  costSignList
                },
                refreshList: false,
                fn({ path = '' }) {
                  downloadFile(path)
                }
              }
            }
          },
          {
            name: '批量纳入利润统计',
            fn: () => {
              return vm.batchCalculate(1)
            }
          },
          {
            name: '批量取消纳入利润统计',
            fn: () => {
              return vm.batchCalculate(0)
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
                  vm.openDialog('编辑成本类型', {
                    costSign: row.costSign,
                    flag: row.flag
                  })
                }
              },
              {
                name: '删除',
                icon: 'el-icon-delete',
                show(scope) {
                  return scope.row.flag == 0 ? true : false
                },
                fn(index, row) {
                  return {
                    url: 'finance/financeCostTypeBatchRemove',
                    params: {
                      costSignList: [row.costSign]
                    }
                  }
                }
              }
            ]
          },
          {
            label: '类型名称',
            value: 'costTypeName'
          },
          {
            label: '自定义名称',
            value: 'costTypeCusName',
            width: 120
          },
          {
            label: '展示',
            value: 'displayFlag',
            render(h, scope) {
              if (scope.row.displayFlag == 1) {
                return <span>是</span>
              } else {
                return <span>否</span>
              }
            }
          },
          {
            label: '是否纳入利润统计',
            value: 'calculateFlagStr',
            width: 120
          },
          {
            label: '应用平台',
            value: 'platformStr',
            width: 120
          },
          {
            label: '添加人',
            value: 'creatorName'
          },
          {
            label: '是否需要导入成本',
            value: 'importFlagStr',
            width: 120
          },
          {
            label: '添加时间',
            value: 'createTime',
            width: 130
          },
          {
            label: '备注',
            value: 'remark',
            width: 130
          }
        ],
        clickBtn(val) {
          console.log(val)
        }
      }
    }
  },
  mounted() {},
  created() {
    this.getPlatformActiveList()
  },
  watch: {
    platformActiveList(val) {
      if (val) {
        this.config.searchConfig[3].children = val
      }
    }
  },
  computed: {
    ...mapState('common', ['platformActiveList'])
  },
  methods: {
    ...mapActions('common', ['getPlatformActiveList']),
    openDialog(title, params) {
      let vm = this
      vm.$refs.page.$dialog({
        title,
        width: '500px',
        visible: true,
        component: () => import('./addCostType'),
        childFn: [
          {
            name: 'edit',
            params
          }
        ]
      })
    },
    batchCalculate(calculateFlag) {
      let vm = this
      let costSignList = vm.config.selectData.map(item => item.costSign)
      return {
        url: 'finance/financeCostTypeBatchCalculateEdit',
        params: {
          costSignList,
          calculateFlag
        },
        selectOptions: {
          ids: costSignList
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.cost-type {
  background: #fff;
}
</style>