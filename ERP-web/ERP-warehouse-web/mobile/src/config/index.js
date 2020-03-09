'use strict'
/* 测试服 */
/* eslint-disable */
// 运行环境
export const NODE_ENV = process.env.NODE_ENV || 'prod'
//产品库
const productPort = NODE_ENV === 'online' ? '/erp-product' : 7083
////登录
const loginPort = NODE_ENV === 'online' ? '/erp-sso' : 7089
// const loginPort = NODE_ENV === 'online' ? '/erp-sso' : 8088
// 权限
const permsPort = NODE_ENV === 'online' ? '/erp-permission' : 7082
// 补货
// const REP = 7084;
//订单
const order = NODE_ENV === 'online' ? '/erp-order' : 7086
//采购
const procurement = NODE_ENV === 'online' ? '/erp-purchase' : 7085
//客服
const email = NODE_ENV === 'online' ? '/erp-purchase' : 7085
//仓储物流
const warehouse = 7089
const host = 'localhost:'

// 登录跳转的首页
export const loginRedirect = NODE_ENV === 'online' ? '/erp/' : '/app/'


// 线上
// loginRedirect:'/erp/',
//     LOGIN_URL: '/erp-sso',
//     PERMS_URL: '/erp-permission',
//     PRODUCT_URL: '/erp-product',
//     PROCUREMENT_URL: '/erp-purchase',
//     ORDER_URL: '/erp-order',
//     EMAIL_URL: '/erp-cus',
//     WAREHOUSE_URL: '/erp-warehouse'
//产品库
// const productPort = '/erp-product'
// ////登录
// const loginPort = '/erp-warehouse'
// // 权限
// const permsPort = '/erp-permission'
// // 补货
// // const REP = 7084;
// //订单
// const order = '/erp-order'
// //采购
// const procurement = '/erp-purchase'
// //客服
// const email = '/erp-cus'
// //仓储物流
// const warehouse = '/erp-warehouse'
// const host = ''
// 登录跳转的首页
// export const loginRedirect = '/erp/app/'

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

  mockBaseURL: '',
  mock: false,
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
  // 产品库
  PRODUCT_URL: host + productPort,
  // 登录
  LOGIN_URL: host + loginPort,
  // LOGIN_URL: 'http://192.168.0.98:7089',
  // LOGIN_URL: '/erp-warehouse',
  // 权限
  PERMS_URL: host + permsPort,
  // PERMS_URL: 'http://192.168.0.200:8088',
  // PERMS_URL: 'http://192.168.0.200:8088',
  // 补货
  // REP_URL: host + REP,
  //订单
  ORDER_URL: host + order,
  //采购
  PROCUREMENT_URL: host + procurement,
  // PROCUREMENT_URL: '/erp-purchase',
  //邮件客服
  EMAIL_URL: host + email,
  //仓储物流
  WAREHOUSE_URL: host + warehouse
  // WAREHOUSE_URL: '/erp-warehouse'
  // WAREHOUSE_URL: 'http://120.79.124.232:8001/mock/30'
  // WAREHOUSE_URL: 'http://192.168.0.200:8088' //host + warehouse
  // WAREHOUSE_URL: 'http://192.168.0.98:7089' //host + warehouse
}

// 还有一些方便开发的配置
export const DEBUG_VUE_DEVTOOLS = true // vue devtools 开关
export const DEBUG_VUE_DEBUG = true // vue debug 开关
export const DEBUG_VUE_TIP = true // vue tip 开关

export const CONSOLE_REQUEST_ENABLE = true // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = true // 开启响应参数打印
export const CONSOLE_MONITOR_ENABLE = true // 监控记录打印
