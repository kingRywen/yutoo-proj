export default [
	{
		name: 'productReviewList',
		method: 'POST',
		desc: '列表',
		path: '/productReview/list',
		mock:false,
    },
	{
		name: 'productReviewExportQuery',
		method: 'POST',
		desc: '导出EXCEL(查询条件)',
		path: '/productReview/export/query',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'productReviewExport',
		method: 'POST',
		desc: '导出EXCEL(勾选)',
		path: '/productReview/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'productReviewUpdateChild',
		method: 'POST',
		desc: '更新子产品数据',
		path: '/productReview/updateChild',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'productReviewReviewList',
		method: 'POST',
		desc: '处理页-列表',
		path: '/productReview/review/list',
		mock:false,
	},
	{
		name: 'productReviewReviewExportQuery',
		method: 'POST',
		desc: '处理页-导出EXCEL(查询条件)',
		path: '/productReview/review/export/query',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'productReviewReviewExport',
		method: 'POST',
		desc: '处理页-导出EXCEL(勾选)',
		path: '/productReview/review/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'productReviewReviewReply',
		method: 'POST',
		desc: '处理页-回复',
		path: '/productReview/review/reply',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'productReviewReviewSetReply',
		method: 'POST',
		desc: '处理页-设置已回复',
		path: '/productReview/review/setReply',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'productReviewReviewSetUnreply',
		method: 'POST',
		desc: '处理页-设置未回复',
		path: '/productReview/review/setUnreply',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'productReviewReviewRemove',
		method: 'POST',
		desc: '处理页-删除',
		path: '/productReview/review/remove',
		newShowSuccess:true,
		mock:false,
	},
]
