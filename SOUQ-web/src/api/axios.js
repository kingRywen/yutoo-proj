import axios from 'axios'
import router from '@/router'
//let baseURL = 'http://192.168.0.136:7002'
let baseURL = 'http://192.168.0.98:7002' // http://192.168.0.107:8282    http://192.168.0.98:7001
let mockURL = 'https://dsn.apizza.net/mock/e7d551ff9fa23df985852fb636c425ec'
// let baseURL = 'http://192.168.0.123:8080'
// baseURL: "https://dsn.apizza.net/mock/f1081b78e39e4f7d6bef6b62c1c08b5c/",
let request = axios.create({
  baseURL: baseURL,
  timeout: 1000000,
  withCredentials: true,
  headers: {
    token: localStorage.getItem('token'),
    'Content-Type': 'application/json;charset=UTF-8'
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  onUploadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  }
})
/// /
// let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
// let cancelToken = axios.CancelToken
// let removePending = (config) => {
//   for (let p in pending) {
//     if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
//       pending[p].f() // 执行取消操作
//       pending.splice(p, 1) // 把这条记录从数组中移除
//     }
//   }
// }
/// /
request.interceptors.request.use(config => {
    // // 如果没有token 跳转到登录页
    if (!localStorage.getItem('token')) {
      localStorage.clear()
      router.push('/login')
    } else {
      config.headers.token = localStorage.getItem('token')
    }

    // 如果是走mock数据，清除token
    if (config.mock) {
      delete config.withCredentials
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
      config.baseURL = mockURL
    }
    // console.log(config)
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
/* 响应拦截器 */
request.interceptors.response.use(function (response) {
  // if (response.data.code === 401) {
  //   router.push('/login')
  // }
  /// /
  if (response.data.code === 0) {
    // console.log(response)
    // console.log(router)
  }
  if (response.status !== 200) {
    console.log(router)
    router.app.$message({
      type: 'error',
      message: response.data.msg || '未知异常，请联系管理员'
    })
  }

  if (response.data.code === 401) {
    localStorage.clear()
    router.push('/login')
  }
  if (response.data.code === 500) {
    router.app.$message({
      type: 'error',
      message: response.data.msg || '未知异常，请联系管理员'
    })
  }
  // removePending(response.config)
  /// ///
  return response
}, function (error) {
  return {
    data: {}
  } // 返回一个空对象，主要是防止控制台报错
})
export {
  baseURL
}
export default request
