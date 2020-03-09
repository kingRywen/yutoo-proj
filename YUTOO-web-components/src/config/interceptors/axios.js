import axios from 'axios'
// import store from '@/store/index'
// import router from '@/router/index'
// import {
//     CONSOLE_REQUEST_ENABLE
// } from "../index.js";
import storage from 'Utils/saver'

let CancelToken = axios.CancelToken
let pending = []
let removePending = (config) => {
  for (let p in pending) {
    if (!config) {
      pending[p].f()
      pending.splice(p, 1)
    } else {
      if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
        pending[p].f() // 执行取消操作
        pending.splice(p, 1) // 把这条记录从数组中移除
      }
    }
  }
}

let codeStragy = {
  // 跳转登录页并记录重定向网址
  redirectToLogin() {
    // // msg && GLOBAL.vbus.$emit("ajax.response.error", msg);
    // // 跳转的时候清空本地的seller信息
    // sessionStorage.removeItem('shop_seller_data')
    // // 跳转的时候清空vuex的seller信息
    // store.commit('common/sellerData', {})
    // let {
    //   path
    // } = router.history.current
    // router.replace({
    //   path: '/login',
    //   query: {
    //     redirect: path
    //   }
    // })
  }
}

export function requestSuccessFunc(requestObj) {
  // CONSOLE_REQUEST_ENABLE &&
  //     console.info(
  //         "requestInterceptorFunc",
  //         `url: ${requestObj.url}`,
  //         requestObj
  //     );

  // 移除相同请求
  if (!requestObj.keep) {
    removePending(requestObj)
  }
  // 推入当前的请求到记录请求的数组
  requestObj.cancelToken = new CancelToken((c) => {
    pending.push({
      u: requestObj.url + '&' + requestObj.method,
      f: c
    })
  })

  // if (!requestObj.singleLoading) {
  //   store.state.isloading = true
  // } else {
  //   store.state.loading = true
  // }
  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  let token = storage.get('local', 'shop_token')
  // if (!token && requestObj.url !== 'sys/login') {
  //   // router.push('/login')
  //   removePending()
  //   // codeStragy.redirectToLogin('登录失效，请重新登录')
  //   return Promise.reject('登录失效，请重新登录')
  // }
  requestObj.headers.token = token
  // console.log(requestObj);

  // 如果是走mock数据，清除token
  if (requestObj.isMock) {
    delete requestObj.withCredentials
    delete requestObj.credentials

    requestObj.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }

  return requestObj
}

export function requestFailFunc(requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  // ...
  // console.log(requestError)
  console.log('请求失败')
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

  // if (!responseObj.config.singleLoading) {
  //   store.state.isloading = false
  // } else {
  //   store.state.loading = false
  // }
  let resData = responseObj.data
  let {
    code,
    msg
  } = resData
  let { status } = responseObj
  // console.log(codes)
  // if(responseObj.config.codes && responseObj.config.codes.indexOf(code) > -1) {
  // 	resData.code = code = 0
  // }
  // 响应代码
  switch (code) {
    case 0: // 如果业务成功，直接进成功回调
      responseObj.config.showSuccess && GLOBAL.vbus.$emit('business.response.success', msg)
      return resData
    case 1: // 如果业务成功，直接进成功回调
      if (responseObj.config.codes && responseObj.config.codes.indexOf(code) > -1) {
        responseObj.config.showSuccess && GLOBAL.vbus.$emit('business.response.success', msg)
      }
      // responseObj.config.showSuccess && GLOBAL.vbus.$emit("business.response.success", msg);
      return resData
      // 如果业务失败，弹窗提示
      // 比如最常见的授权过期跳登录
      // 特定弹窗
      // 跳转特定页面等
      // eslint-disable-next-line no-case-declarations
    case 401: // 401 403 token 过期， 跳转登录面，要记录当前url, 方便下次登录后跳转回来
      let checkAccount = storage.get('local', 'checkAccount')
      let username = storage.get('local', 'username')
      localStorage.clear()
      if (checkAccount) {
        storage.set('local', 'checkAccount', checkAccount)
        storage.set('local', 'username', username)
      }
      sessionStorage.clear()
      // router.push({
      //   path: '/login'
      // })
      // codeStragy.redirectToLogin(msg);

      // case 403:
      //     router.push({
      //         path: '/dash'
      //     })
      //     // codeStragy.redirectToLogin(msg);
      //     return;
    case 404:
      // router.push({
      //   path: '/404'
      // })
      break
    case 407: // 无权限，跳转无权限页（需要修改）
      codeStragy.redirectToLogin(msg)
      return
    case undefined:
      if (status === 200) {
        return resData
      }
      break
    default:
      // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下放它们到业务层
      !responseObj.config.noShowDefaultError &&
                GLOBAL.vbus.$emit('business.response.incorrect', resData.msg)
      return Promise.reject(resData)
  }
}

export function responseFailFunc(responseError) {
  // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
  if (responseError.message) {
    GLOBAL.vbus.$emit('business.response.incorrect', `响应失败: ${responseError.message}， 请检查网络状态是否正常`)
  }

  return Promise.reject(responseError)
}
