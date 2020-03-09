// 列表
export default [
    {
        name: 'productCategoryGetCategory',
        method: 'POST',
        desc: '产品类目-选择类目',
        path: '/productCategory/getCategory',
        // mock: true,
        config: {
            keep: true,
        },
        params: {
        },
    },
    {
        name: 'TaskCateAnalysisSouqListAmazon',
        method: 'POST',
        desc: '亚马逊类目',
        path: '/taskCategoryAnalysis/list',
        // mockPath: '/taskCateAnalysisSouq/list',
        mock: false,
        // showSuccess: true,
        params: {
        },
    },
    // 添加类目
    {
        name: 'TaskCateAnalysisSouqSaveAmazon',
        method: 'POST',
        desc: '亚马逊类目',
        path: '/taskCategoryAnalysis/save',
        // mockPath: '/taskCateAnalysisSouq/list',
        mock: false,
        showSuccess: true,
        params: {
        }
    },
    // // 编辑类目
    // {
    //     name: 'TaskCateAnalysisSouqUpdate',
    //     method: 'POST',
    //     desc: 'SOUQ类目分析',
    //     path: '/taskCateAnalysisSouq/update',
    //     // mockPath: '/taskCateAnalysisSouq/list',
    //     mock: false,
    //     showSuccess: true,
    //     params: {
    //     }
    // },
    // // 类目分析列表抓取数据
    {
        name: 'TaskCateAnalysisSouqReCrawlAmazon',
        method: 'POST',
        desc: '亚马逊类目',
        path: '/taskCategoryAnalysis/reCrawl',
        // mockPath: '/taskCateAnalysisSouq/list',
        mock: false,
        showSuccess: true,
        params: {
        }
    },
    // // 删除
    {
        name: 'TaskCateAnalysisSouqRemoveAmazon',
        method: 'POST',
        desc: '亚马逊类目',
        path: '/taskCategoryAnalysis/remove',
        // mockPath: '/taskCateAnalysisSouq/list',
        mock: false,
        showSuccess: true,
        params: {
        }
    },
    // // 类目分析详情
    {
        name: 'TaskCateAnalysisSouqDetailsAmazon',
        method: 'POST',
        desc: '亚马逊类目',
        path: '/taskCategoryAnalysis/details',
        // mockPath: '/taskCateAnalysisSouq/list',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
    // // 类目分析加入深度分析
    {
        name: 'TaskCateDepthAnalysisSouqSaveAmazon',
        method: 'POST',
        desc: '亚马逊类目',
        path: '/taskCategoryDepthAnalysis/save',
        // mockPath: '/taskCateAnalysisSouq/list',
        mock: false,
        showSuccess: true,
        params: {
        }
    },
    // // 类目分析详情 新增评价数 echart图
    {
        name: 'TaskCateAnalysisSouqListToNewReviewCnByCateAmazon',
        method: 'POST',
        desc: '亚马逊类目',
        path: '/taskCategoryAnalysis/listToNewReviewCnByCate',
        // mockPath: '/taskCateAnalysisSouq/list',
        mock: false,
        // showSuccess: true,
        params: {
        }
    },
]