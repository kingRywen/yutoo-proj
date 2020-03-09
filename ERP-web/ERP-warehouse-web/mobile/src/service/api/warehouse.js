export default [
  /**
   * 采购入库
   */
  {
    name: 'purchaseScan',
    method: 'POST',
    desc: '【采购入库】（扫描采购产品条码）',
    path: '/wm/app/purchase/scan',
    mockPath: '/wm/app/purchase/scan',
    mock: false,
    params: {}
  },
  {
    name: 'purchaseStockin',
    method: 'POST',
    desc: '【采购入库】入库',
    path: '/wm/app/purchase/stockin',
    mockPath: '/wm/app/purchase/stockin',
    params: {},
    showSuccess: true
  },
  {
    name: 'purchaseScanUniqueLabel',
    method: 'POST',
    desc: '【采购入库】扫描射频',
    path: '/wm/app/purchase/scan/uniqueLabel',
    mockPath: '/wm/app/purchase/scan/uniqueLabel',
    params: {}
  },
  /**
   * 入库
   */
  {
    name: 'stockinScan',
    method: 'POST',
    desc: '【入库】扫描产品条码或库位条码',
    path: '/wm/app/stockin/scan',
    mockPath: '/wm/app/stockin/scan',
    params: {}
  },
  {
    name: 'stockin',
    method: 'POST',
    desc: '【入库】入库',
    path: '/wm/app/stockin',
    mockPath: '/wm/app/stockin',
    showSuccess: true,
    params: {}
  },
  /**
   * 退货入库
   */
  {
    name: 'returnScan',
    method: 'POST',
    desc: '【退货入库】扫描',
    path: '/wm/app/return/scan',
    mockPath: '/wm/app/return/scan',
    params: {}
  },
  {
    name: 'returnChoose',
    method: 'POST',
    desc: '【退货入库】选择退货订单',
    path: '/wm/app/return/choose',
    mockPath: '/wm/app/return/choose',
    params: {}
  },
  {
    name: 'returnStockin',
    method: 'POST',
    desc: '【退货入库】确认入库',
    path: '/wm/app/return/stockin',
    mockPath: '/wm/app/return/stockin',
    showSuccess: true,
    params: {}
  },
  /**
   * 盘点
   */
  {
    name: 'inventoryScan',
    method: 'POST',
    desc: '【盘点】扫描盘点批次号和库位条码',
    path: '/wm/app/inventory/scan',
    mockPath: '/wm/app/inventory/scan',
    params: {}
  },
  {
    name: 'inventoryConfirm',
    method: 'POST',
    desc: '【盘点】确认完成盘点',
    path: '/wm/app/inventory/confirm',
    mockPath: '/wm/app/inventory/confirm',
    showSuccess: true,
    params: {}
  },
  {
    name: 'issueTypeList',
    method: 'POST',
    desc: '【盘点】获取盘点问题类型',
    path: '/wm/move/plan/list/issue/type',
    mockPath: '/wm/move/plan/list/issue/type',
    params: {}
  },
  {
    name: 'inventoryProductDamage',
    method: 'POST',
    desc: '【盘点】扫描损坏库存',
    path: '/wm/app/inventory/product/damage',
    mockPath: '/wm/app/inventory/product/damage',
    params: {}
  },
  {
    name: 'inventoryProductNormal',
    method: 'POST',
    desc: '【盘点】扫描所有产品',
    path: '/wm/app/inventory/product/normal',
    mockPath: '/wm/app/inventory/product/normal',
    showSuccess: true,
    params: {}
  },
  {
    name: 'inventoryAgain',
    method: 'POST',
    desc: '【盘点】重新盘点',
    path: '/wm/app/inventory/again',
    mockPath: '/wm/app/inventory/again',
    params: {}
  },
  /**
   * 拣货任务
   */
  {
    name: 'pickTaskPrint',
    method: 'POST',
    desc: '【拣货任务】打印拣货单',
    path: '/wm/app/pick/task/print',
    mockPath: '/wm/app/pick/task/print',
    params: {}
  },
  {
    name: 'pickTaskList',
    method: 'POST',
    desc: '【拣货任务】列表',
    path: '/wm/app/pick/task/list',
    mockPath: '/wm/app/pick/task/list',
    params: {}
  },
  {
    name: 'pickTaskProductList',
    method: 'POST',
    desc: '【拣货任务】查看产品列表',
    path: '/wm/app/pick/task/product/list',
    mockPath: '/wm/app/pick/task/product/list',
    params: {}
  },
  /**
   * 打包核对
   */
  {
    name: 'packScanPackage',
    method: 'POST',
    desc: '【打包核对】扫描包裹单号',
    path: '/wm/app/pack/scan/package',
    mockPath: '/wm/app/pack/scan/package',
    params: {}
  },
  {
    name: 'packBoxDelete',
    method: 'POST',
    desc: '【打包核对】删除箱子',
    path: '/wm/app/pack/box/delete',
    mockPath: '/wm/app/pack/box/delete',
    params: {}
  },
  {
    name: 'packBoxUpdate',
    method: 'POST',
    desc: '【打包核对】更新箱子信息',
    path: '/wm/app/pack/box/update',
    mockPath: '/wm/app/pack/box/update'
  },
  {
    name: 'packComplate',
    method: 'POST',
    desc: '【打包核对】打包完成',
    path: '/wm/app/pack/complete',
    mockPath: '/wm/app/pack/complete',
    params: {}
  },
  {
    name: 'packScanProduct',
    method: 'POST',
    desc: '【打包核对】扫描产品',
    path: '/wm/app/pack/scan/product',
    mockPath: '/wm/app/pack/scan/product',
    params: {}
  },
  {
    name: 'packBoxAdd',
    method: 'POST',
    desc: '【打包核对】添加箱子',
    path: '/wm/app/pack/box/add',
    mockPath: '/wm/app/pack/box/add',
    params: {}
  },
  {
    name: 'packBoxProductUpdate',
    method: 'POST',
    desc: '【打包核对】更新箱子中的产品信息',
    path: '/wm/app/pack/box/product/update',
    mockPath: '/wm/app/pack/box/product/update',
    params: {}
  },
  {
    name: 'packListScanProduct',
    method: 'POST',
    desc: '【打包核对】获取扫描的产品',
    path: '/wm/app/pack/list/scan/product',
    mockPath: '/wm/app/pack/list/scan/product',
    params: {}
  },
  {
    name: 'packListBoxProduct',
    method: 'POST',
    desc: '【打包核对】获取装箱的产品',
    path: '/wm/app/pack/list/box/product',
    mockPath: '/wm/app/pack/list/box/product',
    params: {}
  },
  {
    name: 'packWeigh',
    method: 'POST',
    desc: '【打包核对】称重',
    path: '/wm/app/pack/weigh',
    mockPath: '/wm/app/pack/weigh',
    params: {}
  },
  /**
   *分拣
   */
  {
    name: 'pickScan',
    method: 'POST',
    desc: '【分拣】扫描产品条码或篮子条码',
    path: '/wm/app/pick/scan',
    mockPath: '/wm/app/pick/scan',
    params: {}
  },
  {
    name: 'pickException',
    method: 'POST',
    desc: '【分拣】异常分拣完成',
    path: '/wm/app/pick/exception',
    mockPath: '/wm/app/pick/exception',
    showSuccess: true,
    params: {}
  },
  {
    name: 'pickIsComplete',
    method: 'POST',
    desc: '【分拣】是否已完成',
    path: '/wm/app/pick/complete',
    mockPath: '/wm/app/pick/complete',
    showSuccess: true,
    params: {}
  },

  /**
   */
  {
    name: 'pickRobotStatus',
    method: 'POST',
    desc: '机器人是否有拣货任务',
    path: '/wm/app/pick/robot/status',
    mockPath: '/wm/app/pick/robot/status',
    params: {}
  },
  {
    name: 'moveScan',
    method: 'POST',
    desc: '【库位转移】扫描库位或仓库sku',
    path: '/wm/app/move/scan',
    mockPath: '/wm/app/move/scan',
    params: {}
  },
  {
    name: 'moveStockout',
    method: 'POST',
    desc: '【库位转移】确认出库',
    showSuccess: true,
    path: '/wm/app/move/stockout',
    mockPath: '/wm/app/move/stockout',
    params: {}
  },

  // app 2019-3-26
  {
    name: 'AppRfScan',
    method: 'POST',
    desc: '扫描射频',
    path: '/wm/app/rf/scan',
    params: {}
  },
  {
    name: 'AppRfBind',
    method: 'POST',
    desc: '绑定射频',
    path: '/wm/app/rf/bind',
    params: {}
  },
  {
    name: 'AppRfUnbind',
    method: 'POST',
    desc: '解绑射频',
    path: '/wm/app/rf/unbind',
    params: {}
  },
  {
    name: 'InventoryPlanList',
    method: 'POST',
    desc: '盘点列表',
    path: '/wm/inventory/plan/list',
    params: {}
  },
  {
    name: 'getByCode',
    method: 'POST',
    desc: '库位改变查询',
    path: '/WmLocation/get/by/code',
    mockPath: '/WmLocation/get/by/code',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'wmAppInventoryAgain',
    method: 'POST',
    desc: '重新盘点',
    path: '/wm/app/inventory/again',
    mockPath: '/wm/app/inventory/again',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'wmAppInventoryLabelError',
    method: 'POST',
    desc: '盘点下一个标签',
    path: '/wm/app/inventory/label/error',
    mockPath: '/wm/app/inventory/label/error',
    showSuccess: true,
    mock: false,
    params: {}
  }
]
