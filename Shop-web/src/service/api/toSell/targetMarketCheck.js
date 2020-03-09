export default [
	{
		name: 'imSaleProdCheckImportData',
		method: 'POST',
		desc: '目标市场校验-产品导入',
		path: '/imSaleProdCheck/importData',
		mock: true,
		type: 'formdata',
		// config: {
		//     responseType: 'blob'
		// },
		params: {},
		showSuccess: true,
	},
	{
		name: 'imSaleProdCheckDownloadFile',
		method: 'POST',
		desc: '目标市场校验-产品导入模板下载',
		path: '/imSaleProdCheck/downloadFile',
		mock: true,
		params: {},
		config: {
			responseType: 'blob'
		},
		showSuccess: true,
	},

	{
		name: 'imSaleProdCheckListProduct',
		method: 'POST',
		desc: '目标市场校验-产品列表',
		path: '/imSaleProdCheck/listProduct',
		mock: true,
		params: {}
	},
	{
		name: 'imSaleProdCheckListProductExport',
		method: 'POST',
		desc: '目标市场校验-产品列表-导出',
		path: '/imSaleProdCheck/listProductExport',
		mock: true,
		params: {},
		showSuccess: true,
		config: {
			responseType: 'blob'
		},
	},
	{
		name: 'imSaleProdCheckUpdateCate',
		method: 'POST',
		desc: '目标市场校验-不在售-设置类目',
		path: '/imSaleProdCheck/updateCate',
		mock: true,
		params: {},
		showSuccess: true,
	},
	{
		name: 'imSaleProdAbleSave',
		method: 'POST',
		desc: '目标市场校验-加入可跟卖库',
		path: '/imSaleProdAble/save',
		mock: true,
		params: {},
		showSuccess: true,
	},
	{
		name: 'imSaleProdCheckListSellerId1',
		method: 'POST',
		desc: '源店铺列表',
		path: '/imSaleProdCheck/listSellerId',
		mock: true,
		params: {}
	},
	{
		name: 'imSaleProdCheckReExecute',
		method: 'POST',
		desc: '目标市场校验-不在售-重新抓取',
		path: '/imSaleProdCheck/reExecute',
		mock: true,
		params: {},
		showSuccess: true,
	},
	{
		name: 'imSaleProdCheckRemove',
		method: 'POST',
		desc: '目标市场校验-删除',
		path: '/imSaleProdCheck/remove',
		mock: true,
		showSuccess: true,
	},
]