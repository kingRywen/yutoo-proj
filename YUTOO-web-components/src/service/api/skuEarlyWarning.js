export default [
    {
        name: 'productInventoryFbaList',
        method: 'POST',
        desc: 'sku预警-列表',
        path: 'productInventoryFba/list',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'productInventoryFbaListCount',
        method: 'POST',
        desc: 'sku预警-商品数量',
        path: 'productInventoryFba/listCount',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    
    {
        name: 'productSkuWarnSave',
        method: 'POST',
        desc: '预计库存设置-添加/修改',
        path: 'productSkuWarn/save',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'productSkuWarnInfo',
        method: 'POST',
        desc: '预计库存设置-详情',
        path: 'productSkuWarn/info',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    
 
]