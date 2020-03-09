export default [
  {
    name: "salesOrderGetSalesOrderRec",
    method: "POST",
    desc: "订单同步状态",
    must: ["sellerId"],
    path: "/salesOrder/getSalesOrderRec",
    mock: true
  },
  {
    name: "salesOrderSyncOrder",
    method: "POST",
    desc: "订单同步状态",
    must: ["sellerId", "monthCnt"],
    path: "/salesOrder/syncOrder",
    mock: true
  },
  {
    name: "salesOrderList",
    method: "POST",
    desc: "整店销量报表",
    must: ["sellerId", "startTime", "endTime", "period"],
    path: "/salesOrder/list",
    mock: true
    // mockData: {
    //   "list|1-10": [
    //     {
    //       // 属性 id 是一个自增数，起始值为 1，每次增 1
    //       "id|+1": 1
    //     }
    //   ]
    // }
  },
  {
    name: "salesOrderSalesStat",
    method: "POST",
    desc: "销量报表",
    must: ["sellerId", "startTime", "endTime", "statType"],
    path: "/salesOrder/salesStat",
    mock: true
  },
  {
    name: "salesPriceConfigInfo",
    method: "POST",
    desc: "获取店铺价格区间",
    must: ["sellerId"],
    path: "/salesPriceConfig/info",
    mock: true
  },
  {
    name: "salesPriceConfigSave",
    method: "POST",
    desc: "保存店铺价格区间",
    must: ["sellerId", "range"],
    path: "/salesPriceConfig/save",
    mock: true
  },
  {
    name: "salesOrderPriceStat",
    method: "POST",
    desc: "价格区间订单统计",
    must: ["startTime", "endTime"],
    path: "/salesOrder/priceStat",
    mock: true
  },
  {
    name: "salesOrderSalesSkuStat",
    method: "POST",
    desc: "sku销量占比",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/salesSkuStat",
    mock: true
  },
  {
    name: "salesOrderSalesSkuStatToPage",
    method: "POST",
    desc: "sku销量占比(分页)",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/salesSkuStatToPage",
    mock: true
  },
  {
    name: "salesOrderOldCustToAddress",
    method: "POST",
    desc: "订单地址下拉列表",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/oldCustToAddress",
    mock: true
  },
  {
    name: "salesOrderOldCustByBuyCnt",
    method: "POST",
    desc: "购买次数区间统计",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/oldCustByBuyCnt",
    mock: true
  },
  {
    name: "salesOrderOldCustByIntervalTime",
    method: "POST",
    desc: "重复购买间隔时间区间分布",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/oldCustByIntervalTime",
    mock: true
  },
  {
    name: "salesOrderOldCustByCountry",
    method: "POST",
    desc: "国家分布",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/oldCustByCountry",
    mock: true
  },
  {
    name: "salesOrderOldCustByState",
    method: "POST",
    desc: "州分布",
    must: ["sellerId", "startTime", "endTime", "countrys"],
    path: "/salesOrder/oldCustByState",
    mock: true
  },
  {
    name: "salesOrderOldCustByCity",
    method: "POST",
    desc: "城市分布",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/oldCustByCity",
    mock: true
  },
  {
    name: "salesOrderOldCustByCityExport",
    method: "POST",
    desc: "城市分布-导出",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/oldCustByCityExport",
    mock: true
  },
  {
    name: "salesOrderOldCustDetail",
    method: "POST",
    desc: "老客户列表",
    must: ["sellerId", "startTime", "endTime"],
    path: "/salesOrder/OldCustDetail",
    mock: true
  }
];
