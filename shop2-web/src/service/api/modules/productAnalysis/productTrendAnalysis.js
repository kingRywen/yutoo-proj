export default [
	{
		name: 'ptSaveTask',
		method: 'POST',
		desc: '添加任务',
		path: '/pt/saveTask',
		showSuccess:true
	},
	{
		name: 'ptTaskList',
		method: 'POST',
		desc: '任务列表',
		path: '/pt/taskList',
    },
	{
		name: 'ptRemoveTask',
		method: 'POST',
		desc: '删除任务',
		path: '/pt/removeTask',
		newShowSuccess:true
	},
	{
		name: 'ptReCrawlTask',
		method: 'POST',
		desc: '重新抓取',
		path: '/pt/reCrawlTask',
		newShowSuccess:true
	},
	{
		name: 'ptAsinList',
		method: 'POST',
		desc: '任务Asin列表',
		path: '/pt/asinList',
	},
	{
		name: 'ptReviewCrv',
		method: 'POST',
		desc: '评价曲线',
		path: '/pt/reviewCrv',
	},
]
