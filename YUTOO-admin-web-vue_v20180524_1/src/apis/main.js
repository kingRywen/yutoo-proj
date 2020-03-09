const config = require('../common/config')
// 上方主菜单
const GET_MAIN_MENU = {
  // method: 'post',
  url: config.BASE_URL_UN + "/getMainMenu",
}

module.exports = {
  GET_MAIN_MENU,
}