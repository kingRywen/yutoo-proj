/* eslint-disable no-undef */
import axios from 'axios'
import store from '../store'
import Vue from 'vue'
import {
  CONSOLE_REQUEST_ENABLE
} from './config.js'
import storage from '@/utils/saver'

let CancelToken = axios.CancelToken
let pending = []
let removePending = config => {
  for (let p in pending) {
    if (!config) {
      pending[p].f()
      pending.splice(p, 1)
    } else {
      if (
        pending[p].u ===
        config.url +
        '&' +
        config.method +
        '&' +
        (config.method === 'get'
          ? JSON.stringify(config.params)
          : JSON.stringify(config.data))
      ) {
        // 当当前请求在数组中存在时执行函数体
        pending[p].f() // 执行取消操作
        pending.splice(p, 1) // 把这条记录从数组中移除
      }
    }
  }
}

GLOBAL.removePending = removePending

export function requestSuccessFunc(requestObj) {
  CONSOLE_REQUEST_ENABLE &&
  // console.info(
  //     "requestInterceptorFunc",
  //     `url: ${requestObj.url}`,
  //     requestObj
  // );

    // 移除相同请求
    removePending(requestObj)
  // 推入当前的请求到记录请求的数组
  requestObj.cancelToken = new CancelToken(c => {
    pending.push({
      u: requestObj.url +
        '&' +
        requestObj.method +
        '&' +
        (requestObj.method === 'get'
          ? JSON.stringify(requestObj.params)
          : JSON.stringify(requestObj.data)),
      f: c
    })
  })

  if (!requestObj.singleLoading) {
    store.state.isloading = true
  } else {
    store.state.loading = true
  }
  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  let token = storage.get('local', 'token')
  requestObj.headers.token = token
  // 去除空提交字符
  // requestObj = Vue.prototype.$.dealObjectValue(requestObj)

  return requestObj
}

export function requestFailFunc(requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  // ...

  return Promise.reject(requestError)
}

export function responseSuccessFunc(responseObj) {
  // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
  // ...
  // 假设我们请求体为
  // {
  //     code: 1010,
  //     msg: 'this is a msg',
  //     data: null
  // }

  if (!responseObj.config.singleLoading) {
    store.state.isloading = false
  } else {
    store.state.loading = false
  }
  let resData = responseObj.data

  let {
    code,
    msg,
    // eslint-disable-next-line
    status
  } = resData

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
  return Promise.reject(responseError)
}
