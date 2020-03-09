import axios from './plugin'
import api from './api'
// eslint-disable-next-line no-undef
GLOBAL.ajax = api

export default {
  // eslint-disable-next-line
    install: (Vue, options) => {
    Vue.prototype.$api = api
    Vue.prototype.$ajax = axios
    // 需要挂载的都放在这里
  }
}
