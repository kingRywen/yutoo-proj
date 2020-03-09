import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout/Layout'
import BlankLayout from '@/components/Layout/blankLayout'

Vue.use(Router)
export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@/components/Layout/UserLogin'),
      name: 'login',
      meta: {
        title: '系统登录'
      }
    },
    {
      path: '/print',
      component: BlankLayout,
      name: '打印',
      meta: {
        title: '打印'
      },
      children: [
        {
          path: '/contract/template/print',
          component: () =>
            import('@/views/associatedSettings/contractTemplate/print'),
          meta: {
            title: '合同模板-打印'
          }
        },
        {
          path: '/finance/associatedSettings/contractPrint',
          component: () => import('@/components/print/index'),
          meta: {
            title: '合同模板'
          }
        }
      ]
    },
    {
      path: '/finance',
      component: Layout,
      name: 'finance',
      meta: {
        title: '财务管理'
      },
      children: [
        {
          path: '/finance/dailyOperation',
          component: BlankLayout,
          meta: {
            title: '财务日常操作'
          },
          redirect: '/finance/dailyOperation',
          children: [
            {
              path: '/finance/dailyOperation/refunds',
              component: () => import('@/views/dailyOperation/refunds/index'),
              name: 'refunds',
              meta: {
                title: '借还款冲账管理'
              }
            },
            {
              path: '/finance/dailyOperation/reimbursement',
              name: 'reimbursement',
              component: () =>
                import('@/views/dailyOperation/reimbursement/index'),
              meta: {
                title: '报销管理'
              }
            },
            {
              path: '/finance/dailyOperation/networkPurchase',
              name: 'networkPurchase',
              component: () =>
                import('@/views/dailyOperation/networkPurchase/index'),
              meta: {
                title: '网络采购付款'
              }
            },
            {
              path: '/finance/dailyOperation/application',
              name: 'application',
              component: () =>
                import('@/views/dailyOperation/application/index'),
              meta: {
                title: '订单退款申请'
              }
            }
          ]
        },
        {
          path: '/finance/cost',
          component: BlankLayout,
          meta: {
            title: '成本管理'
          },
          redirect: '/finance/cost',
          children: [
            {
              path: '/finance/cost/costType',
              name: 'costType',
              component: () => import('@/views/cost/costType/index'),
              meta: {
                title: '成本类型'
              }
            },
            {
              path: '/finance/cost/productCost',
              name: 'productCost',
              component: () => import('@/views/cost/productCost/index'),
              meta: {
                title: '产品成本'
              }
            },
            {
              path: '/finance/cost/export',
              name: 'productCost',
              component: () => import('@/views/cost/exportLog'),
              meta: {
                title: '导出日志'
              }
            }
          ]
        },
        {
          path: '',
          component: BlankLayout,
          meta: {
            title: '账簿'
          },
          redirect: '/finance/accountBook',
          children: [
            {
              path: '/finance/accountBook/profitStatement',
              name: 'financeAccountBookProfitStatement',
              component: () =>
                import('@/views/accountBook/profitStatement/index'),
              meta: {
                title: '利润报表'
              },
              props: true,
              children: [
                {
                  path: '/finance/accountBook/profitStatement/details',
                  name: 'financeAccountBookProfitStatementDetails',
                  component: () =>
                    import('@/views/accountBook/profitStatement/details'),
                  meta: {
                    title: '产品费用详情',
                    showProp: 'title',
                    keepProp: ['type']
                  },
                  children:[{
                    props: true,
                    path: '/finance/accountBook/profitStatement/skuDetails',
                    name: 'financeAccountBookProfitStatementSkuDetails',
                    component: () =>
                      import('@/views/accountBook/profitStatement/SkuDetails'),
                    meta: {
                      title: 'SKU',
                      showProp: 'sku',
                      keepProp: ['type']
                    }
                  }]
                }
              ]
            },
            
            {
              path: '/finance/accountBook/generalLedger',
              component: () =>
              import('@/views/accountBook/generalLedger/index'),
              name:'financeAccountBookGeneralLedger',
              meta: {
                title: '总账簿'
              }
            },
            {
              path: '/finance/accountBook/accountStated',
              component: () =>
                import('@/views/accountBook/accountStated/index'),
                name: 'financeAccountBookAccountStated',
              meta: {
                title: '明细账'
              }
            }
          ]
        },
        {
          path: '',
          component: BlankLayout,
          meta: {
            title: '合同管理'
          },
          redirect: '/finance/contractManager',
          children: [
            {
              path: '/finance/contractManager/purchaseContract',
              component: () =>
                import('@/views/contractManager/purchaseContract/index'),
              meta: {
                title: '供应商采购合同'
              }
            }
          ]
        },
        {
          path: '',
          component: BlankLayout,
          meta: {
            title: '相关设置'
          },
          redirect: '/finance/associatedSettings',
          children: [
            {
              path: '/finance/associatedSettings/contractTemplate',
              component: () =>
                import('@/views/associatedSettings/contractTemplate/index'),
              meta: {
                title: '合同模板'
              }
            },
            {
              path: '/finance/associatedSettings/contractPrint',
              component: () => import('@/components/print/index'),
              meta: {
                title: '合同模板'
              }
            },

            {
              path: '/finance/associatedSettings/numberingRule',
              component: () =>
                import('@/views/associatedSettings/numberingRule/index'),
              meta: {
                title: '合同编号规则'
              }
            },
            {
              path: '/finance/associatedSettings/currencyRate',
              component: () =>
                import('@/views/associatedSettings/currencyRate/index'),
              meta: {
                title: '货币费率查询'
              }
            },
            {
              path: '/finance/associatedSettings/purchaseAlipayAccount',
              component: () =>
                import(
                  '@/views/associatedSettings/purchaseAlipayAccount/index'
                ),
              meta: {
                title: '采购支付宝账号'
              }
            },
            {
              path: '/finance/associatedSettings/receivingAccountManager',
              component: () =>
                import(
                  '@/views/associatedSettings/receivingAccountManager/index'
                ),
              meta: {
                title: '收付款账号管理'
              }
            }
          ]
        }
      ]
    }
  ]
})
