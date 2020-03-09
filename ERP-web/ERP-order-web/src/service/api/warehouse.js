export default [
  {
    name: 'wmInventoryProductCodeList',
    method: 'POST',
    desc: '获取产品条码',
    path: '/WmInventory/product/code/list',
    params: {}
  },
  {
    name: 'logisticCountrySearchList',
    method: 'POST',
    desc: '所在国家列表',
    path: '/logistic/country/search/list',
    mockPath: '/logistic/country/search/list',
    showSuccess: false,
    mock: true,
    params: {}
  },
  {
    name: 'logisticProvinceSearchList',
    method: 'POST',
    desc: '所在省列表',
    path: '/logistic/province/search/list',
    mockPath: '/logistic/province/search/list',
    showSuccess: false,
    mock: true,
    params: {}
  },
  {
    name: 'wmWarehouseGlobalAllList',
    method: 'POST',
    desc: '所有仓库',
    path: '/WmWarehouse/global/allList',
    mockPath: '/WmWarehouse/global/allList',
    showSuccess: false,
    mock: true,
    params: {}
  },
  {
    name: 'nationList',
    method: 'POST',
    desc: '运费试算-国家列表',
    path: '/logistic/country/search/list',
    mockPath: '/logistic/country/search/list',
    showSuccess: false,
    mock: false,
    params: {}
  }
]
