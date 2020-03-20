export default [
  {
    path: "sellingLib/syncFbpFlag",
    name: "sellingSyncFbpFlag",
    method: "POST",
    desc: "跟卖-跟卖库 - 同步跟卖发货方式",

    showSuccess: true
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
  },
  {
    path: "sellingLib/getChildProductList",
    name: "sellingLibGetChildProductList",
    method: "POST",
    desc: "获取子产品列表 - 获取子产品列表",
    mock: false
  },
  {
    path: "sellingLib/saveConfig",
    name: "sellingLibSaveConfig",
    showSuccess: true,
    method: "POST",
    desc: "跟卖-跟卖库 - 跟卖配置-保存"
    // mock: true
  },
  {
    path: "sellingLib/configInfo",
    name: "sellingLibConfigInfo",
    method: "POST",
    desc: "跟卖-跟卖库 - 跟卖配置-详情"
    // mock: true
  }
];
