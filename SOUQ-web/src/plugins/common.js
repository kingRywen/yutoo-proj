import Vue from 'vue'

let MyPlugin = {}
let funs = {}

/**
 * 
 * 处理http响应码
 * 
 */
funs.handlerCode = (res, success, error) => {
  if (res.data.code === 0) {
    Vue.prototype.$message({
      type: 'success',
      message: res.data.msg || '获取数据成功'
    })
    if (success) success()
  } else {
    Vue.prototype.$message({
      type: 'error',
      message: res.data.msg || '服务器请求异常，请联系管理员'
    })
    if (error) error()
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
funs.formatDate = (time, cFormat) => {
  if (!time) {
    return null
  }
  time = new Date(time).getTime()
  if (arguments.length === 0) return null
  if ((time + '').length === 10) {
    time = +time * 1000
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
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
  var timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    var value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

// 第一个字母转大写
funs.firstCase = (str) => {
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

// 第一个字母转小写
funs.firstLower = (str) => {
  return str.substring(0, 1).toLowerCase() + str.substring(1)
}

/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 **/
funs.dataType = (obj) => {
  if (obj === null) return 'Null'
  if (obj === undefined) return 'Undefined'
  return Object.prototype.toString.call(obj).slice(8, -1)
}

// 去除空或者null的属性值
funs.dealObjectValue = (obj) => {
  var param = {}
  if (obj === null || obj === undefined || obj === '') return param
  for (var key in obj) {
    if (funs.dataType(obj[key]) === 'Object') {
      param[key] = funs.dealObjectValue(obj[key])
    } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      param[key] = obj[key]
    }
  }
  return param
}

funs.showError = (res) => {
  Vue.prototype.$message({
    type: 'error',
    message: res.data.msg || '未知异常，请联系管理员'
  })
}

funs.showError = (res) => {
  Vue.prototype.$message({
    type: 'error',
    message: res.data.msg || '未知异常，请联系管理员'
  })
}

// 获取近几天范围
funs.getNumDay = (n) => {
  return [
    funs.formatDate(
      Date.now() - 24 * 3600 * 1000 * (n - 1),
      '{y}-{m}-{d}'
    ),
    funs.formatDate(Date.now(), '{y}-{m}-{d}')
  ]
}

MyPlugin.install = function (Vue, options) {
  Vue.prototype.$ = funs
}

export default MyPlugin
