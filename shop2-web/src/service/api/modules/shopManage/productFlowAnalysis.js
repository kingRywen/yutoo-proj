export default [
	{
		name: 'productFlowSkuListWarn',
		method: 'POST',
		desc: '流量预警-列表',
		path: '/productFlowSku/listWarn',
		mock:true,
    },
	{
		name: 'productFlowSkuSave',
		method: 'POST',
		desc: '流量预警-添加流量分析产品',
		path: '/productFlowSku/save',
		newShowSuccess:true,
		mock:true,
	},
	{
		name: 'productFlowSkuRemove',
		method: 'POST',
		desc: '流量预警-删除流量分析产品',
		path: '/productFlowSku/remove',
		newShowSuccess:true,
		mock:true,
	},
	{
		name: 'productFlowSkuListWarnExport',
		method: 'POST',
		desc: '流量预警-列表-导出',
		path: '/productFlowSku/listWarnExport',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:true,
	},
	{
		name: 'productFlowSkuListWarnToParentSku',
		method: 'POST',
		desc: '流量预警-问题父产品列表',
		path: '/productFlowSku/listWarnToParentSku',
		mock:true,
	},
	{
		name: 'productFlowSkuListWarnToSku',
		method: 'POST',
		desc: '流量预警-问题子产品列表',
		path: '/productFlowSku/listWarnToSku',
		mock:true,
	},
	{
		name: 'productFlowSkuListWarnToParentSkuExport',
		method: 'POST',
		desc: '流量预警-问题父产品列表-导出',
		path: '/productFlowSku/listWarnToParentSkuExport',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:true,
	},
	{
		name: 'productFlowSkuListWarnToSkuExport',
		method: 'POST',
		desc: '流量预警-问题子产品列表-导出',
		path: '/productFlowSku/listWarnToSkuExport',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:true,
	},
	{
		name: 'productFlowSkuHistoryStat',
		method: 'POST',
		desc: '趋势分析-产品历史数据统计',
		path: '/productFlowSku/historyStat',
		mock:true,
	},
]
