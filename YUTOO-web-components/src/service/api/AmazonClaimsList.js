export default[
    {
        name: 'taskClaimLostList',
        method: 'POST',
        desc: '亚马逊丢件-列表',
        path: '/taskClaimLost/list',
        mockPath: '',
        mock: false,
        // showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['sellerId','siteId','platformId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimLostExportData',
        method: 'POST',
        desc: '亚马逊丢件-列表导出',
        path: '/taskClaimLost/exportData',
        mockPath: '',
        mock: false,
        showSuccess:true,
        config: {
            responseType: "blob"
        },
        must:['sellerId','siteId','platformId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimDamageList',
        method: 'POST',
        desc: '亚马逊损坏库存-列表',
        path: '/taskClaimDamage/list',
        mockPath: '',
        mock: false,
        // showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['sellerId','siteId','platformId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimDamageExportData',
        method: 'POST',
        desc: '亚马逊损坏库存-列表导出',
        path: '/taskClaimDamage/exportData',
        mockPath: '',
        mock: false,
        showSuccess:true,
        config: {
            responseType: "blob"
        },
        must:['sellerId','siteId','platformId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimRefundList',
        method: 'POST',
        desc: '客户退款未退回库存，未赔偿-列表',
        path: '/taskClaimRefund/list',
        mockPath: '',
        mock: false,
        // showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['sellerId','siteId','platformId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimRefundExportData',
        method: 'POST',
        desc: '客户退款未退回库存，未赔偿-列表-列表导出',
        path: '/taskClaimRefund/exportData',
        mockPath: '',
        mock: false,
        // showSuccess:true,
        config: {
            responseType: "blob"
        },
        must:['sellerId','siteId','platformId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimCaseList',
        method: 'POST',
        desc: '查看邮件回复详情',
        path: '/taskClaimCase/list',
        mockPath: '',
        mock: false,
        // showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['taskId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimTemplateListTaskTemplate',
        method: 'POST',
        desc: '获取任务模板',
        path: '/taskClaimTemplate/listTaskTemplate',
        mockPath: '',
        mock: false,
        // showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['taskId'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimTemplateSendEmail',
        method: 'POST',
        desc: '发送邮件',
        path: '/taskClaimTemplate/sendEmail',
        mockPath: '',
        mock: false,
        showSuccess:true,
        // config: {
        //     responseType: "blob"
        // },
        must:['taskId','templateType','contactReason','sendContent'],
        pcommonarams: {
        }
    },
    {
        name: 'taskClaimRefundOrderDetails',
        method: 'POST',
        desc: '客户退款未退回库存，未赔偿-订单详情',
        path: '/taskClaimRefund/orderDetails',
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