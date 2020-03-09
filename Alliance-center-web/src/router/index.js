import Vue from 'vue'
import Router from 'vue-router'
import { ROUTER_DEFAULT_CONFIG } from 'Config/index'
import { routerBeforeEachFunc } from 'Config/interceptors/router'

import HeaderAsideLayout from 'Layouts/HeaderAsideLayout'
// import BlankLayout from 'Layouts/blankLayout'

Vue.use(Router)
let routes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      noMenu: true
    }
  },
  {
    path: '*',
    redirect: '/error/404',
    meta: {
      noMenu: true
    }
  },
  {
    path: '/error',
    component: HeaderAsideLayout,
    name: 'error',
    meta: {
      noMenu: true
    },
    children: [
      {
        path: '404',
        component: () => import('Views/Error/404'),
        meta: {
          title: '404'
        }
      },
      {
        path: 'empty',
        component: () => import('Views/Error/EmptyContent'),
        meta: {
          title: '空页'
        }
      },
      {
        path: 'notpermission',
        component: () => import('Views/Error/NotPermission'),
        meta: {
          title: '无权限'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('Views/Login'),
    name: 'login',
    meta: {
      title: '系统登录',
      noMenu: true
    }
  },
  {
    path: '/findPass',
    component: () => import('Views/FindPass'),
    name: 'findPass',
    meta: {
      title: '忘记密码',
      noMenu: true
    }
  },
  {
    path: '/PlatformManagement',
    name: 'PlatformManagement',
    meta: {
      title: '平台管理',
      icon: '&#xe6be;'
    },
    children: [
      {
        path: 'index',
        component: () => import('Views/PlatformManagement/Country'),
        name: 'Country',
        meta: {
          title: '国家'
        }
      },
      {
        path: 'platform',
        component: () => import('Views/PlatformManagement/Platform'),
        name: 'Platform',
        meta: {
          title: '平台'
        }
      },
      {
        path: 'site',
        component: () => import('Views/PlatformManagement/Site'),
        name: 'Site',
        meta: {
          title: '平台站点'
        }
      }
    ],
    component: HeaderAsideLayout
  },
  {
    path: '/categoryManagement',
    name: 'categoryManagement',
    meta: {
      title: '类目管理',
      path: '/categoryManagement/index',
      icon: '&#xeb8f;'
    },
    children: [
      {
        path: 'index',
        component: () => import('Views/CategoryManagement'),
        name: 'CategoryManagementIndex',
        meta: {
          title: '类目管理'
        }
      }
    ],
    component: HeaderAsideLayout
  },
  {
    path: '/BusinessManagement',
    name: 'BusinessManagement',
    meta: {
      title: '商户管理',
      path: '/BusinessManagement/index',
      icon: '&#xeb8a;'
    },
    children: [
      {
        path: 'index',
        component: () => import('Views/BusinessManagement'),
        name: 'BusinessManagementIndex',
        meta: {
          title: '商户管理'
        }
      }
    ],
    component: HeaderAsideLayout
  },
  {
    path: '/ResourceManagement',
    name: 'ResourceManagement',
    meta: {
      title: '资源管理',
      noMenu: true
    },
    children: [
      {
        path: 'index',
        component: () => import('Views/ResourceManagement/IP'),
        name: 'IP',
        meta: {
          title: 'IP'
        },
        children: [
          {
            path: 'ServiceCondition/:ipPoolId',
            component: () =>
              import('Views/ResourceManagement/IP/ServiceCondition'),
            name: 'IPServiceCondition',
            meta: {
              title: 'IP使用情况'
            }
          }
        ]
      },
      {
        path: 'IpPrice',
        component: () => import('Views/ResourceManagement/IpPrice'),
        name: 'IpPrice',
        meta: {
          title: 'IP价格'
        }
      },
      {
        path: 'Vm',
        component: () => import('Views/ResourceManagement/Vm'),
        name: 'Vm',
        meta: {
          title: '店铺虚拟机'
        }
      }
    ],
    component: HeaderAsideLayout
  },

  {
    path: '/OrderManagement',
    name: 'OrderManagement',
    meta: {
      title: '订单管理',
      noMenu: true
    },
    children: [
      {
        path: 'index',
        component: () => import('Views/OrderManagement/Order'),
        name: 'Order',
        meta: {
          title: '订单'
        },
        children: [
          {
            path: 'PaymentRecordsSingle/:orderId',
            component: () => import('Views/OrderManagement/PaymentRecords'),
            name: 'PaymentRecordsSingle',
            meta: {
              title: '付费记录'
            },
            props: true
          },
          {
            path: 'AccountList/:orderId',
            component: () => import('Views/OrderManagement/AccountList'),
            name: 'AccountList',
            meta: {
              title: '账号列表'
            },
            props: true
          }
        ]
      },
      {
        path: 'PaymentRecords',
        component: () => import('Views/OrderManagement/PaymentRecords'),
        name: 'PaymentRecords',
        meta: {
          title: '付费记录'
        }
      }
    ],
    component: HeaderAsideLayout
  },
  {
    path: '/AccountManagement',
    name: 'AccountManagement',
    meta: {
      title: '账号管理',
      icon: '&#xec6b;',
      // path: '/AccountManagement/index'
    },
    children: [
      {
        path: 'SafetyRange',
        component: () => import('Views/AccountManagement/SafetyRange'),
        name: 'AccountManagementSafetyRange',
        meta: {
          title: '安全范围'
        },
        props: true
      },
      {
        path: 'Habit',
        component: () => import('Views/AccountManagement/Habit'),
        name: 'AccountManagementHabit',
        meta: {
          title: '习惯'
        },
        props: true
      },
      {
        path: 'CrowdProperties',
        component: () => import('Views/AccountManagement/CrowdProperties'),
        name: 'AccountManagementCrowdProperties',
        meta: {
          title: '人群属性'
        },
        props: true
      },
      {
        path: 'Throng',
        component: () => import('Views/AccountManagement/Throng'),
        name: 'AccountManagementThrong',
        meta: {
          title: '人群'
        },
        props: true
      },
      {
        path: 'index',
        component: () => import('Views/AccountManagement'),
        name: 'AccountManagementIndex',
        meta: {
          title: '账号'
        },
        children: [
          {
            path: 'Statistic/:accountId',
            component: () => import('Views/AccountManagement/Statistic'),
            name: 'AccountManagementStatistic',
            meta: {
              title: '账号任务统计'
            },
            props: true
          },
          {
            path: 'Sync',
            component: () => import('Views/AccountManagement/Sync'),
            name: 'AccountManagementSync',
            meta: {
              title: '同步平台订单'
            }
          }
        ]
      }
    ],
    component: HeaderAsideLayout
  },

  {
    path: '/TaskManagement',
    name: 'TaskManagement',
    meta: {
      title: '任务管理',
      icon: '&#xec35;'
    },
    children: [
      {
        path: 'index',
        component: () => import('Views/TaskManagement/TaskType'),
        name: 'TaskType',
        meta: {
          title: '任务类型'
        }
      },
      {
        path: 'Action',
        component: () => import('Views/TaskManagement/Action'),
        name: 'Action',
        meta: {
          title: '动作'
        }
      },
      {
        path: 'Process',
        component: () => import('Views/TaskManagement/Process'),
        name: 'Process',
        meta: {
          title: '流程'
        }
      },
      // {
      //   path: 'Habit',
      //   component: () => import('Views/TaskManagement/Habit'),
      //   name: 'Habit',
      //   meta: {
      //     title: '习惯'
      //   }
      // },
      {
        path: 'Task',
        component: () => import('Views/TaskManagement/AgentTask'),
        name: 'Task',
        meta: {
          title: '任务',
          perms: ['add']
        },
        children: [
          {
            path: 'view/:id',
            component: () => import('Views/TaskManagement/AgentTask/View'),
            name: 'viewsTaskManagementAgentTaskView',
            meta: {
              title: '查看任务',
              noBack: true
            },
            props: true
          }
        ]
      }
    ],
    component: HeaderAsideLayout
  },
  {
    path: '/finance',
    name: 'finance',
    meta: {
      title: '财务',
      icon: '&#xe662;',
      // path: '/SystemSettings/index'
    },
    children: [
      {
        path: 'index',
        component: () => import('Views/finance/Index'),
        name: 'financeIndex',
        meta: {
          title: '财务概况'
        }
      },
      {
        path: 'record',
        component: () => import('Views/finance/Record'),
        name: 'frecord',
        meta: {
          title: '支出记录',
        }
      },
      {
        path: 'item',
        component: () => import('Views/finance/Item'),
        name: 'fitem',
        meta: {
          title: '支出项',
        }
      },
    ],
    component: HeaderAsideLayout
  },
  {
    path: '/SystemSettings',
    name: 'SystemSettingsIndex',
    meta: {
      title: '系统',
      icon: '&#xe616;',
      // path: '/SystemSettings/index'
    },
    children: [
      {
        path: 'index',
        component: () => import('Views/SystemSettings'),
        name: 'SystemSettings',
        meta: {
          title: '系统设置'
        }
      },
      {
        path: 'CurrencyRate',
        component: () => import('Views/CurrencyRate'),
        name: 'CurrencyRate',
        meta: {
          title: '汇率设置',
        }
      },
      {
        path: 'notify',
        component: () => import('Views/Notify'),
        name: 'notify',
        meta: {
          title: '消息通知',
        }
      },

    ],
    component: HeaderAsideLayout
  },

  // {
  //   path: '/notify',
  //   name: 'notify',
  //   meta: {
  //     title: '消息通知',
  //     noMenu: true,
  //     path: '/notify/index'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('Views/Notify'),
  //       name: 'SystemSettings',
  //       meta: {
  //         title: '消息通知'
  //       }
  //     }
  //   ],
  //   component: HeaderAsideLayout
  // }
]

const routerInstance = new Router({
  linkActiveClass: 'active',
  ...ROUTER_DEFAULT_CONFIG,
  routes
})

// 注入拦截器
routerInstance.beforeEach(routerBeforeEachFunc)

export default routerInstance
