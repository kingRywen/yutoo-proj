export default {
  path: '/warehouseManagement/subwarehouse',
  component: () => import('@/views/warehouse/index'),
  name: 'warehouseManagement',
  redirect: '/warehouse/warehouseManagement/subwarehouse',
  meta: {
    title: '仓库管理'
  },
  children: [
    {
      path: '/warehouse/warehouseManagement/subwarehouse',
      component: () =>
        import('@/views/warehouse/warehouseManagement/subwarehouse/Layout'),
      name: 'subwarehouse',
      meta: {
        title: '仓库管理列表'
      },
      children: [
        {
          path: 'print/:wmWarehouseId',
          props: true,
          component: () =>
            import('@/views/warehouse/warehouseManagement/subwarehouse/PrintLayout'),
          name: 'subwarehousePrintLayout',
          meta: {
            title: '打印布局图'
          }
        }
      ]
    },
    {
      path: '/warehouse/warehouseManagement/storehouse',
      component: () =>
        import('@/views/warehouse/warehouseManagement/storehouse/index'),
      name: 'storehouse',
      meta: {
        title: '库位管理'
      }
    },
    {
      // 打印条码
      path: '/warehouse/warehouseManagement/storehouse/printCode/:id',
      component: () =>
        import('@/views/warehouse/warehouseManagement/storehouse/components/PrintCode'),
      name: 'storehousePrintCode',
      props: true
    },
    {
      // 打印强电
      path:
        '/warehouse/warehouseManagement/storehouse/printPlugSpecification/:id',
      component: () =>
        import('@/views/warehouse/warehouseManagement/productsStock/components/PrintPlugSpecification'),
      name: 'printPlugSpecification',
      props: true
    },

    {
      path: '/warehouse/warehouseManagement/pickingMachine',
      component: () =>
        import('@/views/warehouse/warehouseManagement/pickingMachine/index'),
      name: 'pickingMachine',
      meta: {
        title: '拣货机管理'
      }
    },
    {
      path: '/warehouse/warehouseManagement/pickingBasket',
      component: () =>
        import('@/views/warehouse/warehouseManagement/pickingBasket/index'),
      name: 'pickingBasket',
      meta: {
        title: '拣货篮管理'
      }
    },
    {
      path: '/warehouse/warehouseManagement/pickingBasketLocation',
      component: () =>
        import('@/views/warehouse/warehouseManagement/pickingBasketLocation/index'),
      name: 'pickingBasketLocation',
      meta: {
        title: '拣货篮位置管理'
      }
    },
    {
      path: '/warehouse/warehouseManagement/productsStock',
      component: () =>
        import('@/views/warehouse/warehouseManagement/productsStock/index'),
      name: 'productsStock',
      meta: {
        title: '所有产品库存'
      }
    },
    {
      path: '/warehouse/warehouseManagement/faceSheet',
      component: () =>
        import('@/views/warehouse/warehouseManagement/faceSheet/index'),
      name: 'faceSheet',
      meta: {
        title: '面单管理'
      }
    },
    {
      // 面单预览
      path:
        '/warehouse/warehouseManagement/faceSheet/preview/:id/:modelType/:url',
      component: () => import('@/components/FaceSheet/FaceSheetPreview'),
      name: 'faceSheetPreview',
      props: true
    },
    {
      path: '/warehouse/warehouseManagement/invoice',
      component: () =>
        import('@/views/warehouse/warehouseManagement/invoice/index'),
      name: 'invoice',
      meta: {
        title: '发票管理'
      }
    },
    {
      path: '/warehouse/warehouseManagement/personnel',
      component: () =>
        import('@/views/warehouse/warehouseManagement/personnel/index'),
      name: 'personnel',
      meta: {
        title: '人员管理'
      }
    }
  ]
}
