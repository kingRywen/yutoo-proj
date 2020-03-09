export default [
	{
		name: 'productListToSku',
		method: 'POST',
		desc: '产品子父级下拉列表',
		path: '/product/listToSku',
		mock:true,
    },
	{
		name: 'productList',
		method: 'POST',
		desc: '产品列表',
		path: '/product/list',
		mock:true,
	},
	{
		name: 'sellerDataUpdateInfo',
		method: 'POST',
		desc: '产品手动更新状态',
		path: '/sellerDataUpdate/info',
		showSuccess:true,
		mock:true,
	},
	{
		name: 'sellerDataUpdateExecute',
		method: 'POST',
		desc: '产品手动更新',
		path: '/sellerDataUpdate/execute',
		showSuccess:true,
		mock:true,
	},
]
