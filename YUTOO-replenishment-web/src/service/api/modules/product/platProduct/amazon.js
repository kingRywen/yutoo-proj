export default [
  {
    name: 'prProductPlatAmzList',
    method: 'POST',
    desc: '平台产品-列表',
    path: '/prProductPlatAmz/list',
    params: {}
  },
  {
    name: 'prProductPlatAmzAuditBasic',
    method: 'POST',
    desc: '平台产品-审核-基本信息',
    showSuccess: true,
    path: '/prProductPlatAmz/auditBasic',
    params: {}
  },
  {
    name: 'prProductPlatAmzImport',
    method: 'POST',
    desc: '平台产品-导入',
    showSuccess: true,
    path: '/prProductPlatAmz/import',
    params: {}
  },
  {
    name: 'prProductPlatAmzListCount',
    method: 'POST',
    desc: '平台产品-table页数量',
    path: '/prProductPlatAmz/listCount',
    params: {}
  },
  {
    name: 'prProductPlatAmzImportAll',
    method: 'POST',
    desc: '平台产品-一键导入',
    showSuccess: true,
    path: '/prProductPlatAmz/importAll',
    params: {}
  },
  {
    name: 'prProductRepoImport',
    method: 'POST',
    desc: '平台产品-获取未导入的产品',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/query/import',
    path: '/pr/product/repo/query/import',
    params: {}
  },
  {
    name: 'prProductRepoNumber',
    method: 'POST',
    desc: '平台产品-查询导入数量',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/query/number',
    path: '/pr/product/repo/query/number',
    params: {}
  },
  {
    name: 'prProductPlatAmzAuditImg',
    method: 'POST',
    desc: '平台产品-审核-图片信息',
    showSuccess: true,
    path: '/prProductPlatAmz/auditImg',
    params: {}
  },
  {
    name: 'prProductPlatAmzRemoveLogic',
    method: 'POST',
    showSuccess: true,
    desc: '平台产品-废除/取消废除',
    path: '/prProductPlatAmz/removeLogic',
    params: {}
  },
  {
    name: 'prProductPlatAmzRemove',
    method: 'POST',
    desc: '平台产品-删除',
    showSuccess: true,
    path: '/prProductPlatAmz/remove',
    params: {}
  },
  {
    name: 'prProductPlatAmzReturnRepo',
    method: 'POST',
    desc: '平台产品-打回仓库',
    showSuccess: true,
    path: '/prProductPlatAmz/returnRepo',
    params: {}
  },
  {
    name: 'prProductPlatAmzMove',
    method: 'POST',
    desc: '平台产品-移动产品',
    showSuccess: true,
    path: '/prProductPlatAmz/move',
    params: {}
  },
  {
    name: 'prProductPlatAmzAllot',
    method: 'POST',
    desc: '平台产品-分配编辑人员',
    showSuccess: true,
    path: '/prProductPlatAmz/allot',
    params: {}
  },
  {
    name: 'prProductPlatAmzAuditInfo',
    method: 'POST',
    desc: '平台产品-查看理由',
    path: '/prProductPlatAmz/auditInfo',
    params: {}
  },
  {
    name: 'prProductPlatAmzReadyShelfSeller',
    method: 'POST',
    desc: '平台产品-选择预上架店铺',
    showSuccess: true,
    path: '/prProductPlatAmz/readyShelfSeller',
    params: {}
  },
  {
    name: 'prProductPlatAmzCancelImg',
    method: 'POST',
    desc: '平台产品-撤销图片编辑',
    showSuccess: true,
    path: '/prProductPlatAmz/cancelImg',
    params: {}
  },
  {
    name: 'platProductInfo',
    method: 'POST',
    desc: '平台产品-详情页请求',
    path: '/platProduct/info',
    params: {}
  },
  {
    name: 'platProductStoreSkuList',
    method: 'POST',
    desc: '亚马逊上传到指定父产品中sku下拉值请求',
    path: '/platProduct/storeSkuList',
    params: {}
  },
  {
    name: 'platProductSkuRuleShowFlag',
    method: 'POST',
    desc: '平台产品上架生成sku时规则页面是否展示请求',
    path: '/platProduct/skuRuleShowFlag',
    params: {}
  },
  {
    name: 'platProductSave',
    method: 'POST',
    desc: '亚马逊编辑保存/提交',
    path: '/platProduct/save',
    params: {}
  },
  {
    name: 'platProductVariantRule',
    method: 'POST',
    desc: '亚马逊店铺sku变体属性简称页面详情请求',
    path: '/platProduct/variantRule',
    params: {}
  },
  {
    name: 'platProductCustomTempProperty',
    method: 'POST',
    desc: '批量更新中选择自定义模版类型请求',
    path: '/platProduct/customTempProperty',
    params: {}
  },
  {
    name: 'platProductAmazonBatch',
    method: 'POST',
    desc: '亚马逊/ebay平台产品批量更新',
    path: '/platProduct/amazonBatch',
    params: {}
  },
  {
    name: 'platProductVariants',
    method: 'POST',
    desc: '平台产品上架选择变体下拉值请求',
    path: '/platProduct/variants',
    params: {}
  },
  {
    name: 'platProductDifferenceProperty',
    method: 'POST',
    desc: '亚马逊店铺差异/变体差异信息获取差异属性请求页面',
    path: '/platProduct/differenceProperty',
    params: {}
  },
  {
    name: 'platProductSubmit',
    method: 'POST',
    desc: '亚马逊平台产品上架提交请求',
    path: '/platProduct/submit',
    params: {}
  },
  {
    name: 'platProductCustomPropertys',
    method: 'POST',
    mock: true,
    mockPath: 'http://120.79.124.232:8001/mock/194/platProduct/customPropertys',
    desc: '亚马逊/eBay自定义导出选择属性列表也请求',
    path: '/platProduct/customPropertys',
    params: {}
  },
  {
    name: 'platProductExport',
    method: 'POST',
    mock: true,
    mockPath: 'http://120.79.124.232:8001/mock/194/platProduct/export',
    desc: '导出',
    path: '/platProduct/export',
    params: {}
  },
  {
    name: 'platProductParentProductList',
    method: 'POST',
    mock: true,
    mockPath: 'http://120.79.124.232:8001/mock/194/platProduct/parentProductList',
    desc: '复制到已有的父产品的列表',
    path: '/platProduct/parentProductList',
    params: {}
  },
  {
    name: 'platProductCreateTemplate',
    method: 'POST',
    mock: true,
    // config: {
    //   responseType: 'blob'
    // },
    mockPath: 'http://120.79.124.232:8001/mock/194/platProduct/createTemplate',
    desc: '批量上传生成下载模板请求',
    path: '/platProduct/createTemplate',
    params: {}
  },
  {
    name: 'platProductTemplateList',
    method: 'POST',
    mock: true,
    // config: {
    //   responseType: 'blob'
    // },
    mockPath: 'http://120.79.124.232:8001/mock/194/platProduct/templateList',
    desc: '批量上传下载模版列表',
    path: '/platProduct/templateList',
    params: {}
  },
  {
    name: 'platProductAffirmRel',
    method: 'POST',
    mock: true,
    mockPath: 'http://120.79.124.232:8001/mock/194/platProduct/affirmRel',
    desc: '复制到已有父产品确认关联',
    path: '/platProduct/affirmRel',
    params: {}
  },
  {
    name: 'platProductCustomSku',
    method: 'POST',
    desc: '亚马逊店铺变体sku自定义页面请求',
    path: '/platProduct/customSku',
    params: {}
  },
  {
    name: 'platProductVariationTheme',
    method: 'POST',
    desc: 'Variation Theme下拉框请求',
    path: '/platProduct/variationTheme',
    params: {}
  },
  {
    name: 'platProductSelectStore',
    method: 'POST',
    desc: '上架选择店铺下拉请求',
    mock: true,
    mockPath: 'http://120.79.124.232:8001/mock/194/platProduct/selectStore',
    path: '/platProduct/selectStore',
    params: {}
  },
  {
    name: 'platProductVariantPropertyValue',
    method: 'POST',
    desc: 'Variation Theme 点击选择获取对应变体属性值',
    path: '/platProduct/variantPropertyValue',
    params: {}
  },
  {
    name: 'prProductPlatAmzRemoveChildLogic',
    method: 'POST',
    desc: '平台产品-废除/取消废除子产品',
    showSuccess: true,
    path: '/prProductPlatAmz/removeChildLogic',
    params: {}
  },
  {
    name: 'prProductPlatAmzRemoveChild',
    method: 'POST',
    showSuccess: true,
    desc: '平台产品-删除子产品',
    path: '/prProductPlatAmz/removeChild',
    params: {}
  },
  {
    name: 'catePlatConcernMAdd',
    method: 'POST',
    
    desc: '类目管理-平台产品-收藏类目-添加',
    path: '/CatePlatConcernM/add',
    params: {}
  },
  {
    name: 'catePlatCurrent',
    method: 'POST',
    
    desc: '类目管理-平台产品类目-当前类目',
    path: '/CatePlat/current',
    params: {}
  },
  {
    name: 'catePlatConcernMRemove',
    method: 'POST',
    
    desc: '类目管理-平台产品-收藏类目-删除',
    path: '/CatePlatConcernM/remove',
    params: {}
  },
  {
    name: 'prProductPlatAmzListParent',
    method: 'POST',
    desc: '平台产品-父产品列表',
    path: '/prProductPlatAmz/listParent',
    params: {}
  },
  {
    name: 'prProductPlatAmzListChild',
    method: 'POST',
    desc: '平台产品-子产品列表',
    path: '/prProductPlatAmz/listChild',
    params: {}
  },
]
