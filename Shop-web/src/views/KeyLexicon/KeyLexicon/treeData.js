// page 为空需要切换页面，具体什么页面就要看id

export const CategoryTreeData = [
    {
        label: '分类属性',
        id: 1,
        page: 'Attribute'
    },
    {
        label: '上架词库',
        id: 2,
        page: null,
        children: [
            {
                label: '相关词',
                id: 3,
                page: 'OnlineRelatedWords',
                children: [
                    {
                        label: '非品牌词',
                        id: 4,
                        page: 'OnlineRelatedWords',
                        children: [
                            {
                                label: '核心词',
                                id: 5,
                                page: 'OnlineRelatedWords'
                            },
                            {
                                label: '长尾词',
                                id: 6,
                                page: 'OnlineRelatedWords'
                            },
                            {
                                label: '其他词',
                                id: 7,
                                page: 'OnlineRelatedWords'
                            }
                        ]
                    }, {
                        label: '可布局品牌词',
                        id: 8,
                        page: 'OnlineRelatedWords',
                        children: [
                            {
                                label: '核心词',
                                id: 9,
                                page: 'OnlineRelatedWords'
                            },
                            {
                                label: '长尾词',
                                id: 10,
                                page: 'OnlineRelatedWords'
                            },
                            {
                                label: '其他词',
                                id: 11,
                                page: 'OnlineRelatedWords'
                            }
                        ]
                    },
                    {
                        label: '仅广告',
                        id: 49,
                        page: 'OnlineRelatedWords'
                    },
                ]
            },
            {
                label: '否定词',
                id: 12,
                page: null,
                children: [
                    {
                        label: '精确否定',
                        id: 13,
                        page: 'NegateWords'
                    },
                    {
                        label: '词组否定',
                        id: 14,
                        page: 'NegateWords'
                    }
                ]
            },
            {
                label: '词根管理',
                id: 15,
                page: null,
                children: [
                    {
                        label: '有效词根',
                        id: 16,
                        page: 'EtymaValid'
                    },
                    {
                        label: '无效词根',
                        id: 17,
                        page: 'EtymaInvalid'
                    }
                ]
            },
            {
                label: '未筛选词',
                id: 18,
                page: 'Unscreened'
            },
            {
                label: '关键词管理',
                id: 50,
                page: 'KeywordManagement'
            }
        ]
    },
    {
        label: '广告词库',
        id: 19,
        page: null,
        children: [
            {
                label: '相关词',
                id: 20,
                page: 'AdRelatedWords',
                children: [
                    {
                        label: '品牌词',
                        id: 21,
                        page:'AdRelatedWords',
                        children: [
                            {
                                label: '可布局',
                                id: 22,
                                page: 'AdRelatedWords',
                                children: [
                                    {
                                        label: '成交词',
                                        id: 23,
                                        page: 'AdRelatedWords'
                                    },
                                    {
                                        label: '非成交词',
                                        id: 24,
                                        page: 'AdRelatedWords'
                                    }
                                ]
                            }, {
                                label: '仅广告',
                                id: 25,
                                page: 'AdRelatedWords',
                                children: [
                                    {
                                        label: '成交词',
                                        id: 26,
                                        page: 'AdRelatedWords'
                                    },
                                    {
                                        label: '非成交词',
                                        id: 27,
                                        page: 'AdRelatedWords'
                                    }
                                ]
                            }
                        ]
                    }, {
                        label: '非品牌词',
                        id: 28,
                        page:'AdRelatedWords',
                        children: [
                            {
                                label: '成交词',
                                id: 29,
                                page: 'AdRelatedWords'
                            },
                            {
                                label: '非成交词',
                                id: 30,
                                page: 'AdRelatedWords'
                            }
                        ]
                    }
                ]
            },
            {
                label: '否定词',
                id: 31,
                page: null,
                children: [
                    {
                        label: '精确否定',
                        id: 32,
                        page: 'NegateWords'
                    },
                    {
                        label: '词组否定',
                        id: 33,
                        page: 'NegateWords'
                    }
                ]
            },
            {
                label: 'ASIN',
                id: 34,
                page: null,
                children: [
                    {
                        label: '成交',
                        id: 35,
                        page: 'AdAsin',
                    },
                    {
                        label: '非成交',
                        id: 36,
                        page: 'AdAsin',
                    }
                ]
            },
            {
                label: '词根管理',
                id: 37,
                page: null,
                children: [
                    {
                        label: '有效词根',
                        id: 38,
                        page: 'EtymaValid'
                    },
                    {
                        label: '无效词根',
                        id: 39,
                        page: 'EtymaInvalid'
                    }
                ]
            },
            {
                label: '未筛选词库',
                id: 40,
                page: 'Unscreened'
            },
            {
                label: '关键词管理',
                id: 51,
                page: 'KeywordManagement'
            }
        ]
    },
    {
        label: '否定词',
        id: 41,
        page: null,
        children: [
            {
                label: '词组否定',
                id: 42,
                page: 'NegateWords'
            },
            {
                label: '精确否定',
                id: 43,
                page: 'NegateWords'
            }
        ]
    },
    {
        label: '词根管理',
        id: 44,
        page: null,
        children: [
            {
                label: '无效词根',
                id: 45,
                page: 'EtymaInvalid'
            }
        ]
    },
    {
        label: '品牌名库',
        id: 46,
        page: 'Brand',
        children: [
            {
                label: '可布局',
                id: 47,
                page: 'Brand'
            },
            {
                label: '仅广告',
                id: 48,
                page: 'Brand'
            }
        ]
    }

]




export const ProductTreeData = [
    {
        label: '分类属性',
        id: 1,
        page: 'Attribute'
    },
    {
        label: '上架词库',
        id: 2,
        page: null,
        children: [
            {
                label: '相关词',
                id: 3,
                page: 'OnlineRelatedWords',
                children: [
                    {
                        label: '非品牌词',
                        id: 4,
                        page: 'OnlineRelatedWords',
                        children: [
                            {
                                label: '核心词',
                                id: 5,
                                page: 'OnlineRelatedWords'
                            },
                            {
                                label: '长尾词',
                                id: 6,
                                page: 'OnlineRelatedWords'
                            },
                            {
                                label: '其他词',
                                id: 7,
                                page: 'OnlineRelatedWords'
                            }
                        ]
                    }, {
                        label: '可布局品牌词',
                        id: 8,
                        page: 'OnlineRelatedWords',
                        children: [
                            {
                                label: '核心词',
                                id: 9,
                                page: 'OnlineRelatedWords'
                            },
                            {
                                label: '长尾词',
                                id: 10,
                                page: 'OnlineRelatedWords'
                            },
                            {
                                label: '其他词',
                                id: 11,
                                page: 'OnlineRelatedWords'
                            }
                        ]
                    },
                    {
                        label: '仅广告',
                        id: 41,
                        page: 'OnlineRelatedWords'
                    },
                ]
            },
            {
                label: '否定词',
                id: 12,
                page: null,
                children: [
                    {
                        label: '精确否定',
                        id: 13,
                        page: 'NegateWords'
                    },
                    {
                        label: '词组否定',
                        id: 14,
                        page: 'NegateWords'
                    }
                ]
            },
            // {
            //     label: '词根管理',
            //     id: 15,
            //     page: null,
            //     children: [
            //         {
            //             label: '有效词根',
            //             id: 16,
            //             page: 'EtymaValid'
            //         },
            //         {
            //             label: '无效词根',
            //             id: 17,
            //             page: 'EtymaInvalid'
            //         }
            //     ]
            // },
            // {
            //     label: '未筛选词',
            //     id: 18,
            //     page: 'Unscreened'
            // },
            // {
            //     label: '关键词管理',
            //     id: 42,
            //     page: 'KeywordManagement'
            // }
        ]
    },
    {
        label: '广告词库',
        id: 19,
        page: null,
        children: [
            {
                label: '相关词',
                id: 20,
                page: 'AdRelatedWords',
                children: [
                    {
                        label: '品牌词',
                        id: 21,
                        page: 'AdRelatedWords',
                        children: [
                            {
                                label: '可布局',
                                id: 22,
                                page: 'AdRelatedWords',
                                children: [
                                    {
                                        label: '成交词',
                                        id: 23,
                                        page: 'AdRelatedWords'
                                    },
                                    {
                                        label: '非成交词',
                                        id: 24,
                                        page: 'AdRelatedWords'
                                    }
                                ]
                            }, {
                                label: '仅广告',
                                id: 25,
                                page: 'AdRelatedWords',
                                children: [
                                    {
                                        label: '成交词',
                                        id: 26,
                                        page: 'AdRelatedWords'
                                    },
                                    {
                                        label: '非成交词',
                                        id: 27,
                                        page: 'AdRelatedWords'
                                    }
                                ]
                            }
                        ]
                    }, {
                        label: '非品牌词',
                        id: 28,
                        page: 'AdRelatedWords',
                        children: [
                            {
                                label: '成交词',
                                id: 29,
                                page: 'AdRelatedWords'
                            },
                            {
                                label: '非成交词',
                                id: 30,
                                page: 'AdRelatedWords'
                            }
                        ]
                    }
                ]
            },
            {
                label: '否定词',
                id: 31,
                page: null,
                children: [
                    {
                        label: '精确否定',
                        id: 32,
                        page: 'NegateWords'
                    },
                    {
                        label: '词组否定',
                        id: 33,
                        page: 'NegateWords'
                    }
                ]
            },
            {
                label: 'ASIN',
                id: 34,
                page: null,
                children: [
                    {
                        label: '成交',
                        id: 35,
                        page: 'AdAsin',
                    },
                    {
                        label: '非成交',
                        id: 36,
                        page: 'AdAsin',
                    }
                ]
            },
            {
                label: '词根管理',
                id: 37,
                page: null,
                children: [
                    {
                        label: '有效词根',
                        id: 38,
                        page: 'EtymaValid'
                    },
                    {
                        label: '无效词根',
                        id: 39,
                        page: 'EtymaInvalid'
                    }
                ]
            },
            {
                label: '未筛选词库',
                id: 40,
                page: 'Unscreened'
            },
            {
                label: '关键词管理',
                id: 43,
                page: 'KeywordManagement'
            },
            {
                label: '否定词筛选',
                id: 42,
                page: 'NegativeWordSelectionPage'
            }
        ]
    },
    
    // {
    //     label: '否定词',
    //     id: 41,
    //     page: null,
    //     children: [
    //         {
    //             label: '词组否定',
    //             id: 42,
    //             page: 'NegateWords'
    //         },
    //         {
    //             label: '精确否定',
    //             id: 43,
    //             page: 'NegateWords'
    //         }
    //     ]
    // }

]