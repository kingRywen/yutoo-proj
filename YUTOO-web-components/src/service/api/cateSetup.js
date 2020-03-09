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
    }
]