import Vue from 'vue'
/**
 * 判断传入参数的类型，以字符串的形式返回
 * @param {Object} obj 要判断的数据
 */
let dataType = obj => {
  if (obj === null) return 'Null'
  if (obj === undefined) return 'Undefined'
  return Object.prototype.toString.call(obj).slice(8, -1)
}

/**
 * 去除空或者null的属性值
 * @param {Object} obj 要处理的对象
 */
let dealObjectValue = obj => {
  var param = {}
  if (obj === null || obj === undefined || obj === '') return param
  for (var key in obj) {
    if (dataType(obj[key]) === 'Object') {
      param[key] = dealObjectValue(obj[key])
    } else if (
      (obj[key] !== null &&
        obj[key] !== undefined &&
        obj[key] !== '' &&
        !Array.isArray(obj[key])) ||
      (Array.isArray(obj[key]) && obj[key].length > 0)
    ) {
      param[key] = obj[key]
    }
    if (typeof param[key] === 'string') {
      param[key] = obj[key].trim()
    }
  }
  return param
}

/**
 *去除空或null或数组为空属性clone
 *
 * @param {*} obj
 * @returns
 */
let deepClone = obj => {
  var param = {}
  if (obj === null || obj === undefined || obj === '') return param
  for (var key in obj) {
    if (dataType(obj[key]) === 'Object') {
      param[key] = deepClone(obj[key])
    } else if (dataType(obj[key] === 'Array')) {
      if (obj[key].length > 0) {
        param[key] = deepClone(obj[key])
      }
    } else if (
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== '' &&
      !Array.isArray(obj[key])
    ) {
      param[key] = obj[key]
    }
    if (typeof param[key] === 'string') {
      param[key] = obj[key].trim()
    }
  }
  return param
}

let mergeId = function (arr1, arr2, id, vm) {
  let obj = vm.obj
  if (vm.objNum === 0) {
    vm.objNum += 1
    arr2.map(item => {
      obj[item[id]] || (obj[item[id]] = item)
    })
  }
  arr1.map(item => {
    let itemId = item[id]
    arr2.map(el => {
      if (el[id] === itemId) {
        if (obj[el[id]]) {
          delete obj[el[id]]
        }
      }
    })
  })
}

/**
 *
 * @param {String} str 清除字符串所有空格和前后逗号
 */

Vue.prototype.$trim = function (str) {
  return str
    .replace(/[\s\r\n]*/g, '')
    .replace(/[,，]*$/g, '')
    .replace(/^[,，]*/g, '')
    .replace(/[,，]{1,}/g, ',')
    .split(',')
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
      cb && cb()
    })
    .catch(() => {})
}

let notify = () => {
  let message = `请到<a href="javascript:void(0);">报告中心</a>下载导出结果`
  return Vue.prototype.$notify({
    title: '导出中...',
    duration: 3000,
    type: 'info',
    dangerouslyUseHTMLString: true,
    message
  })
}

// 提示消息  this.$msg(message)
Vue.prototype.$msg = function (message) {
  this.$vux.toast.text(message, 'top')
}

/**
 * 克隆
 */
Vue.prototype.$clone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  dataType,
  dealObjectValue,
  firstCase,
  showWarning,
  firstLower,
  notify,
  deepClone,
  mergeId
}
