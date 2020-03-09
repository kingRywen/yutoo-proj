import HeaderAsideLayout from 'Layouts/HeaderAsideLayout';

export const routerMap =[
    {
        path: '/test',
        component: () => import('Views/demo'),
        name: "test",
        meta: {
            title: "测试"
        }
    },
    {
        path: '/keyLexicon',
        component: HeaderAsideLayout,
        meta: {
            isChild: true
        },
        children: [
            {
                path: 'keyLength',
                component: () => import('Views/KeyLexicon/key-length'),
                name: "keyLength",
                meta: {
                    title: "关键词长度配置"
                }
            },
            {
                path: 'typeSupervise',
                component: () => import('Views/KeyLexicon/TypeSupervise/index'),
                name: "typeSupervise",
                meta: {
                    title: "关键词库配置"
                }
            },
            {
                path: 'key',
                component: () => import('Views/KeyLexicon/KeyLexicon/index'),
                name: "keyLexiconKey",
                meta: {
                    title: "关键词库"
                }
            },
        ]
    },
    {
        path: '/ranking',
        component: HeaderAsideLayout,
        meta: {
            isChild: true
        },
        children: [
            {
                path: 'ad',
                component: () => import('Views/Ranking/ad'),
                name: "ad",
                meta: {
                    title: "广告排名频率分析"
                },
                children:[{
                    path: 'chart',
                    component: () => import('Views/Ranking/chart'),
                    name: "adChart",
                    meta: {
                        title: "查看分析"
                    }
                }]
            },
            {
                path: 'normal',
                component: () => import('Views/Ranking/normal'),
                name: "normal",
                meta: {
                    title: "自然排名频率分析"
                },
                children:[{
                    path: 'chart',
                    component: () => import('Views/Ranking/chart'),
                    name: "normalChart",
                    meta: {
                        title: "查看分析"
                    }
                }]
            },
            // {
            //     path: 'chart',
            //     component: () => import('Views/Ranking/chart'),
            //     name: "chart",
            //     meta: {
            //         title: "查看分析"
            //     }
            // },
            {
                path: 'chartDetails',
                component: () => import('Views/Ranking/ChartDetails'),
                name: "chartDetails",
                meta: {
                    title: "分析详情"
                }
            }
        ]
    },
    {
        path: '/badReviewSeo',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/BadReviewSeo/index'),
                name: "badReviewSeoIndex",
                meta: {
                    title: "差评监控优化"
                },
                children:[{
                    path: 'details',
                    component: () => import('Views/BadReviewSeo/details'),
                    name: "badReviewSeoDetails",
                    meta: {
                        title: "评价详情"
                    }
                }]
            },
            
            
        ]
    },
    {
        path: '/skuEarlyWarning',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/SkuEarlyWarning/index'),
                name: "skuEarlyWarningIndex",
                meta: {
                    title: "SKU监控预警"
                }
            },
            
        ]
    },
    {
        path: '/evaluate',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/Evaluate/index'),
                name: "evaluateIndex",
                meta: {
                    title: "评价内容分析"
                }
            },
            // {
            //     path: 'detail/index',
            //     component: () => import('Views/Evaluate/detail/index'),
            //     name: "details",
            //     meta: {
            //         title: "评价内容抓取详情"
            //     }
            // },
            // {
            //     path: 'detail/library',
            //     component: () => import('Views/Evaluate/detail/library'),
            //     name: "library",
            //     meta: {
            //         title: "评价内容抓取详情"
            //     }
            // },
            
        ]
    },
    // {
    //     path: '/RankingResearch',
    //     component: HeaderAsideLayout,
    //     children: [
    //         {
    //             path: '',
    //             component: () => import('Views/RankingResearch/parentIndex'),
    //             name: "rankingResearchIndex",
    //             meta: {
    //                 title: "自然搜索排名研究"
    //             },
    //             children: [
    //                 {
    //                     path: 'tabs',
    //                     component: () => import('Views/RankingResearch/tabs'),
    //                     name: "rankingResearchTabs",
    //                     meta: {
    //                         title: "自然搜索排名研究详情"
    //                     }
    //                 },
    //                 {
    //                     path: 'tab2Datails',
    //                     component: () => import('Views/RankingResearch/tab2/datails'),
    //                     name: "rankingResearchtab2Datails",
    //                     meta: {
    //                         title: "排名研究详情"
    //                     }
    //                 }
    //             ]
    //         },
            
            
    //     ]
    // },
    {
        path: '/FlowWarning',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/FlowWarning/index'),
                name: "FlowWarningIndex",
                meta: {
                    title: "流量预警"
                }
            },
            
        ]
    },
    {
        path: '/taskRelateSource',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/RelateSource/index'),
                name: "taskRelateSourceIndex",
                meta: {
                    title: "分析关联源"
                },
                children: [{
                    path: 'details',
                    component: () => import('Views/RelateSource/Details'),
                    name: "taskRelateSourceDetails",
                    meta: {
                        title: "任务名称",
                        showMetaProp: 'name'
                    },
                    children:[{
                        path: 'relateList',
                        component: () => import('Views/RelateSource/RelateList'),
                        name: "RelateSourceRelateList",
                        meta: {
                            title: "分析关联"
                        }
                    }]
                }]
            },
            
            
            
        ]
    },
    {
        path: '/ProductDatasAnalysisWarning',
        component: HeaderAsideLayout,
        children: [
            {
                path: '/',
                component: () => import('Views/ProductDatasAnalysisWarning'),
                name: "ProductDatasAnalysisWarning",
                meta: {
                    title: "产品数据与预警",
                },
                
            }
        ]
    },
    {
        path: '/storeAnalysis',
        component: HeaderAsideLayout,
        children: [
            {
                path: 'index',
                component: () => import('Views/storeAnalysis/storeAnalysis/index.vue'),
                name: "storeAnalysis",
                meta: {
                    title: "店铺分析",
                },
                children: [
                    {
                        path: 'datails',
                        component: () => import('Views/storeAnalysis/storeAnalysis/datails/index.vue'),
                        name: "storeAnalysisDatails",
                        meta: {
                            title: "店铺分析详情",
                            showMetaProp: 'name'
                        },
                    }
                ]
            },
            {
                path: 'storeDeepAnalysis',
                component: () => import('Views/storeAnalysis/storeDeepAnalysis/index.vue'),
                name: "storeDeepAnalysis",
                meta: {
                    title: "店铺深度分析",
                },
                children:[
                    {
                        path: 'datails',
                        component: () => import('Views/storeAnalysis/storeDeepAnalysis/datails/index.vue'),
                        name: "storeDeepAnalysisDatails",
                        meta: {
                            title: "店铺深度分析详情",
                            showMetaProp: 'name'
                        },
                    }
                ]
            },
            

        ]
    },
    {
        path: '/AmazonClaims',
        component: HeaderAsideLayout,
        children: [
            {
                path: 'claimLists',
                component: () => import('Views/AmazonClaims/claimLists/index.vue'),
                name: "claimLists",
                meta: {
                    title: "索赔列表"
                }
            },
            {
                path: 'claimTemplateSettings',
                component: () => import('Views/AmazonClaims/claimTemplateSettings/index.vue'),
                name: "claimTemplateSettings",
                meta: {
                    title: "索赔模板设置",
                },
            }
        ]
    },
]