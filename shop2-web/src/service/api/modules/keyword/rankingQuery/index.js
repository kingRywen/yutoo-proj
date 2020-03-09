export default [
	{
		name: 'taskKeywordRankSave',
		method: 'POST',
		desc: '添加任务',
		path: '/taskKeywordRank/save',
		showSuccess:true
	},
	{
		name: 'taskKeywordRankList',
		method: 'POST',
		desc: '列表',
		path: '/taskKeywordRank/list',
    },
	{
		name: 'taskKeywordRankInfo',
		method: 'POST',
		desc: '任务详情',
		path: '/taskKeywordRank/info',
	},
	{
		name: 'taskKeywordRankRemove',
		method: 'POST',
		desc: '删除',
		path: '/taskKeywordRank/remove',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordRankReCrawl',
		method: 'POST',
		desc: '重新抓取',
		path: '/taskKeywordRank/reCrawl',
		newShowSuccess:true
	},
	// {
	// 	name: 'taskKeywordRankUpdate',
	// 	method: 'POST',
	// 	desc: '编辑监控周期',
	// 	path: '/taskKeywordRank/update',
	// 	newShowSuccess:true
	// },
	{
		name: 'taskKeywordRankUpdateMonitor',
		method: 'POST',
		desc: '编辑监控周期',
		path: '/taskKeywordRank/updateMonitor',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordRankOpenMonitor',
		method: 'POST',
		desc: '开启监控',
		path: '/taskKeywordRank/openMonitor',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordRankCloseMonitor',
		method: 'POST',
		desc: '关闭监控',
		path: '/taskKeywordRank/closeMonitor',
		newShowSuccess:true
	},
	{
		name: 'taskKeywordRankDetails',
		method: 'POST',
		desc: '数据详情',
		path: '/taskKeywordRank/details',
	},
	{
		name: 'taskKeywordRankExport',
		method: 'POST',
		desc: '导出',
		path: '/taskKeywordRank/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
	},
	{
		name: 'taskKeywordRankExportTemplate',
		method: 'POST',
		desc: '模板导出',
		path: '/taskKeywordRank/exportTemplate',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
	},
	{
		name: 'taskKeywordRankImportData',
		method: 'POST',
		desc: '数据导入',
		path: '/taskKeywordRank/importData',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
	},
	{
		name: 'taskKeywordRankHistoryList',
		method: 'POST',
		desc: '排名历史曲线',
		path: '/taskKeywordRank/historyList',
	},
]
