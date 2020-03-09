export default [{
    name: 'prProductRepoStatusCount',
    method: 'POST',
    desc: '仓库产品-获取上侧状态统计',
    path: '/pr/product/repo/status/count',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/status/count',
    params: {}
  },
  {
    name: 'prProductRepoList',
    method: 'POST',
    desc: '仓库产品-列表',
    path: '/pr/product/repo/list',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/list',
    params: {}
  },
  // {
  //   name: 'CateSystemCategoryTree',
  //   method: 'POST',
  //   desc: '仓库产品-左侧类目树',
  //   path: '/CateSystemCategory/tree',
  //   mockPath: 'http://120.79.124.232:8001/mock/194/CateSystemCategory/tree',
  //   params: {}
  // },
  {
    name: 'prProductRepoMoveVariant',
    method: 'POST',
    desc: '仓库产品-移动变体',
    path: '/pr/product/repo/move/variant',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/move/variant',
    showSuccess: true,
    params: {}
  },
  {
    name: 'prProductRepoParentList',
    method: 'POST',
    desc: '仓库产品-根据变体获取母体',
    path: '/pr/product/repo/parent/list',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/parent/list',
    params: {}
  },
  {
    name: 'prProductRepoChildList',
    method: 'POST',
    desc: '仓库产品-根据类目id获取子产品',
    path: '/pr/product/repo/child/list',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/child/list',
    params: {}
  },
  {
    name: 'glWarehouseGetComboBox',
    method: 'POST',
    desc: '仓库产品-获取仓库下拉框',
    path: '/gl/warehouse/getComboBox',
    mockPath: 'http://120.79.124.232:8001/mock/187/gl/warehouse/getComboBox',
    params: {}
  },
  {
    name: 'permissionUserList',
    method: 'POST',
    desc: '仓库产品-获取人员下拉框',
    path: '/permission/user/list',
    mockPath: 'http://120.79.124.232:8001/mock/194/permission/user/list',
    params: {}
  },
  {
    name: 'GlReportUploadList',
    method: 'POST',
    desc: '上传文件-列表查询',
    path: '/GlReportUpload/list',
    mockPath: 'http://120.79.124.232:8001/mock/194/GlReportUpload/list',
    params: {}
  },
  {
    name: 'glSupplierGetComboBox',
    method: 'POST',
    desc: '仓库产品-获取供应商下拉框',
    path: '/gl/supplier/getComboBox',
    mockPath: 'http://120.79.124.232:8001/mock/187/gl/supplier/getComboBox',
    params: {}
  },
  {
    name: 'prProductRepoDelete',
    method: 'POST',
    desc: '仓库产品-删除',
    path: '/pr/product/repo/delete',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/delete',
    showSuccess: true,
    params: {}
  },
  {
    name: 'prProductRepoExamine',
    method: 'POST',
    desc: '仓库产品-审核',
    path: '/pr/product/repo/examine',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/examine',
    showSuccess: true,
    params: {}
  },
  {
    name: 'prProductRepoImportTemplateDownload',
    method: 'POST',
    desc: '下载模板',
	config: {
	  responseType: 'blob'
	},
    path: '/pr/product/repo/import/template/download',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/import/template/download',
    showSuccess: true,
    params: {}
  },
  {
    name: 'prProductRepoImportUpload',
    method: 'POST',
    desc: '上传文件',
	config: {
	  responseType: 'blob'
	},
    path: '/pr/product/repo/import/upload',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/import/upload',
    showSuccess: true,
    params: {}
  },
  {
    name: 'CateSystemCategoryTree',
    method: 'POST',
    desc: '类目管理-仓库产品-左侧类目树',
    path: '/CateSystemCategory/tree',
    mockPath: 'http://120.79.124.232:8001/mock/194/CateSystemCategory/tree',
    params: {}
  },
  {
    name: 'prProductRepoExport',
    method: 'POST',
    desc: '仓库产品-自定义导出',
    path: '/pr/product/repo/export',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/export',
    params: {},
    config: {
      responseType: 'blob'
    },
  },
  {
    name: 'prProductRepoReason',
    method: 'POST',
    desc: '仓库产品-查看理由',
    path: '/pr/product/repo/reason',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/reason',
    params: {}
  },
  {
    name: 'prProductRepoLog',
    method: 'POST',
    desc: '仓库产品-查看操作日志',
    path: '/pr/product/repo/log',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/log',
    params: {}
  },
  {
    name: 'prProductRepoCancel',
    method: 'POST',
    desc: '仓库产品-废除/取消废除',
    path: '/pr/product/repo/cancel',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/cancel',
    showSuccess: true,
    params: {}
  },
  {
    name: 'prProductRepoLock',
    method: 'POST',
    desc: '仓库产品-锁定/取消锁定',
    path: '/pr/product/repo/lock',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/lock',
    showSuccess: true,
    params: {}
  },
  {
    name: 'prProductRepoSetStatus',
    method: 'POST',
    desc: '仓库产品-设置生产状态',
    path: '/pr/product/repo/setStatus',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/setStatus',
    showSuccess: true,
    params: {}
  },
  {
    name: 'prProductRepoAssignment',
    method: 'POST',
    desc: '仓库产品-分配人员',
    path: '/pr/product/repo/assignment',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/assignment',
    showSuccess: true,
    params: {}
  },
  {
    name: 'glEnumList',
    method: 'POST',
    desc: '获取公共枚举',
    path: '/GlEnum/list',
    mockPath: 'http://120.79.124.232:8001/mock/194/GlEnum/list',
    singleLoading: true,
    params: {}
  },
  {
    name: 'glEnumSave',
    method: 'POST',
    desc: '公共枚举-创建',
    path: '/GlEnum/save',
    mockPath: 'http://120.79.124.232:8001/mock/194/GlEnum/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'glEnumRemove',
    method: 'POST',
    desc: '公共枚举-删除',
    path: '/GlEnum/remove',
    mockPath: 'http://120.79.124.232:8001/mock/194/GlEnum/remove',
    singleLoading: true,
    params: {}
  },
  {
    name: 'cateSystemCategoryPropertyMDropDownVariation',
    method: 'POST',
    desc: '公共枚举-删除',
    path: '/CateSystemCategoryPropertyM/dropDown/variation',
    mockPath: 'http://120.79.124.232:8001/mock/194/CateSystemCategoryPropertyM/dropDown/variation',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoVariantGenerate',
    method: 'POST',
    desc: '生成变体',
    path: '/pr/product/repo/variant/generate',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/variant/generate',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoVariantSave',
    method: 'POST',
    desc: '下一步保存变体',
    path: '/pr/product/repo/variant/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/variant/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'categoryTree',
    method: 'POST',
    desc: '类目管理-感兴趣|收藏（系统|平台）-类目树',
    path: '/Category/tree',
    mockPath: 'http://120.79.124.232:8001/mock/194/Category/tree',
    singleLoading: true,
    params: {}
  },
  {
    name: 'cateSystemCategoryInterestedMList',
    method: 'POST',
    desc: '类目管理-仓库产品类目-列表查询',
    path: '/CateSystemCategoryInterestedM/list',
    mockPath: 'http://120.79.124.232:8001/mock/194/CateSystemCategoryInterestedM/list',
    singleLoading: true,
    params: {}
  },
  {
    name: 'cateSystemCategoryPropertyMPropertyList',
    method: 'POST',
    desc: '平台产品-属性集合',
    path: '/CateSystemCategoryPropertyM/propertyList',
    mockPath: 'http://120.79.124.232:8001/mock/194/CateSystemCategoryPropertyM/propertyList',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoVariantGetComboBox',
    method: 'POST',
    desc: '获取当前母体下面的所有变体',
    path: '/pr/product/repo/variant/getComboBox',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/variant/getComboBox',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoGetVariantPropertyValue',
    method: 'POST',
    desc: '根据变体属性id，获取变体属性值',
    path: '/pr/product/repo/get/variant/property/value',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/get/variant/property/value',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoImageGet',
    method: 'POST',
    desc: '获取图片',
    path: '/pr/product/repo/image/get',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/image/get',
    singleLoading: true,
    params: {}
  },
  {
    name: 'constantRealPathGet',
    method: 'POST',
    desc: '获取上传文件路径',
    path: '/constant/realPath/get',
    mockPath: 'http://120.79.124.232:8001/mock/187/constant/realPath/get',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoImageSave',
    method: 'POST',
    desc: '保存图片',
    path: '/pr/product/repo/image/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/image/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoImageDelete',
    method: 'POST',
    desc: '删除图片',
    path: '/pr/product/repo/image/delete',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/image/delete',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoAnnexSave',
    method: 'POST',
    desc: '保存产品附件',
    path: '/pr/product/repo/annex/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/annex/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoAnnexGet',
    method: 'POST',
    desc: '获取产品附件',
    path: '/pr/product/repo/annex/get',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/annex/get',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoAnnexDelete',
    method: 'POST',
    desc: '删除产品附件',
    path: '/pr/product/repo/annex/delete',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/annex/delete',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoAnnexSingleSave',
    method: 'POST',
    desc: '保存单个产品附件',
    path: '/pr/product/repo/annex/single/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/annex/single/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoAccessoryGet',
    method: 'POST',
    desc: '获取产品配件',
    path: '/pr/product/repo/accessory/get',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/accessory/get',
    singleLoading: true,
    params: {}
  },

  {
    name: 'prProductRepoAccessorySave',
    method: 'POST',
    desc: '保存产品配件',
    path: '/pr/product/repo/accessory/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/accessory/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoAccessoryDelete',
    method: 'POST',
    desc: '删除产品配件',
    path: '/pr/product/repo/accessory/delete',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/accessory/delete',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoAccessoryGetSingle',
    method: 'POST',
    desc: '获取单个产品配件',
    path: '/pr/product/repo/accessory/get/single',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/accessory/get/single',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoPackageMaterialSave',
    method: 'POST',
    desc: '保存包材',
    path: '/pr/product/repo/package/material/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/package/material/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoPackageMaterialGet',
    method: 'POST',
    desc: '获取包材',
    path: '/pr/product/repo/package/material/get',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/package/material/get',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoPackageMaterialDelete',
    method: 'POST',
    desc: '删除包材',
    path: '/pr/product/repo/package/material/delete',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/package/material/delete',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoPackageMaterialInfo',
    method: 'POST',
    desc: '获取包材详情',
    path: '/pr/product/repo/package/material/info',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/package/material/info',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoParentListByCategory',
    method: 'POST',
    desc: '根据类目id。获取母体集合',
    path: '/pr/product/repo/parent/list/by/category',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/parent/list/by/category',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoVariantGetCategory',
    method: 'POST',
    desc: '根据母体id查询变体',
    path: '/pr/product/repo/variant/get/category',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/variant/get/category',
    singleLoading: true,
    params: {}
  },
  {
    name: 'cateSystemCategoryConcernMAdd',
    method: 'POST',
    desc: '类目管理-仓库产品-收藏类目-添加',
    path: '/CateSystemCategoryConcernM/add',
    mockPath: 'http://120.79.124.232:8001/mock/194/CateSystemCategoryConcernM/add',
    singleLoading: true,
    params: {}
  },
  {
    name: 'cateSystemCategoryConcernMRemove',
    method: 'POST',
    desc: '类目管理-仓库产品-收藏类目-删除',
    path: '/CateSystemCategoryConcernM/remove',
    mockPath: 'http://120.79.124.232:8001/mock/194/CateSystemCategoryConcernM/remove',
    singleLoading: true,
    params: {}
  },
  {
    name: 'glWarehouseSave',
    method: 'POST',
    desc: '添加仓库',
    path: '/gl/warehouse/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/gl/warehouse/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'glBrandGetComboBox',
    method: 'POST',
    desc: '获取品牌下拉框',
    path: '/gl/brand/getComboBox',
    mockPath: 'http://120.79.124.232:8001/mock/187/gl/brand/getComboBox',
    singleLoading: true,
    params: {}
  },
  {
    name: 'glBrandSave',
    method: 'POST',
    desc: '添加品牌',
    path: '/gl/brand/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/gl/brand/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'constantWarehouseType',
    method: 'POST',
    desc: '仓库类型',
    path: 'constant/WarehouseType',
    mockPath: 'http://120.79.124.232:8001/constant/WarehouseType',
    singleLoading: true,
    params: {}
  },
  {
    name: 'constantBrandType',
    method: 'POST',
    desc: '品牌类型',
    path: '/constant/brandType',
    mockPath: 'http://120.79.124.232:8001/constant/brandType',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prConsumablesGetComboBox',
    method: 'POST',
    desc: '获取产品耗材',
    path: '/pr/consumables/getComboBox',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/consumables/getComboBox',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoSave',
    method: 'POST',
    desc: '保存基本信息和变体差异和备注和组合sku',
    path: '/pr/product/repo/save',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/save',
    singleLoading: true,
    params: {}
  },
  {
    name: 'prProductRepoGet',
    method: 'POST',
    desc: '获取基本信息和变体差异和备注和组合信息',
    path: '/pr/product/repo/get',
    mockPath: 'http://120.79.124.232:8001/mock/187/pr/product/repo/get',
    singleLoading: true,
    params: {}
  },

]