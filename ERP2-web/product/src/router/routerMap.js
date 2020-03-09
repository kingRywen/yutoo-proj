import {
    importComponent
} from './index';
export default {
    layout: {
        default: () => importComponent(import(`Layout/Layout.vue`)),
        w1100: () => importComponent(import(`Layout/w1100.vue`))
    },
    product: {
        common: {
            base: {
                default: () =>
                    importComponent(
                        import(`Views/modules/product/common/base/index`)
                    ),
                addSingle: () =>
                    importComponent(
                        import(`Views/modules/product/common/base/addSingle`)
                    ),
                addMulti: () =>
                    importComponent(
                        import(`Views/modules/product/common/base/addMulti`)
                    ),
                category: () =>
                    importComponent(
                        import(
                            `Views/modules/product/common/base/category/index.vue`
                        )
                    ),
                productOperate: () =>
                    importComponent(
                        import(
                            `Views/modules/product/common/base/productOperate/index.vue`
                        )
                    ),
                batchTooltip: () =>
                    importComponent(
                        import(
                            `Views/modules/product/common/base/batchTooltip/index.vue`
                        )
                    ),
                warehouseAudit: () =>
                    importComponent(
                        import(
                            `Views/modules/product/common/base/index/dialogs/audit.vue`
                        )
                    ),
                warehouseMoreAddProduct: () =>
                    importComponent(
                        import(
                            `Views/modules/product/common/base/moreAddProduct/index.vue`
                        )
                    ),
            },
            //通用设置
            setup: {
                category: {
                    default: () =>
                        importComponent(
                            import(`Views/modules/product/setup/category`)
                        ),
                    add: () =>
                        importComponent(
                            import(
                                `Views/modules/product/setup/category/components/add`
                            )
                        ),
                    tempEdit: () =>
                        importComponent(
                            import(
                                `Views/modules/product/setup/category/components/tempEdit`
                            )
                        )
                },
                temp: () =>
                    importComponent(
                        import(
                            `Views/modules/product/setup/category/components/temp`
                        )
                    ),
                sku: () =>
                    importComponent(import(`Views/modules/product/setup/sku`)),
                title: () =>
                    importComponent(import(`Views/modules/product/setup/title`)),
                keyword: () =>
                    importComponent(import(`Views/modules/product/setup/keyword`))
            },
            //耗材
            consumables:{
                default: () =>
                    importComponent(
                        import(`Views/modules/product/common/consumables/index`)
                    ),
            },
            //产品开发
            productDevelop:{
                PlatformToCollect:()=>
                    importComponent(
                        import(`Views/modules/product/productDevelop/PlatformToCollect/index`)
                    ),
                SalesReport:()=>
                    importComponent(
                        import(`Views/modules/product/productDevelop/SalesReport/index`)
                    ),
                SupplierSubmission:()=>
                    importComponent(
                        import(`Views/modules/product/productDevelop/SupplierSubmission/index`)
                    ),
            },
        },
        amazon: {
            platProduct: {
                default: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/index`)
                    ),
                batchUpdate: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/batchUpdate`)
                    ),
                edit: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/edit`)
                    ),
                copy: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/copy`)
                    ),
                viewInfo: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/viewInfo`)
                    ),
                imgEdit: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/imgEdit`)
                    ),
                imgAudit: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/imgAudit`)
                    ),
                shelves: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/shelves`)
                    ),
                cstore: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/cstore`)
                    ),
                infoAudit: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/platProduct/infoAudit`)
                    )
            },
            storeProduct: {
                default: () =>
                    importComponent(
                        import(
                            `Views/modules/product/amazon/storeProduct/Index`
                        )
                    ),
                add: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/storeProduct/add`)
                    ),
                edit: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/storeProduct/edit`)
                    ),
                copy: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/storeProduct/copy`)
                    ),
                addNewVar: () =>
                    importComponent(
                        import(`Views/modules/product/amazon/storeProduct/addNewVar`)
                    ),
                batchAdd: () =>
                    importComponent(
                        import(
                            `Views/modules/product/amazon/storeProduct/batchAdd`
                        )
                    ),
                addToSell: () =>
                    importComponent(
                        import(
                            `Views/modules/product/amazon/storeProduct/addToSell`
                        )
                    ),
                audit: () =>
                    importComponent(
                        import(
                            `Views/modules/product/amazon/storeProduct/audit`
                        )
                    )
            },
            improves: () =>
                importComponent(
                    import(`Views/modules/product/amazon/storeProduct/improves`)
                ),
            banDisplay: () =>
                importComponent(
                    import(`Views/modules/product/amazon/storeProduct/banDisplay`)
                ),
            changePro: () =>
                importComponent(
                    import(`Views/modules/product/amazon/storeProduct/changePro`)
                ),
            toSellSetting: () =>
                importComponent(
                    import(`Views/modules/product/setup/toSell`)
                ),
        }
    },
    ShopManagement: () =>
        importComponent(
            import(
                `Views/ShopManagement/index`
            )
        ),
    EbayRelatedSettings: {
        PayPal: () =>
            importComponent(
                import(
                    `Views/EbayRelatedSettings/PayPal/index`
                )
            ),
        GatheringAccount: () =>
            importComponent(
                import(
                    `Views/EbayRelatedSettings/GatheringAccount/index`
                )
            ),
        BusinessPolicy: () =>
            importComponent(
                import(
                    `Views/EbayRelatedSettings/BusinessPolicy/index`
                )
            ),
        DescribeTemplate: () =>
            importComponent(
                import(
                    `Views/EbayRelatedSettings/DescribeTemplate/index`
                )
            ),
        SaleStrategy: () =>
            importComponent(
                import(
                    `Views/EbayRelatedSettings/SaleStrategy/index`
                )
            ),
    }
};