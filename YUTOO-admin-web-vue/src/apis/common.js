// 获取平台列表
const PLATFORM_LIST = {
  method: 'post',
  url: "/platform/list",
}

// 根据平台获取店铺列表 params {list: []}
const LIST_BY_PLATFORMIDS = {
  method: 'post',
  url: "/store/list/by/platformIds",
}

// 获取平台列表
const SITE_LIST = {
  method: 'post',
  url: "/site/list",
}

// 获取平台下的站点
const PLATFORM_LIST_PLATFORM_SITE = {
  method: 'post',
  url: "/platform/list/platform/site",
}

// 获取账户
const SYS_USER_LIST = {
  method: 'post',
  url: "/sys/user/list",
}

// 获取平台列表
const STORE_LIST = {
  method: 'post',
  url: "/store/list",
}

// 获取文件夹目录树
const PRODUCT_IMAGE_DIR_TREE = {
  method: 'post',
  url: "/product/image/dir/tree",
}

// 根据目录id获取图片列表
const PRODUCT_IMAGE_LIST_BY_DIR = {
  method: 'post',
  url: "/product/image/list/by/dir",
}


// 获取sku自定义
const PRODUCT_SKUCUSTOM_LIST_GET = {
  method: 'post',
  url: "/product/vairnat/prop/list/get",
}

// 头程单位
const GLOBAL_UNIT_ITEM_TYPE_LIST = {
  method: 'post',
  url: "/global/unit/item/type/list",
}

module.exports = {
  PLATFORM_LIST,
  LIST_BY_PLATFORMIDS,
  PRODUCT_IMAGE_DIR_TREE,
  PLATFORM_LIST_PLATFORM_SITE,
  PRODUCT_IMAGE_LIST_BY_DIR,
  GLOBAL_UNIT_ITEM_TYPE_LIST,
  SITE_LIST,
  PRODUCT_SKUCUSTOM_LIST_GET,
  SYS_USER_LIST,
  STORE_LIST,
}