export default [{
  name: 'userlogin',
  method: 'POST',
  desc: '商户登录',
  path: '/login',
  mockPath: '/login',
  showSuccess: true,
  params: {}
}, {
  name: 'merchantUserList',
  method: 'POST',
  desc: '【用户】列表',
  path: '/merchant/user/list',
  params: {}
}, {
  name: 'merchantUserSave',
  method: 'POST',
  desc: '【用户】新增',
  showSuccess: true,
  path: '/merchant/user/save',
  params: {}
}, {
  name: 'merchantUserUpdate',
  method: 'POST',
  showSuccess: true,
  desc: '【用户】更新',
  path: '/merchant/user/update',
  params: {}
}, {
  name: 'merchantUserInfo',
  method: 'POST',
  desc: '【用户】查询',
  path: '/merchant/user/info',
  params: {}
}, {
  name: 'merchantUserRemove',
  method: 'POST',
  desc: '【用户】删除',
  showSuccess: true,
  path: '/merchant/user/remove',
  params: {}
},
{
  name: 'merchantUserAllList',
  method: 'POST',
  desc: '【用户】列表-商户所有用户（sso模块）',
  path: '/merchant/user/allList',
  params: {}
},
{
  
  name: 'merchantRoleGetUserByRoleId',
  method: 'POST',
  desc: '通过角色获取用户',
  path: '/merchant/role/getUserByRoleId',
  params: {}
},
]