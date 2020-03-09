export default [
  {
    name: 'merchantProductRecycleList',
    method: 'POST',
    desc: '商品回收-列表查询',
    path: '/MerchantProductRecycle/list',
    // mock: true,
    params: {}
  },
  {
    name: 'merchantProductRecycleApplyOutWarehouse',
    method: 'POST',
    desc: '商品回收-申请出库', showSuccess: true,
    path: '/MerchantProductRecycle/applyOutWarehouse',
    params: {}
  },
  {
    name: 'applyOutWarehouse',
    method: 'POST',
    desc: '商品回收-申请出库费用',
    path: '/MerchantProductRecycle/recycleCost/applyOutWarehouse',
    params: {}
  },
  {
    name: 'merchantProductRecycleConfirmOutWarehouse',
    method: 'POST',
    desc: '商品回收-确认出库', showSuccess: true,
    path: '/MerchantProductRecycle/confirmOutWarehouse',
    params: {}
  },
  {
    name: 'merchantProductRecycleCancelOutWarehouse',
    method: 'POST',
    desc: '商品回收-取消出库', showSuccess: true,
    path: '/MerchantProductRecycle/cancelOutWarehouse',
    params: {}
  },
  {
    name: 'merchantProductRecycleInfo',
    method: 'POST',
    desc: '商品回收-出库详情',
    path: '/MerchantProductRecycle/info',
    params: {}
  },
]
