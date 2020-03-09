import axios from './axios'

import api from './api'
import funs from './$'
import consts from './const'
import cfuns from './functions'
GLOBAL.ajax = api
GLOBAL.consts = consts
export default {
  // eslint-disable-next-line
  install: (Vue, options) => {
    Vue.prototype.$api = api
    Vue.prototype.$ajax = axios
    Vue.prototype.$const = consts
    Vue.prototype.$ = funs
    // 需要挂载的都放在这里
    Vue.prototype.cfuns = cfuns
  }
}
