import axios from './axios'
import api from './api'
import funs from './$';
import consts from './const'
GLOBAL.ajax = api

export default {
    // eslint-disable-next-line
    install: (Vue, options) => {
        Vue.prototype.$api = api
        Vue.prototype.$ajax = axios
        Vue.prototype.$const = consts
        Vue.prototype.$ = funs
        // 需要挂载的都放在这里
    }
}