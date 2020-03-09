export default [
	{
	    name: 'homeAdProductList',
	    method: 'POST',
	    desc: '子SKU广告被暂停-列表',
	    path: '/home/ad/product/list',
		mock:true,
	    params: {}
	},
	{
	    name: 'homeAdProductExport',
	    method: 'POST',
	    desc: '子SKU广告被暂停-列表导出',
	    path: '/home/ad/product/export',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		},
	    params: {}
	}
]