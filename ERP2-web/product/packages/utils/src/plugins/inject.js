import axios from './axios'
import api from './api'
import funs from './$';
import consts from './const'
import { MAIN_NAME } from 'Config';
GLOBAL.ajax = api
GLOBAL.$const = consts

const Plugins = {
    // eslint-disable-next-line
    install: (Vue, options) => {
        Vue.prototype.$api = api
        Vue.prototype.$ajax = axios
        Vue.prototype.$const = consts
        Vue.prototype.$ = funs
        Vue.prototype.$config = { MAIN_NAME }
        // 需要挂载的都放在这里
    }
}

export default Plugins
module.exports = Plugins