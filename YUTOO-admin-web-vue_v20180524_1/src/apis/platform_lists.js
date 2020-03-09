//获取平台列表
const GET_ERP_PLATFORM_LISTS = {
    method: 'post',
    url: '/product/platform/parent/list'
}

// 导入产品（一键导入）
const PRODUCT_PLATFORM_LEAD_ALL = {
    method: 'post',
    url: '/product/platform/lead/all'
}

// 平台信息编辑（获取站点类目）
const PRODUCT_PLT_DETAIL_A_EN_CATEGORY = {
    method: 'post',
    url: '/product/plt/detail/a/en/category'
}

// 平台信息编辑（获取模板字段）
const PRODUCT_PLT_DETAIL_A_EN_FIELD = {
    method: 'post',
    url: '/product/plt/detail/a/en/field'
}

// 平台信息编辑（获取站点模板 选择）
const PRODUCT_PLT_DETAIL_A_EN_MODULE = {
    method: 'post',
    url: '/product/plt/detail/a/en/module'
}

// 平台信息母体保存（保存该语种平台信息）
const PRODUCT_PLT_DETAIL_A_EN_SAVE = {
    method: 'post',
    url: '/product/plt/detail/a/en/save'
}

// 平台信息母体编辑(获取英语页面字段）
const PRODUCT_PLT_DETAIL_A_EN_TAB = {
    method: 'post',
    url: '/product/plt/detail/a/en/tab'
}

// 获取预上传店铺列表
const PRODUCT_PREPARE_STORE_LIST = {
    method: 'post',
    url: '/product/prepare/store/list'
}

// 平台选择店铺（保存预上传店铺）
const PRODUCT_PREPARE_STORE_SAVE = {
    method: 'post',
    url: '/product/prepare/store/save'
}


// 平台审核（图片/平台）
const PRODUCT_PLT_AUDIT_UPDATE = {
    method: 'post',
    url: '/product/plt/audit/update'
}

// 平台产品分配编辑人员（多语种）
const PRODUCT_PLATFORM_OPERATION_UPDATE = {
    method: 'post',
    url: '/product/platform/operation/update'
}

// 选择导入(分页母体列表)
const PRODUCT_PLATFORM_LEAD_SELECT_LIST = {
    method: 'post',
    url: '/product/platform/lead/select/list'
}

// 导入产品（选择导入）
const PRODUCT_PLATFORM_LEAD_SELECT = {
    method: 'post',
    url: '/product/platform/lead/select'
}

// 获取图片信息
const PRODUCT_IMAGE_INFO = {
    method: 'post',
    url: '/product/image/info'
}

// 提交刊登上架
const PUTAWAY_COMMIT = {
    method: 'post',
    url: '/putaway/commit'
}

// 选择店铺
const PUTAWAY_STORE_CHOOSE = {
    method: 'post',
    url: '/putaway/store/choose'
}

// 根据语种获取店铺
const PUTAWAY_STORE_INFO = {
    method: 'post',
    url: '/putaway/store/info'
}

// 获取根据产品id获取语种列表，变体
const PUTAWAY_LANGUAGE_INFO = {
    method: 'post',
    url: '/putaway/language/info'
}

// 根据产品id获取产品信息和产品上架属性
const PUTAWAY_PRODUCT_INFO = {
    method: 'post',
    url: '/putaway/product/info'
}

// 下载图片压缩包
const PRODUCT_IMAGE_DOWNLOAD = {
    method: 'post',
    url: '/product/image/path'
}

// // 下载图片压缩包
// const PRODUCT_IMAGE_DOWNLOAD = {
//     method: 'post',
//     url: '/product/image/download'
// }

// 平台产品变体列表
const PRODUCT_PLATFORM_VARIANT_LIST = {
    method: 'post',
    url: '/product/platform/variant/list'
}

// 平台语种变体信息编辑（获取英语变体编辑页面数据）
const PRODUCT_PLT_VARIANT_A_EN_TAB = {
    method: 'post',
    url: '/product/plt/variant/a/en/tab'
}

// // 获取产品信息和产品属性
// const PUTAWAY_PRODUCT_INFO = {
//     method: 'post',
//     url: '/putaway/product/info'
// }

// 上传文件
const PRODUCT_IMAGE_UPLOAD = {
    method: 'post',
    url: '/product/image/upload'
}

// 平台信息多语种审核(提交审核结果）
const PRODUCT_PLT_LANGUAGE_AUDIT_UPDATE = {
    method: 'post',
    url: '/product/plt/language/audit/update'
}

// 平台信息多语种审核(获取审核信息）
const PRODUCT_PLT_LANGUAGE_AUDIT_INFO = {
    method: 'post',
    url: '/product/plt/language/audit/info'
}

// 平台产品母体列表
const PRODUCT_PLATFORM_PARENT_LIST = {
    method: 'post',
    url: '/product/platform/parent/list'
}

// 平台信息语种提交
const PRODUCT_PLT_DETAIL_A_EN_COMMIT = {
    method: 'post',
    url: '/product/plt/detail/a/en/commit'
}

// 上传图片签名获取
const IMG_GET_OSS_SIGNATURE = {
    method: 'post',
    url: '/img/get/oss/signature'
}



module.exports = {
    GET_ERP_PLATFORM_LISTS,
    PUTAWAY_PRODUCT_INFO,
    IMG_GET_OSS_SIGNATURE,
    PRODUCT_PLT_DETAIL_A_EN_COMMIT,
    PRODUCT_PLATFORM_PARENT_LIST,
    PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
    PRODUCT_IMAGE_UPLOAD,
    PRODUCT_PLT_LANGUAGE_AUDIT_UPDATE,
    PRODUCT_PLT_VARIANT_A_EN_TAB,
    PRODUCT_PLATFORM_VARIANT_LIST,
    PRODUCT_IMAGE_DOWNLOAD,
    PUTAWAY_STORE_INFO,
    PUTAWAY_LANGUAGE_INFO,
    PRODUCT_PLT_DETAIL_A_EN_CATEGORY,
    PRODUCT_PLT_DETAIL_A_EN_FIELD,
    PRODUCT_IMAGE_INFO,
    PRODUCT_PLT_DETAIL_A_EN_SAVE,
    PRODUCT_PLATFORM_LEAD_SELECT_LIST,
    PUTAWAY_STORE_CHOOSE,
    PRODUCT_PLT_DETAIL_A_EN_MODULE,
    PRODUCT_PREPARE_STORE_LIST,
    PRODUCT_PREPARE_STORE_SAVE,
    PRODUCT_PLT_DETAIL_A_EN_TAB,
    PRODUCT_PLT_AUDIT_UPDATE,
    PRODUCT_PLATFORM_OPERATION_UPDATE,
    PRODUCT_PLATFORM_LEAD_SELECT,
    PUTAWAY_COMMIT,
    PRODUCT_PLATFORM_LEAD_ALL
}