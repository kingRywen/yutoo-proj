/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
// 异步加载组件
// 主页面
const index = () =>
  import('@/components/index')
const Login = () =>
  import('@/components/Login')
const Admin = () =>
  import('@/components/Admin')
const Register = () =>
  import('@/components/Register')
const FindPassword = () =>
  import('@/components/FindPassword')
// 二级页面
// const Hello = () => import('@/components/routes/two_level_routing/Hello')
const Center = () =>
  import('@/components/routes/two_level_routing/Center')
const NewCenter = () =>
  import('@/components/routes/two_level_routing/NewCenter')
// 一.选品工具
// 1.1关键词竞争分析
const KeywordIndex = () =>
  import('@/components/routes/three_level_routing/center/ProductList/1_KeywordIndex')
// 1.11关键词竞争分析查看
const KeywordIndexSee = () =>
  import('@/components/routes/three_level_routing/center/ProductList/KeywordIndexSee')
// 1.2关键词查询
const keyQuery = () =>
  import('@/components/routes/three_level_routing/center/ProductList/2_keyQuery')
// 1.21关键词查询查看
const keyQuerySee = () =>
  import('@/components/routes/three_level_routing/center/ProductList/keyQuerySee')
// 1.3类目查询
const CatalogQuery = () =>
  import('@/components/routes/three_level_routing/center/ProductList/3_CatalogQuery')
// 1.31类目查询查看
const CatalogQuerySee = () =>
  import('@/components/routes/three_level_routing/center/ProductList/CatalogQuerySee')

// 二.排名查询
// 2.1广告排名查询
const adkeywordRanking = () =>
  import('@/components/routes/three_level_routing/center/rankingQuery/adkeywordRanking')
// 2.2类目排名查询
const categoryRanking = () =>
  import('@/components/routes/three_level_routing/center/rankingQuery/categoryRanking')
// 2.3关键词排名查询
const keywordQuery = () =>
  import('@/components/routes/three_level_routing/center/rankingQuery/keywordQuery')

// 三.关键词挖掘
const keywordExcavateIndex = () =>
  import('@/components/routes/three_level_routing/center/keywordExcavate/keywordExcavateIndex')
// .关键词挖掘查看
const keywordExcavateIndexSee = () =>
  import('@/components/routes/three_level_routing/center/keywordExcavate/keywordExcavateIndexSee')

// 四.竞争分析
// 4.1竞品分析
const productAnalysis = () =>
  import('@/components/routes/three_level_routing/center/competitive/1_productAnalysis')
// 4.1.1竞品分析查看
const checkProductAnalysis = () =>
  import('@/components/routes/three_level_routing/center/competitive/1_1checkProductAnalysis')
// 4.2店铺分析
const shopAnalysis = () =>
  import('@/components/routes/three_level_routing/center/competitive/2_shopAnalysis')
// 4.2.1店铺分析查看
const checkShopAnalysis = () =>
  import('@/components/routes/three_level_routing/center/competitive/2_1checkShopAnalysis')
// 4.2.2 ta1 点击 chart7.8.9的时候跳转到的产品列表
const shopProductScore = () =>
  import('@/components/routes/three_level_routing/center/competitive/2_3shopProductScore')
// 4.3销量分析
const SalesVolume = () =>
  import('@/components/routes/three_level_routing/center/competitive/SalesVolume')
// 4.3销量分析查看
const SalesVolumeSee = () =>
  import('@/components/routes/three_level_routing/center/competitive/SalesVolumeSee')
// 五.监控中心
// 5.1跟卖监控
const salesMonitoring = () =>
  import('@/components/routes/three_level_routing/center/monitoringCenter/salesMonitoring')
// 5.1.1子ASIN列表
const salesMonitoringSee = () =>
  import('@/components/routes/three_level_routing/center/monitoringCenter/salesMonitoringSee')
// 5.1.2跟卖监控的卖家列表
const sellerList = () =>
  import('@/components/routes/three_level_routing/center/monitoringCenter/sellerList')

// 5.2防跟卖处理
const preventSalesMonitoring = () =>
  import('@/components/routes/three_level_routing/center/monitoringCenter/preventSalesMonitoring')
// 5.1.1子ASIN列表
const preventSalesMonitoringSee = () =>
  import('@/components/routes/three_level_routing/center/monitoringCenter/preventSalesMonitoringSee')
// 5.1.2跟卖监控的卖家列表
const preventSaleList = () =>
  import('@/components/routes/three_level_routing/center/monitoringCenter/preventSaleList')

// 5.3差评监控
const negativeCommentMonitoring = () =>
  import('@/components/routes/three_level_routing/center/monitoringCenter/negativeCommentMonitoring')


// 六.描述编辑工具
const descriptionEditing = () =>
  import('@/components/routes/three_level_routing/center/descriptionEditingTool/descriptionEditing')
const switchingLocalList = () =>
  import('@/components/routes/three_level_routing/center/descriptionEditingTool/switchingLocalList')
const addNewEdition = () =>
  import('@/components/routes/three_level_routing/center/descriptionEditingTool/addNewEdition')
const imgSpace = () =>
  import('@/components/routes/three_level_routing/center/imgagesSpace/imgSpace')

// 我的关注
const keyLexicon = () =>
  import('@/components/routes/three_level_routing/center/myAttention/keyLexicon')
const commodityBank = () =>
  import('@/components/routes/three_level_routing/center/myAttention/commodityBank')

// 八.店铺授权
const shopAuthorization = () =>
  import('@/components/routes/three_level_routing/center/shopAuthorizations/shopAuthorization')
// 九.充值页面
const rechargePage = () =>
  import('@/components/routes/three_level_routing/center/recharge/recharge')
const rechargeOrder = () =>
  import('@/components/routes/three_level_routing/center/recharge/rechargeOrder')
const payPage = () =>
  import('@/components/routes/three_level_routing/center/recharge/pay')
const payedPage = () =>
  import('@/components/routes/three_level_routing/center/recharge/payed')
// 十.个人中心
const personalCenter = () =>
  import('@/components/routes/three_level_routing/center/personalCenter/personalCenter')
// messageCenter 系统消息
const messageCenter = () =>
  import('@/components/routes/three_level_routing/center/message/messageCenter')
// 意见反馈
const feedbackCenter = () =>
  import('@/components/routes/three_level_routing/center/feedback/feedbackCenter')
// 销售报告  
const salesReport = () =>
  import('@/components/routes/three_level_routing/center/salesReport/index')
Vue.use(Router)
var router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    // path: '',
    // component: NewCenter,
    // children: [{
    path: '/register',
    component: Register,
    name: "注册",
    meta: {
      title: "注册",
      notShowPoint: true
    }
  },
  {
    path: '/findpass',
    component: FindPassword,
    name: "找回密码",
    meta: {
      title: "找回密码",
      notShowPoint: true
      // }
    }
    // ]
  },
  {
    path: '/index',
    name: 'index',
    component: index
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    component: Admin,


    children: [{
      path: '',
      redirect: 'center',
      meta: {
        name: "关键词",
        title: "关键词"
      },
    },
    //选品工具
    {
      path: 'center',
      component: Center,
      meta: {
        title: "关键词"
      },
      children: [{
        path: '',
        component: Center,
        meta: {
          title: "关键词"
        },
        meta: {
          shouldGet: true,
          name: '关键词挖掘',
          title: "关键词挖掘"
        },
        children: [{
          path: '',
          component: keywordExcavateIndex,
          meta: {
            siderBarPath: "/admin/center"
          }
        }, {
          path: 'keywordExcavateIndexSee',
          component: keywordExcavateIndexSee,
          name: '关键词挖掘查看',
          meta: {
            sub: true,
            back: true,
            siderBarPath: "/admin/center"
          }
        }]
      },
      {
        path: 'KeywordIndex',
        component: Center,
        name: '关键词竞争分析',
        children: [{
          path: '',
          component: KeywordIndex,
          meta: {
            siderBarPath: "/admin/center/KeywordIndex"
          }
        }, {
          path: 'KeywordIndexSee',
          component: KeywordIndexSee,
          name: '关键词竞争分析查看',
          meta: {
            title: "关键词查询查看",
            back: true,
            siderBarPath: "/admin/center/KeywordIndex"
          },
        }]
      },
      ]
    },
    // 选品工具
    {
      path: 'SelectionTool',
      component: Center,
      meta: {
        title: "选品工具"
      },
      children: [{
        path: '',
        redirect: 'keyQuery',
      },
      {
        path: 'keyQuery',
        component: Center,
        name: '关键词查询',
        meta: {
          title: "关键词查询"
        },
        children: [{
          path: '',
          component: keyQuery,
          meta: {
            siderBarPath: "/admin/SelectionTool/keyQuery"
          }
        }, {
          path: 'keyQuerySee',
          component: keyQuerySee,
          name: '关键词查询查看',
          meta: {
            title: "关键词查询查看",
            back: true,
            siderBarPath: "/admin/SelectionTool/keyQuery"
          },
        }]
      },
      {
        path: 'CatalogQuery',
        component: Center,
        name: '类目查询',
        children: [{
          path: '',
          component: CatalogQuery,
          meta: {
            siderBarPath: "/admin/SelectionTool/CatalogQuery"
          }
        }, {
          path: 'CatalogQuerySee',
          component: CatalogQuerySee,
          name: '类目查询查看',
          meta: {
            back: true,
            siderBarPath: "admin/SelectionTool/CatalogQuery"
          }
        }]
      }
      ]
    },
    // 关键词挖掘
    // {
    //   path: 'keywordExcavateIndex',
    //   component: Center,
    //   name: "关键词挖掘",
    //   children: [{
    //     path: '',
    //     component: keywordExcavateIndex,
    //     meta: {
    //       drop: false
    //     },
    //   }, {
    //     path: 'keywordExcavateIndexSee',
    //     component: keywordExcavateIndexSee,
    //     meta: {
    //       drop: false,
    //       title: "关键词挖掘查看"
    //     }
    //   }]
    // },
    // 排名查询
    {
      path: 'rankingQuery',
      component: Center,
      meta: {
        title: "排名查询"
      },
      children: [{
        path: '',
        redirect: 'keywordQuery'
      }, {
        path: 'keywordQuery',
        component: keywordQuery,
        // name: '关键词排名目排名',
        meta: {
          title: "自然搜索排名",
          siderBarPath: "/admin/rankingQuery/keywordQuery"
        }
      },
      {
        path: 'adkeywordRanking',
        component: adkeywordRanking,
        name: '广告搜索排名',
        meta: {
          title: "广告搜索排名",
          siderBarPath: "/admin/rankingQuery/adkeywordRanking"
        }
      },
      {
        path: 'categoryRanking',
        component: categoryRanking,
        name: '类目搜索排名',
        meta: {
          title: "类目搜索排名",
          siderBarPath: "/admin/rankingQuery/categoryRanking"
        }
      }
      ]
    },
    // 竞争分析
    {
      path: 'competitive',
      component: Center,
      children: [{
        path: '',
        redirect: 'productAnalysis',
      }, {
        path: 'productAnalysis',
        component: Center,
        name: '竞品分析',
        // path: 'productAnalysis',
        // component: productAnalysis,
        // name: '竞品分析',
        meta: {
          title: "竞品分析"
        },
        children: [{
          path: '',
          component: productAnalysis,
          meta: {
            siderBarPath: "/admin/competitive/productAnalysis"
          }
        }, {
          path: 'checkProductAnalysis',
          component: checkProductAnalysis,
          name: '竞品查看',
          meta: {
            title: "竞品分析查看",
            back: true,
            siderBarPath: "/admin/competitive/productAnalysis"
          }
        }]
      },

      // 销量分析
      {
        path: 'salesVolume',
        component: Center,
        name: '销量分析',
        meta: {
          title: "销量分析",
        },
        children: [{
          path: '',
          component: SalesVolume,
          meta: {
            siderBarPath: "/admin/competitive/salesVolume"
          }
        }, {
          path: 'SalesVolumeSee',
          component: SalesVolumeSee,
          name: '销量分析查看',
          meta: {
            title: "销量分析查看",
            back: true,
            siderBarPath: "/admin/competitive/salesVolume"
          }
        }]
      },

      {
        path: 'shopAnalysis',
        component: Center,
        name: '店铺分析',
        meta: {
          title: "店铺分析",
        },
        children: [{
          path: '',
          component: shopAnalysis,
          meta: {
            siderBarPath: "/admin/competitive/shopAnalysis"
          }
        }, {
          path: 'checkShopAnalysis',
          component: checkShopAnalysis,
          name: '店铺分析查看',
          meta: {
            title: "店铺分析查看",
            keep: true,
            back: true,
            siderBarPath: "/admin/competitive/shopAnalysis"
          },
        }, {
          path: 'shopProductScore',
          component: shopProductScore,
          name: '产品评分列表',
          meta: {
            title: "产品评分列表",
            insert: true
          }
        }]
      }
      ],
      meta: {
        title: "竞争分析",
        keepAlive: false // 不需要被缓存
      }
    },
    // 监控分析
    {
      path: 'monitoringCenter',
      component: Center,
      meta: {
        title: "监控分析"
      },
      children: [{
        path: '',
        redirect: 'salesMonitoring'
      }, {
        path: 'salesMonitoring',
        component: Center,
        name: '跟卖监控',
        meta: {
          title: "跟卖监控"
        },
        children: [{
          path: '',
          component: salesMonitoring,
          meta: {
            siderBarPath: "/admin/monitoringCenter/salesMonitoring"
          }
        },
        {
          path: 'salesMonitoringSee',
          name: '子ASIN列表',
          component: salesMonitoringSee,
          meta: {
            title: "子ASIN列表",
            sub: true,
            back: true,
            siderBarPath: "/admin/monitoringCenter/salesMonitoring"
          },

        }, {
          path: 'sellerList',
          name: '卖家列表',
          component: sellerList,
          meta: {
            title: "卖家列表",
            sub: true,
            saleKeep: true,
            back: true,
            siderBarPath: "/admin/monitoringCenter/salesMonitoring"
          }
        }
        ]
      },
      {
        path: 'preventSalesMonitoring',
        component: Center,
        name: '防跟卖处理',
        meta: {
          title: "防跟卖处理"
        },
        children: [{
          path: '',
          component: preventSalesMonitoring,
          meta: {
            siderBarPath: "/admin/monitoringCenter/preventSalesMonitoring"
          }
        },
        {
          path: 'preventSalesMonitoringSee',
          name: '子ASIN列表',
          component: preventSalesMonitoringSee,
          meta: {
            title: "子ASIN列表",
            sub: true,
            back: true,
            siderBarPath: "/admin/monitoringCenter/preventSalesMonitoring"
          }
        },
        {
          path: 'preventSaleList',
          name: '卖家列表',
          component: preventSaleList,
          meta: {
            title: "卖家列表",
            sub: true,
            preSaleKeep: true,
            back: true,
            siderBarPath: "/admin/monitoringCenter/preventSalesMonitoring"
          }
        }
        ]
      },
      {
        path: 'negativeCommentMonitoring',
        component: negativeCommentMonitoring,
        name: '差评监控',
        meta: {
          title: "差评监控",
          meta: {
            siderBarPath: "/admin/monitoringCenter/negativeCommentMonitoring"
          }
        },
      },
      ]
    },
    // 描述编辑工具
    {
      path: 'descriptionEditing',
      component: descriptionEditing,
      name: "descriptionEditing",
      meta: {
        title: "描述编辑工具",
        drop: false,
        siderBarPath: "/admin/descriptionEditing"
      }
    },

    {
      path: 'switchingLocalList',
      component: switchingLocalList,
      name: "switchingLocalList",
      meta: {
        title: "描述编辑工具",
        drop: false,
        siderBarPath: "/admin/descriptionEditing"
      }
    },
    // 图片空间
    {
      path: 'addNewEdition',
      component: addNewEdition,
      name: "addNewEdition",
      meta: {
        title: "描述编辑工具",
        drop: false,
        siderBarPath: "/admin/descriptionEditing"
      }
    },
    {
      path: 'imgSpace',
      component: imgSpace,
      name: "图片空间",
      meta: {
        title: "图片空间",
        drop: false,
        siderBarPath: "/admin/imgSpace"
      }
    },
    // 我的关注
    {
      path: 'myAttentionCenter',
      component: Center,
      meta: {
        title: "我的关注"
      },
      children: [{
        path: '',
        redirect: 'keyLexicon'
      }, {
        path: 'keyLexicon',
        component: keyLexicon,
        name: '关键词库',
        meta: {
          title: "关键词库",
          siderBarPath: "/admin/myAttentionCenter/keyLexicon"
        }
      },
      {
        path: 'commodityBank',
        component: commodityBank,
        name: '产品库',
        meta: {
          title: "产品库",
          siderBarPath: "/admin/myAttentionCenter/keyLexicon"
        },
      },
      ]
    },
    // 店铺授权
    {
      path: 'shopAuthorization',
      component: shopAuthorization,
      name: "店铺授权",
      meta: {
        title: "店铺授权",
        drop: false,
        siderBarPath: "/admin/shopAuthorization",
      }
    },
    // 购买套餐
    {
      path: 'rechargePage',
      component: rechargePage,
      name: "购买套餐",
      meta: {
        title: "购买套餐"
      }
    },
    // 我的订单
    {
      path: 'rechargeOrder',
      component: rechargeOrder,
      name: "我的订单",
      meta: {
        title: "我的订单"
      }
    },
    // 支付页面
    {
      path: 'payPage',
      component: payPage,
      name: "支付订单",
      meta: {
        title: "支付订单"
      }
    },
    // 支付跳转页面
    {
      path: 'payedPage',
      component: payedPage,
      name: "支付跳转",
      meta: {
        title: "支付跳转"
      }
    },
    // 个人中心
    {
      path: 'personalCenter',
      component: personalCenter,
      name: "个人中心",
      meta: {
        title: "个人中心"
      }
    },
    // 系统消息
    {
      path: 'messageCenter',
      component: messageCenter,
      name: "系统消息",
      meta: {
        title: "系统消息"
      }
    },
    // 意见反馈
    {
      path: 'feedbackCenter',
      component: feedbackCenter,
      name: "意见反馈",
      meta: {
        title: "意见反馈"
      }
    },
    {
      path: 'salesReport',
      name: 'salesReport',
      component: Center,
      children: [{
        path: 'index',
        component: salesReport,
        meta: {
          title: '销售报告'
        }
      }]
    }
    ]
  }
  ]
})

// var routeList = []

// router.beforeEach((to, from, next) => {
//   var index = routeList.indexOf(to.name)
//   if (index !== -1) {

//     //如果存在路由列表，则把之后的路由都删掉
//     routeList.splice(index + 1, routeList.length - index - 1)
//   } else {

//     routeList.push(to.name)
//   }
//   to.meta.routeList = routeList
//   next()
// })

export default router
