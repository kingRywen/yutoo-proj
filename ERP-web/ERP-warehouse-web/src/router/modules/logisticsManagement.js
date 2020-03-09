export default {
  path: '/logisticsManagement/freight',
  component: () => import('@/views/warehouse/index'),
  name: 'logisticsManagement',
  redirect: '/warehouse/logisticsManagement/freight',
  meta: {
    title: '物流管理'
  },
  children: [
    {
      path: '/warehouse/logisticsManagement/freight',
      component: () =>
        import('@/views/warehouse/logisticsManagement/freight/index'),
      name: 'freight',
      meta: {
        title: '运费查询'
      }
    },
    {
      path: '/warehouse/logisticsManagement/transportMode',
      component: () =>
        import('@/views/warehouse/logisticsManagement/transportMode/index'),
      name: 'transportMode',
      meta: {
        title: '运输方式管理'
      }
    },
    {
      path: '/warehouse/logisticsManagement/transportAgent',
      component: () =>
        import('@/views/warehouse/logisticsManagement/transportAgent/index'),
      name: 'transportAgent',
      meta: {
        title: '运输商管理'
      }
    },
    {
      path: '/warehouse/logisticsManagement/transportAgenType',
      component: () =>
        import('@/views/warehouse/logisticsManagement/transportAgenType/index'),
      name: 'transportAgenType',
      meta: {
        title: '运输商运输方式'
      }
    },
    {
      path: '/warehouse/logisticsManagement/region',
      component: () =>
        import('@/views/warehouse/logisticsManagement/region/index'),
      name: 'region',
      meta: {
        title: '区域国家管理'
      }
    },
    {
      path: '/warehouse/logisticsManagement/declare',
      component: () =>
        import('@/views/warehouse/logisticsManagement/declare/index'),
      name: 'declare',
      meta: {
        title: '申报管理'
      }
    },
    {
      path: '/warehouse/logisticsManagement/headTransportMode',
      component: () =>
        import('@/views/warehouse/logisticsManagement/headTransportMode/index'),
      name: 'headTransportMode',
      meta: {
        title: '头程运输方式管理'
      }
    }
  ]
}
