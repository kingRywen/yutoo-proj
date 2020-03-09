export default [
    {
        name: 'taskFwKeywordList',
        method: 'POST',
        desc: '分类-列表',
        path: 'taskFwKeyword/list',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwKeywordDetails',
        method: 'POST',
        desc: '关键词排名下降-历史排名详情',
        path: 'taskFwKeyword/details',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwRelateUpdate',
        method: 'POST',
        desc: '关联流量排名下降-任务编辑',
        path: 'taskFwRelate/update',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwRelateUpdateMonitorFlag',
        method: 'POST',
        desc: '关联流量排名下降-开启监控,关闭监控',
        path: 'taskFwRelate/updateMonitorFlag',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwRelateSave',
        method: 'POST',
        desc: '关联流量排名下降-添加任务',
        path: 'taskFwRelate/save',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwRelateRemove',
        method: 'POST',
        desc: '关联流量排名下降-删除',
        path: 'taskFwRelate/remove',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwRelateList',
        method: 'POST',
        desc: '关联流量排名下降-任务列表',
        path: 'taskFwRelate/list',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwRelateRelatelist',
        method: 'POST',
        desc: '关联流量排名下降-预警列表',
        path: 'taskFwRelate/relatelist',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwRelateDetails',
        method: 'POST',
        desc: '关联流量排名下降-历史排名详情',
        path: 'taskFwRelate/details',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskFwKeywordlistCount',
        method: 'POST',
        desc: '流量预警top页数量统计',
        path: '/taskFwKeyword/listCount',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
]