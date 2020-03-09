export default [
    /**
     *
     * 1. name          路由展示名
     * 2. path          路由路径，最底层路由会带上父级的路径，生成的最终路由形式 ${parent.path}${parent.path}${current.path}
     * 3. showSubMenu   是否显示子菜单，默认不显示
     * 4. isSubMenu     是否在子菜单展示，如果为true会展示在子菜单tab页中
     * 5. showTop       在下拉菜单中展示，默认不展示
     * 6. topMenuname   在下拉菜单中显示的名字
     * 7. leaf          是否设置为最底层菜单，默认为false,目前的路由生成规则是，只有最底层都会生成路由,如果设为true表示无论是否最底层都将生成路由
     * 8. perms         按钮权限，需要与后端协商约定
     * 9. layout        基础布局组件，默认为通用布局 即 src/Layout/Layout.vue
     * 10. width        是否窄屏，窄屏宽度
     * 11. homePath     主菜单跳转地址，level = 1 的路径才生效
     * 12. hideHeader   是否隐藏导航菜单，编辑页一般都会隐藏
     * 13. subMenuName  设置子菜单显示别名，如果设置了这个会用于tab页上的显示
     *
     */
    {
        name: '产品库',
        path: '/product',
        homePath: '/product/common/base',
        children: [
            {
                name: '通用',
                path: '/common',
                showTop: true,
                desc: '',
                children: [
                    {
                        name: '仓库产品',
                        showTop: true,
                        path: '/base',
                        perms: ['add', 'addTask', 'del'],
                        leaf: true,
                        desc:
                            '自己仓库的产品维护，完善产品的仓库信息正常状态的可以到各个平台上架',
                        children: [
                            // {
                            //     name: '新增单个产品',
                            //     topMenuname: '新增仓库产品',
                            //     desc: '添加仓库产品',
                            //     // showSubMenu: true,
                            //     isSubMenu: true,
                            //     showTop: true,
                            //     path: '/addSingle'
                            // },
                            {
                                name: '新增单个产品',
                                topMenuname: '新增仓库产品',
                                desc: '添加仓库产品',
                                // showSubMenu: true,
                                showTop: true,
                                width: true,
                                hideHeader: true,
                                path: '/category'
                            },
                            {
                                name: '批量添加产品',
                                desc: '添加或修改多个仓库产品，表格上传',
                                topMenuname: '批量上传仓库产品',
                                showTop: true,
                                path: '/warehouseMoreAddProduct'
                            },
                            {
                                name: '新增组合产品',
                                path: '/addCombination'
                            },
                            {
                                name: '挪动产品',
                                path: '/moveProduct'
                            },
                            
                            {
                                name: '产品操作',
                                width: true,
                                hideHeader: true,
                                path: '/productOperate'
                            },
                            {
                                name: '批量提示',
                                width: true,
                                path: '/batchTooltip'
                            },
                            {
                                name: '审核',
                                width: true,
                                path: '/warehouseAudit'
                            },
							
                        ]
                    },
                    {
                        name: '耗材',
                        path: '/consumables',
                        showTop: true,
                        leaf: true,
                        perms: ['add'],
                        desc: '仓库耗材、办公耗材等其他耗材管理'
                    },
                    {
                        name: '设置',
                        path: '/setup',
                        showTop: '/product/common/setup/category',
                        desc: '产品类目，sku生成规则、标题规则、敏感关键词设置',
                        children: [
                            {
                                isSubMenu: true,
                                perms: ['addTask', 'del'],
                                name: '类目管理列表',
                                path: '/category',
                                leaf: true,
                                children: [
                                    {
                                        name: '选择添加分类',
                                        path: '/add',
                                        width: true,
                                        isSubMenu: false,
                                        perms: ['addTask', 'del']
                                    },
                                    {
                                        name: '选择添加分类1',
                                        path: '/tempEdit',
                                        width: true,
                                        isSubMenu: false,
                                        perms: ['addTask', 'del']
                                    }
                                ]
                            },
                            {
                                name: '平台模板管理',
                                path: '/temp',
                                keep: true,
                                showSubMenu: '/product/common/setup',
                                perms: ['addTask', 'del']
                            },

                            {
                                name: 'SKU生成规则',
                                path: '/sku',
                                isSubMenu: true,
                                perms: ['addTask', 'del']
                            },
                            {
                                name: '标题规则',
                                path: '/title',
                                isSubMenu: true,
                                perms: ['add']
                            },
                            {
                                name: '敏感关键词管理',
                                path: '/keyword',
                                isSubMenu: true,
                                perms: ['add']
                            },
                            {
                                name: '推荐报关价计算规则',
                                path: '/customsprice',
                                isSubMenu: true
                            }
                        ]
                    },
                    {
                        name: '产品开发',
                        path: '/productDevelop',
                        desc: '开发新的仓库产品，支持平台采集、销售提报、供应商提报',
                        children: [
                            {
                                name: '平台采集',
                                path: '/PlatformToCollect',
                                showTop: true,
                                isSubMenu: true,
                                perms: ['add']
                            },
                            {
                                name: '销售提报',
                                path: '/SalesReport',
                                showTop: true,
                                isSubMenu: true,
                                perms: ['add']
                            },
                            {
                                name: '供应商提报',
                                path: '/SupplierSubmission',
                                showTop: true,
                                isSubMenu: true,
                            },
                        ]
                    },
                ]
            },
            {
                name: 'Amazon',
                path: '/amazon',
                showTop: true,
                desc: '',
                children: [
                    {
                        name: 'Amazon平台产品',
                        path: '/platProduct',
                        topMenuname: '平台产品',
                        perms: ['addTask'],
                        showTop: true,
                        leaf: true,
                        desc:
                            '亚马逊平台产品维护，选择需要卖到亚马逊的产品，编辑信息一份信息上传到多店铺',
                        children: [
                            {
                                name: '批量更新产品信息',
                                path: '/batchUpdate',
                                perms: ['addTask']
                            },
                            {
                                name: '编辑',
                                path: '/edit',
                                width: true,
                                hideHeader: true,
                                perms: ['addTask']
                            },
                            {
                                name: '查看',
                                path: '/viewInfo',
                                width: true,
                                hideHeader: true,
                                perms: ['addTask']
                            },
                            {
                                name: '复制产品',
                                path: '/copy',
                                width: true,
                                hideHeader: true,
                                perms: ['addTask']
                            },
                            {
                                name: '平台信息审核',
                                width: true,
                                hideHeader: true,
                                path: '/infoAudit',
                                perms: ['addTask']
                            },
                            {
                                name: '图片信息编辑',
                                hideHeader: true,
                                width: true,
                                path: '/imgEdit',
                                perms: ['addTask']
                            },
                            {
                                name: '上架',
                                hideHeader: true,
                                width: true,
                                path: '/shelves',
                                perms: ['addTask']
                            },
                            {
                                name: '已上传店铺',
                                width: true,
                                path: '/cstore',
                                perms: ['addTask']
                            },
                            {
                                name: '图片信息审核',
                                hideHeader: true,
                                width: true,
                                path: '/imgAudit',
                                perms: ['addTask']
                            }
                        ]
                    },
                    {
                        name: 'Amazon店铺产品',
                        subMenuName: '所有产品列表',
                        topMenuname: '店铺产品',
                        path: '/storeProduct',
                        showTop: true,
                        isSubMenu: true,
                        leaf: true,
                        perms: ['addTask'],
                        desc:
                            '所有店铺产品在此处展示，可以对产品进行新增、编辑删除、下架等操作',
                        children: [
                            {
                                name: '新增店铺产品',
                                path: '/add',
                                width: true,
                                hideHeader: true,
                                showTop: true,
                                desc: '添加单个店铺产品'
                            },
                            {
                                name: '批量上传店铺产品',
                                path: '/batchAdd',
                                showTop: true,
                                desc: '添加多个店铺产品，表格上传'
                            },
                            {
                                name: '新增跟卖产品',
                                path: '/addToSell',
                                width: true,
                                hideHeader: true
                            },
                            {
                                name: '编辑店铺产品',
                                path: '/edit',
                                width: true,
                                hideHeader: true
                            },
                            {
                                name: '复制添加店铺产品',
                                path: '/copy',
                                width: true,
                                hideHeader: true
                            },
                            {
                                name: '新增变体',
                                path: '/addNewVar',
                                width: true,
                                hideHeader: true
                            },
                            {
                                name: '审核店铺产品',
                                path: '/audit'
                            },
                        ]
                    },
                    {
                        name: '商品信息待改善',
                        isSubMenu: true,
                        path: '/improves',
                        perms: ['addTask'],
                    },
                    {
                        name: '禁止显示',
                        isSubMenu: true,
                        path: '/banDisplay',
                        perms: ['addTask'],
                    },
                    {
                        name: '商品信息变动',
                        isSubMenu: true,
                        path: '/changePro',
                        perms: ['addTask'],
                    },
                    {
                        name: '跟卖策略',
                        path: '/toSellSetting',
                        topMenuname: '相关设置',
                        perms: ['addTask'],
                        showTop: true,
                        desc: '定时跟卖策略管理'
                    }
                ]
            }
        ]
    },
    {
        name: '店铺管理',
        path: '/ShopManagement',
        perms: ['addShop']
    },
    {
        name: 'eBay相关设置',
        path: '/EbayRelatedSettings',
        children: [
            {
                name: 'PayPal账户',
                path: '/PayPal',
                showTop: true,
                perms: ['add'],
                isSubMenu: true
            },
            {
                name: '收款账户',
                path: '/GatheringAccount',
                showTop: true,
                perms: ['add'],
                isSubMenu: true
            },
            {
                name: '业务政策',
                path: '/BusinessPolicy',
                showTop: true,
                perms: ['add'],
                isSubMenu: true
            },
            {
                name: '描述模板',
                path: '/DescribeTemplate',
                showTop: true,
                perms: ['add'],
                isSubMenu: true
            },
            {
                name: '上架策略',
                path: '/SaleStrategy',
                showTop: true,
                isSubMenu: true,
                perms: ['add']
            }
        ]
    },
];
