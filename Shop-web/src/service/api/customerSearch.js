export default [
	{
	    name: 'adKeywordQueryAdDataOption',
	    method: 'POST',
	    desc: '广告系列/组/关键词下拉选项',
	    path: '/adKeywordQuery/adDataOption',
		mock:false,
	    params: {}
	},
	{
	    name: 'adKeywordQueryList',
	    method: 'POST',
	    desc: '广告客户搜索词列表',
	    path: '/adKeywordQuery/list',
		mock:true,
	    params: {}
	},
	{
	    name: 'adKeywordQueryExportData',
	    method: 'POST',
	    desc: '广告客户搜索词列表导出',
	    path: '/adKeywordQuery/exportData',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		},
	    params: {}
	},
	{
	    name: 'adKeywordQueryExportAdHistoryStat',
	    method: 'POST',
	    desc: '客户搜索词历史曲线统计导出',
	    path: '/adKeywordQuery/exportAdHistoryStat',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		},
	    params: {}
	},
	{
	    name: 'adKeywordQueryAdHistoryStat',
	    method: 'POST',
	    desc: '客户搜索词历史曲线统计',
	    path: '/adKeywordQuery/adHistoryStat',
		mock:true,
	    params: {}
	},
	{
	    name: 'adCampaignNegativeKeywordAddKeyword',
	    method: 'POST',
	    desc: '加入广告系列否定词',
	    path: '/adCampaignNegativeKeyword/addKeyword',
		  mock:true,
		  newShowSuccess: true,
	    params: {}
	},
	{
	    name: 'adKeywordQueryRankHistoryList',
	    method: 'POST',
	    desc: '自然/广告排名历史曲线',
	    path: '/adKeywordQueryRank/historyList',
		mock:true,
	    params: {}
	},
	{
	    name: 'adKeywordQueryRankAddMonitor',
	    method: 'POST',
	    desc: '自然/广告开启监控',
	    path: '/adKeywordQueryRank/addMonitor',
		mock:true,
		showSuccess: true,
	    params: {}
	},
	{
	    name: 'adKeywordQueryRankCloseMonitor',
	    method: 'POST',
	    desc: '自然/广告关闭监控',
	    path: '/adKeywordQueryRank/closeMonitor',
		mock:true,
		showSuccess: true,
	    params: {}
	},
	{
	    name: 'adNegativeKeywordSave',
	    method: 'POST',
	    desc: '广告组否定词-添加',
	    path: '/adNegativeKeyword/save',
		mock:true,
		newShowSuccess: true,
	},
	{
	    name: 'adKeywordQueryExportTemplate',
	    method: 'POST',
	    desc: '客户搜索词下载导入报告模板',
	    path: '/adKeywordQuery/exportTemplate',
	    mock: true,
	    config: {
	        responseType: 'blob'
	    },
	    params: {}
	},
	{
	    name: 'adKeywordQueryImportData',
	    method: 'POST',
	    desc: '客户搜索词导入报告数据',
	    path: '/adKeywordQuery/importData',
	    mock: true,
	    newShowSuccess: true,
	    params: {}
	},
]