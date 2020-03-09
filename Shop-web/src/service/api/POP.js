export default [
    //  产品价格优化侧边栏
    {
        name: 'CustomCategoryList_POP',
        method: 'POST',
        desc: '侧边栏列表',
        path: '/customCategory/list',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    // 列表
    {
        name: 'TaskPriceSeoList',
        method: 'POST',
        desc: '列表',
        path: '/taskPriceSeo/list',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    // 设置百分比
    {
        name: 'TaskPriceSeoMasterSkuConfig',
        method: 'POST',
        desc: '列表',
        path: '/taskPriceSeo/masterSkuConfig',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // // 侧边栏删除
    {
        name: 'TaskPriceSeoBatchRemove',
        method: 'POST',
        desc: '侧边栏列表删除',
        path: '/taskPriceSeo/batchRemove',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 当前执行阶段列表
    {
        name: 'TaskPriceSeoStageList',
        method: 'POST',
        desc: '当前执行阶段列表',
        path: '/taskPriceSeoStage/list',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
    {
        name: 'taskPriceSeoPause',
        method: 'POST',
        desc: '开启/暂停优化',
        path: '/taskPriceSeo/pause',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 产品asin,参考asin
    {
        name: 'ProductListParentProduct',
        method: 'POST',
        desc: '产品asin,参考asin',
        path: '/product/listParentProduct',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
    // 指定父产品下子ASIN列表
    {
        name: 'ProductListAsin',
        method: 'POST',
        desc: '指定父产品下子ASIN列表',
        path: '/product/listAsin',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
    // 添加优化任务(编辑需带上taskId)
    {
        name: 'TaskPriceSeoSave',
        method: 'POST',
        desc: '添加优化任务(编辑需带上taskId)',
        path: '/taskPriceSeo/save',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 任务详情回显
    {
        name: 'TaskPriceSeoInfo',
        method: 'POST',
        desc: '任务详情回显',
        path: '/taskPriceSeo/info',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
    // 主要成交SKU占比回显
    {
        name: 'TaskPriceSeoMasterSkuConfigDetail',
        method: 'POST',
        desc: '主要成交SKU占比回显',
        path: '/taskPriceSeo/masterSkuConfigDetail',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
]