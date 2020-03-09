export default [

  /**
   *
   * 公用接口
   *
   */
  {
    name: 'wmWarehouseGlobalType',
    method: 'POST',
    desc: '仓库类型列表查询',
    path: '/WmWarehouse/global/type',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalUnitList',
    method: 'POST',
    desc: '仓库获取库位规格单位列表(cm/dm/m)',
    path: '/WmWarehouse/global/unitList',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalStatus',
    method: 'POST',
    desc: '仓库状态列表查询',
    path: '/WmWarehouse/global/status',
    params: {}
  },
  {
    name: 'wmLocationNormGlobalList',
    method: 'POST',
    desc: '查询库位规格列表',
    path: '/WmLocationNorm/global/list',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalLocationNorm',
    method: 'POST',
    desc: '查询库位大小',
    path: '/WmWarehouse/global/location/norm',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalList',
    method: 'POST',
    desc: '仓库列表查询',
    path: '/WmWarehouse/global/list',
    mock: false,
    params: {}
  },
  {
    name: 'wmWarehouseGlobalDivisionList',
    method: 'POST',
    desc: '仓库分区列表查询',
    path: '/WmWarehouse/global/division/list',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalLocationStatus',
    method: 'POST',
    desc: '仓库库位状态列表查询',
    path: '/WmWarehouse/global/location/status',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalLocationActivated',
    method: 'POST',
    desc: '仓库库位激活状态列表查询',
    path: '/WmWarehouse/global/location/activated',
    params: {}
  },
  {
    name: 'wmLocationGlobalList',
    method: 'POST',
    desc: '仓库库位列表查询',
    path: '/WmLocation/global/list',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalCountry',
    method: 'POST',
    desc: '国家列表查询',
    path: '/WmWarehouse/global/country',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalArea',
    method: 'POST',
    desc: '省/市/区列表查询',
    path: '/WmWarehouse/global/area',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalDocumentTypes',
    method: 'POST',
    desc: '单据模版类型列表查询',
    path: '/WmWarehouse/global/document/types',
    params: {}
  },
  {
    name: 'wmWarehouseGlobalDocumentSpecifications',
    method: 'POST',
    desc: '单据模版规格查询',
    path: '/WmWarehouse/global/document/specifications',
    params: {}
  },
  {
    name: 'wmDocumentModelGlobalModel',
    method: 'POST',
    desc: '根据单据类型查询模版数据',
    path: '/WmDocumentModel/global/model',
    params: {}
  },
  {
    name: 'globalReportList',
    method: 'POST',
    desc: '报告中心列表查询（分页）',
    path: '/GlobalReport/list',
    params: {}
  },

  /**
   *
   * 仓库管理
   *
   */
  {
    name: 'wmWarehouseList',
    method: 'POST',
    desc: '仓库列表检索（分页）',
    path: '/WmWarehouse/list',
    params: {}
  },
  {
    name: 'wmWarehouseCreate',
    method: 'POST',
    desc: '创建仓库信息',
    showSuccess: true,
    path: '/WmWarehouse/create',
    params: {}
  },
  {
    name: 'wmWarehouseUpdate',
    method: 'POST',
    desc: '修改仓库信息',
    showSuccess: true,
    path: '/WmWarehouse/update',
    params: {}
  },
  {
    name: 'wmWarehousePrintLayout',
    method: 'POST',
    desc: '打印仓库布局图',
    path: '/WmWarehouse/print/layout',
    params: {}
  },
  {
    name: 'wmWarehouseDelete',
    method: 'POST',
    desc: '批量删除仓库',
    showSuccess: true,
    path: '/WmWarehouse/delete',
    params: {}
  },
  {
    name: 'wmWarehouseActivated',
    method: 'POST',
    desc: '激活，禁用仓库',
    showSuccess: true,
    path: '/WmWarehouse/activated',
    params: {}
  },
  {
    name: 'wmWarehouseDivisionCreate',
    method: 'POST',
    desc: '批量创建分区',
    showSuccess: true,
    path: '/WmWarehouseDivision/create',
    params: {}
  },
  {
    name: 'wmWarehouseDivisionUpdate',
    method: 'POST',
    desc: '批量修改分区',
    showSuccess: true,
    path: '/WmWarehouseDivision/create_1551078131350',
    params: {}
  },
  {
    name: 'wmWarehouseDivisionDelete',
    method: 'POST',
    showSuccess: true,
    desc: '批量删除分区',
    path: '/WmWarehouseDivision/delete',
    params: {}
  },
  {
    name: 'wmWarehouseDivisionList',
    method: 'POST',
    desc: '搜索分区（分页）',
    path: '/WmWarehouseDivision/list',
    params: {}
  },
  /**
   *
   * 仓库管理
   *
   */
  {
    name: 'wmLocationUploadConfirm',
    method: 'POST',
    desc: '导入库位模版确认',
    showSuccess: true,
    path: '/WmLocation/upload/confirm',
    params: {}
  },
  {
    name: 'wmLocationUpload',
    method: 'POST',
    desc: '导入库位模版',
    path: '/WmLocation/upload',
    params: {}
  },
  {
    name: 'wmLocationDownload',
    method: 'POST',
    desc: '下载导入库位模版',
    path: '/WmLocation/download',
    params: {}
  },
  {
    name: 'wmLocationList',
    method: 'POST',
    desc: '库位查询（分页）',
    path: '/WmLocation/list',
    params: {}
  },
  {
    name: 'wmLocationCreate',
    method: 'POST',
    desc: '批量创建库位',
    path: '/WmLocation/create',
    params: {}
  },
  {
    name: 'wmLocationUpdate',
    method: 'POST',
    desc: '修改库位',
    path: '/WmLocation/update',
    params: {}
  },
  {
    name: 'wmLocationDelete',
    method: 'POST',
    desc: '批量删除库位',
    showSuccess: true,
    path: '/WmLocation/delete',
    params: {}
  },
  {
    name: 'wmLocationUpdateActivated',
    method: 'POST',
    desc: '批量库位激活状态修改',
    showSuccess: true,
    path: '/WmLocation/update/activated',
    params: {}
  },
  {
    name: 'wmLocationUpdateSluggish',
    method: 'POST',
    desc: '批量设置库位为呆滞库位',
    showSuccess: true,
    path: '/WmLocation/update/sluggish',
    params: {}
  },
  {
    name: 'wmLocationUpdateNormal',
    method: 'POST',
    desc: '批量设置库位为正常库位',
    showSuccess: true,
    path: '/WmLocation/update/normal',
    params: {}
  },
  {
    name: 'wmLocationUpdateNorm',
    method: 'POST',
    desc: '批量设置库位规格',
    showSuccess: true,
    path: '/WmLocation/update/norm',
    params: {}
  },
  {
    name: 'wmLocationFindLocations',
    method: 'POST',
    desc: '根据库位ID列表查询库位信息',
    path: '/WmLocation/find/locations',
    params: {}
  },
  {
    name: 'wmLocationNormCreate',
    method: 'POST',
    desc: '创建库位规格',
    showSuccess: true,
    path: '/WmLocationNorm/create',
    params: {}
  },
  {
    name: 'wmLocationNormUpdate',
    method: 'POST',
    desc: '修改库位规格',
    showSuccess: true,
    path: '/WmLocationNorm/update',
    params: {}
  },
  {
    name: 'wmLocationNormDelete',
    method: 'POST',
    desc: '批量删除库位规格',
    showSuccess: true,
    path: '/WmLocationNorm/delete',
    params: {}
  },
  {
    name: 'wmLocationNormList',
    method: 'POST',
    desc: '搜索库位规格（分页）',
    path: '/WmLocationNorm/list',
    params: {}
  },

  /**
   *
   * 所有库存
   *
   */
  {
    name: 'wmInventoryEarlyWarning',
    method: 'POST',
    showSuccess: true,
    desc: '全局产品预警库存设置',
    path: '/WmInventory/early/warning',
    params: {}
  },
  {
    name: 'wmInventorySearchTypes',
    method: 'POST',
    desc: '搜索所有仓库库存搜索类型列表',
    path: '/WmInventory/searchTypes',
    params: {}
  },
  {
    name: 'wmRepertoryStockIn',
    method: 'POST',
    desc: '获取产品入库记录',
    path: '/wm/repertory/stock/in',
    params: {}
  },
  {
    name: 'wmInventoryExportStorage',
    method: 'POST',
    desc: '导出入库记录',
    path: '/WmInventory/export/storage',
    params: {}
  },
  {
    name: 'wmInventoryPlatformStandardprice',
    method: 'POST',
    desc: '单个产品平台标准价格列表查询',
    path: '/WmInventory/platform/standardprice',
    params: {}
  },
  {
    name: 'wmRepertoryStockOut',
    method: 'POST',
    desc: '获取出库记录',
    path: '/wm/repertory/stock/out',
    params: {}
  },
  {
    name: 'wmRepertoryStockInPurchase',
    method: 'POST',
    desc: '获取入库采购价',
    path: '/wm/repertory/stock/in/purchase',
    params: {}
  },
  {
    name: 'wmInventoryConfirmQuality',
    method: 'POST',
    desc: '上传质量问题文件确认',
    path: '/WmInventory/confirm/quality',
    params: {}
  },
  {
    name: 'wmInventoryDownloadQuality',
    method: 'POST',
    desc: '下载质量问题导入模版',
    path: '/WmInventory/download/quality',
    params: {}
  },
  {
    name: 'wmInventoryUploadQuality',
    method: 'POST',
    desc: '上传质量问题文件',
    path: '/WmInventory/upload/quality',
    params: {}
  },
  {
    name: 'wmInventoryProductBase',
    method: 'POST',
    singleLoading: true,
    desc: '仓库产品基础信息查询',
    path: '/WmInventory/product/base',
    params: {}
  },
  {
    name: 'wmInventoryList',
    method: 'POST',
    desc: '搜索所有仓库库存（分页）',
    path: '/WmInventory/list',
    params: {}
  },
  {
    name: 'wmInventoryProductInventory',
    method: 'POST',
    desc: '仓库产品库存查询',
    path: '/WmInventory/product/inventory',
    params: {}
  },
  {
    name: 'wmInventoryProductLocationInventory',
    method: 'POST',
    desc: '仓库产品库位占用查询(分页)',
    path: '/WmInventory/product/location/inventory',
    params: {}
  },
  {
    name: 'wmInventoryPendingLocal',
    method: 'POST',
    desc: '仓库产品待收库存查询（本地仓）',
    path: '/WmInventory/pending/local',
    params: {}
  },
  {
    name: 'wmInventoryPendingOther',
    method: 'POST',
    desc: '仓库产品待收库存查询（平台仓或海外仓）',
    path: '/WmInventory/pending/other',
    params: {}
  },
  {
    name: 'wmInventoryProductPlug',
    method: 'POST',
    desc: '仓库产品强电插头查询',
    path: '/WmInventory/product/plug',
    params: {}
  },
  {
    name: 'wmInventoryProductList',
    method: 'POST',
    desc: '仓库产品参数信息查询(用于导出前查询)',
    path: '/WmInventory/product/list',
    params: {}
  },
  {
    name: 'wmInventoryProductCodeList',
    method: 'POST',
    desc: '获取产品条码',
    path: '/WmInventory/product/code/list',
    params: {}
  },
  {
    name: 'wmInventoryExportCurrent',
    method: 'POST',
    desc: '当前条件导出库存信息',
    path: '/WmInventory/export/current',
    params: {}
  },
  {
    name: 'wmInventoryExportInventory',
    method: 'POST',
    desc: '导出全部库存',
    path: '/WmInventory/export/inventory',
    params: {}
  },
  {
    name: 'wmInventoryProductEarlyWarning',
    method: 'POST',
    showSuccess: true,
    desc: '单产品预警库存设置',
    path: '/WmInventory/product/early/warning',
    params: {}
  },

  /**
   *
   * 面单 发票管理
   *
   */
  {
    name: 'wmDocumentModelMCopy',
    method: 'POST',
    showSuccess: true,
    desc: '自定义面单/发票复制',
    path: '/WmDocumentModelM/copy',
    params: {}
  },
  {
    name: 'wmDocumentModelCopy',
    method: 'POST',
    showSuccess: true,
    desc: '常用面单复制添加',
    path: '/WmDocumentModel/copy',
    params: {}
  },
  {
    name: 'wmDocumentModelPage',
    method: 'POST',
    desc: '常用面单搜索(分页)',
    path: '/WmDocumentModel/page',
    params: {}
  },
  {
    name: 'wmDocumentModelGet',
    method: 'POST',
    desc: '常用面单查询',
    path: '/WmDocumentModel/get',
    params: {}
  },
  {
    name: 'wmDocumentModelMPage',
    method: 'POST',
    desc: '自定义面单/发票查询（分页）',
    path: '/WmDocumentModelM/page',
    params: {}
  },
  {
    name: 'wmDocumentModelMGet',
    method: 'POST',
    desc: '自定义面单/发票单数据查询',
    path: '/WmDocumentModelM/get',
    params: {}
  },
  {
    name: 'wmDocumentModelMSave',
    method: 'POST',
    showSuccess: true,
    desc: '自定义面单/发票 新增 修改',
    path: '/WmDocumentModelM/save',
    params: {}
  },
  {
    name: 'wmDocumentModelMRemove',
    method: 'POST',
    showSuccess: true,
    desc: '自定义面单/发票批量删除',
    path: '/WmDocumentModelM/remove',
    params: {}
  }
]
