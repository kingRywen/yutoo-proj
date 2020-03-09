// 查看变体
const PRODUCT_VARIANT_PURCHASE_TAB = {
  method: 'post',
  url: "/product/variant/purchase/tab",
}

// 获取采购信息差异字段集合
const PRODUCT_FIELD_PURCHASE_VARIANT_DIFFERENCE = {
  method: 'post',
  url: "/product/field/purchase/variant/difference",
}

// 变体修改（有效无效）
const PRODUCT_VARIANT_UPDATE = {
  method: 'post',
  url: "/product/variant/update",
}

// 供应商信息（修改）
const PRODUCT_SUPPLIER_REL_UPDATE = {
  method: 'post',
  url: "/product/supplier/rel/update",
}

// 变体修改（有效无效）
const PRODUCT_ENTRY_INFO_VARIANT_TAB = {
  method: 'post',
  url: "/product/entry/info/tab",
}

// 
const SUPPLIER_LIST_ALL = {
  method: 'get',
  url: "/Supplier/list/all",
}

// 供应商信息(新增）
const PRODUCT_SUPPLIER_REL_SAVE = {
  method: 'post',
  url: "/product/supplier/rel/save",
}

// 供应商信息（查看）
const PRODUCT_SUPPLIER_REL_INFO = {
  method: 'post',
  url: "/product/supplier/rel/info",
}

// 变体修改（有效无效）
const PRODUCT_PURCHASE_COMMIT = {
  method: 'post',
  url: "/product/purchase/commit",
}


// 产品采购信息保存
const PRODUCT_PURCHASE_SAVE = {
  method: 'post',
  url: "/product/purchase/save",
}

// 产品母体采购编辑（获取价格数量页面数据）
const PRODUCT_PRICE_PARENT_TAB = {
  method: 'post',
  url: "/product/price/tab",
}

// 产品变体采购编辑（获取价格数量页面数据）
const PRODUCT_PRICE_VARIANT_TAB = {
  method: 'post',
  url: "/product/price/variant/tab",
}

// 产品母体采购编辑（获取报关信息页面数据）
const PRODUCT_ENTRY_INFO_PARENT_TAB = {
  method: 'post',
  url: "/product/entry/info/tab",
}

// 头程管理（列表）
const TRANSPORT_FIRST_LIST = {
  method: 'post',
  url: "/transport/first/list",
}

// 头程管理（新增）
const TRANSPORT_FIRST_SAVE = {
  method: 'post',
  url: "/transport/first/save",
}

// 头程管理（目的地列表  国家）
const TRANSPORT_FIRST_NATION = {
  method: 'post',
  url: "/transport/first/nation",
}

// 头程页面（列表）
const PRODUCT_TRANSPORT_REL_LIST = {
  method: 'post',
  url: "/product/transport/rel/list",
}

// 头程页面（修改）
const PRODUCT_TRANSPORT_REL_UPDATE = {
  method: 'post',
  url: "/product/transport/rel/update",
}

// 头程页面（移除）
const PRODUCT_TRANSPORT_REL_REMOVE = {
  method: 'post',
  url: "/product/transport/rel/remove",
}

// 导入供应商报价 保存
const PRODUCT_SUPPLIER_PRICE_UPLOAD_SAVE = {
  method: 'post',
  url: "/product/supplier/price/upload/save",
}

// 获取 供应商接口
const PRODUCT_SUPPLIER_REL_LIST = {
  method: 'post',
  url: "/product/supplier/rel/list",
}

// 导出列表的字段
const CUSTOM_DOWNLOAD_FIELDST = {
  method: 'get',
  url: "/product/custom/download/field/list",
}

// 导出
const PRODUCT_CUSTOM_DOWNLOAD = {
  method: 'post',
  url: "/product/custom/download",
}

// 批量清除退税率
const PRODUCT_PRICE_BATCH_INVOICE_TAX = {
  method: 'post',
  url: "/product/price/batch/empty/invoice/tax",
}

// 批量提取自定义SKu
const PRODUCT_BATCH_CUSTOM_SKU_GET = {
  method: 'post',
  url: "/product/batch/custom/sku/get",
}

// 批量删除配件list获取
const PRODUCT_VARIANT_REL_BATCH_REMOVE_LIST = {
  method: 'post',
  url: "/product/variant/rel/batch/remove/list",
}

// 头程选择（确认选择）
const PRODUCT_TRANSPORT_REL_SELECT = {
  method: 'post',
  url: "/product/transport/rel/select",
}

// 头程选择（确认选择）
const PRODUCT_ENTRY_PRICE_PERCENT_LIST = {
  method: 'get',
  url: "/product/entry/price/percent/list",
}

// 头程选择（确认选择）
const PRODUCT_PRICE_REL_LIST = {
  method: 'post',
  url: "/product/price/rel/list",
}

// 批量修改
const PRODUCT_ENTRY_PRICE_PERCENT_BATCH_UPDATE = {
  method: 'post',
  url: "/product/entry/price/percent/batch/update",
}

// 批量修改
const PRODUCT_ENTRY_PRICE_LIST = {
  method: 'post',
  url: "/product/entry/price/list",
}

module.exports = {
  PRODUCT_VARIANT_PURCHASE_TAB,
  PRODUCT_TRANSPORT_REL_REMOVE,
  PRODUCT_ENTRY_PRICE_LIST,
  PRODUCT_ENTRY_PRICE_PERCENT_BATCH_UPDATE,
  PRODUCT_ENTRY_PRICE_PERCENT_LIST,
  PRODUCT_TRANSPORT_REL_SELECT,
  PRODUCT_PRICE_REL_LIST,
  PRODUCT_SUPPLIER_REL_INFO,
  PRODUCT_VARIANT_REL_BATCH_REMOVE_LIST,
  PRODUCT_CUSTOM_DOWNLOAD,
  PRODUCT_BATCH_CUSTOM_SKU_GET,
  PRODUCT_PRICE_BATCH_INVOICE_TAX,
  PRODUCT_FIELD_PURCHASE_VARIANT_DIFFERENCE,
  PRODUCT_VARIANT_UPDATE,
  SUPPLIER_LIST_ALL,
  CUSTOM_DOWNLOAD_FIELDST,
  PRODUCT_SUPPLIER_REL_UPDATE,
  PRODUCT_SUPPLIER_REL_LIST,
  PRODUCT_SUPPLIER_PRICE_UPLOAD_SAVE,
  PRODUCT_ENTRY_INFO_VARIANT_TAB,
  PRODUCT_PURCHASE_COMMIT,
  PRODUCT_PURCHASE_SAVE,
  PRODUCT_PRICE_PARENT_TAB,
  PRODUCT_SUPPLIER_REL_SAVE,
  PRODUCT_PRICE_VARIANT_TAB,
  PRODUCT_ENTRY_INFO_PARENT_TAB,
  TRANSPORT_FIRST_LIST,
  TRANSPORT_FIRST_SAVE,
  TRANSPORT_FIRST_NATION,
  PRODUCT_TRANSPORT_REL_LIST,
  PRODUCT_TRANSPORT_REL_UPDATE,
}