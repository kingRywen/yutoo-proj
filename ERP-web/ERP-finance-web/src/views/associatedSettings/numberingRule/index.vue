<template>
  <div class="numbering-rule">
    <t-page :config="config" ref="page"></t-page>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      config: {
        url: 'finance/financeContractRuleList',
        id: 'contractNumberRuleId',
        selectData: [],
        searchConfig: [
          {
            label: '编号规则名称',
            value: 'ruleName',
            type: 'input'
          },
          {
            label: '添加人',
            value: 'creatorId',
            type: 'select',
            filterable: true,
            children: []
          },
          {
            label: '添加时间',
            value: 'time',
            type: 'time'
          }
        ],
        btnConfig: [
          {
            name: '添加',
            fn: () => {
              vm.openDialog('添加规则')
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
            btns: [
              {
                name: '编辑',
                icon: 'el-icon-edit-outline',
                fn(index, row) {
                  vm.openDialog('编辑规则', {
                    contractNumberRuleId: row.contractNumberRuleId
                  })
                }
              },
              {
                name: '删除',
                icon: 'el-icon-delete',
                fn(index, row) {
                  return vm.handleDelete([row])
                }
              }
            ]
          },
          {
            label: '编号规则名称',
            value: 'ruleName'
          },
          {
            label: '编号规则',
            value: 'ruleInfo'
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
            value: 'ruleRemark'
          }
        ],
        clickBtn(val) {
          console.log(val)
        }
      }
    }
  },
  created() {
    this.getOperator([2])
  },
  watch: {
    rtHandleOperator(val) {
      if (val) {
        this.$set(this.config.searchConfig[1], 'children', val)
      }
    }
  },
  computed: {
    ...mapState('finance', ['rtHandleOperator'])
  },
  methods: {
    ...mapActions('finance', ['getOperator']),
    openDialog(title, params) {
      let vm = this
      vm.$refs.page.$dialog({
        title,
        width: '600px',
        visible: true,
        component: () => import('./addRule'),
        childFn: [
          {
            name: 'edit',
            params
          }
        ]
      })
    },
    // 删除
    handleDelete(arr) {
      let contractNumberRuleIds = arr.map(item => item.contractNumberRuleId)
      return {
        url: 'finance/financeContractRuleRemove',
        params: {
          contractNumberRuleIds
        },
        selectOptions: {
          ids: contractNumberRuleIds
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.numbering-rule {
  background: #fff;
}
</style>