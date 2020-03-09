// 根据状态获取店铺产品列表
const STORE_PRODUCT_LIST_BY_STATUS = {
  method: 'post',
  url: "/store/product/list/by/status",
}

// 根据状态获取店铺产品列表
const STORE_PRODUCT_INFO = {
  method: 'post',
  url: "/store/product/info",
}

// 店铺产品审核
const STORE_PRODUCT_AUDIT = {
  method: 'post',
  url: "/store/product/audit",
}

module.exports = {
  STORE_PRODUCT_LIST_BY_STATUS,
  STORE_PRODUCT_INFO,
  STORE_PRODUCT_AUDIT,
}