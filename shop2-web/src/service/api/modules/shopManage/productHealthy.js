export default [
	{
		name: 'productHealthStatList',
		method: 'POST',
		desc: '列表',
		path: '/productHealthStat/list',
		mock:true,
    },
	{
		name: 'productHealthStatReturnReasonList',
		method: 'POST',
		desc: '退货原因列表',
		path: '/productHealthStat/returnReasonList',
		mock:true,
	},
	{
		name: 'productHealthStatExport',
		method: 'POST',
		desc: '导出',
		path: '/productHealthStat/export',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:true,
	},
]
