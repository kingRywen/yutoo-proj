export default[
    {
	    name: 'imSaleProdAbleListProduct',
	    method: 'POST',
	    desc: '跟卖库-产品列表(可跟卖,计划跟卖)',
	    path: '/imSaleProdAble/listProduct',
		mock: false,
	    params: {}
	},
	{
	    name: 'imSaleProdCheckListSellerId',
	    method: 'POST',
	    desc: '源店铺列表',
	    path: '/imSaleProdCheck/listSellerId',
		mock: false,
	    params: {}
	},
	{
	    name: 'imSaleProdAbleListProductExport',
	    method: 'POST',
	    desc: '跟卖库-产品列表(可跟卖,计划跟卖)-导出',
	    path: '/imSaleProdAble/listProductExport',
		mock: false,
		config:{
			responseType:'blob'
		},
	    params: {}
	},
	{
	    name: 'imSaleProdAbleUpdatePlan',
	    method: 'POST',
	    desc: '跟卖库-加入计划跟卖库',
	    path: '/imSaleProdAble/updatePlan',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdAbleSaveConfigProduct',
	    method: 'POST',
	    desc: '跟卖库-设置保底利润率运费佣金(产品)',
	    path: '/imSaleProdAble/saveConfigProduct',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdAbleSaveConfigCate',
	    method: 'POST',
	    desc: '跟卖库-设置保底利润率运费佣金(类目)',
	    path: '/imSaleProdAble/saveConfigCate',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdAbleConfigCateInfo',
	    method: 'POST',
	    desc: '跟卖库-回显保底利润率运费佣金(类目)',
	    path: '/imSaleProdAble/configCateInfo',
		mock: false,
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleMonitorSave',
	    method: 'POST',
	    desc: '跟卖库-设置价格库存监控频率',
	    path: '/imSaleMonitor/save',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleMonitorInfo',
	    method: 'POST',
	    desc: '跟卖库-回显价格库存监控频率',
	    path: '/imSaleMonitor/info',
		mock: false,
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdExeSave',
	    method: 'POST',
	    desc: '跟卖库-添加跟卖',
	    path: '/imSaleProdExe/save',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdExeListProduct',
	    method: 'POST',
	    desc: '跟卖库-产品列表(跟卖中)',
	    path: '/imSaleProdExe/listProduct',
		mock: false,
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdExePause',
	    method: 'POST',
	    desc: '跟卖库-停止/重新跟卖(批量)',
	    path: '/imSaleProdExe/pause',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdExeUpdatePrice',
	    method: 'POST',
	    desc: '跟卖库-修改价格',
	    path: '/imSaleProdExe/updatePrice',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdExePriceInfo',
	    method: 'POST',
	    desc: '跟卖库-修改价格-回显',
	    path: '/imSaleProdExe/priceInfo',
		mock: false,
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'saleFareTempSave',
	    method: 'POST',
	    desc: '运费模板-添加',
	    path: '/saleFareTemp/save',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'saleFareTempUpdate',
	    method: 'POST',
	    desc: '运费模板-编辑',
	    path: '/saleFareTemp/update',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'saleFareTempInfo',
	    method: 'POST',
	    desc: '运费模板-模板详情回显',
	    path: '/saleFareTemp/info',
		mock: false,
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'saleFareTempBatchRemove',
	    method: 'POST',
	    desc: '运费模板-删除',
	    path: '/saleFareTemp/batchRemove',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'saleFareTempList',
	    method: 'POST',
	    desc: '运费模板-列表',
	    path: '/saleFareTemp/list',
		mock: false,
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'saleFareTempListAll',
	    method: 'POST',
	    desc: '运费模板-列表(所有)',
	    path: '/saleFareTemp/listAll',
		mock: false,
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdExeListCount',
	    method: 'POST',
	    desc: '跟卖备选库-table页数量',
	    path: '/imSaleProdExe/listCount',
		mock: false,
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdAbleUpdateSourceQuantity',
	    method: 'POST',
	    desc: '修改源库存',
	    path: '/imSaleProdAble/updateSourceQuantity',
		mock: false,
		showSuccess:true,
	    params: {}
	},

	{
	    name: 'imSaleProdAbleRemove',
	    method: 'POST',
	    desc: '可跟卖/计划跟卖-产品列表_删除',
	    path: '/imSaleProdAble/remove',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleProdExeRemove',
	    method: 'POST',
	    desc: '正在跟卖-产品列表_删除',
	    path: '/imSaleProdExe/remove',
		mock: false,
		showSuccess:true,
	    params: {}
	},

	{
	    name: 'imSaleExchangeRateList',
	    method: 'POST',
	    desc: '汇率-列表展示',
	    path: '/imSaleExchangeRate/list',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleExchangeRateExport',
	    method: 'POST',
	    desc: '汇率-导出',
	    path: '/imSaleExchangeRate/export',
		mock: false,
		config:{
			responseType :"blob"
		},
		//showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleExchangeRateUpdate',
	    method: 'POST',
	    desc: '汇率-编辑',
	    path: '/imSaleExchangeRate/update',
		mock: false,
		showSuccess:true,
	    params: {}
	},
	{
	    name: 'imSaleExchangeRateInfo',
	    method: 'POST',
	    desc: '汇率-回显汇率信息',
	    path: '/imSaleExchangeRate/info',
		mock: false,
		//showSuccess:true,
	    params: {}
	}
	



]