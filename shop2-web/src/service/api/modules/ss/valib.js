export default [
  {
    path: "sellingMaybe/maybeAllProductList",
    name: "sellingMaybeAllProductList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 产品列表-按父统计",
    mock: false
  },
  {
    path: "sellingMaybe/updateProductGroup",
    name: "sellingUpdateProductGroup",
    method: "POST",
    newShowSuccess: true,
    desc: "跟卖-跟卖源复制api数据 - 加入分组",
    mock: false
  },
  {
    path: "sellingMaybe/sellerAllList",
    name: "sellingSellerAllList",
    method: "POST",
    singleLoading: true,
    desc: "跟卖-跟卖源复制api数据 - 跟卖卖家列表",
    mock: false
  },
  {
    path: "sellingMaybe/maybeChildProductList",
    name: "sellingMaybeChildProductList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 产品列表-按子产品统计",
    mock: false
  },
  {
    path: "sellingMaybe/mySellerList",
    name: "sellingMySellerList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 查询条件店铺下拉列表",
    mock: false
  },
  {
    path: "sellingMaybe/sellingList",
    name: "sellingSellingList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 跟卖列表",
    mock: false
  },
  {
    path: "sellingMaybe/updateCost",
    name: "sellingUpdateCost",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 修改产品成本",
    newShowSuccess: true,
    mock: false
  },
  {
    path: "sellingMaybe/removeTarget",
    name: "sellingRemoveTarget",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 删除",
    newShowSuccess: true,

    showSuccess: true,
    mock: false
  },
  {
    path: "sellingMaybe/check",
    name: "sellingCheck",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 重新校验",
    newShowSuccess: true,
    mock: false
  },
  {
    path: "sellingMaybe/saveLib",
    name: "sellingSaveLib",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 跟卖/修改跟卖【对应页面修改策略】",
    newShowSuccess: true,
    mock: false
  },
  {
    path: "sellingMaybe/updateLocalStock",
    name: "sellingMaybeUpdateLocalStock",
    method: "POST",
    desc: "跟卖-可跟卖库 - 修改库存",
    mock: false,
    newShowSuccess: true
  },
  {
    path: "sellingMaybe/sellingList",
    name: "sellingMaybeSellingList",
    method: "POST",
    desc: "全部接口 - 跟卖列表",
    mock: false
  },
  {
    path: "sellingMaybe/getChildProductList",
    name: "sellingMayBeGetChildProductList",
    method: "POST",
    desc: "跟卖-可跟卖库 - 获取子产品列表",
    mock: false
  },
  {
    path: "sellingMaybe/updateStockThreshold",
    name: "sellingMaybeUpdateStockThreshold",
    method: "POST",
    desc: "全部接口 - 修改库存阀值",
    // mock: true,
    newShowSuccess: true
  }
];
