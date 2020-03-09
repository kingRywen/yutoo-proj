export default [
  {
    path: "sellingLib/syncFbpFlag",
    name: "sellingSyncFbpFlag",
    method: "POST",
    desc: "跟卖-跟卖库 - 同步跟卖发货方式",

    newShowSuccess: true
  },
  {
    path: "sellingLib/sellingLibList",
    name: "sellingSellingLibList",
    method: "POST",
    desc: "跟卖-跟卖库 - 跟卖列表"
  },
  {
    path: "sellingLib/removeLib",
    name: "sellingRemoveLib",
    method: "POST",
    desc: "跟卖-跟卖库 - 删除",

    newShowSuccess: true
  },
  {
    path: "sellingLib/libAllProductList",
    name: "sellingLibAllProductList",
    method: "POST",
    desc: "跟卖-跟卖库 - 产品列表-按父统计"
  },
  {
    path: "sellingLib/libChildProductList",
    name: "sellingLibChildProductList",
    method: "POST",
    desc: "跟卖-跟卖库 - 产品列表-按子统计"
  }
];
