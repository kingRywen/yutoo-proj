export default [
    {
        name: 'taskRelateSourceListRelateSourceToAsin',
        method: 'POST',
        desc: '关联ASIN列表(下拉选项)',
        path: 'taskRelateSource/listRelateSourceToAsin',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceList',
        method: 'POST',
        desc: '分析关联源-列表',
        path: 'taskRelateSource/list',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceSave',
        method: 'POST',
        desc: '分析关联源-添加任务',
        path: 'taskRelateSource/save',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceRemove',
        method: 'POST',
        desc: '分析关联源-删除',
        path: 'taskRelateSource/remove',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceReCrawl',
        method: 'POST',
        desc: '分析关联源-重新抓取',
        path: 'taskRelateSource/reCrawl',
        // mock: true,
        // singleLoading: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceUpdate',
        method: 'POST',
        desc: '分析关联源-编辑',
        path: 'taskRelateSource/update',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceDetails',
        method: 'POST',
        desc: '分析关联源-任务详情',
        path: 'taskRelateSource/details',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceListRelateSourceByAsin',
        method: 'POST',
        desc: '分析关联源-查看关联产品',
        path: 'taskRelateSource/listRelateSourceByAsin',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceListRelateSourcePosition',
        method: 'POST',
        desc: '分析关联源-查看关联产品位置(下拉选项)',
        path: 'taskRelateSource/listRelateSourcePosition',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceListCategoryByTask',
        method: 'POST',
        desc: '查看产品类目(下拉选项)',
        path: 'taskRelateSource/listCategoryByTask',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskRelateSourceListRelateSourceByAsinExport',
        method: 'POST',
        desc: '关联产品详情导出',
        path: '/taskRelateSource/listRelateSourceByAsinExport',
        // mock: true,
        showSuccess: true,
		config:{
			responseType: 'blob'
		},
        params: {}
    },
]