export default [
    //排名查询 自然/广告搜索排名
    {
        name: 'ebTaskKeywordRankList',
        method: 'POST',
        desc: '自然/广告搜索排名-任务列表',
        path: '/ebTaskKeywordRank/list',
        mock: true,
        // showSuccess: true,
        params: {},
        must:['platformId','siteId','sellerId','taskFlag']
    },
    {
        name: 'ebTaskKeywordRankReCrawl',
        method: 'POST',
        desc: '自然/广告搜索排名-重新抓取',
        path: 'ebTaskKeywordRank/reCrawl',
        mock: true,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskKeywordRankSave',
        method: 'POST',
        desc: '自然/广告搜索排名-添加任务',
        path: '/ebTaskKeywordRank/save',
        mock: true,
        mockPath: '',
        showSuccess:true,
        must:['platformId','siteId','sellerId','taskFlag','keywords','productTtype'],
        pcommonarams: {
        }
    },
    {
        name: 'ebTaskKeywordRankRemove',
        method: 'POST',
        desc: '自然/广告搜索排名-删除任务',
        path: '/ebTaskKeywordRank/remove',
        mock: true,
        mockPath: '',
        showSuccess:true,
        must:['taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'ebTaskKeywordRankAddMonitor',
        method: 'POST',
        desc: '自然/广告搜索排名-添加监控',
        path: '/ebTaskKeywordRank/addMonitor',
        mock: true,
        mockPath: '',
        showSuccess:true,
        must:['taskIds','monitorFrom','monitorTo','frequency'],
        pcommonarams: {
        }
    },
    {
        name: 'ebTaskKeywordRankUpdateMonitor',
        path: '/ebTaskKeywordRank/updateMonitor',
        method: 'POST',
        desc: '自然/广告搜索排名-修改监控',
        mock: true,
        mockPath: '',
        showSuccess:true,
        must:['taskIds','monitorFrom','monitorTo','frequency'],
        pcommonarams: {
        }
    },

    {
        name: 'ebTaskKeywordRankRemoveMonitor',
        method: 'POST',
        desc: '自然/广告搜索排名-取消监控',
        path: '/ebTaskKeywordRank/removeMonitor',
        mock: true,
        mockPath: '',
        showSuccess:true,
        must:['taskIds'],
        pcommonarams: {
        }
    },

    {
        name: 'ebTaskKeywordRankCurveList',
        method: 'POST',
        desc: '自然/广告搜索排名-数据曲线展示',
        path: '/ebTaskKeywordRank/curveList',
        mock: true,
        mockPath: '',
        //showSuccess:true,
        must:['taskId','startTime','endTime'],
        pcommonarams: {
        }
    },
   

]