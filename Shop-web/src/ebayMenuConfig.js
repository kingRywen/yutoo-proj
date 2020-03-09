// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = []
const ebayAsideMenuConfig = [
  // {
  //   path: '/ebayShopAuthorization',
  //   name: '店铺授权',
  //   icon: 'el-icon-menu',
  // },
  {
    path: '',
    name: '类目分析',
    icon: 'el-icon-menu',
    children: [
      {
        path: '/ebayCategoryAnalysis/ebayCategoryAnalysisItem',
        name: '类目分析'
      },
      {
        path: '/ebayCategoryAnalysis/ebayCategoryDepthAnalysis',
        name: '类目深度分析',
      }
    ]
  },
	{
	  path: '',
	  name: '关键词库',
	  icon: 'el-icon-menu',
	  children: [
	    {
	      path: '/ebayKeywordsLibrary/ebayKeywordMining',
	      name: '关键词挖掘'
	    }
	  ]
	},
	{
	  path: '',
	  name: '排名查询',
	  icon: 'el-icon-menu',
	  children: [{
	        path: '/ebayRankingQuery/ebayNaturalSearchRanking',
	        name: '自然搜索排名'
	      },
	      {
	        path: '/ebayRankingQuery/ebayAdSearchRanking',
	        name: '广告搜索排名'
	      },
	      {
	        path: '/ebayRankingQuery/ebayCategoryRanking',
	        name: '类目排名'
	      },
	      {
	        path: '/ebayRankingQuery/ebayAssociateFlow',
	        name: '关联流量'
	      },
	      {
	        path: '/ebayRankingQuery/ebayAssociatedAdvertising',
	        name: '关联广告'
	      }
	  ]
	},
	{
	  path: '',
	  name: '排名分析',
	  icon: 'el-icon-menu',
	  children:[
	    {
	      path: '/ebayTheRankingAnalysis/ebayNaturalRanking',
	      name: '自然排名频率分析',
	    },
	    {
	      path: '/ebayTheRankingAnalysis/ebayAdPlacement',
	      name: '广告排名频率分析',
	    },
	    {
	      path: '/ebayTheRankingAnalysis/ebayAuctionProductRanking',
	      name: '拍卖产品排名规则',
	    },
		{
		  path: '/ebayTheRankingAnalysis/ebayNaturalSearchRankingStudy',
		  name: '自然搜索排名研究',
		},
	  ]
	},
  {
    path: '',
    name: '订单优化',
    icon: 'el-icon-menu',
    children: [{
        path: '/ebayOrderToOptimize/ebayDealStatistics',
        name: '成交统计'
      }
    ]
  },
  {
    path: '/ebayStorePerformanceMonitoring',
    name: '店铺绩效监控',
    icon: 'el-icon-menu',
  },
  
  
  
  
  
  
]
export {
  headerMenuConfig,
  ebayAsideMenuConfig
}