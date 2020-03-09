export default [
	{
		name: 'negativeReviewProductList',
		method: 'POST',
		desc: '产品差评监控列表',
		path: '/negativeReview/product/list',
		mock:false,
    },
	{
		name: 'negativeReviewProductExport',
		method: 'POST',
		desc: '产品差评监控列表-导出EXCEL(勾选)',
		path: '/negativeReview/product/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'negativeReviewProductExportQuery',
		method: 'POST',
		desc: '产品差评监控列表-导出EXCEL(查询条件)',
		path: '/negativeReview/product/export/query',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'negativeReviewReviewList',
		method: 'POST',
		desc: '产品差评监控列表-查看页-列表',
		path: '/negativeReview/review/list',
		mock:false,
	},
	{
		name: 'negativeReviewReviewExport',
		method: 'POST',
		desc: '产品差评监控列表-查看页-导出EXCEL(勾选)',
		path: '/negativeReview/review/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'negativeReviewReviewExportQuery',
		method: 'POST',
		desc: '产品差评监控列表-查看页-导出EXCEL(查询条件)',
		path: '/negativeReview/review/export/query',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'negativeReviewReviewSetProcess',
		method: 'POST',
		desc: '产品差评监控列表-查看页-设置为已处理',
		path: '/negativeReview/review/setProcess',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'negativeReviewReviewSetUnprocess',
		method: 'POST',
		desc: '产品差评监控列表-查看页-设置为未处理',
		path: '/negativeReview/review/setUnprocess',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'negativeReviewReviewRemove',
		method: 'POST',
		desc: '产品差评监控列表-查看页-删除',
		path: '/negativeReview/review/remove',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'negativeReviewSellerList',
		method: 'POST',
		desc: '店铺差评监控列表',
		path: '/negativeReview/seller/list',
		mock:false,
	},
	{
		name: 'negativeReviewSellerExport',
		method: 'POST',
		desc: '店铺差评监控列表-导出EXCEL(勾选)',
		path: '/negativeReview/seller/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'negativeReviewSellerExportQuery',
		method: 'POST',
		desc: '店铺差评监控列表-导出EXCEL(查询条件)',
		path: '/negativeReview/seller/export/query',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'negativeReviewSellerSetProcess',
		method: 'POST',
		desc: '店铺差评监控列表-设置为已处理',
		path: '/negativeReview/seller/setProcess',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'negativeReviewSellerSetUnprocess',
		method: 'POST',
		desc: '店铺差评监控列表-设置为未处理',
		path: '/negativeReview/seller/setUnprocess',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'negativeReviewSellerRemove',
		method: 'POST',
		desc: '店铺差评监控列表-删除',
		path: '/negativeReview/seller/remove',
		newShowSuccess:true,
		mock:false,
	},
]
