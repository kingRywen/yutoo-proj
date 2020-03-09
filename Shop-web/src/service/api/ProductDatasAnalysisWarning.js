export default [
    //产品预警
    {
        name: 'pdWarnConfigList',
        method: 'POST',
        desc: '预警内容选择器下拉',
        path: '/pdWarnConfig/list',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtList',
        method: 'POST',
        desc: '产品预警table列表',
        path: '/pdWarnRt/list',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnConfigSave',
        method: 'POST',
        desc: '预警提示设置修改',
        path: '/pdWarnConfig/save',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtExport',
        method: 'POST',
        desc: '导出',
        path: '/pdWarnRt/export',
        mockPath: '',
        config: {
            responseType: "blob"
        },
        mock: false,
        pcommonarams: {
        }
    },
    //历史数据
    {
        name: 'pdWarnRtDayGetChildrenAsin',
        method: 'POST',
        desc: '查询子父产品',
        path: '/pdWarnRtDay/getChildrenAsin',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtDayHistoryStat',
        method: 'POST',
        desc: '查询数据',
        path: '/pdWarnRtDay/historyStat',
        mockPath: '',
       mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtSaveIgnoreAsin',
        method: 'POST',
        desc: '产品数据与预警-添加无效ASIN',
        path: '/pdWarnRt/saveIgnoreAsin',
        mockPath: '',
         mock: false,
        showSuccess:true,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtRemoveIgnoreAsin',
        method: 'POST',
        desc: '产品数据与预警-删除无效ASIN',
        path: '/pdWarnRt/removeIgnoreAsin',
        mockPath: '',
         mock: false,
        showSuccess:true,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtRecount',
        method: 'POST',
        desc: '产品数据与预警-重新统计',
        path: '/pdWarnRt/recount',
        mockPath: '',
         mock: false,
        showSuccess:true,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtSaveGoalStarCnt',
        method: 'POST',
        desc: '产品数据与预警-设置父产品评分',
        path: '/pdWarnRt/saveGoalStarCnt',
        mockPath: '',
        showSuccess:true,
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtListByWarnParent',
        method: 'POST',
        desc: '产品数据与预警-问题父产品列表',
        path: '/pdWarnRt/listByWarnParent',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtListByWarn',
        method: 'POST',
        desc: '产品数据与预警-问题子产品列表',
        path: '/pdWarnRt/listByWarn',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtListByWarnstar',
        method: 'POST',
        desc: '产品数据与预警-评分问题列表',
        path: '/pdWarnRt/listByWarnstar',
        mockPath: '',
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtListByWarnParentExportr',
        method: 'POST',
        desc: '产品数据与预警-问题父产品列表导出',
        path: '/pdWarnRt/listByWarnParentExport',
        mockPath: '',
        config:{
            responseType:'blob'
        },
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtListByWarnExport',
        method: 'POST',
        desc: '产品数据与预警-问题子产品列表导出',
        path: '/pdWarnRt/listByWarnExport',
        mockPath: '',
         mock: false,
        config:{
            responseType:'blob'
        },
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtListByWarnstarExport',
        method: 'POST',
        desc: '产品数据与预警-评分问题列表导出',
        path: '/pdWarnRt/listByWarnstarExport',
        mockPath: '',
        config:{
            responseType:'blob'
        },
         mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtRefundRateWarnListExport',
        method: 'POST',
        desc: '产品数据与预警-退货率异常列表导出',
        path: '/pdWarnRt/refundRateWarnListExport',
        mockPath: '',
        config:{
            responseType:'blob'
        },
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtRefundRateWarnList',
        method: 'POST',
        desc: '产品数据与预警-退货率异常列表',
        path: '/pdWarnRt/refundRateWarnList',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'pdWarnRtDayHistoryStatTime',
        method: 'POST',
        desc: '历史数据时间区间',
        path: '/pdWarnRtDay/historyStatTime',
        mockPath: '',
       mock: false,
        pcommonarams: {
        }
    },

]