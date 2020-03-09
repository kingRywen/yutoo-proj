export default [
    //自然和广告排名频率分析
    {
        name: 'ebTaskKrFqList',
        method: 'POST',
        desc: '广告/自然排名频率分析-任务列表',
        path: '/ebTaskKrFq/list',
        mock: false,
        // showSuccess: true,
        params: {},
        must:['platformId','siteId','sellerId','taskFlag']
    },
    {
        name: 'ebTaskKrFqSave',
        method: 'POST',
        desc: '广告/自然排名频率分析-添加任务',
        path: '/ebTaskKrFq/save',
        mock: false,
         showSuccess: true,
        params: {},
        must:['platformId','siteId','sellerId','keywords','taskFlag','searchPages','productType','monitorFlag','monitorFrom','monitorTo','frequency']
    },
    {
        name: 'ebTaskKrFqtUpdateMonitor',
        method: 'POST',
        desc: '广告/自然排名频率分析-修改监控',
        path: '/ebTaskKrFq/updateMonitor',
        mock: false,
         showSuccess: true,
        params: {},
        must:['taskIds','searchPages','monitorFrom','monitorTo','frequency']
    },
    {
        name: 'ebTaskKrFqAddMonitor',
        method: 'POST',
        desc: '广告/自然排名频率分析-添加监控',
        path: '/ebTaskKrFq/addMonitor',
        mock: false,
         showSuccess: true,
        params: {},
        must:['taskIds','searchPages','monitorFrom','monitorTo','frequency']
    },
    {
        name: 'ebTaskKrFqRemoveMonitor',
        method: 'POST',
        desc: '广告/自然排名频率分析-取消监控',
        path: '/ebTaskKrFq/removeMonitor',
        mock: false,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskKrFqRemove',
        method: 'POST',
        desc: '广告/自然排名频率分析-删除任务',
        path: '/ebTaskKrFq/remove',
        mock: false,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskKrFqReCrawl',
        method: 'POST',
        desc: '广告/自然排名频率分析-重新抓取',
        path: '/ebTaskKrFq/reCrawl',
        mock: false,
         showSuccess: true,
        params: {},
        must:['taskIds']
    },
    {
        name: 'ebTaskKrFqListForProduct',
        method: 'POST',
        desc: '广告/自然排名频率分析-排名有变化的产品数-按抓取频率',
        path: '/ebTaskKrFq/listForProduct',
        mock: false,
         //showSuccess: true,
        params: {},
        must:['taskId','startTime','endTime','multipleFrequency','taskFlag']
    },
    {
        name: 'ebTaskKrFqListForProductStat',
        method: 'POST',
        desc: '广告/自然排名频率分析-排名有变化的产品数-按周、小时统计',
        path: '/ebTaskKrFq/listForProductStat',
        mock: false,
         //showSuccess: true,
        params: {},
        must:['taskId','startTime','endTime','multipleFrequency','taskFlag']
    },
    {
        name: 'ebTaskKrFqProductList',
        method: 'POST',
        desc: '广告/自然排名频率分析-排名有变化的产品列表',
        path: '/ebTaskKrFq/productList',
        mock: false,
         //showSuccess: true,
        params: {},
        must:['taskId','startTime','endTime','taskFlag']
    },
    {
        name: 'ebTaskKrFqExportProductList',
        method: 'POST',
        desc: '广告/自然排名频率分析-排名有变化的产品列表导出',
        path: '/ebTaskKrFq/exportProductList',
        mock: false,
         //showSuccess: true,
        config:{
            responseType:'blob'
        },
        params: {},
        must:['taskId','startTime','endTime','taskFlag']
    },
    {
        name: 'ebTaskKrFqListToFqRec',
        method: 'POST',
        desc: '广告/自然排名频率分析-历史排名',
        path: '/ebTaskKrFq/listToFqRec',
        mock: false,
         //showSuccess: true,
        params: {},
        must:['taskId','startTime','endTime','taskFlag','multipleFrequency','parentAsin']
    },
]