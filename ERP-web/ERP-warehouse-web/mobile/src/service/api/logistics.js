export default [
  {
    name: 'nationList',
    method: 'POST',
    desc: '运费试算-国家列表',
    path: '/logistic/country/search/list',
    mockPath: '/logistic/country/search/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'freightTransportList',
    method: 'POST',
    desc: '运费试算-根据发货仓库获取运输方式列表',
    path: '/logistic/freight/transport/list',
    mockPath: '/logistic/freight/transport/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'provinceList',
    method: 'POST',
    desc: '运费试算-省份列表',
    path: '/logistic/province/search/list',
    mockPath: '/logistic/province/search/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'freightForecast',
    method: 'POST',
    desc: '运费试算-预算运费',
    path: '/logistic/freight/forecast',
    mockPath: '/logistic/freight/forecast',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'warehoustList',
    method: 'POST',
    desc: '运输方api管理页面-编辑页面-查询发货仓库',
    path: '/logistic/transport/type/warehoust/list',
    mockPath: '/logistic/transport/type/warehoust/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportPage',
    method: 'POST',
    desc: '运输方api管理页面-分页列表',
    path: '/logistic/transport/page',
    mockPath: '/logistic/transport/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportRemove',
    method: 'POST',
    desc: '运输方api管理页面-批量删除',
    path: '/logistic/transport/remove',
    mockPath: '/logistic/transport/remove',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportList',
    method: 'POST',
    desc: '运输方api管理页面-获取运输方式列表',
    path: '/logistic/transport/list',
    mockPath: '/logistic/transport/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportGet',
    method: 'POST',
    desc: '运输方api管理页面-运输方数据获取',
    path: '/logistic/transport/get',
    mockPath: '/logistic/transport/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportActiveSet',
    method: 'POST',
    desc: '运输方api管理页面-分页列表-修改激活状态',
    path: '/logistic/transport/active/set',
    mockPath: '/logistic/transport/active/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'transportFaceSheetSet',
    method: 'POST',
    desc: '运输方api管理页面-批量设置面单',
    path: '/logistic/transport/face/sheet/set',
    mockPath: '/logistic/transport/face/sheet/set',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportCustomsDeclarationSet',
    method: 'POST',
    desc: '运输方api管理页面-批量设置报关单',
    path: '/logistic/transport/customs/declaration/set',
    mockPath: '/logistic/transport/customs/declaration/set',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportSave',
    method: 'POST',
    desc: '运输方api管理页面-新增-编辑-运输方数据',
    path: '/logistic/transport/save',
    mockPath: '/logistic/transport/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'transportTypeSave',
    method: 'POST',
    desc: '运输方api管理页面-新增 编辑 运输方式',
    path: '/logistic/transport/type/save',
    mockPath: '/logistic/transport/type/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'manifestTempList',
    method: 'POST',
    desc: '运输方api管理页面-获取报关单模板列表',
    path: '/logistic/transport/custom/declaration/all/list',
    mockPath: '/logistic/transport/custom/declaration/all/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'faceSheetTempList',
    method: 'POST',
    desc: '运输方api管理页面-获取面单模板列表',
    path: '/logistic/transport/face/sheet/all/list',
    mockPath: '/logistic/transport/face/sheet/all/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportTypePage',
    method: 'POST',
    desc: '运输方api管理页面-运输方的运输方式分页列表',
    path: '/logistic/transport/type/page',
    mockPath: '/logistic/transport/type/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportTypeGet',
    method: 'POST',
    desc: '运输方api管理页面-运输方 运输方式 数据获取',
    path: '/logistic/transport/type/get',
    mockPath: '/logistic/transport/type/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportTypeActiveSet',
    method: 'POST',
    desc: '运输方api管理页面-运输方运输方式分页列表-激活状态-修改',
    path: '/logistic/transport/type/active/set',
    mockPath: '/logistic/transport/type/active/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'customFaceSheetTempList',
    method: 'POST',
    desc: '运输方api管理页面-编辑页面-查询自定义面单',
    path: '/logistic/transport/face/sheet/list',
    mockPath: '/logistic/transport/face/sheet/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'customManifestTempList',
    method: 'POST',
    desc: '运输方api管理页面-查询自定义报关单',
    path: '/logistic/transport/custom/declaration/list',
    mockPath: '/logistic/transport/custom/declaration/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportationList',
    method: 'POST',
    desc: '运输方api管理页面-编辑页面-查询运输方',
    path: '/logistic/transportation/list',
    mockPath: '/logistic/transportation/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderApiFieldGet',
    method: 'POST',
    desc: '运输方api管理页面-编辑页面-查询运输方api字段',
    path: '/logistic/transportation/api/field/get',
    mockPath: '/logistic/transportation/api/field/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportTypeDeclareList',
    method: 'POST',
    desc: '运输方api管理页面-编辑页面-查询包裹申请规则',
    path: '/logistic/transport/type/declare/list',
    mockPath: '/logistic/transport/type/declare/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportTypeRemove',
    method: 'POST',
    desc: '运输方api管理页面-运输方式-批量删除',
    path: '/logistic/transport/type/remove',
    mockPath: '/logistic/transport/type/remove',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'transportTypeList',
    method: 'POST',
    desc: '运输方api管理页面-运输方式管理-获取运输类型列表',
    path: '/logistic/transport/type/transport/type/list',
    mockPath: '/logistic/transport/type/transport/type/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'productTypeListGet',
    method: 'POST',
    desc: '运输方api管理页面-编辑页面-运输方式管理-限制物流属性列表',
    path: '/logistic/transport/type/restrict/list',
    mockPath: '/logistic/transport/type/restrict/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderPage',
    method: 'POST',
    desc: '运输商页面-分页列表查询',
    path: '/logistic/forwarder/page',
    mockPath: '/logistic/forwarder/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderActiveSet',
    method: 'POST',
    desc: '运输商页面-分页列表-激活状态-修改',
    path: '/logistic/forwarder/active/set',
    mockPath: '/logistic/forwarder/active/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderSave',
    method: 'POST',
    desc: '运输商页面-新增-编辑',
    path: '/logistic/forwarder/save',
    mockPath: '/logistic/forwarder/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderRemove',
    method: 'POST',
    desc: '运输商页面-批量删除',
    path: '/logistic/forwarder/remove',
    mockPath: '/logistic/forwarder/remove',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderGet',
    method: 'POST',
    desc: '运输商页面-获取运输商数据',
    path: '/logistic/forwarder/get',
    mockPath: '/logistic/forwarder/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTypeList',
    method: 'POST',
    desc: '运输商运输方式页面-编辑页面-获取所有运输方运输方式列表',
    path: '/logistic/transport/type/list',
    mockPath: '/logistic/transport/type/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeList',
    method: 'POST',
    desc: '运输商运输方式页面-编辑页面-运输商列表查询',
    path: '/logistic/forwarder/transport/type/list',
    mockPath: '/logistic/forwarder/transport/type/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'logisticRegionList',
    method: 'POST',
    desc: '运输商运输方式页面-查询区域列表',
    path: '/logistic/region/list',
    mockPath: '/logistic/region/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'globalUnitList',
    method: 'POST',
    desc: '运输商运输方式页面-单位列表',
    path: '/global/unit/list',
    mockPath: '/global/unit/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'unitItemTypeList',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-币种列表-端口-7083',
    path: '/global/unit/item/type/list',
    mockPath: '/global/unit/item/type/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypePage',
    method: 'POST',
    desc: '运输商运输方式页面-分页查询',
    path: '/logistic/forwarder/transport/type/page',
    mockPath: '/logistic/forwarder/transport/type/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeAllList',
    method: 'POST',
    desc: '运输商运输方式页面-查询运输商所有运输方式',
    path: '/logistic/forwarder/transport/type/all/list',
    mockPath: '/logistic/forwarder/transport/type/all/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeRegionFreightPage',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费分页列表',
    path: '/logistic/forwarder/transport/type/region/freight/page',
    mockPath: '/logistic/forwarder/transport/type/region/freight/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeRegionFreightSave',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费新增 编辑',
    path: '/logistic/forwarder/transport/type/region/freight/save',
    mockPath: '/logistic/forwarder/transport/type/region/freight/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeRegionFreightget',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费 获取数据',
    path: '/logistic/forwarder/transport/type/region/freight/get',
    mockPath: '/logistic/forwarder/transport/type/region/freight/get',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeRegionFreightRemove',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-批量删除',
    path: '/logistic/forwarder/transport/type/region/freight/remove',
    mockPath: '/logistic/forwarder/transport/type/region/freight/remove',
    showSuccess: false,
    mock: false,
    params: {}
  },

  {
    name: 'forwarderTransportTypeRegionFreightTimeSet',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-设置预计到达天数-（可批量）',
    path: '/logistic/forwarder/transport/type/region/freight/time/set',
    mockPath: '/logistic/forwarder/transport/type/region/freight/time/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeRegionGet',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-获取区域下国家-省份',
    path: '/logistic/forwarder/transport/type/region/get',
    mockPath: '/logistic/forwarder/transport/type/region/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeNationSelectPage',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-选择国家分页搜索',
    path: '/logistic/forwarder/transport/type/country/select/page',
    mockPath: '/logistic/forwarder/transport/type/nation/select/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeCountrySelect',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-选择国家',
    path: '/logistic/forwarder/transport/type/country/select',
    mockPath: '/logistic/forwarder/transport/type/country/select',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeCountrySelectRemove',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-删除选择国家',
    path: '/logistic/forwarder/transport/type/country/select/remove',
    mockPath: '/logistic/forwarder/transport/type/country/select/remove',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeProvinceSelectPage',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-选择省份分页搜索',
    path: '/logistic/forwarder/transport/type/province/select/page',
    mockPath: '/logistic/forwarder/transport/type/province/select/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeProvinceSelect',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-选择省份',
    path: '/logistic/forwarder/transport/type/province/select',
    mockPath: '/logistic/forwarder/transport/type/province/select',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeProvinceSelectRemove',
    method: 'POST',
    desc: '运输商运输方式页面-区域运费-删除选择省份',
    path: '/logistic/forwarder/transport/type/province/select/remove',
    mockPath: '/logistic/forwarder/transport/type/province/select/remove',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeSave',
    method: 'POST',
    desc: '运输商运输方式页面-新增-编辑',
    path: '/logistic/forwarder/transport/type/save',
    mockPath: '/logistic/forwarder/transport/type/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeGet',
    method: 'POST',
    desc: '运输商运输方式页面-新增',
    path: '/logistic/forwarder/transport/type/get',
    mockPath: '/logistic/forwarder/transport/type/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderList',
    method: 'POST',
    desc: '运输商运输方式页面-编辑页面-运输商列表查询',
    path: '/logistic/forwarder/list',
    mockPath: '/logistic/forwarder/list',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'forwarderTransportTypeRemove',
    method: 'POST',
    desc: '运输商运输方式页面-批量删除',
    path: '/logistic/forwarder/transport/type/remove',
    mockPath: '/logistic/forwarder/transport/type/remove',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'regionPage',
    method: 'POST',
    desc: '区域管理页面-分页查询',
    path: '/logistic/region/page',
    mockPath: '/logistic/region/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'regionRemove',
    method: 'POST',
    desc: '区域管理页面-批量删除',
    path: '/logistic/region/remove',
    mockPath: '/mock/36/logistic/region/remove',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'regionSave',
    method: 'POST',
    desc: '区域管理页面-新增-编辑',
    path: '/logistic/region/save',
    mockPath: '/logistic/region/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'regionCountryRemove',
    method: 'POST',
    desc: '区域管理页面-区域国家删除',
    path: '/logistic/region/country/remove',
    mockPath: '/logistic/region/country/remove',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'regionNationProvinceEditPage',
    method: 'POST',
    desc: '区域管理页面-区域-编辑-获取省份分页查询列表',
    path: '/logistic/region/province/edit/page',
    mockPath: '/logistic/region/province/edit/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'provinceAddPage',
    method: 'POST',
    desc: '区域管理页面-区域 新增 获取省份分页查询列表',
    path: '/logistic/region/province/add/page',
    mockPath: '/logistic/region/province/add/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'provinceAddSelect',
    method: 'POST',
    desc: '区域管理页面-区域 新增省份 确认选择',
    path: '/logistic/region/province/add/select',
    mockPath: '/logistic/region/province/add/select',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'provinceEditSelect',
    method: 'POST',
    desc: '区域管理页面-区域 编辑省份 确认选择',
    path: '/logistic/region/province/edit/select',
    mockPath: '/logistic/region/province/edit/select',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'regionGet',
    method: 'POST',
    desc: '区域管理页面-获取区域数据',
    path: '/logistic/region/get',
    mockPath: '/logistic/region/get',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'countryTemplateDownload',
    method: 'POST',
    desc: '区域管理页面-省份导入 国家 模板下载',
    path: '/logistic/country/template/download',
    mockPath: '/logistic/country/template/download',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'regionTemplateDownload',
    method: 'POST',
    desc: '区域管理页面-国家导入区域 模板下载',
    path: '/logistic/region/template/download',
    mockPath: '/logistic/region/template/download',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'regionTemplateUpload',
    method: 'POST',
    desc: '区域管理页面-国家导入区域 模板上传',
    path: '/logistic/region/template/upload',
    mockPath: '/logistic/region/template/upload',
    showSuccess: false,
    mock: false,
    params: {},
    type: 'formData'
  },
  {
    name: 'countryTemplateUpload',
    method: 'POST',
    desc: '区域管理页面-国家导入区域 模板上传',
    path: '/logistic/country/template/upload',
    mockPath: '/logistic/country/template/upload',
    showSuccess: false,
    mock: false,
    params: {},
    type: 'formData'
  },
  {
    name: 'declareSave',
    method: 'POST',
    desc: '申报规则页面-新增编辑',
    path: '/logistic/declare/save',
    mockPath: '/logistic/declare/save',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'declareActiveSet',
    method: 'POST',
    desc: '申报规则页面-分页列表 激活状态 修改',
    path: '/logistic/declare/active/set',
    mockPath: '/logistic/declare/active/set',
    showSuccess: true,
    mock: false,
    params: {}
  },
  {
    name: 'logisticRegionNationProvincePage',
    method: 'POST',
    desc: '申报规则页面-区域已选国家省份分页列表',
    path: '/logistic/region/country/province/page',
    mockPath: '/logistic/region/nation/province/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'declarePage',
    method: 'POST',
    desc: '申报规则页面-分页列表',
    path: '/logistic/declare/page',
    mockPath: '/logistic/declare/page',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'declareRemove',
    method: 'POST',
    desc: '申报规则页面-批量删除',
    path: '/logistic/declare/remove',
    mockPath: '/logistic/declare/remove',
    showSuccess: false,
    mock: false,
    params: {}
  },
  {
    name: 'declareInfo',
    method: 'POST',
    desc: '申报规则页面-详情',
    path: '/logistic/declare/info',
    mockPath: '/logistic/declare/info',
    showSuccess: false,
    mock: false,
    params: {}
  }
]
