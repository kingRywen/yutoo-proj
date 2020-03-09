// import Vue from 'vue'
// import Router from 'vue-router'
// import { routerBeforeEachFunc } from 'Config/interceptors/router';
const HeaderAsideLayout = () => import('Layouts/HeaderAsideLayout')
import spRouter from './spRouter';
import {
	routerMap
} from './routerMap';

// Vue.use(Router)
let shopRoutes = [{
		path: '*',
		redirect: '/error/404'
	},
	{
		path: '/demo',
		component: () => import('Views/demo')
	},
	{
		path: '/dash',
		children: [{
			path: '',
			component: () => import('Views/Dash'),
			name: "dash",
			meta: {
				title: "店铺首页"
			}
		}],
		component: HeaderAsideLayout,
	},
	{
		path: '/cate',
		component: HeaderAsideLayout,
		meta: {
			isChild: true
		},
		children: [{
				path: 'CateSetup',
				component: () => import('Views/CateSetup/CateSetup'),
				name: "CateSetup",
				meta: {
					title: "平台类目",
				},
			},
			{
				path: 'BrandManage',
				component: () => import('Views/CateSetup/BrandManage/index'),
				name: 'BrandManage',
				meta: {
					title: "品牌管理",
				},
			},
			{
				path: 'ShopCate',
				component: () => import('Views/CateSetup/ShopCate'),
				name: 'ShopCate',
				meta: {
					title: "店铺类目",
				},
			}
		]
	},
	{
		path: '/shopAuthorization',
		children: [{
			path: '',
			component: () => import('Views/shopAuthorization/shopAuthorization'),
			name: "shopAuthorization",
			meta: {
				title: "店铺授权"
			}
		}],
		component: HeaderAsideLayout,
	},
	{
		path: '/product',
		component: HeaderAsideLayout,
		meta: {
			isChild: true
		},
		children: [{
				path: 'ProductCheck',
				component: () => import('Views/Product/Check/ProductCheck'),
				name: "ProductCheck",
				meta: {
					title: "关键词校验"
				},
				children: [{
					path: 'ProductCheckDetail',
					component: () => import('Views/Product/Check/productCheckDetail/index'),
					name: "ProductCheckDetail",
					meta: {
						title: "关键词校验查看",
						active: '/product/ProductCheck',
						showMetaProp: 'asinName'
					}
				}]
			},
		]
	},
	
	{
		path: '/keywordExcavate',
		children: [{
			path: '',
			component: () => import('Views/KeywordExcavate/KeywordExcavate'),
			name: "KeywordExcavate",
			meta: {
				title: "关键词挖掘"
			},
			children: [{
				path: '/KeywordExcavate/KeywordExcavateDetail',
				component: () => import('Views/KeywordExcavate/KeywordExcavateDetail'),
				name: "KeywordExcavateDetail",
				meta: {
					title: "关键词挖掘查看",
					active: '/keywordExcavate',
					showMetaProp: 'taskName'
				}
			}]
		}],
		component: HeaderAsideLayout,
	},
	{
		path: '/TS',
		// name: "成交统计",
		children: [{
			path: '',
			component: () => import('Views/Ts'),
			name: "Svr",
			meta: {
				title: "成交统计"
			},
			children: [{
				path: 'datails',
				component: () => import('Views/Ts/datails'),
				name: "TSdatails",
				meta: {
					title: "详情",
					showMetaProp: 'name'
				},
			}]
		}, ],
		component: HeaderAsideLayout,
	},
	{
		path: '/ProDetails',
		component: HeaderAsideLayout,
		children: [{
			path: '',
			component: () => import('Views/productIntegration/ProDetails/index'),
			name: "SFMProDetails",
			meta: {
				title: "商品费用明细-产品列表",
			}
		}]

	},
	{
		path: '/SFM',
		// name: "店铺财务统计",
		children: [{
			path: '',
			component: () => import('Views/ShopFinancialManagement'),
			name: "SFM",
			meta: {
				title: "店铺财务统计",
			},
			children: [{
					path: 'Log',
					component: () => import('Views/productIntegration/Log/index'),
					name: "SFMLog",
					meta: {
						title: "导入日志",
					}
				},

				{
					path: 'details',
					component: () => import('Views/ShopFinancialManagement/details'),
					name: "details",
					meta: {
						title: "店铺财务费用收支详情",
						active: '/SFM'
					}
				},
				{
					path: 'pdetails',
					component: () => import('Views/ShopFinancialManagement/pdetails'),
					name: "pdetails",
					meta: {
						title: "店铺财务问题详情",
						active: '/SFM',
						showMetaProp: 'name'
					}
				},
				{
					path: 'pdetails1',
					component: () => import('Views/ShopFinancialManagement/pdetails1'),
					name: "pdetails1",
					meta: {
						title: "店铺财务问题详情",
						active: '/SFM',
						showMetaProp: 'name'
					}
				},
				{
					path: 'pdetails2',
					component: () => import('Views/ShopFinancialManagement/pdetails2'),
					name: "pdetails2",
					meta: {
						title: "问题类型详情",
						active: '/SFM'
					}
				},
				{
					path: 'pdetails3',
					component: () => import('Views/ShopFinancialManagement/pdetails3'),
					name: "pdetails3",
					meta: {
						title: "问题类型详情",
						active: '/SFM'
					}
				}
			]
		}],
		component: HeaderAsideLayout,
	},
	{
		path: '/OTS',
		children: [{
			path: '',
			component: () => import('Views/OTS'),
			name: "OTS",
			meta: {
				title: "订单目标设置"
			}
		}],
		component: HeaderAsideLayout,
	},
	{
		path: '/POP',
		children: [{
			path: '',
			component: () => import('Views/POP'),
			name: "POP",
			meta: {
				title: "产品价格优化"
			}
		}],
		component: HeaderAsideLayout,
	},
	{
		path: '/POPManual',
		children: [{
			path: '',
			component: () => import('Views/POP/Manual'),
			name: "POPManual",
			meta: {
				title: "产品手动价格优化"
			}
		}],
		component: HeaderAsideLayout,
	},
	{
		path: '/rankQuery',
		component: HeaderAsideLayout,
		meta: {
			isChild: true
		},
		children: [{
				path: 'NaturalSearch',
				component: () => import('Views/RankQuery/SearchNatu/NaturalSearch'),
				name: "NaturalSearch",
				meta: {
					title: "自然搜索排名"
				}
			},
			{
				path: 'AdvSearch',
				component: () => import('Views/RankQuery/SearchAdv/AdvSearch'),
				name: "AdvSearch",
				meta: {
					title: "广告搜索排名"
				}
			},
			{
				path: 'CateSearch',
				component: () => import('Views/RankQuery/SearchCate/CateSearch'),
				name: "CateSearch",
				meta: {
					title: "类目排名"
				}
			},
			{
				path: 'AssAdv',
				component: () => import('Views/RankQuery/AssAdv/AssAdv'),
				name: "AssAdv",
				meta: {
					title: "关联广告"
				}
			},
			{
				path: 'AssFlow',
				component: () => import('Views/RankQuery/AssFlow/AssFlow'),
				name: "AssFlow",
				meta: {
					title: "关联流量"
				}
			}
		]
	},
	{
		path: '/SOUQ',
		component: HeaderAsideLayout,
		meta: {
			isChild: true
		},
		children: [{
				path: 'CateAnalysis',
				component: () => import('Views/SouqCateAnalysis'),
				name: "CateAnalysis",
				meta: {
					title: "类目分析"
				},
				children: [{
					path: 'CateAnalysisDetail',
					component: () => import('Views/SouqCateAnalysis/CateAnalysisDetail'),
					name: "CateAnalysisDetail",
					meta: {
						title: "类目分析查看",
						active: '/SOUQ/CateAnalysis'
					}
				}]

				// children: [{
				//     path: 'CateAnalysisDetail',
				//     component: () => import('Views/SouqCateAnalysis/CateAnalysisDetail'),
				//     name: "CateAnalysisDetail",
				//     meta: {
				//         title: "类目分析查看"
				//     }
				// }]
			},

			{
				path: 'SouqCateDepthAnalysis',
				component: () => import('Views/SouqCateDepthAnalysis'),
				name: "SouqCateDepthAnalysis",
				meta: {
					title: "类目深度分析"
				},
				children: [{
					path: 'DepthDetails',
					component: () => import('Views/SouqCateDepthAnalysis/DepthDetails'),
					name: "SouqDepthDetails",
					meta: {
						title: "类目深度分析查看",
						active: '/SOUQ/SouqCateDepthAnalysis',
						showMetaProp: "category"
					}
				}]
			},

		]
	},
	{
		path: '/Amazon',
		component: HeaderAsideLayout,
		meta: {
			isChild: true
		},
		children: [{
				path: 'CateAnalysis',
				component: () => import('Views/AmazonCateAnalysis'),
				name: "CateAnalysis",
				meta: {
					title: "类目分析"
				},
				children: [{
					path: 'CateAnalysisDetail',
					component: () => import('Views/AmazonCateAnalysis/CateAnalysisDetail'),
					name: "AmazonCateAnalysisDetail",
					meta: {
						title: "类目分析查看",
						active: '/Amazon/CateAnalysis',
						showMetaProp: 'category'
					}
				}]
			},

			{
				path: 'AmazonCateDepthAnalysis',
				component: () => import('Views/AmazonCateDepthAnalysis'),
				name: "AmazonCateDepthAnalysis",
				meta: {
					title: "类目深度分析",
					active: '/Amazon/AmazonCateDepthAnalysis'
				},
				children: [{
					path: 'DepthDetails',
					component: () => import('Views/AmazonCateDepthAnalysis/DepthDetails'),
					name: "AmazonDepthDetails",
					meta: {
						title: "类目深度分析查看",
						active: '/Amazon/AmazonCateDepthAnalysis'
					}
				}]
			},

		]
	},
	{
		path: '/ADManagement',
		component: HeaderAsideLayout,
		meta: {
			isChild: true
		},
		children: [{
				path: 'CompetitiveOptimizations',
				component: () => import('Views/AD_Management/CompetitiveOptimizations'),
				name: "CompetitiveOptimizations",
				meta: {
					title: "广告优化"
				}
			},
			
			{
			    path: 'adTargetingSource',
			    component: () => import('Views/AD_Management/adTargetingSource/index.vue'),
			    name: 'adTargetingSource',
			    meta: {
			        title: "广告定位源",
			    },
				children:[
					{
						path: 'adTargetingSourceDetail',
						component: () => import('Views/AD_Management/adTargetingSource/detail/index.vue'),
						name: 'adTargetingSourceDetail',
						meta: {
							title: "详情",
						},
					},
				]
			},
			
			
			{

				path: 'adProductAbnormal',
				//component: () => import('Views/shopsMonitor/allQuestionFile/adProductAbnormal/index.vue'),
				component: () => import('Views/AdVertisingSpendingIsTooHigh/tab'),
				name: "adProductAbnormal",
				meta: {
					title: "广告异常"
				}
			},
			{

				path: 'manual',
				component: () => import('Views/AD_Management/Manual/Index'),
				name: "CompetitiveOptimizationsManual",
				meta: {
					title: "广告手动优化"
				}
			},
			{
				path: 'customerSearch',
				component: () => import('Views/AD_Management/customerSearch/index'),
				name: "customerSearch",
				meta: {
					title: "客户搜索词"
				}
			},
			{
				path: 'CompetitiveAnalysis',
				component: () => import('Views/AD_Management/CompetitiveAnalysis'),
				name: "CompetitiveAnalysis",
				meta: {
					title: "广告竞争度分析"
				},
				children: [{
					path: 'CA_details',
					component: () => import('Views/AD_Management/CA-details'),
					name: "ADManagementCA_details",
					meta: {
						title: "广告竞争度详情",
						active: '/ADManagement/CompetitiveAnalysis'
					}
				}]
			},
			{
				path: 'keywordAnalysis',
				component: () => import('Views/AD_Management/keywordAnalysis/index'),
				name: "keywordAnalysis",
				meta: {
					title: "关键词分析"
				},
				children: [{
					path: 'keywordAnalysisDetail',
					component: () => import('Views/AD_Management/keywordAnalysis/detail/index'),
					name: "keywordAnalysisDetail",
					meta: {
						title: "关键词分析详情",
						active: '/ADManagement/keywordAnalysisDetail'
					}
				}]
			},

			// {
			//     path: 'DataAnalysis',
			//     component: () => import('Views/AD_Management/DataAnalysis'),
			//     name: "DataAnalysis",
			//     meta: {
			//         title: "广告数据分析"
			//     },
			//     children: [{
			//         path: 'DA_details',
			//         component: () => import('Views/AD_Management/DA-details'),
			//         name: "DA_details",
			//         meta: {
			//             title: "广告数据详情",
			//             active: '/ADManagement/DataAnalysis'
			//         }
			//     }]
			// },
			{
				path: 'newAdDataAnalysis',
				component: () => import('Views/AD_Management/newAdDataAnalysis/Index/index.vue'),
				name: "otherNewAd",
				meta: {
					title: "广告数据分析"
				},
			},
			{
				path: 'newAdDataAnalysis',
				component: () => import('Views/AD_Management/newAdDataAnalysis/Index/index.vue'),
				name: "newAdDataAnalysis",
				meta: {
					title: "广告数据分析"
				},
				children: [{
					path: 'newGroup',
					component: () => import('Views/AD_Management/newAdDataAnalysis/Index/index.vue'),
					name: "newAdDataAnalysisGroup",
					meta: {
						title: "广告组",
						showMetaProp: 'name',
					},
					children: [{
						path: 'newKeyword',
						component: () => import('Views/AD_Management/newAdDataAnalysis/Index/index.vue'),
						name: "newAdDataAnalysisKeyword",
						meta: {
							title: "关键词",
						}
					}]
				}]
			},
			
			//商品推广手动优化
			{
				path:'newManual',
				component: ()=> import('Views/SuDemo/manual/index.vue'),
				name:'newManual',
				meta:{
					title:'商品推广手动优化',
					showMetaProp: 'seriesName',
				},
				children: [
					
					{
						path: 'newAdGroup',
						component: ()=> import('Views/SuDemo/manual/index.vue'),
						name: "newAdGroup",
						meta: {
							title: "广告组",
							showMetaProp: 'name',
						},					
						children: [
							
							{
								path: 'newAdKeyword',
								component: ()=> import('Views/SuDemo/manual/index.vue'),
								name: "newAdKeyword",
								meta: {
									title: "关键词",
								}
							},
							{
							    path: 'newAdGroupCreateAd',
							    component: () => import('Views/KeyLexicon/KeyLexicon/pages/createNewAds'),
							    name: "newAdGroupCreateAd",
							    meta: {
							        title: "创建广告组"
							    },
							},
						]
					},
					{
					    path: 'newManualCreateAd',
					    component: () => import('Views/SuDemo/createAd/index.vue'),
					    name: "newManualCreateAd",
					    meta: {
					        title: "创建广告"
					    },
					},
				]
			},
			
			//品牌推广手动优化
			{
				path:'newBrandManual',
				component: ()=> import('Views/SuDemo/brandManual/index.vue'),
				name:'newBrandManual',
				meta:{
					title:'品牌推广手动优化',
					showMetaProp: 'seriesName',
				},
				children: [
					{
						path: 'newBrandAdKeyword',
						component: ()=> import('Views/SuDemo/brandManual/index.vue'),
						name: "newBrandAdKeyword",
						meta: {
							title: "关键词",
						}
					},
					{
					    path: 'newBrandManualCreateAd',
					    component: () => import('Views/KeyLexicon/KeyLexicon/pages/createNewAds'),
					    name: "newBrandManualCreateAd",
					    meta: {
					        title: "创建广告"
					    },
					},
				]
			},
			
			{
				path: 'ADTS',
				component: () => import('Views/AD_Management/ADTS/index'),
				name: "ADTS",
				meta: {
					title: "广告成交统计",
					// showMetaProp: 'seriesName',
				},
			},
			{
				path: 'manual',
				component: () => import('Views/AD_Management/Manual/Index'),
				name: "DataAnalysisManual",
				meta: {
					title: "广告手动优化",
					showMetaProp: 'seriesName',
				},
				// prop: true,
				children: [{
					path: 'group',
					component: () => import('Views/AD_Management/Manual/Index'),
					name: "DataAnalysisManualGroup",
					meta: {
						title: "广告组",
						showMetaProp: 'name',
						// active: '/ADManagement/DataAnalysis'
					},
					children: [{
						path: 'keyword',
						component: () => import('Views/AD_Management/Manual/Index'),
						name: "DataAnalysisManualKeyword",
						meta: {
							title: "关键词",
							// active: '/ADManagement/DataAnalysis'
						}
					}]
				}]
			},
			{
				path: '/Log',
				component: () => import('Views/productIntegration/Log/index'),
				name: "AdLog",
				meta: {
					title: "导入日志",
				}
			},
		]
	},

	{
		path: '/propertySettings',
		component: HeaderAsideLayout,
		children: [{
			path: '',
			component: () => import('Views/propertySettings/List/Index'),
			name: "propertySettings",
			meta: {
				title: "分类管理",
			},
			children: [{
				path: "details",
				component: () => import("Views/propertySettings/Details/Index"),
				name: "propertySettingsDetails",
				meta: {
					title: "类目属性管理"
				}
			}, ]
		}]
	},
	{
		path: '/productIntegration',
		component: HeaderAsideLayout,
		children: [{
			path: '/',
			component: () => import('Views/productIntegration/FirstPage/Index'),
			name: "productIntegration",
			meta: {
				title: "产品完整信息整合",
			},
			children: [{
					path: '/Log',
					component: () => import('Views/productIntegration/Log/index'),
					name: "Log",
					meta: {
						title: "导入日志",
					}
				},
				{
					path: '/ProDetails',
					component: () => import('Views/productIntegration/ProDetails/index'),
					name: "ProDetails",
					meta: {
						title: "商品费用明细-产品列表",
					}
				},
				{
					path: '/Prolist',
					component: () => import('Views/productIntegration/ProList/index'),
					name: "Prolist",
					meta: {
						title: "产品费用明细",
						active: '/productIntegration',
						showMetaProp: 'name'
					}
				},
				{
					path: 'ProlistDetails',
					component: () => import('Views/productIntegration/ProList/ProlistDetails'),
					name: "ProlistDetails",
					meta: {
						title: "问题类型详情",
						active: '/productIntegration',
						showMetaProp: 'name'
					}
				}
			]
		}]
	},
	// {
	//     path: '/productIntegration',
	//     component: HeaderAsideLayout,
	//     children: [
	//         {
	//             path: '/',
	//             component: () => import('Views/productIntegration/FirstPage/Index'),
	//             name: "productIntegration",
	//             meta: {
	//                 title: "产品完整信息整合",
	//             },
	//             // children: [
	//             //     {
	//             //         path: "details",
	//             //         conponent: () => import("Views/propertySettings/Details/Index"),
	//             //         name: "detailsSetings",
	//             //         meta: {
	//             //             title: "类目属性管理"
	//             //         }
	//             //     },
	//             // ]
	//         }
	//     ]
	// },
	...spRouter
]

routerMap.forEach(element => {
	shopRoutes.push(element)
});



// const router = new Router({
//     linkActiveClass: 'active',
//     routes,
// })

//router.beforeEach(routerBeforeEachFunc)

export default shopRoutes
