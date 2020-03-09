import store from 'Store/index.js';

function getRoutes(next, to) {
    if (store.state.auth.hasPermsRoute) {
        return next();
    } else {
        store.dispatch('auth/getPermsRoutes').then(() => {
            console.log('注册路由成功');
            // next({ path: to.path, replace: true })
            return next({
                ...to,
                replace: true
            });
        });
    }
}

export async function routerBeforeEachFunc(to, from, next) {
    // console.log('全局前置路由导航', store.getters['auth/logged']);
    const whiteList = ['/', '/login', '/shopAuthorization'];
    // 这里可以做页面拦截，权限处理
    // 已经登录
    if (store.getters['auth/logged']) {
        if (to.path === '/login') {
            next({
                name: 'dash'
            });
        } else if (whiteList.indexOf(to.path) > -1) {
            // 无需权限的路由
            next();
        } else {
            // 如果从登录页过来，说明是刚登录的，不需要验证
            if (from.path == '/login') {
                await getRoutes(next, to);
            } else {
                // 验证用户是否是有效登录
                return store
                    .dispatch('auth/validate')
                    .then(async () => {
                        // console.log('验证登录有效');
                        // 如果是有效登录，请求动态路由并动态加载
                        await getRoutes(next, to);
                    })
                    .catch(() => {
                        // 如果登录失效，跳转到登录页
                        next('/login');
                    });
            }
        }
    } else {
        if (whiteList.indexOf(to.path) > -1) {
            next();
        } else {
            next({
                path: `/login`
            });
        }
    }
}
