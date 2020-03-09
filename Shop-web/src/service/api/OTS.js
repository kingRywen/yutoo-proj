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
        showSuccess:true,
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
	{
	    name: 'orderTargetPause',
	    method: 'POST',
	    desc: '订单目标设置-开启/暂停',
	    path: '/orderTarget/pause',
	    mockPath: '',
	    mock: false,
	    showSuccess: true,
    },
    {
	    name: 'orderTargetListStage',
	    method: 'POST',
	    desc: 'ASIN任务详情-其他阶段详情',
	    path: '/orderTarget/listStage',
	    mockPath: '',
	    mock: false,
	    //showSuccess: true,
	},
    {
	    name: 'orderTargetListDetail',
	    method: 'POST',
	    desc: 'ASIN任务详细数据',
	    path: '/orderTarget/listDetail',
	    mockPath: '',
	    mock: false,
	    //showSuccess: true,
    },
    {
	    name: 'orderTargetDetailExport',
	    method: 'POST',
	    desc: 'ASIN任务详细数据_导出',
	    path: '/orderTarget/detailExport',
        mockPath: '',
        config:{
            responseType:'blob'
        },
	    mock: false,
	    //showSuccess: true,
    },
    {
	    name: 'orderTargetManualUpdate',
	    method: 'POST',
	    desc: '手动更新',
	    path: '/orderTarget/manualUpdate',
        mockPath: '',
	    mock: false,
	    showSuccess: true,
    },
    {
	    name: 'orderTargetDownloadFile',
	    method: 'POST',
	    desc: '订单目标设置模板',
	    path: '/orderTarget/downloadFile',
        mockPath: '',
        config:{
            responseType:'blob'
        },
	    mock: false,
	    showSuccess: true,
	},
]