<template>
  <div class="receiving-account-manager">
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
        url: 'finance/financePaymentAccountList',
        id: 'paymentAccountId',
        selectData: [],
        moreParams: {},
        searchConfig: [
          {
            label: '账号',
            value: 'account',
            type: 'input'
          },
          {
            label: '添加时间',
            value: 'time',
            type: 'time'
          },
          {
            placeholder: '持卡人姓名',
            value: 'cardName',
            type: 'input'
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
          },
          {
            placeholder: '支付方式',
            value: 'paymentMode',
            type: 'select',
            children: []
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
                      paymentAccountId: row.paymentAccountId
                    },
                    true
                  )
                }
              },
              {
                name: '查看',
                icon: 'el-icon-view',
                fn(index, row) {
                  vm.openDialog('查看', {
                    paymentAccountId: row.paymentAccountId,
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
            label: '账号',
            value: 'account'
          },
          {
            label: '支付方式',
            value: 'paymentModeName'
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
    this.getGlobalSelect([11])
  },
  computed: {
    ...mapState('finance', ['paymentModeList'])
  },
  watch: {
    paymentModeList(val) {
      if (val) {
        this.$set(this.config.searchConfig[4], 'children', val)
      }
    }
  },
  methods: {
    ...mapActions('finance', ['getGlobalSelect']),
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
      let paymentAccountIds = arr.map(item => item.paymentAccountId)
      return {
        url: 'finance/financePaymentAccountRemove',
        params: {
          paymentAccountIds
        },
        selectOptions: {
          ids: paymentAccountIds
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.receiving-account-manager {
  background: #fff;
}
</style>