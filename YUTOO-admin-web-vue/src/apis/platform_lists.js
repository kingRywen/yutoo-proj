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
    url: '/CategoryPlatform/listChild'
}

// 平台信息编辑（获取站点类目）
const PRODUCT_IMAGE_IMG_DIR = {
    method: 'post',
    url: '/product/image/img/dir'
}

// 平台信息编辑（获取站点类目）
const PRODUCT_IMAGE_UPDATE = {
    method: 'post',
    url: '/product/image/update'
}

// 平台信息编辑（获取模板字段）
const PRODUCT_PLT_DETAIL_A_EN_FIELD = {
    method: 'post',
    url: '/product/plt/detail/module/fields'
}

// 平台信息编辑（获取模板字段）
const PRODUCT_PLT_DETAIL_MODULE_FIELDS_SAVE = {
    method: 'post',
    url: '/product/plt/detail/module/fields/save'
}

// 平台信息编辑（获取站点模板 选择）
const PRODUCT_PLT_DETAIL_A_EN_MODULE = {
    method: 'post',
    url: '/product/plt/detail/module'
}

// 平台信息母体保存（保存该语种平台信息）
const PRODUCT_PLT_DETAIL_A_EN_SAVE = {
    method: 'post',
    url: '/product/plt/detail/save'
}

// 平台信息母体保存（保存该语种平台信息）
const PRODUCT_PLT_DETAIL_A_EN_COMMIT = {
    method: 'post',
    url: '/product/plt/detail/commit'
}

// 平台信息母体编辑(获取英语页面字段）
const PRODUCT_PLT_DETAIL_A_EN_TAB = {
    method: 'post',
    url: '/product/plt/detail/tab'
}

// 平台信息变体编辑(获取英语页面字段）
const PRODUCT_PLT_VARIANT_A_EN_TAB = {
    method: 'post',
    url: '/product/plt/variant/tab'
}

// 平台信息变体编辑(获取数据）
const PRODUCT_PLT_VARIANT_A_EN_FIELD = {
    method: 'post',
    url: '/product/plt/variant/field'
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

// 平台审核（图片/平台）
const PRODUCT_PLT_AUDIT_IMG_UPDATE = {
    method: 'post',
    url: '/product/plt/audit/img/update'
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



// 上传图片签名获取
const IMG_GET_OSS_SIGNATURE = {
    method: 'post',
    url: '/img/get/oss/signature'
}

// 获取图片信息
const PRODUCT_IMAGE_INFO = {
    method: 'post',
    url: '/product/image/info'
}

// 获取图片信息
const PRODUCT_IMAGE_COMMIT = {
    method: 'post',
    url: '/product/image/commit'
}

// 获取图片信息
const PRODUCT_PLATFORM_BATCH_UNSHELVE = {
    method: 'post',
    url: '/product/platform/batch/unshelve'
}

// 平台产品变体列表
const PRODUCT_PLATFORM_VARIANT_LIST = {
    method: 'post',
    url: '/product/platform/variant/list'
}

// 获取zip的路径
const PRODUCT_IMAGE_DIR = {
    method: 'post',
    url: '/product/image/dir'
}

// 产品获取dir路径
const UPLOAD_REALPATH_GET = {
    method: 'post',
    url: '/upload/realPath/get'
}

// 产品存储dir路径
const UPLOAD_VISIT_PATH_GET = {
    method: 'post',
    url: '/upload/visit/path/get'
}

// 获取编辑人员列表
const PRODUCT_PLATFORM_OPERATION_TYPE_LIST = {
    method: 'get',
    url: '/product/platform/operation/type/list'
}

// 重新上架
const PRODUCT_PLATFORM_PUT_AWAY_AGAIN = {
    method: 'post',
    url: '/product/platform/put/away/again'
}

// 变体编辑平台信息
const PRODUCT_PLT_VARIANT_A_EN_SAVE = {
    method: 'post',
    url: '/product/plt/variant/a/en/save'
}

// 批量分配人员list
const PRODUCT_PLATFORM_OPERATION_OPERATOR_LIST = {
    method: 'post',
    url: '/product/platform/operation/operator/list'
}

// 语种字段列表
const PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_LANGUAGEID_LIST = {
    method: 'post',
    url: '/product/platform/download/custom/languageId/list'
}

// 语种导出
const PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_LANGUAGE_FIELD_LIST = {
    method: 'post',
    url: '/product/platform/download/custom/language/field/list'
}

// 语种导出excel
const PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_FIELD = {
    method: 'post',
    url: '/product/platform/download/custom/field'
}

// 获取平台审核（图片/平台）
const PRODUCT_PLT_AUDIT_IMG_INFO = {
    method: 'post',
    url: '/product/plt/audit/img/info'
}

// 获取平台语种站点信息
const PRODUCT_PLT_DETAIL_SITE_INFO = {
    method: 'post',
    url: '/product/plt/detail/site/info'
}

// 模板数据
const PRODUCT_PLT_DETAIL_DATA = {
    method: 'post',
    url: '/product/plt/detail/data'
}



module.exports = {
    GET_ERP_PLATFORM_LISTS,
    PRODUCT_IMAGE_UPDATE,
    PRODUCT_IMAGE_IMG_DIR,
    PRODUCT_PLT_DETAIL_DATA,
    PRODUCT_IMAGE_DIR,
    PRODUCT_PLT_DETAIL_MODULE_FIELDS_SAVE,
    PRODUCT_PLT_DETAIL_SITE_INFO,
    PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_FIELD,
    PRODUCT_PLT_AUDIT_IMG_INFO,
    PRODUCT_PLATFORM_OPERATION_TYPE_LIST,
    PRODUCT_PLATFORM_OPERATION_OPERATOR_LIST,
    PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_LANGUAGEID_LIST,
    PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_LANGUAGE_FIELD_LIST,
    PRODUCT_PLT_VARIANT_A_EN_SAVE,
    PRODUCT_PLATFORM_PUT_AWAY_AGAIN,
    UPLOAD_REALPATH_GET,
    PUTAWAY_PRODUCT_INFO,
    PRODUCT_IMAGE_INFO,
    PRODUCT_PLATFORM_BATCH_UNSHELVE,
    IMG_GET_OSS_SIGNATURE,
    UPLOAD_VISIT_PATH_GET,
    PRODUCT_IMAGE_COMMIT,
    PRODUCT_PLATFORM_VARIANT_LIST,
    PRODUCT_PLT_DETAIL_A_EN_COMMIT,
    PRODUCT_PLATFORM_PARENT_LIST,
    PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
    PRODUCT_IMAGE_UPLOAD,
    PRODUCT_PLT_LANGUAGE_AUDIT_UPDATE,
    PRODUCT_PLT_VARIANT_A_EN_TAB,
    PRODUCT_IMAGE_DOWNLOAD,
    PRODUCT_PLT_VARIANT_A_EN_FIELD,
    PUTAWAY_STORE_INFO,
    PUTAWAY_LANGUAGE_INFO,
    PRODUCT_PLT_DETAIL_A_EN_CATEGORY,
    PRODUCT_PLT_DETAIL_A_EN_FIELD,
    PRODUCT_PLT_DETAIL_A_EN_SAVE,
    PRODUCT_PLATFORM_LEAD_SELECT_LIST,
    PUTAWAY_STORE_CHOOSE,
    PRODUCT_PLT_DETAIL_A_EN_MODULE,
    PRODUCT_PREPARE_STORE_LIST,
    PRODUCT_PREPARE_STORE_SAVE,
    PRODUCT_PLT_DETAIL_A_EN_TAB,
    PRODUCT_PLT_AUDIT_UPDATE,
    PRODUCT_PLT_AUDIT_IMG_UPDATE,
    PRODUCT_PLATFORM_OPERATION_UPDATE,
    PRODUCT_PLATFORM_LEAD_SELECT,
    PUTAWAY_COMMIT,
    PRODUCT_PLATFORM_LEAD_ALL
}