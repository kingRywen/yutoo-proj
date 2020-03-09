// 列表
export default [{
    name: 'KeywordExcavateList',
    method: 'POST',
    desc: '关键词挖掘列表',
    path: '/taskKeywordDig/list',
    mockPath: '',
    // showSuccess: true,
    params: {
    }
},
// 获取来源
{
    name: 'PlatformAllList',
    method: 'POST',
    desc: '来源',
    path: '/platform/allList',
    mockPath: '',
    // showSuccess: true,
    params: {
    }
},
// 获取关键词类型
{
    name: 'KeywordTypeList',
    method: 'POST',
    desc: '关键词类型',
    path: '/keywordType/list',
    mockPath: '',
    // showSuccess: true,
    params: {
    }
},
// 获取语言
{
    name: 'TaskKeywordDigLanguageList',
    method: 'POST',
    desc: '语言',
    path: '/taskKeywordDig/languageList',
    mockPath: '',
    // showSuccess: true,
    params: {
    }
},
// 添加
{
    name: 'TaskKeywordDigSave',
    method: 'POST',
    desc: '关键词添加',
    path: '/taskKeywordDig/save',
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
// 删除
{
    name: 'DeleteExcavateList',
    method: 'POST',
    desc: '关键词挖掘列表删除',
    path: '/taskKeywordDig/remove',
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
// 重新抓取
{
    name: 'TaskKeywordDigReCrawl',
    method: 'POST',
    desc: '关键词挖掘列表重新抓取',
    path: '/taskKeywordDig/reCrawl',
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
// 关键词挖掘查看列表
{
    name: 'TaskKeywordDigRtList',
    method: 'POST',
    desc: '关键词挖掘查看列表',
    path: '/taskKeywordDigRt/list',
    mockPath: '',
    // showSuccess: true,
    params: {
    }
},
// 关键词挖掘加入排名  获取类目列表
{
    name: 'CategoryKeywordListForCategory',
    method: 'POST',
    desc: '关键词挖掘查看列表',
    path: '/categoryKeyword/listForCategory',
    mockPath: '',
    // showSuccess: true,
    params: {
    }
},
// 关键词挖掘加入排名  添加的时候展示可选类目列表
// 在其他文件有，所以不能重复定义
// {
//     name: 'CategoryKeywordListForCategory',
//     method: 'POST',
//     desc: '关键词挖掘查看列表',
//     path: '/categoryKeyword/listForCategory',
//     mockPath: '',
//     // showSuccess: true,
//     params: {
//     }
// },
// 关键词挖掘查看 加入排名  确认添加新类目词库
{
    name: 'CustomCategorySaveCategory',
    method: 'POST',
    desc: '关键词挖掘查看列表',
    path: '/customCategory/saveCategory',
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
// 关键词挖掘查看 加入排名  确认添加到词库 /categoryKeyword/saveDigKeyword
{
    name: 'CategoryKeywordSaveDigKeyword',
    method: 'POST',
    desc: '关键词挖掘查看列表',
    path: '/categoryKeyword/saveDigKeyword',
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
{
    name: 'categoryKeywordListScreen',
    method: 'POST',
    desc: '关键词-筛选列表',
    path: '/categoryKeyword/listScreen',
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
{
    name: 'categoryKeywordRevokeScreen',
    method: 'POST',
    desc: '关键词-撤销筛选',
    path: '/categoryKeyword/revokeScreen',
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
{
    name: 'categoryKeywordImportAdData',
    method: 'POST',
    desc: '关键词-导入(广告关键词)',
    path: '/categoryKeyword/importAdData',
    type:'formdata',
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
{
    name: 'categoryKeywordSaveAdKeyword',
    method: 'POST',
    desc: '关键词-广告未筛选添加关键词',
    path: '/categoryKeyword/saveAdKeyword',
    // mock: true,
    showSuccess: true,
    params: {}
},
{
    name: 'categoryKeywordSaveDigKeyword',
    method: 'POST',
    desc: '关键词-挖掘添加关键词',
    path: '/categoryKeyword/saveDigKeyword',
    // mock: true,
    showSuccess: true,
    params: {}
},
{
    name: 'keywordClassifySaveItem',
    method: 'POST',
    desc: 'item添加关键词',
    path: '/keywordClassify/save',
    // mock: true,
    showSuccess: true,
    params: {}
},
];