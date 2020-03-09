export default [
	{
		name: 'taskKeywordAsinReverseMerSave',
		method: 'POST',
		desc: '添加任务',
		path: '/taskKeywordAsinReverseMer/save',
		showSuccess:true
	},
	{
		name: 'taskKeywordAsinReverseMerList',
		method: 'POST',
		desc: '列表',
		path: '/taskKeywordAsinReverseMer/list',
    },
	{
		name: 'taskKeywordAsinReverseMerRemove',
		method: 'POST',
		desc: '删除',
		path: '/taskKeywordAsinReverseMer/remove',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordAsinReverseMerReCrawl',
		method: 'POST',
		desc: '重新抓取',
		path: '/taskKeywordAsinReverseMer/reCrawl',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordAsinReverseMerDetails',
		method: 'POST',
		desc: '数据详情',
		path: '/taskKeywordAsinReverseMer/details',
	},
	{
		name: 'taskKeywordAsinReverseMerExport',
		method: 'POST',
		desc: '导出',
		path: '/taskKeywordAsinReverseMer/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
	},
]
