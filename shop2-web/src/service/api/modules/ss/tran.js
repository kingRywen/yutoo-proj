export default [
  {
    path: "sellingFare/list",
    name: "sellingFareList",
    method: "POST",
    desc: "跟卖-运费模板 - 运费模板-列表"
  },
  {
    path: "sellingFare/update",
    name: "sellingFareUpdate",
    method: "POST",
    desc: "跟卖-运费模板 - 运费模板-编辑",

    showSuccess: true
  },
  {
    path: "sellingFare/save",
    name: "sellingFareSave",
    method: "POST",
    desc: "跟卖-运费模板 - 运费模板-添加",

    showSuccess: true
  },
  {
    path: "sellingFare/remove",
    name: "sellingFareRemove",
    method: "POST",
    desc: "跟卖-运费模板 - 运费模板-删除",

    newShowSuccess: true
  },
  {
    path: "sellingFare/saveDefault",
    name: "sellingFareSaveDefault",
    method: "POST",
    desc: "跟卖-运费模板 - 运费模板-设置为默认",
    showSuccess: true
  }
];
