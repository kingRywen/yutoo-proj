export default [
    {
        name: 'taskClassifyList',
        method: 'POST',
        desc: '分类-列表',
        path: 'taskClassify/list',
        // mock: true,
        // showSuccess: true,
        params: {}
    },

    {
        name: 'taskClassifySave',
        method: 'POST',
        desc: '分类-添加',
        path: 'taskClassify/save',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskClassifyFindParent',
        method: 'POST',
        desc: '分类-编辑回显',
        path: 'taskClassify/findParent',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskClassifyUpdate',
        method: 'POST',
        desc: '分类-编辑',
        path: 'taskClassify/update',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentUpdateClassifyId',
        method: 'POST',
        desc: '评价内容抓取-移动到其他分类',
        path: 'taskReviewContent/updateClassifyId',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentProductUpdateClassifyId',
        method: 'POST',
        desc: '商品库-移动到其他分类',
        path: 'taskReviewContentProduct/updateClassifyId',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskClassifyRemove',
        method: 'POST',
        desc: '分类-删除',
        path: 'taskClassify/remove',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentList',
        method: 'POST',
        desc: '评价内容抓取-列表',
        path: 'taskReviewContent/list',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentSave',
        method: 'POST',
        desc: '评价内容抓取-添加',
        path: 'taskReviewContent/save',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentRemove',
        method: 'POST',
        desc: '评价内容抓取-删除',
        path: 'taskReviewContent/remove',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentReCrawl',
        method: 'POST',
        desc: '评价内容抓取-重新抓取',
        path: 'taskReviewContent/reCrawl',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentUpdate',
        method: 'POST',
        desc: '评价内容抓取-编辑',
        path: 'taskReviewContent/update',
        // mock: true,
        showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentDetails',
        method: 'POST',
        desc: '评价内容抓取-任务详情',
        path: 'taskReviewContent/details',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentListBsrCategory',
        method: 'POST',
        desc: '评价内容抓取-类目列表',
        path: 'taskReviewContent/listBsrCategory',
        // mock: true,
        // showSuccess: true,
        params: {}
    },


    {
        name: 'taskReviewContentProductSave',
        method: 'POST',
        desc: '评价内容抓取-添加到产品分类',
        path: 'taskReviewContentProduct/save',
        // mock: true,
        showSuccess: true,
        params: {}
    },

    {
        name: 'taskReviewContentProductList',
        method: 'POST',
        desc: '商品库-列表',
        path: 'taskReviewContentProduct/list',
        // mock: true,
        // showSuccess: true,
        params: {}
    },

    {
        name: 'taskReviewContentProductListProductReviewDetail',
        method: 'POST',
        desc: '评价库-列表',
        path: 'taskReviewContentProduct/listProductReviewDetail',
        // mock: true,
        // showSuccess: true,
        params: {}
    },
    {
        name: 'taskReviewContentProductRemove',
        method: 'POST',
        desc: '产品库-删除',
        path: 'taskReviewContentProduct/remove',
        // mock: true,
        // showSuccess: true,
        params: {}
    },

]