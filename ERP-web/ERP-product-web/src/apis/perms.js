const config = require('../common/config')

const LOGIN_URL = config.LOGIN_URL
const PERMS_URL = config.PERMS_URL

// 商户登录
const MERCHANT_USER_LOGIN = {
  method: 'post',
  url: LOGIN_URL + "/login"
}

// 登录后获取按钮权限
const MERCHANT_MENU_LIST_BY_CHILD = {
  method: 'post',
  url: PERMS_URL + "/merchant/menu/list/by/child",
}

const merchantRoleList = {
  method: 'post',
  url: PERMS_URL + "/merchant/role/list",
}

// 获取角色列表
const merchantRoleDefList = {
  method: 'post',
  url: PERMS_URL + "/merchant/role/defList",
}

// 新增商户用户
const MERCHANT_USER_SAVE = {
  method: 'post',
  url: PERMS_URL + "/merchant/user/save"
}

// 新增商户用户
const MERCHANT_USER_UPDATE = {
  method: 'post',
  url: PERMS_URL + "/merchant/user/update"
}

// 新增商户角色
const MERCHANT_ROLE_SAVE = {
  method: 'post',
  url: PERMS_URL + "/merchant/role/save"
}

// 新建商户菜单
const MERCHANT_MENU_SAVE = {
  method: 'post',
  url: PERMS_URL + "/merchant/menu/save"
}

// 获取商户角色列表
const MERCHANT_ROLE_LIST = {
  method: 'post',
  url: PERMS_URL + "/merchant/role/list"
}

// 获取商户角色列表
const MERCHANT_ROLE_LIST_BY_USER = {
  method: 'post',
  url: PERMS_URL + "/merchant/role/list/by/user"
}

// 根据用户获取商户菜单列表
const MERCHANT_MENU_LIST_BY_USER = {
  method: 'post',
  url: PERMS_URL + "/merchant/menu/list/by/user"
}

// 根据商户获取商户菜单列表
const MERCHANT_MENU_LIST_BY_MERCHANT = {
  method: 'post',
  url: PERMS_URL + "/merchant/menu/list/by/merchant"
}

// 根据id获取角色详情
const MERCHANT_ROLE_INFO = {
  method: 'post',
  url: PERMS_URL + "/merchant/role/info"
}

// 退出登录
const MERCHANT_USER_LOGOUT = {
  method: 'post',
  url: PERMS_URL + "/merchant/user/logout"
}

// 商户用户列表
const MERCHANT_USER_LIST = {
  method: 'post',
  url: LOGIN_URL + "/merchant/user/list"
}

// 新增用户和角色关联
const MERCHANT_USER_ROLE_REL = {
  method: 'post',
  url: PERMS_URL + "/merchant/user/role/rel"
}

// 修改商户角色
const MERCHANT_ROLE_UPDATE = {
  method: 'post',
  url: PERMS_URL + "/merchant/role/update"
}

// 删除商户系统用户
const MERCHANT_USER_REMOVE = {
  method: 'post',
  url: PERMS_URL + "/merchant/user/remove"
}

// 删除商户角色
const MERCHANT_ROLE_REMOVE = {
  method: 'post',
  url: PERMS_URL + "/merchant/role/remove"
}



module.exports = {
  merchantRoleList,
  merchantRoleDefList,
  MERCHANT_USER_LOGIN,
  MERCHANT_USER_REMOVE,
  MERCHANT_ROLE_REMOVE,
  MERCHANT_USER_UPDATE,
  MERCHANT_ROLE_UPDATE,
  MERCHANT_ROLE_LIST,
  MERCHANT_USER_ROLE_REL,
  MERCHANT_MENU_LIST_BY_CHILD,
  MERCHANT_USER_LIST,
  MERCHANT_USER_LOGOUT,
  MERCHANT_MENU_SAVE,
  MERCHANT_MENU_LIST_BY_USER,
  MERCHANT_ROLE_INFO,
  MERCHANT_MENU_LIST_BY_MERCHANT,
  MERCHANT_ROLE_SAVE,
  MERCHANT_ROLE_LIST_BY_USER,
  MERCHANT_USER_SAVE,
}