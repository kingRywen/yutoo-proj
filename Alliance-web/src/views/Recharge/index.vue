<template>
  <NewMainLayout
    ref="layout"
    url="main/merchantPayList"
    :edit-btns="edits"
    editWidth="90px"
    :btnFn="btnFn"
    :searchFields="searchFields"
    :columns="columns"
  ></NewMainLayout>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          label: '充值编号',
          value: 'merchantPayId',
          width: 72
        },
        {
          label: '商户邮箱',
          noTooltip: true,
          value: 'email',
          minWidth: 130
        },
        {
          label: '充值金额$',
          value: 'money',
          width: 80
        },
        {
          label: '应付金额',
          value: 'shouldPay',
          render(h, scope) {
            return scope.row.shouldPay ? (
              <span>
                {scope.row.shouldPayCurrency == 'CNY' ? '￥' : '$'}
                {scope.row.shouldPay}
              </span>
            ) : (
              <span>-</span>
            )
          },
          minWidth: 60
        },
        {
          label: '实付金额',
          value: 'realPay',
          render(h, scope) {
            return scope.row.realPay ? (
              <span>
                {scope.row.realPayCurrency == 'CNY' ? '￥' : '$'}
                {scope.row.realPay}
              </span>
            ) : (
              <span>-</span>
            )
          },
          minWidth: 60
        },
        {
          label: '充值类型',
          value: 'type',
          _enum: ['充值', '系统返还'],
          width: 80
        },
        {
          label: '发起方',
          value: 'initiator',
          _enum: ['系统', '商户'],
          width: 60
        },
        {
          label: '充值时间',
          value: 'payTime',
          width: 150
        },
        {
          type: 'array',

          children: [
            {
              label: '支付姓名',
              value: 'payer',
              minWidth: 120
            },
            {
              label: '支付账号',
              value: 'payAccount',
              minWidth: 80
            }
          ]
        },
        {
          label: '留言',
          noTooltip: true,
          value: 'leaveWord',
          minWidth: 80
        },
        {
          type: 'array',
          children: [
            {
              label: '充值方式',
              value: 'payTypeName'
            },
            {
              label: '收款账号',
              value: 'recipientAccount'
            }
          ]
        },
        {
          label: '审核状态',
          value: 'auditStatus',
          render: (h, scope) => {
            let text = ['待审核', '已通过', '审核不通过', '已作废']
            const { auditStatus } = scope.row
            return auditStatus == 2 ? (
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                on-show={() => {
                  if (!scope.row.fetching) {
                    this.getCause(scope.row)
                  }
                }}
              >
                <div vLoading={!scope.row._cause}>{scope.row._cause}</div>
                <span
                  style="cursor: pointer; height: 100%;vertical-align: middle;"
                  slot="reference"
                  class="danger"
                >
                  <i
                    style="vertical-align: middle;"
                    class="el-icon-warning danger"
                  ></i>{' '}
                  <span style="vertical-align: middle;">
                    {text[auditStatus]}
                  </span>
                </span>
              </el-popover>
            ) : (
              <span>{text[auditStatus] || '-'}</span>
            )
          }
          // _enum: ['待审核', '已通过', '审核不通过', '已作废']
        },
        {
          label: '审核意见',
          noTooltip: true,
          value: 'auditExplain',
          minWidth: 200
        }
      ],
      searchFields: {
        email: {
          label: '商户邮箱'
        },
        merchantPayId: {
          label: '充值编号'
        },
        type: {
          label: '充值类型',
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
          ]
        },
        initiator: {
          label: '发起方',
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
          ]
        },
        auditStatus: {
          label: '审核状态',
          widget: 'select',
          options: [
            //  0-待审核 1-已通过 2-审核不通过 3-已作废
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
        },
        payType: {
          widget: 'select',
          label: '充值方式',
          options: () =>
            this.$api[`main/paySetPayType`]().then(data => {
              return Object.keys(data.rows).map(key => ({
                label: data.rows[key],
                value: +key
              }))
            })
        },
        recipientAccount: {
          label: '收款账号'
        }
      },
      edits: [
        {
          name: '审核',
          fn: scope => {
            this.$dialog({
              size: 'small',
              title: '充值审核',
              params: {
                type: 'recharge',
                taskSourceId: scope.row.merchantPayId,
                currency: scope.row.shouldPayCurrency
              },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('Views/Task/Source/dialogs/audit.vue')
            })
          }
        }
      ]
    }
  },
  methods: {
    btnFn(row) {
      let btn = []
      if (row.auditStatus == 0) {
        btn.push(0)
      }
      return btn
    },
    getCause(row) {
      this.$set(row, 'fetching', true)
      this.$api[`main/merchantPayAuditCause`]({
        merchantPayId: row.merchantPayId
      })
        .then(data => {
          this.$set(row, 'fetching', false)
          this.$set(row, '_cause', data.rows.noPassCause)
        })
        .catch(() => {
          this.$set(row, 'fetching', false)
        })
    }
  }
}
</script>