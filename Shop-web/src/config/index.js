// const port = 7081;

 //export const host = process.env.VUE_APP_ENV === 'online' ? "/shops/" : "http://192.168.0.144:8281/";
// export const host = process.env.VUE_APP_ENV === 'online' ? "/shops/" : "http://localhost:8281/";
// export const ebayHost = process.env.VUE_APP_ENV === 'online' ? "/ebayShops/" : "http://localhost:8003/";
export const host = process.env.VUE_APP_ENV === 'online' ? "/shops/" : "http://120.79.124.232/shops/";
export const ebayHost = process.env.VUE_APP_ENV === 'online' ? "/ebayShops/" : "http://120.79.124.232/ebayShops/";
//export const host = "http://192.168.0.220:8090/shops/";
//export const host = "http://192.168.0.142:8281/";
// export const host = "http://192.168.0.233:8281/";
// export const ebayHost = "http://localhost:8003/";
// 当前宿主平台
export const HOST_PLATFORM = 'WEB'
// 运行环境
export const NODE_ENV = process.env.NODE_ENV || 'prod'


// vuex 默认配置
export const VUEX_DEFAULT_CONFIG = {
  strict: process.env.NODE_ENV !== 'production'
}


// CONST 默认配置
export const CONST_DEFAULT_CONFIG = {
  sep: '/'
}



// 不同业务模块对应的端口配置
export const CONST_PORT_CONFIG = {
  BASE_URL: host,
  EBAY_URL: ebayHost,
  AMAZON_URL: host,
}


// 还有一些方便开发的配置
export const DEBUG_VUE_DEVTOOLS = true // vue devtools 开关
export const DEBUG_VUE_DEBUG = true // vue debug 开关
export const DEBUG_VUE_TIP = true // vue tip 开关


export const CONSOLE_REQUEST_ENABLE = true // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = true // 开启响应参数打印
export const CONSOLE_MONITOR_ENABLE = true // 监控记录打印


// 是否强制所有请求访问本地 MOCK，看到这里同学不难猜到，每个请求也可以单独控制是否请求 MOCK
export const AJAX_LOCALLY_ENABLE = false
// 是否开启监控
export const MONITOR_ENABLE = true
// 路由默认配置，路由表并不从此注入
export const ROUTER_DEFAULT_CONFIG = {
  waitForData: true,
  transitionOnLoad: true
}

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  timeout: 30000,
  maxContentLength: 20000,
  withCredentials: true,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}


// API 默认配置
export const API_DEFAULT_CONFIG = {
  // 是否强制一一对应service api
  strict: false,
  // 是否验证必传参数
  validate: true,
  // mockBaseURL: 'https://dsn.apizza.net/mock/0b87e62c1114146cd340d0094702c10a',

  //mockBaseURL: 'http://120.79.124.232:8001/mock/12',
  mockBaseURL: 'http://120.79.124.232:8001/mock/12',

  debug: false,
  sep: '/'
}