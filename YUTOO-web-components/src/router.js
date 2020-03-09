import VueRouter from 'vue-router'
import Vue from 'vue'
import navConfig from '../examples/nav.config'
import Component from '../examples/components/component'
Vue.use(VueRouter)

const LOAD_DOCS_MAP = path => {
  return r => require.ensure([], () =>
    r(require(`../examples/docs${path}.md`)),
  'zh-CN')
}

let children = [
  
]

navConfig[0].groups.forEach(el => {
  el.list.forEach(lis => {
    children.push({
      path: `/component${lis.path}`,
      name: lis.title,
      component: LOAD_DOCS_MAP(lis.path)
    })
  })
})

navConfig[1].groups.forEach(el => {
  el.list.forEach(lis => {
    children.push({
      path: `/component${lis.path}`,
      name: lis.title,
      component: LOAD_DOCS_MAP(lis.path)
    })
  })
})

const routes = [
  {
    path: '/',
    redirect: '/component/table'
  },
  {
    path: '/login',
    component: () => import('Views/Login'),
    name: 'login',
    meta: {
      title: '系统登录'
    }
  },
  {
    path: '/component',
    component: Component,
    children
  }
]

console.log(routes)

const router = new VueRouter({
  routes
})

export default router
