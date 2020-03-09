import assSetting from './assSetting'
import accountBook from './accountBook'
import costManager from './costManager'
export default [
  {
    name: 'financeGlobalSelect',
    method: 'POST',
    desc: 'FG1-下拉值获取接口(枚举)',
    path: '/finance/global/select',
    params: {}
  },
  {
    name: 'financeBooksAccountGet',
    method: 'POST',
    desc: '根据账号类型获取账号',
    path: '/finance/books/account/get',
    params: {}
  },
  {
    name: 'financeOperatorType',
    method: 'POST',
    desc: 'FG2-获取操作人员',
    path: '/finance/operator/type',
    params: {}
  },
  {
    name: 'financePurchaseList',
    method: 'POST',
    desc: 'FG3-获取采购单',
    path: '/finance/purchase/list',
    params: {}
  },
  {
    name: 'financePurchaseAdd',
    method: 'POST',
    desc: 'FG4-添加关联采购单',
    path: '/finance/purchase/add',
    params: {}
  },
  {
    name: 'financeRepaymentLoanList',
    method: 'POST',
    desc: '获取借款单',
    path: '/finance/repayment/loan/list',
    params: {}
  },
  {
    name: 'financeRepaymentLoanAdd',
    method: 'POST',
    desc: '关联借款单',
    path: '/finance/repayment/loan/add',
    params: {}
  },
  {
    name: 'financePaymentAccountNumber',
    method: 'POST',
    desc: '获取账号',
    path: '/finance/payment/account/getComboBox',
    params: {}
  },
  {
    name: 'financeGlobalFilePath',
    method: 'POST',
    desc: 'FG5-获取上传路径',
    path: '/finance/global/file/path',
    params: {}
  },
  //财务日常操作 ===>借款管理
  {
    name: 'financeLoanList',
    method: 'POST',
    desc: '借款管理-列表',
    path: '/finance/loan/list',
    params: {}
  },
  {
    name: 'financeLoanRemove',
    method: 'POST',
    desc: '借款管理-列表',
    path: '/finance/loan/remove',
    params: {}
  },
  {
    name: 'financeLoanExamine',
    method: 'POST',
    desc: '借款管理-审核',
    path: '/finance/loan/examine',
    params: {}
  },
  {
    name: 'financeLoanExport',
    method: 'POST',
    desc: '借款管理-导出',
    path: '/finance/loan/export',
    params: {}
  },
  {
    name: 'financeLoanInfo',
    method: 'POST',
    desc: '借款管理-借款单详情',
    path: '/finance/loan/info',
    params: {}
  },
  {
    name: 'financeLoanLoan',
    method: 'POST',
    desc: '借款',
    path: '/finance/loan/loan',
    params: {}
  },
  {
    name: 'financeLoanSave',
    method: 'POST',
    desc: '借款-添加',
    path: '/finance/loan/save',
    params: {}
  },
  {
    name: 'financeLoanUpdate',
    method: 'POST',
    desc: '借款-编辑',
    path: '/finance/loan/update',
    params: {}
  },
  // 财务日常操作 ===>还款管理
  {
    name: 'financeRepaymentList',
    method: 'POST',
    desc: '还款管理-列表',
    path: '/finance/repayment/list',
    params: {}
  },
  {
    name: 'financeRepaymentRemove',
    method: 'POST',
    desc: '还款管理-删除',
    path: '/finance/repayment/remove',
    params: {}
  },
  {
    name: 'financeRepaymentInfo',
    method: 'POST',
    desc: '还款管理-详情',
    path: '/finance/repayment/info',
    params: {}
  },
  {
    name: 'financeRepaymentExamine',
    method: 'POST',
    desc: '还款管理-审核',
    path: '/finance/repayment/examine',
    params: {}
  },
  {
    name: 'financeRepaymentExport',
    method: 'POST',
    desc: '还款管理-导出',
    path: '/finance/repayment/export',
    params: {}
  },
  {
    name: 'financeRepaymentRepayment',
    method: 'POST',
    desc: '还款管理-还款',
    path: '/finance/repayment/repayment',
    params: {}
  },
  {
    name: 'financeRepaymentSave',
    method: 'POST',
    desc: '还款管理-添加',
    path: '/finance/repayment/save',
    params: {}
  },
  {
    name: 'financeRepaymentUpdate',
    method: 'POST',
    desc: '还款管理-编辑',
    path: '/finance/repayment/update',
    params: {}
  },

  // 财务日常操作 ===>冲账管理
  {
    name: 'financeRushList',
    method: 'POST',
    desc: '冲账管理-列表',
    path: '/finance/rush/list',
    params: {}
  },
  {
    name: 'financeRushInfo',
    method: 'POST',
    desc: '冲账管理-详情',
    path: '/finance/rush/info',
    params: {}
  },
  {
    name: 'financeRushRush',
    method: 'POST',
    desc: '冲账管理-冲账',
    path: '/finance/rush/rush',
    params: {}
  },
  {
    name: 'financeRushExport',
    method: 'POST',
    desc: '冲账管理-导出',
    path: '/finance/rush/export',
    params: {}
  },

  // 财务日常操作 ===>报销管理
  {
    name: 'financeExpenseList',
    method: 'POST',
    desc: '报销管理-列表',
    path: '/finance/expense/list',
    params: {}
  },
  {
    name: 'financeExpenseRemove',
    method: 'POST',
    desc: '报销管理-删除',
    path: '/finance/expense/remove',
    params: {}
  },
  {
    name: 'financeExpenseExamine',
    method: 'POST',
    desc: '报销管理-审核',
    path: '/finance/expense/examine',
    params: {}
  },
  {
    name: 'financeExpenseExport',
    method: 'POST',
    desc: '报销管理-导出',
    path: '/finance/expense/export',
    params: {}
  },
  {
    name: 'financeExpenseInfo',
    method: 'POST',
    desc: '报销单详情',
    path: '/finance/expense/info',
    params: {}
  },
  {
    name: 'financeExpenseExpense',
    method: 'POST',
    desc: '报销',
    path: '/finance/expense/expense',
    params: {}
  },
  {
    name: 'financeExpenseSave',
    method: 'POST',
    desc: '报销添加',
    path: '/finance/expense/save',
    params: {}
  },
  {
    name: 'financeExpenseUpdate',
    method: 'POST',
    desc: '报销编辑',
    path: '/finance/expense/update',
    params: {}
  },
  //财务日常操作 ===>网络采购
  {
    name: 'financeNetworkExport',
    method: 'POST',
    desc: '导出',
    path: '/finance/network/export',
    params: {}
  },
  {
    name: 'financeNetworkList',
    method: 'POST',
    desc: '列表',
    path: '/finance/network/list',
    params: {}
  },
  {
    name: 'financeNetworkRemove',
    method: 'POST',
    desc: '删除',
    path: '/finance/network/remove',
    params: {}
  },
  {
    name: 'financeNetworkExamine',
    method: 'POST',
    desc: '审核',
    path: '/finance/network/examine',
    params: {}
  },
  {
    name: 'financeNetworkInfo',
    method: 'POST',
    desc: '付款单详情',
    path: '/finance/network/info',
    params: {}
  },
  {
    name: 'financeNetworkPayment',
    method: 'POST',
    desc: '付款',
    path: '/finance/network/payment',
    params: {}
  },
  // 财务日常操作 ===>订单退款申请
  {
    name: 'financeRefundList',
    method: 'POST',
    desc: '列表',
    path: '/finance/refund/list',
    params: {}
  },
  {
    name: 'financeRefundExamine',
    method: 'POST',
    desc: '审核',
    path: '/finance/refund/examine',
    params: {}
  },
  {
    name: 'financeRefundInfo',
    method: 'POST',
    desc: '退款信息',
    path: '/finance/refund/info',
    params: {}
  },
  {
    name: 'financeRefundRefund',
    method: 'POST',
    desc: '退款',
    path: '/finance/refund/refund',
    params: {}
  },
  {
    name: 'financeRefundRelaunch',
    method: 'POST',
    desc: '重新发起API退款',
    path: '/finance/refund/relaunch',
    params: {}
  },
  {
    name: 'refundreasongetReasonList',
    method: 'POST',
    desc: '获取退款原因',
    path: '/refund/reason/getReasonList',
    params: {}
  },
  {
    name: 'financeRefundExport',
    method: 'POST',
    desc: '当前条件导出',
    path: '/finance/refund/export',
    params: {}
  },

  // 财务日常操作 ===>合同管理
  {
    name: 'financePurchaseContractList',
    method: 'POST',
    desc: '合同管理-列表',
    path: '/finance/purchase/contract/list',
    params: {}
  },
  {
    name: 'financePurchaseContractExport',
    method: 'POST',
    desc: '合同管理-导出',
    path: '/finance/purchase/contract/export',
    params: {}
  },
  {
    name: 'financePurchaseContractPrint',
    method: 'POST',
    desc: '合同管理-打印',
    path: '/finance/purchase/contract/print',
    params: {}
  },
  // 财务日常操作 ===>相关设置
  ...assSetting,
  ...accountBook,
  ...costManager
]
