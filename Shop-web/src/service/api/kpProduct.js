export default [
  //  产品价格优化侧边栏
  {
      name: 'kpProductSave',
      method: 'POST',
      desc: '添加任务',
      path: '/kpProduct/save',
      mockPath: 'http://120.79.124.232:8001/mock/12/kpProduct/save',
      mock: true,
      newShowSuccess: true,
      pcommonarams: {
      }
  },
  {
      name: 'kpProductList',
      method: 'POST',
      desc: '任务列表',
      
      path: '/kpProduct/list',
      mockPath: 'http://120.79.124.232:8001/mock/12/kpProduct/list',
      mock: true,
      pcommonarams: {
      }
  },
  {
      name: 'kpProductReCrawl',
      method: 'POST',
      desc: '重新抓取任务',
      newShowSuccess: true,
      path: '/kpProduct/reCrawl',
      mockPath: 'http://120.79.124.232:8001/mock/12/kpProduct/reCrawl',
      mock: true,
      pcommonarams: {
      }
  },
  {
      name: 'kpProductRemove',
      method: 'POST',
      desc: '删除任务',
      path: '/kpProduct/remove',
      mockPath: 'http://120.79.124.232:8001/mock/12/kpProduct/remove',
      mock: true,
      newShowSuccess: true,
      pcommonarams: {
      }
  },
  {
      name: 'kpProductSelect',
      method: 'POST',
      desc: 'asin下拉',
      path: '/kpProduct/select',
      mockPath: 'http://120.79.124.232:8001/mock/12/kpProduct/select',
      mock: true,
      pcommonarams: {
      }
  },
  {
      name: 'kpProductCsv',
      method: 'POST',
      desc: '',
      path: '/kpProduct/csv',
      mockPath: 'http://120.79.124.232:8001/mock/12/kpProduct/csv',
      mock: true,
      singleLoading: true,
      pcommonarams: {
      }
  },
]