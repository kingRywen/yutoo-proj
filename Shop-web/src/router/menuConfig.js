// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = []
const asideMenuConfig = [
  {
    path: '/dash',
    name: '店铺首页',
    icon: 'el-icon-menu'
  },
  {
    path: '/shopAuthorization',
    name: '店铺授权',
    icon: 'el-icon-menu',
  },
  {
    path: '',
    name: '类目管理',
    icon: 'el-icon-menu',
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
    icon: 'el-icon-menu',
    children: [{
        path: '/keyLexicon/keyLength',
        name: '关键词长度配置'
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
    ]
  },
  {
    path: '',
    name: '产品库',
    icon: 'el-icon-menu',
    children: [
      {
        path: '/product/ProductLibrary',
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
    icon: 'el-icon-menu',
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
    ]
  },
  {
    path: '',
    name: '排名与流量查询',
    icon: 'el-icon-menu',
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
    icon: 'el-icon-menu',
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
    icon: 'el-icon-menu',
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
        path: '/POP/manual',
        name: '产品手动价格优化',
      },
      {
        path: '/TS',
        name: '成交统计',
      },
    ]
  },
  {
    path: '',
    name: '财务',
    icon: 'el-icon-menu',
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
    ]
  },
  {
    path: '/ADManagement',
    name: '广告管理',
    icon: 'el-icon-menu',
    children: [
      {
        path: '/CompetitiveOptimizations',
        name: '广告优化'
      },
      {
        path: '/CompetitiveAnalysis',
        name: '广告竞争度分析'
      },
      {
        path: '/DataAnalysis',
        name: '广告数据分析'
      }
    ]
  },
  {
    path: '',
    name: '评价分析',
    icon: 'el-icon-menu',
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
    path: '/SOUQ',
    name: '类目分析',
    icon: 'el-icon-menu',
    children: [{
      path: '/CateAnalysis',
      name: '类目分析'
      },
      {
        path: '/SouqCateDepthAnalysis',
        name: '类目深度分析'
      }
    ]
  },
  {
    path: '/storeAnalysis',
    name: '店铺分析',
    icon: 'el-icon-menu',
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
    icon: 'el-icon-menu',
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
  
]

// const asideMenuConfig = [{
//   path: '/dash',
//   name: '店铺首页',
//   icon: 'el-icon-menu'
// },
// {
//   path: '/shopAuthorization',
//   name: '店铺授权',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/cate',
//   name: '类目设置',
//   icon: 'el-icon-menu',
//   children: [{
//     path: '/CateSetup',
//     name: '类目管理'
//   }
//   ]
// },
// // {
// //   path: '/error',
// //   name: '错误页',
// //   icon: 'el-icon-menu',
// //   children: [{
// //     path: '/404',
// //     name: '404'
// //   },
// //   {
// //     path: '/empty',
// //     name: '空页'
// //   },
// //   {
// //     path: '/notpermission',
// //     name: '无权限'
// //   }
// //   ]
// // },
// {
//   path: '/keyLexicon',
//   name: '关键词库',
//   icon: 'el-icon-menu',
//   children: [{
//     path: '/keyLength',
//     name: '关键词长度配置'
//   },
//   {
//     path: '/typeSupervise',
//     name: '词库类型管理'
//   },
//   {
//     path: '/key',
//     name: '关键词库'
//   }
//   ]
// },
// {
//   path: '/product',
//   name: '产品校验',
//   icon: 'el-icon-menu',
//   children: [
//     {
//       path: '/ProductLibrary',
//       name: '商品库'
//     },
//     {
//       path: '/ProductCheck',
//       name: '关键词校验'
//     }
//   ]
// },
// {
//   path: '/keywordExcavate',
//   name: '关键词挖掘',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/rankQuery',
//   name: '排名查询',
//   icon: 'el-icon-menu',
//   children: [{
//     path: '/NaturalSearch',
//     name: '自然搜索排名'
//   },
//   {
//     path: '/AdvSearch',
//     name: '广告搜索排名'
//   },
//   {
//     path: '/CateSearch',
//     name: '类目排名'
//   },
//   {
//     path: '/AssAdv',
//     name: '关联广告'
//   },
//   {
//     path: '/AssFlow',
//     name: '关联流量'
//   }
//   ]
// },
// {
//   path: '/ranking',
//   name: '排名频率分析',
//   icon: 'el-icon-menu',
//   children: [
//     {
//       path: '/ad',
//       name: '广告排名频率分析'
//     },
//     {
//       path: '/normal',
//       name: '自然排名频率分析'
//     }
//   ]
// },
// {
//   path: '/TS',
//   name: '成交统计',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/SOUQ',
//   name: 'SOUQ类目分析',
//   icon: 'el-icon-menu',
//   children: [{
//     path: '/CateAnalysis',
//     name: '类目分析'
//   },
//   {
//     path: '/SouqCateDepthAnalysis',
//     name: '类目深度分析'
//   }
//   ]
// },
// {
//   path: '/Amazon',
//   name: 'Amazon类目分析',
//   icon: 'el-icon-menu',
//   children: [{
//     path: '/CateAnalysis',
//     name: '类目分析'
//   },
//   {
//     path: '/AmazonCateDepthAnalysis',
//     name: '类目深度分析'
//   }
//   ]
// },
// {
//   path: '/SFM',
//   name: '店铺财务管理',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/taskRelateSource',
//   name: '分析关联源',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/OTS',
//   name: '订单目标设置',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/POP',
//   name: '产品价格优化',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/badReviewSeo',
//   name: '差评监控优化',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/skuEarlyWarning',
//   name: 'SKU监控预警',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/ADManagement',
//   name: '广告管理',
//   icon: 'el-icon-menu',
//   children: [
//     {
//       path: '/CompetitiveOptimizations',
//       name: '广告优化'
//     },
//     {
//       path: '/CompetitiveAnalysis',
//       name: '广告竞争度分析'
//     },
//     {
//       path: '/DataAnalysis',
//       name: '广告数据分析'
//     }
//   ]
// },
// {
//   path: '/evaluate',
//   name: '评价内容抓取',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/RankingResearch',
//   name: '自然搜索排名研究',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/FlowWarning',
//   name: '流量预警',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/ProductDatasAnalysisWarning',
//   name: '产品数据与预警',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/AmazonClaims',
//   name: '亚马逊索赔',
//   icon: 'el-icon-menu',
//   children: [
//     {
//       path: '/claimLists',
//       name: '索赔列表'
//     },
//     {
//       path: '/claimTemplateSettings',
//       name: '索赔模板设置'
//     },
//   ]
// },
// {
//   path: '/propertySettings',
//   name: '类目同款属性设置',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/productIntegration',
//   name: '产品完整信息整合',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/selection',
//   name: '选品',
//   icon: 'el-icon-menu',
//   children: [
//     {
//       path: '/ProductAttr',
//       name: '选品属性组合'
//     },
//     {
//       path: '/index',
//       name: '选品'
//     },
//     {
//       path: '/trendAnalyses',
//       name: '趋势分析'
//     },
//     {
//       path: '/partFour',
//       name: '竞品分析'
//     }
//   ]
// },
// {
//   path: '/evaluatorAnalysis',
//   name: '评价者分析',
//   icon: 'el-icon-menu',
// },
// {
//   path: '/storeAnalysis',
//   name: '店铺分析',
//   icon: 'el-icon-menu',
//   children: [
//     {
//       path: '/index',
//       name: '店铺分析'
//     },
//     {
//       path: '/storeDeepAnalysis',
//       name: '店铺深度分析'
//     }
//   ]
// },
// ]

export {
  headerMenuConfig,
  asideMenuConfig
}