import Vue from 'vue'
import Router from 'vue-router'

import HeaderAsideLayout from 'Layouts/HeaderAsideLayout';
import BlankLayout from 'Layouts/blankLayout';

Vue.use(Router)
let routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('Views/Login'),
        name: "login",
        meta: {
            title: "系统登录"
        }
    },
    {
        path: '/dash',
        children: [{
            path: '',
            component: () => import('Views/Dash'),
            name: "dash",
            meta: {
                title: "类目"
            }
        }],
        component: HeaderAsideLayout,
    },
    {
        path: '/identification', //账号
        children: [{
            path: '',
            component: () => import('Views/Identification'),
            name: "identification",
            meta: {
                title: "账号"
            }
        }],
        component: HeaderAsideLayout,
    },
    {
        path: '/order', //订单
        children: [{
            path: 'list',
            component: () => import('Views/Order/List'),
            name: "order",
            meta: {
                title: "订单列表"
            }
        }, {
            path: 'payment_record',
            component: () => import('Views/Order/PaymentRecord'),
            name: "payment_record",
            meta: {
                title: "付款记录"
            }
        }, {
            path: 'account_list',
            component: () => import('Views/Order/AccountList'),
            name: "account_list",
            meta: {
                title: "账号列表"
            }
        }],
        component: HeaderAsideLayout,
    },
    {
        path: '/task', //任务

        children: [{
            path: '',
            component: () => import('Views/Task'),
            name: "task",
            meta: {
                title: "任务",
                showParent: true
            },
        }, {
            path: 'result',
            component: BlankLayout,
            // component: () => import('Views/Task/result'),
            // name: "taskResult",
            meta: {
                title: "任务",
                back: true,
                url: '/task'
            },
            children: [{
                path: '',
                component: () => import('Views/Task/result'),
                name: "taskResult",
                meta: {
                    title: "任务结果"
                }
            }, {
                path: 'account',
                name: 'accountResult',
                meta: {
                    backname: '任务结果',
                    title: "账号执行结果"
                },
                component: () => import('Views/Task/accountResult'),
            }]
        }, {
            path: 'add',
            component: () => import('Views/Task/AddTask'),
            name: "taskAdd",
            meta: {
                title: "新增任务"
            }
        }, {
            path: 'edit',
            component: () => import('Views/Task/AddTask'),
            name: "taskEdit",
            meta: {
                title: "编辑任务"
            }
        }, {
            path: 'account_result',
            meta: {
                title: "账号执行结果"
            },
            component: () => import('Views/Task/accountResult'),

        }],
        component: HeaderAsideLayout,
    },
    {
        path: '/content_repository', //内容库
        children: [{
            path: 'evaluate',
            component: () => import('Views/ContentRepository/Evaluate'),
            name: "evaluate",
            meta: {
                title: "评价库"
            }
        }, {
            path: 'qa',
            component: () => import('Views/ContentRepository/Qa'),
            name: "qa",
            meta: {
                title: "问答库"
            }
        }, {
            path: 'message',
            component: () => import('Views/ContentRepository/Message'),
            name: "message",
            meta: {
                title: "站内信"
            }
        }],
        component: HeaderAsideLayout,
    },
    {
        path: '/email_settings', //邮箱设置
        meta: {
            title: "邮箱设置"
        },
        children: [{
            path: '',
            component: () => import('Views/EmailSettings'),
            name: "emailSettings",
        }],
        component: HeaderAsideLayout,
    },
    {
        path: '/error',
        component: HeaderAsideLayout,
        name: "error",
        children: [{
            path: '404',
            component: () => import('Views/Error/404'),
            meta: {
                title: "404"
            }
        }, {
            path: 'empty',
            component: () => import('Views/Error/EmptyContent'),
            meta: {
                title: "空页"
            }
        }, {
            path: 'notpermission',
            component: () => import('Views/Error/NotPermission'),
            meta: {
                title: "无权限"
            }
        }],

    }
]


const router = new Router({
    linkActiveClass: 'active',
    routes,
})

export default router