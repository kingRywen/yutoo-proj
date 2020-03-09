export default [
    //首页差评监控
    {
        name: 'homeBrProductList',
        method: 'POST',
        desc: '首页出现差评-列表',
        path: '/home/br/product/list',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'homeBrProductExport',
        method: 'POST',
        desc: '首页出现差评-列表导出',
        path: '/home/br/product/export',
        mockPath: '',
        mock: false,
        config:{
            responseType:"blob"
        },
        pcommonarams: {
        }
    },
    {
        name: 'homeBrProductReviewList',
        method: 'POST',
        desc: '首页出现差评-查看评价内容',
        path: '/home/br/product/reviewList',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },

    //广告花费占比过高
    {
        name: 'financeListAdPropError',
        method: 'POST',
        desc: '广告花费占比过高-列表展示',
        path: '/finance/listAdPropError',
        mockPath: '',
        mock: false,
        pcommonarams: {
        }
    },
    {
        name: 'financeListAdPropErrorExport',
        method: 'POST',
        desc: '广告花费占比过高-导出',
        path: '/finance/listAdPropErrorExport',
        mockPath: '',
        mock: false,
        config:{
            responseType:"blob"
        },
        pcommonarams: {
        }
    },
]