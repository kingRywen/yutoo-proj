export default [
  {
    name: "status",
    desc: "任务状态",
    value: [
      {
        label: "抓取中",
        value: 1
      },
      {
        label: "抓取成功",
        value: 2
      },
      {
        label: "抓取失败",
        value: 3
      }
    ]
  },
  {
    name: "evaDataType",
    desc: "评价者分析-数据类型",
    value: [
      {
        label: "产品",
        value: 0
      },
      {
        label: "Top100链接",
        value: 1
      },
      {
        label: "Reviewer Top10000链接",
        value: 2
      }
    ]
  },
  {
    name: "everType",
    desc: "评价师类型",
    value: [
      { value: 0, label: "非评价师" },
      { value: 1, label: "Top 10000 Reviewer" },
      { value: 2, label: "VINE VOICE" },
      { value: 3, label: "HALL OF FAME REVIEWER" },
      { value: 4, label: "TOP CONTRIBUTOR" },
      { value: 5, label: "2008 HOLIDAY TEAM" },
      { value: 6, label: "COMMUNITY FORUM 04" }
    ]
  }
];
