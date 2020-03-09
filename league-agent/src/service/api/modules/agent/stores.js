export default [
  {
    name: 'merchantStoreList',
    method: 'POST',
    desc: '店铺-列表查询',
    path: '/MerchantStore/list',
    params: {}
  },
  {
    name: 'merchantStoreActivating',
    method: 'POST',
    desc: '店铺-激活',
    showSuccess: true,
    path: '/MerchantStore/activating',
    params: {}
  },
  {
    name: 'merchantStoreSuspend',
    method: 'POST',
    desc: '店铺-暂停',
    showSuccess: true,
    path: '/MerchantStore/suspend',
    params: {}
  },
  {
    name: 'merchantStoreDropdownList',
    method: 'POST',
    desc: '店铺-下拉值查询',
    path: '/MerchantStore/dropdownList',
    params: {}
  },
  {
    name: 'merchantStoreSave',
    method: 'POST',
    desc: '店铺-新增',
    showSuccess: true,
    path: '/MerchantStore/save',
    params: {}
  },
  {
    name: 'merchantStoreInfo',
    method: 'POST',
    desc: '店铺-详情',
    path: '/MerchantStore/info',
    params: {}
  },
  {
    name: 'merchantStoreUpdate',
    method: 'POST',
    desc: '店铺-编辑',
    showSuccess: true,
    path: '/MerchantStore/update',
    params: {}
  },
  {
    name: 'merchantStoreRemove',
    method: 'POST',
    desc: '店铺-删除',
    showSuccess: true,
    path: '/MerchantStore/remove',
    params: {}
  }
]
