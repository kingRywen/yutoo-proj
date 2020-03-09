export default [
	{
	    name: 'adKeywordAnalysisSave',
	    method: 'POST',
	    desc: '广告关键词分析-添加任务',
	    path: '/adKeywordAnalysis/save',
		mock:true,
		showSuccess: true,
	    params: {}
	},
	{
	    name: 'adKeywordAnalysisList',
	    method: 'POST',
	    desc: '广告关键词分析-列表',
	    path: '/adKeywordAnalysis/list',
		mock:true,
	    params: {}
	},
	{
	    name: 'adKeywordAnalysisReCrawl',
	    method: 'POST',
	    desc: '广告关键词分析-重新发送任务',
	    path: '/adKeywordAnalysis/reCrawl',
		mock:true,
		showSuccess: true,
	    params: {}
	},
	{
	    name: 'adKeywordAnalysisRemove',
	    method: 'POST',
	    desc: '广告关键词分析-删除',
	    path: '/adKeywordAnalysis/remove',
		mock:true,
		showSuccess: true,
	    params: {}
	},
	
	{
	    name: 'adKeywordAnalysisDetails',
	    method: 'POST',
	    desc: '广告关键词分析-任务详情',
	    path: '/adKeywordAnalysis/details',
		mock:true,
	    params: {}
	},
	{
	    name: 'adKeywordAnalysisExportData',
	    method: 'POST',
	    desc: '广告关键词分析-详情导出',
	    path: '/adKeywordAnalysis/exportData',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		},
	    params: {}
	},
]