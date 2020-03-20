export default [
  {
    path: "sellingStrategy/remove",
    name: "sellingStrategyRemove",
    method: "POST",
    desc: "删除策略 - 删除策略",

    newShowSuccess: true
  },
  {
    path: "sellingStrategy/saveDefault",
    name: "sellingStrategySaveDefault",
    method: "POST",
    desc: "跟卖-策略库 - 策略-设置为默认策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/infoByPrice",
    name: "sellingStrategyInfoByPrice",
    singleLoading: true,
    method: "POST",
    desc: "跟卖-策略库 - 策略-价格策略详情"
  },
  {
    path: "sellingStrategy/updateByCnt",
    name: "sellingStrategyUpdateByCnt",
    method: "POST",
    desc: "跟卖-策略库 - 策略-编辑跟卖数量策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/infoByInventory",
    name: "sellingStrategyInfoByInventory",
    method: "POST",
    desc: "跟卖-策略库 - 策略-库存策略详情"
  },
  {
    path: "sellingStrategy/saveByPrice",
    name: "sellingStrategySaveByPrice",
    method: "POST",
    desc: "跟卖-策略库 - 策略-添加价格策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/saveByInventory",
    name: "sellingStrategySaveByInventory",
    method: "POST",
    desc: "跟卖-策略库 - 策略-添加库存策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/saveByCnt",
    name: "sellingStrategySaveByCnt",
    method: "POST",
    desc: "跟卖-策略库 - 策略-添加跟卖数量策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/updateByInventory",
    name: "sellingStrategyUpdateByInventory",
    method: "POST",
    desc: "跟卖-策略库 - 策略-编辑库存策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/list",
    name: "sellingStrategyList",
    method: "POST",
    singleLoading: true,
    desc: "跟卖-策略库 - 策略-列表"
  },
  {
    path: "sellingStrategy/updateByPrice",
    name: "sellingStrategyUpdateByPrice",
    method: "POST",
    desc: "跟卖-策略库 - 策略-编辑价格策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/updateByFrequency",
    name: "sellingStrategyUpdateByFrequency",
    method: "POST",
    desc: "跟卖-策略库 - 策略-编辑跟卖频率策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/saveByFrequency",
    name: "sellingStrategySaveByFrequency",
    method: "POST",
    desc: "跟卖-策略库 - 策略-添加跟卖频率策略",

    showSuccess: true
  },
  {
    path: "sellingStrategy/updateByTime",
    name: "sellingStrategyUpdateByTime",
    method: "POST",
    showSuccess: true,
    desc: "跟卖-策略库 - 策略-更新跟卖时间策略"
  },
  {
    path: "sellingStrategy/infoByTime",
    name: "sellingStrategyInfoByTime",
    method: "POST",
    desc: "跟卖-策略库 - 策略-跟卖时间策略详情"
  },
  {
    path: "sellingStrategy/infoByFrequency",
    name: "sellingStrategyInfoByFrequency",
    method: "POST",
    desc: "跟卖-策略库 - 策略-跟卖频率策略详情"
  },
  {
    path: "sellingStrategy/infoByCnt",
    name: "sellingStrategyInfoByCnt",
    method: "POST",
    desc: "跟卖-策略库 - 策略-跟卖数量策略详情"
  },
  {
    path: "sellingStrategy/saveByTime",
    name: "sellingStrategySaveByTime",
    method: "POST",
    desc: "跟卖-策略库 - 策略-添加跟卖时间策略",

    showSuccess: true
  }
];
