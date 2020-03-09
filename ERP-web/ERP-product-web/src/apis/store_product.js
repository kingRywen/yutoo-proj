// 根据状态获取店铺产品列表
const STORE_PRODUCT_LIST_PARENT = {
  method: 'post',
  url: "/store/product/list/parent",
}

// 根据状态获取产品列表
const STORE_PRODUCT_LIST_BY_STATUS = {
  method: 'post',
  url: "/store/product/list/by/status",
}

// 获取ebay图片属性
const STORE_IMG_GET_IMG_PROPERTY = {
  method: 'post',
  url: "/store/img/get/img/property",
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

// 下架
const STORE_PRODUCT_UNPUBLISH = {
  method: 'post',
  url: "/store/product/unpublish",
}

// 店铺产品批量下架
const STORE_PRODUCT_UNPUBLISH_BATCH = {
  method: 'post',
  url: "/store/product/unpublish/batch",
}

// 产品批量刊登上架
const STORE_PRODUCT_PUBLISH_BATCH = {
  method: 'post',
  url: "/store/product/publish/batch",
}

// 查看审核不通过原因
const STORE_PRODUCT_AUDIT_REFUSE_REASON = {
  method: 'post',
  url: "/store/product/audit/refuse/reason",
}

// 店铺产品批量审核
const STORE_PRODUCT_AUDIT_BATCH = {
  method: 'post',
  url: "/store/product/audit/batch",
}

// 导出上架信息
const STORE_PRODUCT_DOWNLOAD_PUBLISH_INFO = {
  method: 'post',
  url: "/store/product/download/publish/info",
}

// 导出上架信息
const STORE_PRODUCT_PUBLISH = {
  method: 'post',
  url: "/store/product/publish",
}

// 复制上传
const STORE_PRODUCT_COPY = {
  method: 'post',
  url: "/store/product/copy",
}

// 获取状态列表
const STORE_PRODUCT_GROUP_BY_STATUS = {
  method: 'post',
  url: "/store/product/group/by/status",
}

// 根据母体id获取变体列表
const STORE_PRODUCT_LIST_CHILD = {
  method: 'post',
  url: "/store/product/list/child",
}

// 删除图片库图片
const PRODUCT_IMAGE_IMG_DELETE = {
  method: 'post',
  url: "/product/image/img/delete",
}

// 获取店铺产品图片路径
const STORE_IMG_DIR = {
  method: 'post',
  url: "/store/img/dir",
}

// 导出店铺产品图片
const STORE_IMG_EXPORT = {
  method: 'post',
  url: "/store/img/export",
}

// 获取上架信息属性列表
const STORE_PRODUCT_LIST_DOWNLOAD_PROPERTIES = {
  method: 'post',
  url: "/store/product/list/download/properties",
}

// 自定义导出
const STORE_PRODUCT_DOWNLOAD_CUSTOM_PUBLISH_INFO = {
  method: 'post',
  url: "/store/product/download/custom/publish/info",
}

// 自定义导出
const STORE_PRODUCT_PLAT_LIST = {
  method: 'post',
  url: "/store/product/plat/list",
}

// 自定义导出
const STORE_PRODUCT_PLAT_CONFIRM = {
  method: 'post',
  url: "/store/product/plat/confirm/batch",
}

// 【在线产品】获取基础产品列表
const STORE_PRODUCT_PLAT_LIST_BASE_PRODUCT = {
  method: 'post',
  url: "/store/product/plat/list/base/product",
}

// 【在线产品】关联在线产品和仓库产品
const STORE_PRODUCT_PLAT_REL = {
  method: 'post',
  url: "/store/product/plat/rel",
}

// 【在线产品】逆推产品
const STORE_PRODUCT_PLAT_REVERSE = {
  method: 'post',
  url: "/store/product/plat/reverse",
}

// 下载文件
const BASE_DOWNLOAD = {
  method: 'post',
  url: "/base/download",
}


// 根据站点获取店铺
const STORE_LIST_BY_SITE = {
  method: 'post',
  url: "/store/list/by/site",
}
// 【店铺移动产品】批量挪动产品
const STORE_PRODUCT_MOVE_BATCH = {
  method: 'post',
  url: "/store/product/move/batch",
}

// 【店铺移动产品】获取所有的变体列表
const STORE_PRODUCT_MOVE_VARIANT_LIST = {
  method: 'post',
  url: "/store/product/move/variant/list",
}

// 【店铺移动产品】获取所有的母体列表
const STORE_PRODUCT_MOVE_PARENT_LIST = {
  method: 'post',
  url: "/store/product/move/parent/list",
}

// 【移动产品】确认挪动产品
const STORE_PRODUCT_MOVE_CONFIRM = {
  method: 'post',
  url: "/store/product/move/confirm",
}
// 【移动产品】获取挪动日志
const STORE_PRODUCT_MOVE_LOG = {
  method: 'post',
  url: "/store/product/move/log",
}
// 【在线产品】根据母体id获取店铺在线产品变体列表
const STORE_PRODUCT_PLAT_VARIANT_LIST = {
  method: 'post',
  url: "/store/product/plat/variant/list",
}
// 【在线产品】批量关联在线产品和仓库产品
const STORE_PRODUCT_PLAT_REL_BATCH = {
  method: 'post',
  url: "/store/product/plat/rel/batch",
}
// 【在线产品】批量关联在线产品和仓库产品
const STORE_IMG_LIST_VARIANT = {
  method: 'post',
  url: "/store/img/list/variant",
}
// 【在线产品】批量关联在线产品和仓库产品
const STORE_IMG_LIST = {
  method: 'post',
  url: "/store/img/list",
}
// 【店铺产品图片】更新产品图片
const STORE_IMG_UPDATE = {
  method: 'post',
  url: "/store/img/update",
}
// 【平台产品图片】更新产品图片
const PRODUCT_IMAGE_UPDATE_IMAGE = {
  method: 'post',
  url: "/product/image/update/image",
}
// 【店铺产品】获取删除的产品
const STORE_PRODUCT_LIST_DELETE = {
  method: 'post',
  url: "/store/product/list/delete",
}
// 【店铺产品】删除店铺产品
const STORE_PRODUCT_DELETE = {
  method: 'post',
  url: "/store/product/delete",
}
// 【店铺产品】取消删除
const STORE_PRODUCT_UNDELETE = {
  method: 'post',
  url: "/store/product/undelete",
}
// 【店铺产品】批量删除店铺产品
const STORE_PRODUCT_DELETE_BATCH = {
  method: 'post',
  url: "/store/product/delete/batch",
}
// 【店铺产品】批量取消删除店铺产品
const STORE_PRODUCT_UNDELETE_BATCH = {
  method: 'post',
  url: "/store/product/undelete/batch",
}

// 【店铺产品】批量取消删除店铺产品
const STORE_PRODUCT_URL = {
  method: 'post',
  url: "/store/product/url",
}

// 【店铺产品】获取平台编辑的信息
const STORE_PRODUCT_PLATFORM = {
  method: 'post',
  url: "/store/product/platform",
}

// 一键应用平台图片
const STORE_IMG_UPDATE_PLATFORM = {
  method: 'post',
  url: "/store/img/update/platform",
}

// 【图片】删除导出的文件
const IMG_DELETE_EXPORT = {
  method: 'post',
  url: "/img/delete/export",
}
// ebay保存之后提交
const storeProductEbayCommit = {
  method: 'post',
  url: "/store/product/ebay/commit",
}
// ebay获取图片属性
const catePltTempPropSetGetSelectImagePropertyName = {
  method: 'post',
  url: "/CatePltTempPropSet/getSelectImagePropertyName",
}
// ebay设置图片属性
const storeImgSetImgProperty = {
  method: 'post',
  url: "/store/img/set/img/property",
}
// wish获取tabs
const storeProductListGroup = {
  method: 'post',
  url: "/store/product/list/group",
}
// 获取wish海外仓库存信息
const storeProductWishWarehouseInfo = {
  method: 'post',
  url: "/store/product/wish/warehouse/info",
}

module.exports = {
  STORE_PRODUCT_LIST_BY_STATUS,
  STORE_IMG_GET_IMG_PROPERTY,
  catePltTempPropSetGetSelectImagePropertyName,
  STORE_PRODUCT_DELETE,
  storeImgSetImgProperty,
  storeProductListGroup,
  storeProductWishWarehouseInfo,
  storeProductEbayCommit,
  IMG_DELETE_EXPORT,
  STORE_IMG_UPDATE_PLATFORM,
  STORE_PRODUCT_URL,
  STORE_PRODUCT_PLATFORM,
  STORE_PRODUCT_UNDELETE_BATCH,
  STORE_PRODUCT_DELETE_BATCH,
  STORE_PRODUCT_LIST_DELETE,
  STORE_PRODUCT_UNDELETE,
  STORE_IMG_LIST,
  STORE_IMG_LIST_VARIANT,
  STORE_IMG_UPDATE,
  PRODUCT_IMAGE_UPDATE_IMAGE,
  STORE_PRODUCT_PLAT_VARIANT_LIST,
  STORE_PRODUCT_PLAT_REL_BATCH,
  STORE_IMG_EXPORT,
  STORE_PRODUCT_PLAT_REVERSE,
  STORE_PRODUCT_PLAT_LIST_BASE_PRODUCT,
  STORE_PRODUCT_PLAT_CONFIRM,
  STORE_PRODUCT_PLAT_REL,
  STORE_PRODUCT_PLAT_LIST,
  STORE_PRODUCT_DOWNLOAD_CUSTOM_PUBLISH_INFO,
  BASE_DOWNLOAD,
  STORE_PRODUCT_INFO,
  PRODUCT_IMAGE_IMG_DELETE,
  STORE_PRODUCT_LIST_DOWNLOAD_PROPERTIES,
  STORE_IMG_DIR,
  STORE_PRODUCT_LIST_PARENT,
  STORE_PRODUCT_LIST_CHILD,
  STORE_PRODUCT_UNPUBLISH,
  STORE_PRODUCT_AUDIT_BATCH,
  STORE_PRODUCT_GROUP_BY_STATUS,
  STORE_PRODUCT_UNPUBLISH_BATCH,
  STORE_PRODUCT_COPY,
  STORE_PRODUCT_DOWNLOAD_PUBLISH_INFO,
  STORE_PRODUCT_AUDIT_REFUSE_REASON,
  STORE_PRODUCT_PUBLISH,
  STORE_PRODUCT_AUDIT,
  STORE_PRODUCT_PUBLISH_BATCH,
  STORE_LIST_BY_SITE,
  STORE_PRODUCT_MOVE_BATCH,
  STORE_PRODUCT_MOVE_VARIANT_LIST,
  STORE_PRODUCT_MOVE_PARENT_LIST,
  STORE_PRODUCT_MOVE_CONFIRM,
  STORE_PRODUCT_MOVE_LOG
}