import axios from 'axios'
import Qs from 'querystring'
import config from './config';
import apis from 'apis';
import oss from './oss';
import {
  isObj,
  isIframe
} from './util';
// import router from 'common/router';

// api通信地址
const BASE_URL = config.BASE_URL

// echarts全局配置
export const echartsCommonConfig = config.echartsCommonConfig

// axios响应拦截器
axios.interceptors.response.use(function (response) {
  // 如果响应401，说明token失效，跳转到登录页
  if (response.data.code == 401) {
    getVue().$message.error('登录失效，请重新登录')
    top.location.href = '/login.html'
  }
  // if (response.data.code === 500) {
  //   getVue().$message.error(response.data.msg || '未知错误，请联系管理员')
  // }
  // if (response.data.code === 0) {
  //   getVue().$message.success(response.data.msg)
  // }
  return response;
}, function (error) {
  // 对响应错误做点什么
  console.log(error);
  if (error && error.message) {
    getVue().$message.error(error.message)
  } else if (error.response.status === 404) {
    getVue().$message.error('请求错误，请联系管理员')
  } else {
    getVue().$message.error('未知错误，请联系管理员')
  }
  return Promise.reject(error);
});

/**
 * post formdata 请求
 * @param {String} url 请求的pathname
 * @param {Object} data 请求的主体对象
 */
export const requestWithFormData = (pathname, data) => {
  return Promise.resolve().then(() => axios({
    baseURL: BASE_URL,
    withCredentials: true,
    credentials: 'include',
    method: 'post',
    url: pathname,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data,
    transformRequest: [function (data) {
      return Qs.stringify(data)
    }]
  }))
}

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
export const fetchData = (opts, loadProgress) => {
  const defaults = {
    baseURL: BASE_URL,
    withCredentials: false,
    credentials: 'include',
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      token: localStorage.getItem('token')
    },
    // 对原生进度事件的处理
    onUploadProgress: loadProgress,
  }
  const options = Object.assign(defaults, opts)
  if (options.method === 'get') {
    defaults.params = opts.data
  }
  console.log(options);
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
 */
export const showDialog = (componentName, modelOpts, opts, listeners) => {
  let vm = top.vm.$children[0]
  vm.asyncModalVisible = true
  vm.comName = componentName
  vm.comTitle = modelOpts.title || ''
  vm.okText = modelOpts.okText || '确认'
  vm.cancelText = modelOpts.cancelText || '取消'
  vm.modalWidth = modelOpts.width
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



// 获取主vue
export const getVue = () => {
  if (isIframe()) {
    return top.vm.$children[0]
  } else {
    return top.vm
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
  iframe.style.overflow = 'hidden';
  iframe.style.border = 'none';
  iframe.id = iframe.name = name;
  iframe.frameborder = "0";
  iframe.style.minHeight = '780px'
  iframe.allowtransparency = "true";

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
  return iframe;
}

/**
 * 销毁iframe，释放iframe所占用的内存。

 * @param iframe 需要销毁的iframe对象
*/
export const destroyIframe = (iframe) => {
  //把iframe指向空白页面，这样能够释放大部分内存。
  iframe.src = 'about:blank';
  try {
    iframe.contentWindow.document.write('');
    iframe.contentWindow.document.clear();
  } catch (e) {
    throw e
  }
  //把iframe从页面移除
  iframe.parentNode.removeChild(iframe);
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
  console.log(type);
  getVue().$message[toast[type]](text)
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
    title: "您是否提交",
    content: "",
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
export const showModal = (type, text) => {
  let defaults = {
    maskClosable: true,
    title: "",
    content: "",
  }
  let options = {
    ...defaults,
    content: text,
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
export const handlerCode = (res, success, error) => {
  if (res.data.code === 0) {
    success()
  } else {
    showToast('error', res.data.message || '服务器请求异常，请联系管理员')
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
export const toParamUrl = (url, params) => {
  let toStringParams = '?'
  Object.keys(params).map(key => {
    toStringParams += key + '=' + params[key] + '&'
  })
  top.location.hash = url + toStringParams
}


// 上传图片到oss
export const uploadFileToOss = (file, id, productPlatformId, callback) => {
  oss.getUploadParam(file, id, productPlatformId, callback)
}


/**
 * // 设置校验规则
 * @param {Array} rules 规则数组
 */
export const setRule = (rules) => {
  let ret = []
  rules.map(el => {
    switch (el.type) {
      case 1: // 字符串的规则，有长度限制
        ret.push({
          type: 'string',
          min: +el.min,
          max: +el.max,
          message: el.msg
        }, {
          type: 'string',
          required: true,
          message: '不能为空'
        })
        break;

      case 2: // 整数的规则
        ret.push({
          type: 'integer',
          min: +el.min,
          max: +el.max,
          message: '请输入合法数字'
        }, {
          type: 'integer',
          required: true,
          message: '不能为空'
        })
        break;

      case 3: // 小数的规则
        ret.push({
          type: 'float',
          min: +el.min,
          max: +el.max,
          required: true,
          message: '请输入小数数字'
        })
        break;

      case 4: // http地址
        ret.push({
          type: 'url',
          required: true,
          message: el.msg
        })
        break;

      default:
        break;
    }
  })

  return ret
}