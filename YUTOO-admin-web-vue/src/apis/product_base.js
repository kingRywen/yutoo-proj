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

// 获取基本信息下拉
const PRODUCT_BASE_ENUM = {
  method: 'get',
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
  url: "/product/img/save",
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
  url: "/product/remark/base/tab",
}

// 产品变体编辑（获取产品基本信息页面数据）
const PRODUCT_VARIANT_BASE_TAB = {
  method: 'post',
  url: "/product/variant/base/tab",
}

// 产品变体编辑（获得产品备注页面数据）
const PRODUCT_REMARK_VARIANT_BASE_TAB = {
  method: 'post',
  url: "/product/remark/base/tab",
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

// 包材/原材料/配件（删除）
const PRODUCT_PACKAGE_REL_BATCH_REMOVE = {
  method: 'post',
  url: "/product/package/rel/batch/remove",
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

// 产品删除
const PRODUCT_REMOVE = {
  method: 'post',
  url: "/product/remove",
}

// 存入变体tab页面
const PRODUCT_TAB_SAVE = {
  method: 'post',
  url: "/product/tab/save",
}

// 存入备注页面
const PRODUCT_REMARK_SAVE = {
  method: 'post',
  url: "/product/remark/save",
}

// 获取变体tab页面
const PRODUCT_TAB_GET = {
  method: 'post',
  url: "/product/tab/get",
}

// 复制添加
const PRODUCT_COPY = {
  method: 'post',
  url: "/product/copy",
}

// 文件解释
const PRODUCT_RICH_FILE_UPLOAD = {
  method: 'post',
  url: "/product/rich/file/upload",
}

// 获取类目数目产品 
const PRODUCT_BASE_CATEGORY_NUM = {
  method: 'post',
  url: "/product/base/category/num",
}

// 获取变体价格页等标签参数 
const TAB_VARIANT_GET = {
  method: 'post',
  url: "/product/tab/variant/get",
}

// 批量分配编辑人员
const PRODUCT_OPERATION_BATCH_UPDATE = {
  method: 'post',
  url: "/product/operation/batch/update",
}

// 开发人员
const PRODUCT_DEVELOP_USER_LIST = {
  method: 'get',
  url: "/product/develop/user/list",
}

// 采购人员
const PRODUCT_PURCHASE_USER_LIST = {
  method: 'get',
  url: "/product/purchase/user/list",
}

// 导出报价
const PRODUCT_SUPPLIER_PRICE_REL_BATCH_DOWNLOAD = {
  method: 'post',
  url: "/product/supplier/price/rel/batch/download",
}

// 修改备注
const PRODUCT_REMARK_BATCH_UPDATE = {
  method: 'post',
  url: "/product/remark/batch/update",
}

// 生成组合产品
const PRODUCT_GROUP_ADD = {
  method: 'post',
  url: "/product/group/add",
}

// 批量提取SKU
const PRODUCT_BATCH_SKU = {
  method: 'post',
  url: "/product/batch/sku/get",
}

// 批量导入产品
const PRODUCT_BASE_BATCH_UPLOAD = {
  method: 'post',
  url: "/product/base/batch/upload",
}

// 批量导入原料
const PRODUCT_BATCH_UPLOAD_MATERIAL = {
  method: 'post',
  url: "/product/batch/upload/material",
}

// 批量导入原料
const UPLOAD_TEMPLATE_GET = {
  method: 'post',
  url: "/product/supplier/template/download",
}

// 生成组合产品（获取选中母体的变体列表）
const PRODUCT_VARIANT_GROUP_LIST = {
  method: 'post',
  url: "/product/variant/group/list",
}

// 生成组合产品（母体列表模糊查询）
const PRODUCT_PARENT_LIST = {
  method: 'post',
  url: "/product/parent/list",
}

// 修改组合产品数量
const PRODUCT_VARIANT_REL_UPDATE = {
  method: 'post',
  url: "/product/variant/rel/update",
}

// 获取价格单位列表
const GLOBAL_UNIT_ITEM_LIST = {
  method: 'post',
  url: "/global/unit/item/list",
}

// 获取价格单位列表
const PRODUCT_IMG_EXPORT = {
  method: 'post',
  url: "/product/img/export",
}

// 变体属性（属性值列表获取）
const PRODUCT_PROPERTY_VALUE_LIST = {
  method: 'post',
  url: "/product/property/value/list",
}

// 变体属性（属性值列表获取）
const WAREHOUSE_LIST = {
  method: 'post',
  url: "/warehouse/list",
}

// 变体属性（属性值列表获取）
const PRODUCT_IMG_BATCH_REMOVE = {
  method: 'post',
  url: "/product/img/batch/remove",
}

// 变体属性（属性值列表保存）
const PRODUCT_PROPERTY_VALUE_SAVE = {
  method: 'post',
  url: "/product/property/value/save",
}

// 批量获取自定义sku
const PRODUCT_BATCH_SKU_CUSTOM_GET = {
  method: 'post',
  url: "/product/batch/sku/custom/get",
}

// 物流包材分页展示
const LOGISTIC_PACKAGE_PAGE_LIST = {
  method: 'post',
  url: "/logistic/package/page/list",
}

// 物流包材关联批量添加
const PRODUCT_PACKAGE_REL_BATCH_SAVE = {
  method: 'post',
  url: "/product/package/rel/batch/save",
}

// 物流包材管理列表
const PRODUCT_PACKAGE_LIST = {
  method: 'post',
  url: "/product/package/rel/list",
}

// 物流包材关联修改
const PRODUCT_PACKAGE_REL_UPDATE = {
  method: 'post',
  url: "/product/package/rel/update",
}

// 价格页面（保存）
const PRODUCT_PRICE_SAVE = {
  method: 'post',
  url: "/product/price/save",
}

// 关联供应商（添加） 只有母体才能添加
const PRODUCT_SUPPLIER_REL_SAVE = {
  method: 'post',
  url: "/product/supplier/rel/save",
}

// 报关信息（修改）
const PRODUCT_ENTRY_INFO_UPDATE = {
  method: 'post',
  url: "/product/entry/info/update",
}

// 国家列表
const NATION_LIST = {
  method: 'post',
  url: "/nation/list",
}

// 报关价修改国家
const PRODUCT_ENTRY_PRICE_PERCENT_BATCH_UPDATE = {
  method: 'post',
  url: "/product/entry/price/percent/batch/update",
}

// 关联供应商（列表展示）
const PRODUCT_SUPPLIER_LIST = {
  method: 'post',
  url: "/product/supplier/list",
}

// 关联供应商（修改默认供应商）
const PRODUCT_SUPPLIER_REL_DEFAULT_UPDATE = {
  method: 'post',
  url: "/product/supplier/rel/default/update",
}

// 添加开发人员，采购人员
const PRODUCT_USER_ADD = {
  method: 'post',
  url: "/product/user/add",
}


// 产品库/产品/批量锁定产品
const PRODUCT_BATCH_LOCK = {
  method: 'post',
  url: "/product/batch/lock",
}

// 产品库/产品/批量解锁产品
const PRODUCT_BATCH_ULOCK = {
  method: 'post',
  url: "/product/batch/unlock",
}

// 产品库/产品/产品挪动（展示选择变体数据）
const PRODUCT_MOVE_SHOW = {
  method: 'post',
  url: "/product/move/show",
}

// 产品挪动（通过sku获取变体数据）
const PRODUCT_VARIANT_LIST_SKU = {
  method: 'post',
  url: "/product/variant/list/sku",
}

// 产品挪动（母体数据列表展示）
const PRODUCT_MOVE_PAGE_LIST = {
  method: 'post',
  url: "/product/move/page/list",
}

// 产品挪动（变体数据列表）
const PRODUCT_VARIANT_MOVE_PAGE_LIST = {
  method: 'post',
  url: "/product/variant/move/page/list",
}

// 变体挪动（挪动校验）
const PRODUCT_VARIANT_MOVE_CHECK = {
  method: 'post',
  url: "/product/variant/move/check",
}

// 产品挪动（ 挪动变体）
const PRODUCT_VARIANT_BATCH_MOVE = {
  method: 'post',
  url: "/product/variant/batch/move",
}

// 获取省份列表
const ADDRESS_PROVINCE_LIST = {
  method: 'get',
  url: "/address/province/list",
}

// 获取报关价格
const PRODUCT_ENTRY_PRICE_PERCENT_LIST = {
  method: 'get',
  url: "/product/entry/price/percent/list",
}

// 添加品牌
const PRODUCT_BRAND_SAVE = {
  method: 'post',
  url: "/product/brand/save",
}

// 高级搜索选择
const PRODUCT_SEARCH_ITEM_LIST = {
  method: 'get',
  url: "/product/search/item/list",
}

// 高级搜索选择
const PRODUCT_BRAND_GETBRANDNAMELIST = {
  method: 'post',
  url: "/product/brand/getBrandNameList",
}

// 敏感关键词校验
const PRODUCT_KEY_WORD_VERIFY = {
  method: 'get',
  url: "/product/key/word/list",
}

// 敏感关键词校验
const PRODUCT_KEY_WORD_VERIFY_1 = {
  method: 'post',
  url: "/product/key/word/verify",
}





module.exports = {
  GET_PRODUCT_ACC_V,
  PRODUCT_KEY_WORD_VERIFY_1,
  PRODUCT_KEY_WORD_VERIFY,
  PRODUCT_IMG_BATCH_REMOVE,
  PRODUCT_BRAND_GETBRANDNAMELIST,
  PRODUCT_SEARCH_ITEM_LIST,
  PRODUCT_ENTRY_PRICE_PERCENT_LIST,
  PRODUCT_BRAND_SAVE,
  ADDRESS_PROVINCE_LIST,
  PRODUCT_ENTRY_PRICE_PERCENT_BATCH_UPDATE,
  PRODUCT_SUPPLIER_REL_DEFAULT_UPDATE,
  PRODUCT_USER_ADD,
  PRODUCT_SUPPLIER_LIST,
  NATION_LIST,
  PRODUCT_ENTRY_INFO_UPDATE,
  PRODUCT_PACKAGE_LIST,
  PRODUCT_PRICE_SAVE,
  PRODUCT_SUPPLIER_REL_SAVE,
  PRODUCT_PACKAGE_REL_UPDATE,
  LOGISTIC_PACKAGE_PAGE_LIST,
  PRODUCT_PACKAGE_REL_BATCH_SAVE,
  PRODUCT_PROPERTY_VALUE_LIST,
  WAREHOUSE_LIST,
  PRODUCT_BATCH_SKU_CUSTOM_GET,
  PRODUCT_PARENT_LIST,
  PRODUCT_PROPERTY_VALUE_SAVE,
  PRODUCT_VARIANT_REL_UPDATE,
  GLOBAL_UNIT_ITEM_LIST,
  PRODUCT_VARIANT_GROUP_LIST,
  UPLOAD_TEMPLATE_GET,
  PRODUCT_BATCH_SKU,
  PRODUCT_BATCH_UPLOAD_MATERIAL,
  PRODUCT_GROUP_ADD,
  PRODUCT_BASE_BATCH_UPLOAD,
  PRODUCT_REMARK_BATCH_UPDATE,
  PRODUCT_SUPPLIER_PRICE_REL_BATCH_DOWNLOAD,
  PRODUCT_DEVELOP_USER_LIST,
  PRODUCT_PURCHASE_USER_LIST,
  PRODUCT_BASE_CATEGORY_NUM,
  PRODUCT_OPERATION_BATCH_UPDATE,
  TAB_VARIANT_GET,
  PRODUCT_RICH_FILE_UPLOAD,
  PRODUCT_REMOVE,
  PRODUCT_VARIANTREL_UPDATE,
  PRODUCT_PACKAGE_REL_BATCH_REMOVE,
  PRODUCT_TAB_SAVE,
  PRODUCT_REMARK_SAVE,
  PRODUCT_IMG_DELETE,
  PRODUCT_TAB_GET,
  PRODUCT_COPY,
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
  PRODUCT_IMG_EXPORT,
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
  PRODUCT_BATCH_LOCK,
  PRODUCT_BATCH_ULOCK,
  PRODUCT_MOVE_SHOW,
  PRODUCT_MOVE_PAGE_LIST,
  PRODUCT_VARIANT_MOVE_PAGE_LIST,
  PRODUCT_VARIANT_LIST_SKU,
  PRODUCT_VARIANT_MOVE_CHECK,
  PRODUCT_VARIANT_BATCH_MOVE
}