// 产品完整信息整合api
export default [
    {
        name: 'productInfoList',
        method: 'POST',
        desc: '产品信息列表',
        path: 'productInfo/list',
        mockPath: '',
        mock: true,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // {
    //     name: 'productListNewSku',
    //     method: 'POST',
    //     desc: '子sku列表(父的参考店铺管理)',
    //     path: 'product/listNewSku',
    //     mockPath: '',
    //     mock: false,
    //     must: ['sellerId', 'siteId'],
    //     showSuccess: false,
    //     pcommonarams: {
    //     }
    // },
    // 图表分析_数据展示
    {
        name: 'productInfoTotalAnalysis',
        method: 'POST',
        desc: '',
        path: 'productInfo/totalAnalysis',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId','startTime','endTime'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 图表分析_费用,库存,订单,退款情况
    {
        name: 'productInfoOtherAnalysis',
        method: 'POST',
        desc: '',
        path: 'productInfo/otherAnalysis',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 问题列表
    {
        name: 'productInfoProblemList',
        method: 'POST',
        desc: '',
        path: 'productInfo/problemList',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 导入日志列表
    {
        name: 'productInfoImportLogList',
        method: 'POST',
        desc: '',
        path: 'productInfo/importLogList',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 导入日志列表——导出文件按钮
    // {
    //     name: 'productInfoImportLogList',
    //     method: 'POST',
    //     desc: '',
    //     path: 'productInfo/importLogList',
    //     mockPath: '',
    //     mock: false,
    //     must: ['sellerId', 'siteId'],
    //     showSuccess: false,
    //     pcommonarams: {
    //     }
    // },
    // 导入日志列表——删除按钮
    {
        name: 'productInfoRemoveImportLog',
        method: 'POST',
        desc: '',
        path: 'productInfo/removeImportLog',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    //成本删除
    {
        name: 'productInfoRemoveCost',
        method: 'POST',
        desc: '',
        path: '/productInfo/removeCost',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 导出日志——单个导出
    {
        name: 'productInfoDownloadImportReport',
        method: 'POST',
        desc: '',
        path: 'productInfo/downloadImportReport',
        mockPath: '',
        mock: false,
        config:{
            responseType:'blob'
        },
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 商品费用明细——产品列表
    {
        name: 'productInfoCostList',
        method: 'POST',
        desc: '',
        path: 'productInfo/costList',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    {
        name: 'productInfoCostDetail',
        method: 'POST',
        desc: '导入商品费用明细--成本详情编辑回显',
        path: '/productInfo/costDetail',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId','financeCostId'],
        //showSuccess: false,
        pcommonarams: {
        }
    },
    // 保存广告利润占比
    {
        name: 'productInfoConfigSave',
        method: 'POST',
        desc: '',
        path: 'productInfo/configSave',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 商品费用明细——清空费用
    {
        name: 'productInfoClearCost',
        method: 'POST',
        desc: '',
        path: 'productInfo/clearCost',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 商品费用明细——添加费用
    {
        name: 'productInfoSaveCost',
        method: 'POST',
        desc: '',
        path: 'productInfo/saveCost',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 商品费用明细——弹窗详情列表
    {
        name: 'productInfoCostDetailList',
        method: 'POST',
        desc: '',
        path: 'productInfo/costDetailList',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 问题列表 —— 查看所有
    {
        name: 'productInfoChargeDetailList',
        method: 'POST',
        desc: '',
        path: 'productInfo/chargeDetailList',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    {
        name: 'productInfoConfigInfo',
        method: 'POST',
        desc: '广告利润占比详情',
        path: '/productInfo/configInfo',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 利润低7
    {
        name: 'financeProfitError',
        method: 'POST',
        desc: '',
        path: 'finance/profitError',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 下载商品费用明细导入表
    {
        name: 'financeDownloadFile',
        method: 'POST',
        desc: '',
        path: 'finance/downloadFile',
        mockPath: '',
        mock: false,
        config: {
            responseType: 'blob'
        },
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 上传商品费用明细导入表
    {
        name: 'financeCostImport',
        method: 'POST',
        desc: '',
        path: 'finance/costImport',
        mockPath: '',
        mock: false,
        config: {
            responseType: 'blob'
        },
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 退款损失列表8
    {
        name: 'financeRefundLossErrorList',
        method: 'POST',
        desc: '',
        path: 'finance/refundLossErrorList',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 广告费占比高9
    {
        name: 'financeAdvertProportionError',
        method: 'POST',
        desc: '',
        path: 'finance/advertProportionError',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
	{
	    name: 'productInfoProductInfoExport',
	    method: 'POST',
	    desc: '产品信息列表-导出',
	    path: 'productInfo/productInfoExport',
	    config: {
	        responseType: 'blob'
	    },
	    showSuccess: true,
	},
]