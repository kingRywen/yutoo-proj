export default [
  {
    name: 'PrConfigTitleRuleList',
    method: 'POST',
    desc: '通用设置-标题规则-列表查询',
    path: '/PrConfigTitleRule/list',
    params: {}
  },
  {
    name: 'PrConfigTitleRuleSave',
    method: 'POST',
    desc: '通用设置-标题规则-新增',
    showSuccess: true,
    path: '/PrConfigTitleRule/save',
    params: {}
  },
  {
    name: 'PrConfigTitleRuleInfo',
    method: 'POST',
    desc: '通用设置-标题规则-查看详情',
    path: '/PrConfigTitleRule/info',
    params: {}
  },
  {
    name: 'PrConfigTitleRuleUpdate',
    method: 'POST',
    desc: '通用设置-标题规则-编辑',
    showSuccess: true,
    path: '/PrConfigTitleRule/update',
    params: {}
  },  
  {
    name: 'PrConfigTitleRuleRemove',
    method: 'POST',
    desc: '通用设置-标题规则-删除',
    showSuccess: true,
    path: '/PrConfigTitleRule/remove',
    params: {}
  },
  {
    name: 'PrConfigTitleRulePreview',
    method: 'POST',
    desc: '通用设置-标题规则-预览',
    path: '/PrConfigTitleRule/preview',
    params: {}
  },
  {
    name: 'GlStoreDropDown',
    method: 'POST',
    desc: '店铺管理-店铺信息-下拉框查询',
    path: '/GlStore/dropDown',
    params: {}
  },
  {
    name: 'CateSystemCategoryTreeTitleRule',
    method: 'POST',
    desc: '类目管理-标题规则-左侧类目树',
    path: '/CateSystemCategory/tree/titleRule',
    params: {}
  },
  
  {
    name: 'PrConfigTitleRuleDropDown',
    method: 'POST',
    desc: '通用设置-标题规则-规则公式-下拉框查询',
    path: '/PrConfigTitleRule/dropDown',
    params: {}
  },
  {
    name: 'CateSystemCategoryTreeTitleWordHasGroup',
    method: 'POST',
    desc: '类目管理-标题词库-添加标题规则时用',
    path: '/CateSystemCategory/tree/titleWord/hasGroup',
    params: {}
  },
]
