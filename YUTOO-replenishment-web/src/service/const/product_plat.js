export default [
  {
    name: 'productType',
    desc: '用于列表的筛选条件',
    value: [
      { label: '所有产品', value: 0 },
      { label: '单件产品', value: 1 },
      { label: '组合产品', value: 2 }
    ]
  },
  {
    name: 'saleType',
    desc: '用于列表的筛选条件',
    value: [
      { label: '所有', value: null },
      { label: '自主上架', value: 1 },
      { label: '跟卖', value: 2 }
    ]
  },
  {
    name: 'productSource',
    desc: '产品来源',
    value: [
      { label: '自主创建', value: 1 },
      { label: '销售提报', value: 2 },
      { label: '平台采集', value: 3 },
      { label: '供应商提报', value: 4 },
    ]
  },
  {
    name: 'liveness',
    desc: '活跃度',
    value: [
      { label: '平款', value: 0 },
      { label: '爆款', value: 1 },
      { label: '衰款', value: 2 },
    ]
  },
];
