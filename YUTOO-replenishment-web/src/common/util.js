var matchHtmlRegExp = /["'&<>]/;

/**
 * 
 * type 类型判断
 * 
 */

export const isString = (o) => { //是否字符串
  return Object.prototype.toString.call(o).slice(8, -1) === 'String'
}

export const isNumber = (o) => { //是否数字
  return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
}

export const isObj = (o) => { //是否对象
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
}

export const isArray = (o) => { //是否数组
  return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
}

export const isDate = (o) => { //是否时间
  return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
}

export const isBoolean = (o) => { //是否boolean
  return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
}

export const isFunction = (o) => { //是否函数
  return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
}

export const isNull = (o) => { //是否为null
  return Object.prototype.toString.call(o).slice(8, -1) === 'Null'
}

export const isUndefined = (o) => { //是否undefined
  return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
}

export const isFalse = (o) => {
  if (!o || o === 'null' || o === 'undefined' || o === 'false' || o === 'NaN') return true
  return false
}

export const isTrue = (o) => {
  return !this.isFalse(o)
}

export const isIos = () => {
  var u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { //安卓手机
    // return "Android";
    return false
  } else if (u.indexOf('iPhone') > -1) { //苹果手机
    // return "iPhone";
    return true
  } else if (u.indexOf('iPad') > -1) { //iPad
    // return "iPad";
    return false
  } else if (u.indexOf('Windows Phone') > -1) { //winphone手机
    // return "Windows Phone";
    return false
  } else {
    return false
  }
}

export const isPC = () => { //是否为PC端
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

export const isURL = (str_url) => { // 验证url
  var strRegex = "^((https|http|ftp|rtsp|mms)?://)" +
    "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@  
    +
    "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
    +
    "|" // 允许IP和DOMAIN（域名）  
    +
    "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
    +
    "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
    +
    "[a-z]{2,6})" // first level domain- .com or .museum  
    +
    "(:[0-9]{1,4})?" // 端口- :80  
    +
    "((/?)|" // a slash isn't required if there is no file name  
    +
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  var re = new RegExp(strRegex);
  return re.test(str_url);
}

export const browserType = () => {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
  var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
  var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
  var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) return "IE7"
    else if (fIEVersion == 8) return "IE8";
    else if (fIEVersion == 9) return "IE9";
    else if (fIEVersion == 10) return "IE10";
    else if (fIEVersion == 11) return "IE11";
    else return "IE7以下" //IE版本过低
  }
  if (isFF) return "FF";
  if (isOpera) return "Opera";
  if (isEdge) return "Edge";
  if (isSafari) return "Safari";
  if (isChrome) return "Chrome";
}

export const checkStr = (str, type) => {
  switch (type) {
    case 'phone': //手机号码
      return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
    case 'tel': //座机
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
    case 'card': //身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
    case 'pwd': //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
      return /^[a-zA-Z]\w{5,17}$/.test(str)
    case 'postal': //邮政编码
      return /[1-9]\d{5}(?!\d)/.test(str);
    case 'QQ': //QQ号
      return /^[1-9][0-9]{4,9}$/.test(str);
    case 'email': //邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    case 'money': //金额(小数点2位)
      return /^\d*(?:\.\d{0,2})?$/.test(str);
    case 'URL': //网址
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&:/~\\+#]*[\w\-\\@?^=%&/~\\+#])?/.test(str)
    case 'IP': //IP
      return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
    case 'date': //日期时间
      return /^(\d{4})\\-(\d{2})\\-(\d{2}) (\d{2})(?:\\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\\-(\d{2})\\-(\d{2})$/.test(str)
    case 'number': //数字
      return /^[0-9]$/.test(str);
    case 'english': //英文
      return /^[a-zA-Z]+$/.test(str);
    case 'chinese': //中文
      return /^[\u4E00-\u9FA5]+$/.test(str);
    case 'lower': //小写
      return /^[a-z]+$/.test(str);
    case 'upper': //大写
      return /^[A-Z]+$/.test(str);
    case 'HTML': //HTML标记
      return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
    case 'inter': //正整数
      return /^[0-9]*[1-9][0-9]*$/.test(str);
    default:
      return true;
  }
}

/**
 * 格式化时间
 * 
 * @param  {time}        时间
 * @param  {cFormat}     格式
 * @return {String}      字符串
 *
 * @example              formatTime('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
 */
export const formatTime = (time, cFormat) => {

  if (!time) {
    return null
  }
  time = new Date(time).getTime()
  if (arguments.length === 0) return null
  if ((time + '').length === 10) {
    time = +time * 1000
  }
  var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}',
    date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(time)
  }
  var formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    var value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 获取url参数
 * @param {String} name   要获取的参数字段
 * @example               getQueryString('id') // ?id=12& -> 12
 */
export const getQueryString = (name, p, str) => {

  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = decodeURIComponent(window.location.search.substr(1)).match(reg);
  if (p) {
    r = decodeURIComponent(parent.location.search.substr(1)).match(reg);
  }
  try {
    if (r != null) return JSON.parse(r[2]);
  } catch (error) {
    if (str) {
      return r[2]
    }

  }
  return null;
}


/**
 * 去抖函数 ，返回的是一个新的函数
 * @param {Number} time   去抖时间间隔
 * @param {Function} fn   需要去抖的函数
 */
export const debounce = (time, fn) => {
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

/**
 * 
 * @desc   判断`obj`是否为空
 * @param  {Object} obj
 * @return {Boolean}
 */
export const isEmptyObject = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj))
    return false
  return !Object.keys(obj).length
}

/**
 * @desc   函数节流。
 * 适用于限制`resize`和`scroll`等函数的调用频率
 *
 * @param  {Number}    delay          0 或者更大的毫秒数。 对于事件回调，大约100或250毫秒（或更高）的延迟是最有用的。
 * @param  {Boolean}   noTrailing     可选，默认为false。
 *                                    如果noTrailing为true，当节流函数被调用，每过`delay`毫秒`callback`也将执行一次。
 *                                    如果noTrailing为false或者未传入，`callback`将在最后一次调用节流函数后再执行一次.
 *                                    （延迟`delay`毫秒之后，节流函数没有被调用,内部计数器会复位）
 * @param  {Function}  callback       延迟毫秒后执行的函数。`this`上下文和所有参数都是按原样传递的，
 *                                    执行去节流功能时，调用`callback`。
 * @param  {Boolean}   debounceMode   如果`debounceMode`为true，`clear`在`delay`ms后执行。
 *                                    如果debounceMode是false，`callback`在`delay` ms之后执行。
 *
 * @return {Function}  新的节流函数
 */
export const throttle = (delay, noTrailing, callback, debounceMode) => {

  var timeoutID;
  var lastExec = 0;

  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }

  function wrapper() {

    var self = this;
    var elapsed = Number(new Date()) - lastExec;
    var args = arguments;

    function exec() {
      lastExec = Number(new Date());
      callback.apply(self, args);
    }

    function clear() {
      timeoutID = undefined;
    }

    if (debounceMode && !timeoutID) {
      exec();
    }

    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    if (debounceMode === undefined && elapsed > delay) {
      exec();

    } else if (noTrailing !== true) {
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }

  }

  return wrapper;

};


/**
 * 
 * @desc 根据name读取cookie
 * @param  {String} name 
 * @return {String}
 */
export const getCookie = (name) => {
  var arr = document.cookie.replace(/\s/g, "").split(';');
  for (var i = 0; i < arr.length; i++) {
    var tempArr = arr[i].split('=');
    if (tempArr[0] == name) {
      return decodeURIComponent(tempArr[1]);
    }
  }
  return '';
}

/**
 * 
 * @desc  设置Cookie
 * @param {String} name 
 * @param {String} value 
 * @param {Number} days 
 */
export const setCookie = (name, value, days) => {
  var date = new Date();
  date.setDate(date.getDate() + days);
  document.cookie = name + '=' + value + ';expires=' + date;
}

/**
 * 
 * @desc 根据name删除cookie
 * @param  {String} name 
 */
export const removeCookie = (name) => {
  // 设置已过期，系统会立刻删除cookie
  setCookie(name, '1', -1);
}

/**
 * 判断当前是否处在iframe中
 * @method isIframe
 * @return {Boolean}
 */
export const isIframe = () => {
  return top.location != self.location;
}

/**
 * 
 * @desc 修正小数位
 * @param  {Number} num         要修正的小数
 * @param  {Number} fixNum      保留几位小数
 * @param  {Boolean} type       false为四舍五入，true为抹去小数
 */
export const fixNumber = (num, fixNum, type) => {
  let n = parseFloat(num)
  if (isNaN(n)) {
    return null;
  } else {
    if (type) {
      return Math.floor(n * Math.pow(10, fixNum)) / Math.pow(10, fixNum)
    }
    return Math.round(n * Math.pow(10, fixNum)) / Math.pow(10, fixNum)
  }
}


/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如‘1,234,567.45‘
 * @type String
 */
export const formatCurrency = (num) => {
  num = num.toString().replace(/\$|\\,/g, '');
  if (isNaN(num))
    num = "0";
  let sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  let cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10)
    cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num = num.substring(0, num.length - (4 * i + 3)) + ', ' +
    num.substring(num.length - (4 * i + 3));
  return (((sign) ? '' : '-') + num + '.' + cents);
}


// 执行组合排列的函数
export const doExchange = (arr) => {
  var len = arr.length;
  // 当数组大于等于2个的时候
  if (len >= 2) {
    // 第一个数组的长度
    var len1 = arr[0].length;
    // 第二个数组的长度
    var len2 = arr[1].length;
    // 2个数组产生的组合数
    var lenBoth = len1 * len2;
    //  申明一个新数组
    var items = new Array(lenBoth);
    // 申明新数组的索引
    var index = 0;
    for (var i = 0; i < len1; i++) {
      for (var j = 0; j < len2; j++) {
        if (arr[0][i] instanceof Array) {
          items[index] = arr[0][i].concat(arr[1][j]);
        } else {
          items[index] = [arr[0][i]].concat(arr[1][j]);
        }
        index++;
      }
    }
    var newArr = new Array(len - 1);
    for (var i = 2; i < arr.length; i++) {
      newArr[i - 1] = arr[i];
    }
    newArr[0] = items;
    return doExchange(newArr);
  } else {
    return arr[0];
  }
}

// 执行组合排列的函数
export const doExchange1 = (arr) => {
  var len = arr.length;
  // 当数组大于等于2个的时候
  if (len >= 2) {
    // 第一个数组的长度
    var len1 = arr[0].length;
    // 第二个数组的长度
    var len2 = arr[1].length;
    // 2个数组产生的组合数
    var lenBoth = len1 * len2;
    //  申明一个新数组
    var items = new Array(lenBoth);
    // 申明新数组的索引
    var index = 0;
    for (var i = 0; i < len1; i++) {
      for (var j = 0; j < len2; j++) {
        if (arr[0][i] instanceof Array) {
          items[index] = arr[0][i].concat(arr[1][j]);
        } else {
          items[index] = [arr[0][i]].concat(arr[1][j]);
        }
        index++;
      }
    }
    var newArr = new Array(len - 1);
    for (var i = 2; i < arr.length; i++) {
      newArr[i - 1] = arr[i];
    }
    newArr[0] = items;
    return doExchange(newArr);
  } else {
    let ret = []
    arr[0].forEach(el => {
      ret.push([el])
    })
    return ret;
  }
}


export const HTMLEncode = (html) => {
  var temp = document.createElement("div");
  (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
  var output = temp.innerHTML;
  temp = null;
  return output;
}

export const HTMLDecode = (text) => {
  var temp = document.createElement("div");
  temp.innerHTML = text;
  var output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}