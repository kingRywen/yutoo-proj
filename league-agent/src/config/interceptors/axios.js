import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
import Vue from 'vue'
import {
  CONSOLE_RESPONSE_ENABLE
} from '../index.js'

let CancelToken = axios.CancelToken
let pending = []
let removePending = config => {
  // debugger
  if (!config) {
    let current = pending.pop()
    // 如果不传 默认移除当前所有请求
    while (current) {
      current.f()
      current = pending.pop()
    }
  }
  for (let p in pending) {
    if (
      pending[p].u ===
      config.url +
      '&' +
      config.method +
      '&' +
      (config.method === 'get' ?
        JSON.stringify(config.params) :
        JSON.stringify(config.data))
    ) {
      // console.error(
      //   `注意： 请不要在同一时间发出多个相同请求（参数、URL一致）: ${config.url}. 如果有这个业务需要，请在接口中配置参数 config.keep = true`
      // )
      //当当前请求在数组中存在时执行函数体
      pending[p].f() //执行取消操作
      pending.splice(p, 1) //把这条记录从数组中移除
    }
  }
  // pending = []
}


GLOBAL.removePending = removePending
GLOBAL.removing = false
GLOBAL.isLogout = false
GLOBAL.pending = pending

let codeStragy = {
  // 跳转登录页并记录重定向网址
  redirectToLogin(msg, path) {
    removePending()
    if (path) {
      router.replace(path)
    }
    if (!GLOBAL.removing) {
      GLOBAL.removing = true

      if (!GLOBAL.isLogout) {
        GLOBAL.isLogout = true
        store.dispatch('auth/loggOut')
        let errorPage = ['/login', '/error/']
        msg && GLOBAL.vbus.$emit('ajax.response.error', msg)
        let redirect = router.currentRoute.query.redirect
        if (
          errorPage.every(
            el => decodeURIComponent(window.location.href).indexOf(el) === -1
          )
        ) {
          redirect = router.currentRoute.fullPath
        }
        if (redirect) {
          router.replace(`/login?redirect=${redirect}`)
        }

        setTimeout(() => {
          GLOBAL.isLogout = false
          GLOBAL.removing = false
        })
      }
    }
  }
}

export function requestSuccessFunc(requestObj) {
  // console.log(requestObj);

  // 移除相同请求
  if (!requestObj.keep) removePending(requestObj)
  if (pending.length > 6) {
    pending.shift()
  }
  // 推入当前的请求到记录请求的数组
  requestObj.cancelToken = new CancelToken(c => {
    pending.push({
      u: requestObj.url +
        '&' +
        requestObj.method +
        '&' +
        (requestObj.method === 'get' ?
          JSON.stringify(requestObj.params) :
          JSON.stringify(requestObj.data)),
      f: c
    })
  })
  requestObj.u = requestObj.url +
    '&' +
    requestObj.method +
    '&' +
    (requestObj.method === 'get' ?
      JSON.stringify(requestObj.params) :
      JSON.stringify(requestObj.data))
  if (!requestObj.singleLoading) {
    store.commit({
      type: 'SET_LOADING',
      name: 'isloading',
      value: true
    })
  } else {
    store.commit({
      type: 'SET_LOADING',
      name: 'loading',
      value: true
    })
  }
  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  let token = Vue.prototype.$storage.get('local', 'token')
  requestObj.headers.token = token
  // 去除空提交字符
  if (typeof requestObj.data === 'object' && !Array.isArray(requestObj.data)) {
    requestObj.data = Vue.prototype.$.dealObjectValue(requestObj.data)
  }
  return requestObj
}

export function requestFailFunc(requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  // ...
  store.commit({
    type: 'SET_LOADING',
    name: 'isloading',
    value: false
  })
  store.commit({
    type: 'SET_LOADING',
    name: 'loading',
    value: false
  })
  return Promise.reject(requestError)
}

export function responseSuccessFunc(responseObj) {
  // console.log(responseObj)
  if (GLOBAL.pending.length) {
    setTimeout(() => {
      GLOBAL.pending.splice(0)
    }, 200);
  }
  // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
  // ...
  // 假设我们请求体为
  // {
  //     code: 1010,
  //     msg: 'this is a msg',
  //     data: null
  // }

  CONSOLE_RESPONSE_ENABLE
  // &&
  // console.info(
  //     "响应参数",
  //     responseObj
  // );

  if (!responseObj.config.singleLoading) {
    store.commit({
      type: 'SET_LOADING',
      name: 'isloading',
      value: false
    })
  } else {
    store.commit({
      type: 'SET_LOADING',
      name: 'loading',
      value: false
    })
  }
  let resData = responseObj.data

  let {
    code,
    msg,
    // eslint-disable-next-line
    status
  } = resData
  if (resData.type == 'application/json') {
    !responseObj.config.noShowDefaultError &&
      GLOBAL.vbus.$emit('business.response.incorrect')
    return Promise.reject(resData)
  }
  if (responseObj.config.responseType == 'blob') {
    // resData = {
    //   data: resData,
    //   name: responseObj.headers['content-disposition']
    // }
    let name = responseObj.headers['content-disposition']
    name = name && decodeURIComponent(name.replace('attachment;filename=', ''))
    resData.name = name
  }
  // 响应代码
  switch (code) {
    case 0: // 如果业务成功，直接进成功回调
      responseObj.config.showSuccess &&
        GLOBAL.vbus.$emit('business.response.success', msg)
      return resData
    case '0': // 如果业务成功，直接进成功回调
      responseObj.config.showSuccess &&
        GLOBAL.vbus.$emit('business.response.success', msg)
      return resData

      // 如果业务失败，弹窗提示
      // 比如最常见的授权过期跳登录
      // 特定弹窗
      // 跳转特定页面等
    case 401: // 401 403 token 过期， 跳转登录面，要记录当前url, 方便下次登录后跳转回来
      codeStragy.redirectToLogin(msg)

      return
    case 403:
      codeStragy.redirectToLogin(msg, '/error/notpermission')
      return
    case 404:
      codeStragy.redirectToLogin(msg, '/error/404')
      return
      // case 407: // 无权限，跳转无权限页（需要修改）
      //   codeStragy.redirectToLogin(msg, '/error/notpermission')
      //   return
    default:
      if (code == null && resData != null) {
        return resData
      } else {
        // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下放它们到业务层
        !responseObj.config.noShowDefaultError &&
          GLOBAL.vbus.$emit('business.response.incorrect', resData.msg)
        return Promise.reject(resData)
      }
  }
}

export function responseFailFunc(responseError) {

  // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
  store.commit({
    type: 'SET_LOADING',
    name: 'loading',
    value: false
  })
  store.commit({
    type: 'SET_LOADING',
    name: 'isloading',
    value: false
  })

  if (responseError.message) {
    GLOBAL.vbus.$emit(
      'business.response.incorrect',
      `响应失败， 请检查网络状态是否正常`
    )
  }
  return Promise.reject(responseError)
}