//二级菜单
export const submenu = [
  {
    name: '客服日常操作',
    path: '',
    icon: '',
    children: [
      {
        name: '订单退款管理',
        path: '/customer/normal/refundManagement'
      },
      {
        name: '客服售后记录',
        path: '/customer/normal/customerServiceDiary'
      },
      {
        name: '订单退换货管理',
        path: '/customer/normal/orderReplacement'
      },
      {
        name: '待审核订单',
        path: '/customer/normal/toBeAuditedOrder'
      }
    ]
  },
  {
    name: '亚马逊客户中心',
    path: '',
    icon: '',
    children: [
      { name: '邮箱', path: '/customer/amazon/email' },
      {
        name: '投诉管理',
        path: '/customer/amazon/complaintManage'
      },
      {
        name: 'Reviews管理',
        path: '/customer/amazon/reviewsManage'
      },
      {
        name: 'Feedback管理',
        path: '/customer/amazon/feedBackManage'
      }
    ]
  },
  {
    name: 'eBay客服中心',
    path: '',
    icon: '',
    children: [
      { name: '邮箱', path: '/customer/ebay/email' },
      {
        name: '中差评处理',
        path: '/customer/ebay/nagativeManage'
      },
      {
        name: '争议处理',
        path: '/customer/ebay/disputeManage'
      },
      {
        name: '退换货请求列表',
        path: '/customer/ebay/changing'
      },
      {
        name: '取消交易列表',
        path: '/customer/ebay/cancelDeel'
      },
      {
        name: '未付款发起争议',
        path: '/customer/ebay/upaidDispute'
      },
      {
        name: '议价',
        path: '/customer/ebay/bargain'
      }
    ]
  },
  {
    name: '邮件设置',
    path: '',
    icon: '',
    children: [
      {
        name: '邮件账户管理',
        path: '/customer/email/EmailManageAccount'
      },
      {
        name: '邮件规则管理',
        path: '/customer/email/EmailManageRule'
      },
      {
        name: '邮件分类',
        path: '/customer/email/EmailCustomClassify'
      },
      {
        name: '模板分类',
        path: '/customer/email/EmailTempClassify'
      },
      {
        name: '邮件模板管理',
        path: '/customer/email/EmailTempManager'
      },
      {
        name: '智能自动回复策略',
        path: '/customer/email/AutomaticSortingSrategy'
      },
      {
        name: '自动回复记录',
        path: '/customer/email/SmartSrategy'
      },
      {
        name: '智能营销策略设置',
        path: '/customer/email/EmailMarketSetting'
      },
      {
        name: '邮件黑名单管理',
        path: '/customer/email/MarketBlacklistManager'
      }
    ]
  }
]
