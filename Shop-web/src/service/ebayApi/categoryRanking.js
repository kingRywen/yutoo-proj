export default [
    //类目排名
    {
        name: 'ebTaskCategoryRankList',
        method: 'POST',
        desc: '类目搜索排名-任务列表',
        path: '/ebTaskCategoryRank/list',
        mock : false,
        // showSuccess: true,
        params: {},
        must:['platformId','siteId','sellerId']
    },
    {
        name: 'ebTaskCategoryRankReCrawl',
        method: 'POST',
        desc: '类目搜索排名-重新抓取',
        path: '/ebTaskCategoryRank/reCrawl',
        mock : false,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskCategoryRankSave',
        method: 'POST',
        desc: '类目搜索排名-添加任务',
        path: '/ebTaskCategoryRank/save',
        mock : false,
         showSuccess: true,
        params: {},
        must:['platformId','siteId','sellerId','categoryId','asin','productType','monitorFlag']
    },
    {
        name: 'ebTaskCategoryRankRemove',
        method: 'POST',
        desc: '类目搜索排名-删除任务',
        path: '/ebTaskCategoryRank/remove',
        mock : false,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskCategoryRankUpdateMonitor',
        method: 'POST',
        desc: '类目搜索排名-修改监控',
        path: '/ebTaskCategoryRank/updateMonitor',
        mock : false,
         showSuccess: true,
        params: {},
        must:['taskIds','monitorFrom','monitorTo','frequency']
    },
    {
        name: 'ebTaskCategoryRankRemoveMonitor',
        method: 'POST',
        desc: '类目搜索排名-取消监控',
        path: '/ebTaskCategoryRank/removeMonitor',
        mock : false,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskCategoryRankAddMonitor',
        method: 'POST',
        desc: '类目搜索排名-添加监控',
        path: '/ebTaskCategoryRank/addMonitor',
        mock : false,
         showSuccess: true,
        params: {},
        must:['taskIds','monitorFrom','monitorTo','frequency']
    },
    {
        name: 'ebTaskCategoryRankCurveList',
        method: 'POST',
        desc: '类目搜索排名-数据曲线展示',
        path: '/ebTaskCategoryRank/curveList',
        mock : false,
         //showSuccess: true,
        params: {},
        must:['taskId','startTime','endTime']
    },

]