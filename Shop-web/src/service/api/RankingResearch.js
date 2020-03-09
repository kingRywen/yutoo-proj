export default [
    {
        name: 'taskKrResearchList',
        method: 'POST',
        desc: '任务列表',
        path: 'taskKrResearch/list',
        //mock: false,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskKrResearchSave',
        method: 'POST',
        desc: '添加任务',
        path: 'taskKrResearch/save',
        //mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskKrResearchAddMonitor',
        method: 'POST',
        desc: '添加监控',
        path: 'taskKrResearch/addMonitor',
        //mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskKrResearchUpdateMonitor',
        method: 'POST',
        desc: '修改监控',
        path: 'taskKrResearch/updateMonitor',
        //mock: false,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskKrResearchRemoveMonitor',
        method: 'POST',
        desc: '取消监控',
        path: 'taskKrResearch/removeMonitor',
        //mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskKrResearchRemove',
        method: 'POST',
        desc: '删除任务',
        path: 'taskKrResearch/remove',
        //mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'krResearchProductList',
        method: 'POST',
        desc: '产品列表',
        path: 'krResearchProduct/list',
        //mock: false,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'krBsrCategoryList',
        method: 'POST',
        desc: '产品列表-BSR类目列表',
        path: 'krBsrCategory/list',
        //mock: false,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'krResearchProductRankCompareList',
        method: 'POST',
        desc: '产品列表-数据比较',
        path: 'krResearchProduct/rankCompareList',
        //mock: false,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'krResearchProductSelectList',
        method: 'POST',
        desc: '数据分析-产品下拉列表',
        path: 'krResearchProduct/selectList',
        //mock: false,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'krDataStatList',
        method: 'POST',
        desc: '数据分析-统计展示',
        path: 'krData/statList',
        //mock: false,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'krDataCurveList',
        method: 'POST',
        desc: '数据分析-曲线展示',
        path: 'krData/curveList',
        //mock: false,
        // showSuccess: true,
        params: {}
    },

    //排名研究
    {
        name: 'taskRankResearchList',
        method: 'POST',
        desc: '排名研究-列表',
        path: '/taskRankResearch/list',
        mock: false,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskRankResearchSave',
        method: 'POST',
        desc: '排名研究-添加任务',
        path: '/taskRankResearch/save',
        mock: false,
         showSuccess: true,
        params: {}
    },
    {
        name: 'taskRankResearchRemove',
        method: 'POST',
        desc: '排名研究-删除',
        path: '/taskRankResearch/remove',
       mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRankResearchRemoveMonitor',
        method: 'POST',
        desc: '排名研究-取消监控',
        path: '/taskRankResearch/removeMonitor',
       mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRankResearchAddMonitor',
        method: 'POST',
        desc: '排名研究-添加监控',
        path: '/taskRankResearch/addMonitor',
       mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRankResearchUpdateMonitor',
        method: 'POST',
        desc: '排名研究-修改监控',
        path: '/taskRankResearch/updateMonitor',
       mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRankResearchReCrawl',
        method: 'POST',
        desc: '排名研究-重新发送任务',
        path: '/taskRankResearch/reCrawl',
       mock: false,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRankResearchListByRankReseProd',
        method: 'POST',
        desc: '排名研究-任务详情',
        path: '/taskRankResearch/listByRankReseProd',
       mock: false,
        //showSuccess: true,
        params: {}
    },
    {
        name: 'taskRankResearchListByRankReseProdExport',
        method: 'POST',
        desc: '排名研究-任务详情导出',
        path: '/taskRankResearch/listByRankReseProdExport',
       mock: false,
        //showSuccess: true,
        config:{
            responseType:"blob"
        },
        params: {}
    },
    {
        name: 'taskRankResearchStatList',
        method: 'POST',
        desc: '排名研究-数据展示',
        path: '/taskRankResearch/statList',
       mock: false,
        //showSuccess: true,
        // config:{
        //     responseType:"blob"
        // },
        params: {}
    },
    {
        name: 'taskRankResearchStatListExport',
        method: 'POST',
        desc: '排名研究-数据展示导出',
        path: '/taskRankResearch/statListExport',
       mock: false,
        //showSuccess: true,
        config:{
            responseType:"blob"
        },
        params: {}
    },

]