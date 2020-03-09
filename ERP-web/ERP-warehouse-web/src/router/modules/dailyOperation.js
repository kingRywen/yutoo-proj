export default {
  path: '/dailyOperation/orderDeliveryPlan',
  component: () => import('@/views/warehouse/index'),
  name: 'dailyOperation',
  redirect: '/warehouse/dailyOperation/orderDeliveryPlan',
  meta: {
    title: '日常操作'
  },
  children: [
    {
      path: '/warehouse/dailyOperation/orderDeliveryPlan',
      component: () =>
        import('@/views/warehouse/dailyOperation/orderDeliveryPlan/index'),
      name: 'orderDeliveryPlan',
      meta: {
        title: '订单包裹发货计划'
      },
      children: [
        {
          path:
            '/warehouse/dailyOperation/orderDeliveryPlan/parcelSplitting/:id',
          component: () =>
            import('@/views/warehouse/dailyOperation/orderDeliveryPlan/parcelSplitting/index'),
          name: 'parcelSplitting',
          meta: {
            title: '包裹拆分'
          }
        }
      ]
    },
    {
      path: '/warehouse/dailyOperation/orderReplacement',
      component: () =>
        import('@/views/warehouse/dailyOperation/orderReplacement/index'),
      name: 'orderReplacement',
      meta: {
        title: '订单退换货管理'
      }
    },
    // {
    //   path: '/warehouse/dailyOperation/appEntrance',
    //   component: () =>
    //     import('@/views/warehouse/dailyOperation/appEntrance/index'),
    //   name: 'appEntrance',
    //   meta: {
    //     title: 'App入口'
    //   }
    // },
    {
      path: '/warehouse/dailyOperation/parcelReview',
      component: () =>
        import('@/views/warehouse/dailyOperation/parcelReview/index'),
      name: 'parcelReview',
      meta: {
        title: '包裹复核'
      }
    },
    {
      path: '/warehouse/dailyOperation/recommend',
      component: () =>
        import('@/views/warehouse/dailyOperation/recommend/index'),
      name: 'recommend',
      meta: {
        title: '推荐移库列表'
      }
    },
    {
      path: '/warehouse/dailyOperation/moveLibrary',
      component: () =>
        import('@/views/warehouse/dailyOperation/moveLibrary/index'),
      name: 'moveLibrary',
      meta: {
        title: '移库管理'
      }
    },
    {
      path: '/warehouse/dailyOperation/Inventory',
      component: () =>
        import('@/views/warehouse/dailyOperation/Inventory/index'),
      name: 'Inventory',
      meta: {
        title: '盘点管理'
      }
    }
  ]
}
