const config = require('../common/config')
/**
 * 
 * 产品库中心
 * 
 */

// 获取侧边栏菜单
const GET_PRODUCT_SUB_MENU = {
  // method: 'post',
  mockUrl: "/getProductSubMenu",
  url: config.BASE_URL_UN + "/getProductSubMenu",
}
// sku 选项
const GET_PRODUCT_SKU_OPTIONS = {
  mockUrl: "/skulists",
  url: config.BASE_URL_UN + "/skulists",
}


// // 新增产品 -> 产品变体 -> 获取产品类目
// const GET_COLUMNS = {
//   method: 'post',
//   url: "/product/category/list",
// }



// 新增产品 -> 产品基础 -> 产品相关附件  选择产品配件弹窗 发货仓库选择项     --修改
const GET_REP_OPTIONS = {
  method: 'post',
  url: "/product/variantRel/rep_options",
}

// 新增产品 -> 产品基础 -> 产品相关附件  选择产品配件弹窗 获取变体列表     --修改
const GET_PRODUCT_ACC_V = {
  method: 'post',
  url: "/product/variantRel/acc_v"
}

// 新增产品 -> 产品基础 -> 产品相关附件  选择产品配件弹窗 获取包材列表     --修改
const GET_PRODUCT_PAC_LIST = {
  method: 'post',
  url: "/product/variantRel/pac_list",
}



//---------------已有接口-----------------

// 登录
const LOGIN = {
  method: 'post',
  url: "/sys/login"
}

// 产品母体列表
const GET_PRODUCT_ALL_LIST = {
  method: 'post',
  url: "/product/list",
}

// 产品母体编辑(获得产品变体页面数据）
const PRODUCT_PARENT_BASE_VARIANT_TAB = {
  method: 'post',
  mockUrl: '/product/parent/base/variant/tab',
  url: "/product/parent/base/variant/tab",
}

// 获取变体属性
const variant_property = {
  method: 'post',
  url: "/product/variant/property",
}

// 附件（展示）
const GET_PRODUCT_UPLOAD = {
  method: 'post',
  url: "/product/attachment/list",
}

//   附件（修改）
const GET_PRODUCT_AT_UP = {
  method: 'post',
  url: "/product/attachment/update",
}

//   附件（添加）
const PRODUCT_ATTACHMENT_SAVE = {
  method: 'post',
  url: "/product/attachment/save",
}

//   附件（删除）
const PRODUCT_ATTACHMENT_REMOVE = {
  method: 'post',
  url: "/product/attachment/remove",
}

// 包材/原材料/配件(变体展示)
const GET_PRODUCT_ACC = {
  method: 'post',
  url: "/product/variantRel/list",
}

// 提交审核结果(基础/采购/可批量)
const PRODUCT_AUDIT_UPDATE = {
  method: 'post',
  url: "/product/audit/update",
}

// 获取唯一sku
const _PRODUCT_SKU_GET = {
  method: 'post',
  url: "/product/sku/get",
}

// 获取类目列表
const PRODUCT_CATEGORY_LIST = {
  method: 'post',
  url: "/product/category/list",
}

// 产品基础信息取值范围
const BASEPRODUCTPROPITEM_FINDITEMS = {
  method: 'post',
  url: "/BaseProductPropItem/findItems",
}

// 获取差异字段集合
const PRODUCT_FIELD_VARIANT_DIFFERENCE = {
  method: 'post',
  mockUrl: '/product/field/variant/difference',
  url: "/product/field/base/variant/difference",
}

// 获取扩展属性
const PRODUCT_FIELD_EXTEND = {
  method: 'post',
  url: "/product/field/extend",
}

// 产品保存(新增)
const PRODUCT_BASE_SAVE = {
  method: 'post',
  url: "/product/base/save",
}

// 获取插头数据
const GLOBAL_ENUM_LIST = {
  method: 'post',
  url: "/global/enum/list",
}

// 获取插头数据
const PRODUCT_BASE_ENUM = {
  method: 'post',
  mockUrl: "/product/base/enum",
  url: "/product/base/enum",
}

// 产品备注附件上传
const PRODUCT_REMARK_UPLOAD = {
  method: 'post',
  mockUrl: "/product/remark/upload",
  url: "/product/remark/upload",
}

// 图片上传
const PRODUCT_IMG_UPLOAD = {
  method: 'post',
  url: "/product/img/upload",
}

// 获取母体图片
const PRODUCT_IMG_PARENT_BASE_TAB = {
  method: 'post',
  url: "/product/img/tab",
}

// 获取产品类目
const PRODUCT_CAT = {
  method: 'post',
  mockUrl: "/product/cat",
  url: "/product/category/info",
}

// 产品母体编辑（获得产品基本信息页面数据）
const PRODUCT_PARENT_BASE_TAB = {
  method: 'post',
  url: "/product/parent/base/tab",
}

// 产品母体编辑（获得产品备注页面数据）
const PRODUCT_REMARK_PARENT_BASE_TAB = {
  method: 'post',
  url: "/product/remark/parent/base/tab",
}

// 产品变体编辑（获取产品基本信息页面数据）
const PRODUCT_VARIANT_BASE_TAB = {
  method: 'post',
  url: "/product/variant/base/tab",
}

// 产品变体编辑（获得产品备注页面数据）
const PRODUCT_REMARK_VARIANT_BASE_TAB = {
  method: 'post',
  url: "/product/remark/variant/base/tab",
}

// 包材/原材料/配件(修改)
const PRODUCT_VARIANTREL_UPDATE = {
  method: 'post',
  url: "/product/variant/rel/update",
}

// 包材/原材料/配件（删除）
const PRODUCT_VARIANTREL_REMOVE = {
  method: 'post',
  url: "/product/variantRel/update",
}

// 上传附件
const PRODUCT_ATTACHMENT_UPLOAD = {
  method: 'post',
  url: "product/attachment/upload",
}

// 查看变体
const PRODUCT_VARIANT_LIST = {
  method: 'post',
  url: "/product/variant/list",
}

// 查看变体
const PRODUCT_BASE_COMMIT = {
  method: 'post',
  url: "/product/base/commit",
}


// 包材/原材料/配件(变体展示)
const PRODUCT_VARIANT_REL_LIST = {
  method: 'post',
  url: "/product/variant/rel/list",
}

// 包材/原材料/配件(添加)
const PRODUCT_VARIANTREL_BATCH_SAVE = {
  method: 'post',
  url: "/product/variantRel/batch/save",
}

// 获取文件真实路径
const PRODUCT_FILE_DOWNLOAD_PATH_GET = {
  method: 'post',
  url: "/product/file/download/path/get",
}

// 获取配件/包材/原材料列表（审核通过的变体列表）
const PRODUCT_VARIANT_PAGE = {
  method: 'post',
  url: "/product/variant/page",
}

// 包材/原材料/配件(添加)
const PRODUCT_VARIANT_REL_BATCH_SAVE = {
  method: 'post',
  url: "/product/variant/rel/batch/save",
}

// 包材/原材料/配件（删除）
const PRODUCT_VARIANT_REL_REMOVE = {
  method: 'post',
  url: "/product/variant/rel/remove",
}

// 
const PRODUCT_IMG_DELETE = {
  method: 'post',
  url: "/product/img/delete",
}

// 查看原因（产品审核不通过）
const PRODUCT_AUDIT_INFO = {
  method: 'post',
  url: "/product/audit/info",
}

// 查看原因（产品审核不通过）
const PRODUCT_PLT_AUDIT_INFO = {
  method: 'post',
  url: "/product/plt/audit/info",
}

// 产品作废
const PRODUCT_INVALID = {
  method: 'post',
  url: "/product/invalid",
}

module.exports = {
  GET_PRODUCT_ACC_V,
  PRODUCT_VARIANTREL_UPDATE,
  PRODUCT_IMG_DELETE,
  PRODUCT_INVALID,
  PRODUCT_AUDIT_INFO,
  PRODUCT_VARIANT_REL_REMOVE,
  PRODUCT_VARIANTREL_BATCH_SAVE,
  PRODUCT_VARIANT_REL_BATCH_SAVE,
  PRODUCT_FILE_DOWNLOAD_PATH_GET,
  PRODUCT_VARIANT_PAGE,
  PRODUCT_ATTACHMENT_SAVE,
  PRODUCT_BASE_COMMIT,
  PRODUCT_PLT_AUDIT_INFO,
  PRODUCT_VARIANT_LIST,
  PRODUCT_VARIANT_REL_LIST,
  PRODUCT_ATTACHMENT_UPLOAD,
  PRODUCT_VARIANTREL_REMOVE,
  GET_REP_OPTIONS,
  GET_PRODUCT_UPLOAD,
  GET_PRODUCT_ACC,
  GET_PRODUCT_ALL_LIST,
  GET_PRODUCT_SKU_OPTIONS,
  GET_PRODUCT_SUB_MENU,
  GET_PRODUCT_AT_UP,
  GET_PRODUCT_PAC_LIST,
  PRODUCT_ATTACHMENT_REMOVE,
  PRODUCT_VARIANT_BASE_TAB,
  PRODUCT_AUDIT_UPDATE,
  PRODUCT_REMARK_VARIANT_BASE_TAB,
  PRODUCT_PARENT_BASE_VARIANT_TAB,
  _PRODUCT_SKU_GET,
  variant_property,
  PRODUCT_CATEGORY_LIST,
  BASEPRODUCTPROPITEM_FINDITEMS,
  PRODUCT_FIELD_VARIANT_DIFFERENCE,
  PRODUCT_FIELD_EXTEND,
  PRODUCT_IMG_PARENT_BASE_TAB,
  PRODUCT_BASE_SAVE,
  PRODUCT_REMARK_PARENT_BASE_TAB,
  PRODUCT_BASE_ENUM,
  GLOBAL_ENUM_LIST,
  PRODUCT_CAT,
  PRODUCT_REMARK_UPLOAD,
  PRODUCT_IMG_UPLOAD,
  PRODUCT_PARENT_BASE_TAB,
  LOGIN,
}