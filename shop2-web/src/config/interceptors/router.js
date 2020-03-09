import store from "Store/index.js";
import { getPlatformInfo } from "Layout/components/NavBar.vue";

/**
 * 判断是否权限路由
 * @param {String} path 路由路径
 */
export function isNotPermRoutes(path) {
  const whiteList = [
      "/",
      "/login",
      // "/shopAuth",
      "/empty",
      "/networkError",
      "/407"
    ],
    whiteListRegs = [/^\/helps\/.*$/];
  return (
    whiteList.indexOf(path) > -1 || whiteListRegs.some(reg => reg.test(path))
  );
}

async function getRoutes(next, to) {
  if (store.state.auth.hasPermsRoute) {
    return next();
  } else {
    try {
      let { platformId } = await getPlatformInfo();
      // console.log(platformId);

      store.dispatch("auth/getPermsRoutes", platformId).then(() => {
        console.log("注册路由成功");
        // next({ path: to.path, replace: true })
        return next({
          ...to,
          replace: true
        });
      });
    } catch (error) {
      // console.log(error)
      if (error.code == 401) {
        return next({ path: "/login", replace: true });
      }
      return next({
        path: "/networkError",
        replace: true,
        query: { back: to.fullPath }
      });
    }
  }
}

export async function routerBeforeEachFunc(to, from, next) {
  // 这里可以做页面拦截，权限处理
  // 已经登录
  // debugger
  if (store.getters["auth/logged"]) {
    if (to.path === "/login") {
      next({
        name: "dash"
      });
    } else if (isNotPermRoutes(to.path)) {
      // 无需权限的路由
      next();
    } else {
      // 如果从登录页过来，说明是刚登录的，不需要验证
      if (from.path == "/login") {
        await getRoutes(next, to);
      } else {
        // 验证用户是否是有效登录
        return store
          .dispatch("auth/validate")
          .then(async () => {
            // console.log('验证登录有效');
            // 如果是有效登录，请求动态路由并动态加载
            await getRoutes(next, to);
          })
          .catch(() => {
            // 如果登录失效，跳转到登录页
            return next({ path: "/login", replace: true });
          });
      }
    }
  } else {
    if (isNotPermRoutes(to.path)) {
      next();
    } else {
      return next({ path: "/login", replace: true });
    }
  }
}
