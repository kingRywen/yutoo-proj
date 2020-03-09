export default[
    //店铺分析
    {
        name: 'taskShopAnalysisList',
        method: 'POST',
        desc: '店铺分析列表',
        path: '/taskShopAnalysis/list',
        mockPath: '',
        mock: false,
        must:['pageNumber','pageSize','platformId','sellerId','siteId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopAnalysisSave',
        method: 'POST',
        desc: '店铺分析添加任务',
        path: '/taskShopAnalysis/save',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['taskName','dataType','platformId','sellerId','siteId','dataSource'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopAnalysisRemove',
        method: 'POST',
        desc: '店铺分析删除任务',
        path: '/taskShopAnalysis/remove',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['sellerId','siteId','taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopAnalysisReCrawl',
        method: 'POST',
        desc: '店铺分析重新执行任务',
        path: '/taskShopAnalysis/reCrawl',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['sellerId','siteId','taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopAnalysisDetails',
        method: 'POST',
        desc: '店铺分析任务详情列表',
        path: '/taskShopAnalysis/details',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must:['pageNumber','pageSize','taskId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopAnalysisListToNewFeedBackBysellerId',
        method: 'POST',
        desc: '店铺分析新增feedback数',
        path: '/taskShopAnalysis/listToNewFeedBackBysellerId',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must:['startTime','endTime','period','sellerId','taskId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopAnalysisListToBsrCategoryByAsin',
        method: 'POST',
        desc: '店铺分析查看店铺产品bsr类目排名',
        path: '/taskShopAnalysis/listToBsrCategoryByAsin',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must:['pageNumber','pageSize','taskId','parentAsin'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopAnalysisExportData',
        method: 'POST',
        desc: '店铺分析-查看店铺分析详情导出',
        path: '/taskShopAnalysis/exportData',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['taskId'],
        pcommonarams: {
        },
        config: {
            responseType: "blob"
        },
    },
    {
        name: 'taskShopDepthAnalysisSave',
        method: 'POST',
        desc: '店铺深度分析-添加任务',
        path: '/taskShopDepthAnalysis/save',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['platformId','sellerId','siteId','monitorSellerIds','monitorFlag','monitorFrom','monitorTo'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisList',
        method: 'POST',
        desc: '店铺深度分析-列表',
        path: '/taskShopDepthAnalysis/list',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must:['pageNumber','pageSize','platformId','sellerId','siteId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisRemove',
        method: 'POST',
        desc: '店铺深度分析-删除',
        path: '/taskShopDepthAnalysis/remove',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisReCrawl',
        method: 'POST',
        desc: '店铺深度分析-重新发送任务',
        path: '/taskShopDepthAnalysis/reCrawl',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisAddMonitor',
        method: 'POST',
        desc: '店铺深度分析-添加监控',
        path: '/taskShopDepthAnalysis/addMonitor',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['taskIds','monitorFrom','monitorTo'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisUpdateMonitor',
        method: 'POST',
        desc: '店铺深度分析-修改监控',
        path: '/taskShopDepthAnalysis/updateMonitor',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['taskIds','monitorFrom','monitorTo'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisRemoveMonitor',
        method: 'POST',
        desc: '店铺深度分析-取消监控',
        path: '/taskShopDepthAnalysis/removeMonitor',
        mockPath: '',
        mock: false,
        showSuccess:true,
        must:['taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisProductDetails',
        method: 'POST',
        desc: '店铺深度分析-产品列表',
        path: '/taskShopDepthAnalysis/productDetails',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        must:['pageNumber','pageSize','taskId',],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisExportData',
        method: 'POST',
        desc: '店铺深度分析-产品列表导出',
        path: '/taskShopDepthAnalysis/exportData',
        mockPath: '',
        mock: false,
        showSuccess:true,
        config: {
            responseType: "blob"
        },
        must:['taskId',],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisSellerCategory',
        method: 'POST',
        desc: '店铺深度分析-店铺类目(下拉选项)',
        path: '/taskShopDepthAnalysis/sellerCategory',
        mockPath: '',
        mock: false,
        // showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['taskId',],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisGetRangeConfig',
        method: 'POST',
        desc: '店铺深度分析-统计区间配置展示',
        path: '/taskShopDepthAnalysis/getRangeConfig',
        mockPath: '',
        mock: false,
        // showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['taskId',],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisSaveRangeConfig',
        method: 'POST',
        desc: '店铺深度分析-统计区间配置保存',
        path: '/taskShopDepthAnalysis/saveRangeConfig',
        mockPath: '',
        mock: false,
        showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['taskId','flag'],
        pcommonarams: {
        }
    },
    {
        name: 'taskShopDepthAnalysisStatList',
        method: 'POST',
        desc: '店铺深度分析-数据分析',
        path: '/taskShopDepthAnalysis/statList',
        mockPath: '',
        mock: false,
        //showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['taskId'],
        pcommonarams: {
        }
    },

]