export default [
  // 中差评处理
  {
    name: 'ebayEvaluateList',
    method: 'POST',
    desc: '中差评处理-列表',
    path: '/ebay/evaluate/list',
    mockPath: '/ebay/evaluate/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'ebayEvaluateAppend',
    method: 'POST',
    desc: '中差评处理-追加评价',
    path: '/ebay/evaluate/append',
    mockPath: '/ebay/evaluate/append',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayEvaluateSaveRemark',
    method: 'POST',
    desc: '中差评处理-添加差评备注',
    path: '/ebay/evaluate/saveRemark',
    mockPath: '/ebay/evaluate/saveRemark',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayEvaluateExport',
    method: 'POST',
    desc: '中差评处理-导出',
    path: '/ebay/evaluate/export',
    mockPath: '/ebay/evaluate/export',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayEvaluateSync',
    method: 'POST',
    desc: '中差评处理-同步',
    path: '/ebay/evaluate/sync',
    mockPath: '/ebay/evaluate/sync',
    showSuccess: true,
    mock: false,
    params: {}
  },
  // 争议处理
  {
    name: 'ebayDisputeList',
    method: 'POST',
    desc: '争议处理-列表',
    path: '/ebay/dispute/list',
    mockPath: '/ebay/dispute/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDisputeSync',
    method: 'POST',
    desc: '争议处理-同步',
    path: '/ebay/dispute/sync',
    mockPath: '/ebay/dispute/sync',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDisputeExport',
    method: 'POST',
    desc: '争议处理-导出',
    path: '/ebay/dispute/export',
    mockPath: '/ebay/dispute/export',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDisputeSaveRemark',
    method: 'POST',
    desc: '争议处理-添加备注',
    path: '/ebay/dispute/saveRemark',
    mockPath: '/ebay/dispute/saveRemark',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDisputeSetReplyState',
    method: 'POST',
    desc: '争议处理-设置回复状态',
    path: '/ebay/dispute/setReplyState',
    mockPath: '/ebay/dispute/setReplyState',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDisputeHandleUnpaidDispute',
    method: 'POST',
    desc: '争议处理-处理未付款个案',
    path: '/ebay/dispute/handle/unpaid/dispute',
    mockPath: '/ebay/dispute/handle/unpaid/dispute',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDisputeHandleDispute',
    method: 'POST',
    desc: '争议处理-处理个案',
    path: '/ebay/dispute/handle/dispute',
    mockPath: '/ebay/dispute/handle/dispute',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDisputeInfo',
    method: 'POST',
    desc: '争议处理-详情',
    path: '/ebay/dispute/info',
    mockPath: '/ebay/dispute/info',
    showSuccess: false,
    mock: false,
    params: {}
  },
  //  退换货请求列表
  {
    name: 'ebayReturnSync',
    method: 'POST',
    desc: '退换货请求列表-同步',
    path: '/ebay/return/sync',
    mockPath: '/ebay/return/sync',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayReturnExport',
    method: 'POST',
    desc: '退换货请求列表-导出',
    path: '/ebay/return/export',
    mockPath: '/ebay/return/export',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayReturnList',
    method: 'POST',
    desc: '退换货请求列表-列表',
    path: '/ebay/return/list',
    mockPath: '/ebay/return/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'ebayReturnHandle',
    method: 'POST',
    desc: '退换货请求列表-处理',
    path: '/ebay/return/handle',
    mockPath: '/ebay/return/handle',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayReturnSaveRemark',
    method: 'POST',
    desc: '退换货请求列表-添加差评备注',
    path: '/ebay/return/saveRemark',
    mockPath: '/ebay/return/saveRemark',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayReturnProductList',
    method: 'POST',
    desc: '退换货请求列表-查看产品列表',
    path: '/ebay/return/product/list',
    mockPath: '/ebay/return/product/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'ebayReturnInfo',
    method: 'POST',
    desc: '退换货请求列表-详情',
    path: '/ebay/return/info',
    mockPath: '/ebay/return/info',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'ebayReturnStateList',
    method: 'POST',
    desc: '退换货请求列表-退货状态列表',
    path: '/ebay/return/state/list',
    mockPath: '/ebay/return/state',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'ebayReturnReasonList',
    method: 'POST',
    desc: '退换货请求列表-退货原因列表',
    path: '/ebay/return/reason/list',
    mockPath: '/ebay/return/reason',
    showSuccess: false,
    mock: false,
    params: {}
  },
  // 取消交易列表
  {
    name: 'ebayDealCancelSync',
    method: 'POST',
    desc: '取消交易列表-同步',
    path: '/ebay/deal/cancel/sync',
    mockPath: '/ebay/deal/cancel/sync',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDealCancelExport',
    method: 'POST',
    desc: '取消交易列表-导出',
    path: '/ebay/deal/cancel/export',
    mockPath: '/ebay/deal/cancel/export',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDealCancelList',
    method: 'POST',
    desc: '取消交易列表-列表',
    path: '/ebay/deal/cancel/list',
    mockPath: '/ebay/deal/cancel/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'ebayDealCancelHandle',
    method: 'POST',
    desc: '取消交易列表-处理',
    path: '/ebay/deal/cancel/handle',
    mockPath: '/ebay/deal/cancel/handle',
    showSuccess: true,
    mock: false,
    params: {}
  },
  apiFormat('ebayDealCancelReasonList', '取消交易列表-列表', false),
  apiFormat('ebayUnpaidDisputeReasonsList', '未付款发起的争议-列表', false),

  // 未付款发起的争议
  apiFormat('ebayUnpaidDisputeSync', '未付款发起的争议-同步'),
  apiFormat('ebayUnpaidDisputeList', '未付款发起的争议-列表', false),
  apiFormat('ebayUnpaidDisputeExport', '未付款发起的争议-导出'),
  apiFormat(
    'ebayUnpaidDisputeHandle',
    '未付款发起的争议-处理(批量开为付款case状态)'
  ),
  apiFormat(
    'ebayUnpaidDisputeProductList',
    '未付款发起的争议-查看产品列表',
    false
  )
]

function apiFormat(name, desc, showSuccess = true, mock = false) {
  let formatPath = function(name) {
    let str = name.replace(/[A-Z]/g, function(word) {
      return '/' + word.toLowerCase()
    })
    let reg = /^\//g
    if (!reg.test(str)) {
      str = '/' + str
    }
    return str
  }
  return {
    name,
    desc,
    method: 'POST',
    showSuccess,
    mock,
    path: formatPath(name),
    mockPath: formatPath(name),
    params: {}
  }
}
