export default [
  {
    name: 'vmList',
    method: 'POST',
    desc: '虚拟机列表',
    path: 'vm/list'
  },
  {
    name: 'vmSave',
    method: 'POST',
    desc: '虚拟机新增',
    path: 'vm/save'
  },
  {
    name: 'vmInfo',
    method: 'POST',
    desc: '详情',
    path: 'vm/info'
  },
  {
    name: 'vmUpdate',
    method: 'POST',
    desc: '编辑',
    path: 'vm/update'
  },
  {
    name: 'vmRemove',
    method: 'POST',
    desc: '删除',
    path: 'vm/remove'
  },
  {
    name: 'vmCountryList',
    method: 'POST',
    desc: '虚拟机归属国家列表',
    path: 'vm/countryList'
  },
  {
    name: 'vmImportVm',
    method: 'POST',
    desc: '虚拟机导入',
    path: 'vm/importVm'
  },
  {
    name: 'vmExportTemplate',
    method: 'POST',
    desc: '虚拟机模版下载',
    config: {
    responseType: "blob"
  },
    path: 'vm/exportTemplate'
  },
]
