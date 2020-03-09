export default [
    //类目管理list
    {
        name: 'CustomCategoryList',
        method: 'POST',
        desc: '类目管理',
        path: '/customCategory/list',
        // showSuccess: true,
        // mock: true,
        params: {

        }
    },
    {
        name: 'customCategoryAttention',
        method: 'POST',
        desc: '添加店铺类目',
        path: '/customCategory/attention',
        showSuccess: true,
        // mock: true,
        params: {

        }
    },
    {
        name: 'customCategoryUnsubscribe',
        method: 'POST',
        desc: '删除店铺类目',
        noShowDefaultError: true,
        path: '/customCategory/unsubscribe',
        showSuccess: true,
        // mock: true,
        params: {

        }
    },
    //类目管理添加
    {
        name: 'CustomCategorySave',
        method: 'POST',
        desc: '类目管理',
        path: '/customCategory/save',
        mockPath: '',
        showSuccess: true,
        params: {

        }
    },
    //类目管理删除
    {
        name: 'CustomCategoryRemove',
        method: 'POST',
        desc: '类目管理',
        path: '/customCategory/remove',
        mockPath: '',
        showSuccess: true,
        
        params: {

        }
    },
    //类目编辑单条时根据id获取详细信息
    {
        name: 'CustomCategoryInfo',
        method: 'POST',
        desc: '类目管理',
        path: '/customCategory/info',
        mockPath: '',
        // showSuccess: true,
        params: {

        }
    },
    //类目编辑update
    {
        name: 'CustomCategoryUpdate',
        method: 'POST',
        desc: '类目管理',
        path: '/customCategory/update',
        mockPath: '',
        showSuccess: true,
        params: {

        }
    },
	{
	    name: 'customCategorySaveReturnRate',
	    method: 'POST',
	    desc: '类目管理-批量设置类目设置预警值',
	    path: '/customCategory/saveReturnRate',
	    mock: true,
	    showSuccess: true
	},
]