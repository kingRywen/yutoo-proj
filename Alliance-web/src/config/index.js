// 当前宿主平台
export const HOST_PLATFORM = 'WEB'
// 运行环境
export const NODE_ENV = process.env.NODE_ENV || 'production'
// const port = 7081;
// export const URL = "http://192.168.0.160:8080/"
export const URL = "http://192.168.0.32:6082/league-agent-web/"
// export const URL = "http://192.168.0.171:8080/"

const host = NODE_ENV === 'production' ? (process.env.VUE_APP_HOST || URL) : URL;

// const host = 'http://localhost:9000/'

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
  BASE_URL: host
}

// 还有一些方便开发的配置
export const DEBUG_VUE_DEVTOOLS = true // vue devtools 开关
export const DEBUG_VUE_DEBUG = true // vue debug 开关
export const DEBUG_VUE_TIP = true // vue tip 开关

export const CONSOLE_REQUEST_ENABLE = false // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = true // 开启响应参数打印
export const CONSOLE_MONITOR_ENABLE = true // 监控记录打印

// 是否强制所有请求访问 MOCK，每个请求也可以单独控制是否请求 MOCK
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
  timeout: 20000,
  maxContentLength: 2000,
  withCredentials: true,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

// API 默认配置
export const API_DEFAULT_CONFIG = {
  // 是否强制一一对应service api
  // 如果强制的话， api service的params中必须设置好参数，否则所有传参都为空对象（等价于强制验证入参）
  strict: false,
  mockBaseURL: 'http://120.79.124.232:8001/mock/229/',
  debug: false,
  sep: '/'
}