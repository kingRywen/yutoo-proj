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
 */
funs.dealObjectValue = (obj) => {
  var param = {}
  if (obj === null || obj === undefined || obj === '') return param
  for (var key in obj) {
    if (funs.dataType(obj[key]) === 'Object') {
      param[key] = funs.dealObjectValue(obj[key])
    } else if ((obj[key] !== null && obj[key] !== undefined && obj[key] !== '' && !Array.isArray(obj[key])) || (Array.isArray(obj[key]) && obj[key].length > 0)) {
      param[key] = obj[key]
    }
    if (typeof param[key] === 'string') {
      param[key] = obj[key].trim()
    }
  }
  return param
}

export default funs