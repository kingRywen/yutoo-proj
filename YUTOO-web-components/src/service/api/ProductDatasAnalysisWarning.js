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

]