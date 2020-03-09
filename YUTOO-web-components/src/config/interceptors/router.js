export function routerBeforeEachFunc(to, from, next) {
	//拉取local的账号id
	let userName = JSON.parse(localStorage.getItem("YUTOO.SHOP_username") || '[]')
    // 这里可以做页面拦截
    // console.log(to, from);
    const whiteList = ['/', '/login', '/dash', '/shopAuthorization']
    if (whiteList.indexOf(to.path) === -1 && to.path.indexOf('/error/') === -1 && !localStorage.getItem('shop_seller_data') && userName!=='admin') {
        next('/error/notpermission')
        return
    }
    next()
}