// import HeaderAsideLayout from 'Layouts/HeaderAsideLayout';
const HeaderAsideLayout =  () => import('Layouts/HeaderAsideLayout')
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
        path: '/AdAuthorizationSuccess',
        component: () => import('Views/AdAuthorizationSuccess'),
        name: "AdAuthorizationSuccess",
        meta: {
            title: "广告授权成功"
        }
    },
    {
        path: '/EmailAuthorizationHelp',
        component: () => import('Views/EmailAuthorizationHelp'),
        name: "EmailAuthorizationHelp",
        meta: {
            title: "邮件授权帮助"
        }
    },
	{
	    path: '/shopsMonitor',
	    component: HeaderAsideLayout,
	    meta: {
	        isChild: true
	    },
	    children: [
	        {
	            path: 'theWarningMessage',
	            component: () => import('@/views/shopsMonitor/theWarningMessage/index'),
	            name: 'theWarningMessage',
	            meta: {
	                title: "预警消息",
	            },
	        },			
			{
			    path: 'messageAwaitingReply',
			    component: () => import('@/views/shopsMonitor/messageAwaitingReply/index'),
			    name: 'messageAwaitingReply',
			    meta: {
			        title: "客户消息",
			    },
			},
	    ]
	},
	{
	    path: '/toSell',
	    component: HeaderAsideLayout,
	    meta: {
	        isChild: true
	    },
	    children: [
	        {
	            path: 'dataCapture',
	            component: () => import('@/views/toSell/dataCapture/index'),
	            name: 'dataCapture',
	            meta: {
	                title: "数据抓取",
	            },
				children:[
					{
						path: 'dataCaptureDetail',
						component: () => import('@/views/toSell/dataCapture/detail/index.vue'),
						name: 'dataCaptureDetail',
						meta: {
							title: "详情",
						},
					},
				]
	        },
			{
			    path: 'targetMarketCheck',
			    component: () => import('@/views/toSell/targetMarketCheck/index.vue'),
			    name: 'targetMarketCheck',
			    meta: {
			        title: "目标市场校验",
			    },
			},
	    ]
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
                },
                children:[
                    {
                        path: 'createNewAds',
                        component: () => import('Views/SuDemo/createAd/index.vue'),
                        name: "keyLexiconKeyCreateNewAds",
                        meta: {
                            title: "创建广告"
                        },
                    }
                ]
            },
            {
                path: 'KeywordsCompetitionAnalysis',
                component: () => import('Views/KeyLexicon/KeywordsCompetitionAnalysis/index'),
                name: "KeywordsCompetitionAnalysis",
                meta: {
                    title: "关键词竞争分析"
                },
                children:[
                    {
                        path: 'datails',
                        component: () => import('Views/KeyLexicon/KeywordsCompetitionAnalysis/datails'),
                        name: "KeywordsCompetitionAnalysisDatails",
                        meta: {
                            title: "关键词竞争分析详情",
                            showMetaProp: 'name'
                        },
                    }
                ]
            }
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
        path: '/toSell',
        component: HeaderAsideLayout,
        children: [
            {
                path: 'ToSellLibrary',
                component: () => import('Views/toSell/ToSellLibrary/index'),
                name: "ToSellLibrary",
                meta: {
                    title: "跟卖库"
                }
            },
            
        ]
    },
    {
        path: '/toSell',
        component: HeaderAsideLayout,
        children: [
            {
                path: 'FreightTemplateManagement',
                component: () => import('Views/toSell/FreightTemplateManagement/index'),
                name: "FreightTemplateManagement",
                meta: {
                    title: "运费模板管理"
                }
            },
            
        ]
    },
    {
        path: '/toSell',
        component: HeaderAsideLayout,
        children: [
            {
                path: 'ExchangeRateIsSet',
                component: () => import('Views/toSell/ExchangeRateIsSet/index'),
                name: "ExchangeRateIsSet",
                meta: {
                    title: "汇率设置"
                }
            },
            
        ]
    },
    {
        path: '/homeBadReviewMonitoring',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/homeBadReviewMonitoring/index'),
                name: "homeBadReviewMonitoring",
                meta: {
                    title: "首页差评监控"
                }
            },
            
        ]
    },
    {
        path: '/DailyOrderFluctuation',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/DailyOrderFluctuation/index'),
                name: "DailyOrderFluctuation",
                meta: {
                    title: "日订单波动",
                    showMetaProp: 'name'
                }
            },
            
        ]
    },
    {
        path: '/BeFollowedToSellMonitoring',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/BeFollowedToSellMonitoring/index'),
                name: "BeFollowedToSellMonitoring",
                meta: {
                    title: "被跟卖监控",
                    //showMetaProp: 'name'
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
    {
        path: '/RankingResearch',
        component: HeaderAsideLayout,
        children: [
            {
                path: '',
                component: () => import('Views/RankingResearch/parentIndex'),
                name: "rankingResearchIndex",
                meta: {
                    title: "自然搜索排名研究"
                },
                children: [
                    {
                        path: 'tabs',
                        component: () => import('Views/RankingResearch/tabs'),
                        name: "rankingResearchTabs",
                        meta: {
                            title: "自然搜索排名研究详情"
                        }
                    },
                    {
                        path: 'tab2Datails',
                        component: () => import('Views/RankingResearch/tab2/datails'),
                        name: "rankingResearchtab2Datails",
                        meta: {
                            title: "排名研究详情",
                            showMetaProp: 'name'
                        }
                    }
                ]
            },
            
            
        ]
    },
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
                children: [
                    {
                        path: 'Log',
                        component: () => import('Views/productIntegration/Log/index'),
                        name: "ProductDatasAnalysisWarningLog",
                        meta: {
                            title: "导入日志",
                        }
                    },
                ]
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
                    title: "索赔列表",
                    active: '/AmazonClaims/claimLists'
                },
                
            },
            {
                path: 'claimTemplateSettings',
                component: () => import('Views/AmazonClaims/claimTemplateSettings/index.vue'),
                name: "claimTemplateSettings",
                meta: {
                    title: "索赔模板设置",
                    active: '/AmazonClaims/claimTemplateSettings'
                },
                
            }
        ]
    },
]