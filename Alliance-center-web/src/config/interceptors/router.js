import storage from 'Utils/saver';

export function routerBeforeEachFunc(to, from, next) {
    // 页面拦截
    const notRequiredTokens = GLOBAL.$const['OTHER/urlWhiteList']
    let token = storage.get('local', 'token')
    if (to.name === 'login') {
        // 用户登出的时候停止定时器
        // GLOBAL.vbus.$emit('interval.stop.message', true)
        if (token) {
            next({
                name: 'Country'
            })
            return
        }
        next()
        return
    }

    if (!token && notRequiredTokens.indexOf(to.path) === -1) {
        next({
            path: '/login'
        })
        return
    }

    next()
}