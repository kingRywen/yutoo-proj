export default [
  {
    name: 'getSiteList',
    method: 'POST',
    desc: '获取站点列表',
    path: '/site/list',
    mockPath: '/site/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'nationalPage',
    method: 'POST',
    desc: '获取国家列表',
    path: '/nation/page',
    mockPath: '/nation/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'categoryList',
    method: 'POST',
    desc: '获取类目列表',
    path: '/product/category/list',
    mockPath: '/product/category/list1',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'getBrandNameList',
    method: 'POST',
    desc: '获取品牌列表',
    path: '/product/brand/getBrandNameList',
    mockPath: '/product/brand/getBrandNameList',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'storeList',
    method: 'POST',
    desc: '获取账号详情',
    path: '/store/search/list',
    mockPath: '/store/search/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'warehouseList',
    method: 'POST',
    desc: '获取仓库列表',
    path: '/warehouse/list',
    mockPath: '/warehouse/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'platformStoreList',
    method: 'POST',
    desc: '获取选择平台的店铺列表',
    path: '/store/platform/list/get',
    mockPath: '/store/platform/list/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'platformList',
    method: 'POST',
    desc: '获取平台列表',
    path: '/platform/active/list',
    mockPath: '/platform/active/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'languageList',
    method: 'POST',
    desc: '获取语种列表',
    path: '/language/list',
    mockPath: '/language/list',
    showSuccess: false,
    mock: false,
    params: {}
  },

  {
    name: 'store_list_all',
    method: 'POST',
    desc: '获取所有的店铺',
    path: '/store/list/all',
    params: {}
  },
  {
    name: 'storeEbayList',
    method: 'POST',
    desc: '获取所有ebay的店铺',
    path: '/store/ebay/list',
    params: {}
  }
]
