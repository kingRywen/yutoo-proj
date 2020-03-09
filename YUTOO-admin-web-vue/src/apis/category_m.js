// 产品保存(新增)
const BASEPRODUCTPROPITEM_FINDITEMS = {
  method: 'post',
  url: "/BaseProductPropItem/findItems",
}

// 查询产品类目属性取值范围
const CATEPROPERTYM_FINDCATEPROPITEM = {
  method: 'post',
  url: "/CatePropertyM/findCatePropItem",
}

// 取值范围-获取颜色
const GLOBALCOLOR_LISTCOLOR = {
  method: 'post',
  url: "/GlobalColor/listColor",
}

// 查询产品类目属性取值范围
const SALEPFPROPITEM_GETPROPITEM = {
  method: 'post',
  url: "/SalePfPropItem/getPropItem",
}



module.exports = {
  BASEPRODUCTPROPITEM_FINDITEMS,
  CATEPROPERTYM_FINDCATEPROPITEM,
  GLOBALCOLOR_LISTCOLOR,
  SALEPFPROPITEM_GETPROPITEM,
}