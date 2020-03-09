import Vue from 'vue'
import Router from 'vue-router'
import { ROUTER_DEFAULT_CONFIG } from 'Config/index'
import { routerBeforeEachFunc } from 'Config/interceptors/router'

import HeaderAsideLayout from 'Layouts/HeaderAsideLayout'
import BlankLayout from 'Layouts/blankLayout'
import operator from './module/operator'

Vue.use(Router)
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('Views/Login'),
        name: 'login',
        meta: {
            title: '系统登录'
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
        path: '/findPass',
        component: () => import('Views/FindPass'),
        name: 'findPass',
        meta: {
            title: '忘记密码'
        }
    },
    {
        path: '/editPass',
        component: () => import('Views/EditPass'),
        name: 'editPass',
        meta: {
            title: '修改密码'
        }
    },

    {
        path: '/dash',
        children: [
            {
                path: '',
                component: () => import('Views/Dash'),
                name: 'dash',
                meta: {
                    title: '类目'
                }
            }
        ],
        component: HeaderAsideLayout
    },
    {
        path: '/user',
        children: [
            {
                path: '',
                component: () => import('Views/User'),
                name: 'user',
                meta: {
                    title: '商户中心'
                }
            }
        ],
        component: HeaderAsideLayout
    },
    {
        path: '/identification', //账号
        children: [
            {
                path: '',
                component: () => import('Views/Identification'),
                name: 'identification',
                meta: {
                    title: '账号'
                }
            }
        ],
        component: HeaderAsideLayout
    },
    {
        path: '/app', //账号
        children: [
            {
                path: '',
                component: () => import('Views/App'),
                name: 'app',
                meta: {
                    title: '手机',
                    perms: ['add']
                }
            },
            {
                path: 'add',
                component: () => import('Views/App/add.vue'),
                name: 'appAdd',

                meta: {
                    backs: [
                        {
                            path: '/app',
                            title: '手机'
                        }
                    ],
                    title: '新增手机',
                    perms: ['add']
                }
            }
        ],
        component: HeaderAsideLayout
    },
    {
        path: '/pc', //账号
        children: [
            {
                path: '',
                component: () => import('Views/Pc'),
                name: 'pc',
                meta: {
                    title: 'PC',
                    perms: ['add']
                }
            }
        ],
        component: HeaderAsideLayout
    },
    {
        path: '/vm', //虚拟机
        children: [
            {
                path: '',
                component: () => import('Views/Vm'),
                name: 'vm',
                meta: {
                    title: 'vm',
                    perms: ['add']
                }
            }
        ],
        component: HeaderAsideLayout
    },
    {
        path: '/print', //打印
        children: [
            {
                path: '',
                component: () => import('Views/Recircle/dialogs/print.vue'),
                name: 'print',
                meta: {
                    title: 'print',
                }
            }
        ],
        component: BlankLayout
    },
    {
        path: '/order', //订单
        children: [
            {
                path: 'list',
                component: () => import('Views/Order/List'),
                name: 'order',
                meta: {
                    title: '订单列表'
                }
            },
            {
                path: 'payment_record',
                component: () => import('Views/Order/PaymentRecord'),
                name: 'payment_record',
                meta: {
                    title: '付款记录'
                }
            },
            {
                path: 'account_list',
                component: () => import('Views/Order/AccountList'),
                name: 'account_list',
                meta: {
                    title: '账号列表'
                }
            }
        ],
        component: HeaderAsideLayout
    },
    // {
    //     path: '/recircle',
    //     component: HeaderAsideLayout,
    //     children: [
    //         {
    //             path: '',
    //             component: () => import('Views/Recircle'),
    //             name: 'recircle',
    //             meta: {
    //                 title: '商品回收',
    //                 perms: ['impt']
    //             }
    //         }
    //     ]
    // },
    {
        path: '/recharge',
        component: HeaderAsideLayout,
        children: [
            {
                path: 'ship',
                component: () => import('Views/Recharge'),
                name: 'recharge',
                meta: {
                    title: '充值'
                }
            },
            {
                path: 'record',
                component: () => import('Views/Recharge/record'),
                name: 'rechargeRecord',
                meta: {
                    title: '消费记录'
                }
            },
            {
                path: 'settings',
                component: () => import('Views/Recharge/settings'),
                name: 'rechargeSettings',
                meta: {
                    title: '充值设置'
                }
            }
        ]
    },
    {
        path: '/task', //任务

        children: [
            {
                path: '',
                component: () => import('Views/Task'),
                name: 'task',
                meta: {
                    title: '代理任务',
                    showParent: true
                }
            },
            {
                path: 'source',
                component: () => import('Views/Task/Source'),
                name: 'tasksource',
                meta: {
                    title: '任务'
                }
            },
            {
                path: 'al',
                component: () => import('Views/Task/Al'),
                name: 'taskAl',
                meta: {
                    title: '操作员任务'
                }
            },
            {
                path: 'feedback',
                component: () => import('Views/Feedback'),
                name: 'feedback',
                meta: {
                    title: '任务反馈',
                    backs: [
                        {
                            path: '/task/source',
                            title: '任务源'
                        }
                    ]
                }
            },
            {
                path: '/task/source/view',
                component: () => import('Views/Task/Source/viewTask.vue'),
                name: 'tasksourceview',
                meta: {
                    title: '查看任务',
                    backs: [
                        {
                            path: '/task/source',
                            title: '任务源'
                        }
                    ]
                }
            },
            {
                path: '/task/source/edit',
                component: () => import('Views/Task/Source/editTask.vue'),
                name: 'tasksourceedit',
                meta: {
                    title: '编辑任务',
                    backs: [
                        {
                            path: '/task/source',
                            title: '任务源'
                        }
                    ]
                }
            },
            {
                path: 'result',
                component: BlankLayout,
                // component: () => import('Views/Task/result'),
                // name: "taskResult",
                meta: {
                    title: '任务',
                    back: true,
                    url: 'task'
                },
                children: [
                    {
                        path: '',
                        component: () => import('Views/Task/result'),
                        name: 'taskResult',
                        meta: {
                            title: '任务结果'
                        }
                    },
                    {
                        path: 'account',
                        name: 'accountResult',
                        meta: {
                            backname: '任务结果',
                            title: '账号执行结果'
                        },
                        component: () => import('Views/Task/accountResult')
                    }
                ]
            },
            {
                path: 'add',
                component: () => import('Views/Task/AddTask'),
                name: 'taskAdd',
                meta: {
                    title: '新增任务'
                }
            },
            {
                path: 'edit',
                component: () => import('Views/Task/AddTask'),
                name: 'taskEdit',
                meta: {
                    title: '编辑任务'
                }
            },
            {
                path: 'clone',
                component: () => import('Views/Task/AddTask'),
                name: 'taskClone',
                meta: {
                    title: '克隆任务'
                }
            },
            {
                path: 'manual',
                component: () => import('Views/Task/AddTask'),
                name: 'taskManual',
                meta: {
                    title: '执行任务'
                }
            },
            {
                path: 'account_result',
                meta: {
                    title: '账号执行结果'
                },
                component: () => import('Views/Task/accountResult')
            }
        ],
        component: HeaderAsideLayout
    },
    {
        path: '/content_repository', //内容库
        children: [
            {
                path: 'evaluate',
                component: () => import('Views/ContentRepository/Evaluate'),
                name: 'evaluate',
                meta: {
                    title: '评价库'
                }
            },
            {
                path: 'qa',
                component: () => import('Views/ContentRepository/Qa'),
                name: 'qa',
                meta: {
                    title: '问答库'
                }
            },
            {
                path: 'message',
                component: () => import('Views/ContentRepository/Message'),
                name: 'message',
                meta: {
                    title: '站内信'
                }
            }
        ],
        component: HeaderAsideLayout
    },

    {
        path: '/email_settings', //邮箱设置
        meta: {
            title: '邮箱设置'
        },
        children: [
            {
                path: '',
                component: () => import('Views/EmailSettings'),
                name: 'emailSettings'
            }
        ],
        component: HeaderAsideLayout
    },
    // {
    //     path: '/error',
    //     component: HeaderAsideLayout,
    //     name: 'error',
    //     children: [
    //         {
    //             path: '404',
    //             component: () => import('Views/Error/404'),
    //             meta: {
    //                 title: '404'
    //             }
    //         },
    //         {
    //             path: 'empty',
    //             component: () => import('Views/Error/EmptyContent'),
    //             meta: {
    //                 title: '空页'
    //             }
    //         },
    //         {
    //             path: 'notpermission',
    //             component: () => import('Views/Error/NotPermission'),
    //             meta: {
    //                 title: '无权限'
    //             }
    //         }
    //     ]
    // },
    ...operator
]

const routerInstance = new Router({
    linkActiveClass: 'active',
    ...ROUTER_DEFAULT_CONFIG,
    routes
})

// 注入拦截器
routerInstance.beforeEach(routerBeforeEachFunc)

export default routerInstance
