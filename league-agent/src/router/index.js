import Vue from 'vue';
import Router from 'vue-router';
// import camelCase from 'lodash/camelCase';
import { ROUTER_DEFAULT_CONFIG } from 'Config/index';
import { routerBeforeEachFunc } from 'Config/interceptors/router';
import asyncRouter from './asyncRouter';
import routerMap from './routerMap';
import store from 'Store';

Vue.use(Router);

export const importComponent = component => {
    const AsyncComponent = () => ({
        // 需要加载的组件 (应该是一个 `Promise` 对象)
        component,
        // 异步组件加载时使用的组件
        loading: require('Components/LoadingComponent').default,
        // 加载失败时使用的组件
        error: require('Components/ErrorComponent').default,
        // 展示加载时组件的延时时间。默认值是 200 (毫秒)
        delay: 400,
        // 如果提供了超时时间且组件加载也超时了，
        // 则使用加载失败时使用的组件。默认值是：`Infinity`
        timeout: 10000
    });
    return Promise.resolve({
        functional: true,
        render(h, { data, children }) {
            return h(AsyncComponent, data, children);
        }
    });
};

// 通用路由
const commonRoutes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () =>
            importComponent(import(`Views/Login/src/UserLogin.vue`)),
        name: 'login',
        meta: {
            title: '系统登录'
        }
    },
    {
        name: 'findPass',
        path: '/findPass',
        component: () =>
            importComponent(import(`Views/FindPass`)),
        meta: {
            title: '找回密码'
        }
    },
    {
        name: 'register',
        path: '/register',
        component: () =>
            importComponent(import(`Views/Register`)),
        meta: {
            title: '注册'
        }
    },
    {
        path: '/dash',
        component: () => importComponent(import(`Layout/Layout.vue`)),
        // name: 'dash',
        meta: {
            title: '后台',

        },
        children: [
            {
                path: '',
                component: () =>
                    importComponent(import(`Views/Dash/index.vue`)),
                name: 'dash',
                meta: {
                    title: '首页',
                    perms: ['subscribe']
                }
            },

            {
                path: '/demo',
                component: () =>
                    importComponent(import(`Views/Demo/index.vue`)),
                name: 'demo',
                meta: {
                    title: '演示'
                }
            }
        ]
    },
    {
        path: '/407',
        name: 'error_407',
        meta: {
            hideInMenu: true
        },
        component: () => importComponent(import(`Views/Error/NotPermission`))
    },
    {
        path: '/empty',
        name: 'error_empty',
        meta: {
            hideInMenu: true
        },
        component: () => importComponent(import(`Views/Error/EmptyContent`))
    }
];

const createRouter = () =>
    new Router({
        linkActiveClass: 'active',
        ...ROUTER_DEFAULT_CONFIG,
        routes: commonRoutes,
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition;
            } else {
                return {
                    x: 0,
                    y: 0
                };
            }
        }
    });

// 注入默认配置和路由表
let routerInstance = createRouter();

// 展开后端传过来的路由
function expandRoutes(
    data,
    tree = {
        topMenu: {}
    },
    parent,
    path = '',
    _level = 0,
    menuChild = {}
) {
    function addSingle(el, path) {
        let p = path + el.path;
        let pname = p.split('/').filter(el => el !== ''),
            component = routerMap;
        while (pname.length) {
            component = component[pname.shift()];
        }
        let route = {
            ...el,
            component: el.leaf ? component.default : component,
            path: p,
            meta: {
                name: el.name
            }
        };
        if (el.leaf) {
            delete route.children;
        }

        route.meta.width = el.width;
        if (route.keep) {
            route.meta['keep'] = route.keep;
        }
        if (el.hideHeader) {
            route.meta.__hideHeader = el.hideHeader;
        }
        // 注入权限
        route.meta.perms = el.perms || [];
        if (el.isSubMenu || el.showSubMenu) {
            // 设置子菜单 这个属性用来识别子菜单
            route.meta.showSubMenuState = el.showSubMenu || path;

            if (el.isSubMenu) {
                subMenu.push({
                    ...route,
                    tabName: el.path.replace('/', '')
                });
            }
        }

        (
            tree[el.layout ? el.layout : 'default'] ||
            (tree[el.layout ? el.layout : 'default'] = [])
        ).push(route);
    }

    let subMenu = [];
    data.forEach(el => {
        let index = el.path.replace('/', ''),
            mainMenu = {
                name: el.topMenuname || el.name,
                activeIndex: index
            };

        if (el.leaf) {
            addSingle(el, path);
        }

        if (el.children) {
            mainMenu.children = [];
            expandRoutes(
                el.children,
                tree,
                el,
                path + el.path,
                _level++,
                mainMenu
            );
        } else {
            addSingle(el, path);
        }

        if (el.homePath) {
            mainMenu.url = el.homePath;
        } else {
            mainMenu.url = path + el.path;
            mainMenu.desc = el.desc;
        }

        // 设置主菜单项
        if (el.homePath) {
            menuChild[index] = mainMenu;
        } else if (el.showTop) {
            if (typeof el.showTop === 'string') {
                mainMenu.url = el.showTop;
            }
            menuChild.children.push(mainMenu);
        }
    });

    if (subMenu.length) {
        store.commit('auth/SET_SUBMENU', {
            path,
            subMenu: subMenu.map(el => {
                // eslint-disable-next-line no-unused-vars
                let { component, ...info } = el;
                return info;
            })
        });
    }
    return { tree, menuChild };
}

// 动态生成路由
export function addRoutes(data = asyncRouter) {

    let { tree: routesObj, menuChild } = expandRoutes(asyncRouter),
        routes = [],
        page404 = {
            path: '*',
            name: 'error_404',
            meta: {
                hideInMenu: true
            },
            component: () => importComponent(import(`Views/Error/404`))
        };

    store.commit('auth/SET_MAINMENU', menuChild);

    Object.keys(routesObj).forEach(key => {
        if (key === 'topMenu') {
            return;
        }
        routes.push({
            path: key,
            component: routerMap.layout[key],
            children: routesObj[key]
        });
    });

    routes.push(page404);

    routerInstance.addRoutes(routes);
}
// 移除生成的路由
export function resetRoutes() {
    const newRouter = createRouter();
    routerInstance.matcher = newRouter.matcher;
}

// 注入拦截器
routerInstance.beforeEach(routerBeforeEachFunc);

export default routerInstance;
