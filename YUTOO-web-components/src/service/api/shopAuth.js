export default [
    // 开发者信息
    {
        name: 'GlobalApiInfo',
        method: 'POST',
        desc: '店铺授权',
        path: '/globalApi/info',
        mockPath: '',
        // showSuccess: true,
        params: {
        }
    },
    // 区域列表
    {
        name: 'areaList',
        method: 'POST',
        desc: '店铺授权',
        path: '/area/list',
        mockPath: '',
        // showSuccess: true,
        params: {
        }
    },
    // 列表
    {
        name: 'shopList',
        method: 'POST',
        desc: '店铺授权',
        path: '/sellerAuth/list',
		// mock: true,
        mockPath: '',
        // showSuccess: true,
        params: {
        }
    },
    // 添加
    {
        name: 'addList',
        method: 'POST',
        desc: '店铺授权',
        path: '/sellerAuth/save',
        mockPath: '',
        showSuccess: true,
        params: {
        }
    },
    // 删除
    {
        name: 'deleteList',
        method: 'POST',
        desc: '店铺授权',
        path: '/sellerAuth/remove',
        mockPath: '',
		mock: true,
        showSuccess: true,
        params: {
        }
    },
    // 编辑获取信息
    {
        name: 'sellerAuthInfo',
        method: 'POST',
        desc: '店铺授权',
        path: '/sellerAuth/info',
        mockPath: '',
        // showSuccess: true,
        params: {
        }
    },
    // 更新搜全信息
    {
        name: 'SellerAuthUpdate',
        method: 'POST',
        desc: '店铺授权',
        path: '/sellerAuth/update',
        mockPath: '',
        showSuccess: true,
        params: {
        }
    },
];