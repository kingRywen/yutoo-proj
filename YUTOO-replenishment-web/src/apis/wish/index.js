// 获取编辑listing tab数据
const productPltDetailGroupList = {
  method: 'post',
  url: "/product/plt/detail/group/list",
}
// 获取公共取值范围
const salePfGlobaGroupItemGetItem = {
  method: 'post',
  url: "/SalePfGlobaGroupItem/getItem",
}
// 获取取值范围组
const salePfGlobaGroupGetGroupByKey = {
  method: 'post',
  url: "/SalePfGlobaGroup/getGroupByKey",
}

module.exports = {
  productPltDetailGroupList,
  salePfGlobaGroupItemGetItem,
  salePfGlobaGroupGetGroupByKey,
}