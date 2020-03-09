export default [
  {
    name: 'taskSourceOrderList',
    method: 'POST',
    mock: true,
    desc: '订单列表',
    path: 'taskSource/orderList'
  },
  {
    name: 'taskSourceAudit',
    method: 'POST',
    mock: true,
    showSuccess: true,
    desc: '任务审核',
    path: 'taskSource/audit'
  },
  {
    name: 'taskSourceBatchAudit',
    method: 'POST',
    mock: true,
    showSuccess: true,
    desc: '任务批量审核',
    path: 'taskSource/batchAudit'
  },
  {
    name: 'taskSourceStopReturnMoney',
    method: 'POST',
    desc: '中止任务获取返还金额接口',
    path: 'taskSource/stop/returnMoney'
  },
  {
    name: 'taskSourceCauseList',
    method: 'POST',
    mock: true,
    desc: '任务源审核不通过原因列表',
    path: 'taskSource/causeList'
  },
  {
    name: 'taskSourceFeedbackSave',
    method: 'POST',
    mock: true,
    desc: '任务源反馈回复',
    showSuccess: true,
    path: 'taskSource/feedbackSave'
  },
  {
    name: 'taskSourceList',
    method: 'POST',
    mock: true,
    desc: '任务源列表',
    path: 'taskSource/list'
  },
  {
    name: 'taskSourceFeedbackList',
    method: 'POST',
    mock: true,
    desc: '任务反馈记录列表',
    path: 'taskSource/feedbackList'
  },
  {
    name: 'taskSourceStop',
    method: 'POST',
    mock: true,
    desc: '终止任务',
    showSuccess: true,
    path: 'taskSource/stop'
  },
  {
    name: 'taskSourceInfo',
    method: 'POST',
    mock: true,
    desc: '任务详情页',
    path: 'taskSource/info'
  },
  {
    name: 'taskSourceAuditCause',
    method: 'POST',
    mock: true,
    desc: '任务源列表审核不通过原因',
    path: 'taskSource/auditCause'
  },
  {
    name: 'taskSourceOrderFee',
    method: 'POST',
    mock: true,
    desc: '实付金额列表',
    path: 'taskSource/orderFee'
  },
  {
    name: 'taskSourceUpdate',
    method: 'POST',
    mock: true,
    desc: '编辑任务(代理端只能编辑评价)',
    showSuccess: true,
    path: 'taskSource/update'
  },
  {
    name: 'taskSourceExportTemplate',
    method: 'POST',
    desc: '下载评价模版',
    type: 'formdata',
    config: {
      responseType: 'blob'
    },
    showSuccess: true,
    path: 'taskSource/exportTemplate'
  },
  {
    name: 'taskSourceReplyRemove',
    method: 'POST',
    mock: true,
    desc: '反馈回复删除',
    showSuccess: true,
    path: 'taskSource/replyRemove'
  },
  {
    name: 'taskSourceImport',
    method: 'POST',
    mock: true,
    desc: '任务评价导入',
    showSuccess: true,
    path: 'taskSource/import'
  },
  {
    name: 'taskSourceBrokerage',
    method: 'POST',
    // mock: true,
    singleLoading: true,
    desc: '佣金编辑展示',
    path: 'taskSource/brokerage'
  },
  {
    name: 'taskSourceBrokerageUpdate',
    method: 'POST',
    // mock: true,
    desc: '佣金编辑',
    showSuccess: true,
    path: 'taskSource/brokerageUpdate'
  },
  {
    name: 'taskSourceUnAllotList',
    method: 'POST',
    // mock: true,
    desc: '分配任务列表',
    path: 'taskSource/unAllotList'
  },
  {
    name: 'taskSourceAllot',
    method: 'POST',
    // mock: true,
    // showSuccess: true,
    desc: '任务源分配任务',
    path: 'taskSource/allot'
  },
  {
    name: 'taskAllotTaskTypeList',
    method: 'POST',
    // mock: true,
    // showSuccess: true,
    desc: '操作员搜索任务类型下拉',
    path: 'TaskAllot/taskTypeList'
  },
  {
    name: 'taskSourceStopCause',
    method: 'POST',
    // mock: true,
    // showSuccess: true,
    desc: '中止原因列表',
    path: 'taskSource/stopCause'
  },
  {
    name: 'taskAllotTaskList',
    method: 'POST',
    // mock: true,
    // showSuccess: true,
    desc: '操作员任务列表',
    path: 'TaskAllot/taskList'
  },
  {
    name: 'recycleCauseList',
    method: 'POST',
    // mock: true,
    // showSuccess: true,
    desc: '出库审核不通过原因列表',
    path: 'recycle/causeList'
  },
  {
    name: 'taskSourceReFilterAccount',
    method: 'POST',
    // mock: true,
    showSuccess: true,
    desc: '重新筛选帐号',
    path: 'taskSource/reFilterAccount'
  },
  {
    name: 'taskSourceExceptionList',
    method: 'POST',
    desc: '任务异常列表',
    path: 'taskSource/exceptionList'
  },
  {
    name: 'merchantInvite',
    method: 'POST', showSuccess: true,
    desc: '邀请',
    path: 'Merchant/invite'
  }
]
