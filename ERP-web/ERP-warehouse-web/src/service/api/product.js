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
  }
]
