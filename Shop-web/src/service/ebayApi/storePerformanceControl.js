export default[
    {
        name: 'ebShopPerformanceList',
        method: 'POST',
        desc: '店铺列表',
        path: '/ebShopPerformance/list',
        mock: true,
         //showSuccess: true,
        params: {},
        must:['sellerId','siteId']
    },
    {
        name: 'ebShopPerformanceManualUpdateStatus',
        method: 'POST',
        desc: '手动更新-状态',
        path: '/ebShopPerformance/manualUpdateStatus',
        mock: true,
        // showSuccess: true,
        params: {},
        must:['sellerId','siteId']
    },
    {
        name: 'ebShopPerformanceConfigDetail',
        method: 'POST',
        desc: '编辑配置-回显',
        path: '/ebShopPerformance/configDetail',
        mock: true,
         //showSuccess: true,
        params: {},
        must:['sellerId','siteId']
    },
    {
        name: 'ebShopPerformanceConfig',
        method: 'POST',
        desc: '编辑配置',
        path: '/ebShopPerformance/config',
        mock: true,
         showSuccess: true,
        params: {},
        must:['positiveRate','score','topRatedSeller','neutralNegativeCntD30']
    },
    {
        name: 'ebShopPerformanceManualUpdate',
        method: 'POST',
        desc: '手动更新',
        path: '/ebShopPerformance/manualUpdate',
        mock: true,
        showSuccess: true,
        params: {},
        must:['sellerId','siteId']
    },
]