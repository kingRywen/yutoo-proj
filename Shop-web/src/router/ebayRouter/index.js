const HeaderAsideLayout =  () => import('Layouts/HeaderAsideLayout')
let ebayRouter = [
	// {
	// 	path: '*',
	// 	redirect: '/error/404'
	// },
	// {
	// path: '/',
	// redirect: '/login'
	// },
	// {
	// path: '/login',
	// component: () => import('Views/Login'),
	// name: "login",
	// meta: {
	// 	title: "系统登录"
	// }
	//},
	{
	path: '/dash',
	children: [{
		path: '',
		redirect: '/ebayCategoryAnalysis/ebayCategoryAnalysisItem',
		name: "dash",
		meta: {
			title: "店铺首页"
		}
	}],
	component: HeaderAsideLayout,
	},
	// {
	// path: '/error',
	// component: HeaderAsideLayout,
	// name: "error",
	// children: [{
	// 	path: '404',
	// 	component: () => import('Views/Error/404'),
	// 	meta: {
	// 		title: "404"
	// 	}
	// }, {
	// 	path: 'empty',
	// 	component: () => import('Views/Error/EmptyContent'),
	// 	meta: {
	// 		title: "空页"
	// 	}
	// }, {
	// 	path: 'notpermission',
	// 	component: () => import('Views/Error/NotPermission'),
	// 	meta: {
	// 		title: "无权限"
	// 	}
	// }],

	// },
	{
	path: '',
	children: [{
		path: 'ebayShopAuthorization',
		component: () => import('@/views/ebayViews/shopAuthorization/index'),
		name: "ebayShopAuthorization",
		meta: {
			title: "店铺授权"
		}
	}],
	component: HeaderAsideLayout,
	},
    {
        path: '/ebayCategoryAnalysis',
        component: HeaderAsideLayout,
        meta: {
            isChild: true
        },
        children: [
            {
                path: 'ebayCategoryAnalysisItem',
                component: () => import('@/views/ebayViews/categoryAnalysis/categoryAnalysisItem/index'),
                name: "ebayCategoryAnalysisItem",
                meta: {
                    title: "类目分析",
                },
				children:[
					{
					    path: 'ebayCategoryAnalysisDetail',
					    component: () => import('@/views/ebayViews/categoryAnalysis/categoryAnalysisItem/common/detail.vue'),
					    name: "ebayCategoryAnalysisDetail",
					    meta: {
					        title: "类目分析详情",
					        active: '/ebayCategoryAnalysis/ebayCategoryAnalysisItem'
					    }
					},
				]
            },
            {
                path: 'ebayCategoryDepthAnalysis',
                component: () => import('@/views/ebayViews/categoryAnalysis/categoryDepthAnalysis/index'),
                name: 'ebayCategoryDepthAnalysis',
                meta: {
                    title: "类目深度分析",
                },
				children:[
					{
					    path: 'ebayCategoryDepthAnalysisDetail',
					    component: () => import('@/views/ebayViews/categoryAnalysis/categoryDepthAnalysis/common/detail/index.vue'),
					    name: "ebayCategoryDepthAnalysisDetail",
					    meta: {
					        title: "类目深度分析详情",
					        active: '/ebayCategoryAnalysis/ebayCategoryDepthAnalysis'
					    }
					},
				]
            },
			
        ]
    },
    {
        path: '/ebayKeywordsLibrary',
        component: HeaderAsideLayout,
        meta: {
            isChild: true
        },
        children: [
            {
                path: 'ebayKeywordMining',
                component: () => import('@/views/ebayViews/keywordsLibrary/keywordMining/index'),
                name: 'ebayKeywordMining',
                meta: {
                    title: "关键词挖掘",
                },
            }
        ]
    },
	{
	    path: '/ebayRankingQuery',
	    component: HeaderAsideLayout,
	    meta: {
	        isChild: true
	    },
	    children: [
	        {
	            path: 'ebayNaturalSearchRanking',
	            component: () => import('@/views/ebayViews/rankingQuery/naturalSearchRanking/index'),
	            name: 'ebayNaturalSearchRanking',
	            meta: {
	                title: "自然搜索排名",
	            },
	        },
			{
			    path: 'ebayAdSearchRanking',
			    component: () => import('@/views/ebayViews/rankingQuery/adSearchRanking/index'),
			    name: 'ebayAdSearchRanking',
			    meta: {
			        title: "广告搜索排名",
			    },
			},
			{
			    path: 'ebayCategoryRanking',
			    component: () => import('@/views/ebayViews/rankingQuery/categoryRanking/index'),
			    name: 'ebayCategoryRanking',
			    meta: {
			        title: "类目排名",
			    },
			},
			{
			    path: 'ebayAssociateFlow',
			    component: () => import('@/views/ebayViews/rankingQuery/associateFlow/index'),
			    name: 'ebayAssociateFlow',
			    meta: {
			        title: "关联流量",
			    },
			},
			{
			    path: 'ebayAssociatedAdvertising',
			    component: () => import('@/views/ebayViews/rankingQuery/associatedAdvertising/index'),
			    name: 'ebayAssociatedAdvertising',
			    meta: {
			        title: "关联广告",
			    },
			},
	    ]
	},
    {
        path: '/ebayTheRankingAnalysis',
        component: HeaderAsideLayout,
        meta: {
            isChild: true
        },
        children: [
            {
                path: 'ebayNaturalRanking',
                component: () => import('@/views/ebayViews/theRankingAnalysis/naturalAndAdRanking/index'),
                name: 'ebayNaturalRanking',
                meta: {
                    title: "自然排名频率分析",
				},
				children:[
					{
						path: 'rankingChangeProductNum',
						component: () => import('@/views/ebayViews/theRankingAnalysis/naturalAndAdRanking/rankingChangeProductNum'),
						name: 'rankingChangeProductNum',
						meta: {
							title: "排名有变化产品数",
							showMetaProp: 'name'
						},
						children:[
							{
								path: 'lookDatails',
								component: () => import('@/views/ebayViews/theRankingAnalysis/naturalAndAdRanking/lookDatails'),
								name: 'rankingChangeProductNumlookDatails',
								meta: {
									title: "查看详情",
									//showMetaProp: 'name'
								},
							}
						]
					}
				]
            }, 
    		{
    		    path: 'ebayAdPlacement',
    		    component: () => import('@/views/ebayViews/theRankingAnalysis/naturalAndAdRanking/index'),
    		    name: 'ebayAdPlacement',
    		    meta: {
    		        title: "广告排名频率分析",
				},
				children:[
					{
						path: 'rankingChangeProductNum',
						component: () => import('@/views/ebayViews/theRankingAnalysis/naturalAndAdRanking/rankingChangeProductNum'),
						name: 'rankingChangeProductNum',
						meta: {
							title: "排名有变化产品数",
							showMetaProp: 'name'
						},
						children:[
							{
								path: 'lookDatails',
								component: () => import('@/views/ebayViews/theRankingAnalysis/naturalAndAdRanking/lookDatails'),
								name: 'rankingChangeProductNumlookDatails',
								meta: {
									title: "查看详情",
									//showMetaProp: 'name'
								},
							}
						]
					}
				]
    		}, 
    		{
    		    path: 'ebayAuctionProductRanking',
    		    component: () => import('@/views/ebayViews/theRankingAnalysis/auctionProductRanking/index'),
    		    name: 'ebayAuctionProductRanking',
    		    meta: {
    		        title: "拍卖产品排名规则",
    		    },
				children:[
					{
					    path: 'ebayAuctionProductDetail',
					    component: () => import('@/views/ebayViews/theRankingAnalysis/auctionProductRanking/common/detail.vue'),
					    name: "ebayAuctionProductDetail",
					    meta: {
					        title: "拍卖产品详情",
					        active: '/ebayTheRankingAnalysis/ebayAuctionProductRanking'
					    }
					},
				]
    		}, 
    		{
    		    path: 'ebayNaturalSearchRankingStudy',
    		    component: () => import('@/views/ebayViews/theRankingAnalysis/naturalSearchRanking/index'),
    		    name: 'ebayNaturalSearchRankingStudy',
    		    meta: {
    		        title: "自然搜索排名研究",
    		    },
				children:[
					{
					    path: 'ebayNaturalSearchDetail',
					    component: () => import('@/views/ebayViews/theRankingAnalysis/naturalSearchRanking/common/detail.vue'),
					    name: "ebayNaturalSearchDetail",
					    meta: {
					        title: "自然搜索详情",
					        active: '/ebayTheRankingAnalysis/ebayNaturalSearchRankingStudy'
					    }
					},
				]
    		},
			
			
    		
			
        ]
    },
	{
	    path: '/ebayOrderToOptimize',
	    component: HeaderAsideLayout,
	    meta: {
	        isChild: true
	    },
	    children: [
	        {
	            path: 'ebayDealStatistics',
	            component: () => import('@/views/ebayViews/ebayDealStatistics/index'),
	            name: 'ebayDealStatistics',
	            meta: {
	                title: "成交统计",
				},
				children:[
					{
						path: 'datails',
						component: () => import('@/views/ebayViews/ebayDealStatistics/datails/index'),
						name: 'ebayDealStatisticsDatails',
						meta: {
							title: "任务详情",
							showMetaProp: 'name'
						},
					}
				]
	        }
	    ]
	},
	{
	    path: '',
	    children: [{
	        path: 'ebayStorePerformanceMonitoring',
	        component: () => import('@/views/ebayViews/storePerformanceMonitoring/index'),
	        name: "ebayStorePerformanceMonitoring",
	        meta: {
	            title: "店铺绩效监控"
	        }
	    }],
	    component: HeaderAsideLayout,
	},
	
]




export default ebayRouter
