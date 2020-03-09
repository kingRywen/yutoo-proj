export default [
  {
    name: 'PrConfigSkuRuleList',
    method: 'POST',
    desc: '通用设置-SKU生成规则-仓库|店铺SKU-列表查询',
    path: '/PrConfigSkuRule/list',
    params: {}
  },
  {
    name: 'PrConfigSkuRuleSave',
    method: 'POST',
    desc: '通用设置-SKU生成规则-仓库|店铺SKU-新增',
    showSuccess: true,
    path: '/PrConfigSkuRule/save',
    params: {}
  },
  {
    name: 'PrConfigSkuRuleInfo',
    method: 'POST',
    desc: '通用设置-SKU生成规则-仓库|店铺SKU-详情查询',
    path: '/PrConfigSkuRule/info',
    params: {}
  },
  {
    name: 'PrConfigSkuRuleUpdate',
    method: 'POST',
    desc: '通用设置-SKU生成规则-仓库|店铺SKU-编辑',
    showSuccess: true,
    path: '/PrConfigSkuRule/update',
    params: {}
  },  
  {
    name: 'PrConfigSkuRuleRemove',
    method: 'POST',
    desc: '通用设置-SKU生成规则-仓库|店铺SKU-删除',
    showSuccess: true,
    path: '/PrConfigSkuRule/remove',
    params: {}
  },
  {
    name: 'PrConfigSkuRulePreview',
    method: 'POST',
    desc: '通用设置-SKU生成规则-仓库|店铺SKU-预览',
    path: '/PrConfigSkuRule/preview',
    params: {}
  },
  
  
  {
    name: 'PrConfigSkuRuleDropDownRepo',
    method: 'POST',
    desc: '通用设置-SKU生成规则-仓库SKU-规则公式-下拉框查询',
    path: '/PrConfigSkuRule/dropDown/repo',
    params: {}
  },
  {
    name: 'PrConfigSkuRuleDropDownSeller',
    method: 'POST',
    desc: '通用设置-SKU生成规则-店铺SKU-规则公式-下拉框查询',
    path: '/PrConfigSkuRule/dropDown/seller',
    params: {}
  },
]
