import axios from 'axios'
import router from '@/router'
let baseURL = 'http://120.79.124.232/markets' // http://192.168.0.107:8282    http://192.168.0.98:7001 http://192.168.0.233:8081 http://120.79.124.232/markets
// baseURL: "https://dsn.apizza.net/mock/f1081b78e39e4f7d6bef6b62c1c08b5c/", http://192.168.0.136:7003 http://192.168.0.132:8384
let request = axios.create({
  baseURL: baseURL,
  timeout: 1000000,
  withCredentials: true,
  headers: {
    token: localStorage.getItem('token'),
    'Content-Type': 'application/json;charset=UTF-8'
  },
  onUploadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  }
})
/// /
let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken
let removePending = (config) => {
  for (let p in pending) {
    if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}
/// /
request.interceptors.request.use(config => {
  let routerName = router.history.current.path
  // console.log(routerName, 1111);
  if (!localStorage.getItem('token') || !localStorage.getItem('userName')) {
    if (routerName !== '/register' && routerName !== '/findpass') {
      // sessionStorage.removeItem('path')
      // sessionStorage.removeItem('platformId')
      window.localStorage.clear()
      window.sessionStorage.clear()
      sessionStorage.setItem('isload', 1)
      router.push('/login')
    }
  }
  /// /
  removePending(config) // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new cancelToken((c) => {
    // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    pending.push({
      u: config.url + '&' + config.method,
      f: c
    })
  })
  /// /
  return config
},
err => {
  console.log(err)
  return Promise.reject(err)
}
)
/* 响应拦截器 */
request.interceptors.response.use(function (response) {
  let routerName = router.history.current.path

  if (response.data.code === 401) {
    if (routerName !== '/register' && routerName !== '/findpass') {
      window.localStorage.clear()
      window.sessionStorage.clear()
      sessionStorage.setItem('isload', 1)
      router.push('/login')
    }
  }
  if (response.data.code === 500) {
    GLOBAL.vbus.$emit('response.incorrect', response.data)
  }
  /// /
  removePending(response.config)
  /// ///
  return response
}, function (error) {
  console.log(error)
  return Promise.reject(error)
})
export {
  baseURL
}
export default request
