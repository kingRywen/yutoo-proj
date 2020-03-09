const config = require('../common/config')

const WAREHOUSE_URL = config.WAREHOUSE_URL
const ORDER_URL = config.ORDER_URL
// 头程单位
const GLOBAL_UNIT_ITEM_TYPE_LIST = {
  method: 'post',
  url: WAREHOUSE_URL + "/global/unit/list",
  noBase: true
}

// 头程管理（列表）
const TRANSPORT_FIRST_LIST = {
  method: 'post',
  url: WAREHOUSE_URL + "/transport/first/list",
  noBase: true
}

// 头程管理（目的地列表  国家）
const TRANSPORT_FIRST_NATION = {
  method: 'post',
  url: WAREHOUSE_URL + "/transport/first/nation",
  noBase: true
}

// 所有运输方式
const logisticTransportTypeList = {
  method: 'post',
  url: WAREHOUSE_URL + "/logistic/transport/type/list",
  noBase: true
}

// 批量获取自定义sku
const LOGISTIC_COUNTRY_SEARCH_LIST_EBAY = {
  method: 'post',
  url: WAREHOUSE_URL + '/logistic/country/search/list/ebay',
  noBase: true
}

// 头程管理（新增）
const TRANSPORT_FIRST_SAVE = {
  method: 'post',
  url: WAREHOUSE_URL + "/transport/first/save",
  noBase: true
}

// 运输方式列表
const LOGISTIC_TRANSPORT_LOGISTIC_TRANSPORTATION_TYPE_LIST = {
  method: 'post',
  url: WAREHOUSE_URL + "/logistic/transport/logisticTransportation/type/list",
  noBase: true
}

// 运输方列表
const LOGISTIC_TRANSPORTATION_LIST = {
  method: 'post',
  url: WAREHOUSE_URL + "/logistic/transportation/list",
  noBase: true
}
// 国家列表
const LOGISTIC_COUNTRY_SEARCH_LIST = {
  method: 'post',
  url: WAREHOUSE_URL + "/logistic/country/search/list",
  noBase: true
}
// 省列表
const logisticProvinceSearchList = {
  method: 'post',
  url: WAREHOUSE_URL + "/logistic/province/search/list",
  noBase: true
}

// 头程管理（新增）
const TRANSPORT_FIRST_UPDATE = {
  method: 'post',
  url: WAREHOUSE_URL + "/transport/first/update",
  noBase: true
}

// 删除头程
const TRANSPORT_FIRST_BATCH_DELTE = {
  method: 'post',
  url: WAREHOUSE_URL + '/transport/first/batch/delete',
  noBase: true
}

// 获取所有仓库
const warehouseList = {
  method: 'post',
  url: ORDER_URL + '/warehouses/getWarehouseList',
  noBase: true
}


module.exports = {
  GLOBAL_UNIT_ITEM_TYPE_LIST,
  TRANSPORT_FIRST_BATCH_DELTE,
  LOGISTIC_TRANSPORTATION_LIST,
  TRANSPORT_FIRST_LIST,
  TRANSPORT_FIRST_SAVE,
  LOGISTIC_COUNTRY_SEARCH_LIST,
  TRANSPORT_FIRST_UPDATE,
  logisticProvinceSearchList,
  LOGISTIC_TRANSPORT_LOGISTIC_TRANSPORTATION_TYPE_LIST,
  logisticTransportTypeList,
  warehouseList,
  LOGISTIC_COUNTRY_SEARCH_LIST_EBAY,
  TRANSPORT_FIRST_NATION,
}