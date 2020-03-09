export default [

	{
		name: 'taskKeywordDigSave',
		method: 'POST',
		desc: '添加任务',
		path: '/taskKeywordDig/save',
		showSuccess: true
	},
	{
		name: 'taskKeywordDigList',
		method: 'POST',
		desc: '列表',
		path: '/taskKeywordDig/list',
	},
	{
		name: 'taskKeywordDigInfo',
		method: 'POST',
		desc: '任务详情',
		path: '/taskKeywordDig/info',
	},
	{
		name: 'taskKeywordDigRemove',
		method: 'POST',
		desc: '删除',
		path: '/taskKeywordDig/remove',
		newShowSuccess: true
	},
	{
		name: 'taskKeywordDigReCrawl',
		method: 'POST',
		desc: '重新抓取',
		path: '/taskKeywordDig/reCrawl',
		newShowSuccess: true
	},
	{
		name: 'taskKeywordDigDetails',
		method: 'POST',
		desc: '数据详情',
		path: '/taskKeywordDig/details',
	},
	{
		name: 'taskKeywordDigExport',
		method: 'POST',
		desc: '导出',
		path: '/taskKeywordDig/export',
		showSuccess: true,
		config: {
			responseType: 'blob'
		},
	},
]
