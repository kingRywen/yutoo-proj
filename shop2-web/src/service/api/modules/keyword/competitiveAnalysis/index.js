export default [
	{
		name: 'taskKeywordCompeteSave',
		method: 'POST',
		desc: '添加任务',
		path: '/taskKeywordCompete/save',
		showSuccess:true
	},
	{
		name: 'taskKeywordCompeteList',
		method: 'POST',
		desc: '列表',
		path: '/taskKeywordCompete/list',
    },
	{
		name: 'taskKeywordCompeteInfo',
		method: 'POST',
		desc: '任务详情',
		path: '/taskKeywordCompete/info',
	},
	{
		name: 'taskKeywordCompeteRemove',
		method: 'POST',
		desc: '删除',
		path: '/taskKeywordCompete/remove',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordCompeteReCrawl',
		method: 'POST',
		desc: '重新抓取',
		path: '/taskKeywordCompete/reCrawl',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordCompeteDetails',
		method: 'POST',
		desc: '数据详情',
		path: '/taskKeywordCompete/details',
	},
	{
		name: 'taskKeywordCompeteExport',
		method: 'POST',
		desc: '导出',
		path: '/taskKeywordCompete/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
	},
	{
		name: 'taskKeywordCompeteExportTemplate',
		method: 'POST',
		desc: '模板导出',
		path: '/taskKeywordCompete/exportTemplate',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
	},
	{
		name: 'taskKeywordCompeteImportData',
		method: 'POST',
		desc: '搜索量数据导入',
		path: '/taskKeywordCompete/importData',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
	},
]
