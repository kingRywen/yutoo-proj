export default [
	{
		name: "platformSiteList",
		method: "POST",
		desc: "获取平台站点",
		path: "/platformSite/list",
		mockPath: 'http://120.79.124.232:8001/mock/235/platformSite/list',
		params: {}
	},
	{
		name: 'keywordTypeList',
		method: 'POST',
		desc: '获取关键词类型',
		path: '/keywordType/list',
	},
	{
		name: "userlogin",
		method: "POST",
		desc: "商户登录",
		path: "/sys/login",
		type: 'form',
		mockPath: "http://120.79.124.232:8001/mock/13/login",
		params: {}
	},
	{
		name: "sysMerchantMenuList",
		method: "POST",
		desc: "用户菜单列表",
		path: "/sysMerchantMenu/list",
		// mockPath: "http://120.79.124.232:8001/mock/13/login",
		type: 'form',
		params: {}
	},
	
];
