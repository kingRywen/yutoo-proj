import axios from './axios'
import _pick from 'lodash/pick'
import _assign from 'lodash/assign'
import _isEmpty from 'lodash/isEmpty'
/* eslint-disable */
import { assert } from 'Utils/tools'
import {
  API_DEFAULT_CONFIG,
  CONST_PORT_CONFIG,
  AJAX_MOCK_BASEURL
} from 'Config'
import API_CONFIG from 'Service/api'

console.log(AJAX_MOCK_BASEURL)

const { strict } = API_DEFAULT_CONFIG

/* eslint-disable */
class MakeApi {
  constructor(options) {
    this.api = {}
    this.apiBuilder(options)
  }

  apiBuilder({
    sep = '|',
    config = {},
    mock = false,
    debug = false,
    mockBaseURL = ''
  }) {
    Object.keys(config).map(namespace => {
      this._apiSingleBuilder({
        namespace,
        mock,
        mockBaseURL,
        sep,
        debug,
        config: config[namespace]
      })
    })
  }
  _apiSingleBuilder({
    namespace,
    sep = '|',
    config = {},
    mock = false,
    debug = false
  }) {
    config.forEach(api => {
      let {
        name,
        desc,
        params,
        method,
        mockEnable,
        path,
        mock,
        type,
        showSuccess,
        singleLoading,
        mockPath
      } = api
      const isMock =
        process.env.NODE_ENV === 'production' ? false : mock || mockEnable
      const url = isMock ? mockPath : path
      let baseURL = isMock && AJAX_MOCK_BASEURL

      debug && assert(name, `${url} :接口name属性不能为空`)
      debug &&
        assert(url.indexOf('/') === 0, `${url} :接口路径path，首字符应为/`)

      Object.defineProperty(this.api, `${namespace}${sep}${name}`, {
        value(outerParams, outerOptions) {
          // 是否强制一一对应service api
          const _data = _isEmpty(outerParams)
            ? params
            : strict
            ? _pick(_assign({}, params, outerParams), Object.keys(params))
            : _assign({}, params, outerParams)
          if (!isMock) {
            //如果不是mock接口
            baseURL = CONST_PORT_CONFIG[namespace.toUpperCase() + '_URL']
          } else {
            type = 'mock'
          }

          const _options = {
            url,
            desc,
            baseURL,
            isMock,
            showSuccess,
            singleLoading,
            method
          }

          // console.log(_normoalize(_assign(_options, outerOptions), _data, type));
          return axios(
            _normoalize(_assign(_options, outerOptions), _data, type)
          )
        }
      })
    })
  }
}

function _normoalize(options, data, type) {
  // 这里可以做大小写转换，也可以做其他类型 RESTFUl 的兼容
  if (options.method === 'POST') {
    // formdata处理
    if (type === 'formdata') {
      options.headers = {
        'Content-Type': 'multipart/form-data'
      }
      let formData = new FormData()
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          if (Object.prototype.toString.call(element) === '[object Object]') {
            if (element.raw) {
              formData.append(key, element.raw)
            }
          } else if (
            Object.prototype.toString.call(element) === '[object Array]'
          ) {
            element.forEach(el => {
              if (Object.prototype.toString.call(el) === '[object Object]') {
                //对象是二进制文件
                if (el.raw) {
                  formData.append(key, el.raw)
                  //是对象不是2进止 是数组
                } else {
                  formData.append(key, JSON.stringify(element))
                }
              }
            })
            continue
          } else {
            formData.append(key, element)
          }
        }
      }
      options.data = formData
      return options
    }
    options.data = data
  } else if (options.method === 'GET') {
    options.params = data
  }
  return options
}

// 注入模型和全局配置，并暴露出去
export default new MakeApi({
  config: API_CONFIG,
  ...API_DEFAULT_CONFIG
})['api']
