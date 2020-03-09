const config = require('../common/config')
// 上方主菜单
const GET_MAIN_MENU = {
  // method: 'post',
  url: config.BASE_URL_UN + "/getMainMenu",
}

// admin登录
const LOGIN = {
  method: 'post',
  
  url: "/sys/login"
}



module.exports = {
  GET_MAIN_MENU,
  LOGIN
}