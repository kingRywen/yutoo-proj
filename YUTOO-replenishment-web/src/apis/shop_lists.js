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

// 获取店铺产品图片列表
const STORE_PRODUCT_IMG = {
    method: 'post',
    url: "/store/img/list",
}

// 批量上传产品图片
const STORE_IMG_UPLOAD_BATCH = {
    method: 'post',
    url: "/store/img/upload/batch",
}

// 删除店铺产品图片
const STORE_IMG_DELETE = {
    method: 'post',
    url: "/store/img/delete",
}

// 应用平台图片
const STORE_IMG_UPDATE_PLATFORM = {
    method: 'post',
    url: "/store/img/update/platform",
}

// 获取属性分组
const STORE_PRODUCT_PROP_GROUP = {
    method: 'post',
    url: "/store/product/prop/group",
}

//根据平台类目获取系统类目
//2018-10-20
const SYSTEMCATEGORY = {
    method: 'post',
    url: "/CategoryM/findCategoryByCategoryPlatformId"
}


module.exports = {
    SYSTEMCATEGORY,

    GET_ERP_SHOP_LISTS,
    STORE_PRODUCT_PROP_GROUP,
    STORE_IMG_DELETE,
    STORE_IMG_UPDATE_PLATFORM,
    STORE_PRODUCT_IMG,
    STORE_IMG_UPLOAD_BATCH,
    STORE_PRODUCT_AUDIT,
    STORE_PRODUCT_PUBLISH_FAIL_REASON,
    STORE_PRODUCT_INFO,
    STORE_PRODUCT_EDIT,

}