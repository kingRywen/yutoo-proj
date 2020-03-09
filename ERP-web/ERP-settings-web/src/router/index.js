import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout/Layout';
import BlankLayout from '@/components/Layout/blankLayout';
import CompanyManagement from './modules/CompanyManagement';

Vue.use(Router)
export default new Router({
    // mode: 'history',
    // base: process.env.BASE_URL,
    linkActiveClass: 'active',
    routes: [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('@/components/Layout/UserLogin.vue'),
        name: "login",
        meta: {
            title: "系统登录"
        }
    },
    {
        path: '/error',
        component: BlankLayout,
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

    },
        CompanyManagement,
    {
        path: '*',
        redirect: '/error/404'
    },
    ]
})