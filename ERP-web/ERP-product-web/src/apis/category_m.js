// 产品保存(新增)
const BASEPRODUCTPROPITEM_FINDITEMS = {
  method: 'post',
  url: '/BaseProductPropItem/findItems'
}

// 查询产品类目属性取值范围
const CATEPROPERTYM_FINDCATEPROPITEM = {
  method: 'post',
  url: '/CatePropertyM/findCatePropItem'
}

// 查询平台运输方式
const SALE_GLOBAL_PRO_ITEM_GET_GLOBAL_TRANSPORTS = {
  method: 'post',
  url: '/SaleGlobalProItem/getGlobalTransports'
}

// 取值范围-获取颜色
const GLOBALCOLOR_LISTCOLOR = {
  method: 'post',
  url: '/GlobalColor/listColor'
}

// 查询产品类目属性取值范围
const SALEPFPROPITEM_GETPROPITEM = {
  method: 'post',
  url: '/CatePfPropItemM/getPropItem'
}
// 查询产品类目属性取值范围
const SALEPFPROPITEM_GETPROPITEM_1 = {
  method: 'post',
  url: '/SalePfPropItem/getPropItem'
}

// 查询产品类目属性取值范围
const CATEGORYM_GETPATHSTRING = {
  method: 'post',
  url: '/CategoryM/getPathString'
}

// 类目管理-获取站点时间
const CATEGORY_GET_NOW_SITE_TIME = {
  method: 'post',
  url: '/Category/getNowSiteTime'
}

module.exports = {
  BASEPRODUCTPROPITEM_FINDITEMS,
  CATEGORY_GET_NOW_SITE_TIME,
  CATEGORYM_GETPATHSTRING,
  CATEPROPERTYM_FINDCATEPROPITEM,
  SALE_GLOBAL_PRO_ITEM_GET_GLOBAL_TRANSPORTS,
  GLOBALCOLOR_LISTCOLOR,
  SALEPFPROPITEM_GETPROPITEM,
  SALEPFPROPITEM_GETPROPITEM_1
}
