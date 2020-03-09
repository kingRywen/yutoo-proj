// 类目属性设置api
export default [
    // 侧边栏列表
    {
        name: 'taskSelAttrListCategory',
        method: 'POST',
        desc: '侧边栏列表',
        path: 'taskSelAttr/listCategory',
        mockPath: '',
        mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 可移入的类目列表
    {
        name: 'taskSelAttrListCategoryMoved',
        method: 'POST',
        desc: '可移入的类目列表',
        path: 'taskSelAttr/listCategoryMoved',
        mockPath: '',
        //  mock: false,
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 侧边栏添加类目任务
    {
        name: 'taskSelAttrSaveCategory',
        method: 'POST',
        desc: '侧边栏列表',
        path: 'taskSelAttr/saveCategory',
        mockPath: '',
         mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 侧边栏添加类目任务
    {
        name: 'selAttrProductManualHandle',
        method: 'POST',
        desc: '设为同款/独立产品',
        path: 'selAttrProduct/manualHandle',
        mockPath: '',
         mock: false,
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 侧边栏 每一项的第一个按钮  添加自定义子集类目
    {
        name: 'selAttrCategorySave',
        method: 'POST',
        desc: '侧边栏列表',
        path: 'selAttrCategory/save',
        mockPath: '',
         mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 侧边栏 第二个删除类目（批量或单个）
    {
        name: 'taskSelAttrBatchRemoveCategory',
        method: 'POST',
        desc: '侧边栏列表',
        path: 'taskSelAttr/batchRemoveCategory',
        mockPath: '',
         mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 侧边栏 第三个查看设置产品属性(mock接口在类目属性设置那里)
    // {
    //     name: 'sameAttrConfigDetailList',
    //     method: 'POST',
    //     desc: '侧边栏列表',
    //     path: 'sameAttrConfigDetail/list',
    //     mockPath: '',
    //      mock: false,
    //     must: ['sellerId', 'siteId'],
    //     showSuccess: false,
    //     pcommonarams: {
    //     }
    // },
    // 侧边栏 第四个添加类目任务）
    {
        name: 'taskSelAttrSave',
        method: 'POST',
        desc: '侧边栏添加任务',
        path: 'taskSelAttr/save',
        mockPath: '',
         mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 添加产品属性
    {
        name: 'selAttrProductSaveProductAttr',
        method: 'POST',
        desc: '添加产品属性',
        path: 'selAttrProduct/saveProductAttr',
        mockPath: '',
         mock: false,
        showSuccess: true,
        
        pcommonarams: {
        }
    },
    //产品列表下载导入产品属性模板
    {
        name: 'selAttrProductExportData',
        method: 'POST',
        desc: '产品列表下载导入产品属性模板',
        path: 'selAttrProduct/exportData',
        mockPath: '',
         mock: false,
        must: ['sellerId', 'siteId'],
        config: {
            responseType: 'blob'
        },
        showSuccess: false,
        pcommonarams: {
        }
    },
    //列表上传
    {
        name: 'selAttrProductImportData',
        method: 'POST',
        desc: '列表上传',
        path: 'selAttrProduct/importData',
        mockPath: '',
         mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 产品属性列表
    {
        name: 'selAttrProductListProductAttr',
        method: 'POST',
        desc: '产品属性列表',
        path: 'selAttrProduct/listProductAttr',
        mockPath: '',
         mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 产品列表
    {
        name: 'selAttrProductList',
        method: 'POST',
        desc: '产品列表',
        path: 'selAttrProduct/list',
        mockPath: '',
         mock: false,
        // must: ['sellerId', 'siteId'],
        showSuccess: false,
        pcommonarams: {
        }
    },
    // 移入到指定类目/自定义类目
    {
        name: 'selAttrProductMoveCategory',
        method: 'POST',
        desc: '移入到指定类目/自定义类目',
        path: 'selAttrProduct/moveCategory',
        mockPath: '',
         mock: false,
        // must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 产品列表导出数据
    {
        name: 'selAttrProductExportProductData',
        method: 'POST',
        desc: '产品列表导出数据',
        path: 'selAttrProduct/exportProductData',
        mockPath: '',
         mock: false,
        config: {
            responseType: "blob"
        },
        // must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
    // 产品列表删除
    {
        name: 'taskSelAttrBatchRemoveProduct',
        method: 'POST',
        desc: '产品属性列表',
        path: 'taskSelAttr/batchRemoveProduct',
        mockPath: '',
         mock: false,
        must: ['sellerId', 'siteId'],
        showSuccess: true,
        pcommonarams: {
        }
    },
]