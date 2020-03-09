/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 **/
let dataType = (obj) => {
  if (obj === null) return 'Null'
  if (obj === undefined) return 'Undefined'
  return Object.prototype.toString.call(obj).slice(8, -1)
}


/**
 * 去除空或者null的属性值
 * @param {Object} obj 要处理的对象
 */
let dealObjectValue = (obj) => {
  var param = {}
  if (obj === null || obj === undefined || obj === '') return param
  for (var key in obj) {
    if (dataType(obj[key]) === 'Object') {
      param[key] = dealObjectValue(obj[key])
    } else if ((obj[key] !== null && obj[key] !== undefined && obj[key] !== '' && !Array.isArray(obj[key])) || (Array.isArray(obj[key]) && obj[key].length > 0)) {
      param[key] = obj[key]
    }
    if (typeof param[key] === 'string') {
      param[key] = obj[key].trim()
    }
  }
  return param
}

// 第一个字母转大写
let firstCase = (str) => {
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

// 第一个字母转小写
let firstLower = (str) => {
  return str.substring(0, 1).toLowerCase() + str.substring(1)
}



export default {
  dataType,
  dealObjectValue,
  firstCase,
  firstLower
}