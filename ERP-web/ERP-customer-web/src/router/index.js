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
      path: '/customer',
      component: Layout,
      name: 'customer',
      meta: {
        title: 'CRM客服管理'
      },
      children: [
        {
          path: 'normal',
          component: BlankLayout,
          meta: {
            title: '客服日常操作'
          },
          redirect: 'normal/refundManagement',
          children: [
            {
              path: 'refundManagement',
              component: () =>
                import('@/views/Normal/dailyOperation/refundManagement/index'),
              meta: {
                title: '订单退款管理'
              }
            },
            {
              path: 'customerServiceDiary',
              component: () =>
                import(
                  '@/views/Normal/dailyOperation/customerServiceDiary/index'
                ),
              meta: {
                title: '客服售后记录'
              }
            },
            {
              path: 'orderReplacement',
              component: () =>
                import('@/views/Normal/dailyOperation/orderReplacement/index'),
              meta: {
                title: '订单退换货管理'
              }
            },
            {
              path: 'toBeAuditedOrder',
              component: () =>
                import('@/views/Normal/dailyOperation/toBeAuditedOrder/index'),
              meta: {
                title: '待审核订单'
              }
            }
          ]
        },
        {
          path: 'amazon',
          component: BlankLayout,
          meta: {
            title: '亚马逊客户中心'
          },
          redirect: 'amazon/email/inbox',
          children: [
            {
              path: 'email/',
              redirect: 'email/inbox',
              component: () => import('@/views/Amazon/Email/index.vue'),
              meta: {
                title: '邮箱'
              },
              children: [
                {
                  path: 'inbox',
                  component: () => import('@/views/Amazon/Email/Inbox')
                },
                {
                  path: 'outbox',
                  component: () => import('@/views/Amazon/Email/Outbox')
                },
                {
                  path: 'drafts',
                  component: () => import('@/views/Amazon/Email/Drafts')
                },
                {
                  path: 'recycled',
                  component: () => import('@/views/Amazon/Email/Recycled')
                }
              ]
            },
            {
              path: 'complaintManage',
              name: 'complaintManage',
              component: () => import('@/views/Amazon/ComplaintManage'),
              meta: {
                title: '跟卖投诉管理'
              }
            },
            {
              path: 'reviewsManage',
              component: () => import('@/views/Amazon/ReviewsManage'),
              meta: {
                title: 'Reviews管理'
              }
            },
            {
              path: 'feedBackManage',
              component: () => import('@/views/Amazon/FeedBackManage'),
              meta: {
                title: 'Feedback管理'
              }
            }
          ]
        },
        {
          path: 'ebay',
          component: BlankLayout,
          meta: {
            title: 'eBay客服中心'
          },
          redirect: 'ebay/email/inbox',
          children: [
            {
              path: 'email',
              redirect: 'email/inbox',
              component: () => import('@/views/Ebay/Email/index.vue'),
              meta: {
                title: '邮箱'
              },
              children: [
                {
                  path: 'inbox',
                  component: () => import('@/views/Ebay/Email/Inbox')
                },
                {
                  path: 'outbox',
                  component: () => import('@/views/Ebay/Email/Outbox')
                },
                {
                  path: 'drafts',
                  component: () => import('@/views/Ebay/Email/Drafts')
                },
                {
                  path: 'recycled',
                  component: () => import('@/views/Ebay/Email/Recycled')
                }
              ]
            },
            {
              path: 'nagativeManage',
              name: 'nagativeManage',
              component: () => import('@/views/Ebay/nagativeManage/index.vue'),
              meta: {
                title: '中差评处理'
              }
            },
            {
              path: 'disputeManage',
              name: 'disputeManage',
              component: () => import('@/views/Ebay/disputeManage/index.vue'),
              meta: {
                title: '争议处理'
              }
            },
            {
              path: 'changing',
              name: 'changing',
              component: () => import('@/views/Ebay/changing/index.vue'),
              meta: {
                title: '退换货请求列表'
              }
            },
            {
              path: 'cancelDeel',
              name: 'cancelDeel',
              component: () => import('@/views/Ebay/cancelDeel/index.vue'),
              meta: {
                title: '取消交易列表'
              }
            },
            {
              path: 'upaidDispute',
              name: 'upaidDispute',
              component: () => import('@/views/Ebay/upaidDispute/index.vue'),
              meta: {
                title: '未付款发起争议'
              }
            },
            {
              path: 'bargain',
              name: 'bargain',
              component: () => import('@/views/Ebay/bargain/index.vue'),
              meta: {
                title: '议价'
              }
            }
          ]
        },
        {
          path: 'email',
          component: BlankLayout,
          meta: {
            title: '邮件设置'
          },
          redirect: 'email/EmailManageAccount',
          children: [
            {
              path: 'EmailManageAccount',
              component: () => import('@/views/Email/EmailManageAccount'),
              meta: {
                title: '邮件账户管理'
              }
            },
            {
              path: 'EmailManageRule',
              component: () => import('@/views/Email/EmailManageRule'),
              meta: {
                title: '邮件规则管理'
              }
            },
            {
              path: 'EmailCustomClassify',
              component: () => import('@/views/Email/EmailCustomClassify'),
              meta: {
                title: '邮件分类'
              }
            },
            {
              path: 'EmailTempClassify',
              redirect: 'EmailTempClassify/ReplyTemplate',
              component: () => import('@/views/Email/EmailTempClassify'),
              meta: {
                title: '模板分类'
              },
              children: [
                {
                  path: 'ReplyTemplate',
                  component: () =>
                    import('@/views/Email/EmailTempClassify/ReplyTemplate')
                },
                {
                  path: 'MarketTemplate',
                  component: () =>
                    import('@/views/Email/EmailTempClassify/MarketTemplate')
                }
              ]
            },
            {
              path: 'EmailTempManager',
              redirect: 'EmailTempManager/ReplyTempManager',
              component: () => import('@/views/Email/EmailTempManager'),
              meta: {
                title: '邮件模板管理'
              },
              children: [
                {
                  path: 'ReplyTempManager',
                  component: () =>
                    import('@/views/Email/EmailTempManager/ReplyTempManager')
                },
                {
                  path: 'MarketTempManager',
                  component: () =>
                    import('@/views/Email/EmailTempManager/MarketTempManager')
                }
              ]
            },
            {
              path: 'AutomaticSortingSrategy',
              component: () => import('@/views/Email/AutomaticSortingSrategy'),
              meta: {
                title: '智能自动回复策略'
              }
            },
            {
              path: 'SmartSrategy',
              component: () => import('@/views/Email/SmartSrategy'),
              meta: {
                title: '自动回复记录'
              }
            },
            {
              path: 'EmailMarketSetting',
              component: () => import('@/views/Email/EmailMarketSetting'),
              meta: {
                title: '智能营销策略设置'
              }
            },
            {
              path: 'MarketBlacklistManager',
              component: () => import('@/views/Email/MarketBlacklistManager'),
              meta: {
                title: '邮件黑名单管理'
              }
            }
          ]
        }
      ]
    },
    {
      path: '/network',
      component: () => import('@/views/Error/network.vue')
    },
    {
      path: '/viewEmail',
      component: () => import('@/views/Amazon/Email/comment/EmailView')
    }
  ]
})
