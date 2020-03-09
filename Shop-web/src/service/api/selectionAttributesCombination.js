export default[
    //选品属性组合
    {
        name: 'taskSelAttrListTask',
        method: 'POST',
        desc: '选品属性组合任务列表',
        path: '/taskSelAttr/listTask',
        mockPath: '',
       mock:false,
        must:['pageNumber','pageSize','platformId','sellerId','siteId','cateId'],
        pcommonarams: {
        }
    },
    {
        name: 'LtaskSelAttrBatchRemove',
        method: 'POST',
        desc: '选品属性组合任务列表删除任务',
        path: '/taskSelAttr/batchRemove',
        mockPath: '',
       mock:false,
        showSuccess:true,
        must:['platformId','sellerId','siteId','taskIds'],
        pcommonarams: {
        }
    },
    {
        name: 'LtaskSelAttrreCrawl',
        method: 'POST',
        desc: '选品属性组合任务列表重新抓取任务',
        path: '/taskSelAttr/reCrawl',
        mockPath: '',
       mock:false,
        showSuccess:true,
        // must:['platformId','sellerId','siteId','taskIds'],
        pcommonarams: {
        }
    },
    
    {
        name: 'selAttrProductListSameProduct',
        method: 'POST',
        desc: '选品属性组合同款列表',
        path: '/selAttrProduct/listSameProduct',
        mockPath: '',
       mock:false,
        showSuccess:true,
         must:['platformId','sellerId','siteId','cateId','cateFlag','pageSize','pageNumber'],
        pcommonarams: {
        }
    },

    {
        name: 'taskSelAttrListsameProductAttr',
        method: 'POST',
        desc: '选品属性组合同款分析-爆款衰款数量占比',
        path: '/taskSelAttr/listsameProductAttr',
        mockPath: '',
       mock:false,
        //showSuccess:true,
        must:['platformId','sellerId','siteId','cateId','cateFlag','parentAsin'],
        pcommonarams: {
        }
    },

    {
        name: 'taskSelAttrlistBsrInterval',
        method: 'POST',
        desc: '选品属性组合同款分析-BSR区间比',
        path: '/taskSelAttr/listBsrInterval',
        mockPath: '',
       mock:false,
        //showSuccess:true,
        must:['platformId','sellerId','siteId','cateId','cateFlag','parentAsin'],
        pcommonarams: {
        }
    },

    {
        name: 'taskSelAttrListReviewPopular',
        method: 'POST',
        desc: '选品属性组合同款分析-爆款新增评价数列表',
        path: '/taskSelAttr/listReviewPopular',
        mockPath: '',
       mock:false,
        //showSuccess:true,
        must:['platformId','sellerId','siteId','cateId','cateFlag','parentAsin','startTime','endTime'],
        pcommonarams: {
        }
    },
    {
        name: 'selAttrProductPopularAnalysis',
        method: 'POST',
        desc: '选品属性组合爆款属性分析',
        path: '/selAttrProduct/popularAnalysis',
        mockPath: '',
        mock:false,
        //showSuccess:true,
        must:['platformId','sellerId','siteId','cateId',],
        pcommonarams: {
        }
    },
    {
        name: 'selAttrProductExportPopularAttr',
        method: 'POST',
        desc: '选品属性组合爆款属性分析导出',
        path: '/selAttrProduct/exportPopularAttr',
        mockPath: '',
        mock:false,
        //showSuccess:true,
        config: {
            responseType: "blob"
        },
        must:['platformId','sellerId','siteId','cateId',],
        pcommonarams: {
        }
    },
    {
        name: 'selAttrProductDeclineAnalysis',
        method: 'POST',
        desc: '选品属性组合衰款属性分析',
        path: '/selAttrProduct/declineAnalysis',
        mockPath: '',
       mock:false,
        //showSuccess:true,
        must:['platformId','sellerId','siteId','cateId',],
        pcommonarams: {
        }
    },
    {
        name: 'selAttrProductExportDeclineAttr',
        method: 'POST',
        desc: '选品属性组合衰款属性分析导出',
        path: '/selAttrProduct/exportDeclineAttr',
        mockPath: '',
        mock:false,
        config: {
            responseType: "blob"
        },
        //showSuccess:true,
        must:['platformId','sellerId','siteId','cateId',],
        pcommonarams: {
        }
    },


]