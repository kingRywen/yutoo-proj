export default[
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
	    name: 'brandManageBatchUpdate',
	    method: 'POST',
	    desc: '品牌管理-设置品牌归属国',
	    path: '/brandManage/batchUpdate',
	    mockPath: '/brandManage/batchUpdate',
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
]