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
  url: "/product/price/parent/tab",
}

// 产品母体采购编辑（获取报关信息页面数据）
const PRODUCT_ENTRY_INFO_PARENT_TAB = {
  method: 'post',
  url: "/product/entry/info/parent/tab",
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

module.exports = {
  PRODUCT_VARIANT_PURCHASE_TAB,
  PRODUCT_FIELD_PURCHASE_VARIANT_DIFFERENCE,
  PRODUCT_VARIANT_UPDATE,
  PRODUCT_PURCHASE_COMMIT,
  PRODUCT_PURCHASE_SAVE,
  PRODUCT_PRICE_PARENT_TAB,
  PRODUCT_ENTRY_INFO_PARENT_TAB,
  TRANSPORT_FIRST_LIST,
  TRANSPORT_FIRST_SAVE,
  TRANSPORT_FIRST_NATION,
  PRODUCT_TRANSPORT_REL_LIST,
  PRODUCT_TRANSPORT_REL_UPDATE,
}