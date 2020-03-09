export default[

    //日订单波动
    {
        name: 'homeOrderRangeList',
        method: 'POST',
        desc: '日订单波动-列表',
        path: '/home/order/range/list',
        mockPath: '',
        mock:false,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'HomeOrderReangeExport',
        method: 'POST',
        desc: '日订单波动-列表导出',
        path: '/home/order/range/export',
        mockPath: '',
        config:{
            responseType:"blob"
        },
        mock:false,
        // showSuccess: true,
        params: {
        }
    },

    //被跟卖监控
    {
        name: 'homeOsProductList',
        method: 'POST',
        desc: '出现非自己店铺跟卖-列表',
        path: '/home/os/product/list',
        mockPath: '',
        mock:false,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'homeOsProductExport',
        method: 'POST',
        desc: '出现非自己店铺跟卖-列表导出',
        path: '/home/os/product/export',
        mockPath: '',
        mock:false,
        config:{
            responseType:"blob"
        },
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'homeOsSellerList',
        method: 'POST',
        desc: '出现非自己店铺跟卖-卖家列表',
        path: '/home/os/seller/list',
        mockPath: '',
        mock:false,
        // showSuccess: true,
        params: {
        }
    },
    {
        name: 'homeOsSellingList',
        method: 'POST',
        desc: '出现非自己店铺跟卖-查看跟卖',
        path: '/home/os/selling/list',
        mockPath: '',
        mock:false,
        // showSuccess: true,
        params: {
        }
    },

]