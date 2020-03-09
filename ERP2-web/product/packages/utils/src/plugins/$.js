import {
  scrollTop,
  assert,
  downloadFile,
  smalltoBIG
} from '../utils/tools';
import Oss from './oss';
import Vue from 'vue';
const { ossUpload } = Oss

/**
 * 深拷贝
 * 会缓存所有的对象，以免无限递归引用
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 **/
let dataType = obj => {
  if (obj === null) return 'Null'
  if (obj === undefined) return 'Undefined'
  return Object.prototype.toString.call(obj).slice(8, -1)
}

/**
 * 去除空或者null的属性值
 * @param {Object} obj 要处理的对象
 * @param {Array} AllowNull 允许为空或者ｎｕｌｌ的属性
 */
export const dealObjectValue = (obj, AllowNull) => {
  // console.log(AllowNull);
  if (Array.isArray(obj)) {
    return obj
  }
  var param = {}
  if (obj === null || obj === undefined || obj === '') return param
  for (var key in obj) {
    if (dataType(obj[key]) === 'Object') {
      param[key] = dealObjectValue(obj[key])
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


// 第一个字母转大写
let firstCase = str => {
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

// 第一个字母转小写
let firstLower = str => {
  return str.substring(0, 1).toLowerCase() + str.substring(1)
}

// 显示警告弹窗
let showWarning = (content, cb) => {
  return Vue.prototype
    .$confirm(content, '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      cb()
    })
    .catch(() => { })
}


export default {
  dataType,
  dealObjectValue,
  firstCase,
  showWarning,
  firstLower,
  deepCopy,
  scrollTop,
  assert,
  downloadFile,
  smalltoBIG,
  ossUpload
}
