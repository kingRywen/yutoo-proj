export default [
  {
    name: 'sameAttrConfigDownloadTemplate',
    method: 'POST',
    desc: '导入类目属性-下载模板',
    path: '/sameAttrConfig/downloadTemplate',
    mockPath: '',
    config: {
      responseType: "blob"
    },
    mock: false,
    showSuccess:true,
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigSave',
    method: 'POST',
    desc: '添加类目',
    path: '/sameAttrConfig/save',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['sellerId','siteId','pcid'],
    pcommonarams: {
    }
  },
  // {
  //   name: 'sameAttrConfigBatchRemove',
  //   method: 'POST',
  //   desc: '删除(批量)',
  //   path: '/sameAttrConfig/batchRemove',
  //   mockPath: '',
  //   mock: false,
  //   showSuccess:true,
  //   must: ['sellerId','siteId','ids'],
  //   pcommonarams: {
  //   }
  // },
  // {
  //   name: 'sameAttrConfigList',
  //   method: 'POST',
  //   desc: '列表展示',
  //   path: '/sameAttrConfig/list',
  //   mockPath: '',
  //   mock: false,
  //   //showSuccess:true,
  //   must: ['sellerId','siteId'],
  //   pcommonarams: {
  //   }
  // },
  {
    name: 'sameAttrConfigSaveSub',
    method: 'POST',
    desc: '新增下级',
    path: '/sameAttrConfig/saveSub',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['sellerId','siteId', 'parentPcid', 'pcid'],
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigDetailSave',
    method: 'POST',
    desc: '类目属性-添加',
    path: '/sameAttrConfigDetail/save',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['sellerId','siteId', 'parentName', 'cusAttrKey', 'name'],
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigDetailBatchSave',
    method: 'POST',
    desc: '类目属性-批量添加',
    path: '/sameAttrConfigDetail/batchSave',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['sellerId','siteId', 'parentName', 'cusAttrKeys', 'name'],
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigDetailBatchRemove',
    method: 'POST',
    desc: '类目属性-删除(批量)',
    path: '/sameAttrConfigDetail/batchRemove',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['sellerId','siteId', 'parentName', 'name', 'ids'],
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigDetailUpdate',
    method: 'POST',
    desc: '类目属性-修改(设置关联字段/是否同款属性/修改属性名称)',
    path: '/sameAttrConfigDetail/update',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['sellerId','siteId', 'parentName', 'name', 'attrId'],
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigDetailList',
    method: 'POST',
    desc: '类目属性-列表展示(分页)',
    path: '/sameAttrConfigDetail/list',
    allowNull: ['parentName'],
    mockPath: '',
    mock: false,
    // showSuccess:true,
    must: ['sellerId','siteId', 'parentName', 'name'],
    pcommonarams: {
    }
  },
  {
    name: 'selAttrCategorySyncConfig',
    method: 'POST',
    desc: '同步类目同款设置',
    path: '/selAttrCategory/syncConfig',
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigDetailListAll',
    method: 'POST',
    desc: '类目属性-列表展示(不分页)',
    path: '/sameAttrConfigDetail/listAll',
    mockPath: '',
    mock: false,
    // showSuccess:true,
    must: ['sellerId','siteId', 'parentName', 'name'],
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigDetailListAttrAmazon',
    method: 'POST',
    desc: '类目属性-亚马逊属性列表',
    path: '/sameAttrConfigDetail/listAttrAmazon',
    mockPath: '',
    mock: false,
    // showSuccess:true,
    must: ['parentName', 'name'],
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigImportData',
    method: 'POST',
    desc: '导入类目属性-上传模板',
    path: '/sameAttrConfig/importData',
    mockPath: '',
    mock: false,
    // showSuccess:true,
    must: ['sellerId','siteId','file', 'pcid'],
    pcommonarams: {
    }
  },
  {
    name: 'sameAttrConfigDetailDetail',
    method: 'POST',
    desc: '类目属性-属性详情',
    path: '/sameAttrConfigDetail/detail',
    mockPath: '',
    mock: false,
    // showSuccess:true,
    must: ['sellerId','siteId','name', 'parentName', 'attrId'],
    pcommonarams: {
    }
  },
  {
    name: 'taskClaimTemplateSave',
    method: 'POST',
    desc: '索赔模板设置-添加',
    path: '/taskClaimTemplate/save',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['sellerId','siteId','platformId', 'templateName', 'templateType', 'contactReason', 'templateContent', 'defaultFlag'],
    pcommonarams: {
    }
  },
  {
    name: 'taskClaimTemplateList',
    method: 'POST',
    desc: '索赔模板设置-列表',
    path: '/taskClaimTemplate/list',
    mockPath: '',
    mock: false,
    // showSuccess:true,
    must: ['sellerId','siteId','platformId'],
    pcommonarams: {
    }
  },
  {
    name: 'taskClaimTemplateUpdate',
    method: 'POST',
    desc: '索赔模板设置-编辑',
    path: '/taskClaimTemplate/update',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['templateId','templateName','templateType', 'contactReason', 'templateContent', 'defaultFlag'],
    pcommonarams: {
    }
  },
  {
    name: 'taskClaimTemplateRemove',
    method: 'POST',
    desc: '索赔模板设置-删除',
    path: '/taskClaimTemplate/remove',
    mockPath: '',
    mock: false,
    showSuccess:true,
    must: ['templateIds'],
    pcommonarams: {
    }
  },
]
