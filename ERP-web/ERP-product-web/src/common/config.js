// import envConfig from '../../build/config'
// import axios from 'axios'

// async function getConfig() {
//   return await axios.get('/config.json')
// }

// // let config = envConfig
import config from '@/ipConfig.js';

console.log(config);

// 正式服
const productPort = config.BASE_URL
// 登录
const loginPort = config.LOGIN_URL
// 权限
const permsPort = config.PERMS_URL
// 补货
const REP = config.REP_URL

// 仓储
const WAREHOUSE = config.WAREHOUSE_URL
// 订单
const ORDER = config.ORDER_URL
// 采购
const PROCUREMENT_URL = config.PROCUREMENT_URL

// 登录跳转的首页
export const loginRedirect = config.loginRedirect

const host = config.host
// let config = {}

// // // console.log(envConfig);
// // 登录跳转的首页
// let loginRedirect = '/'

// const productPort = 8083
// // 登录
// const loginPort = 'http://192.168.0.98:8081'
// // 权限
// const permsPort = 'http://192.168.0.98:8082'
// // 补货
// const REP = 8084
// // 仓储
// const WAREHOUSE = 'http://192.168.0.200:8088'
// // 订单
// const ORDER = 'http://192.168.0.200:8086'

// const host = 'http://192.168.0.200:'

// // // 登录跳转的首页
// let loginRedirect = '/'

// const productPort = 8083
// // 登录
// const loginPort = 'http://192.168.0.135:8081'
// // 权限
// const permsPort = 'http://192.168.0.135:8082'
// // 补货
// const REP = 8084
// // 仓储
// const WAREHOUSE = 'http://192.168.0.135:8088'
// // 订单
// const ORDER = 'http://192.168.0.135:8086'

// const host = 'http://192.168.0.135:'



// // 登录跳转的首页
// let loginRedirect = '/'
// const productPort = 7083
// // 登录
// const loginPort = 'http://192.168.0.110:7081'
// // 权限
// const permsPort = 'http://192.168.0.110:7082'
// // 补货
// const REP = 7084
// // 仓储
// const WAREHOUSE = 'http://192.168.0.110:7088'
// // 订单
// const ORDER = 'http://192.168.0.110:7086'

// const host = 'http://192.168.0.110:'

// // // // 登录跳转的首页
// let loginRedirect = '/test-env/'

// const productPort = 7083
// // 登录
// const loginPort = 'http://192.168.0.98:7081'
// // 权限
// const permsPort = 'http://192.168.0.98:7082'
// // 补货
// const REP = 7084
// // 仓储
// const WAREHOUSE = 'http://192.168.0.98:7089'
// // 订单
// const ORDER = 'http://192.168.0.98:7086'

// const host = 'http://192.168.0.98:'

// // 正式服
// const productPort = '/erp-product'
// // 登录
// const loginPort = '/erp-sso'
// // 权限
// const permsPort = '/erp-permission'
// // 补货
// const REP = '/erp-replenish'

// // 仓储
// const WAREHOUSE = '/erp-warehouse'
// // 订单
// const ORDER = '/erp-order'

// // 登录跳转的首页
// const loginRedirect = '/erp/'

// const host = ''

module.exports = Object.assign(
  {
    loginRedirect,
    // 产品库
    BASE_URL: productPort,
    // BASE_URL: 'http://192.168.0.135:8083',
    // 登录
    LOGIN_URL: loginPort,
    // LOGIN_URL: 'http://192.168.0.98:8081',
    // 权限
    PERMS_URL: permsPort,
    // PERMS_URL: 'http://192.168.0.98:8082',
    // 补货
    REP_URL: REP,
    // 仓储
    WAREHOUSE_URL: WAREHOUSE,
    // 订单
    ORDER_URL: ORDER,
    // 采购
    PROCUREMENT_URL,

    // loginPort: 8082,
    //
    // permsPort: 8081,
    // 产品库

    // 基本信息页附件上传
    attachmentConfig: {
      path: host + '/product/attachment/upload',
      header: {
        token: localStorage.getItem(window.location.host + '_token')
      }
    },

    // echarts全局配置
    echartsCommonConfig: {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    },

    // 上传图片插件配置
    uploadImageConfig: {
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
      // extensions: /\.(gif|jpe?g|png|webp)$/i,
      minSize: 1024,
      size: 1024 * 1024,
      maximum: 12,
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      thread: 3,
      name: 'file',
      postAction: host + '/product/img/upload',
      autoCompress: 1024 * 1024,
      uploadAuto: false,
      isOption: false
    }
  },
  config
)
