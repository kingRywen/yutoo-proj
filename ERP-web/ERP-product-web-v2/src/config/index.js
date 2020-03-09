// 'use strict'
import config from './portConfig'
/* 测试服 */
/* eslint-disable */
// 运行环境
export const NODE_ENV = process.env.NODE_ENV || 'prod'
const env = process.env.VUE_APP_ENV || 'dev'

const envConfig = config[env]
const {
  LOGIN_URL,
  PERMS_URL,
  PRODUCT_URL,
  PROCUREMENT_URL,
  ORDER_URL,
  WAREHOUSE_URL,
  EMAIL_URL,
  FINANCE_URL
} = envConfig
//产品库
// const productPort = NODE_ENV === 'online' ? '/erp-product' : 7083
// ////登录
// const loginPort = NODE_ENV === 'online' ? '/erp-sso' : 7081
// // 权限
// const permsPort = NODE_ENV === 'online' ? '/erp-permission' : 7082
// // 补货
// // const REP = 7084;
// //订单
// const order = NODE_ENV === 'online' ? '/erp-order' : 7086
// //采购
// const procurement = NODE_ENV === 'online' ? '/erp-purchase' : 7085
// //客服
// const email = 7087
// //仓储物流
// const warehouse = 7089

// const host = NODE_ENV === 'online' ? '' : 'http://192.168.0.98:'

// 登录跳转的首页
export const loginRedirect = envConfig.loginRedirect

// 当前宿主平台
export const HOST_PLATFORM = 'WEB'

// 是否强制所有请求访问本地 MOCK，看到这里同学不难猜到，每个请求也可以单独控制是否请求 MOCK
export const AJAX_LOCALLY_ENABLE = true
// 是否开启监控
export const MONITOR_ENABLE = true
// 路由默认配置，路由表并不从此注入
export const ROUTER_DEFAULT_CONFIG = {
  waitForData: true,
  transitionOnLoad: true
}

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  timeout: 100000,
  maxContentLength: 2000,
  withCredentials: true,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

// vuex 默认配置
export const VUEX_DEFAULT_CONFIG = {
  strict: process.env.NODE_ENV !== 'production'
}

// API 默认配置
export const API_DEFAULT_CONFIG = {
  // 是否强制一一对应service api
  strict: false,
  mockBaseURL: 'http://120.79.124.232:8001/mock/13/',
  debug: false,
  sep: '/'
}

// CONST 默认配置
export const CONST_DEFAULT_CONFIG = {
  sep: '/'
}

// 不同业务模块对应的端口配置
export const CONST_PORT_CONFIG = {
  loginRedirect,
  LOGIN_URL,
  PERMS_URL,
  PRODUCT_URL,
  PROCUREMENT_URL,
  ORDER_URL,
  WAREHOUSE_URL,
  EMAIL_URL,
  FINANCE_URL
  // // 产品库
  // PRODUCT_URL: host + productPort,
  // // PRODUCT_URL: 'http://192.168.0.188:7083',

  // // 登录
  // LOGIN_URL: host + loginPort,
  // // LOGIN_URL: 'http://192.168.0.109:7081',
  // // 权限
  // PERMS_URL: host + permsPort,
  // // PERMS_URL: 'http://192.168.0.109:7082',
  // // 补货
  // // REP_URL: host + REP,
  // //订单
  // ORDER_URL: host + order,
  // //采购
  // PROCUREMENT_URL: host + procurement,
  // //邮件客服
  // EMAIL_URL: host + email,
  // //仓储物流
  // // WAREHOUSE_URL: 'http://120.79.124.232:8001/mock/33'
  // WAREHOUSE_URL: host + warehouse
  // WAREHOUSE_URL: 'http://192.168.0.109:7088' //host + warehouse
}

// 还有一些方便开发的配置
export const DEBUG_VUE_DEVTOOLS = true // vue devtools 开关
export const DEBUG_VUE_DEBUG = true // vue debug 开关
export const DEBUG_VUE_TIP = true // vue tip 开关

export const CONSOLE_REQUEST_ENABLE = true // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = true // 开启响应参数打印
export const CONSOLE_MONITOR_ENABLE = true // 监控记录打印
export const OSS_CONFIG = {
  // 簽名地址
  signUrl: CONST_PORT_CONFIG.PRODUCT_URL + '/img/get/oss/signature'
}