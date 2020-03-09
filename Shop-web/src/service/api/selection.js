export default [
    {
        name: 'productAnalysisList',
        method: 'POST',
        desc: '任务列表',
        path: '/productAnalysis/list',
        mock: false,
        must: ['platformId', 'siteId', 'sellerId', 'pageNumber', 'pageSize'],
        
        params: {}
    },
    {
        name: 'productKrExport',
        method: 'POST',
        desc: '有效关键词分析-导出',
        path: '/productKr/export',
        mock: false,
        config: {
            responseType: "blob"
        },
        must: ['taskId'],
        params: {}
    },
    {
        name: 'productAnalysisSave',
        method: 'POST',
        desc: '添加任务',
        showSuccess: true,
        path: '/productAnalysis/save',
        mock: false,
        must: ['platformId', 'siteId', 'sellerId', 'asins', 'monitorFrom', 'monitorTo'],
        params: {}
    },
    {
        name: 'productAnalysisAddMonitor',
        method: 'POST',
        desc: '添加监控',
        path: '/productAnalysis/addMonitor',
        mock: false,
        showSuccess: true,
        must: ['taskIds', 'monitorFrom', 'monitorTo'],
        params: {}
    },
    {
        name: 'productAnalysisUpdateMonitor',
        method: 'POST',
        desc: '修改监控',
        showSuccess: true,
        path: '/productAnalysis/updateMonitor',
        mock: false,
        must: ['taskIds', 'monitorFrom', 'monitorTo'],
        params: {}
    },
    {
        name: 'productAnalysisRemoveMonitor',
        method: 'POST',
        desc: '取消监控',
        path: '/productAnalysis/removeMonitor',
        mock: false,
        showSuccess: true,
        must: ['taskIds'],
        params: {}
    },
    {
        name: 'productAnalysisRemove',
        method: 'POST',
        desc: '删除任务',
        showSuccess: true,
        path: '/productAnalysis/remove',
        mock: false,
        must: ['taskIds'],
        params: {}
    },
    {
        name: 'productAnalysisReCrawl',
        method: 'POST',
        showSuccess: true,
        desc: '选品-竞品分析-重新抓取',
        path: '/productAnalysis/reCrawl',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductInfo',
        method: 'POST',
        desc: '产品分析-基础信息',
        path: '/bigProduct/info',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductTitleRtInfo',
        method: 'POST',
        desc: '产品分析-标题分析',
        path: '/bigProductTitleRt/info',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductAttrRtInfo',
        method: 'POST',
        desc: '产品分析-变体属性分析',
        path: '/bigProductAttrRt/info',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductFirstReview',
        method: 'POST',
        desc: '产品分析-第一条评价',
        path: '/bigProduct/firstReview',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductReviewRtInfo',
        method: 'POST',
        desc: '产品分析-第一个月新增评价',
        path: '/bigProductReviewRt/info',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductAqRtInfo',
        method: 'POST',
        desc: '产品分析-AQ数分析',
        path: '/bigProductAqRt/info',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductRelateRtInfo',
        method: 'POST',
        desc: '产品分析-关联流量外放程度',
        path: '/bigProductRelateRt/info',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductFeatureRtInfo',
        method: 'POST',
        desc: '产品分析-卖点分析',
        path: '/bigProductFeatureRt/info',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductImageRtInfo',
        method: 'POST',
        desc: '产品分析-图片数分析',
        path: '/bigProductImageRt/info',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductReviewDetailCurveList',
        method: 'POST',
        desc: '产品分析-新增评价数列表',
        path: '/bigProductReviewDetail/curveList',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductBsrCategoryList',
        method: 'POST',
        desc: '产品分析-bsr类目下拉列表',
        path: '/bigProductBsrCategory/list',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductRankDayList',
        method: 'POST',
        desc: '产品分析-bsr类目变化列表',
        path: '/bigProductRankDay/list',
        mock: false,
        must: ['taskId', "startTime", 'endTime'],
        params: {}
    },
    {
        name: 'bigProductAqDayList',
        method: 'POST',
        desc: '产品分析-新增AQ数列表',
        path: '/bigProductAqDay/list',
        mock: false,
        must: ['taskId', "startTime", 'endTime'],
        params: {}
    },
    {
        name: 'bigProductDayFitList',
        method: 'POST',
        desc: '产品分析-FIT率列表',
        path: '/bigProductDay/fitList',
        mock: false,
        must: ['taskId', "startTime", 'endTime'],
        params: {}
    },
    {
        name: 'bigProductDayCurrentList',
        method: 'POST',
        desc: '产品分析-当日新增评价数列表',
        path: '/bigProductDay/currentList',
        mock: false,
        must: ['taskId', "startTime", 'endTime'],
        params: {}
    },
    {
        name: 'bigProductEventList',
        method: 'POST',
        desc: '产品分析- 产品历史变化动态记录',
        path: '/bigProductEvent/list',
        mock: false,
        must: ['taskId', "startTime", 'endTime'],
        params: {}
    },
    {
        name: 'bigProductSkuList',
        method: 'POST',
        desc: '子sku-子sku列表',
        path: '/bigProduct/skuList',
        mock: false,
        must: ['taskId'],
        params: {}
    },
    {
        name: 'bigProductSellingList',
        method: 'POST',
        desc: '子sku-跟卖列表【查看跟卖-子sku列表】',
        path: '/bigProductSelling/list',
        mock: false,
        must: ['taskId', 'pageNumber', 'pageSize'],
        params: {}
    },
    {
        name: 'bigProductSellingSellerList',
        method: 'POST',
        desc: '子sku-跟卖卖家列表',
        path: '/bigProductSellingSeller/list',
        mock: false,
        must: ['taskId', 'asin', 'pageNumber', 'pageSize'],
        params: {}
    },
    {
        name: 'bigProductDayPriceList',
        method: 'POST',
        desc: '子sku-价格变化曲线',
        path: '/bigProductDay/priceList',
        mock: false,
        must: ['taskId', 'asin', 'endTime', 'startTime'],
        params: {}
    },
    {
        name: 'bigProductDayShippingList',
        method: 'POST',
        desc: '子sku-发货方式变化曲线',
        path: '/bigProductDay/shippingList',
        mock: false,
        must: ['taskId', 'asin', 'endTime', 'startTime'],
        params: {}
    },
    {
        name: 'bigProductSellingDayList',
        method: 'POST',
        desc: '子sku-购物车获得率变化曲线',
        path: '/bigProductSellingDay/list',
        mock: false,
        must: ['taskId', 'asin', 'endTime', 'startTime'],
        params: {}
    },
    {
        name: 'bigProductDayStockList',
        method: 'POST',
        desc: '子sku-库存变化曲线',
        path: '/bigProductDay/stockList',
        mock: false,
        must: ['taskId', 'asin', 'endTime', 'startTime'],
        params: {}
    },
    {
        name: 'productKrList',
        method: 'POST',
        desc: '子sku-库存变化曲线',
        path: '/productKr/list',
        mock: false,
        must: ['taskId', 'pageNumber', 'pageSize'],
        params: {}
    },
    {
        name: 'bigProductKrItemList',
        method: 'POST',
        desc: '有效关键词分析-历史曲线',
        path: '/bigProductKrItem/list',
        mock: false,
        must: ['recordId', 'startTime', 'endTime'],
        params: {}
    },

    //li.lu 店铺和产品趋势分析
    {
        name: 'taskProductTrendAnalysisListTask',
        method: 'POST',
        desc: '产品趋势分析列表',
        path: '/taskProductTrendAnalysis/listTask',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskProductTrendAnalysisSave',
        method: 'POST',
        desc: '产品趋势分析添加任务',
        showSuccess: true,
        path: '/taskProductTrendAnalysis/save',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskProductTrendAnalysisReExecute',
        method: 'POST',
        desc: '产品趋势分析重新抓取数据',
        path: '/taskProductTrendAnalysis/reExecute',
        mockPath: '',
        mock: false,
        showSuccess:true,
        pcommonarams: {
        }
    },
    {
        name: 'taskProductTrendAnalysisBatchRemove',
        method: 'POST',
        desc: '产品趋势分析删除任务',
        path: '/taskProductTrendAnalysis/batchRemove',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskProductTrendAnalysisListTaskDetail',
        method: 'POST',
        desc: '产品趋势分析详情列表',
        path: '/taskProductTrendAnalysis/listTaskDetail',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskProductTrendAnalysisExportTaskDetail',
        method: 'POST',
        desc: '产品趋势分析详情列表导出',
        path: '/taskProductTrendAnalysis/exportTaskDetail',
        mockPath: '',
        mock: false,
        config: {
            responseType: "blob"
        },
        pcommonarams: {
        }
    },
    {
        name: 'taskProductTrendAnalysisListReview',
        method: 'POST',
        desc: '产品趋势分析详情列表查看新增评价数列表',
        path: '/taskProductTrendAnalysis/listReview',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },

    {
        name: 'taskShopTrendAnalysisListTask',
        method: 'POST',
        desc: '店铺趋势分析列表',
        path: '/taskShopTrendAnalysis/listTask',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskShopTrendAnalysisSave',
        method: 'POST',
        desc: '店铺趋势分析添加任务',
        path: '/taskShopTrendAnalysis/save',
        mockPath: '',
        showSuccess: true,
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskShopTrendAnalysisReExecute',
        method: 'POST',
        desc: '店铺趋势分析重新抓取数据',
        path: '/taskShopTrendAnalysis/reExecute',
        mockPath: '',
        mock: false,
        showSuccess:true,
        pcommonarams: {
        }
    },
    {
        name: 'taskShopTrendAnalysisBatchRemove',
        method: 'POST',
        desc: '店铺趋势分析删除任务',
        path: '/taskShopTrendAnalysis/batchRemove',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskShopTrendAnalysisListTaskDetail',
        method: 'POST',
        desc: '店铺趋势分析详情列表',
        path: '/taskShopTrendAnalysis/listTaskDetail',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskShopTrendAnalysisListReview',
        method: 'POST',
        desc: '店铺趋势分析详情新增评价数列表',
        path: '/taskShopTrendAnalysis/listReview',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'taskShopTrendAnalysisExportTaskDetail',
        method: 'POST',
        desc: '店铺趋势分析导出',
        path: '/taskShopTrendAnalysis/exportTaskDetail',
        mockPath: '',
        mock: false,
        config: {
            responseType: "blob"
        },
        pcommonarams: {
        }
    },
    {
        name: 'taskShopTrendAnalysisTaskShopAnalysissave',
        method: 'POST',
        desc: '店铺趋势分析加入店铺分析',
        path: '/taskShopAnalysis/save',
        mockPath: '',
        mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    //li.lu 选品
    {
        name: 'taskSelectionList',
        method: 'POST',
        desc: '选品列表',
        path: '/taskSelection/list',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId', 'platformId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionSave',
        method: 'POST',
        desc: '选品添加任务',
        path: '/taskSelection/save',
        mockPath: '',
        mock: false,
        showSuccess: true,
        must: ['sellerId', 'siteId', 'platformId', 'taskName', 'dataType', 'dataSources'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionBatchRemove',
        method: 'POST',
        desc: '选品删除任务',
        path: '/taskSelection/batchRemove',
        mockPath: '',
        mock: false,
        showSuccess: true,
        must: ['sellerId', 'siteId', 'ids'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionReExecute',
        method: 'POST',
        desc: '选品刷新任务',
        path: '/taskSelection/reExecute',
        mockPath: '',
        mock: false,
        showSuccess: true,
        must: ['sellerId', 'siteId', 'ids'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionListTaskDetail',
        method: 'POST',
        desc: '选品任务详情列表',
        path: '/taskSelection/listTaskDetail',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must: ['sellerId', 'siteId', 'taskId', 'pageSize', 'pageNumber'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionExportTaskDetail',
        method: 'POST',
        desc: '选品任务详情列表导出',
        path: '/taskSelection/exportTaskDetail',
        mockPath: '',
        mock: false,
        config: {
            responseType: "blob"
        },
        //showSuccess:true,
        must: ['sellerId', 'siteId', 'taskId', 'parentAsins'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionManualHandle',
        method: 'POST',
        desc: '选品任务详情人工标注同款/设为独立',
        path: '/taskSelection/manualHandle',
        mockPath: '',
        mock: false,
        showSuccess: true,
        must: ['sellerId', 'siteId', 'taskId', 'products', 'sameFlag'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionRetrieveData',
        method: 'POST',
        desc: '选品任务详情重新抓取数据',
        path: '/taskSelection/retrieveData',
        mockPath: '',
        mock: false,
        showSuccess: true,
        must: ['sellerId', 'siteId', 'taskId', 'parentAsins'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionListBuybox',
        method: 'POST',
        desc: '选品任务详情buybox列表',
        path: '/taskSelection/listBuybox',
        mockPath: '',
        mock: false,
        //showSuccess: true,
        must: ['sellerId', 'siteId', 'taskId', 'parentAsin'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionListSmallBsr',
        method: 'POST',
        desc: '选品任务详情小类列表',
        path: '/taskSelection/listSmallBsr',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must: ['sellerId', 'siteId', 'taskId', 'parentAsin'],
        pcommonarams: {
        }
    },
    {
        name: 'taskSelectionListReview',
        method: 'POST',
        desc: '选品任务详情新增评价数列表',
        path: '/taskSelection/listReview',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must: ['taskId', 'parentAsin', 'period', 'startTime', 'endTime'],
        pcommonarams: {
        }
    },
    {
        name: 'taskReviewerAnalysisSave',
        method: 'POST',
        desc: '添加任务',
        path: '/taskReviewerAnalysis/save',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must: ['platformId', 'sellerId', 'siteId', 'taskName', 'dataType', 'dataSource'],
        pcommonarams: {
        }
    },
    {
        name: 'taskReviewerAnalysisReCrawl',
        method: 'POST',
        desc: '重新抓取',
        path: '/taskReviewerAnalysis/reCrawl',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must: ['taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'taskReviewerAnalysisList',
        method: 'POST',
        desc: '列表',
        path: '/taskReviewerAnalysis/list',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must: ['siteId', 'sellerId', 'platformId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskReviewerAnalysisRemove',
        method: 'POST',
        desc: '删除',
        path: '/taskReviewerAnalysis/remove',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must: ['taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'taskReviewerAnalysisDetails',
        method: 'POST',
        desc: '任务详情(搜索条件需加上统计搜索)',
        path: '/taskReviewerAnalysis/details',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must: ['taskId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskReviewerAnalysisStatList',
        method: 'POST',
        desc: '数据分析-统计展示',
        path: '/taskReviewerAnalysis/statList',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must: ['taskId'],
        pcommonarams: {
        }
    },
]