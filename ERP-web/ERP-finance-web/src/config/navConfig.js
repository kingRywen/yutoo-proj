//二级菜单
export const submenu = [
  {
    name: '财务日常操作',
    path: '',
    icon: '',
    children: [
      {
        name: '借还款冲账管理',
        path: '/finance/dailyOperation/refunds'
      },
      {
        name: '报销管理',
        path: '/finance/dailyOperation/reimbursement'
      },
      {
        name: '网络采购付款',
        path: '/finance/dailyOperation/networkPurchase'
      },
      {
        name: '订单退款申请',
        path: '/finance/dailyOperation/application'
      }
    ]
  },
  {
    name: '成本管理',
    path: '',
    icon: '',
    children: [
      {
        name: '成本类型',
        path: '/finance/cost/costType'
      },
      {
        name: '产品成本',
        path: '/finance/cost/productCost'
      }
    ]
  },
  {
    name: '账簿',
    path: '',
    icon: '',
    children: [
      {
        name: '利润报表',
        path: '/finance/accountBook/profitStatement'
      },
      {
        name: '总账簿',
        path: '/finance/accountBook/generalLedger'
      },
      {
        name: '明细账',
        path: '/finance/accountBook/accountStated'
      }
    ]
  },
  {
    name: '合同管理',
    path: '',
    icon: '',
    children: [
      {
        name: '供应商采购合同',
        path: '/finance/contractManager/purchaseContract'
      }
    ]
  },
  {
    name: '相关设置',
    path: '',
    icon: '',
    children: [
      {
        name: '合同模板',
        path: '/finance/associatedSettings/contractTemplate'
      },
      {
        name: '合同编号规则',
        path: '/finance/associatedSettings/numberingRule'
      },
      {
        name: '货币费率查询',
        path: '/finance/associatedSettings/currencyRate'
      },
      {
        name: '采购支付宝账号',
        path: '/finance/associatedSettings/purchaseAlipayAccount'
      },
      {
        name: '收付款账号管理',
        path: '/finance/associatedSettings/receivingAccountManager'
      }
    ]
  }
]
