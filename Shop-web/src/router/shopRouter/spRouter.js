const HeaderAsideLayout =  () => import('Layouts/HeaderAsideLayout')
import storage from 'Utils/saver';

export default [
    {
        path: '/evaluatorAnalysis',
        children: [{
            path: '',
            component: () => import('Views/EvaluatorAnalysis'),
            name: "evaluatorAnalysis",
            meta: {
                title: "评价者分析"
            },
            children: [
                {
                    path: 'details',
                    component: () => import('Views/EvaluatorAnalysis/Detail.vue'),
                    name: "evaluatorAnalysisDatails",
                    
                    meta: {
                        getParams(query) {
                            let { name, taskId } = query
                            return { name, taskId }
                        },
                        title: "详情",
                        showMetaProp: 'name'
                        // active: '/product/ProductCheck'
                    },
                    children: [
                        {
                            path: 'dataDetails',
                            component: () => import('Views/EvaluatorAnalysis/DataDetails.vue'),
                            name: "evaluatorAnalysisDataDetails",
                            meta: {
                                title: "数据分析",
                                showMetaProp: 'title',
                                getParams() {
                                    // let { name, taskId } = query
                                    console.log(storage.get('session', 'dataDetails_routerParams'));
                                    return storage.get('session', 'dataDetails_routerParams')
                                },
                            },
                            children: [
                                {
                                    path: 'info',
                                    component: () => import('Views/EvaluatorAnalysis/Detail.vue'),
                                    name: "evaluatorAnalysisDataDetailsInfo",
                                    meta: {
                                        title: "评价者区间",
                                        showMetaProp: 'tit',
                                        
                                    },
                                    

                                }
                            ]
                        }
                    ]
                }
            ]
        }],
        component: HeaderAsideLayout,
    },
	{
	    path: '/ProductLibrary',
	    component: HeaderAsideLayout,
	    children: [
	        {
	            path: '/',
	            component: () => import('Views/Product/Check/ProductLibrary'),
	            name: "ProductLibrary",
	            meta: {
	                title: "产品库",
	            },
	            children: [
	                {
	                    path: 'Log123',
	                    component: () => import('Views/productIntegration/Log/index'),
	                    name: "ProLog123",
	                    meta: {
	                        title: "导入日志",
	                    }
	                },
	            ]
	        }
	    ]
	},
    {
        path: '/selection',
        component: HeaderAsideLayout,
        meta: {
            isChild: true
        },
        children: [
            {
                path: 'ProductAttr',
                component: () => import('Views/ProductAttr/FirstPage/Index'),
                name: "ProductAttr",
                meta: {
                    title: "选品属性组合"
                }
            },
            {
                path: 'index',
                component: () => import('Views/Selection/Selection/Index'),
                name: "selection",
                meta: {
                    title: "同款分析"
                },
                children: [
                    {
                        path: 'selectionDatails',
                        component: () => import('Views/Selection/Selection/selectionDatails/index.vue'),
                        name: "selectionDatails",
                        meta: {
                            title: "任务名称",
                            showMetaProp: 'name'
                            // active: '/product/ProductCheck'
                        }
                    },
                ]
            },
            {
                path: 'trendAnalyses',
                component: () => import('Views/Selection/TrendAnalyses/Index'),
                name: "trendAnalyses",
                meta: {
                    title: "趋势分析"
                },
                children: [
                    {
                        path: 'productDatails',
                        component: () => import('Views/Selection/TrendAnalyses/productTrendAnalysis/datails.vue'),
                        name: "trendAnalysesProductDatails",
                        meta: {
                            title: "产品趋势分析详情",
                            showMetaProp: 'name'
                            // active: '/product/ProductCheck'
                        }
                    },
                    {
                        path: 'storetDatails',
                        component: () => import('Views/Selection/TrendAnalyses/storeTrendAnalysis/datails.vue'),
                        name: "trendAnalysesStoretDatails",
                        meta: {
                            title: "店铺趋势分析详情",
                            showMetaProp: 'name'
                            // active: '/product/ProductCheck'
                        }
                    },
                ]
            },
            {
                path: 'partFour',
                component: () => import('Views/Selection/PartFour/Index'),
                name: "partFour",
                meta: {
                    title: "产品深度分析"
                },
                children: [
                    {
                        path: 'detail',
                        component: () => import('Views/Selection/PartFour/Detail'),
                        name: "partFourDetail",
                        meta: {
                            title: "竞品分析详情",
                            showMetaProp: 'name'
                            // active: '/product/ProductCheck'
                        }
                    }
                ]
            },
            {
                path: 'kpProduct',
                component: () => import('Views/Selection/KpProduct/Index'),
                name: "kpProduct",
                meta: {
                    title: "产品历史趋势分析"
                }
            }
        ]
    },
];
