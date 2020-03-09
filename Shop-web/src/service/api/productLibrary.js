// 排名频率分析
export default [
    {
        name: 'productList',
        method: 'POST',
        desc: '商品库-列表',
        path: `product/list`,
        // mock: true,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'productListCount',
        method: 'POST',
        desc: '商品库-商品数量和未读状态',
        path: `product/listCount`,
        // mock: true,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'productInfoChangelist',
        method: 'POST',
        desc: '商品库-列表',
        path: `product/infoChangeList`,
        // mock: true,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'productOperateLog',
        method: 'POST',
        desc: '商品库-操作日志列表',
        path: `product/operateLog`,
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'productEventDetailList',
        method: 'POST',
        desc: '商品库-操作日志列表',
        path: `productEventDetail/list`,
        // mock: true,
        // showSuccess: true,
        params: {}
    },

    {
        name: 'productHandle',
        method: 'POST',
        desc: '商品库-标记已处理',
        path: `product/handle`,
        // mock: true,
        showSuccess: true,
        params: {}
    },

    {
        name: 'productIgnore',
        method: 'POST',
        desc: '商品库-忽略产品/取消忽略',
        path: `product/ignore`,
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'productIgnoreList',
        method: 'POST',
        desc: '商品库-信息变动列表-已忽略',
        path: `product/ignoreList`,
        // mock: true,
        // showSuccess: true,
        params: {}
    },
	{
	    name: 'productProductImport',
	    method: 'POST',
	    desc: '导入产品',
	    path: '/product/productImport',
	    type:'formdata',
	    mock: true,
	    showSuccess: true,
	},
	{
	    name: 'productDownloadFile',
	    method: 'POST',
	    desc: '导入产品_下载模板',
	    path: '/product/downloadFile',
	    mock: true,
	    showSuccess: true,
	    config: {
	        responseType: 'blob'
	    },
	},
]