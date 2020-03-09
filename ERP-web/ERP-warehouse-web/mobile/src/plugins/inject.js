import axios from './axios'
import api from './api'
import $ from './$'
// eslint-disable-next-line node/no-deprecated-api
GLOBAL.ajax = api

export default {
  // eslint-disable-next-line
  install: (Vue, options) => {
    Vue.prototype.$api = api
    Vue.prototype.$ = $
    Vue.prototype.$ajax = axios
    // 需要挂载的都放在这里
  }
}
