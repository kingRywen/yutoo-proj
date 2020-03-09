export default [
	{
		name: 'taskKeywordInteDigSave',
		method: 'POST',
		desc: '添加任务',
		path: '/taskKeywordInteDig/save',
		showSuccess:true
	},
	{
		name: 'taskKeywordInteDigList',
		method: 'POST',
		desc: '列表',
		path: '/taskKeywordInteDig/list',
    },
	{
		name: 'taskKeywordInteDigInfo',
		method: 'POST',
		desc: '任务详情',
		path: '/taskKeywordInteDig/info',
	},
	{
		name: 'taskKeywordInteDigRemove',
		method: 'POST',
		desc: '删除',
		path: '/taskKeywordInteDig/remove',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordInteDigReCrawl',
		method: 'POST',
		desc: '重新抓取',
		path: '/taskKeywordInteDig/reCrawl',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordInteDigDetails',
		method: 'POST',
		desc: '数据详情',
		path: '/taskKeywordInteDig/details',
	},
	{
		name: 'taskKeywordInteDigExport',
		method: 'POST',
		desc: '导出',
		path: '/taskKeywordInteDig/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
	},
]
