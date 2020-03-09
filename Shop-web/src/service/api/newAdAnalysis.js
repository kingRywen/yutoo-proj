export default [
	{
	    name: 'newTaskAdDataFrequencyUpdate',
	    method: 'POST',
	    desc: '修改监控频率',
	    path: '/taskAdDataFrequency/update',
	    mock: true,
	    showSuccess: true,
	    params: {}
	},
	{
	    name: 'newTaskAdDataFrequencyInfo',
	    method: 'POST',
	    desc: '获取监控频率',
	    path: '/taskAdDataFrequency/info',
	    mock: true,
	    // showSuccess: true,
	    params: {}
	},
	{
	    name: 'newAdDataUpdateClassifyId',
	    method: 'POST',
	    desc: '移入分组',
	    path: '/adData/updateClassifyId',
	    mock: true,
	    showSuccess: true,
	    params: {}
	},
	{
	    name: 'newAdDataUpdateMonitoring',
	    method: 'POST',
	    desc: '开启/关闭监控',
	    path: '/adData/updateMonitoring',
	    mock: true,
	    showSuccess: true,
	    params: {}
	},
	{
	    name: 'newAdDataList',
	    method: 'POST',
	    desc: '广告系列/组/关键词列表',
	    path: '/adData/list',
	    mock: true,
	    // showSuccess: true,
	    params: {}
	},
	{
	    name: 'newAdDataExportData',
	    method: 'POST',
	    desc: '广告系列/组/关键词列表导出',
	    path: '/adData/exportData',
	    mock: true,
		config:{
			responseType: 'blob'
		},
	    showSuccess: true,
	    params: {}
	},
	{
	    name: 'newAdDataAdHistoryStat',
	    method: 'POST',
	    desc: '广告系列/组历史曲线统计',
	    path: '/adData/adHistoryStat',
	    mock: true,
	    // showSuccess: true,
	    params: {}
	},
	{
	    name: 'newAdDataAdHistoryStatExport',
	    method: 'POST',
	    desc: '广告系列/组历史曲线统计导出',
	    path: '/adData/adHistoryStatExport',
	    mock: true,
		config:{
			responseType: 'blob'
		},
	    showSuccess: true,
	    params: {}
	},
	{
	    name: 'newAdDataAdKeywordHistoryStat',
	    method: 'POST',
	    desc: '关键词历史曲线统计',
	    path: '/adData/adKeywordHistoryStat',
	    mock: true,
	    // showSuccess: true,
	    params: {}
	},
	{
	    name: 'newAdDataAdKeywordHistoryStatExport',
	    method: 'POST',
	    desc: '关键词历史曲线统计导出',
	    path: '/adData/adKeywordHistoryStatExport',
	    mock: true,
		config:{
			responseType: 'blob'
		},
	    showSuccess: true,
	    params: {}
	},
]