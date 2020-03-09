export default [
  {
    name: 'supplierGetAddressList',
    method: 'POST',
    desc: '获取采购点列表',
    path: '/supplier/address/getAddressList',
    mockPath: '/',
    params: {}
  },

  {
    name: 'periodPeriodList',
    method: 'POST',
    desc: '获取账期类型列表',
    path: '/supplier/period/getPeriodList',
    mockPath: '/',
    params: {}
  },

  {
    name: 'purchaseTotal',
    method: 'POST',
    desc: '采购单管理-导出sku采购总额报表',
    path: '/purchase/print/purchaseTotal',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseSchedule',
    method: 'POST',
    desc: '采购单管理-导出SKU采购进度统计报表',
    path: '/purchase/print/purchaseSchedule',
    mockPath: '/',
    params: {}
  },
  {
    name: 'currentConditions',
    method: 'POST',
    desc: '采购单管理-当前条件导出',
    path: '/purchase/print/export/current/conditions',
    mockPath: '/',
    params: {}
  },
  {
    name: 'importTrackNumber',
    method: 'POST',
    desc: '采购单管理-批量导入网络快递下单号',
    path: '/purchase/print/importTrackNumber',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseLowerSingle',
    method: 'POST',
    desc: '采购单管理-导出采购单下单记录',
    path: '/purchase/print/purchaseLowerSingle',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseTotalBySupp',
    method: 'POST',
    desc: '采购单管理-按销单供应商导出采购总额统计报表',
    path: '/purchase/print/purchaseTotalBySupp',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseQuantity',
    method: 'POST',
    desc: '采购单管理-导出SKU采购数量报表',
    path: '/purchase/print/purchaseQuantity',
    mockPath: '/',
    params: {}
  },

  {
    name: 'purchaseRejectsList',
    method: 'POST',
    desc: '不良品列表',
    path: '/purchase/rejects/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'QCRejectsRetuen',
    method: 'POST',
    desc: '质检管理-不良品退回',
    path: '/purchase/QC/rejectsRetuen',
    mockPath: '/',
    params: {}
  },
  {
    name: 'QCgetDetailByCode',
    method: 'POST',
    desc: '质检管理-不良品退回操作（根据条形码查询信息）',
    path: '/purchase/QC/getDetailByCode',
    mockPath: '/',
    params: {}
  },
  {
    name: 'QCgetReturnRecord',
    method: 'POST',
    desc: '质检管理-历史不良品退回记录',
    path: '/purchase/QC/getReturnRecord',
    mockPath: '/',
    params: {}
  },
  {
    name: 'QCgetHisRecord',
    method: 'POST',
    desc: '质检管理-历史质检情况',
    path: '/purchase/QC/getHisRecord',
    mockPath: '/',
    params: {}
  },

  {
    name: 'QCconfirmQC',
    method: 'POST',
    desc: '质检管理-确认质检',
    path: '/purchase/QC/confirmQC',
    mockPath: '/',
    params: {}
  },

  {
    name: 'QCCancenHistortQC',
    method: 'POST',
    desc: '质检管理-作废',
    path: '/purchase/QC/cancenHistortQC',
    mockPath: '/',
    params: {}
  },
  {
    name: 'QCExport',
    method: 'POST',
    desc: '质检管理-导出质检入库Excel',
    path: '/purchase/QC/export',
    mockPath: '/',
    params: {}
  },

  {
    name: 'rejectsExport',
    method: 'POST',
    desc: '质检管理-不良品导出',
    path: '/purchase/rejects/export',
    mockPath: '/',
    params: {}
  },
  {
    name: 'getSupplierList',
    method: 'POST',
    desc: '质检管理-供应商列表',
    path: '/supplier/list/all',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseQCList',
    method: 'POST',
    desc: '质检列表',
    path: '/purchase/QC/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'QCDetail',
    method: 'POST',
    desc: '质检列表(查看)',
    path: '/purchase/QC/detail',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exceptionList',
    method: 'POST',
    desc: '采购异常管理',
    path: '/purchase/exception/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exceptionExport',
    method: 'POST',
    desc: '采购异常管理导出',
    path: '/purchase/exception/export',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exceptionSetHandle',
    method: 'POST',
    desc: '采购异常管理-设置处理状态',
    path: '/purchase/exception/setHandle',
    mockPath: '/',
    params: {}
  },

  {
    name: 'updatePurchasers',
    method: 'POST',
    desc: '采购清单列表-批量修改采购人员',
    path: '/purchase/updatePurchasers',
    mockPath: '/',
    params: {}
  },

  {
    name: 'setUrgentState',
    method: 'POST',
    desc: '采购清单列表-批量设置采购单加急状态',
    path: '/purchase/setUrgentState',
    mockPath: '/',
    params: {}
  },

  {
    name: 'setEndState',
    method: 'POST',
    desc: '采购清单列表-批量设置完结状态',
    path: '/purchase/setEndState',
    mockPath: '/',
    params: {}
  },

  {
    name: 'setPaymentMethod',
    method: 'POST',
    desc: '采购清单列表-批量设置付款方式',
    path: '/purchase/setPaymentMethod',
    mockPath: '/',
    params: {}
  },

  {
    name: 'finishedList',
    method: 'POST',
    desc: '成品加工订单列表',
    path: '/purchase/finished/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'finishedFinishedRepluse',
    method: 'POST',
    desc: '加工单管理-打回加工单',
    path: '/purchase/finished/finishedRepluse',
    mockPath: '/',
    params: {}
  },
  {
    name: 'finishedGenerate',
    method: 'POST',
    desc: '加工单管理-生成成品加工单',
    path: '/purchase/finished/generate',
    mockPath: '/',
    params: {}
  },
  {
    name: 'finishedExport',
    method: 'POST',
    desc: '加工单管理-导出Excel',
    path: '/purchase/finished/export',
    mockPath: '/',
    params: {}
  },
  {
    name: 'exportNotGenerated',
    method: 'POST',
    desc: '加工单管理-导出未生成情况',
    path: '/purchase/finished/exportNotGenerated',
    mockPath: '/',
    params: {}
  },
  {
    name: 'conversionSetPriority',
    method: 'POST',
    desc: '加工单管理-设置优先级别',
    path: '/purchase/conversion/setPriority',
    mockPath: '/',
    params: {}
  },
  {
    name: 'conversionStockOperator',
    method: 'POST',
    desc: '加工单管理-加工',
    path: '/purchase/conversion/stockOperator',
    mockPath: '/',
    params: {}
  },
  {
    name: 'conversionGetRawMaterial',
    method: 'POST',
    desc: '加工单管理-添加耗损(获取原材料配比)',
    path: '/purchase/conversion/getRawMaterial',
    mockPath: '/',
    params: {}
  },
  {
    name: 'conversionGetWastage',
    method: 'POST',
    desc: '加工单管理-获取原材料耗损',
    path: '/purchase/conversion/getWastage',
    mockPath: '/',
    params: {}
  },
  {
    name: 'conversionSaveWastage',
    method: 'POST',
    desc: '加工单管理--保存原材料耗损',
    path: '/purchase/conversion/saveWastage',
    mockPath: '/',
    params: {}
  },

  {
    name: 'conversionMachining',
    method: 'POST',
    desc: '加工单管理-完成加工确定(获取原材料配比)',
    path: '/purchase/conversion/machining',
    mockPath: '/',
    params: {}
  },

  {
    name: 'conversionList',
    method: 'POST',
    desc: '待加工单明细',
    path: '/purchase/conversion/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'conversionMachiningList',
    method: 'POST',
    desc: '加工明细',
    path: '/purchase/conversion/machining/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'conversionMachiningExport',
    method: 'POST',
    desc: '加工明细-当前条件导出',
    path: '/purchase/conversion/machining/export',
    mockPath: '/',
    params: {}
  },

  {
    name: 'financeList',
    method: 'POST',
    desc: '采购财务管理',
    path: '/purchase/finance/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'financeSave',
    method: 'POST',
    desc: '财务账号管理-保存-编辑',
    path: '/purchase/finance/save',
    mockPath: '/',
    params: {}
  },
  {
    name: 'financeDetail',
    method: 'POST',
    desc: '财务账号管理-编辑-查询',
    path: '/purchase/finance/detail',
    mockPath: '/',
    params: {}
  },

  {
    name: 'dataCheckingList',
    method: 'POST',
    desc: '销单入库核对',
    path: '/purchase/data/checking/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'dataCheckingExportLowerSingle',
    method: 'POST',
    desc: '销单入库数据核对-导出下单记录',
    path: '/purchase/data/checking/exportLowerSingle',
    mockPath: '/',
    params: {}
  },
  {
    name: 'dataCheckingExportPinOrder',
    method: 'POST',
    desc: '销单入库数据核对-导出销单记录',
    path: '/purchase/data/checking/exportPinOrder',
    mockPath: '/',
    params: {}
  },
  {
    name: 'dataCheckingExportStorageException',
    method: 'POST',
    desc: '销单入库数据核对-导出入库异常记录',
    path: '/purchase/data/checking/exportStorageException',
    mockPath: '/',
    params: {}
  },
  {
    name: 'dataCheckingExportPinOrderStorage',
    method: 'POST',
    desc: '销单入库数据核对-导出销单入库',
    path: '/purchase/data/checking/exportPinOrderStorage',
    mockPath: '/',
    params: {}
  },

  {
    name: 'generateLoad',
    method: 'POST',
    desc: '待采购产品列表',
    path: '/purchase/generate/load',
    mockPath: '/',
    params: {}
  },
  {
    name: 'generateCreatePurchase',
    method: 'POST',
    desc: '生成采购单-当前数据生成备库采购单',
    path: '/purchase/generate/createPurchase',
    mockPath: '/',
    params: {}
  },

  {
    name: 'purchaseList',
    method: 'POST',
    desc: '采购清单列表',
    path: '/purchase/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseListCount',
    method: 'POST',
    desc: '采购单管理-列表统计',
    path: '/purchase/listCount',
    mockPath: '/',
    params: {}
  },

  {
    name: 'detail',
    method: 'POST',
    desc: '采购单管理-采购详情',
    path: '/purchase/detail',
    mockPath: '/',
    params: {}
  },
  {
    name: 'getRemark',
    method: 'POST',
    desc: '采购单管理-获取备注',
    path: '/purchase/getRemark',
    mockPath: '/',
    params: {}
  },
  {
    name: 'saveRemark',
    method: 'POST',
    desc: '采购单管理-保存备注',
    path: '/purchase/saveRemark',
    mockPath: '/',
    params: {}
  },
  {
    name: 'deleteProduct',
    method: 'POST',
    desc: '采购单管理-采购单打回',
    path: '/purchase/deleteProduct',
    mockPath: '/',
    params: {}
  },
  {
    name: 'setProductState',
    method: 'POST',
    desc: '采购单管理-批量设置产品状态',
    path: '/purchase/setProductState',
    mockPath: '/',
    params: {}
  },
  {
    name: 'lowerSinglePage',
    method: 'POST',
    desc: '采购单管理-采购下单',
    path: '/purchase/lowerSinglePage',
    mockPath: '/',
    params: {}
  },
  {
    name: 'lowerSingle',
    method: 'POST',
    desc: '采购单管理-采购下单提交',
    path: '/purchase/lowerSingle',
    mockPath: '/',
    params: {}
  },
  {
    name: 'logGetLog',
    method: 'POST',
    desc: '采购单管理-查看日志',
    path: '/purchase/log/getLog',
    mockPath: '/',
    params: {}
  },

  {
    name: 'purchaseRepluse',
    method: 'POST',
    desc: '采购单管理-打回采购清单',
    path: '/purchase/purchaseRepluse',
    mockPath: '/',
    params: {}
  },

  {
    name: 'lowerSingleList',
    method: 'POST',
    desc: '采购订单管理',
    path: '/purchase/lowerSingle/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'lowerSingleCancel',
    method: 'POST',
    desc: '采购订单管理-作废',
    path: '/purchase/lowerSingle/cancel',
    mockPath: '/',
    params: {}
  },
  {
    name: 'lowerSingleExamine',
    method: 'POST',
    desc: '采购订单管理-审核',
    path: '/purchase/lowerSingle/examine',
    mockPath: '/',
    params: {}
  },
  {
    name: 'lowerSingleRecord',
    method: 'POST',
    desc: '采购订单管理-查询订单详情',
    path: '/purchase/lowerSingle/detail',
    mockPath: '/',
    params: {}
  },
  {
    name: 'lowerSingleDownloadImport',
    method: 'POST',
    desc: '采购订单管理-下载批量导入支付宝交易号模板',
    path: '/purchase/lowerSingle/downloadImport',
    mockPath: '/',
    params: {} //type1下载支付宝模板，2.追踪号
  },
  {
    name: 'historyPrice',
    method: 'POST',
    desc: '采购单管理-历史下单价格',
    path: '/purchase/historyPrice',
    mockPath: '/',
    params: {}
  },
  {
    name: 'historyRecord',
    method: 'POST',
    desc: '采购单管理-历史采购价格',
    path: '/purchase/historyRecord',
    mockPath: '/',
    params: {}
  },

  {
    name: 'pinOrderList',
    method: 'POST',
    desc: '销单管理',
    path: '/purchase/pinOrder/list',
    mockPath: '/',
    params: {}
  },
  {
    name: 'pinOrderExtractUnsold',
    method: 'POST',
    desc: '销单管理-提取未销单sku(批量提取未销单SKu信息)',
    path: '/purchase/pinOrder/extractUnsold',
    mockPath: '/',
    params: {}
  },

  {
    name: 'pinOrderDetail',
    method: 'POST',
    desc: '销单管理-销单信息查询',
    path: '/purchase/pinOrder/detail',
    mockPath: '/',
    params: {}
  },
  {
    name: 'pinOrderPinOrder',
    method: 'POST',
    desc: '销单管理-确定销单',
    path: '/purchase/pinOrder/pinOrder',
    mockPath: '/',
    params: {}
  },

  {
    name: 'finishedPrintFinidhed',
    method: 'POST',
    desc: '加工单管理-批量打印加工单/撤销打印加工单',
    path: '/purchase/finished/printFinidhed',
    mockPath: '/',
    params: {}
  },
  {
    name: 'pinOrderPrintPurchase',
    method: 'POST',
    desc: '销单管理-打印进货单',
    path: '/purchase/pinOrder/printPurchase',
    mockPath: '/',
    params: {}
  },
  {
    name: 'printPurchaseGraph',
    method: 'POST',
    desc: '采购单管理-打印采购单（有图）用上面那个，打印采购单的那个就可以了',
    path: '/purchase/print/purchaseGraph',
    mockPath: '/',
    params: {}
  },
  {
    name: 'printStorage',
    method: 'POST',
    desc: '采购单管理-打印入库单',
    path: '/purchase/print/storage',
    mockPath: '/',
    params: {}
  },
  {
    name: 'printSingleProd',
    method: 'POST',
    desc: '采购单管理-打印单个产品条码',
    path: '/purchase/print/singleProd',
    mockPath: '/',
    params: {}
  },
  {
    name: 'printPurchaseProd',
    method: 'POST',
    desc: '采购单管理-打印采购单产品条码',
    path: '/purchase/print/purchaseProd',
    mockPath: '/',
    params: {}
  },
  {
    name: 'printPurchase',
    method: 'POST',
    desc: '采购单管理-打印采购单',
    path: '/purchase/print/purchase',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseSendSms',
    method: 'POST',
    desc: '采购单管理-发送短信',
    path: '/purchase/sendSms',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseGetFilePath',
    method: 'POST',
    desc: '采购单管理-获取路径',
    path: '/purchase/getFilePath',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseSendEmail',
    method: 'POST',
    desc: '采购单管理-发送邮件',
    path: '/purchase/sendEmail',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchasePrintContract',
    method: 'POST',
    desc: '采购单管理-打印合同',
    path: '/purchase/print/contract',
    mockPath: '/',
    params: {}
  },
  {
    name: 'purchaseGetDropdownBox',
    method: 'POST',
    desc: '支付账号',
    path: '/purchase/finance/getDropdownBox',
    mockPath: '/',
    params: {}
  }
]
