export default [{
  name: 'userlogin',
  method: 'POST',
  desc: '商户登录',
  path: '/login',
  mockPath: '/login',
  params: {}
}, {
  name: 'permsRoutes',
  method: 'POST',
  desc: '获取权限路由',
  path: '/perms/routes',
  mockPath: '/perms/routes',
  params: {}
}, {
  name: 'permsValidateToken',
  method: 'POST',
  desc: '验证TOKEN是否有效',
  path: '/perms/validateToken',
  mockPath: '/perms/validateToken',
  params: {}
}]