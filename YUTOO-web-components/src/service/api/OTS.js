export default [
    // 广告优化 侧边栏
    {
        name: 'OrderTargetListTask',
        method: 'POST',
        desc: '侧边栏列表',
        path: '/orderTarget/listTask',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    //asin产品列表
    {
        name: 'ProductPageParentProduct',
        method: 'POST',
        desc: 'asin产品列表',
        path: '/product/pageParentProduct',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    //侧边栏添加
    {
        name: 'OrderTargetSave',
        method: 'POST',
        desc: '侧边栏添加',
        path: '/orderTarget/save',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 编辑
    {
        name: 'OrderTargetEdit',
        method: 'POST',
        desc: '侧边栏添加',
        path: '/orderTarget/edit',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    // 侧边栏删除
    {
        name: 'OrderTargetBatchRemove',
        method: 'POST',
        desc: '侧边栏列表删除',
        path: '/orderTarget/batchRemove',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 回显编辑
    {
        name: 'OrderTargetStage',
        method: 'POST',
        desc: '父sku列表编辑',
        path: '/orderTarget/stage',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
    // 详情
    {
        name: 'OrderTargetTaskDetail',
        method: 'POST',
        desc: '详情',
        path: '/orderTarget/taskDetail',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        pcommonarams: {
        }
    },
]