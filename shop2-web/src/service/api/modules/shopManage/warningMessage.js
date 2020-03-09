export default [
	{
		name: 'warnStatistics',
		method: 'POST',
		desc: '统计',
		path: '/warn/statistics',
		mock:false,
	},
	{
		name: 'warnTypeList',
		method: 'POST',
		desc: '预警类型-列表',
		path: '/warn/typeList',
		mock:false,
    },
	{
		name: 'warnSetRead',
		method: 'POST',
		desc: '预警类型-设置已读',
		path: '/warn/setRead',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'warnSetUnread',
		method: 'POST',
		desc: '预警类型-设置未读',
		path: '/warn/setUnread',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'warnExportExcel',
		method: 'POST',
		desc: '预警类型-导出EXCEL',
		path: '/warn/exportExcel',
		showSuccess:true,
		config: {
		  responseType: 'blob'
		},
		mock:false,
	},
	{
		name: 'warnSetReply',
		method: 'POST',
		desc: '预警类型-设置无需回复（仅限客户消息）',
		path: '/warn/setReply',
		newShowSuccess:true,
		mock:false,
	},
	{
		name: 'warnRemove',
		method: 'POST',
		desc: '预警类型-删除',
		path: '/warn/remove',
		newShowSuccess:true,
		mock:false,
	},
]
