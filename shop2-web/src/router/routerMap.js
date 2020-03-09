import { importComponent } from "./index";
export default {
  layout: {
    default: () => importComponent(import(`Layout/Layout.vue`)),
    w1100: () => importComponent(import(`Layout/w1100.vue`))
  },
  common: {
    importLogs: {
      default: () => importComponent(import(`Views/common/modules/importLogs`))
    },
    h5: {
      default: () => importComponent(import(`Views/modules/h5`)),
      preview: () => importComponent(import(`Views/modules/h5/preview`))
    },
    trafficReportImport: {
      default: () =>
        importComponent(import(`Views/common/modules/trafficReportImport`))
    },
    testDemo1: {
      default: () => importComponent(import(`Views/Test/test1/index.vue`))
    }
  },
  keyword: {
    platformMining: {
      default: () =>
        importComponent(import(`Views/modules/Keyword/platformMining`)),
      detail: () =>
        importComponent(import(`Views/modules/Keyword/platformMining/detail`))
    },
    intelligentMining: {
      default: () =>
        importComponent(
          import(`Views/modules/Keyword/intelligentMining`)
          //import(`Views/Demo/demo/demo1.vue`)
        ),
      detail: () =>
        importComponent(
          import(`Views/modules/Keyword/intelligentMining/detail`)
        )
    },
    asinTheCheck: {
      default: () =>
        importComponent(import(`Views/modules/Keyword/asinTheCheck`)),
      detail: () =>
        importComponent(import(`Views/modules/Keyword/asinTheCheck/detail`))
    },
    competitiveAnalysis: {
      default: () =>
        importComponent(import(`Views/modules/Keyword/competitiveAnalysis`)),
      detail: () =>
        importComponent(
          import(`Views/modules/Keyword/competitiveAnalysis/detail`)
        )
    },
    rankingQuery: {
      default: () =>
        importComponent(import(`Views/modules/Keyword/rankingQuery`)),
      detail: () =>
        importComponent(import(`Views/modules/Keyword/rankingQuery/detail`))
    },
    kewordLib: {
      default: () =>
        importComponent(import(`Views/modules/Keyword/keywordLib/list`)),
      detail: () =>
        importComponent(import(`Views/modules/Keyword/keywordLib/detail`))
    }
  },
  product: {
    productTrendAnalysis: {
      default: () =>
        importComponent(import(`Views/modules/Product/productTrendAnalysis`))
    },
    productAnalysis: {
      default: () =>
        importComponent(import(`Views/modules/Product/productAnalysis`)),
      details: () =>
        importComponent(import(`Views/modules/Product/productAnalysis/details`))
    },
    evaluateContent: {
      default: () =>
        importComponent(import(`Views/modules/Product/evaluateContent`)),
      rep: () =>
        importComponent(import(`Views/modules/Product/evaluateContent/rep`)),
      qa: () =>
        importComponent(import(`Views/modules/Product/evaluateContent/qa`))
    },
    evaluator: {
      default: () => importComponent(import(`Views/modules/Product/evaluator`)),
      list: () =>
        importComponent(import(`Views/modules/Product/evaluator/list`)),
      analysis: () =>
        importComponent(import(`Views/modules/Product/evaluator/analysis`))
    }
  },
  shopManage: {
    warningMessage: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/leftMenu/warningMessage`)
        ),
      detail: () =>
        importComponent(
          import(`Views/modules/shopManage/leftMenu/warningMessage/detail`)
        )
    },
    productHealthy: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/leftMenu/productHealthy`)
        )
    },
    badReviewMonitoring: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/leftMenu/badReviewMonitoring`)
        ),
      detail: () =>
        importComponent(
          import(`Views/modules/shopManage/leftMenu/badReviewMonitoring/detail`)
        )
    },
    productEvaluateManage: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/leftMenu/productEvaluateManage`)
        ),
      detail: () =>
        importComponent(
          import(
            `Views/modules/shopManage/leftMenu/productEvaluateManage/detail`
          )
        )
    },
    lineReview: {
      default: () =>
        importComponent(import(`Views/modules/shopManage/leftMenu/lineReview`))
    },
    makeBargainStatistics: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/rightMenu/makeBargainStatistics`)
        )
    },
    productRealTimeReport: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/rightMenu/productRealTimeReport`)
        )
    },
    productFlowAnalysis: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/rightMenu/productFlowAnalysis`)
        )
    },
    priceOptimize: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/rightMenu/priceOptimize`)
        ),
      add: () =>
        importComponent(
          import(`Views/modules/shopManage/rightMenu/priceOptimize/add`)
        )
    },
    preventToSell: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/rightMenu/preventToSell`)
        )
    },
    productList: {
      default: () =>
        importComponent(
          import(`Views/modules/shopManage/rightMenu/productList`)
        )
    },
    fba: {
      default: () => importComponent(import(`Views/modules/shopManage/fba`)),
      rep: () => importComponent(import(`Views/modules/shopManage/fba/rep`)),
      lifecycle: () =>
        importComponent(import(`Views/modules/shopManage/fba/lifecycle`)),
      shipping: () =>
        importComponent(import(`Views/modules/shopManage/fba/shipping`)),
      reprecord: () =>
        importComponent(import(`Views/modules/shopManage/fba/reprecord`)),
      plan: () => importComponent(import(`Views/modules/shopManage/fba/plan`))
    },
    fbm: {
      default: () => importComponent(import(`Views/modules/shopManage/fbm`))
    }
  },
  proPick: {
    cateAnalyze: {
      default: () =>
        importComponent(import(`Views/modules/proPick/cateAnalyze`)),
      detail: () =>
        importComponent(import(`Views/modules/proPick/cateAnalyze/detail`))
    },
    deepCateAnalyze: {
      default: () =>
        importComponent(import(`Views/modules/proPick/deepCateAnalyze`)),
      detail: {
        default: () =>
          importComponent(
            import(`Views/modules/proPick/deepCateAnalyze/detail`)
          ),
        sellers: () =>
          importComponent(
            import(`Views/modules/proPick/deepCateAnalyze/detail/sellers`)
          ),
        statisticAnalysis: () =>
          importComponent(
            import(
              `Views/modules/proPick/deepCateAnalyze/detail/statisticAnalysis`
            )
          ),
        propsAnalysis: () =>
          importComponent(
            import(
              `Views/modules/proPick/deepCateAnalyze/detail/statisticAnalysis/prop`
            )
          )
      }
    }
  },

  ss: {
    stralib: {
      default: () => importComponent(import(`Views/modules/ss/stralib/Index`))
    },
    source: {
      default: () => importComponent(import(`Views/modules/ss/source/Index`))
    },
    vallib: {
      default: () => importComponent(import(`Views/modules/ss/vallib/Index`))
    },
    lib: {
      default: () => importComponent(import(`Views/modules/ss/lib/Index`))
    },
    tran: {
      default: () => importComponent(import(`Views/modules/ss/tran/Index`))
    },
    group: {
      default: () => importComponent(import(`Views/modules/ss/group/Index`))
    },
    parities: {
      default: () => importComponent(import(`Views/modules/ss/parities/Index`))
    }
  },
  shopAuth: {
    default: () => importComponent(import(`Views/modules/shopAuth`))
  }
};
