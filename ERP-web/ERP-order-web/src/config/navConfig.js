//一级菜单
export const menu = [{
        name: "销售管理",
        path: "/salesManagement",
        icon: ''
    },
    {
        name: "采购管理",
        path: "/purchasingManagement",
        icon: ''
    }
]

//二级菜单
export const submenu = {
    salesManagement: [{
            name: "订单中心",
            path: '/salesManagement/associatedSettings',
            icon: "",
            children: [{
                    name: "所有订单列表",
                    path: "/salesManagement/associatedSettings/allOrderLists"
                },
                {
                    name: "销量统计",
                    path: "/salesManagement/associatedSettings/salesStatistics"
                },
                {
                    name: "批量导入订单",
                    path: "/salesManagement/associatedSettings/importOrder"
                },
            ]
        },
        {
            name: "相关设置",
            path: '/salesManagement/associatedSettings',
            icon: "",
            children: [{
                    name: "黑白名单用户",
                    path: "/salesManagement/orderCenter/userList"
                },
                {
                    name: "批量更新海外仓发货单号",
                    path: "/salesManagement/orderCenter/modifyOrderForm"
                },
                {
                    name: "订单策略",
                    path: "/salesManagement/orderCenter/orderFormStrategy"
                },
            ]
        }, {
            name: "eBay销售管理",
            path: "/salesManagement/EbaySaleManage",
            icon: '',
            children: [
                // {
                //     name: '议价',
                //     path: '/salesManagement/EbaySaleManage/Bragain'
                // },
                {
                    name: '促销活动管理',
                    path: '/salesManagement/EbaySaleManage/SalesActivityManage'
                },
                {
                    name: 'PayPal账户管理',
                    path: '/salesManagement/EbaySaleManage/PaypalAccountManage'
                },
                {
                    name: '收款账户管理',
                    path: '/salesManagement/EbaySaleManage/GatheringAccountManage'
                },
                {
                    name: '业务政策',
                    path: '/salesManagement/EbaySaleManage/BusinessPolicy'
                },
                {
                    name: '描述模板',
                    path: '/salesManagement/EbaySaleManage/DescribleTemplate'
                }
            ]
        }
    ],
    purchasingManagement: [{
            name: "采购管理",
            path: "/purchasingManagement/procurement",
            icon: "",
            children: [{
                    name: "采购单管理",
                    path: "/purchasingManagement/procurement/procurementList"
                },
                {
                    name: "采购异常管理",
                    path: "/purchasingManagement/procurement/purchasingAbnormal"
                },
                {
                    name: "成品加工单管理",
                    path: "/purchasingManagement/procurement/madeupArticles"
                },

                {
                    name: "销单入库核对",
                    path: "/purchasingManagement/procurement/inventoryCheck"
                },
                {
                    name: "采购财务账号管理",
                    path: "/purchasingManagement/procurement/procurementId"
                }
            ]
        },
        {
            name: "质检管理",
            path: "/purchasingManagement/qualityTesting",
            icon: "",
            children: [{
                    name: "质检管理列表",
                    path: "/purchasingManagement/qualityTesting/qualityTestingList"
                },
                {
                    name: "不良品管理",
                    path: "/purchasingManagement/qualityTesting/rejects"
                }
            ]
        },
        {
            name: "供应商管理",
            path: "/purchasingManagement/supplier",
            icon: "",
            children: [{
                    name: "供应商列表",
                    path: "/purchasingManagement/supplier/supplierList"
                },
                {
                    name: "采购点管理",
                    path: "/purchasingManagement/supplier/purchaseSite"
                },
                {
                    name: "供应商账期管理",
                    path: "/purchasingManagement/supplier/paymentDays"
                },
                {
                    name: "供应商退货管理",
                    path: "/purchasingManagement/supplier/salesReturn"
                },
            ]
        }
    ]
}