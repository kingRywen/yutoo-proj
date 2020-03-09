import axios from 'axios'
import Qs from 'querystring'

export const BASE_URL = 'http://localhost:8080'

axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  if (res.data.code == 401) {
    if (top) {
      top.location.replace('/login/index.html')
      localStorage.removeItem('token')
    } else {
      window.location.replace('/login/index.html')
      localStorage.removeItem('token')
    }
    return Promise.reject(res.data.msg)
  }
  return res;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

/**
 * post formdata 请求
 * @param {String} url 请求的pathname
 * @param {Object} data 请求的主体对象
 */
export const formDataReq = (pathname, data) => {
  return Promise.resolve().then(() => axios({
    baseURL: BASE_URL,
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
 * 正常的get请求
 * @param {String} path 请求的路径
 * @param {Object} data 请求的参数对象
 */
export const request = (path, data) => {
  return Promise.resolve().then(() => axios({
    baseURL: BASE_URL,
    method: 'get',
    url: path,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      token: localStorage.getItem('token')
    },
    params: data
  }))
}

/**
 * 正常的post请求
 * @param {String} path 请求的路径
 * @param {Object} data 请求的参数对象
 */
export const post = (path, data) => {
  return Promise.resolve().then(() => axios({
    baseURL: BASE_URL,
    method: 'post',
    url: path,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      token: localStorage.getItem('token')
    },
    data: data
  }))
}


// 调整iframe的大小
export function resize() {
  let fram = top.document.querySelector('#main')
  if (!fram) {
    return
  }
  let H = fram.contentWindow.document.body.offsetHeight
  console.log(H)
  fram.style.height = H + 'px'
}

// 对不同 的响应结果进行反馈 成功后会调用回调函数
export const handleRes = (data, cb) => {
  if (data.code === 0) {
    message.success(data.msg)
    top.vm.dialogFormVisible = false
    // 更新vue的数据
    if (cb) cb()
  } else {
    message.error(data.msg)
  }
}

// 获取地址参数
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export const isNullOrEmpty = function (obj) {
  if ((typeof (obj) == "string" && obj == "") || obj == null || obj == undefined) {
    return true;
  } else {
    return false;
  }
}

//权限判断
export const hasPermission = (permission) => {
  if (isNullOrEmpty(top.perms)) {
    return false;
  }
  if (top.perms.indexOf(permission) > -1) {
    return true;
  } else {
    return false;
  }
}


/**
 * // 打开包含iframe的顶级弹窗
 * @param {String} url 打开的url地址
 * @param {String} title 弹窗title
 */
export const openIframeDialog = (opts) => {
  let defaults = {
    url: null,
    title: '操作',
    height: 600,
    data: {}
  }
  let options = Object.assign(defaults, opts)
  if (!options.url) {
    console.error('请设置iframe的url路径');
  }
  let vm = top.vm
  vm.dialogFormVisible = true
  vm.dialog.frameSrc = options.url
  vm.dialog.title = options.title
  vm.dialog.height = options.height
  vm.dialog.data = options.data
  if (typeof opts.callback === 'function') {
    vm.dialog.callback = opts.callback
  }
  
}


/**
 * // 打开常规询问确认弹窗
 * 
 */
export const openPromptDialog = ({
  title = '系统提示',
  content,
  color = '#f00',
  cb = () => {}
}) => {
  let _this = top.vm
  const h = _this.$createElement;
  return _this.$msgbox({
    title: title,
    message: h('p', null, [
      h('span', {
        style: `color: ${color}`
      }, content)
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = '执行中...';
        cb(instance, done)
      } else {
        done();
      }
    }
  }).then(action => {});
}

// 弹窗
export const confirmDialog = (opts) => {
  let defaults = {
    msg: "您确定要保存当前数据项修改操作吗？",
    url: "",
    data: {},
    success: null
  }
  let options = Object.assign(defaults, opts)
  post(options.url, options.data)
    .then(res => options.success(res))
}

export const message = {
  error(msg) {
    top.vm.$message.error(msg)
  },
  success(msg) {
    top.vm.$message.success(msg)
  }
}

export const checkedArray = function (id) {
  var isOK = true;
  if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
    isOK = false;
    message.error('您没有选中任何数据项！');
  }
  return isOK;
}

export const checkedArrayOne = function (id) {
  var isOK = true;
  if (id.length !== 1) {
    isOK = false;
    message.error('请选择一条数据进行编辑');
  }
  return isOK;
}

// 更新某个iframe的vue中的数据
export const updateVmData = (id, prop, data) => {
  let _this = top.frames[id].contentWindow.vm
  _this.prop = data
}

// 获取某个iframe的vue实例
export const getVueInstance = (id) => {
  return top.frames[id].frameElement.contentWindow.vm
}

// 删除表格中的一行

export const deleteRows = (opts) => {
  let defaults = {
    multiArray: null,
    param: null,
    postUrl: null,
    content: '确定要执行这项操作吗？',
    success() {}
  }
  let options = Object.assign(defaults, opts)
  if (checkedArray(options.multiArray)) {
    let ids = options.multiArray.map((el) => el[options.param])
    openPromptDialog({
      content: options.content,
      cb(instance, done) {
        post(options.postUrl, ids)
          .then(res => {
            handleRes(res.data, () => {
              console.log(res.data)
              if (res.data.code === 0) {
                options.success()
              }
            })
            instance.confirmButtonLoading = false;
            instance.confirmButtonText = '确定';
            done()
          })
      }
    })
  }
}

export const formatDate = (v, format) => {
  if (!v) return "";
  var d = v;
  if (typeof v === 'string') {
    if (v.indexOf("/Date(") > -1)
      d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
    else
      d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0])); //.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
  }
  var o = {
    "M+": d.getMonth() + 1,
    "d+": d.getDate(),
    "h+": d.getHours(),
    "m+": d.getMinutes(),
    "s+": d.getSeconds(),
    "q+": Math.floor((d.getMonth() + 3) / 3),
    "S": d.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}