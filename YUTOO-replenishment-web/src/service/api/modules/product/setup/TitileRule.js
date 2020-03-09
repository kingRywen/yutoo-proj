export default [
    //类目通用设置
    {
        name: 'TITGlLanguageList',
        method: 'POST',
        desc: '语种-获取列表',
        path: '/GlLanguage/list',
        params: {}
    },
    {
        name: 'CateSystemCategoryTreeTitleWord',
        method: 'POST',
        desc: '类目管理-标题词库-左侧类目树',
        path: '/CateSystemCategory/tree/titleWord',
        params: {}
    },
    {
        name: 'PrConfigTitleWordList',
        method: 'POST',
        desc: '通用设置-标题词库-列表查询',
        path: '/PrConfigTitleWord/list',
        params: {}
    },
    {
        name: 'PrConfigTitleWordRemove',
        method: 'POST',
        desc: '通用设置-标题词库-删除',
        path: '/PrConfigTitleWord/remove',
        params: {},
        showSuccess:true,
    },
    {
        name: 'PrConfigTitleWordSave',
        method: 'POST',
        desc: '通用设置-标题词库组-新增',
        path: '/PrConfigTitleWord/save',
        params: {},
        showSuccess:true
    },
    {
        name: 'PrConfigTitleWordUpdate',
        method: 'POST',
        desc: '通用设置-标题词库-编辑',
        path: '/PrConfigTitleWord/update',
        params: {},
        showSuccess:true
    },
    {
        name: 'PrConfigTitleWordInfo',
        method: 'POST',
        desc: '通用设置-标题词库-查看详情',
        path: '/PrConfigTitleWord/info',
        params: {}
    },
    {
        name: 'PrConfigTitleWordGroupSave',
        method: 'POST',
        desc: '通用设置-标题词库组-新增',
        path: '/PrConfigTitleWordGroup/save',
        params: {},
        showSuccess:true,
    },
    {
        name: 'PrConfigTitleWordGroupInfo',
        method: 'POST',
        desc: '通用设置-标题词库组-查看详情',
        path: '/PrConfigTitleWordGroup/info',
        params: {}
    },
    {
        name: 'PrConfigTitleWordGroupUpdate',
        method: 'POST',
        desc: '通用设置-标题词库组-编辑',
        path: '/PrConfigTitleWordGroup/update',
        params: {}
    },
    {
        name: 'PrConfigTitleWordGroupRemove',
        method: 'POST',
        desc: '通用设置-标题词库组-删除',
        path: '/PrConfigTitleWordGroup/remove',
        params: {},
        showSuccess:true
    },
]