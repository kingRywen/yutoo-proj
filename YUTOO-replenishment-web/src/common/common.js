import axios from 'axios'
import { CONST_PORT_CONFIG as config } from 'Config'
import bus from './bus';
import apis from '@/apis';
import downloadTxt from './download';
import { codeStragy } from 'Config/interceptors/axios';
import Vue from 'vue';
import {
  isObj,
  isIframe,
} from './util';

// api通信地址
const BASE_URL = config.PRODUCT_URL
const loginRedirect = config.loginRedirect

// echarts全局配置
export const echartsCommonConfig = config.echartsCommonConfig

// 获取主vue
export const getVue = () => {
  try {
    if (isIframe()) {
      return top.vm.$children[0]
    } else {
      return top.vm || Vue.prototype
    }
  } catch (error) {
    return Vue.prototype
  }


}

/**
 * 本地存储
 */
export const _storage = {
  local: localStorage,
  session: sessionStorage,
  host: window.location.host,
  _get(type, name) {
    const item = this[type].getItem(this.host + '_' + name)
    return !item ? null : JSON.parse(item)
  },
  set(type, name, val) {
    return this[type].setItem(this.host + '_' + name, JSON.stringify(val))
  },
  remove(type, name) {
    return this[type].removeItem(this.host + '_' + name)
  },
  clear(type) {
    return this[type].clear()
  }
}


// axios.defaults.timeout = 15 * 1000;

// axios请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.url && (config.url.substr(0, 8) === '/erp-sso' || config.url.substr(0, 15) === '/erp-permission' || config.url.substr(0, 14) === '/erp-replenish')) {
    config.baseURL = ''
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// axios响应拦截器
axios.interceptors.response.use(function (response) {
  // 如果响应401，说明token失效，跳转到登录页
  if (response.data.code == 401 || response.data.code == 403) {
    codeStragy.redirectToLogin('登录失效，请重新登录')
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  console.log(error);
  if (error && error.code === 'ECONNABORTED') {
    getVue().$message.error('请求超时')
    bus.$emit('timeout')
  } else if (error && error.message) {
    getVue().$message.error(error.message)
    bus.$emit('timeout')
  } else if (error.response.status === 404) {
    getVue().$message.error('请求错误，请联系管理员')
    bus.$emit('timeout')
  } else if (error.response.status === 407) {
    getVue().$message.error('你没有权限')
    bus.$emit('timeout')
  } else {
    getVue().$message.error('未知错误，请联系管理员')
    bus.$emit('timeout')
  }
  return Promise.reject(error);
});

/**
 * 普通请求 post get
 * @param {Object} opts 请求的具体对象
 * @param {Boolean} loadProgress 进度
 * @returns {Promise}
 * @example 
 * fetchData({
 *    method: 'post',
 *    data: {name: 1},
 *    url: '/examples'
 * })
 * fetchData({
 *    method: 'get',
 *    params: {name: 1},
 * })
 */
export const fetchData = (opts, loadProgress, config = {}) => {
  const defaults = {
    baseURL: BASE_URL,
    withCredentials: true,
    credentials: 'include',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      token: _storage._get('local', 'token')
    },
    // 对原生进度事件的处理
    onUploadProgress: loadProgress,
  }

  if (opts.noBase) {
    delete defaults.baseURL
  }

  const options = Object.assign(defaults, opts, config)
  if (options.method === 'get') {
    defaults.params = opts.data
  }
  return Promise.resolve().then(() => axios(options))
}

/**
 * 处理并发请求
 * @param {Array} urls 请求的配置组，数组
 * @returns {Array} 请求完成后的结果数组
 * 
 */
export const fetchAllData = (urls) => {
  let tasks = urls.map(el => {
    if (!isObj(el)) {
      throw new Error('数组元素必须是对象')
    }
    return function () {
      return fetchData(el)
    }
  });

  return Promise.resolve().then(() => axios.all(tasks.map(task => task()))).then(axios.spread(function () {
    return arguments
  }))
}


// 最底层路由跳转
export const toUrl = (path) => {
  path = loginRedirect.slice(0, -1) + path
  if (isIframe()) {
    top._router(path)
  } else {
    window.location.href = path
  }
}

/**
 * 
 * // 弹窗
 * 
 * @param {String} componentName          要打开的异步组件名称，在顶层vue中先注册好
 * @param {Object} modelOpts              绑定弹窗参数
 * @param {Object} opts                   绑定组件初始值
 * @param {Object} listeners              绑定组件监听事件 set是model确认事件
 * @param {Boolean} fullScreen            是否全屏显示弹窗
 */
export const showDialog = (componentName, modelOpts, opts, listeners, fullScreen, overflow, classname) => {

  let vm = top.vm.$children[0]
  let className = []
  if (fullScreen) {
    className.push('full_screen')
  }
  if (overflow) {
    className.push('__overflow')
  }
  if (classname) {
    className.push(classname)
  }
  vm.wrapFullName = className.join(' ')

  vm.asyncModalVisible = true
  vm.comName = componentName
  vm.comTitle = modelOpts.title || ''
  vm.okText = modelOpts.okText || '确认'
  vm.cancelText = modelOpts.cancelText || '取消'
  vm.modalWidth = modelOpts.width
  vm.modalnoBtn = modelOpts.modalnoBtn || null
  vm.bindData = opts
  vm.handlers = listeners
}

// 循环遍历数组并找出匹配项

export const loopFind = (arr, parent, selected, sortHandler, parentHandler, handler) => {
  // loopFind.indexs = loopFind.indexs || []
  arr.map((el, index, self) => {
    if (sortHandler(el)) {
      handler(el, parent, self)
    } else {
      if (el[selected]) {
        parentHandler(el)
        loopFind(el[selected], el, selected, sortHandler, parentHandler, handler);
      }
    }
  });
};

// 修复iframe高度
export const fixFrameHeight = (isTab) => {
  return;
  let iframe = top.frames["main"];
  if (!iframe) return;
  if (isTab) {
    let windowHeight = top.document.body.offsetHeight || top.document.documentElement.clientWidth || top.innerWidth
    iframe.frameElement.removeAttribute('style')
    // iframe.frameElement.style.height = window.document.body.scrollHeight + "px";
    iframe.frameElement.style.height = windowHeight - 140 + "px";
    // iframe.frameElement.style.minHeight = windowHeight - 120 + "px";
  } else {
    iframe.frameElement.style.height =
      window.document.body.offsetHeight +
      window.document.body.scrollHeight -
      780 +
      "px";
  }
}






/**
 * 动态创建iframe
 * @param dom                   创建iframe的容器，即在dom中创建iframe。dom能够是div、span或者其它标签。
 * @param src                   iframe中打开的网页路径
 * @param onload                iframe载入完后触发该事件。能够为空
 * @return                      返回创建的iframe对象
 */
export const createIframe = (dom, src, name, onload) => {
  //在document中创建iframe
  var iframe = document.createElement("iframe");

  //设置iframe的样式
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.margin = '0';
  iframe.style.padding = '0';
  // iframe.style.overflow = 'hidden';
  iframe.style.border = 'none';
  iframe.id = iframe.name = name;
  iframe.frameborder = "0";
  // iframe.style.minHeight = '780px'
  // iframe.allowtransparency = "true";

  //绑定iframe的onload事件
  if (onload && Object.prototype.toString.call(onload) === '[object Function]') {
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', onload);
    } else if (iframe.addEventListener) {
      iframe.addEventListener('load', onload);
    } else {
      iframe.onload = onload;
    }
  }

  iframe.src = src;
  //把iframe载入到dom以下
  dom.appendChild(iframe);
  // setTimeout(() => {
  //   dom.appendChild(iframe);
  // });

  console.log('创建iframe');

  return iframe;
}

/**
 * 销毁iframe，释放iframe所占用的内存。

 * @param iframe 需要销毁的iframe对象
*/
export const destroyIframe = (iframe) => {
  //把iframe指向空白页面，这样能够释放大部分内存。
  try {
    if (iframe.contentWindow.vm) {
      iframe.contentWindow.vm.$destroy();
      iframe.contentWindow.vm = null
    }
    iframe.src = 'about:blank';

    iframe.contentWindow.document.write('');
    iframe.contentWindow.document.clear();

  } catch (error) {

  }

  //把iframe从页面移除
  iframe.parentNode.removeChild(iframe);
  console.log('清除iframe');
}

const toast = {
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
}


/**
 * 
 * 消息提示
 * 
 * @param {String} type       // 消息类型
 * @param {String} text       // 消息文本 
 */
export const showToast = (type, text) => {

  let vueInstance = getVue()
  // console.log(vueInstance.$message[toast[type]]);
  vueInstance.$message({
    dangerouslyUseHTMLString: true,
    type: toast[type],
    message: text
  })
  // vueInstance.$message[toast[type]](text)
}


/**
 * 
 * 显示confirm
 * 
 * @param {String} ok       // 确认回调
 * @param {String} cancel       // 取消回调 
 */
export const showConfirm = (opts) => {
  let defaults = {
    title: "提示",
    content: "",
    maskClosable: true,
    onOk: function () {

    },
    onCancel: function () {

    }

  }
  let options = {
    ...defaults,
    ...opts
  }
  getVue().$modal.confirm(options);
}
/**
 * 
 * 显示提示对话
 * 
 * @param {String} ok       // 确认回调
 * @param {String} cancel       // 取消回调 
 */
export const showModal = (type, text, title) => {
  let defaults = {
    maskClosable: true,
    title: "",
    content: "",
  }
  let options = {
    ...defaults,
    content: text,
    title
  }
  getVue().$modal[toast[type]](options);
}

/**
 * 
 * 拓展参数
 * 
 */
export const setData = (first, data) => {
  return Object.assign({}, first, {
    data
  })
}

/**
 * 
 * 处理http响应码
 * 
 */
/**
 * 
 * @param {Object} res        响应数据
 * @param {Function} success  成功回调
 * @param {Function} error    失败回调
 * @param {Boolean} type      是否显示成功信息
 */
export const handlerCode = (res, success, error, type) => {
  if (res.data.code === 0) {
    if (!type) {
      showToast('success', res.data.msg || '操作成功')
    }
    if (success) success()
  } else {
    showToast('error', res.data.msg || '服务器请求异常，请联系管理员')
    if (error) {
      error()
    }
  }
}

/**
 * 
 * 跳转到param页面
 * 
 */
export const toParamUrl = (url, params, newUrl) => {
  url = url.slice(0, 1) === '/' ? process.env.NODE_ENV === 'production' ? url : url.slice(1) : url
  url = process.env.NODE_ENV === 'production' ? url : (loginRedirect + url)
  if (!params) {
    if (newUrl) {
      top.open(top.location.pathname + url, true)
      return
    }
    console.log(url);
    top.location.hash = url
    return
  }

  let toStringParams = ''
  let keys = Object.keys(params)

  keys.map(key => {
    if (params[key] == null) {
      return
    }
    toStringParams += key + '=' + JSON.stringify(params[key]) + '&'
  })

  top.location.hash = url + '?' + encodeURIComponent(toStringParams)
}



/**
 * // 设置校验规则
 * @param {Array} rules 规则数组
 */
export const setRule = (rules) => {
  let ret = []
  let checkFloat = (rule, value, callback) => {
    if (isNaN(value)) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  }
  rules.map(el => {
    switch (el.type) {
      case 1: // 字符串的规则，有长度限制
        ret.push({
          type: 'string',
          min: +el.min,
          max: +el.max,
          message: el.msg
        })
        break;

      case 2: // 整数的规则
        ret.push({
          type: 'integer',
          min: +el.min,
          max: +el.max,
          message: '请输入合法数字'
        })
        break;

      case 3: // 小数的规则
        ret.push({
          validator: checkFloat
        })
        break;

      case 4: // http地址
        ret.push({
          type: 'url',
          required: false,
          message: el.msg
        })
        break;

      case 5: // 价格
        ret.push({
          validator: checkFloat
        })
        break;

      default:
        break;
    }
  })

  return ret
}

/**
 * 批量验证表单，如果验证通过 ，返回 true 否则返回false
 * @param {Array} forms 要验证的表单组
 */
export async function batchValidForm(forms, index) {
  let ret = [];
  console.log(forms);
  const promises = forms.map(async (form, i) => {
    const promise = new Promise((resolve, reject) => {
      if (!form.validate) {
        if (form.$refs.ruleForm) {
          if (!form.$refs.ruleForm.fields.length) {
            let multis = form.$refs.PurchaseMulti
            if (multis) {
              let count = 0
              multis.forEach(subForm => {
                if (!subForm.$children[0].fields.length) {
                  count++
                  return
                }
                subForm.$children[0].validate(valid => {
                  if (valid) {
                    count++
                  }
                })
              });
              if (count === multis.length) {
                resolve(true)
              } else {
                if (index) {
                  resolve(i);
                } else {
                  resolve(false);
                }
              }
            } else {
              resolve(true);
            }
          } else {
            form.$refs.ruleForm.validate(valid => {
              if (valid) {
                let multis = form.$refs.PurchaseMulti
                if (multis) {
                  let count = 0
                  multis.forEach(subForm => {
                    subForm.$children[0].validate(valid => {
                      if (valid) {
                        count++
                      }
                    })
                  });
                  if (count === multis.length) {
                    resolve(true)
                  } else {
                    if (index) {
                      resolve(i);
                    } else {
                      resolve(false);
                    }
                  }
                } else {
                  resolve(true);
                }

              } else {
                if (index) {
                  resolve(i);
                } else {
                  resolve(false);
                }


              }
            });
          }
          // debugger

        } else {
          resolve(true);
        }

      } else {
        form.validate && form.validate(valid => {
          if (valid) {
            resolve(true);
          } else {
            if (index) {
              resolve(i);
            } else {
              resolve(false);
            }
          }
        });
      }

    });
    return promise;
  });



  for (const promise of promises) {
    ret.push(await promise);
  }



  if (index) {
    return ret.filter(el => Number.isInteger(el))
  }

  if (ret.some(el => el == false)) {
    console.log("验证不通过");
    return false;
  } else {
    console.log("验证通过");
    return true;
  }
}

export const logout = () => {
  // localStorage.clear()
  _storage.remove('local', 'token')
  _storage.remove('local', 'perms')
  fetchData({
    ...apis.MERCHANT_USER_LOGOUT
  }).then(res => {

  })
  top.location.href = loginRedirect + 'login.html'

}

/**
 * 下载文件
 * @param {String} url 下载路径
 * @param {Boolean} txt 下载为txt
 * 
 */
export const downloadFile = (url, txt, _blank) => {
  if (!txt) {
    var link = document.createElement("a");
    document.body.appendChild(link)
    link.style.display = 'none'
    if (_blank) {
      link.target = '_blank'
    }
    link.href = url
    let exts = url.split('.')
    let ext = '.' + exts[exts.length - 1]
    link.download = '下载' + ext
    link.click();
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link)
  } else {
    downloadTxt(url, "info.txt", "text/plain")
  }

}

/**
 * 打开指定url的链接
 * @param {String} url 要打开的链接地址
 * @param {Boolean} url 在新窗口打开链接 默认true
 */
export const openLink = (url, target = '_blank') => {
  var link = document.createElement("a");
  document.body.appendChild(link)
  link.style.display = 'none'
  link.href = url
  link.target = target
  link.click();
  document.body.removeChild(link)
}

/**
 * 权限获取
 * @param {Number} id 权限id
 * 
 */
export const getPerms = (id) => {
  let perms = _storage._get('local', 'perms')
  return perms.find(el => el.parentId === id).child
}