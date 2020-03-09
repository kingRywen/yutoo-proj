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
    name: 'categoryKeywordDownloadFile',
    method: 'POST',
    desc: '下载模板',
    path: '/categoryKeyword/downloadFile',
    config: {
        responseType:'blob'
    },
    mockPath: '',
    showSuccess: true,
    params: {
    }
},
{
    name: 'adSeoImportDataExportTemplate',
    method: 'POST',
    desc: '下载模板',
    path: '/adSeoImportData/exportTemplate',
    config: {
        responseType:'blob'
    },
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
    name: 'keywordClassifyDownloadFile',
    method: 'POST',
    desc: '下载',
    path: '/keywordClassify/downloadFile',
    // mock: false,
    showSuccess: true,
    config: {
        responseType: 'blob'
    },
    params: {}
},
{
    name: 'categoryKeywordSaveAdKeyword',
    method: 'POST',
    desc: '关键词-广告未筛选添加关键词',
    path: '/categoryKeyword/saveAdKeyword',
    // mock: false,
    showSuccess: true,
    params: {}
},
{
    name: 'categoryKeywordSaveDigKeyword',
    method: 'POST',
    desc: '关键词-挖掘添加关键词',
    path: '/categoryKeyword/saveDigKeyword',
    // mock: false,
    showSuccess: true,
    params: {}
},
{
    name: 'keywordClassifySaveItem',
    method: 'POST',
    desc: 'item添加关键词',
    path: '/keywordClassify/save',
    // mock: false,
    showSuccess: true,
    params: {}
},


// 关键词竞争分析
{
    name: 'taskKeywordCompeteList',
    method: 'POST',
    desc: '关键词竞争分析-列表',
    path: '/taskKeywordCompete/list',
     mock: false,
    //showSuccess: true,
    params: {}
},
{
    name: 'taskKeywordCompeteSave',
    method: 'POST',
    desc: '关键词竞争分析-添加任务',
    path: '/taskKeywordCompete/save',
     mock: false,
    showSuccess: true,
    params: {}
},
{
    name: 'taskKeywordCompeteRemove',
    method: 'POST',
    desc: '关键词竞争分析-删除',
    path: '/taskKeywordCompete/remove',
     mock: false,
    showSuccess: true,
    params: {}
},
{
    name: 'taskKeywordCompeteReCrawl',
    method: 'POST',
    desc: '关键词竞争分析-重新发送任务',
    path: '/taskKeywordCompete/reCrawl',
     mock: false,
    showSuccess: true,
    params: {}
},
{
    name: 'taskKeywordCompeteDetails',
    method: 'POST',
    desc: '关键词竞争分析-任务详情',
    path: '/taskKeywordCompete/details',
    mock: false,
    //showSuccess: true,
    params: {}
},
{
    name: 'taskKeywordCompeteExportData',
    method: 'POST',
    desc: '关键词竞争分析-详情导出',
    path: '/taskKeywordCompete/exportData',
     mock: false,
    //showSuccess: true,
    config: {
        responseType: 'blob'
    },
    params: {}
},
{
    name: 'taskKeywordCompeteExportTemplate',
    method: 'POST',
    desc: '关键词竞争分析-模板导出',
    path: '/taskKeywordCompete/exportTemplate',
     mock: false,
    //showSuccess: true,
    config: {
        responseType: 'blob'
    },
    params: {}
},
{
    name: 'taskKeywordCompeteImportData',
    method: 'POST',
    desc: '关键词竞争分析-数据导入',
    path: '/taskKeywordCompete/importData',
    mock: false,
    //showSuccess: true,
    params: {}
},


{
    name: 'categoryKeywordGetFilterKeywordNegative',
    method: 'POST',
    desc: '获取未筛选否定词',
    path: '/categoryKeyword/getFilterKeywordNegative',
    //mock: true,
    //showSuccess: true,
    params: {}
},
{
    name: 'categoryKeywordRevokeNegativeFilter',
    method: 'POST',
    desc: '撤销否定词筛选',
    path: '/categoryKeyword/revokeNegativeFilter',
    //mock: true,
    showSuccess: true,
    params: {}
},
{
    name: 'categoryKeywordNegativeFilter',
    method: 'POST',
    desc: '否定词筛选',
    path: '/categoryKeyword/negativeFilter',
    //mock: true,
    showSuccess: true,
    params: {}
},
{
    name: 'categoryKeywordListNegativeFilter',
    method: 'POST',
    desc: '未筛选/忽略否定词列表',
    path: '/categoryKeyword/listNegativeFilter',
    //mock: true,
    //showSuccess: true,
    params: {}
},
{
    name: 'categoryKeywordTranslateToChines',
    method: 'POST',
    desc: '翻译',
    path: '/categoryKeyword/translateToChinese',
    //mock: true,
    //showSuccess: true,
    params: {}
},

{
    name: 'keywordNegativeListByProduct',
    method: 'POST',
    desc: '关键词-获取关键词库否定词',
    path: '/keywordNegative/listByProduct',
    //mock: true,
    //showSuccess: true,
    params: {}
},
{
    name: 'adKeywordQueryAdDataOption1',
    method: 'POST',
    desc: '广告系列/组/关键词下拉选项',
    path: '/adKeywordQuery/adDataOption',
    mock:false,
    params: {}
},
{
    name: 'adKeywordSave1',
    method: 'POST',
    desc: '关键词-广告关键词-添加',
    path: '/adKeyword/save',
    //mock: true,
    newShowSuccess: true,
    params: {}
},
{
    name: 'adCampaignSave',
    method: 'POST',
    desc: '广告系列-添加',
    path: '/adCampaign/save',
    mock: true,
    newShowSuccess: true,
    params: {}
},
{
    name: 'adGroupSave',
    method: 'POST',
    desc: '广告组-添加',
    path: '/adGroup/save',
    mock: true,
    newShowSuccess: true,
    params: {}
},
{
    name: 'adTargetBrandList',
    method: 'POST',
    desc: '赞助商推荐品牌列表',
    path: '/adTarget/brandList',
    mock: true,
    params: {}
},

];