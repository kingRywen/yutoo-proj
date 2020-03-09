export default [
	{
	    name: 'homeCusMsgList',
	    method: 'POST',
	    desc: '客户消息-列表',
	    path: '/home/cusMsg/list',
		mock:true,
	    params: {}
	},
	{
	    name: 'homeCusMsgExport',
	    method: 'POST',
	    desc: '客户消息-列表导出',
	    path: '/home/cusMsg/export',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		},
	    params: {}
	},
	{
	    name: 'homeCusMsgHandleMsg',
	    method: 'POST',
	    desc: '客户消息-标记不需要回复',
	    path: '/home/cusMsg/handleMsg',
		mock:true,
		showSuccess: true,
	    params: {}
	},
	{
	    name: 'homeCusMsgReply',
	    method: 'POST',
	    desc: '客户消息-发送邮件',
	    path: '/home/cusMsg/reply',
		mock:true,
		showSuccess: true,
	    params: {}
	},
	{
	    name: 'homeCusMsgRecList',
	    method: 'POST',
	    desc: '客户消息-邮件内容',
	    path: '/home/cusMsg/recList',
		mock:true,
	    params: {}
	},
	
	{
	    name: 'homeCusMsgMarkRead',
	    method: 'POST',
	    desc: '客户消息-标记已读/未读',
	    path: '/home/cusMsg/markRead',
		mock:true,
		showSuccess: true,
	    params: {}
	},
]