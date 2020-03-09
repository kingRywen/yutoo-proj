export default [
  {
    name: 'financeCostTypePage',
    method: 'POST',
    desc: '成本类型-列表',
    path: '/finance/cost/type/page',
    params: {}
  },
  {
    name: 'financeCostTypeAdd',
    method: 'POST',
    desc: '成本类型-添加',
    path: '/finance/cost/type/add',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeCostTypeUpdate',
    method: 'POST',
    desc: '成本类型-编辑',
    path: '/finance/cost/type/update',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeCostTypeBatchRemove',
    method: 'POST',
    desc: '成本类型-删除',
    path: '/finance/cost/type/batch/remove',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeCostTypeListExport',
    method: 'POST',
    desc: '成本类型-导出',
    path: '/finance/cost/type/list/export',
    params: {}
  },
  {
    name: 'financeCostTypeGet',
    method: 'POST',
    desc: '成本类型-获取当前类型信息',
    path: '/finance/cost/type/get',
    params: {}
  },
  {
    name: 'financeCostTypeBatchCalculateEdit',
    method: 'POST',
    desc: '成本类型-批量纳入/取消 利润统计',
    path: '/finance/cost/type/batch/calculate/edit',
    showSuccess: true,
    params: {}
  },
  // 产品成本
  {
    name: 'financeProductCostUploadTemp',
    method: 'POST',
    desc: '产品成本-上传模板',
    path: '/finance/product/cost/type/upload',
    showSuccess: true,
    type: 'formdata',
    params: {}
  },
  {
    name: 'financeProductCostTypeTemplateExport',
    method: 'POST',
    desc: '产品成本-下载模板',
    path: '/finance/product/cost/type/template/export',
    showSuccess: true,
    params: {}
  },
  {
    name: 'financeProductCostTypeBatchRemove',
    method: 'POST',
    desc: '产品成本-删除 产品所有成本数据',
    path: '/finance/product/cost/type/batch/remove',
    params: {}
  },
  {
    name: 'financeProductCostTypePage',
    method: 'POST',
    desc: '产品成本-列表',
    path: '/finance/product/cost/type/page',
    params: {}
  },
  {
    name: 'financeProductCostTypeField',
    method: 'POST',
    desc: '产品成本-获取成本类型字段',
    path: '/finance/product/cost/type/field',
    params: {}
  },
  {
    name: 'financeProductCostTypeBatchAdd',
    method: 'POST',
    desc: '产品成本-批量添加',
    path: '/finance/product/cost/type/batch/add',
    params: {}
  },
  {
    name: 'financeProductCostTypeAllList',
    method: 'POST',
    desc: '产品成本-历史成本详情列表(历史)',
    path: '/finance/product/cost/type/all/list',
    params: {}
  },
  {
    name: 'financeProductCostTypeDataBatchRemove',
    method: 'POST',
    desc: '产品成本-删除 产品成本数据(历史)',
    path: '/finance/product/cost/type/data/batch/remove',
    params: {}
  },
  {
    name: 'financeProductCostTypeEdit',
    method: 'POST',
    desc: '产品成本-编辑修改(历史)',
    path: '/finance/product/cost/type/edit',
    params: {}
  },
  {
    name: 'financeProductCostTypeGet',
    method: 'POST',
    desc: '产品成本-获取产品成本类型数据(历史)',
    path: '/finance/product/cost/type/get',
    params: {}
  }
]
