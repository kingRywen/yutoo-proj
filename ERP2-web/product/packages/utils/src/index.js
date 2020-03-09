import Storage from './utils/saver';

import axios from 'Plugins/axios'
import MakeApi from 'Plugins/api'
import funs from 'Plugins/$'
import MakeConst from 'Plugins/const'
import { _API_DEFAULT_CONFIG } from 'Config';

const Plugins = {
  // eslint-disable-next-line
  install: (Vue, options = {
    // axios配置
    AXIOS_DEFAULT_CONFIG: AXIOS_DEFAULT_CONFIG,
    CONST_PORT_CONFIG,
    AJAX_LOCALLY_ENABLE,
    CONST_DEFAULT_CONFIG,
    // api文件
    API_CONFIG: [],

    // api默认配置
    API_DEFAULT_CONFIG: null,

    // 常量
    CONST_CONFIG: [],
    env: {}
  }) => {
    if (!options.API_DEFAULT_CONFIG) {
      options.API_DEFAULT_CONFIG = _API_DEFAULT_CONFIG
    }
    // console.log(options.API_DEFAULT_CONFIG);

    const { AXIOS_DEFAULT_CONFIG, API_CONFIG, CONST_CONFIG, MAIN_NAME, Interceptors, CONST_PORT_CONFIG, AJAX_LOCALLY_ENABLE, CONST_DEFAULT_CONFIG, STORAGE_NAME, API_DEFAULT_CONFIG, env } = options
    const _axios = axios(AXIOS_DEFAULT_CONFIG, Interceptors, API_DEFAULT_CONFIG, CONST_PORT_CONFIG, AJAX_LOCALLY_ENABLE)
    Vue.prototype.$ajax = _axios

    const api = new MakeApi(
      Object.assign(
        {},
        {
          config: API_CONFIG
        }
      ),
      _axios,
      API_DEFAULT_CONFIG,
      CONST_PORT_CONFIG,
      AJAX_LOCALLY_ENABLE,
      env
    )['api']
    const consts = new MakeConst(Object.assign({}, {
      config: CONST_CONFIG
    },
      CONST_DEFAULT_CONFIG
    ))['const']

    Vue.prototype.$api = api
    Vue.prototype.$ = funs
    Vue.prototype.$storage = new Storage(STORAGE_NAME)
    Vue.prototype.$const = consts
    Vue.prototype.$config = { MAIN_NAME }

    if (window.GLOBAL) {
      GLOBAL.ajax = api
      GLOBAL.$const = consts
    }

  },
  Storage
}

export default Plugins
module.exports = Plugins;