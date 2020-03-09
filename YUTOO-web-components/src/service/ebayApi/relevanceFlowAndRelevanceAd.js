export default [
    //关联广告和关联流量
    {
        name: 'ebTaskRelatedList',
        method: 'POST',
        desc: '关联广告/关联流量-任务列表',
        path: '/ebTaskRelated/list',
        mock: true,
         //showSuccess: true,
        params: {},
        must:['platformId','siteId','sellerId','taskFlag']
    },
    {
        name: 'ebTaskRelatedReCrawl',
        method: 'POST',
        desc: '关联广告/关联流量-重新抓取',
        path: '/ebTaskRelated/reCrawl',
        mock: true,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskRelatedSave',
        method: 'POST',
        desc: '关联广告/关联流量-添加任务',
        path: '/ebTaskRelated/save',
        mock: true,
        showSuccess: true,
        params: {},
        must:['platformId','siteId','sellerId','asin','relateAsin','taskFlag','monitorFlag']
    },
    {
        name: 'ebTaskRelatedUpdateMonitor',
        method: 'POST',
        desc: '关联广告/关联流量-修改监控',
        path: '/ebTaskRelated/updateMonitor',
        mock: true,
         showSuccess: true,
        params: {},
        must:['taskIds','monitorFrom','monitorTo','frequency']
    },
    {
        name: 'ebTaskRelatedRemoveMonitor',
        method: 'POST',
        desc: '关联广告/关联流量-取消监控',
        path: '/ebTaskRelated/removeMonitor',
        mock: true,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskRelatedRemove',
        method: 'POST',
        desc: '关联广告/关联流量-删除任务',
        path: '/ebTaskRelated/remove',
        mock: true,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskRelatedAddMonitor',
        method: 'POST',
        desc: '关联广告/关联流量-添加监控',
        path: '/ebTaskRelated/addMonitor',
        mock: true,
         showSuccess: true,
        params: {},
        must:['taskIds','monitorFrom','monitorTo','frequency']
    },
    {
        name: 'ebTaskRelatedCurveList',
        method: 'POST',
        desc: '关联广告/关联流量-数据曲线展示',
        path: '/ebTaskRelated/curveList',
        mock: true,
         //showSuccess: true,
        params: {},
        must:['taskId','startTime','endTime']
    }

]