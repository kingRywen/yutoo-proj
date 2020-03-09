import axios from 'axios'
import Qs from 'querystring'

export const BASE_URL = 'http://localhost:8080'

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

// ----------------------------
// ----------------------------

axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  if (res.data.code == 401) {
    if (top) {
      top.location.replace('/login/index.html')
    } else {
      window.location.replace('/login/index.html')
    }
    return Promise.reject(res.data.msg)
  }
  return res;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

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
      'Content-Type': 'application/json',
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
      'Content-Type': 'application/json',
      token: localStorage.getItem('token')
    },
    data: data
  }))
}

export const isNullOrEmpty = (obj) => {
  if ((typeof (obj) == "string" && obj == "") || obj == null || obj == undefined) {
    return true;
  } else {
    return false;
  }
}

//权限判断
export const hasPermission = (permission) => {
  if (isNullOrEmpty(window.parent.perms)) {
    return false;
  }
  if (window.parent.perms.indexOf(permission) > -1) {
    return true;
  } else {
    return false;
  }
}

export const dialogOpen = (opt) => {
  var defaults = {
    id: 'layerForm',
    title: '',
    width: '',
    height: '',
    url: null,
    scroll: false,
    data: {},
    btn: ['确定', '取消'],
    success: function () {},
    yes: function () {}
  }
  var option = $.extend({}, defaults, opt),
    content = null;
  if (option.scroll) {
    content = [option.url]
  } else {
    content = [option.url, 'no']
  }
  top.layer.open({
    type: 2,
    id: option.id,
    title: option.title,
    closeBtn: 1,
    anim: 0,
    isOutAnim: true,
    shadeClose: false,
    scrollbar: false,
    shade: 0.3,
    area: [option.width, option.height],
    content: content,
    btn: option.btn,
    success: function (layero, index) {
      option.success(layero);
    },
    yes: function (index, layero) {
      // 找到其中的iframe传出去
      let _iframe = layero[0].getElementsByTagName('iframe')[0].contentWindow
      option.yes(_iframe);
    }
  });
}


export const dialogContent = (opt) => {
  var defaults = {
    title: '系统窗口',
    width: '',
    height: '',
    content: null,
    data: {},
    btn: ['确定', '取消'],
    success: null,
    yes: null
  }
  var option = $.extend({}, defaults, opt);
  return option.window.top.layer.open({
    type: 1,
    title: option.title,
    closeBtn: 1,
    anim: -1,
    isOutAnim: false,
    shadeClose: false,
    shade: 0.3,
    area: [option.width, option.height],
    shift: 5,
    content: option.content,
    btn: option.btn,
    success: option.success,
    yes: option.yes
  });
}

export const dialogMsg = (msg, type) => {
  var msgType = {
    success: 1,
    error: 2,
    warn: 3,
    info: 7
  };
  if (isNullOrEmpty(type)) {
    type = 'info';
  }
  top.layer.msg(msg, {
    icon: msgType[type],
    time: 2000
  });
}

export const checkedRow = (id) => {
  var isOK = true;
  if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
    isOK = false;
    dialogMsg('您没有选中任何数据项！');
  } else if (id.length > 1) {
    isOK = false;
    dialogMsg('您只能选择一条数据项！');
  }
  return isOK;
}

export const checkedArray = function (id) {
  var isOK = true;
  if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
    isOK = false;
    dialogMsg('您没有选中任何数据项！');
  }
  return isOK;
}

export const ConfirmForm = (options) => {
  var defaults = {
    msg: "您确定要保存当前数据项修改操作吗？",
    url: "",
    data: {},
    success: null,
    close: true
  };
  var options = $.extend(defaults, options);
  dialogConfirm(options.msg, () => {
    post(options.url, options.data)
      .then(res => {
        options.success(res)
      })
      .catch(err => {
        options.fail(err)
      })
  });
}
export const dialogLoading = (flag) => {
  if (flag) {
    top.layer.load(0, {
      shade: [0.1, '#fff'],
      time: 2000
    });
  } else {
    top.layer.closeAll('loading');
  }
}

export const dialogConfirm = (content, callBack) => {
  top.layer.confirm(content, {
      area: '338px',
      icon: 7,
      anim: -1,
      isOutAnim: false,
      title: "系统提示",
      btn: ['确认', '取消'],
      btnAlign: 'c'
    },
    (index) => {
      callBack.call(this)
      top.layer.close(index)
    });
}

export const dialogClose = function () {
  var index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
  top.layer.close(index); //再执行关闭 
}

// 成功post后关闭所有弹窗并刷新
export const closeRefresh = function () {
  window.top.frames['main'].vm.load()
  window.top.layer.closeAll('iframe')
}

// 获取layui的iframe中的vm
export const getIframeVue = function (layero) {
  return layero[0].getElementsByTagName('iframe')[0].contentWindow.vm
}

export const countDay = (dayCount) => {
  var dd = new Date();
  dd.setDate(dd.getDate() + dayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  return y + "-" + m + "-" + d;
}

export const today = (dayCount) => {
  var dd = new Date();
  return formatDate(dd, 'yyyy-MM-dd');
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

export const checkedRowGenerator = (id) => {
  var isOK = true;
  if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
    isOK = false;
    dialogMsg('您没有选中任何数据项！');
  }
  return isOK;
}

export const toUrl = (href) => {
  window.location.href = href;
}

// 去抖函数
export function debounce(time, fn) {
  var timer;
  return function () {
    var ctx = this,
      args = arguments;
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(ctx, args)
    }, time)
  }
}

// 日期格式化
export const format = (format, data) => {
  data = new Date(data)
  var o = {
    "M+": data.getMonth() + 1, //month 
    "d+": data.getDate(), //day 
    "h+": data.getHours(), //hour 
    "m+": data.getMinutes(), //minute 
    "s+": data.getSeconds(), //second 
    "q+": Math.floor((data.getMonth() + 3) / 3), //quarter 
    "S": data.getMilliseconds() //millisecond 
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}