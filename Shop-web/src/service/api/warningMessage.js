export default [
	{
	    name: 'homePerformanceLsitStat',
	    method: 'POST',
	    desc: '预警消息-列表tab页',
	    path: '/home/performance/lsitStat',
		mock:true,
	    params: {}
	},
	{
	    name: 'homePerformanceNoticeLsit',
	    method: 'POST',
	    desc: '预警消息-列表',
	    path: '/home/performance/noticeList',
		mock:true,
	    params: {}
	},
	{
	    name: 'homePerformanceExportNotice',
	    method: 'POST',
	    desc: '预警消息-列表导出',
	    path: '/home/performance/exportNotice',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		},
	    params: {}
	},
	{
	    name: 'homePerformanceHandleNotice',
	    method: 'POST',
	    desc: '预警消息-标记已读/未读',
	    path: '/home/performance/handleNotice',
		mock:true,
		showSuccess: true,
	    params: {}
	},
	{
	    name: 'homePerformanceSelfNotice',
	    method: 'POST',
	    desc: '预警消息-上架',
	    path: '/home/performance/selfNotice',
		mock:true,
		showSuccess: true,
	    params: {}
	},
]