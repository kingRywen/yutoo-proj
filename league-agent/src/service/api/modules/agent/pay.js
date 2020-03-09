export default [
  {
    name: 'merchantPayList',
    method: 'POST',
    desc: '充值-列表查询',
    path: '/MerchantPay/list',
    params: {}
  },
  {
    name: 'merchantPayInfo',
    method: 'POST',
    desc: '充值-详情',
    path: '/MerchantPay/info',
    params: {}
  },
  {
    name: 'merchantPayShouldPay',
    method: 'POST',
    desc: '充值-获取应付金额',
    path: '/MerchantPay/shouldPay',
    params: {}
  },
  {
    name: 'merchantPayOverage',
    method: 'POST',
    desc: '充值-当前余额',
    path: '/MerchantPay/overage',
    params: {}
  },
  {
    name: 'merchantPayPay',
    method: 'POST',
    desc: '充值-充值支付|继续支付',
    showSuccess: true,
    path: '/MerchantPay/pay',
    params: {}
  },
  {
    name: 'merchantPayInvalid',
    method: 'POST',
    desc: '充值-作废',
    showSuccess: true,
    path: '/MerchantPay/invalid',
    params: {}
  },
  {
    name: 'merchantPayRemove',
    method: 'POST',
    desc: '充值-删除',
    showSuccess: true,
    path: '/MerchantPay/remove',
    params: {}
  },

  {
    name: 'merchantConsumeRecordList',
    method: 'POST',
    desc: '充值-列表查询',
    path: '/MerchantConsumeRecord/list',
    params: {}
  },
  {
    name: 'paySetPayType',
    method: 'POST',
    desc: '充值-充值方式',
    path: '/PaySet/payType',
    params: {}
  },
];
