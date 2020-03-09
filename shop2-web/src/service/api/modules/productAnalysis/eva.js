export default [
  {
    name: 'reviewerSaveTask',
    method: 'POST',
    desc: '添加任务',
    must: ['platformId', 'siteId', 'dataType'],
    path: '/reviewer/saveTask',
    showSuccess: true
  },
  {
    name: 'reviewerReCrawlTask',
    method: 'POST',
    desc: '重新抓取',
    must: ['platformId', 'siteId', 'taskIds'],
    path: '/reviewer/reCrawlTask',
    newShowSuccess: true
  },
  {
    name: 'reviewerRemoveTask',
    method: 'POST',
    desc: '删除任务',
    must: ['platformId', 'siteId', 'taskIds'],
    path: '/reviewer/removeTask',
    newShowSuccess: true
  },
  {
    name: 'reviewerTaskList',
    method: 'POST',
    desc: '任务列表',
    must: ['platformId', 'siteId'],
    path: '/reviewer/taskList'
  },
  {
    name: 'reviewerAsinList',
    method: 'POST',
    desc: '任务Asin列表',
    must: ['platformId', 'siteId', 'taskId'],
    path: '/reviewer/asinList'
  },
  {
    name: 'reviewerDetail',
    allowNull: ['starRateMin', 'starRateMax'],
    method: 'POST',
    desc: '评价者详情',
    must: ['platformId', 'siteId', 'taskId'],
    path: '/reviewer/detail'
  },
  {
    name: 'reviewerExportDetail',
    method: 'POST',
    desc: '评价者详情导出',
    showSuccess: true,
    singleLoading: true,
    config: {
      responseType: 'blob'
    },
    must: ['platformId', 'siteId', 'taskId'],
    path: '/reviewer/exportDetail'
  },
  {
    name: 'reviewerStat',
    method: 'POST',
    desc: '数据分析',
    must: ['platformId', 'siteId', 'taskId'],
    path: '/reviewer/stat'
  }
];
