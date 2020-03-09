//仓储日常炒作接口

export default [
  //盘点管理
  {
    name: 'inventoryPlanList',
    method: 'POST',
    desc: '列表',
    path: '/wm/inventory/plan/list',
    mock: true,
    params: {}
  },
  {
    name: 'inventoryPlanReport',
    method: 'POST',
    desc: '下载盘点报告',
    path: '/wm/inventory/plan/report',
    params: {}
  },
  {
    name: 'inventoryPlanInfo',
    method: 'POST',
    desc: '基本信息',
    path: '/wm/inventory/plan/info',
    params: {}
  },
  {
    name: 'inventoryPlanArea',
    method: 'POST',
    desc: '盘点区域',
    path: '/wm/inventory/plan/area',
    params: {}
  },
  {
    name: 'inventoryPlanLog',
    method: 'POST',
    desc: '盘点记录',
    path: '/wm/inventory/plan/log',
    params: {}
  },
  {
    name: 'inventoryPlanLogIssue',
    method: 'POST',
    desc: '查看盘点记录问题数量',
    path: '/wm/inventory/plan/log/issue',
    params: {}
  },
  {
    name: 'inventoryPlanAudit',
    method: 'POST',
    desc: '审核',
    path: '/wm/inventory/plan/audit',
    params: {}
  },
  {
    name: 'inventoryPlanCreate',
    method: 'POST',
    desc: '添加盘点计划',
    path: '/wm/inventory/plan/create',
    params: {}
  },
  {
    name: 'inventoryPlaneUpdate',
    method: 'POST',
    desc: '更新盘点计划',
    path: '/wm/inventory/plan/update',
    params: {}
  },
  {
    name: 'inventoryPlaneOperationLog',
    method: 'POST',
    desc: '查看操作日志',
    path: '/wm/inventory/plan/operation/log',
    params: {}
  },
  //移库管理
  {
    name: 'movePlanList',
    method: 'POST',
    desc: '列表',
    path: '/wm/move/plan/list',
    params: {}
  },
  {
    name: 'movePlanAudit',
    method: 'POST',
    desc: '审核',
    path: '/wm/move/plan/audit',
    params: {}
  },
  {
    name: 'movePlanInfo',
    method: 'POST',
    desc: '查看（基本信息）',
    path: '/wm/move/plan/info',
    params: {}
  },
  {
    name: 'movePlanLog',
    method: 'POST',
    desc: '查看（移库记录）',
    path: '/wm/move/plan/move/log',
    params: {}
  },
  {
    name: 'movePlanOperationLog',
    method: 'POST',
    desc: '操作日志',
    path: '/wm/move/plan/operation/log',
    params: {}
  },
  {
    name: 'movePlanCreate',
    method: 'POST',
    desc: '添加移库计划',
    path: '/wm/move/plan/create',
    params: {}
  },
  {
    name: 'movePlanUpdate',
    method: 'POST',
    desc: '更新移库计划',
    path: '/wm/move/plan/update',
    params: {}
  },
  {
    name: 'movePlanProductList',
    method: 'POST',
    desc: '查询某个仓库中的产品',
    path: '/wm/warehouse/product/list',
    params: {}
  },
  {
    name: 'movePlanlistProduct',
    method: 'POST',
    desc: '查询移库产品列表',
    path: '/wm/move/plan/list/product',
    params: {}
  },
  //推荐移库列表
  {
    name: 'recommendList',
    method: 'POST',
    desc: '列表',
    path: '/wm/recommend/list',
    params: {}
  },
  //包裹复核
  {
    name: 'reviewPackage',
    method: 'POST',
    desc: '扫描包裹单号',
    path: '/wm/review/package',
    params: {}
  },
  {
    name: 'reviewProduct',
    method: 'POST',
    desc: '扫描产品条码',
    path: '/wm/review/product',
    params: {}
  },
  //订单退换货
  {
    name: 'returnProductList',
    method: 'POST',
    desc: '获取退货产品列表',
    path: '/wm/return/product/list',
    params: {}
  },
  {
    name: 'returnList',
    method: 'POST',
    desc: '列表',
    path: '/wm/return/list',
    params: {}
  },
  {
    name: 'returnListPrincipal',
    method: 'POST',
    desc: '获取退货管理负责人列表',
    path: '/wm/return/list/principal',
    params: {}
  },
  {
    name: 'returnPrincipalSetting',
    method: 'POST',
    desc: '设置负责人',
    path: '/wm/return/principal/setting',
    params: {}
  },
  {
    name: 'returnLogList',
    method: 'POST',
    desc: '查看操作日志',
    path: '/wm/return/log/list',
    params: {}
  },
  //订单包裹发货计划
  {
    name: 'packageProductList',
    method: 'POST',
    desc: '【订单包裹单】查询包裹单产品详情',
    path: '/wm/package/product/list',
    params: {}
  },
  {
    name: 'packagePickerDetailList',
    method: 'POST',
    desc: '【订单包裹单】查询包裹单拣货人详情',
    path: '/wm/package/picker/detail/list',
    params: {}
  },
  {
    name: 'packageStatistics',
    method: 'POST',
    desc: '【订单包裹单】统计（侧边栏）',
    path: '/wm/package/statistics',
    params: {}
  },
  {
    name: 'packageProductInfo',
    method: 'POST',
    desc: '【订单包裹单】获取包裹单详情（产品信息）',
    path: '/wm/package/product/info',
    params: {}
  },
  {
    name: 'packageLsit',
    method: 'POST',
    desc: '订单包裹单】列表',
    path: '/wm/package/list',
    params: {}
  },
  {
    name: 'packageLogisticsInfo',
    method: 'POST',
    desc: '【订单包裹单】获取订单包裹单的物流信息',
    path: '/wm/package/logistics/info',
    params: {}
  },
  {
    name: 'packageDeclareInfo',
    method: 'POST',
    desc: '【订单包裹单】获取订单包裹单的申报信息',
    path: '/wm/package/declare/info',
    params: {}
  },
  {
    name: 'packageBoxInfo',
    method: 'POST',
    desc: '【订单包裹单】查询订单包裹单的装箱信息',
    path: '/wm/package/box/info',
    params: {}
  },
  {
    name: 'packageLogList',
    method: 'POST',
    desc: '【订单包裹单】查询操作日志',
    path: '/wm/package/log/list',
    params: {}
  },
  {
    name: 'packageSeparate',
    method: 'POST',
    desc: '【订单包裹单】拆分包裹',
    path: '/wm/package/separate',
    params: {}
  },
  {
    name: 'packageMerge',
    method: 'POST',
    desc: '【订单包裹单】合并包裹',
    path: '/wm/package/merge',
    params: {}
  },
  {
    name: 'packageModifyTransport',
    method: 'POST',
    desc: '【订单包裹单】修改包裹单运输方式',
    path: '/wm/package/modify/transport',
    params: {}
  },
  {
    name: 'packageModifyPackager',
    method: 'POST',
    desc: '【订单包裹单】修改打包人员',
    path: '/wm/package/modify/packager',
    params: {}
  },
  {
    name: 'packageDeliver',
    method: 'POST',
    desc: '【订单包裹单】设置已发货',
    path: '/wm/package/set/shipped',
    params: {}
  },
  {
    name: 'packageDeliverCancel',
    method: 'POST',
    desc: '【订单包裹单】撤销已发货',
    path: '/wm/package/cancel/shipped',
    params: {}
  },
  {
    name: 'packageColumnsList',
    method: 'POST',
    desc: '【订单包裹单】获取包裹单的所有字段',
    path: '/wm/package/columns/list',
    params: {}
  },
  {
    name: 'packageColumnsSave',
    method: 'POST',
    desc: '【订单包裹单】保存导出模板',
    path: '/wm/package/columns/save',
    params: {}
  },
  {
    name: 'packageSkuProductList',
    method: 'POST',
    desc: '【查询包裹单产品详情',
    path: '/wm/package/product/list',
    params: {}
  },
  {
    name: 'wmWarehouseUserlist',
    method: 'POST',
    desc: '三种管理人员',
    path: '/WmWarehouseStaff/user/list',
    params: {}
  },
  {
    name: 'packagepickerlist',
    method: 'POST',
    desc: '根据包裹单捡货人列表',
    path: '/wm/package/picker/list/',
    params: {}
  },
  {
    name: 'packageModifyPicker',
    method: 'POST',
    desc: '修改拣货人',
    path: '/wm/package/modify/picker',
    params: {}
  },
  {
    name: 'logisticTransportList',
    method: 'POST',
    desc: '获取运输方式列表',
    path: '/logistic/transport/list',
    params: {}
  },
  {
    name: 'downloadTrackingNumber',
    method: 'POST',
    desc: '下载追踪号模板',
    path: '/wm/package/download/tracking/number',
    params: {}
  },
  {
    name: 'importTrackingNumber',
    method: 'POST',
    desc: '导入追踪号模板',
    path: '/wm/package/import/tracking/number',
    params: {},
    type: 'formdata'
  },
  {
    name: 'packageProductSeparateInfo',
    method: 'POST',
    desc: '获取产品信息(拆分包裹)',
    path: '/wm/package/product/separateInfo',
    params: {}
  },
  {
    name: 'packageQueryMergeInfo',
    method: 'POST',
    desc: '查询合并详情，点铃铛的时候调用的',
    path: '/wm/package/query/merge/info',
    params: {}
  },
  {
    name: 'wmPackagePrint',
    method: 'POST',
    desc: '打印',
    path: '/wm/package/print',
    params: {}
  },
  {
    name: 'wmInventoryPlanPrint',
    method: 'POST',
    desc: '打印盘点清单',
    path: '/wm/inventory/plan/print',
    params: {}
  }
]
