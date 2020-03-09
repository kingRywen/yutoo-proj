import axios from './axios'

import api from './api'
import funs from './$';
import consts from './const'
GLOBAL.ajax = api
GLOBAL.$const = consts

export default {
    // eslint-disable-next-line
    install: (Vue, options) => {
        Vue.prototype.$api = api
        Vue.prototype.$ajax = axios
        Vue.prototype.$const = consts
        Vue.prototype.$ = funs
    }
}