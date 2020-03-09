const config = require('@/common/config')

const ORDER_URL = config.ORDER_URL




/**
 * 付费模板
 */
// 获取下拉框
const ebayPaymentTemplateGetCombobox = {
  method: 'post',
  url: ORDER_URL + '/ebay/payment/template/getCombobox',
  noBase: true
}

// 获取模板信息
const ebayPaymentTemplateInfo = {
  method: 'post',
  url: ORDER_URL + '/ebay/payment/template/info',
  noBase: true
}

/**
 * paypal 账户管理
 */
// 获取下拉框
const ebayPaypalAccountGetCombobox = {
  method: 'post',
  url: ORDER_URL + '/ebay/paypal/account/getCombobox',
  noBase: true
}

/**
 * 退货政策
 */
const ebayReturnPolicyGetCombobox = {
  method: 'post',
  url: ORDER_URL + '/ebay/return/policy/getCombobox',
  noBase: true
}

const ebayReturnPolicyInfo = {
  method: 'post',
  url: ORDER_URL + '/ebay/return/policy/info',
  noBase: true
}

/**
 * 买家条件
 */

// 下拉
const ebayBuyersConditionsGetCombobox = {
  method: 'post',
  url: ORDER_URL + '/ebay/buyers/conditions/getCombobox',
  noBase: true
}
const ebayBuyersConditionsInfo = {
  method: 'post',
  url: ORDER_URL + '/ebay/buyers/conditions/info',
  noBase: true
}
/**
 * 运输方式
 */

// 下拉
const ebayTransportTypeGetCombobox = {
  method: 'post',
  url: ORDER_URL + '/ebay/transport/type/getCombobox',
  noBase: true
}
const ebayTransportTypeInfo = {
  method: 'post',
  url: ORDER_URL + '/ebay/transport/type/info',
  noBase: true
}
// 添加
const ebayTransportTypeSave = {
  method: 'post',
  url: ORDER_URL + '/ebay/transport/type/save',
  noBase: true
}
// 不运输的地区-添加省份列表
const ebayNoTransportRegionProvinceList = {
  method: 'post',
  url: ORDER_URL + '/ebay/no/transport/region/province/add/list',
  noBase: true
}
// 不运输的地区-列表
const ebayNoTransportRegionList = {
  method: 'post',
  url: ORDER_URL + '/ebay/no/transport/region/list',
  noBase: true
}
// 运输方式里面的运输方式-添加
const ebayTransportTypeTypeSave = {
  method: 'post',
  url: ORDER_URL + '/ebay/transport/type/type/save',
  noBase: true
}
// 运输方式里面的运输方式-删除
const ebayNoTransportRegionRemove = {
  method: 'post',
  url: ORDER_URL + '/ebay/no/transport/region/remove',
  noBase: true
}
// 运输方式里面的运输方式-编辑省份列表
const ebayNoTransportRegionProvinceEditList = {
  method: 'post',
  url: ORDER_URL + '/ebay/no/transport/region/province/edit/list',
  noBase: true
}
// 运输方式里面的运输方式-编辑省份列表
const ebayNoTransportRegionUpdate = {
  method: 'post',
  url: ORDER_URL + '/ebay/no/transport/region/update',
  noBase: true
}

/**
 * 刊登偏好
 */

// 获取下拉框/ebay/publish/preference/getCombobox
const ebayPublishPreferenceGetCombobox = {
  method: 'post',
  url: ORDER_URL + '/ebay/publish/preference/getCombobox',
  noBase: true
}
const ebayPublishPreferenceInfo = {
  method: 'post',
  url: ORDER_URL + '/ebay/publish/preference/info',
  noBase: true
}

module.exports = {
  ebayPaymentTemplateGetCombobox,
  ebayPaymentTemplateInfo,
  ebayReturnPolicyGetCombobox,
  ebayReturnPolicyInfo,
  ebayTransportTypeGetCombobox,
  ebayTransportTypeInfo,
  ebayPaypalAccountGetCombobox,
  ebayTransportTypeSave,
  ebayPublishPreferenceInfo,
  ebayPublishPreferenceGetCombobox,
  ebayBuyersConditionsGetCombobox,
  ebayBuyersConditionsInfo,
  ebayNoTransportRegionProvinceList,
  ebayNoTransportRegionList,
  ebayTransportTypeTypeSave,
  ebayNoTransportRegionRemove,
  ebayNoTransportRegionProvinceEditList,
  ebayNoTransportRegionUpdate
}
