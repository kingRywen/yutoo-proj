export default [{
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
    params: {}
  },
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
    params: {}
  },
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
]
