import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
  
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/', redirect: '/home/index', hidden: true },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    name: 'Home',
    children: [
      {
        path: 'index',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'home' } // icon svb 16
      }
    ]
  },
  {
    path: '/sysSetup',
    component: Layout,
    redirect: '/sysSetup/payment',
    name: 'SysSetup',
    meta: { title: '系统设置', icon: 'setUp' },
    children: [
      {
        path: 'payment',
        name: 'Payment',
        component: () => import('@/views/sysSetup/payment'),
        meta: { title: '支付接口设置'}
      },
      {
        path: 'smsTpl',
        name: 'SmsTpl',
        component: () => import('@/views/sysSetup/SmsTpl'),
        meta: { title: '短信模板设置'}
      }
    ]
  },
  {
    path: '/organize',
    component: Layout,
    redirect: '/organize/roles',
    name: 'Organize',
    meta: { title: '组织管理', icon: 'user' },
    children: [
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/organize/organization'), // organization switch v-model
        meta: { title: '组织机构管理'}
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/organize/roles'),
        meta: { title: '角色权限管理'}
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/organize/user'),
        meta: { title: '操作人员管理'}
      }
    ]
  },
  {
    path: '/setMeal',
    component: Layout,
    redirect: '/setMeal/productManage',
    name: 'SetMeal',
    meta: { title: '套餐管理', icon: 'setMeal' },
    children: [
      {
        path: 'productManage',
        name: 'ProductManage',
        component: () => import('@/views/setMeal/ProductManage'),
        meta: { title: '产品管理'}
      },
      {
        path: 'productFunction',
        name: 'ProductFunction',
        component: () => import('@/views/setMeal/ProductFunction'),
        meta: { title: '产品功能管理'}
      },
      {
        path: 'monthlySetMeal',
        name: 'MonthlySetMeal',
        component: () => import('@/views/setMeal/MonthlySetMeal'),
        meta: { title: '包月套餐管理'}
      },
      {
        path: 'inSequenceSetMeal',
        name: 'InSequenceSetMeal',
        component: () => import('@/views/setMeal/InSequenceSetMeal'),
        meta: { title: '按次套餐管理'}
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    redirect: '/member/memberManagement',
    name: 'Member',
    meta: { title: '会员中心', icon: 'member' },
    children: [
      {
        path: 'memberManagement',
        name: 'MemberManagement',
        component: () => import('@/views/member/MemberManagement'),
        meta: { title: '会员管理'}
      },
      {
        path: 'orderManagement',
        name: 'OrderManagement',
        component: () => import('@/views/member/OrderManagement'),
        meta: { title: '订单管理'}
      },
      {
        path: 'memberProducts',
        name: 'MemberProducts',
        component: () => import('@/views/member/MemberProducts'),
        meta: { title: '会员管理'},
        hidden: true,
      },
      {
        path: 'record',
        name: 'Record',
        component: () => import('@/views/member/record'),
        meta: { title: '会员管理'},
        hidden: true
      }
    ]
  },
  // {
  //   path: '/lexicon',
  //   component: Layout,
  //   redirect: '/lexicon/roles',
  //   name: 'Lexicon',
  //   meta: { title: '关键词库', icon: 'crux' },
  //   children: [
  //     {
  //       path: 'flow',
  //       name: 'Flow',
  //       component: () => import('@/views/lexicon/flow'),
  //       meta: { title: '关键词流量库'}
  //     },
  //     {
  //       path: 'crux',
  //       name: 'Crux',
  //       component: () => import('@/views/lexicon/crux'),
  //       meta: { title: '关键词词库'}
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
