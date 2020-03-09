const config = require('../common/config')
const REP_URL = config.REP_URL

//平台
const productPortUrl = config.BASE_URL
//权限
const  permsPortRrl = config.PERMS_URL

console.log(productPortUrl)

// 智能补货
const REPLENISHPRODUCT_REPLENISHPRODUCTLIST = {
  method: 'post',
  url: REP_URL + "/replenishProduct/replenishProductList",
}

// 列表-当前库存(提示框列表)
const REPLENISHDETAILED_GETREPLENISHTRANSPORTITEM = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/getReplenishTransportItem",
}

// 列表-日销量提示框
const REPLENISHPRODUCTSTATUSRECORD_GETDAILYSALES = {
  method: 'post',
  url: REP_URL + "/replenishProductStatusRecord/getDailySales",
}

// 列表-运输方式(提示框列表)
const REPLENISHPRODUCT_GETTRANSPORTATIONLIST = {
  method: 'post',
  url: REP_URL + "/replenishProduct/getTransportationList",
}

// 删除-补货公式
const REPLENISHFORMULA_REMOVE = {
  method: 'post',
  url: REP_URL + "/replenishFormula/remove",
}

// 上传-导入运输中数量文件
const REPLENISHDETAILED_UPLOADSHIPPINGCOUNT = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/uploadShippingCount",
}

// 上传-导入运输中数量文件确认
const REPLENISHDETAILED_UPLOADSHIPPINGCOUNTCONFIRM = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/uploadShippingCountConfirm",
}

// 下载-补货确认并导出数据
const REPLENISHDETAILED_CONFIRMANDEXPORT = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/confirmAndExport",
}

// 下载-补货明细(或批量)
const REPLENISHDETAILED_DOWNLOAD = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/download",
}

// 下载-导入运输中模板
const REPLENISHDETAILED_DOWNLOADSHIPPINGCOUNTMODEL = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/downloadShippingCountModel",
}

// 列表搜索-智能补货列表（变体）
const REPLENISHPRODUCT_REPLENISHPRODUCTLISTVARIANTS = {
  method: 'post',
  url: REP_URL + "/replenishProduct/replenishProductListVariants",
}

// 列表搜索-补货明细列表
const REPLENISHDETAILED_LIST = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/list",
}

// 列表搜索-补货公式
const REPLENISHFORMULA_LIST = {
  method: 'post',
  url: REP_URL + "/replenishFormula/list",
}

// 列表搜索-批量补货列表（产品id列表为必须条件）
const REPLENISHPRODUCT_BATCHREPLENISHPRODUCTLIST = {
  method: 'post',
  url: REP_URL + "/replenishProduct/batchReplenishProductList",
}

// 列表-获取生命周期类型列表
const REPLENISHPRODUCT_GETCYCLETYPE = {
  method: 'post',
  url: REP_URL + "/replenishProduct/getCycleType",
}

// 列表-补货详细(提示框列表)
const REPLENISHPRODUCT_GETREPLENISHDETAILSLIST = {
  method: 'post',
  url: REP_URL + "/replenishProduct/getReplenishDetailsList",
}

// 添加-公式参数
const REPLENISHFORMULA_SAVE = {
  method: 'post',
  url: REP_URL + "/replenishFormula/save",
}

// 添加-复制公式参数
const REPLENISHFORMULA_CLONE = {
  method: 'post',
  url: REP_URL + "/replenishFormula/clone",
}

// 编辑-公式参数
const REPLENISHFORMULA_UPDATE = {
  method: 'post',
  url: REP_URL + "/replenishFormula/update",
}

// 编辑-取消补货(或批量)
const REPLENISHDETAILED_CANCELREPLENISHMENT = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/cancelReplenishment",
}

// 编辑-手动设置生命周期
const REPLENISHPRODUCT_UPDATEPRODUCTCYCLE = {
  method: 'post',
  url: REP_URL + "/replenishProduct/updateProductCycle",
}

// 编辑-恢复生命周期
const REPLENISHPRODUCT_RECOVERYPRODUCTCYCLE = {
  method: 'post',
  url: REP_URL + "/replenishProduct/recoveryProductCycle",
}

// 编辑-批量关注
const REPLENISHPRODUCT_UPDATEATTENTIONFLAG = {
  method: 'post',
  url: REP_URL + "/replenishProduct/updateAttentionFlag",
}

// 查询-公式参数（用于编辑或其他）
const REPLENISHFORMULA_INFO = {
  method: 'post',
  url: REP_URL + "/replenishFormula/info",
}

// 获取补货明显列表
const REPLENISHMENT_LIST = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/list",
}
//获取生命周期列表
const CYCLE_LIST = {
  method: 'post',
  url: REP_URL + "/replenishProduct/getCycleType",
}
//获取用户的所有运输方式
const TRANSPORT_FIRST_NATION_TRANSPORT_LIST = {
  method: 'post',
  url: REP_URL + "/replenishFormula/getTransportList",
}

//获取用户的所有运输方式
const REPLENISHDETAILED_GETALLTRANSPORT = {
  method: 'post',
  url: REP_URL + "/replenishFormula/getTransportList",
}

//获取平台列表=>站点
const PLATFORMSITE = {
    method: 'post',
    url:productPortUrl+"/platform/list/platform/site"
}
//获取同步类型
const REPLENISHSYN_GETSYNTYPE = {
    method: 'post',
    url:REP_URL + "/ReplenishSyn/getSynType"
}
//根据站点获取店铺
const STORE_LIST_BY_SITE = {
    method: 'post',
    url:productPortUrl + "/store/list/by/site"
}
//手动同步
const REPLENISHSYN_SYNSTOREINFO = {
    method: 'post',
    url:REP_URL + "/ReplenishSyn/synStoreInfo"
}
//获取同步日志列表
const REPLENISHSYNRECORD_LIST = {
    method: 'post',
    url:REP_URL + "/ReplenishSynRecord/list"
}
//获取用户列表
const MERCHANT_USER_LIST = {
    method: 'post',
    url: permsPortRrl + "/merchant/user/list"
}



module.exports = {
    PLATFORMSITE,
    REPLENISHSYN_GETSYNTYPE,
    STORE_LIST_BY_SITE,
    REPLENISHSYN_SYNSTOREINFO,
    REPLENISHSYNRECORD_LIST,
    MERCHANT_USER_LIST,



  REPLENISHMENT_LIST,
  REPLENISHDETAILED_GETALLTRANSPORT,
  CYCLE_LIST,
  REPLENISHFORMULA_REMOVE,
  REPLENISHPRODUCT_REPLENISHPRODUCTLIST,
  TRANSPORT_FIRST_NATION_TRANSPORT_LIST,
  REPLENISHFORMULA_INFO,
  REPLENISHPRODUCT_RECOVERYPRODUCTCYCLE,
  REPLENISHPRODUCT_UPDATEATTENTIONFLAG,
  REPLENISHPRODUCT_UPDATEPRODUCTCYCLE,
  REPLENISHDETAILED_CANCELREPLENISHMENT,
  REPLENISHFORMULA_UPDATE,
  REPLENISHFORMULA_CLONE,
  REPLENISHPRODUCT_GETCYCLETYPE,
  REPLENISHFORMULA_SAVE,
  REPLENISHPRODUCT_GETREPLENISHDETAILSLIST,
  REPLENISHPRODUCT_BATCHREPLENISHPRODUCTLIST,
  REPLENISHDETAILED_LIST,
  REPLENISHFORMULA_LIST,
  REPLENISHDETAILED_UPLOADSHIPPINGCOUNTCONFIRM,
  REPLENISHDETAILED_DOWNLOAD,
  REPLENISHPRODUCT_REPLENISHPRODUCTLISTVARIANTS,
  REPLENISHDETAILED_CONFIRMANDEXPORT,
  REPLENISHDETAILED_DOWNLOADSHIPPINGCOUNTMODEL,
  REPLENISHPRODUCTSTATUSRECORD_GETDAILYSALES,
  REPLENISHPRODUCT_GETTRANSPORTATIONLIST,
  REPLENISHDETAILED_GETREPLENISHTRANSPORTITEM,
  REPLENISHDETAILED_UPLOADSHIPPINGCOUNT
}
