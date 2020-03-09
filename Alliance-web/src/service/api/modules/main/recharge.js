export default [
  {
    name: 'merchantPayCauseList',
    method: 'POST',
    mock: true,
    desc: '充值消费不通过原因列表',
    path: 'merchantPay/causeList'
  },
  {
    name: 'merchantPayList',
    method: 'POST',
    mock: true,
    desc: '列表查询',
    path: 'merchantPay/list'
  },
  {
    name: 'merchantConsumeRecordList',
    method: 'POST',
    mock: true,
    desc: '消费记录-列表查询',
    path: 'merchantConsumeRecord/list'
  },
  {
    name: 'merchantPayAudit',
    method: 'POST',
    mock: true,
    desc: '充值审核',
    showSuccess: true,
    path: 'merchantPay/audit'
  },
  {
    name: 'merchantPayAuditCause',
    method: 'POST',
    mock: true,
    singleLoading: true,
    desc: '充值审核',
    path: 'merchantPay/auditCause'
  },
  {
    name: 'paySetPayType',
    method: 'POST',
    desc: '充值方式',
    path: 'PaySet/payType'
  },
  {
    name: 'paySetList',
    method: 'POST',
    desc: '列表查询',
    singleLoading: true,
    path: 'PaySet/list'
  },
  {
    name: 'paySetInfo',
    method: 'POST',
    desc: '详情查询',
    singleLoading: true,
    path: 'PaySet/info'
  },
  {
    name: 'paySetSave',
    method: 'POST',
    desc: '新增',
    showSuccess: true,
    singleLoading: true,
    path: 'PaySet/save'
  },
  {
    name: 'paySetUpdate',
    method: 'POST',
    desc: '编辑',
    showSuccess: true,
    singleLoading: true,
    path: 'PaySet/update'
  },
  {
    name: 'paySetActivating',
    method: 'POST',
    desc: '激活',
    showSuccess: true,
    path: 'PaySet/activating'
  },
  {
    name: 'paySetRemove',
    method: 'POST',
    desc: '删除',
    showSuccess: true,
    path: 'PaySet/remove'
  },
]