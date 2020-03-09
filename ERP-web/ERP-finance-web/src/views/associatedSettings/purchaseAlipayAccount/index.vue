<template>
  <div class="purchase-alipay-account">
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
        url: 'finance/financeAlipayAccountList',
        id: 'alipayAccountId',
        selectData: [],
        moreParams: {},
        searchConfig: [
          {
            label: '支付宝账号',
            value: 'alipayAccount',
            type: 'input'
          },
          {
            label: '添加时间',
            value: 'time',
            type: 'time'
          },
          {
            placeholder: '采购人员(多选)',
            value: 'purchasersIds',
            type: 'multiple',
            children: []
          },
          {
            placeholder: '是否激活',
            value: 'activatedFlag',
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
              vm.openDialog('添加账号')
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
                  vm.openDialog(
                    '编辑账号',
                    {
                      alipayAccountId: row.alipayAccountId
                    },
                    true
                  )
                }
              },
              {
                name: '查看',
                icon: 'el-icon-view',
                fn(index, row) {
                  vm.openDialog('查看账号', {
                    alipayAccountId: row.alipayAccountId,
                    view: true
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
            label: '支付宝账号',
            value: 'alipayAccount'
          },
          {
            label: '默认采购人员',
            value: 'purchasersName',
            render(h, scope) {
              let value = ''
              if (vm.utils.isArrLength(scope.row.purchasersName)) {
                value = scope.row.purchasersName[0]
              } else {
                value = '-'
              }
              return <span>{value}</span>
            }
          },
          {
            label: '状态',
            value: 'activatedFlagName'
          },
          {
            label: '添加人',
            value: 'creatorName'
          },
          {
            label: '添加时间',
            value: 'createTime'
          },
          {
            label: '备注',
            value: 'remark'
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
        this.$set(this.config.searchConfig[2], 'children', val)
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
      let options = {
        title,
        width: '500px',
        visible: true,
        component: () => import('./addAccount'),
        childFn: [
          {
            name: 'edit',
            params
          }
        ]
      }
      if (params && params.view) {
        options.footBtns = [
          {
            name: '关闭',
            value: 'cancel'
          }
        ]
      }
      vm.$refs.page.$dialog(options)
    },
    handleDelete(arr) {
      let alipayAccountIds = arr.map(item => item.alipayAccountId)
      return {
        url: 'finance/financeAlipayAccountRemove',
        params: {
          alipayAccountIds
        },
        selectOptions: {
          ids: alipayAccountIds
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.purchase-alipay-account {
  background: #fff;
}
</style>