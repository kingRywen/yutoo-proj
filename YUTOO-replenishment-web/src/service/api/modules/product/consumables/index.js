export default[
    {
        name: 'prConsumablesList',
        method: 'POST',
        desc: '耗材列表',
        path: '/pr/consumables/list',
        params: {},
        mockPath:'http://120.79.124.232:8001/mock/187/pr/consumables/list'
    },
    {
        name: 'prConsumablesSave',
        method: 'POST',
        desc: '保存耗材',
        path: '/pr/consumables/save',
        params: {},
        mockPath:'http://120.79.124.232:8001/mock/187/pr/consumables/save',
        showSuccess:true,
    },
    {
        name: 'prConsumablesRemove',
        method: 'POST',
        desc: '删除耗材',
        path: '/pr/consumables/remove',
        params: {},
        mockPath:'http://120.79.124.232:8001/mock/187/pr/consumables/remove',
        showSuccess:true,
    },
    {
        name: 'prConsumablesUpdate',
        method: 'POST',
        desc: '修改耗材',
        path: '/pr/consumables/update',
        params: {},
        mockPath:'http://120.79.124.232:8001/mock/187/pr/consumables/update',
        showSuccess:true,
    },
    {
        name: 'prConsumablesInfo',
        method: 'POST',
        desc: '获取耗材详情',
        path: '/pr/consumables/info',
        params: {},
        mockPath:'http://120.79.124.232:8001/mock/187/pr/consumables/info',
    },
    {
        name: 'prConsumablesExport',
        method: 'POST',
        desc: '导出耗材',
        path: '/pr/consumables/export',
        params: {},
        mockPath:'http://120.79.124.232:8001/mock/187/pr/consumables/export',
    },

]