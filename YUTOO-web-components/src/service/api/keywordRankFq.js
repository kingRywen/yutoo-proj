const prefix = 'keywordRankFq'
// 排名频率分析
export default [
    {
        name: 'productAlertType',
        method: 'POST',
        desc: '商品库-问题类型',
        path: 'product/alertType',
        // mock: true,
        // mockPath: `${prefix}/list`,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'keywordRankFqList',
        method: 'POST',
        desc: '列表',
        path: `${prefix}/list`,
        // mock: true,
        // mockPath: `${prefix}/list`,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'productManualUpdateStatus',
        method: 'POST',
        desc: '商品库-手动更新',
        path: 'product/manualUpdateStatus',
        // mock: true,
        // mockPath: `${prefix}/list`,
        noShowDefaultError: true,
        params: {
        }
    },
    {
        name: 'productManualUpdate',
        method: 'POST',
        desc: '商品库-手动更新',
        path: 'product/manualUpdate',
        // mock: true,
        // mockPath: `${prefix}/list`,
        noShowDefaultError: true,
        params: {
        }
    },
    {
        name: 'keywordRankFqSave',
        method: 'POST',
        desc: '添加任务',
        path: `${prefix}/save`,
        // mockPath: null,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'keywordRankFqReCrawl',
        method: 'POST',
        desc: '重新抓取',
        path: `${prefix}/reCrawl`,
        showSuccess: true,
        params: {
        }
    },
    {
        name: 'keywordRankFqRemove',
        method: 'POST',
        desc: '删除任务',
        path: `${prefix}/remove`,
        showSuccess: true,
        params: {
        }
    },
    {
        name: 'keywordRankFqRemoveMonitor',
        method: 'POST',
        desc: '取消监控',
        path: `${prefix}/removeMonitor`,
        showSuccess: true,
        params: {
        }
    },
    {
        name: 'keywordRankFqAddMonitor',
        method: 'POST',
        desc: '添加监控',
        path: `${prefix}/addMonitor`,
        showSuccess: true,
        params: {
        }
    },

    {
        name: 'keywordRankFqUpdateMonitor',
        method: 'POST',
        desc: '修改监控',
        path: `${prefix}/updateMonitor`,
        showSuccess: true,
        params: {
        }
    },
    {
        name: 'keywordRankFqRtRecList',
        method: 'POST',
        desc: '历史排名',
        path: `keywordRankFqRtRec/list`,
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'keywordRankFqRtProductList',
        method: 'POST',
        desc: '排名有变化的产品列表',
        path: `keywordRankFqRt/productList`,
        // mock: true,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'keywordRankFqRtListForProduct',
        method: 'POST',
        desc: '排名有变化的产品数 ,按抓取频率统计',
        path: `keywordRankFqRt/listForProduct`,
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'keywordRankFqRtListForProductStat',
        method: 'POST',
        desc: '排名有变化的产品数-按周、小时统计',
        path: '/keywordRankFqRt/listForProductStat',
        mock: false,
        // showSuccess: true,
        params: {}
    }


]