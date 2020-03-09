// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import './style/element-variables.scss'
import './style/common.scss'
import App from './App'
import router from './router'
import axios from 'axios'
import { removeStore } from './plugins/utils'
import store from './store'
// import querystring from 'querystring'

// const __ROOT__ = 'http://192.168.0.118:8080'
const __ROOT__ = 'http://localhost:8080'

Vue.config.productionTip = false
Vue.use(ElementUI)

// 设置请求细节
axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$axios = axios.create({
  baseURL: __ROOT__,
  timeout: 10000
  // transformRequest: [function (data) {
  //   return querystring.stringify(data)
  // }]
})

// axios携带token request拦截器
Vue.prototype.$axios.interceptors.request.use(config => {
  if (localStorage.getItem('token')) {
    config.headers.token = localStorage.getItem('token')
  }
  return config
})

// 添加响应拦截器
Vue.prototype.$axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  if (response.data.code === 401) {
    router.push('/login')
  }
  return response
}, (error) => {
  // 对响应错误做点什么
  // console.log(error)
  Vue.prototype.$message.error(error.message)
  return Promise.reject(error)
})

// 设置cookie
Vue.prototype.$setCookie = (cname, cvalue, exdays) => {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  console.info(cname + '=' + cvalue + '; ' + expires)
  document.cookie = cname + '=' + cvalue + '; ' + expires
  console.info(document.cookie)
}

Vue.prototype.$unescape = window.unescape

// 全局混入方法
Vue.mixin({
  methods: {
    LogOut () {
      console.log('登出')
      // 清除token和store
      store.commit('tab/clean')
      removeStore('token')
      router.push('/login')
    }
  }
})

/* eslint-disable no-new */
export const vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
