// 获取店铺产品列表
const GET_ERP_SHOP_LISTS = {
    method: 'post',
    url: "/store/product/list/child",
}

// 店铺产品审核
const STORE_PRODUCT_AUDIT = {
    method: 'post',
    url: "/store/product/audit",
}

// 获取上架失败信息
const STORE_PRODUCT_PUBLISH_FAIL_REASON = {
    method: 'post',
    url: "/store/product/publish/fail/reason",
}

// 获取店铺产品信息
const STORE_PRODUCT_INFO = {
    method: 'post',
    url: "/store/product/info",
}

// 编辑店铺产品
const STORE_PRODUCT_EDIT = {
    method: 'post',
    url: "/store/product/edit",
}

module.exports = {
    GET_ERP_SHOP_LISTS,
    STORE_PRODUCT_AUDIT,
    STORE_PRODUCT_PUBLISH_FAIL_REASON,
    STORE_PRODUCT_INFO,
    STORE_PRODUCT_EDIT,

}