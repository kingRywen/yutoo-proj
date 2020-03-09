import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout/Layout'
import salesManagement from './modules/salesManagement'
import purchasingManagement from './modules/purchasingManagement'

Vue.use(Router)
export default new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@/components/Layout/UserLogin.vue'),
      name: 'login',
      meta: {
        title: '系统登录'
      }
    },
    {
      path: '/error',
      component: Layout,
      name: 'error',
      meta: {
        title: '错误'
      },
      children: [
        {
          path: '/404',
          component: () => import('@/views/Error/404.vue')
        },
        {
          path: '/network',
          component: () => import('@/views/Error/network.vue')
        }
      ]
    },
    {
      path: '/print',
      component: () => import('@/components/print/index.vue'),
      name: 'print',
      meta: {
        title: '打印'
      }
    },
    {
      path: '/salesManagement/EbaySaleManage/DescribleTemplate/H5edit',
      component: () =>
        import('@/views/EbaySaleManage/DescribleTemplate/H5edit/index.vue'),
      name: 'H5edit',
      meta: {
        title: '添加模板'
      }
    },
    {
      path: '/salesManagement/EbaySaleManage/DescribleTemplate/H5edit/preview',
      component: () =>
        import('@/views/EbaySaleManage/DescribleTemplate/H5edit/preview.vue'),
      name: 'preview',
      meta: {
        title: '模板预览'
      }
    },
    salesManagement,
    purchasingManagement
  ]
})
