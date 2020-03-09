import Layout from '@/components/Layout/Layout'
const purchasingManagement = {
  path: '/purchasingManagement',
  component: Layout,
  name: 'purchasingManagement',
  redirect: '/purchasingManagement/procurement',
  meta: {
    title: '采购管理'
  },
  children: [
    {
      path: '/purchasingManagement/procurement',
      name: 'procurement',
      meta: {
        title: '采购单管理'
      },
      redirect: '/purchasingManagement/procurement/procurementList',
      component: () => import('@/views/Purchasing-Management/index'),
      children: [
        {
          path: '/purchasingManagement/procurement/procurementList',
          component: () =>
            import('@/views/Purchasing-Management/procurement/procurementList/index'),
          name: 'procurementList',
          meta: {
            title: '采购单管理列表'
          },
          children: [
            {
              path:
                '/purchasingManagement/procurement/procurementList/purchaseDetailed/',
              component: () =>
                import('@/views/Purchasing-Management/procurement/procurementList/detailedList/purchaseDetailed/index'),
              name: 'purchaseDetailed',
              meta: {
                title: '采购单详情'
              }
            },
            {
              path:
                '/purchasingManagement/procurement/procurementList/placeAnOrder/',
              component: () =>
                import('@/views/Purchasing-Management/procurement/procurementList/detailedList/placeAnOrder/index'),
              name: 'placeAnOrder',
              meta: {
                title: '采购下单'
              }
            }
          ]
        },
        {
          path: '/purchasingManagement/procurement/purchasingAbnormal',
          component: () =>
            import('@/views/Purchasing-Management/procurement/purchasingAbnormal/index'),
          name: 'purchasingAbnormal',
          meta: {
            title: '采购异常管理'
          }
        },
        {
          path: '/purchasingManagement/procurement/madeupArticles',
          component: () =>
            import('@/views/Purchasing-Management/procurement/madeupArticles/index'),
          name: 'madeupArticles',
          meta: {
            title: '成品加工单管理'
          },
          children: [
            {
              path:
                '/purchasingManagement/procurement/madeupArticles/purchaseDetailed/',
              component: () =>
                import('@/views/Purchasing-Management/procurement/procurementList/detailedList/purchaseDetailed/index'),
              name: 'madeupArticlespurchaseDetailed',
              meta: {
                title: '采购单详情'
              }
            }
          ]
        },
        {
          path: '/purchasingManagement/procurement/inventoryCheck',
          component: () =>
            import('@/views/Purchasing-Management/procurement/inventoryCheck/index'),
          name: 'inventoryCheck',
          meta: {
            title: '销单入库核对'
          },
          children: [
            {
              path:
                '/purchasingManagement/procurement/inventoryCheck/purchaseDetailed/',
              component: () =>
                import('@/views/Purchasing-Management/procurement/procurementList/detailedList/purchaseDetailed/index'),
              name: 'inventoryCheckpurchaseDetailed',
              meta: {
                title: '采购单详情'
              }
            }
          ]
        },
        {
          path: '/purchasingManagement/procurement/procurementId',
          component: () =>
            import('@/views/Purchasing-Management/procurement/procurementId/index'),
          name: 'procurementId',
          meta: {
            title: '采购财务账号管理'
          }
        }
      ]
    },
    {
      path: '/purchasingManagement/qualityTesting',
      name: 'qualityTesting',
      meta: {
        title: '质检管理'
      },
      redirect: '/purchasingManagement/qualityTesting/qualityTestingList',
      component: () => import('@/views/Purchasing-Management/index'),
      children: [
        {
          path: '/purchasingManagement/qualityTesting/qualityTestingList',
          name: 'qualityTestingList',
          meta: {
            title: '质检管理列表'
          },
          component: () =>
            import('@/views/Purchasing-Management/qualityTesting/qualityTestingList/index'),
          children: [
            {
              path:
                '/Purchasing-Management/qualityTesting/qualityTestingList/qualityTestingHandle',
              name: 'qualityTestingHandle',
              meta: {
                title: '质检操作'
              },
              component: () =>
                import('@/views/Purchasing-Management/qualityTesting/qualityTestingList/qualityTestingHandle')
            },
            {
              path:
                '/Purchasing-Management/qualityTesting/qualityTestingList/rejectsBack',
              name: 'rejectsBack',
              meta: {
                title: '不良品退回'
              },
              component: () =>
                import('@/views/Purchasing-Management/qualityTesting/qualityTestingList/rejectsBack')
            }
          ]
        },
        {
          path: '/purchasingManagement/qualityTesting/rejects',
          name: 'rejects',
          meta: {
            title: '不良品管理'
          },
          component: () =>
            import('@/views/Purchasing-Management/qualityTesting/rejects/index')
        }
      ]
    },
    {
      path: '/purchasingManagement/supplier',
      name: 'procurement',
      meta: {
        title: '供应商管理'
      },
      redirect: '/purchasingManagement/supplier/supplierList',
      component: () => import('@/views/Purchasing-Management/index'),
      children: [
        {
          path: '/purchasingManagement/supplier/supplierList',
          component: () =>
            import('@/views/Purchasing-Management/supplier/supplierList/index'),
          name: 'supplierList',
          meta: {
            title: '供应商管理列表'
          }
        },
        {
          path: '/purchasingManagement/supplier/purchaseSite',
          component: () =>
            import('@/views/Purchasing-Management/supplier/purchaseSite/index'),
          name: 'purchaseSite',
          meta: {
            title: '采购点管理'
          }
        },
        {
          path: '/purchasingManagement/supplier/paymentDays',
          component: () =>
            import('@/views/Purchasing-Management/supplier/paymentDays/index'),
          name: 'paymentDays',
          meta: {
            title: '供应商账期管理'
          }
        },
        {
          path: '/purchasingManagement/supplier/salesReturn',
          component: () =>
            import('@/views/Purchasing-Management/supplier/salesReturn/index'),
          name: 'salesReturn',
          meta: {
            title: '供应商退货管理'
          }
        }
      ]
    }
  ]
}

export default purchasingManagement
