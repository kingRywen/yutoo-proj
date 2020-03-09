export default [
    // 广告优化 侧边栏
    {
        name: 'listByCategoryAdSeo',
        method: 'POST',
        desc: '父sku列表',
        path: '/taskAdSeo/listByCategoryAdSeo',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    // 侧边栏删除
    {
        name: 'TaskAdSeoRemove',
        method: 'POST',
        desc: '父sku列表删除',
        path: '/taskAdSeo/remove',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 父sku列表编辑
    {
        name: 'TaskAdSeoUpdate',
        method: 'POST',
        desc: '父sku列表编辑',
        path: '/taskAdSeo/update',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 侧边栏 添加
    {
        name: 'TaskAdSeoSave',
        method: 'POST',
        desc: '父sku列表添加',
        path: '/taskAdSeo/save',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 详情
    {
        name: 'TaskAdSeoInfo',
        method: 'POST',
        desc: '父sku列表详情',
        path: '/taskAdSeo/info',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
    // 下载点击率模板
    {
        name: 'AdSeoImportDataExportTemplate',
        method: 'POST',
        desc: '下载点击率模板',
        path: '/adSeoImportData/exportTemplate',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
    // 开启关闭提高点击率
    {
        name: 'TaskAdSeoUpdateIncreaseClickFlag',
        method: 'POST',
        desc: '开启关闭提高点击率',
        path: '/taskAdSeo/updateIncreaseClickFlag',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 产品广告数据列表
    {
        name: 'AdSeoKeywordRptList',
        method: 'POST',
        desc: '产品广告数据列表',
        path: '/adSeoKeywordRpt/list',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
    // 产品历史数据 echart
    {
        name: 'AdSeoDataEventDayList',
        method: 'POST',
        desc: '产品历史数据 echart',
        path: '/adSeoDataEventDay/list',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    }
]