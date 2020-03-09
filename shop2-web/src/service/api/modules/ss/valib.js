export default [
  {
    path: "sellingMaybe/maybeAllProductList",
    name: "sellingMaybeAllProductList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 产品列表-按父统计",
    mock: true
  },
  {
    path: "sellingMaybe/updateProductGroup",
    name: "sellingUpdateProductGroup",
    method: "POST",
    newShowSuccess: true,
    desc: "跟卖-跟卖源复制api数据 - 加入分组",
    mock: true
  },
  {
    path: "sellingMaybe/sellerAllList",
    name: "sellingSellerAllList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 跟卖卖家列表",
    mock: true
  },
  {
    path: "sellingMaybe/maybeChildProductList",
    name: "sellingMaybeChildProductList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 产品列表-按子产品统计",
    mock: true
  },
  {
    path: "sellingMaybe/mySellerList",
    name: "sellingMySellerList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 查询条件店铺下拉列表",
    mock: true
  },
  {
    path: "sellingMaybe/sellingList",
    name: "sellingSellingList",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 跟卖列表",
    mock: true
  },
  {
    path: "sellingMaybe/updateCost",
    name: "sellingUpdateCost",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 修改产品成本",
    newShowSuccess: true,
    mock: true
  },
  {
    path: "sellingMaybe/removeTarget",
    name: "sellingRemoveTarget",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 删除",
    newShowSuccess: true,

    showSuccess: true,
    mock: true
  },
  {
    path: "sellingMaybe/check",
    name: "sellingCheck",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 重新校验",
    newShowSuccess: true,
    mock: true
  },
  {
    path: "sellingMaybe/saveLib",
    name: "sellingSaveLib",
    method: "POST",
    desc: "跟卖-跟卖源复制api数据 - 跟卖/修改跟卖【对应页面修改策略】",
    newShowSuccess: true,
    mock: true
  },
  {
    path: "sellingMaybe/updateLocalStock",
    name: "sellingMaybeUpdateLocalStock",
    method: "POST",
    desc: "跟卖-可跟卖库 - 修改库存",
    mock: true,
    newShowSuccess: true
  },
  {
    path: "sellingMaybe/sellingList",
    name: "sellingMaybeSellingList",
    method: "POST",
    desc: "全部接口 - 跟卖列表",
    mock: true
  }
];
