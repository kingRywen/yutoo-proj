export default [
  {
    name: 'recycleBatchDeliver',
    method: 'POST',
    mock: true,
    showSuccess: true,
    desc: '批量发货',
    path: 'recycle/batchDeliver'
  },
  {
    name: 'recycleOutStorageInfo',
    method: 'POST',
    mock: true,
    desc: '出库申请页面展示',
    path: 'recycle/outStorageInfo'
  },
  {
    name: 'recycleExplainInfo',
    method: 'POST',
    mock: true,
    desc: '编辑费用说明详情页',
    path: 'recycle/explainInfo'
  },
  {
    name: 'recycleExplainUpdate',
    method: 'POST',
    mock: true,
    desc: '编辑费用说明保存',
    showSuccess: true,
    path: 'recycle/explainUpdate'
  },
  {
    name: 'recyclePack',
    method: 'POST',
    mock: true,
    desc: '打包',
    showSuccess: true,
    path: 'recycle/pack'
  },
  {
    name: 'recycleDownloadStorage',
    method: 'POST',
    mock: true,
    desc: '下载库位',
    config: {
      responseType: 'blob'
    },
    showSuccess: true,
    path: 'recycle/downloadStorage'
  },
  {
    name: 'recycleImportStorage',
    method: 'POST',
    mock: true,
    desc: '导入库位',
    type: 'formdata',
    showSuccess: true,
    path: 'recycle/importStorage'
  },
  {
    name: 'recyclePrintRepoLabel',
    method: 'POST',
    mock: true,
    desc: '打印仓库标签',
    showSuccess: true,
    path: 'recycle/printRepoLabel'
  },
  {
    name: 'recycleStorageLocation',
    method: 'POST',
    mock: true,
    desc: '库位',
    path: 'recycle/storageLocation'
  },
  {
    name: 'recycleDeliverInfo',
    method: 'POST',
    mock: true,
    desc: '发货详情',
    path: 'recycle/deliverInfo'
  },
  {
    name: 'recycleAuditInStorage',
    method: 'POST',
    mock: true,
    desc: '入库审核',
    showSuccess: true,
    path: 'recycle/auditInStorage'
  },
  {
    name: 'recycleAuditOutStorage',
    method: 'POST',
    mock: true,
    desc: '出库审核',
    showSuccess: true,
    path: 'recycle/auditOutStorage'
  },
  {
    name: 'recycleDeliver',
    method: 'POST',
    mock: true,
    desc: '发货',
    showSuccess: true,
    path: 'recycle/deliver'
  },
  {
    name: 'recycleList',
    method: 'POST',
    mock: true,
    desc: '商品回收列表',
    path: 'recycle/list'
  }
]
