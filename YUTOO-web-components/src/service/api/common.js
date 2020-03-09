export default [
    //店铺下来列表
    {
        name: 'SellerAuthSelectList',
        method: 'POST',
        desc: '店铺列表',
        path: '/sellerAuth/selectList',
        mockPath: '',
        // showSuccess: true,
        pcommonarams: {

        }
    },
    //商品库 词库类型管理 修改系统字段
    {
        name: 'KeywordDataFieldUpdateForSystem',
        method: 'POST',
        desc: '修改系统字段',
        path: '/keywordDataField/updateForSystem',
        mockPath: '',
        showSuccess: true,
        pcommonarams: {

        }
    },
    //商品库 词库类型管理 关键词属性 获取回显公式
    {
        name: 'KeywordDataFieldInfo',
        method: 'POST',
        desc: '关键词属性回显公式',
        path: '/keywordDataField/info',
        mockPath: '',
        // showSuccess: true,
        pcommonarams: {

        }
    },
    //商品库->商品库 编辑参数-详情回显
    {
        name: 'KeywordVariateValueInfo',
        method: 'POST',
        desc: '商品库->商品库 编辑参数-详情回显',
        path: '/keywordVariateValue/info',
        mockPath: '',
        // showSuccess: true,
        pcommonarams: {

        }
    },
    // 核心词长尾词其他词编辑参数
    {
        name: 'KeywordVariateValueSave',
        method: 'POST',
        desc: '核心词长尾词其他词编辑参数',
        path: '/keywordVariateValue/save',
        showSuccess: true,
        params: {
        }
    },
    // 广告否定词编辑参数
    {
        name: 'KeywordVariateValueSaveAD',
        method: 'POST',
        desc: '广告否定词编辑参数',
        path: '/keywordVariateValue/saveAD',
        showSuccess: true,
        params: {
        }
    },
]