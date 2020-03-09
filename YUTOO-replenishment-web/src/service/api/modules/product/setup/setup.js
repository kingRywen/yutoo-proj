export default [
    //类目通用设置
    {
        name: 'allcategoryList',
        method: 'POST',
        desc: '通用设置类目-所有类目',
        path: '/Category/tree',
        params: {}
    },
    {
        name: 'allcategoryQuery',
        method: 'POST',
        desc: '类目管理-仓库产品类目-添加感兴趣-类目搜索',
        path: '/CateSystemCategory/query',
        params: {}
    },
    {
        name: 'categorySave',
        method: 'POST',
        desc: '类目管理-仓库产品类目-添加感兴趣-选择类别（添加）',
        path: '/CateSystemCategoryInterestedM/save',
        params: {}
    },
    {
        name: 'interestedCategoryList',
        method: 'POST',
        desc: '类目管理-仓库产品类目-添加感兴趣列表',
        path: '/CateSystemCategoryInterestedM/list',
        params: {}
    },
    {
        name: 'interestedCategoryRemovet',
        method: 'POST',
        desc: '类目管理-仓库产品类目-删除',
        path: '/CateSystemCategoryInterestedM/remove',
        params: {}
    },
    {
        name: 'interestedCategorytInfo',
        method: 'POST',
        desc: '类目管理-仓库产品类目-info',
        path: '/CateSystemCategorySetM/info',
        params: {}
    },
    {
        name: 'categorytEditupdateUser',
        method: 'POST',
        desc: '编辑-更新负责人',
        path: '/CateSystemCategorySetM/updateUser',
        params: {}
    },
    {
        name: 'categorytEditupdate',
        method: 'POST',
        showSuccess: true,
        desc: '类目-编辑更新',
        path: '/CateSystemCategorySetM/update',
        params: {}
    },
    {
        name: 'permissionList',
        method: 'POST',
        desc: '类目-编辑更新',
        path: '/permission/user/list',
        params: {}
    },
    {
        name: 'categoryActiveSetupInfo',
        method: 'POST',
        desc: '类目-活跃度',
        path: '/CateSystemCategoryActiveRule/info',
        params: {}
    },
    {
        name: 'categoryActiveSetupUpdate',
        method: 'POST',
        desc: '类目-活跃度更新',
        showSuccess: true,
        path: '/CateSystemCategoryActiveRule/update',
        params: {}
    },
    {
        name: 'storeAttributeList',
        method: 'POST',
        desc: '仓库属性列表',
        path: '/CateSystemCategoryPropertyM/list/general',
        params: {}
    },
    {
        name: 'addCustomAttribute',
        method: 'POST',
        desc: '类目管理-仓库产品类目-仓库属性管理-添加自定义字段',
        path: '/CateSystemCategoryPropertyM/save',
        params: {}
    },
    {
        name: 'removeCustomAttribute',
        method: 'POST',
        desc: '类目管理-仓库产品类目-仓库属性管理-删除',
        path: '/CateSystemCategoryPropertyM/remove',
        params: {}
    },
    {
        name: 'currentFatherCategory',
        method: 'POST',
        desc: '类目管理-仓库产品类目-仓库属性管理-当前类目的父类目',
        path: '/CateSystemCategory/tree/single',
        params: {}
    },
    {
        name: 'quoteCategoryAll',
        method: 'POST',
        desc: '类目管理-仓库产品类目-仓库属性管理-完全引用',
        path: '/CateSystemCategoryPropertyM/cite/all',
        params: {}
    },
    {
        name: 'quoteCategoryPart',
        method: 'POST',
        desc: '类目管理-仓库产品类目-仓库属性管理-部分引用',
        path: '/CateSystemCategoryPropertyM/cite/part',
        params: {}
    },
    {
        name: 'storeAttributeListSave',
        method: 'POST',
        showSuccess: true,
        desc: '类目管理-仓库产品类目-仓库属性管理-保存',
        path: '/CateSystemCategoryPropertyM/list/save',
        params: {}
    },

    // 类目管理-模板管理
    {
        name: 'categoryTemplatetList',
        method: 'POST',
        desc: '模板管理列表',
        path: '/template/list',
        params: {}
    },
    {
        name: 'categoryTemplatetDelete',
        method: 'POST',
        desc: '模板删除',
        showSuccess: true,
        path: '/template/delete',
        params: {}
    },
    // 模板编辑/复制添加
    {
        name: 'categoryTemplatetInfo',
        method: 'POST',
        desc: '模板信息',
        path: '/template/info',
        params: {}
    },
    {
        name: 'categoryTemplatetUpdate',
        method: 'POST',
        desc: '模板更新保存',
        showSuccess: true,
        path: '/template/update',
        params: {}
    },
    {
        name: 'tempPropertyRelation',
        method: 'POST',
        desc: '设置关联字段',
        path: '/template/setPropertyRel',
        params: {}
    },
    // 操作日志
    {
        name: 'productGlobalLog',
        method: 'POST',
        desc: '操作日志',
        path: '/GlLog/list',
        params: {}
    }
];
