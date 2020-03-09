export default[
    //产品手动价格优化
    {
        name: 'priceSeoManualListProduct',
        method: 'POST',
        desc: '产品列表',
        path: '/priceSeoManual/listProduct',
        mockPath: '',
          mock : false,
        must:['sellerId','siteId','classifyId'],
        pcommonarams: {
        }
    },
    {
        name: 'riceSeoManualtaskReviewContentList',
        method: 'POST',
        desc: '树形结构的列表',
        path: '/taskClassify/list',
        mockPath: '',
           mock : false,
        must:['sellerId','siteId','platformId','classifyType','parentClassifyId',],
        pcommonarams: {
        }
    },
    {
        name: 'riceSeoManualtaskClassifySave',
        method: 'POST',
        desc: '树形结构的分类-添加',
        path: '/taskClassify/save',
        mockPath: '',
           mock : false,
        showSuccess:true,
        must:['sellerId','siteId','platformId','classifyType','parentClassifyId','classifyName'],
        pcommonarams: {
        }
    },
    {
        name: 'riceSeoManualtaskClassifyRemove',
        method: 'POST',
        desc: '树形结构的分类-删除',
        path: '/taskClassify/remove',
        mockPath: '',
           mock : false,
        showSuccess:true,
        must:['classifyIds','classifyType'],
        pcommonarams: {
        }
    },
    {
        name: 'riceSeoManualtaskClassifyUpdate',
        method: 'POST',
        desc: '树形结构的分类-编辑',
        path: '/taskClassify/update',
        mockPath: '',
           mock : false,
        showSuccess:true,
        must:['parentClassifyId','classifyId','classifyName'],
        pcommonarams: {
        }
    },
    {
        name: 'priceSeoManualMoveClassify',
        method: 'POST',
        desc: '移入分组',
        path: '/priceSeoManual/moveClassify',
        mockPath: '',
        mock : false,
        showSuccess:true,
        must:['sellerId','siteId','ids','classifyId'],
        pcommonarams: {
        }
    },
    {
        name: 'priceSeoManualSaveStrategy',
        method: 'POST',
        desc: '添加策略',
        path: '/priceSeoManual/saveStrategy',
        mockPath: '',
           mock : false,
        showSuccess:true,
        must:['sellerId','siteId','ids','list','seoType'],
        pcommonarams: {
        }
    },
    {
        name: 'priceSeoManualUpdateStrategy',
        method: 'POST',
        desc: '编辑策略',
        path: '/priceSeoManual/updateStrategy',
        mockPath: '',
           mock : false,
        showSuccess:true,
        must:['sellerId','siteId','ids','list','seoType'],
        pcommonarams: {
        }
    },
    {
        name: 'priceSeoManualUpdateStrategyStatus',
        method: 'POST',
        desc: '关闭/开启定时调整价格',
        path: '/priceSeoManual/updateStrategyStatus',
        mockPath: '',
           mock : false,
        showSuccess:true,
        must:['sellerId','siteId','ids','pauseFlag'],
        pcommonarams: {
        }
    },
    {
        name: 'priceSeoManualListProductPrice',
        method: 'POST',
        desc: '产品原价列表',
        path: '/priceSeoManual/listProductPrice',
        mockPath: '',
           mock : false,
        //showSuccess:true,
        must:['sellerId','siteId','ids']
        
    },
    {
        name: 'priceSeoManualUpdateProductPrice',
        method: 'POST',
        desc: '编辑产品原价',
        path: '/priceSeoManual/updateProductPrice',
        mockPath: '',
           mock : false,
        showSuccess:true,
        must:['sellerId','siteId','list']
        
    },
    {
        name: 'priceSeoManualStrategyDetail',
        method: 'POST',
        desc: '策略详情',
        path: '/priceSeoManual/strategyDetail',
        mockPath: '',
           mock : false,
        //showSuccess:true,
        must:['sellerId','siteId','productId']
        
    },
]