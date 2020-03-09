import Layout from '@/components/Layout/Layout';
import BlankLayout from '@/components/Layout/blankLayout';

const salesManagement = {
    path: '/salesManagement',
    component: Layout,
    name: 'salesManagement',
    redirect: '/salesManagement/associatedSettings',
    meta: {
        title: "销售管理"
    },
    children: [{
            path: "/salesManagement/associatedSettings",
            component: () => import('@/views/Sales-Management/index'),
            redirect: '/salesManagement/associatedSettings/allOrderLists',
            name: "associatedSettings",
            meta: {
                title: "订单中心"
            },
            children: [{
                    path: '/salesManagement/associatedSettings/allOrderLists',
                    component: () => import('@/views/Sales-Management/associatedSettings/allOrderLists/index.vue'),
                    name: "allOrderLists",
                    meta: {
                        title: "所有订单列表"
                    },
                    children: [{
                        path: '/salesManagement/associatedSettings/allOrderLists/lookOver',
                        component: () => import('@/views/Sales-Management/associatedSettings/allOrderLists/lookOver/lookOver.vue'),
                        name: 'lookOver',
                        meta: {
                            title: '查看'
                        }
                    }],
                },
                {
                    path: '/salesManagement/associatedSettings/salesStatistics',
                    component: () => import('@/views/Sales-Management/associatedSettings/salesStatistics/index.vue'),
                    name: "salesStatistics",
                    meta: {
                        title: "销量统计"
                    }
                },
                {
                    path: '/salesManagement/associatedSettings/importOrder',
                    component: () => import('@/views/Sales-Management/associatedSettings/importOrder/index.vue'),
                    name: "importOrder",
                    meta: {
                        title: "批量导入订单"
                    }
                },
            ]
        },
        {
            path: "/salesManagement/orderCenter",
            component: () => import('@/views/Sales-Management/index'),
            redirect: '/salesManagement/orderCenter/userList',
            name: "orderCenter",
            meta: {
                title: "相关设置"
            },
            children: [{
                    path: '/salesManagement/orderCenter/userList',
                    component: () => import('@/views/Sales-Management/orderCenter/userList/index'),
                    name: "userList",
                    meta: {
                        title: "黑白名单用户"
                    }
                },
                {
                    path: '/salesManagement/orderCenter/modifyOrderForm',
                    component: () => import('@/views/Sales-Management/orderCenter/modifyOrderForm/index'),
                    name: "modifyOrderForm",
                    meta: {
                        title: "批量更改海外仓发货单号"
                    }
                },
                {
                    component: BlankLayout,
                    path: '/salesManagement/orderCenter/orderFormStrategy',

                    children: [{
                        path: '',
                        name: "orderFormStrategy",
                        meta: {
                            title: "订单策略"
                        },
                        component: () => import('@/views/Sales-Management/orderCenter/orderFormStrategy/index'),
                    }, {
                        path: 'add',
                        component: () => import('@/views/Sales-Management/orderCenter/orderFormStrategy/shipmentsStrategy/add'),
                        name: 'shipmentsStrategyAdd',
                        meta: {
                            title: '添加发货策略',
                            isLeaf: true
                        }
                    }, {
                        path: 'use',
                        component: () => import('@/views/Sales-Management/orderCenter/orderFormStrategy/shipmentsStrategy/use'),
                        name: 'useStrategy',
                        meta: {
                            title: '应用策略订单',
                            isLeaf: true
                        }
                    }]
                },
            ]
        },
        {
            path: "/salesManagement/EbaySaleManage",
            component: () => import('@/views/EbaySaleManage/index'),
            redirect: '/salesManagement/EbaySaleManage/Bragain',
            name: "EbaySaleManage",
            meta: {
                title: "eBay销售管理"
            },
            children: [{
                    path: "/salesManagement/EbaySaleManage/Bragain",
                    component: () => import('@/views/EbaySaleManage/Bragain'),
                    name: "Bragain",
                    meta: {
                        title: "议价"
                    }
                },
                {
                    path: "/salesManagement/EbaySaleManage/SalesActivityManage",
                    component: () => import('@/views/EbaySaleManage/SalesActivityManage'),
                    name: "SalesActivityManage",
                    meta: {
                        title: "促销活动管理"
                    }
                },
                {
                    path: "/salesManagement/EbaySaleManage/PaypalAccountManage",
                    component: () => import('@/views/EbaySaleManage/PaypalAccountManage'),
                    name: "PaypalAccountManage",
                    meta: {
                        title: "PayPal账户管理"
                    }
                },
                {
                    path: "/salesManagement/EbaySaleManage/GatheringAccountManage",
                    component: () => import('@/views/EbaySaleManage/GatheringAccountManage'),
                    name: "GatheringAccountManage",
                    meta: {
                        title: "收款账户管理"
                    }
                },
                {
                    path: "/salesManagement/EbaySaleManage/BusinessPolicy",
                    component: () => import('@/views/EbaySaleManage/BusinessPolicy'),
                    name: "BusinessPolicy",
                    meta: {
                        title: "业务政策"
                    }
                },
                {
                    path: "/salesManagement/EbaySaleManage/DescribleTemplate",
                    component: () => import('@/views/EbaySaleManage/DescribleTemplate'),
                    name: "DescribleTemplate",
                    meta: {
                        title: "描述模板"
                    }
                },
            ]
        }
    ]
}


export default salesManagement