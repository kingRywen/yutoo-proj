export default [
    {
        name: 'sameAttrConfigList',
        method: 'POST',
        desc: '类目属性分配管理列表',
        path: '/sameAttrConfig/list',
        mockPath: '',
        // mock: true,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    {
        name: 'sameAttrConfigBatchRemove',
        method: 'POST',
        desc: '删除',
        path: 'sameAttrConfig/batchRemove',
        mockPath: '',
        // mock: true,
        must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
]