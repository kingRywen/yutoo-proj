const config = require('../common/config')

const LOGIN_URL = config.LOGIN_URL

// 商户登录
const MERCHANT_USER_LOGIN = {
  method: 'post',
  url: LOGIN_URL + "/login"
}

// 【用户】更新
const merchantUserUpdate = {
  method: 'post',
  url: LOGIN_URL + "/merchant/user/update"
}
// 【用户】新增
const merchantUserSave = {
  method: 'post',
  url: LOGIN_URL + "/merchant/user/save"
}

module.exports = {
  MERCHANT_USER_LOGIN,
  merchantUserSave,
  merchantUserUpdate
}