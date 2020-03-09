export default[
	{
	    name: 'brandManageListCount',
	    method: 'POST',
	    desc: 'top页数量统计',
	    path: '/brandManage/listCount',
	    mock: true,
	    pcommonarams: {
	    }
	},
    {
        name: 'brandManageList',
        method: 'POST',
        desc: '品牌列表',
        path: '/brandManage/list',
        mockPath: '/brandManage/list',
        mock: true,
        pcommonarams: {
        }
    },
	{
	    name: 'brandManageListCountry',
	    method: 'POST',
	    desc: '国家列表',
	    path: '/brandManage/listCountry',
	    mockPath: '/brandManage/listCountry',
	    mock: true,
	    pcommonarams: {
	    }
	},
	{
	    name: 'brandManageUpdateCountry',
	    method: 'POST',
	    desc: '品牌管理-设置品牌归属国',
	    path: '/brandManage/updateCountry',
	    mockPath: '/brandManage/updateCountry',
	    mock: true,
	    pcommonarams: {
	    },
		showSuccess:true,
	},
	{
	    name: 'brandManageInfo',
	    method: 'POST',
	    desc: '品牌列表-编辑回显',
	    path: '/brandManage/info',
	    mockPath: '/brandManage/info',
	    mock: true,
	    pcommonarams: {
	    },
	},
	{
	    name: 'brandManageUpdate',
	    method: 'POST',
	    desc: '品牌列表-编辑',
	    path: '/brandManage/update',
	    mockPath: '/brandManage/update',
	    mock: true,
	    pcommonarams: {
	    },
		showSuccess:true,
	},
	{
	    name: 'brandManageRemove',
	    method: 'POST',
	    desc: '品牌列表-删除(批量)',
	    path: '/brandManage/remove',
	    mockPath: '/brandManage/remove',
	    mock: true,
	    pcommonarams: {
	    },
		showSuccess:true,
	},
	{
	    name: 'brandManageUpdateBrandType',
	    method: 'POST',
	    desc: '设置品牌类型',
	    path: '/brandManage/updateBrandType',
	    mockPath: '/brandManage/updateBrandType',
	    mock: true,
	    pcommonarams: {
	    },
		showSuccess:true,
	},
	{
	    name: 'brandManageGetImageFlag',
	    method: 'POST',
	    desc: '查看图片任务状态',
	    path: '/brandManage/getImageFlag',
	    mock: true,
	    pcommonarams: {
	    },
	},
	{
	    name: 'brandManageListByNoFilterBrand',
	    method: 'POST',
	    desc: '待筛选品牌列表',
	    path: '/brandManage/listByNoFilterBrand',
	    mock: true,
	    pcommonarams: {
	    },
	},
	{
	    name: 'brandManageSendImageTask',
	    method: 'POST',
	    desc: '发送获取图片任务',
	    path: '/brandManage/sendImageTask',
	    mock: true,
	    pcommonarams: {
	    },
		showSuccess:true,
	},
]