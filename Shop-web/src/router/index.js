import Vue from 'vue'
import Router from 'vue-router'
import { routerBeforeEachFunc } from 'Config/interceptors/router';
const HeaderAsideLayout =  () => import('Layouts/HeaderAsideLayout')
// import HeaderAsideLayout from '@/layouts/HeaderAsideLayout';
// import shopRouter from './shopRouter/index';
// import ebayRouter from './ebayRouter';

// const currentRouter = (GLOBAL.routerType === 'ebay' ? ebayRouter : shopRouter) || []

Vue.use(Router)
let routes = [
    {
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
    // {
    //     path: '/test',
    //     component: () => import('Views/demo'),
    //     name: "test",
    //     meta: {
    //         title: "测试"
    //     }
    // },
    // {
    //     path: '/dash',
    //     children: [{
    //         path: '',
    //         component: () => import('Views/Dash'),
    //         name: "dash",
    //         meta: {
    //             title: "店铺首页"
    //         }
    //     }],
    //     component: HeaderAsideLayout,
    // },
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

    },
]


const createRouter  = ()=> new Router({
    linkActiveClass: 'active',
    routes,
});
const router = createRouter();

router.beforeEach(routerBeforeEachFunc);

//注销路由调用的方法
export function resetRouter () {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher;
}

export default router