export default [
  {
    name: 'store_list_all',
    method: 'POST',
    desc: '获取所有的店铺',
    path: '/store/list/all',
    mockPath: '/store/list/all',
    singleLoading: true,
    params: {}
  },
  {
    name: 'globalReportList',
    method: 'POST',
    desc: '报告中心列表查询（分页）',
    path: '/GlobalReport/list',
    params: {}
  },
  {
    name: 'productSupplierListAll',
    method: 'GET',
    desc: '获取所有采购仓库',
    path: '/product/supplier/list/all',
    params: {}
  },
  {
    name: 'globalUploadRecordList',
    method: 'POST',
    desc: '导入日志（分页）',
    path: '/GlobalUploadRecord/list',
    params: {}
  },
  {
    name: 'globalUploadRecordDownload',
    method: 'POST',
    desc: '导入日志（下载）',
    path: '/GlobalUploadRecord/download',
    params: {}
  },
  {
    name: 'globalUploadRecordBatchDownload',
    method: 'POST',
    desc: '导入日志（批量下载）',
    path: '/GlobalUploadRecord/batchDownload',
    params: {}
  },
  {
    name: 'globalReportReportModelType',
    method: 'POST',
    desc: '报告类型查询',
    path: '/GlobalReport/report/model/type',
    params: {}
  },
  {
    name: 'globalEnumList',
    method: 'POST',
    desc: '获取下拉选项',
    path: '/global/enum/list',
    mockPath: '/global/enum/list',
    singleLoading: true,
    params: {
      type: 2 // 侵权风险 2
    }
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
    name: 'platformActiveList',
    method: 'POST',
    desc: '获取应用平台列表',
    path: '/platform/active/list',
    mockPath: '/platform/active/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'siteList',
    method: 'POST',
    desc: '获取站点',
    path: '/site/list',
    mockPath: '/site/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'siteListByPlatform',
    method: 'POST',
    desc: '利润报表-根据平台获取站点',
    mock: false,
    path: '/site/list/by/platform',
    params: {}
  },
  {
    name: 'storeSiteList',
    method: 'POST',
    desc: '利润报表-根据站点获取店铺',
    mock: false,
    path: '/store/site/list',
    params: {}
  },
  {
    name: 'platformListAllActivatePlatform',
    method: 'POST',
    desc: '利润报表-获取平台列表',
    mock: false,
    path: '/platform/list/all/activate/platform',
    params: {}
  },
]
