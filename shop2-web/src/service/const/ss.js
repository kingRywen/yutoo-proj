export default [
  {
    name: "strategyType",
    desc: "策略类型",
    value: [
      { label: "跟卖库存策略", value: 0 },
      { label: "跟卖价格策略", value: 1 },
      { label: "跟卖数量策略", value: 2 },
      { label: "跟卖时间策略", value: 3 },
      { label: "监控频率策略", value: 4 }
    ]
  },
  {
    name: "scDataType",
    desc: "抓取方式",
    value: [
      { label: "类目", value: 0 },
      { label: "关键词", value: 1 },
      { label: "店铺ID", value: 2 },
      { label: "ASIN", value: 3 }
    ]
  },
  {
    name: "checkStatus",
    desc: "校验状态",
    value: [
      { label: "校验中", value: 0 },
      { label: "校验成功", value: 1 },
      { label: "校验失败", value: 2 }
    ]
  },
  {
    name: "firstStatus",
    desc: "跟卖库-抓取状态",
    value: [
      { label: "无需抓取", value: 0 },
      { label: "抓取中", value: 1 },
      { label: "抓取成功", value: 2 },
      { label: "抓取失败", value: 3 }
    ]
  }
];
