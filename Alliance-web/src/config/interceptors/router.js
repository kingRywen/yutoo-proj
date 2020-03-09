import storage from 'Utils/saver';

export function routerBeforeEachFunc(to, from, next) {
    // 页面拦截
    const notRequiredTokens = GLOBAL.$const['OTHER/urlWhiteList']
    let token = storage.get('local', 'token')
    let token_a = storage.get('local', 'token_a')
    // let userInfo = storage.get('local', 'userInfo')

    // if (from.name === 'allotLogin' && to.name === 'allotTask' && token_a) {
    //     next()
    //     return
    // }

    // if (to.name === 'login' || to.name === 'allotLogin' || notRequiredTokens.indexOf(to.path) > -1) {
    //     next()
    //     return
    // }

    // // 如果是系统管理员，禁止访问 allotTask
    // if (userInfo && userInfo.isAdmin && to.name === 'allotTask') {
    //     next(false)
    //     return
    // }

    // // 如果是操作员，禁止访问其它路由
    // if (userInfo && !userInfo.isAdmin && to.name !== 'allotTask') {
    //     next(false)
    //     return 
    // }


    // if (to.name === 'login') {
    //     // 用户登出的时候停止定时器
    //     // GLOBAL.vbus.$emit('interval.stop.message', true)
    //     if ((token || token_a) && userInfo) {
    //         next({
    //             name: userInfo.isAdmin ? 'dash' : 'allotTask'
    //         })
    //         return
    //     } else {
    //         next({ name: 'login' })
    //     }
    //     next()
    //     return
    // }

    if (!token && !token_a && notRequiredTokens.indexOf(to.path) === -1) {
        next({
            path: '/login'
        })
        return
    }
    next()
}