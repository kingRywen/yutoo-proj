const config = require('../common/config')
/**
 * 
 * 我的工作台
 * 
 */

// card
const GET_ADMIN_CARD = {
  // method: 'post',
  url: config.BASE_URL_UN + "/getAdminCard",
}
// 图表
const GET_ADMIN_CHARTS = {
  // method: 'post',
  url: config.BASE_URL_UN + "/hi",
}


module.exports = {
  GET_ADMIN_CARD,
  GET_ADMIN_CHARTS,
}