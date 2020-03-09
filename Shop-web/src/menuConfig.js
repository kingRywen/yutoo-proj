// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = []
const asideMenuConfig = [
  {
    path: '',
    name: '类目管理',
    icon: 'el-icon-menu iconleimuguanli iconfont1 ',
    children: [
      {
        path: '/cate/CateSetup',
        name: '平台类目'
      },
      {
        path: '/propertySettings',
        name: '类目同款属性设置',
      },
			{
				path:'/cate/BrandManage',
				name:'品牌管理'
      },
      {
				path:'/cate/ShopCate',
				name:'店铺类目'
			}
    ]
  },
  {
    path: '',
    name: '关键词库',
    icon: 'el-icon-menu iconfont1 iconguanjianciku',
    children: [{
        path: '/keyLexicon/keyLength',
        name: '关键词长度配置',
      },

      {
        path: '/keyLexicon/typeSupervise',
        name: '关键词库配置'
      },
      {
        path: '/keyLexicon/key',
        name: '关键词库'
      },
      {
        path: '/keywordExcavate',
        name: '关键词挖掘',
      },
      {
        path: '/keyLexicon/KeywordsCompetitionAnalysis',
        name: '关键词竞争分析',
      },
    ]
  },
  {
    path: '',
    name: '产品库',
    icon: 'el-icon-menu iconfont1 iconchanpinku',
    children: [
      {
        path: '/ProductLibrary',
        name: '产品库'
      },
      {
        path: '/product/ProductCheck',
        name: '关键词校验'
      },
      {
        path: '/productIntegration',
        name: '产品完整信息整合',
      }
    ]
  },
  {
    path: '',
    name: '产品监控',
    icon: 'el-icon-menu iconfont1 iconchanpinjiankong',
    children: [
      {
        path: '/skuEarlyWarning',
        name: 'SKU监控预警'
      },
      {
        path: '/badReviewSeo',
        name: '差评监控优化',
      },
      {
        path: '/FlowWarning',
        name: '流量预警',
      },
      {
        path: '/ProductDatasAnalysisWarning',
        name: '产品数据与预警',
      },
      {
        path: '/homeBadReviewMonitoring',
        name: '首页差评监控',
      },

      {
        path:'/BeFollowedToSellMonitoring',
        name:'被跟卖监控'
      }
    ]
  },
  {
    path: '',
    name: '排名与流量查询',
    icon: 'el-icon-menu iconfont1 iconpaimingyuliuliangchaxun',
    children: [{
          path: '/rankQuery/NaturalSearch',
          name: '自然搜索排名'
        },
        {
          path: '/rankQuery/AdvSearch',
          name: '广告搜索排名'
        },
        {
          path: '/rankQuery/CateSearch',
          name: '类目排名'
        },
        {
          path: '/rankQuery/AssAdv',
          name: '关联广告'
        },
        {
          path: '/rankQuery/AssFlow',
          name: '关联流量'
        },
        {
          path: '/taskRelateSource',
          name: '分析关联源',
        }
    ]
  },
  {
    path: '',
    name: '排名分析',
    icon: 'el-icon-menu iconfont1 iconpaimingfenxi',
    children: [
      {
        path: '/ranking/ad',
        name: '广告排名频率分析'
      },
      {
        path: '/ranking/normal',
        name: '自然排名频率分析'
      },
      {
        path: '/RankingResearch',
        name: '自然搜索排名研究',
      },
    ]
  },
  {
    path: '',
    name: '订单优化',
    icon: 'el-icon-menu iconfont1 iconpaimingyouhua',
    children:[
      {
        path: '/OTS',
        name: '订单目标设置',
      },
      {
        path: '/POP',
        name: '产品价格优化',
      },
      {
        path: '/TS',
        name: '成交统计',
      },
      {
        path: '/POPManual',
        name: '产品手动价格优化',
      },
      
      {
        path: '/DailyOrderFluctuation',
        name: '日订单波动',
      },
    ]
  },
  {
    path: '',
    name: '财务',
    icon: 'el-icon-menu iconfont1 iconcaiwu1',
    children:[
      {
          path: '/AmazonClaims/claimLists',
          name: '索赔列表'
      },
      {
        path: '/AmazonClaims/claimTemplateSettings',
        name: '索赔模板设置'
      },
      {
        path: '/SFM',
        name: '店铺财务统计',
      },
      {
        path: '/ProDetails',
        name: '产品成本费用管理',
      },
    ]
  },
  {
    path: '/ADManagement',
    name: '广告管理',
    icon: 'el-icon-menu iconfont1 iconguanggaoguanli',
    children: [
      {
        path: '/CompetitiveOptimizations',
        name: '广告优化'
      },
      
      {
        path: '/CompetitiveAnalysis',
        name: '广告竞争度分析'
      },
	  //这是原来的
      // {
      //   path: '/DataAnalysis',
      //   name: '广告数据分析'
      // },
	  //新的
	  {
		 path:'/newAdDataAnalysis',
		 name:'广告数据分析'
	  },
	  {
		  path:'/customerSearch',
		  name:'客户搜索词'
	  },
   //    {
   //      path: '/manual',
   //      name: '广告手动优化'
	  // },
	  {
	    path: '/newManual',
	    name: '商品推广手动优化'
	  },
	  {
		 path:'/adProductAbnormal',
		 name:'广告异常'
	  },
	  {
	  	path:'/keywordAnalysis',
	  	name:'关键词分析'
	  },
	  {
	  	path:'/adTargetingSource',
	  	name:'广告定位源'
	  },
	  {
	  	path:'/ADTS',
	  	name:'广告成交统计'
	  },
	  {
	    path: '/newBrandManual',
	    name: '品牌推广手动优化'
	  },			  
    ]
  },
  {
    path: '',
    name: '评价分析',
    icon: 'el-icon-menu iconfont1 iconpingjiafenxi',
    children: [
      {
        path: '/evaluatorAnalysis',
        name: '评价者分析',
      },
     {
        path: '/evaluate',
        name: '评价内容分析',
      },
    
    ]
  },
  {
    path: '/Amazon',
    name: '类目分析',
    icon: 'el-icon-menu iconfont1 iconAMAZONleimufenxi',
    children: [{
      path: '/CateAnalysis',
      name: '类目分析'
    },
    {
      path: '/AmazonCateDepthAnalysis',
      name: '类目深度分析'
    }
    ]
  },
  {
    path: '/storeAnalysis',
    name: '店铺分析',
    icon: 'el-icon-menu iconfont1 icondianpufenxi',
    children: [
      {
        path: '/index',
        name: '店铺分析'
      },
      {
        path: '/storeDeepAnalysis',
        name: '店铺深度分析'
      }
    ]
  },
  {
    path: '/selection',
    name: '产品分析',
    icon: 'el-icon-menu iconfont1 iconchanpinfenxi',
    children: [
      {
        path: '/ProductAttr',
        name: '选品属性组合'
      },
      {
        path: '/index',
        name: '同款分析'
      },
      {
        path: '/trendAnalyses',
        name: '趋势分析'
      },
      {
        path: '/partFour',
        name: '产品深度分析'
      },
      {
        path: '/kpProduct',
        name: '产品历史趋势分析'
      }
    ]
  },
  {
    path: '/shopsMonitor',
    name: '店铺监控',
    icon: 'el-icon-menu iconfont1 icondianpufenxi',
    children: [
      {
        path: '/theWarningMessage',
        name: '预警消息'
      },	  
	  {
	    path: '/messageAwaitingReply',
	    name: '客户消息'
	  },
    ]
  },
  {
    path: '/toSell',
    name: '跟卖',
    icon: 'el-icon-menu iconfont1 iconchanpinjiankong',
    children: [
      {
        path: '/dataCapture',
        name: '数据抓取'
      },
	  {
		  path:'/targetMarketCheck',
		  name:'目标市场校验'
	  },
    {
      path: '/ToSellLibrary',
      name: '跟卖库'
    },
    {
      path: '/FreightTemplateManagement',
      name: '运费模板管理'
    },
    {
      path: '/ExchangeRateIsSet',
      name: '汇率设置'
    },
    ]
  },
]

export {
  headerMenuConfig,
  asideMenuConfig
}