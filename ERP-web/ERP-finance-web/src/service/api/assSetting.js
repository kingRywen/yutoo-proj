export default [
  //  合同模板
  {
    name: 'financeContractModelList',
    method: 'POST',
    desc: '合同模板-列表',
    path: '/finance/contract/model/list',
    params: {}
  },
  {
    name: 'financeContractModelSave',
    method: 'POST',
    desc: '合同模板-添加',
    path: '/finance/contract/model/save',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeContractModelUpdate',
    method: 'POST',
    desc: '合同模板-编辑',
    path: '/finance/contract/model/update',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeContractModelRemove',
    method: 'POST',
    desc: '合同模板-删除',
    path: '/finance/contract/model/remove',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeContractModelInfo',
    method: 'POST',
    desc: '合同模板-详情',
    path: '/finance/contract/model/info',
    params: {}
  },
  // 合同编号规则设置
  {
    name: 'financeContractRuleList',
    method: 'POST',
    desc: '合同编号规则-列表',
    path: '/finance/contract/rule/list',
    params: {}
  },
  {
    name: 'financeContractRuleUpdate',
    method: 'POST',
    desc: '合同编号规则-编辑',
    path: '/finance/contract/rule/update',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeContractRuleSave',
    method: 'POST',
    desc: '合同编号规则-添加',
    path: '/finance/contract/rule/save',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeContractRuleInfo',
    method: 'POST',
    desc: '合同编号规则-详情',
    path: '/finance/contract/rule/info',
    params: {}
  },
  {
    name: 'financeContractRuleRemove',
    method: 'POST',
    desc: '合同编号规则-删除',
    path: '/finance/contract/rule/remove',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeContractRuleGetComboBox',
    method: 'POST',
    desc: '合同编号规则-下拉框',
    path: '/finance/contract/rule/getComboBox',
    params: {}
  },
  {
    name: 'financeContractRulePreview',
    method: 'POST',
    desc: '合同编号规则-预览',
    path: '/finance/contract/rule/preview',
    params: {}
  },
  // 货币费率查询
  {
    name: 'financeCurrencyRateList',
    method: 'POST',
    desc: '货币费率查询-列表',
    path: '/finance/currency/rate/list',
    params: {}
  },
  {
    name: 'financeCurrencyRateUpdateRate',
    method: 'POST',
    desc: '货币费率查询-编辑自定义费率',
    path: '/finance/currency/rate/updateRate',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeCurrencyRateSync',
    method: 'POST',
    desc: '货币费率查询-手动跟新费率',
    path: '/finance/currency/rate/sync',
    params: {},
    showSuccess: true
  },
  {
    name: 'financeCurrencyRateExport',
    method: 'POST',
    desc: '货币费率查询-导出',
    path: '/finance/currency/rate/export',
    params: {}
  },
  {
    name: 'financeCurrencyRateClear',
    method: 'POST',
    desc: '货币费率查询-清空自定义费率',
    path: '/finance/currency/rate/clear',
    params: {}
  },
  // 采购支付宝账号管理
  {
    name: 'financeAlipayAccountList',
    method: 'POST',
    desc: '采购支付宝账号管理-列表',
    path: '/finance/alipay/account/list',
    params: {}
  },
  {
    name: 'financeAlipayAccountUpdate',
    method: 'POST',
    desc: '采购支付宝账号管理-编辑',
    path: '/finance/alipay/account/update',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeAlipayAccountSave',
    method: 'POST',
    desc: '采购支付宝账号管理-添加',
    path: '/finance/alipay/account/save',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeAlipayAccountRemove',
    method: 'POST',
    desc: '采购支付宝账号管理-删除',
    path: '/finance/alipay/account/remove',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeAlipayAccountInfo',
    method: 'POST',
    desc: '采购支付宝账号管理-详情',
    path: '/finance/alipay/account/info',
    params: {}
  },
  // 收付款账号管理
  {
    name: 'financePaymentAccountList',
    method: 'POST',
    desc: '采购支付宝账号管理-列表',
    path: '/finance/payment/account/list',
    params: {}
  },
  {
    name: 'financePaymentAccountSave',
    method: 'POST',
    desc: '采购支付宝账号管理-添加',
    path: '/finance/payment/account/save',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financePaymentAccountUpdate',
    method: 'POST',
    desc: '采购支付宝账号管理-编辑',
    path: '/finance/payment/account/update',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financePaymentAccountInfo',
    method: 'POST',
    desc: '采购支付宝账号管理-详情',
    path: '/finance/payment/account/info',
    params: {}
  },
  {
    name: 'financePaymentAccountRemove',
    method: 'POST',
    desc: '采购支付宝账号管理-删除',
    path: '/finance/payment/account/remove',
    showSuccess: true,
    params: {}
  }
]
