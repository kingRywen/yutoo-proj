export default [
  {
    path: "sellingSrc/saveTask",
    name: "sellingSaveTask",
    method: "POST",
    desc: "跟卖-策略库复制api数据 - 添加任务",

    showSuccess: true
  },
  {
    path: "sellingSrc/reCrawlTask",
    name: "sellingReCrawlTask",
    method: "POST",
    desc: "跟卖-策略库复制api数据 - 重新抓取"
  },
  {
    path: "sellingSrc/addToMaybe",
    name: "sellingAddToMaybe",
    method: "POST",
    newShowSuccess: true,
    desc: "跟卖-策略库复制api数据 - 加入可跟卖库"
  },
  {
    path: "sellingSrc/srcChildProductList",
    name: "sellingSrcChildProductList",
    method: "POST",
    desc: "跟卖-策略库复制api数据 - 产品列表-按子统计"
  },
  {
    path: "sellingSrc/getCategoryList",
    name: "sellingGetCategoryList",
    method: "POST",
    desc: "跟卖-策略库复制api数据 - 平台类目"
  },
  {
    path: "sellingSrc/srcAllProductList",
    name: "sellingSrcAllProductList",
    method: "POST",
    desc: "跟卖-策略库复制api数据 - 产品列表-按父统计"
  },
  {
    path: "sellingSrc/taskList",
    name: "sellingTaskList",
    method: "POST",
    desc: "跟卖-策略库复制api数据 - 任务列表"
  },
  {
    path: "sellingSrc/attention",
    name: "sellingAttention",
    method: "POST",
    newShowSuccess: true,
    desc: "跟卖-策略库复制api数据 - 关注/取消关注"
  },
  {
    path: "sellingSrc/removeSrc",
    name: "sellingRemoveSrc",
    method: "POST",
    desc: "跟卖-策略库复制api数据 - 删除产品",

    newShowSuccess: true
  },
  {
    path: "sellingSrc/reCrawlSrc",
    name: "sellingReCrawlSrc",
    method: "POST",
    newShowSuccess: true,
    desc: "跟卖-策略库复制api数据 - 重新抓取源数据"
  },
  {
    path: "sellingSrc/removeTask",
    name: "sellingRemoveTask",
    method: "POST",
    desc: "跟卖-策略库复制api数据 - 删除任务",

    showSuccess: true
  }
];
