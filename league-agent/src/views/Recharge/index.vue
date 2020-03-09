<template>
  <div>
    <div class="mb10 money-wrapper">
      <span class="text">
        当前余额：
        <span class="money">{{money}}</span>
      </span>
    </div>
    <main-layout
      :searchFields="searchFields"
      ref="layout"
      url="agent/merchantPayList"
      :columns="columns"
      :edit-btns="edits"
      edit-width="120px"
      :btnFn="btnFn"
      :right-edit-btns="editBtns"
      :searchFunc="searchFunc"
      :treeTable="false"
    ></main-layout>
  </div>
</template>
<script>
const status = [
  {
    label: '待审核',
    value: 0
  },
  {
    label: '已通过',
    value: 1
  },
  {
    label: '审核不通过',
    value: 2
  },
  {
    label: '已作废',
    value: 3
  }
]
export default {
  data() {
    return {
      money: '-',
      searchFields: {
        merchantPayId: {
          label: '充值编号',
          labelWidth: '70px'
        },
        type: {
          widget: 'select',
          options: [
            {
              label: '充值',
              value: 0
            },
            {
              label: '系统返还',
              value: 1
            }
          ],
          label: '充值类型',
          labelWidth: '70px'
        },
        initiator: {
          widget: 'select',
          options: [
            {
              label: '系统',
              value: 0
            },
            {
              label: '商户',
              value: 1
            }
          ],
          label: '发起方',
          labelWidth: '60px'
        },
        auditStatus: {
          widget: 'select',
          options: status,
          label: '审核状态',
          labelWidth: '70px'
        }
      },
      columns: [
        {
          label: '充值编号',
          value: 'merchantPayId',
          width: 80
        },
        {
          label: '充值金额 $',
          width: 100,
          value: 'money'
        },
        {
          label: '充值类型',
          width: 75,
          value: 'type',
          _enum: {
            0: '充值',
            1: '系统返还'
          }
        },
        {
          label: '发起方',
          width: 60,
          value: 'initiator',
          _enum: {
            0: '系统',
            1: '商户'
          }
        },
        {
          label: '充值时间',
          value: 'payTime',
          width: 140
        },
        {
          label: '支付姓名',
          value: 'payer'
        },
        {
          label: '支付账号',
          minWidth: 120,
          value: 'payAccount'
        },
        {
          label: '留言',
          minWidth: 80,
          value: 'leaveWord'
        },
        {
          label: '审核状态',
          width: 110,
          value: 'auditStatus',
          render: (h, scope) => {
            const list = status
            const el = list[scope.row.auditStatus]
            return (
              <span class={scope.row.auditStatus == 2 ? 'danger' : ''}>
                {scope.row.auditStatus == 2 ? (
                  <el-tooltip
                    placement="top"
                    content={scope.row.noPassCause}
                    effect="dark"
                  >
                    <div>
                      <el-button
                        class="el-icon-warning danger"
                        type="text"
                        style="margin-right:4px"
                      ></el-button>
                      <span>{el.label}</span>
                    </div>
                  </el-tooltip>
                ) : (
                  el.label
                )}
              </span>
            )
          }
        },
        // {
        //   label: '审核不通过原因',
        //   value: 'noPassCause'
        // },
        {
          label: '审核意见',
          minWidth: 250,
          noTooltip: true,
          value: 'auditExplain'
        }
      ],
      edits: [
        {
          name: '继续支付',
          fn: scope => {
            this.$dialog({
              size: 'medium',
              title: '继续支付',
              okBtnText: '确认',
              params: {
                id: scope.row.merchantPayId
              },
              cancelBtnText: '取消',
              component: () => import('./dialogs/pay.vue')
            })
          }
        },
        {
          name: '作废',
          fn: scope => {
            this.showTips({ msg: '是否作废此次充值？' }, () => {
              return this.$api[`agent/merchantPayInvalid`]({
                id: scope.row.merchantPayId
              })
            })
          }
        },
        {
          name: '删除',
          fn: scope => {
            this.showTips({ msg: '是否删除此次充值？' }, () => {
              return this.$api[`agent/merchantPayRemove`]({
                id: scope.row.merchantPayId
              })
            })
          }
        }
      ],
      editBtns: [
        {
          name: '充值',
          perm: 'charge',
          fn: () => {
            this.$dialog({
              size: 'medium',
              title: '充值支付',
              okBtnText: '确认',
              cancelBtnText: '取消',
              component: () => import('./dialogs/pay.vue')
            })
          }
        }
      ]
    }
  },
  created() {
    this.getOverage()
  },
  methods: {
    getOverage() {
      this.$api[`agent/merchantPayOverage`]({}).then(data => {
        this.money = '$' + data.rows
      })
    },
    btnFn(item) {
      if (item.auditStatus == 0 || item.auditStatus == 2) {
        return [1, 2]
      } else if (item.auditStatus == 1) {
        return []
      } else if (item.auditStatus == 3) {
        return [3]
      }
    },
    searchFunc(data) {
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
.money-wrapper {
  font-size: 14px;
  text-align: right;
  .text {
    position: relative;
    top: -8px;
  }
  .money {
    font-size: 18px;
    font-weight: bolder;
    color: $titleColor;
  }
}
</style>