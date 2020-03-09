import Vue from 'vue';
let funs = {}

/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 **/
funs.dataType = (obj) => {
  if (obj === null) return 'Null'
  if (obj === undefined) return 'Undefined'
  return Object.prototype.toString.call(obj).slice(8, -1)
}


/**
 * 去除空或者null的属性值
 * @param {Object} obj 要处理的对象
 * @param {Array} AllowNull 允许为空或者ｎｕｌｌ的属性
 */
funs.dealObjectValue = (obj, AllowNull) => {
  // console.log(AllowNull);
  var param = {}
  if (obj === null || obj === undefined || obj === '') return param
  for (var key in obj) {
    if (funs.dataType(obj[key]) === 'Object') {
      param[key] = funs.dealObjectValue(obj[key])
    } else if ((obj[key] !== null && obj[key] !== undefined && obj[key] !== '' && !Array.isArray(obj[key])) || (Array.isArray(obj[key]) && obj[key].length > 0)) {
      param[key] = obj[key]
    }
    if (AllowNull) {
      AllowNull.map(key => {
        param[key] = obj[key] != null ? obj[key] : ''
      })
    }
    if (param[key] && typeof param[key] === 'string') {
      param[key] = obj[key].trim()
    }
  }
  return param
}

/**
 * 获取多行输入的asin
 * @param {String} asins 要处理的asin
 */
funs.getAsins = (asins) => {
  return asins
    .split(/[\n|\r\n|,|，]/)
    .map(el => el.trim())
    .filter(el => el !== '')
}

// 显示警告弹窗
funs.showWarning = (content, cb) => {
  return Vue.prototype.$confirm(content, '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cb()
  }).catch((err) => {
    if (err instanceof Error) {
      console.error(err);
    }
  });
}

/**
 * 获取范围日期内的所有日期数据
 * @param {Array} timeRange 需要处理的日期范围
 * @return {Array}          返回处理后的日期数据
 */
funs.getTimeRanges = (timeRange) => {
  let timeArr = [], currentTime = timeRange[0]
  while (new Date(currentTime) <= new Date(timeRange[1])) {
    timeArr.push(funs.formatDate(currentTime, '{y}-{m}-{d}'))
    currentTime = new Date(currentTime).getTime() + 24 * 3600 * 1000
  }
  return timeArr
}

/**
 * 格式化时间
 * 
 * @param  {time}        时间
 * @param  {cFormat}     格式
 * @return {String}      字符串
 *
 * @example              formatDate('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
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
export default funs