export default [
    //父sku列表
    {
        name: 'productListParentSku1',
        method: 'POST',
        desc: '父sku列表',
        path: '/product/listParentSku',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    //子sku列表
    {
        name: 'ProductListSku',
        method: 'POST',
        desc: '子sku列表',
        path: '/product/listSku',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    //表格 和 图标数据总接口
    {
        name: 'FinanceIndex',
        method: 'POST',
        desc: '表格和图标数据总接口',
        path: '/finance/index',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'totalSalesList',
        method: 'POST',
        desc: '销售总额列表',
        path: '/finance/totalSalesList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'fulfillmentFeeList',
        method: 'POST',
        desc: '配送费列表',
        path: '/finance/fulfillmentFeeList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'commissionList',
        method: 'POST',
        desc: '佣金列表',
        path: '/finance/commissionList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'storageFeeList',
        method: 'POST',
        desc: '仓储费列表',
        path: '/finance/storageFeeList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'refundAmountList',
        method: 'POST',
        desc: '退款金额列表',
        path: '/finance/refundAmountList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'refundLossList',
        method: 'POST',
        desc: '退款损失列表',
        path: '/finance/refundLossList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'removeFeeList',
        method: 'POST',
        desc: '移除费用列表',
        path: '/finance/removeFeeList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'disposalFeeList',
        method: 'POST',
        desc: '销毁费用列表',
        path: '/finance/disposalFeeList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'adChargeList',
        method: 'POST',
        desc: '广告费用列表',
        path: '/finance/adChargeList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'subscriptionList',
        method: 'POST',
        desc: '店铺费用列表',
        path: '/finance/subscriptionList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'reimbursementList',
        method: 'POST',
        desc: '赔偿',
        path: '/finance/reimbursementList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    // 问题列表接口
    {
        name: 'problemList',
        method: 'POST',
        desc: '问题列表',
        path: '/finance/problemList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    // 金额情况明细      
    {
        name: 'chargeDetailList',
        method: 'POST',
        desc: '金额情况明细',
        path: '/finance/chargeDetailList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    // 库存
    {
        name: 'inventoryDetailList',
        method: 'POST',
        desc: '金额情况明细',
        path: '/finance/inventoryDetailList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'amazonLossErrorList',
        method: 'POST',
        desc: '入库丢件未赔偿列表',
        path: '/finance/amazonLossErrorList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'amazonErrorList',
        method: 'POST',
        desc: '亚马逊损坏未赔偿列表',
        path: '/finance/amazonErrorList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'refundErrorList',
        method: 'POST',
        desc: '客户退款未退货亚马逊未赔偿列表',
        path: '/finance/refundErrorList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'storageErrorList',
        method: 'POST',
        desc: '仓储费不对列表',
        path: '/finance/storageErrorList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'fulfillmentErrorList',
        method: 'POST',
        desc: 'FBA配送费不对列表',
        path: '/finance/fulfillmentErrorList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'commissionErrorList',
        method: 'POST',
        desc: '佣金不对列表',
        path: '/finance/commissionErrorList',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    // 导出
    {
        name: 'fulfillmentErrorExport',
        method: 'POST',
        desc: 'FBA配送费不对列表   导出',
        path: '/finance/fulfillmentErrorExport',
        mockPath: '',
         mock: false,
		config:{
			responseType: 'blob'
		},
        pcommonarams: {
        }
    },
    {
        name: 'commissionErrorExport',
        method: 'POST',
        desc: '佣金不对  导出',
        path: '/finance/commissionErrorExport',
        mockPath: '',
         mock: false,
		config:{
			responseType: 'blob'
		},
        pcommonarams: {
        }
    },
    {
        name: 'storageErrorExport',
        method: 'POST',
        desc: '仓储费  导出',
        path: '/finance/storageErrorExport',
        mockPath: '',
         mock: false,
		config:{
			responseType: 'blob'
		},
        pcommonarams: {
        }
    },
    {
        name: 'refundErrorExport',
        method: 'POST',
        desc: '客户退款未退货亚马逊未赔偿列表   导出',
        path: '/finance/refundErrorExport',
        mockPath: '',
         mock: false,
		config:{
			responseType: 'blob'
		},
        pcommonarams: {
        }
    },
    {
        name: 'amazonLossErrorExport',
        method: 'POST',
        desc: '入库丢件未赔偿列表  导出',
        path: '/finance/amazonLossErrorExport',
        mockPath: '',
         mock: false,
		config:{
			responseType: 'blob'
		},
        pcommonarams: {
        }
    },
    {
        name: 'amazonErrorExport',
        method: 'POST',
        desc: '亚马逊损坏未赔偿列表  导出',
        path: '/finance/amazonErrorExport',
        mockPath: '',
         mock: false,
		config:{
			responseType: 'blob'
		},
        pcommonarams: {
        }
    },
	{
		name:'financeIndexExport',
		method: 'POST',
		desc: '店铺财务统计-首页数据 导出',
		path: '/finance/indexExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeTotalSalesExport',
		method: 'POST',
		desc: '店铺财务统计-销售总额列表 导出',
		path: '/finance/totalSalesExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeReimbursementExport',
		method: 'POST',
		desc: '店铺财务统计-赔偿列表 导出',
		path: '/finance/reimbursementExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeFulfillmentFeeExport',
		method: 'POST',
		desc: '店铺财务统计-正常FBA配送费列表 导出',
		path: '/finance/fulfillmentFeeExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeCommissionExport',
		method: 'POST',
		desc: '店铺财务统计-佣金列表 导出',
		path: '/finance/commissionExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeStorageFeeExport',
		method: 'POST',
		desc: '店铺财务统计-仓储费列表 导出',
		path: '/finance/storageFeeExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeRefundExport',
		method: 'POST',
		desc: '店铺财务统计-退款列表 导出',
		path: '/finance/refundExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeRefundLossExport',
		method: 'POST',
		desc: '店铺财务统计-退款损失列表 导出',
		path: '/finance/refundLossExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeDisposalFeeExport',
		method: 'POST',
		desc: '店铺财务统计-销毁费用列表 导出',
		path: '/finance/disposalFeeExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeRemoveFeeExport',
		method: 'POST',
		desc: '店铺财务统计-移除费用列表 导出',
		path: '/finance/removeFeeExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeAdChargeExport',
		method: 'POST',
		desc: '店铺财务统计-广告费用列表 导出',
		path: '/finance/adChargeExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeSubscriptionExport',
		method: 'POST',
		desc: '店铺财务统计-店铺费用列表 导出',
		path: '/finance/subscriptionExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeChargeDetailExport',
		method: 'POST',
		desc: '店铺财务统计-产品费用明细 导出',
		path: '/finance/chargeDetailExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
	{
		name:'financeInventoryDetailExport',
		method: 'POST',
		desc: '店铺财务统计-产品库存明细 导出',
		path: '/finance/inventoryDetailExport',
		mockPath: '',
		 mock: false,
		// showSuccess: true,
		params: {
		},
		config:{
			responseType: 'blob'
		},
		must:['sellerId','siteId','startTime','endTime']
	},
]