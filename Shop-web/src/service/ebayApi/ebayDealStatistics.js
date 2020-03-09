export default[
    //成交统计
    {
        name: 'ebTaskSalesStatListTaskDetail',
        method: 'POST',
        desc: '任务详情列表',
        path: '/ebTaskSalesStat/listTaskDetail',
        mock : false,
        // showSuccess: true,
        params: {},
        must:['siteId','sellerId','startTime','endTime']
    },
    {
        name: 'ebTaskSalesStatBatchRemove',
        method: 'POST',
        desc: '批量删除任务',
        path: '/ebTaskSalesStat/batchRemove',
        mock : false,
         showSuccess: true,
        params: {},
        must:['siteId','sellerId','ids']
    },
    {
        name: 'ebTaskSalesStatSave',
        method: 'POST',
        desc: '添加任务',
        path: '/ebTaskSalesStat/save',
        mock : false,
        // showSuccess: true,
        params: {},
        must:['siteId','sellerId','platformId','taskName','dataType','dataSources']
    },
    {
        name: 'ebTaskSalesStatReExecute',
        method: 'POST',
        desc: '重新执行任务',
        path: '/ebTaskSalesStat/reExecute',
        mock : false,
         showSuccess: true,
        params: {},
        must:['siteId','sellerId','ids']
    },
    {
        name: 'ebTaskSalesStatListParentAsin',
        method: 'POST',
        desc: '产品ASIN列表',
        path: '/ebTaskSalesStat/listParentAsin',
        mock : false,
        // showSuccess: true,
        params: {},
        must:['siteId','sellerId','taskId']
    },
    {
        name: 'ebTaskSalesStatList',
        method: 'POST',
        desc: '任务列表',
        path: '/ebTaskSalesStat/list',
        mock : false,
        // showSuccess: true,
        params: {},
        must:['siteId','sellerId','platformId']
    },
]