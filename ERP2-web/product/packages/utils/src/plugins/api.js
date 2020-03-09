// import axios from './axios'
import _pick from "lodash/pick";
import _assign from "lodash/assign";
import _isEmpty from "lodash/isEmpty";
import { assert } from "Utils/tools";
import qs from "qs";
import { dealObjectValue } from "./$.js";
// import { API_DEFAULT_CONFIG, CONST_PORT_CONFIG, AJAX_LOCALLY_ENABLE } from 'Config'

// const { strict } = API_DEFAULT_CONFIG

function loadScript() {
  return new Promise(resolve => {
    let script = document.createElement("script");
    script.src = "http://mockjs.com/dist/mock.js";
    script.type = "text/javascript";
    if (script.readyState) {
      script.onreadystatechange = function() {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      script.onload = function() {
        resolve();
      };
    }
    document.body.appendChild(script);
  });
}

class MakeApi {
  constructor(
    options,
    _axios,
    API_DEFAULT_CONFIG,
    CONST_PORT_CONFIG,
    AJAX_LOCALLY_ENABLE,
    env
  ) {
    this.api = {};
    this.apiBuilder(
      options,
      _axios,
      API_DEFAULT_CONFIG,
      CONST_PORT_CONFIG,
      AJAX_LOCALLY_ENABLE,
      env
    );
  }

  async apiBuilder(
    { sep = "/", config = {}, mock = false, debug = false },
    _axios,
    API_DEFAULT_CONFIG,
    CONST_PORT_CONFIG,
    AJAX_LOCALLY_ENABLE,
    env
  ) {
    Object.keys(config).map(namespace => {
      this._apiSingleBuilder(
        {
          namespace,
          mock,
          CONST_PORT_CONFIG,
          sep,
          debug,
          config: config[namespace]
        },
        _axios,
        API_DEFAULT_CONFIG,
        AJAX_LOCALLY_ENABLE,
        CONST_PORT_CONFIG,
        env
      );
    });
    // getConfig().then(_CONST_PORT_CONFIG => {

    // })
  }
  async _apiSingleBuilder(
    {
      namespace,
      sep = "/",
      config = {},
      // eslint-disable-next-line
      mock = false,
      debug = false
    },
    _axios,
    API_DEFAULT_CONFIG,
    AJAX_LOCALLY_ENABLE,
    CONST_PORT_CONFIG,
    env
  ) {
    const { strict, mockBaseURL, validate, moduleMock } = API_DEFAULT_CONFIG;
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
        mock: apiMock,
        mockData,
        noShowDefaultError,
        showSuccess,
        newShowSuccess,
        allowNull,
        // strict,
        mockPath,
        mockBaseURL: apiMockBaseUrl,

        must,
        singleLoading
      } = api;
      const isProd = env.NODE_ENV === "production";
      const isMock = isProd
        ? false
        : AJAX_LOCALLY_ENABLE || apiMock || mockEnable;
      const url = isMock ? mockPath || path : path;
      let baseURL;

      debug && assert(name, `${url} :接口name属性不能为空`);
      debug &&
        assert(url.indexOf("/") === 0, `${url} :接口路径path，首字符应为/`);

      Object.defineProperty(
        this.api,
        namespace ? `${namespace}${sep}${name}` : `${name}`,
        {
          value(outerParams, outerOptions, outerConfig) {
            // console.log(CONST_PORT_CONFIG);
            // 是否强制一一对应service api
            let _data =
              Object.prototype.toString.call(outerParams) !== "[object Object]"
                ? outerParams
                : _isEmpty(outerParams)
                ? params
                : strict
                ? _pick(_assign({}, params, outerParams), Object.keys(params))
                : outerParams instanceof Array
                ? outerParams
                : _assign({}, params, outerParams);
            const name = namespace.toUpperCase() + "_URL";
            if (!isMock) {
              //如果不是mock接口

              baseURL =
                CONST_PORT_CONFIG[name] || CONST_PORT_CONFIG["DEFAULT_URL"];
            } else {
              baseURL = apiMockBaseUrl || moduleMock[name] || mockBaseURL;
            }
            let _options = Object.assign(
              {},
              config,
              {
                url,
                desc,
                baseURL,
                showSuccess,
                newShowSuccess,
                singleLoading,
                isMock,
                method,
                noShowDefaultError
              },
              outerConfig
            );

            if (allowNull) {
              _data = dealObjectValue(_data, allowNull);
            }
            // console.log(_data);
            // 验证必填
            if (!isProd && validate && must && _data) {
              let keys = [],
                error = [];
              Object.keys(_data).forEach(key => {
                if (_data[key] != null) {
                  keys.push(key);
                }
              });
              must.forEach(el => {
                if (keys.indexOf(el) === -1) {
                  error.push(el);
                }
              });
              if (error.length) {
                const styles = [
                  "color:black",
                  "background:yellow",
                  "font-size:12px"
                ].join(";");
                console.error(
                  `%c接口 %c${url} %c的必填项没传: %c${error.join(" | ")}`,
                  "color:green",
                  "color:red;font-weight:bolder",
                  "color:green;font-weight:normal",
                  styles
                );
              }
            }
            if (mockData && isMock) {
              if (window.Mock) {
                return Promise.resolve(window.Mock.mock(mockData));
              } else {
                return loadScript().then(() => {
                  return window.Mock.mock(mockData);
                });
              }
            }
            return _axios(
              _normoalize(_assign(_options, outerOptions), _data, type, isMock)
            ).catch(err => {
              if (err instanceof Error) {
                console.error(err);
              }
              return Promise.reject(err);
            });
          }
        }
      );
    });
  }
}

function _normoalize(options, data, type, isMock) {
  // 这里可以做大小写转换，也可以做其他类型 RESTFUl 的兼容
  if (options.method === "POST") {
    if (type === "formdata") {
      // formdata处理
      options.headers = {
        "Content-Type": "multipart/form-data;charset=utf-8"
      };
      let formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (Object.prototype.toString.call(element) === "[object Object]") {
            if (element.raw) {
              formData.append(key, element.raw);
            }
          } else if (
            Object.prototype.toString.call(element) === "[object Array]"
          ) {
            element.forEach(el => {
              if (Object.prototype.toString.call(el) === "[object Object]") {
                //对象是二进制文件
                if (el.raw) {
                  formData.append(key, el.raw);
                  //是对象不是2进止 是数组
                } else {
                  formData.append(key, JSON.stringify(el));
                }
              }
            });
            continue;
          } else {
            formData.append(key, element);
          }
        }
      }
      options.data = formData;
      return options;
    } else if (type === "form") {
      options.headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      data = qs.stringify(data);
    }

    options.data = data;
  } else if (options.method === "GET") {
    options.params = data;
  }
  if (isMock) {
    options.headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
  }
  return options;
}

export default MakeApi;
