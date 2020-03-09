//二级菜单
export const submenu = {
  warehouse: [
    {
      name: '日常操作',
      path: '/dailyOperation/orderDeliveryPlan',
      icon: '',
      children: [
        {
          name: '订单包裹发货计划',
          path: '/warehouse/dailyOperation/orderDeliveryPlan'
        },
        {
          name: '订单退换货管理',
          path: '/warehouse/dailyOperation/orderReplacement'
        },
        // {
        //   name: 'App入口',
        //   path: '/warehouse/dailyOperation/appEntrance'
        // },
        {
          name: '包裹复核',
          path: '/warehouse/dailyOperation/parcelReview'
        },
        {
          name: '推荐移库列表',
          path: '/warehouse/dailyOperation/recommend'
        },
        {
          name: '移库管理',
          path: '/warehouse/dailyOperation/moveLibrary'
        },
        {
          name: '盘点管理',
          path: '/warehouse/dailyOperation/Inventory'
        }
      ]
    },
    {
      name: '仓库管理',
      path: '/warehouseManagement/subwarehouse',
      icon: '',
      children: [
        {
          name: '仓库管理列表',
          path: '/warehouse/warehouseManagement/subwarehouse'
        },
        {
          name: '库位管理',
          path: '/warehouse/warehouseManagement/storehouse'
        },
        {
          name: '拣货机管理',
          path: '/warehouse/warehouseManagement/pickingMachine'
        },
        {
          name: '拣货篮管理',
          path: '/warehouse/warehouseManagement/pickingBasket'
        },
        {
          name: '拣货篮位置管理',
          path: '/warehouse/warehouseManagement/pickingBasketLocation'
        },
        {
          name: '所有产品库存',
          path: '/warehouse/warehouseManagement/productsStock'
        },
        {
          name: '面单管理',
          path: '/warehouse/warehouseManagement/faceSheet'
        },
        {
          name: '发票管理',
          path: '/warehouse/warehouseManagement/invoice'
        },
        {
          name: '人员管理',
          path: '/warehouse/warehouseManagement/personnel'
        }
      ]
    },
    {
      name: '物流管理',
      path: '/logisticsManagement/freight',
      icon: '',
      children: [
        {
          name: '运费查询',
          path: '/warehouse/logisticsManagement/freight'
        },
        {
          name: '运输方式管理',
          path: '/warehouse/logisticsManagement/transportMode'
        },
        {
          name: '运输商管理',
          path: '/warehouse/logisticsManagement/transportAgent'
        },
        {
          name: '运输商运输方式',
          path: '/warehouse/logisticsManagement/transportAgenType'
        },
        {
          name: '区域管理',
          path: '/warehouse/logisticsManagement/region'
        },
        {
          name: '申报管理',
          path: '/warehouse/logisticsManagement/declare'
        },
        {
          name: '头程运输方式管理',
          path: '/warehouse/logisticsManagement/headTransportMode'
        }
      ]
    },
    {
      name: '报告中心',
      path: '/ReportCenter',
      icon: '',
      children: [
        {
          name: '中心',
          path: '/ReportCenter/index'
        }
      ]
    }
  ]
}
