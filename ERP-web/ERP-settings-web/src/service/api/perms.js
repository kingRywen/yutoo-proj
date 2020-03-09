export default [{
  name: 'userlogin',
  method: 'POST',
  desc: '商户登录',
  path: '/login',
  params: {}
}, {
  name: 'merchantmenu',
  method: 'POST',
  desc: '获取主工作台列表',
  path: '/merchant/menu/list/by/user',
  params: {}
}, {
  name: 'roleList',
  method: 'POST',
  desc: '【角色】列表',
  path: '/merchant/role/list',
  params: {}
},{
  name: 'merchantRoleDefList',
  method: 'POST',
  desc: '【角色】选项',
  path: '/merchant/role/defList',
  params: {}
}, {
  name: 'roleMenuRel',
  method: 'POST',
  desc: '【角色】新增权限和角色关联',
  path: '/merchant/role/menu/rel',
  params: {}
}, {
  name: 'roleSave',
  method: 'POST',
  desc: '【角色】新增商户角色',
  showSuccess: true,
  path: '/merchant/role/save',
  params: {}
}, {
  name: 'roleInfo',
  method: 'POST',
  desc: '【角色】查看商户角色',
  path: '/merchant/role/info',
  params: {}
}, {
  name: 'roleRemoveConfirm',
  method: 'POST',
  desc: '【角色】确认删除商户角色',
  showSuccess: true,
  path: '/merchant/role/remove/confirm',
  params: {}
}, {
  name: 'roleUpdate',
  method: 'POST',
  desc: '【角色】修改商户角色',
  showSuccess: true,
  path: '/merchant/role/update',
  params: {}
}, {
  name: 'roleLog',
  method: 'POST',
  desc: '【角色】查看操作日志',
  path: '/merchant/role/log',
  params: {}
}, {
  name: 'departmentList',
  method: 'POST',
  desc: '【部门】列表',
  path: '/merchant/department/list',
  params: {}
}, {
  name: 'departmentSave',
  method: 'POST',
  desc: '【部门】新增',
  path: '/merchant/department/save',
  params: {}
}, {
  name: 'departmentUpdate',
  method: 'POST',
  desc: '【部门】更新',
  path: '/merchant/department/update',
  params: {}
}, {
  name: 'departmentInfo',
  method: 'POST',
  desc: '【部门】查询',
  path: '/merchant/department/info',
  params: {}
}, {
  name: 'departmentRemove',
  method: 'POST',
  desc: '【部门】删除',
  path: '/merchant/department/remove',
  params: {}
}, {
  name: 'departmentSetDepartment',
  method: 'POST',
  desc: '【部门】给用户设置部门',
  path: '/merchant/department/set/department',
  params: {}
}, {
  name: 'menuListAll',
  method: 'POST',
  desc: '【权限】查询所有权限',
  path: '/merchant/menu/list/all',
  params: {}
},
{
  
  name: 'permissionStoreDataList',
  method: 'POST',
  desc: '【权限】分页-用户店铺数据权限分页（permission模块）',
  path: '/permission/store/data/list',
  params: {}
},
{
  
  name: 'permissionStoreDataCreate',
  method: 'POST',
  showSuccess: true,
  desc: '【权限】创建-为用户创建店铺数据权限（permission模块）',
  path: '/permission/store/data/create',
  params: {}
},
{
  
  name: 'permissionStoreDataUpdate',
  method: 'POST',
  showSuccess: true,
  desc: '【权限】修改-为用户修改店铺数据权限（permission模块）',
  path: '/permission/store/data/update',
  params: {}
},
{
  
  name: 'permissionStoreDataDelete',
  method: 'POST',
  showSuccess: true,
  desc: '【权限】删除-为用户删除店铺数据权限（permission模块）',
  path: '/permission/store/data/delete',
  params: {}
},
{
  
  name: 'merchantRoleAllList',
  method: 'POST',
  desc: '【权限】列表-商户所有角色（permission模块）',
  path: '/merchant/role/allList',
  params: {}
},
{
  
  name: 'permissionStoreDataGerUserStoreIds',
  method: 'POST',
  desc: '【权限】列表-用户拥有店铺ID列表（permission模块）',
  path: '/permission/store/data/gerUserStoreIds',
  params: {}
},
]