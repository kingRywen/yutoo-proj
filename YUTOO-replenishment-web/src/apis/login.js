import { CONST_PORT_CONFIG } from 'Config'

const { LOGIN_URL } = CONST_PORT_CONFIG

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

export default {
  MERCHANT_USER_LOGIN,
  merchantUserSave,
  merchantUserUpdate
}