import axios from './axios'
import _pick from 'lodash/pick'
import _assign from 'lodash/assign'
import _isEmpty from 'lodash/isEmpty'
import Vue from 'vue'
import storage from 'Utils/saver';

import {
    assert
} from 'Utils/tools'
import {
    API_DEFAULT_CONFIG,
    AJAX_LOCALLY_ENABLE,
    CONST_PORT_CONFIG
} from 'Config'
import API_CONFIG from 'Service/api'

const {
    strict,
    validate,
    mockBaseURL
} = API_DEFAULT_CONFIG


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
        // mockBaseURL = ''
    }) {

        if (Object.prototype.toString.call(config) === '[object Array]') {
            this._apiSingleBuilder({
                mock,
                // mockBaseURL,
                sep,
                debug,
                config: config
            })
        } else {
            Object.keys(config).map(namespace => {
                this._apiSingleBuilder({
                    namespace,
                    mock,
                    // mockBaseURL,
                    sep,
                    debug,
                    config: config[namespace]
                })
            })
        }
    }
    _apiSingleBuilder({
        namespace,
        sep = '|',
        config = {},
        // mock = false,
        debug = false,
    }) {
        config.forEach(api => {
            const {
                name,
                desc,
                params,
                method,
                mockEnable,
                path,
                config,
                type,
                mock,
                noShowDefaultError,
                showSuccess,
				newShowSuccess,
                allowNull,
                common,
                // strict,
                must,
                singleLoading,
            } = api
            const isMock = process.env.NODE_ENV === 'production' ? false : AJAX_LOCALLY_ENABLE && (mock || mockEnable)
            // debugger
            // const isMock =false
            const url = path
            let baseURL = isMock && mockBaseURL

            debug && assert(name, `${url} :接口name属性不能为空`)
            debug && assert(url.indexOf('/') === 0, `${url} :接口路径path，首字符应为/`)

            Object.defineProperty(this.api, namespace ? `${namespace}${sep}${name}` : `${name}`, {
                value(outerParams, outerOptions, outerConfig) {
                    // console.log(CONST_PORT_CONFIG);
                    // 是否强制一一对应service api
                    let _data = _isEmpty(outerParams) ? params : strict ? _pick(_assign({}, params, outerParams), Object.keys(params)) : _assign({}, params, outerParams)
                    if (!isMock) {
                        //如果不是mock接口
                        const routerType = common ? 'amazon' : storage.get('local', 'routerType') || 'amazon'
                        baseURL = CONST_PORT_CONFIG[routerType.toUpperCase() + '_URL']
                    }
                    const _options = {
                        ...config,
                        url,
                        desc,
                        baseURL,
                        showSuccess,
						newShowSuccess,
                        singleLoading,
                        isMock,
                        method,
                        noShowDefaultError,
                        ...outerConfig
                    }
                    if (allowNull) {
                        _data = Vue.prototype.$.dealObjectValue(_data, allowNull)
                    }
                    // console.log(_data);
                    // 验证必填
                    if (process.env.NODE_ENV !== 'production' && validate && must && _data) {
                        let keys = [], error = []
                        Object.keys(_data).forEach(key => {
                            if (_data[key] != null) {
                                keys.push(key)
                            }
                        })
                        must.forEach(el => {
                            if (keys.indexOf(el) === -1) {
                                error.push(el)
                            }
                        })
                        if (error.length) {
                            const styles = [
                                'color:black',
                                'background:yellow',
                                'font-size:12px'
                            ].join(';')
                            console.error(`%c接口 %c${url} %c的必填项没传: %c${error.join(' | ')}`, 'color:green', 'color:red;font-weight:bolder', 'color:green;font-weight:normal', styles);
                        }
                    }
                    // console.log(_options)
                    return axios(_normoalize(_assign(_options, outerOptions), _data, type)).catch(err => {
                        if (err instanceof Error) {
                            console.error(err);
                        }
                        return Promise.reject(err)
                    })
                }
            })
        })
    }
}

// function _normoalize(options, data) {
//     // 这里可以做大小写转换，也可以做其他类型 RESTFUl 的兼容
//     if (options.method === 'POST') {
//         options.data = data
//     } else if (options.method === 'GET') {
//         options.params = data
//     }
//     return options
// }

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
                    const element = data[key];
                    if (Object.prototype.toString.call(element) === '[object Object]') {
                        if (element.raw) {
                            formData.append(key, element.raw)
                        }
                    } else if (Object.prototype.toString.call(element) === '[object Array]') {
                        element.forEach((el) => {
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