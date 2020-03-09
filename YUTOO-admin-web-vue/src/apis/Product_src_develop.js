// 销售提报-搜索
const PRODUCTSRCDEVELOP_LIST = {
  method: 'post',
  url: "/ProductSrcDevelop/list",
}

// 销售提报-搜索
const PRODSUPPLIERAUDIT_LIST = {
  method: 'post',
  url: "/ProdSupplierAudit/list",
}

// 供应商产品提报-搜索
const PRODSRCSUPPLIER_LIST = {
  method: 'post',
  url: "/ProdSrcSupplier/list",
}

// 销售提报-创建
const PRODUCTSRCDEVELOP_SAVE = {
  method: 'post',
  url: "/ProductSrcDevelop/save",
}

// 销售提报-创建
const PRODUCTSRCDEVELOP_INFO = {
  method: 'post',
  url: "/ProductSrcDevelop/info",
}

// 销售提报-编辑
const PRODUCTSRCDEVELOP_UPDATE = {
  method: 'post',
  url: "/ProductSrcDevelop/update",
}

// 销售提报-状态操作
const PRODUCTSRCDEVELOP_UPDATESTATUS = {
  method: 'post',
  url: "/ProductSrcDevelop/updateStatus",
}

// 销售提报-状态操作
const PRODUCTSRCDEVELOP_BATCHUPDATESTATUS = {
  method: 'post',
  url: "/ProductSrcDevelop/batchUpdateStatus",
}

// 销售提报-操作日志
const PRODSRCDEVELOPLOG_LIST = {
  method: 'post',
  url: "/ProdSrcDevelopLog/list",
}

// 开发人员
const DEVELOP_USER_LIST = {
  method: 'get',
  url: "/product/develop/user/list",
}

// 采购人员
const PURCHASE_USER_LIST = {
  method: 'get',
  url: "/product/purchase/user/list",
}

// 获取平台编辑人员列表
const PRODUCT_PLATFORM_INFO_EDIT_LIST = {
  method: 'get',
  url: "/product/platform/info/edit/list",
}

// 供应商产品提报-提报
const PRODSRCSUPPLIER_SAVE = {
  method: 'post',
  url: "/ProdSrcSupplier/save",
}

// 供应商产品提报-提报
const PRODSUPPLIERAUDIT_REMOVE = {
  method: 'post',
  url: "/ProdSupplierAudit/remove",
}

// 供应商产品提报审核-审核
const PRODSUPPLIERAUDIT_UPDATESTATUS = {
  method: 'post',
  url: "/ProdSupplierAudit/updateStatus",
}

// 供应商产品提报-删除
const PRODSRCSUPPLIER_REMOVE = {
  method: 'post',
  url: "/ProdSrcSupplier/remove",
}

// 供应商产品提报-编辑初始化数据
const PRODSRCSUPPLIER_INFO = {
  method: 'post',
  url: "/ProdSrcSupplier/info",
}

// 供应商产品提报-提报审核
const PRODSRCSUPPLIER_UPDATESTATUS = {
  method: 'post',
  url: "/ProdSrcSupplier/updateStatus",
}


// 供应商产品提报-复制添加
const PRODSRCSUPPLIER_CLONE = {
  method: 'post',
  url: "/ProdSrcSupplier/clone",
}

// 销售提报-导出Excel
const PRODUCTSRCDEVELOP_EXCELEXPORT = {
  method: 'post',
  url: "/ProductSrcDevelop/excelExport",
}

// 平台采集-搜索
const PRODUCTSRCCOLLECT_LIST = {
  method: 'post',
  url: "/ProductSrcCollect/list",
}

// 获取账户
const SYS_USER_LISTALL = {
  method: 'post',
  url: "/sys/user/listAll",
}


module.exports = {
  PRODUCTSRCDEVELOP_LIST,
  PRODSRCSUPPLIER_REMOVE,
  SYS_USER_LISTALL,
  PRODUCTSRCDEVELOP_EXCELEXPORT,
  PRODSRCSUPPLIER_UPDATESTATUS,
  PRODSRCSUPPLIER_CLONE,
  PRODUCTSRCCOLLECT_LIST,
  PRODSRCSUPPLIER_INFO,
  PRODSUPPLIERAUDIT_UPDATESTATUS,
  PRODSRCSUPPLIER_SAVE,
  PRODUCTSRCDEVELOP_BATCHUPDATESTATUS,
  PRODSUPPLIERAUDIT_REMOVE,
  DEVELOP_USER_LIST,
  PRODSRCSUPPLIER_LIST,
  PURCHASE_USER_LIST,
  PRODUCT_PLATFORM_INFO_EDIT_LIST,
  PRODUCTSRCDEVELOP_UPDATE,
  PRODSUPPLIERAUDIT_LIST,
  PRODUCTSRCDEVELOP_UPDATESTATUS,
  PRODSRCDEVELOPLOG_LIST,
  PRODUCTSRCDEVELOP_SAVE,
  PRODUCTSRCDEVELOP_INFO,
}