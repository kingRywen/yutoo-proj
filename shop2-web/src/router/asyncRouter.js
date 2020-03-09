export default [
  /**
   *
   * 1. name          路由展示名
   * 2. path          路由路径，最底层路由会带上父级的路径，生成的最终路由形式 ${parent.path}${parent.path}${current.path}
   * 3. showSubMenu   是否显示子菜单，默认不显示
   * 4. isSubMenu     是否在子菜单展示，如果为true会展示在子菜单tab页中
   * 5. showTop       在下拉菜单中展示，默认不展示
   * 6. topMenuname   在下拉菜单中显示的名字
   * 7. leaf          是否设置为最底层菜单，默认为false,目前的路由生成规则是，只有最底层都会生成路由,如果设为true表示无论是否最底层都将生成路由
   * 8. perms         按钮权限，需要与后端协商约定
   * 9. layout        基础布局组件，默认为通用布局 即 src/Layout/Layout.vue
   * 10. width        是否窄屏，窄屏宽度
   * 11. homePath     主菜单跳转地址，level = 1 的路径才生效
   * 12. hideHeader   是否隐藏导航菜单，编辑页一般都会隐藏
   * 13. subMenuName  设置子菜单显示别名，如果设置了这个会用于tab页上的显示
   * 14. menuFixed    设置顶部菜单是否固定在最上面
   *
   */

  {
    name: "关键词",
    path: "/keyword",
    sign: "keyword",
    homePath: "/keyword/platformMining",
    children: [
      {
        name: "平台挖掘",
        icon: "&#xe63c;",
        showTop: true,
        sign: "keyword:tkd:list",
        path: "/platformMining",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc:
          "各平台关键词挖掘，如Amazon、下拉词、联想词；eBay相关词、联想词等",
        children: [
          {
            name: "查看详情",
            path: "/detail",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "智能挖掘",
        icon: "&#xe604;",
        sign: "keyword:tkid:list",
        showTop: true,
        path: "/intelligentMining",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "Amazon关键词以及关键词数据智能挖掘及分析",
        children: [
          {
            name: "查看详情",
            path: "/detail",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "ASIN反查",
        icon: "&#xe606;",
        sign: "keyword:tkarm:list",
        showTop: true,
        path: "/asinTheCheck",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "Amazon ASIN智能反查关键词及关键词数据",
        children: [
          {
            name: "查看详情",
            path: "/detail",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "竞争度分析",
        icon: "&#xe601;",
        sign: "keyword:tkc:list",
        showTop: true,
        path: "/competitiveAnalysis",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "Amazon 关键词竞争度分析",
        children: [
          {
            name: "查看详情",
            path: "/detail",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "排名查询",
        icon: "&#xe66c;",
        sign: "keyword:tkr:list",
        showTop: true,
        path: "/rankingQuery",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "Amazon 关键词排名监控",
        children: [
          {
            name: "查看详情",
            path: "/detail",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "关键词库",
        icon: "&#xe60c;",
        sign: "keyword:tkr:list",
        showTop: true,
        path: "/kewordLib",
        perms: ["add", "addTask", "del"],
        meta: {
          showMetaProp: "title1",
          theme: "dark"
        },
        leaf: true,
        desc: "关键词管理，可以把需要保留的关键词放在这个模块管理",
        children: [
          {
            name: "详情",
            path: "/detail",
            meta: {
              showMetaProp: "title"
            },
            perms: ["add", "addTask", "del"]
          }
        ]
      }
    ]
  },
  {
    name: "产品分析",
    path: "/product",
    sign: "pa",
    homePath: "/product/productTrendAnalysis",
    children: [
      {
        name: "产品趋势分析",
        icon: "&#xe66b;",
        sign: "pa:pt:list",
        showTop: true,
        path: "/productTrendAnalysis",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "产品评价趋势分析，支持多产品同时分析"
      },
      {
        name: "产品剖析",
        icon: "&#xe669;",
        sign: "pa:pa:list",
        showTop: true,
        path: "/productAnalysis",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "产品深度分析，包括评价、BSR、AQ等数据分析",
        children: [
          {
            name: "剖析详情",
            path: "/details",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "评价内容分析",
        icon: "&#xe60a;",
        sign: "pa:rc:ist",
        showTop: true,
        path: "/evaluateContent",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc:
          "针对一类或者多类产品评价好评、差评、中评内容的分析以及AQ内容分析，分析产品的优缺点",
        children: [
          {
            name: "评价库",
            path: "/rep",
            perms: ["add", "addTask", "del"]
          },
          {
            name: "QA库",
            path: "/qa",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "评价者分析",
        icon: "&#xe607;",
        showTop: true,
        sign: "pa:reviewer:list",
        path: "/evaluator",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "针对一个或多个产品评价者分析，分析评价者的购物评价习惯",
        children: [
          {
            name: "评价者列表",
            path: "/list",
            perms: ["add", "addTask", "del"]
          },
          {
            name: "数据分析",
            path: "/analysis",
            perms: ["add", "addTask", "del"]
          }
        ]
      }
    ]
  },

  //店铺管理
  {
    name: "店铺管理",
    path: "/shopManage",
    sign: "shop",
    homePath: "/shopManage/warningMessage",
    children: [
      {
        name: "预警消息",
        icon: "&#xe65b;",
        sign: "shop:ew:list",
        showTop: true,
        path: "/warningMessage",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "预警消息管理，包含政策违规、A-Z、客户消息等",
        children: [
          {
            name: "",
            path: "/detail",
            perms: ["add", "addTask", "del"],
            meta: {
              showMetaProp: "title"
            }
          }
        ]
      },
      // {
      //   name: "产品健康诊断",
      //   sign: "pa:pt:list",
      //   showTop: true,
      //   path: "/productHealthy",
      //   perms: ["add", "addTask", "del"],
      //   leaf: true,
      //   desc: "分析产品退款、退货、利润等情况，以便于产品优化"
      // },
      {
        name: "差评监控",
        icon: "&#xe603;",
        sign: "shop:ew:list",
        showTop: true,
        path: "/badReviewMonitoring",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "评价监控，包含产品差评、店铺Feedbcak差评监控",
        children: [
          {
            name: "查看详情",
            path: "/detail",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "产品评价管理",
        icon: "&#xe7d8;",
        sign: "shop:ew:list",
        showTop: true,
        path: "/productEvaluateManage",
        perms: ["add", "addTask", "del"],
        leaf: true,
        meta: {
          isShowShop: true
        },
        desc: "产品所有Review管理，可以回复",
        children: [
          {
            name: "查看详情",
            path: "/detail",
            meta: {
              isShowShop: true,
              noBack: true
            },
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "FBA管理",
        sign: "shop:fa:list",
        showTop: true,
        icon: "&#xe7d8;",
        path: "/fba",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "FBA库存监控，补货预警",
        children: [
          {
            name: "补货",
            path: "/rep",
            perms: ["add", "addTask", "del"]
          },
          {
            name: "生命周期管理",
            path: "/lifecycle",
            perms: ["add", "addTask", "del"]
          },
          {
            name: "运输方式",
            path: "/shipping",
            perms: ["add", "addTask", "del"]
          },
          {
            name: "补货记录",
            path: "/reprecord",
            perms: ["add", "addTask", "del"]
          },
          {
            name: "发货计划",
            path: "/plan",
            perms: ["add", "addTask", "del"]
          }
        ]
      },
      {
        name: "FBM管理",
        icon: "&#xe7d8;",
        sign: "shop:fm:list",
        showTop: true,
        path: "/fbm",
        perms: ["add", "addTask", "del"],
        leaf: true,
        desc: "FBM订单管理"
      }
      // {
      //   name: "索评",
      //   sign: "pa:pt:list",
      //   showTop: true,
      //   path: "/lineReview",
      //   perms: ["add", "addTask", "del"],
      //   leaf: true,
      //   desc: "一键自动索评"
      // },
      // {
      //   name: "成交统计",
      //   sign: "pa:pt:list",
      //   showTop: true,
      //   icon: "&#xe821;",
      //   meta: {
      //     isShowShop: true
      //   },
      //   path: "/makeBargainStatistics",
      //   perms: ["add", "addTask", "del"],
      //   leaf: true,
      //   desc: "店铺内订单成交统计"
      // },
      // {
      // 	name: '产品实时报告',
      // 	sign: 'pa:pt:list',
      // 	showTop: true,
      // 	path: '/productRealTimeReport',
      // 	perms: ['add', 'addTask', 'del'],
      // 	leaf: true,
      // 	desc: '产品销量及时报告',
      // },
      // {
      //   name: "产品流量分析",
      //   sign: "pa:pt:list",
      //   showTop: true,
      //   path: "/productFlowAnalysis",
      //   perms: ["add", "addTask", "del"],
      //   leaf: true,
      //   desc: "店铺内产品数据统计"
      // },
      // {
      //   name: "价格优化",
      //   sign: "shop:ew:price",
      //   icon: "&#xe624;",
      //   showTop: true,
      //   path: "/priceOptimize",
      //   perms: ["add", "addTask", "del"],
      //   leaf: true,
      //   desc: "产品价格优化，定时调整产品价格",
      //   children: [
      //     {
      //       name: "添加",
      //       path: "/add",
      //       perms: ["add", "addTask", "del"]
      //     }
      //   ]
      // }
      // {
      // 	name: '防跟卖',
      // 	sign: 'pa:pt:list',
      // 	showTop: true,
      // 	path: '/preventToSell',
      // 	perms: ['add', 'addTask', 'del'],
      // 	leaf: true,
      // 	desc: '跟卖监控以及防跟卖处理',
      // },
      // {
      // 	name: '产品列表',
      // 	sign: 'pa:pt:list',
      // 	showTop: true,
      // 	path: '/productList',
      // 	perms: ['add', 'addTask', 'del'],
      // 	leaf: true,
      // 	desc: '可以查看店铺产品数据',
      // },
    ]
  },

  // 选品
  {
    name: "选品",
    path: "/proPick",
    homePath: "/proPick/cateAnalyze",
    sign: "tools",
    children: [
      {
        name: "类目分析",
        icon: "&#xe65e;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/cateAnalyze",
        desc: "类目基础数据分析",
        perms: ["add", "edit"],
        children: [
          {
            path: "/detail",
            sign: "tools:il:list",
            perms: ["add"],
            name: "详情",
            meta: {
              showMetaProp: "title"
            }
          }
        ]
      },
      {
        name: "类目深度分析",
        icon: "&#xe668;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/deepCateAnalyze",
        desc: "类目基础数据深度分析",
        perms: ["add", "edit"],
        children: [
          {
            path: "/detail",
            sign: "tools:il:list",
            perms: ["add"],
            name: "产品列表",
            leaf: true,
            meta: {
              showMetaProp: "title",
              getQuery($route) {
                // console.log(2);
                const { merchantTaskId: id } = $route.query;
                return {
                  id
                };
              }
            },
            children: [
              {
                path: "/sellers",
                sign: "tools:il:list",
                perms: ["add"],
                meta: {
                  noBack: true
                },
                name: "卖家列表"
              },
              {
                path: "/statisticAnalysis",
                sign: "tools:il:list",
                perms: ["add"],
                meta: {
                  noBack: true
                },
                name: "统计分析"
              },
              {
                path: "/propsAnalysis",
                sign: "tools:il:list",
                perms: ["add"],
                meta: {
                  noBack: true
                },
                name: "属性分析"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "跟卖",
    path: "/ss",
    homePath: "/ss/stralib",
    // FIXME:
    sign: "tools",
    children: [
      {
        name: "策略库",
        icon: "&#xe7d4;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/stralib",
        perms: ["add", "addTask", "del"],
        desc: "跟卖上架策略，含库存、价格、时间等策略"
      },
      {
        name: "跟卖源",
        icon: "&#xe7d4;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/source",
        perms: ["add", "addTask", "del"],
        desc: "从源站点抓取产品"
      },
      {
        name: "可跟卖库",
        icon: "&#xe7d4;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/vallib",
        perms: ["add", "addTask", "del"],
        desc: "从源站点加入可跟卖库的产品"
      },
      {
        name: "跟卖库",
        icon: "&#xe7d4;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/lib",
        perms: ["add", "addTask", "del"],
        desc: "从可跟卖库加入跟卖的店铺产品"
      },
      {
        name: "分组管理",
        icon: "&#xe7d4;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/group",
        perms: ["add", "addTask", "del"],
        desc: "对可跟卖库的产品进行分组，并展示在跟卖库中"
      },
      {
        name: "运费模版",
        icon: "&#xe7d4;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/tran",
        perms: ["add", "addTask", "del"],
        desc: "店铺运费模版设置，跟卖上架时使用"
      },
      {
        name: "汇率设置",
        icon: "&#xe7d4;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/parities",
        perms: ["add", "addTask", "del"],
        desc: "汇率设置，用于跨站点汇率转换"
      }
    ]
  },
  {
    name: "常用工具",
    path: "/common",
    homePath: "/common/importLogs",
    sign: "tools",
    children: [
      {
        name: "导入日志",
        icon: "&#xe7d4;",
        leaf: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/importLogs",
        perms: ["add", "addTask", "del"],
        desc: "导入日志"
      },
      {
        name: "可视化编辑",
        icon: "&#xe7d4;",
        leaf: true,
        // menuFixed: true,
        showTop: true,
        sign: "tools:il:list",
        path: "/h5",
        perms: ["add", "addTask", "del"],
        desc: "可视化编辑工具",
        children: [
          {
            path: "/preview",
            name: "预览",
            sign: "tools:il:list"
          }
        ]
      }
      // {
      //   name: "流量报告导入",
      //   leaf: true,
      //   showTop: true,
      //   sign: "tools:il:list",
      //   path: "/trafficReportImport",
      //   perms: ["add", "addTask", "del"],
      //   desc: "流量报告导入"
      // },
      // {
      //   name: "测试页面",
      //   leaf: true,
      //   showTop: true,
      //   sign: "tools:il:list",
      //   path: "/testDemo1",
      //   meta: {
      //     isShowShop: true
      //   },
      //   perms: ["add", "addTask", "del"],
      //   desc: "测试页面"
      // }
    ]
  },

  // 店铺授权
  {
    name: "店铺授权",
    path: "/shopAuth",
    sign: "tools",
    showTop: false,
    perms: ["addTask", "add"],
    width: true,
    leaf: true
  }
];
