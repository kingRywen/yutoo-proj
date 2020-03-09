<template>
  <div class="contract-template">
    <t-page :config="config" ref="page"></t-page>
    <t-dialog ref="dialog"></t-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { mixin } from './mixins'
export default {
  mixins: [mixin],
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      config: {
        url: 'finance/financeContractModelList',
        id: 'contractModelId',
        selectData: [],
        searchConfig: [
          {
            label: '合同名称',
            value: 'modelName',
            type: 'input'
          },
          {
            label: '模板类型',
            value: 'modelType',
            type: 'select',
            children: []
          }
        ],
        btnConfig: [
          {
            name: '添加',
            fn: () => {
              vm.openDialog('添加模板')
              //
            }
          },
          {
            name: '删除',
            fn: () => {
              return vm.handleDelete(vm.config.selectData)
            }
          }
        ],
        tableConfig: [
          {
            label: '操作',
            width: 100,
            btns: [
              {
                name: '编辑',
                icon: 'el-icon-edit-outline',
                fn(index, row) {
                  let companyLogoList = []
                  if (
                    row.companyLogoList &&
                    !vm.utils.isEmpty(row.companyLogoList)
                  ) {
                    companyLogoList = row.companyLogoList.map(item => {
                      return {
                        ossUrl: item
                      }
                    })
                  }
                  vm.openDialog('编辑模板', {
                    contractModelId: row.contractModelId,
                    companyLogoList
                  })
                }
              },
              {
                name: '删除',
                icon: 'el-icon-delete',
                fn(index, row) {
                  return vm.handleDelete([row])
                }
              },
              {
                name: '预览',
                icon: 'el-icon-view',
                fn(index, row) {
                  vm.handleView(row)
                }
              },
              {
                name: '复制添加',
                icon: 'anticon anticon-copy',
                fn(index, row) {
                  let companyLogoList = []
                  if (vm.utils.isArrLength(row.companyLogoList)) {
                    companyLogoList = row.companyLogoList.map(item => {
                      return {
                        ossUrl: item
                      }
                    })
                  }

                  vm.openDialog('复制添加', {
                    contractModelId: row.contractModelId,
                    copy: true,
                    companyLogoList
                  })
                }
              }
            ]
          },
          {
            label: '模板名称',
            value: 'modelName'
          },
          {
            label: '模板类型',
            value: 'modelTypeName'
          },
          {
            label: '合同编号规则',
            value: 'contractNumberRuleName'
          },
          {
            label: '添加时间',
            value: 'createTime'
          },
          {
            label: '修改时间',
            value: 'modifyTime'
          },
          {
            label: '备注',
            value: 'modelRemark'
          }
        ]
      }
    }
  },
  created() {
    this.getGlobalSelect([10])
    this.getFinanceContractRuleGetComboBox()
  },
  mounted() {},
  watch: {
    modelTypeList(val) {
      if (val) {
        this.$set(this.config.searchConfig[1], 'children', val)
      }
    }
  },
  computed: {
    ...mapState('finance', ['modelTypeList', 'financeContractRuleGetComboBox'])
  },
  methods: {
    ...mapActions('finance', [
      'getGlobalSelect',
      'getFinanceContractRuleGetComboBox'
    ]),
    // 添加，编辑，复制添加
    openDialog(title, params = false) {
      let vm = this
      vm.$refs.page.$dialog({
        title,
        width: '800px',
        component: () => import('./addTemplate'),
        visible: true,
        childFn: [
          {
            name: 'edit',
            params
          }
        ],
        footBtns: [
          {
            name: '预览',
            value: 'view'
          },
          {
            name: '保存',
            value: 'submit'
          }
        ]
      })
    },
    // 删除
    handleDelete(arr) {
      let contractModelIds = arr.map(item => item.contractModelId)
      return {
        url: 'finance/financeContractModelRemove',
        params: {
          contractModelIds: arr.map(item => item.contractModelId)
        },
        selectOptions: {
          ids: contractModelIds
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.contract-template {
  background: #fff;
  .anticon-copy {
    font-size: 18px;
  }
}
</style>