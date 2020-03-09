import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout/Layout'
import dailyOperation from './modules/dailyOperation'
import logisticsManagement from './modules/logisticsManagement'
import warehouseManagement from './modules/warehouseManagement'
import ReportCenter from './modules/ReportCenter'

Vue.use(Router)
export default new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: '/error/404'
    },
    {
      path: '/warehouse',
      component: Layout,
      name: 'warehouse',
      redirect: '/warehouse/dailyOperation/orderDeliveryPlan',
      meta: {
        title: '仓储物流管理'
      },
      children: [dailyOperation, warehouseManagement, logisticsManagement,ReportCenter]
    },
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
      children: [
        {
          path: '404',
          component: () => import('Views/Error/404'),
          meta: {
            title: '404'
          }
        },
        {
          path: 'empty',
          component: () => import('Views/Error/EmptyContent'),
          meta: {
            title: '空页'
          }
        },
        {
          path: 'notpermission',
          component: () => import('Views/Error/NotPermission'),
          meta: {
            title: '无权限'
          }
        }
      ]
    },
    
    {
      path: '/warehouse/dailyOperation/orderDeliveryPlan/codePrint',
      component: () =>
        import('@/views/warehouse/dailyOperation/orderDeliveryPlan/print/code'),
      name: 'codePrint'
    },
    {
      path: '/warehouse/dailyOperation/orderDeliveryPlan/print',
      component: () =>
        import('@/views/warehouse/dailyOperation/orderDeliveryPlan/print/index'),
      name: 'oDprint'
    },
    {
      path: '/warehouse/dailyOperation/Inventory/print',
      component: () =>
        import('@/views/warehouse/dailyOperation/Inventory/print'),
      name: 'inPrint'
    },
    {
      path: '/warehouse/warehouseManagement/pickingBasket/print',
      component: () =>
        import('@/views/warehouse/warehouseManagement/pickingBasket/print.vue'),
      name: 'pbPrint'
    },
    {
      path: '/warehouse/warehouseManagement/faceSheet/print',
      component: () => import('@/components/FaceSheet/print'),
      name: 'faceSheetPrint',
      meta: {
        title: '面单打印预览'
      }
    }
  ]
})
