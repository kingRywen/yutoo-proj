export default [
  {
    name: 'pcCountryList',
    method: 'POST',
    mock: true,
    desc: '归属国家列表',
    path: 'pc/countryList'
  },
  {
    name: 'pcInfo',
    method: 'POST',
    mock: true,
    desc: 'pc详情页',
    path: 'pc/info'
  },
  {
    name: 'pcUpdate',
    method: 'POST',
    mock: true,
    showSuccess: true,
    desc: 'pc编辑',
    path: 'pc/update'
  },
  {
    name: 'pcSave',
    method: 'POST',
    mock: true, showSuccess: true,
    desc: 'pc新增',
    path: 'pc/save'
  },
  {
    name: 'pcRemove',
    method: 'POST',
    mock: true,
    desc: 'pc删除', showSuccess: true,
    path: 'pc/remove'
  },
  {
    name: 'pcList',
    method: 'POST',
    mock: true,
    desc: 'pc列表',
    path: 'pc/list'
  },
  {
    name: 'pcExportTemplate',
    method: 'POST',
    desc: 'pc模版下载', showSuccess: true,
    config: {
      responseType: 'blob'
    },
    path: 'pc/exportTemplate'
  },
  {
    name: 'pcImportPc',
    method: 'POST',
    desc: 'pc导入',
    path: 'pc/importPc'
  },
  {
    name: 'mobileExportTemplate',
    method: 'POST',
    desc: '手机模版下载', showSuccess: true,
    config: {
      responseType: 'blob'
    },
    path: 'mobile/exportTemplate'
  },
  {
    name: 'mobileImportMobile',
    method: 'POST',
    desc: '手机导入',
    path: 'mobile/importMobile'
  },
]
