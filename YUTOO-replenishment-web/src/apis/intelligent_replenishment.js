import { CONST_PORT_CONFIG } from 'Config'

const { REP_URL } = CONST_PORT_CONFIG

//平台
// const productPortUrl = CONST_PORT_CONFIG.PRODUCT_URL
const LOGIN_URL = CONST_PORT_CONFIG.LOGIN_URL

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

// 列表-生产批次提示框
const REPLENISH_PD_ITEM_GET_IN_PRODUCE_SORT = {
  method: 'post',
  url: REP_URL + "/ReplenishPdItem/getInProduceSort",
}
// 列表-运输方式(提示框列表)
const REPLENISHPRODUCT_GETTRANSPORTATIONLIST = {
  method: 'post',
  url: REP_URL + "/replenishProduct/getTransportationList",
}

// 重新同步
const REPLENISHSYN_RETRYSYN = {
  method: 'post',
  url: REP_URL + "/ReplenishSyn/RetrySyn",
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

//获取用户的所有运输方式
const REPLENISHDETAILED_GETALLTRANSPORT_ALL = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/getAllTransport",
}

//获取平台列表=>站点
const PLATFORMSITE = {
  method: 'post',
  url: "/platform/list/platform/site"
}
//获取同步类型
const REPLENISHSYN_GETSYNTYPE = {
  method: 'post',
  url: REP_URL + "/ReplenishSyn/getSynType"
}
// //根据站点获取店铺
// const STORE_LIST_BY_SITE_1 = {
//     method: 'post',
//     url:"/store/list/by/site"
// }
//手动同步
const REPLENISHSYN_SYNSTOREINFO = {
  method: 'post',
  url: REP_URL + "/ReplenishSyn/synStoreInfo"
}
//获取同步日志列表
const REPLENISHSYNRECORD_LIST = {
  method: 'post',
  url: REP_URL + "/ReplenishSynRecord/list"
}
//获取用户列表
const MERCHANT_USER_LIST = {
  method: 'post',
  url: LOGIN_URL + "/merchant/user/list"
}
//获取用户列表
const REPLENISHPRODUCT_REPLENISHCHILDPRODUCTSHORTLIST = {
  method: 'post',
  url: REP_URL + "/replenishProduct/replenishChildProductShortList"
}
//获取用户列表
const REPLENISHPRODUCT_SETSHELFTIMEMODELDOWNLOAD = {
  method: 'post',
  url: REP_URL + "/replenishProduct/setShelfTimeModelDownload"
}
//获取用户列表
const REPLENISHPRODUCT_REPLENISHPRODUCTLISTCOUNT = {
  method: 'post',
  url: REP_URL + "/replenishProduct/replenishProductListCount"
}
//获取用户列表
const REPLENISHPRODUCT_UPLOADSHELFTIMECONFIRM = {
  method: 'post',
  url: REP_URL + "/replenishProduct/uploadShelfTimeConfirm"
}

//获取用户列表
const REPLENISHPRODUCT_SETTRANSPORT = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/setTransport"
}

//获取用户列表
const REPLENISH_PRODUCT_DELETE_PRODUCT = {
  method: 'post',
  url: REP_URL + "/replenishProduct/deleteProduct"
}

// 签收完成 
const REPLENISH_DETAILED_SET_SHIPPING_STATUS = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/setShippingStatus"
}

// 签收完成下载
const REPLENISH_DETAILED_DOWNLOAD_FBA_RECEIVING = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/downloadFbaReceiving"
}

// 计算销量
const REPLENISH_FORMULA_CALCULATION = {
  method: 'post',
  url: REP_URL + "/replenishFormula/calculation"
}


// 下载批量导入生产信息文件
const REPLENISH_PRODUCE_UPLOAD_DOWNLOAD_PRODUCE_INFO_MODEL = {
  method: 'post',
  url: REP_URL + "/ReplenishProduceUpload/downloadProduceInfoModel"
}

// 导入生产信息文件
const REPLENISH_PRODUCE_UPLOAD_UPLOAD_PRODUCE_INFO_MODEL = {
  method: 'post',
  url: REP_URL + "/ReplenishProduceUpload/uploadProduceInfoModel"
}

// 确认导入生产信息文件
const REPLENISH_PRODUCE_UPLOAD_UPLOAD_PRODUCE_INFO_CONFIRM = {
  method: 'post',
  url: REP_URL + "/ReplenishProduceUpload/uploadProduceInfoConfirm"
}

// 下载导入库存文件
const REPLENISH_PRODUCE_UPLOAD_DOWNLOAD_LOCAL_INVENTORY_MODEL = {
  method: 'post',
  url: REP_URL + "/ReplenishProduceUpload/downloadLocalInventoryModel"
}

// 导入库存文件
const REPLENISH_PRODUCE_UPLOAD_UPLOAD_LOCAL_INVENTORY_MODEL = {
  method: 'post',
  url: REP_URL + "/ReplenishProduceUpload/uploadLocalInventoryModel"
}

// 确认导入库存文件
const REPLENISH_PRODUCE_UPLOAD_UPLOAD_LOCAL_INVENTORY_CONFIRM = {
  method: 'post',
  url: REP_URL + "/ReplenishProduceUpload/uploadLocalInventoryConfirm"
}

// 生产补导出
const REPLENISH_DETAILED_CONFIRM_AND_PRODUCE_EXPORT = {
  method: 'post',
  url: REP_URL + "/replenishDetailed/confirmAndProduceExport"
}

// 询分批收货信息
const REPLENISH_PD_DELIVERY_LIST = {
  method: 'post',
  url: REP_URL + "/ReplenishPdDelivery/list"
}

// 生产明细列表
const REPLENISH_PD_LIST = {
  method: 'post',
  url: REP_URL + "/ReplenishPd/list"
}

// 收货完成
const REPLENISH_PD_COMPLETED = {
  method: 'post',
  url: REP_URL + "/ReplenishPd/completed"
}

// 下载导入生产中数量模版
const REPLENISH_PD_DOWNLOAD_PRODUCE_COUNT_MODEL = {
  method: 'post',
  url: REP_URL + "/ReplenishPd/downloadProduceCountModel"
}

// 导入生产中数量模版
const REPLENISH_PD_UPLOAD_PRODUCE_COUNT = {
  method: 'post',
  url: REP_URL + "/ReplenishPd/uploadProduceCount"
}

// 确认导入生产中数量模版
const REPLENISH_PD_UPLOAD_PRODUCE_COUNT_CONFIRM = {
  method: 'post',
  url: REP_URL + "/ReplenishPd/uploadProduceCountConfirm"
}

// 下载生产收货信息
const REPLENISH_PD_DOWLOAD_PRODUCE_INFOS = {
  method: 'post',
  url: REP_URL + "/ReplenishPd/dowloadProduceInfos"
}

// 下载分批收货信息
const REPLENISH_PD_DELIVERY_DOWNLOAD_BATCH = {
  method: 'post',
  url: REP_URL + "/ReplenishPdDelivery/downloadBatch"
}


export default {
  PLATFORMSITE,
  REPLENISH_PD_UPLOAD_PRODUCE_COUNT_CONFIRM,
  REPLENISH_PD_LIST,
  REPLENISH_PD_DELIVERY_DOWNLOAD_BATCH,
  REPLENISH_PD_DOWLOAD_PRODUCE_INFOS,
  REPLENISH_PD_ITEM_GET_IN_PRODUCE_SORT,
  REPLENISH_PD_UPLOAD_PRODUCE_COUNT,
  REPLENISH_PD_DOWNLOAD_PRODUCE_COUNT_MODEL,
  REPLENISH_PD_DELIVERY_LIST,
  REPLENISH_PD_COMPLETED,
  REPLENISH_PRODUCE_UPLOAD_UPLOAD_PRODUCE_INFO_CONFIRM,
  REPLENISH_DETAILED_CONFIRM_AND_PRODUCE_EXPORT,
  REPLENISH_PRODUCE_UPLOAD_UPLOAD_LOCAL_INVENTORY_MODEL,
  REPLENISH_PRODUCE_UPLOAD_DOWNLOAD_LOCAL_INVENTORY_MODEL,
  REPLENISH_PRODUCE_UPLOAD_UPLOAD_PRODUCE_INFO_MODEL,
  REPLENISH_PRODUCE_UPLOAD_DOWNLOAD_PRODUCE_INFO_MODEL,
  REPLENISH_PRODUCE_UPLOAD_UPLOAD_LOCAL_INVENTORY_CONFIRM,
  REPLENISH_FORMULA_CALCULATION,
  REPLENISHPRODUCT_SETTRANSPORT,
  REPLENISH_PRODUCT_DELETE_PRODUCT,
  REPLENISH_DETAILED_DOWNLOAD_FBA_RECEIVING,
  REPLENISH_DETAILED_SET_SHIPPING_STATUS,
  REPLENISHPRODUCT_REPLENISHCHILDPRODUCTSHORTLIST,
  REPLENISHPRODUCT_SETSHELFTIMEMODELDOWNLOAD,
  REPLENISHPRODUCT_UPLOADSHELFTIMECONFIRM,
  REPLENISHPRODUCT_REPLENISHPRODUCTLISTCOUNT,
  REPLENISHSYN_GETSYNTYPE,
  // STORE_LIST_BY_SITE_1,
  REPLENISHSYN_SYNSTOREINFO,
  REPLENISHSYNRECORD_LIST,
  MERCHANT_USER_LIST,



  REPLENISHMENT_LIST,
  REPLENISHDETAILED_GETALLTRANSPORT,
  REPLENISHDETAILED_GETALLTRANSPORT_ALL,
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
  REPLENISHSYN_RETRYSYN,
  REPLENISHDETAILED_GETREPLENISHTRANSPORTITEM,
  REPLENISHDETAILED_UPLOADSHIPPINGCOUNT
}