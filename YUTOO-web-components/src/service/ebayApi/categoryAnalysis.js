export default [
    //类目分析
    {
        name: 'ebProductCategoryGetCategory',
        method: 'POST',
        desc: '产品类目-选择类目',
        path: '/ebProductCategory/getCategory',
        mock: true,
        // showSuccess: true,
        params: {},
        must:['platformId','siteId','parentPcid']
    },
]