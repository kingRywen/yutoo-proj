import Vue from 'vue'
import Router from 'vue-router'
import { ROUTER_DEFAULT_CONFIG } from 'Config/index'
import { routerBeforeEachFunc } from 'Config/interceptors/router'
// import path from 'path';
// import Layout from '@/Layout/Layout'
// import BlankLayout from '@/Layout/blankLayout'

Vue.use(Router)

// 动态生成路由
export const addRoutes = (data) => {
  console.log('动态生成路由');
}
// 移除生成的路由
export const resetRoutes = (data) => {
  console.log('移除生成的路由');
  
}


const importComponent = (component) => {
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
  })
  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      return h(AsyncComponent, data, children)
    },
  })
}

// 通用路由
const commonRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => importComponent(import(`Views/Login/src/UserLogin.vue`)),
    name: 'login',
    meta: {
      title: '系统登录'
    }
  },
  {
    path: '/dash',
    component: () => importComponent(import(`Layout/Layout.vue`)),
    // name: 'dash',
    meta: {
      title: '后台'
    },
    children: [
      {
        path: '/dash',
        component: () => importComponent(import(`Views/Demo/index.vue`)),
        name: 'dash',
        meta: {
          title: '演示'
        }
      },
      // {
      //   path: '/dash/demo',
      //   component: () => importComponent(import(`Views/Demo/index.vue`)),
      //   name: 'demo',
      //   meta: {
      //     title: '演示'
      //   }
      // }
    ]
  }
]

// 注入默认配置和路由表
let routerInstance = new Router({
  linkActiveClass: 'active',
  ...ROUTER_DEFAULT_CONFIG,
  routes: commonRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
// 注入拦截器
routerInstance.beforeEach(routerBeforeEachFunc)

export default routerInstance
