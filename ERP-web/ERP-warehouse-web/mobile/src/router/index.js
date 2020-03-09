import Vue from 'vue'
import Router from 'vue-router'
import blankLayout from '@/components/Layouts/blank-layout'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: () => import('@/views/common/login.vue')
    },
    {
      path: '/choseWarehouse',
      name: 'choseWarehouse',
      component: () => import('@/views/common/choseWarehouse.vue')
    },
    {
      path: '/app',
      name: 'app',
      redirect: '/app/menu',
      component: () => import('@/views/common/header.vue'),
      children: [{
          path: 'menu',
          name: 'menu',
          component: () => import('@/views/menu'),
          meta: {
            title: '功能菜单'
          }
        },
        {
          path: 'purchase',
          name: 'purchase',
          component: () => import('@/views/purchase'),
          meta: {
            title: '采购入库'
          }
        },
        {
          path: 'storageTransfer',
          name: 'storageTransfer',
          component: () => import('@/views/storageTransfer'),
          meta: {
            title: '库位转移'
          }
        },
        {
          path: 'warehousing',
          name: 'warehousing',
          component: () => import('@/views/warehousing'),
          meta: {
            title: '入库'
          }
        },
        {
          path: 'salesReturn',
          name: 'salesReturn',
          component: () => import('@/views/salesReturn'),
          meta: {
            title: '退货入库'
          }
        },
        {
          path: 'stocking',
          name: 'stocking',
          component: () => import('@/views/stocking'),
          meta: {
            title: '盘点'
          }
        },
        {
          path: 'pickingTask',
          name: 'pickingTask',
          component: () => import('@/views/pickingTask'),
          meta: {
            title: '拣货任务'
          }
        },
        {
          path: 'packagingCheck',
          name: 'packagingCheck',
          component: () => import('@/views/packagingCheck'),
          meta: {
            title: '打包核对'
          }
        },
        {
          path: 'qualityTesting',
          name: 'qualityTesting',
          component: () => import('@/views/qualityTesting'),
          meta: {
            title: '质检'
          }
        },
        {
          path: 'sorting',
          name: 'sorting',
          component: () => import('@/views/sorting'),
          meta: {
            title: '分拣'
          }
        }
        // {
        //   path: 'correlation',
        //   name: 'correlation',
        //   component: () => import('@/views/correlation')
        // },
        // {
        //   path: 'recommendLabrary',
        //   name: 'recommendLabrary',
        //   component: () => import('@/views/recommendLabrary')
        // },
        // {
        //   path: 'inventoryPlan',
        //   name: 'inventoryPlan',
        //   component: () => import('@/views/inventoryPlan')
        // },
        // {
        //   path: 'stockingPlan',
        //   name: 'stockingPlan',
        //   component: () => import('@/views/stockingPlan')
        // }
      ]
    },
    //
    {
      path: '/app/nav',
      name: 'correlations',
      component: blankLayout,
      redirect: '/app/nav/correlation',
      children: [{
          path: '/app/nav/correlation',
          name: 'correlation',
          component: () => import('@/views/correlation')
        },
        {
          path: '/app/nav/recommendLabrary',
          name: 'recommendLabrary',
          component: () => import('@/views/recommendLabrary')
        },
        {
          path: '/app/nav/inventoryPlan',
          name: 'inventoryPlan',
          component: () => import('@/views/inventoryPlan')
        },
        {
          path: '/app/nav/stockingPlan',
          name: 'stockingPlan',
          component: () => import('@/views/stockingPlan')
        }
      ]
    }
  ]
})
