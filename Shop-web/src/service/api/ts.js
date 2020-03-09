export default [
    // 成交统计
    {
        name: 'ProductListParentSku',
        method: 'POST',
        desc: '父skus',
        path: '/product/listParentSku',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'SalesShopDayList',
        method: 'POST',
        desc: '整店销量报表',
        path: '/salesShopDay/list',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'SalesShopDayListSku',
        method: 'POST',
        desc: '销量占比排序',
        path: '/salesShopDay/listSku',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'SalesShopDayListForParentSku',
        method: 'POST',
        desc: '销量报表',
        path: '/salesShopDay/listForParentSku',
        mockPath: '',
        mock: true,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分析
    {
        name: 'SalesShopDayAnalysisOldCustCount',
        method: 'POST',
        desc: '老客户分析-重复购买次数',
        path: '/salesShopDay/analysisOldCustCount',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分析
    {
        name: 'SalesShopDayAnalysisOldCustPrice',
        method: 'POST',
        desc: '老客户分析-客户平均单价',
        path: '/salesShopDay/analysisOldCustPrice',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分析
    {
        name: 'SalesShopDayAnalysisOldCustTime',
        method: 'POST',
        desc: '老客户分析-重复购买次数',
        path: '/salesShopDay/analysisOldCustTime',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分析 提交区间设置
    {
        name: 'SalesConfigSave',
        method: 'POST',
        desc: '提交区间设置',
        path: '/salesConfig/save',
        mockPath: '',
        mock: false,
        showSuccess: true,
        params: {
        }
    },
    // 老客户分析 回显区间设置数据
    {
        name: 'SalesConfigInfo',
        method: 'POST',
        desc: '老客户分析-回显区间设置数据',
        path: '/salesConfig/info',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分析 重复购买次数详情
    {
        name: 'SalesShopDayAnalysisOldCustCountDetail',
        method: 'POST',
        desc: '州',
        path: '/salesShopDay/analysisOldCustCountDetail',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分析 客户平均单价详情
    {
        name: 'SalesShopDayAnalysisOldCustPriceDetail',
        method: 'POST',
        desc: '州',
        path: '/salesShopDay/analysisOldCustPriceDetail',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分析 重复购买间隔时间详情
    {
        name: 'SalesShopDayAnalysisOldCustTimeDetail',
        method: 'POST',
        desc: '州',
        path: '/salesShopDay/analysisOldCustTimeDetail',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分布 国家
    {
        name: 'SalesShopDayDistOldCustCountry',
        method: 'POST',
        desc: '国家',
        path: '/salesShopDay/distOldCustCountry',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分布 州
    {
        name: 'SalesShopDayDistOldCustState',
        method: 'POST',
        desc: '州',
        path: '/salesShopDay/distOldCustState',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分布 城市
    {
        name: 'SalesShopDayDistOldCustCity',
        method: 'POST',
        desc: '城市',
        path: '/salesShopDay/distOldCustCity',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分布 获取国家/州列表
    {
        name: 'AddressList',
        method: 'POST',
        desc: '州',
        path: '/address/list',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分布 获取国家老客户详情
    {
        name: 'SalesShopDayDistOldCustCountryDetail',
        method: 'POST',
        desc: '州',
        path: '/salesShopDay/distOldCustCountryDetail',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分布 获取州老客户详情
    {
        name: 'SalesShopDayDistOldCustStateDetail',
        method: 'POST',
        desc: '州',
        path: '/salesShopDay/distOldCustStateDetail',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // 老客户分布 获取城市老客户详情
    {
        name: 'SalesShopDayDistOldCustCityDetail',
        method: 'POST',
        desc: '州',
        path: '/salesShopDay/distOldCustCityDetail',
        mockPath: '',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
	{
		name:'salesShopDayOldCustCountExport',
		method: 'POST',
		desc: '成交统计-重复购买次数-客户 导出',
		path: '/salesShopDay/oldCustCountExport',
		mockPath: '',
		mock:false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime','parentSkus','minBuyQty']
	},
	{
		name:'salesShopDayOldCustPriceExport',
		method: 'POST',
		desc: '成交统计-客户平均单价-客户 导出',
		path: '/salesShopDay/oldCustPriceExport',
		mockPath: '',
		mock:false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime','parentSkus','minPrice']
	},
	{
		name:'salesShopDayOldCustTimeExport',
		method: 'POST',
		desc: '成交统计-重复购买间隔时间-客户 导出',
		path: '/salesShopDay/oldCustTimeExport',
		mockPath: '',
		mock:false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime','parentSkus','minDays']
	},
	{
		name:'salesShopDayOldCustCountryExport',
		method: 'POST',
		desc: '成交统计-国家-客户 导出',
		path: '/salesShopDay/oldCustCountryExport',
		mockPath: '',
		mock:false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime','parentSkus','countryCode']
	},
	{
		name:'salesShopDayOldCustStateExport',
		method: 'POST',
		desc: '成交统计-州-客户 导出',
		path: '/salesShopDay/oldCustStateExport',
		mockPath: '',
		mock:false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime','parentSkus','countryCode','state']
	},
	{
		name:'salesShopDayOldCustCityExport',
		method: 'POST',
		desc: '成交统计-城市-客户 导出',
		path: '/salesShopDay/oldCustCityExport',
		mockPath: '',
		mock:false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime','parentSkus','countryCode','state','city']
	},
	{
		name:'salesShopDayListExport',
		method: 'POST',
		desc: '整店销量报表-导出',
		path: '/salesShopDay/listExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesShopDayListSkuExport',
		method: 'POST',
		desc: '销量占比-导出',
		path: '/salesShopDay/listSkuExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesShopDayListReportExport',
		method: 'POST',
		desc: '销量报表-导出',
		path: '/salesShopDay/listReportExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesShopDayAnalysisOldCustCountExport',
		method: 'POST',
		desc: '老客户分析-重复购买次数-导出',
		path: '/salesShopDay/analysisOldCustCountExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesShopDayAnalysisOldCustPriceExport',
		method: 'POST',
		desc: '老客户分析-客户平均单价-导出',
		path: '/salesShopDay/analysisOldCustPriceExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesShopDayAnalysisOldCustTimeExport',
		method: 'POST',
		desc: '老客户分析-重复购买间隔时间-导出',
		path: '/salesShopDay/analysisOldCustTimeExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesShopDayDistOldCustCountryExport',
		method: 'POST',
		desc: '老客户分布-国家-导出',
		path: '/salesShopDay/distOldCustCountryExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesShopDayDistOldCustStateExport',
		method: 'POST',
		desc: '老客户分布-州/地区-导出',
		path: '/salesShopDay/distOldCustStateExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesShopDayDistOldCustCityExport',
		method: 'POST',
		desc: '老客户分布-城市-导出',
		path: '/salesShopDay/distOldCustCityExport',
		mock:true,
		showSuccess: true,
		config:{
			responseType: 'blob'
		}
	},
	{
		name:'salesOrderRecordInfo',
		method: 'POST',
		desc: '同步数据-状态及时间',
		path: '/salesOrderRecord/info',
		mock:true,
	},
	{
		name:'salesOrderRecordSave',
		method: 'POST',
		desc: '同步数据',
		path: '/salesOrderRecord/save',
		showSuccess: true,
		mock:true,
	},
];