import Vue from 'vue'
import { loginRedirect } from 'Config'
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
 *
 * @param {String} url      要跳转的url
 * @param {String} target   跳转方式
 */
const toUrl = (url, target = '_blank') => {
  console.log(loginRedirect + url)
  window.open(loginRedirect + url, target)
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

// 第一个字母转大写
let firstCase = str => {
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}

// 第一个字母转小写
let firstLower = str => {
  return str.substring(0, 1).toLowerCase() + str.substring(1)
}

Vue.prototype.$clone = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}

//编辑判断提示消息  this.$editMsg(arr)
Vue.prototype.$editMsg = function(arr, list = true) {
  if (Object.prototype.toString.call(arr) == '[object Array]') {
    if (!arr.length) {
      this.$message.error('请选择要操作的数据')
      return true
    } else if (list && arr.length > 1) {
      this.$message.error('请选择一条操作数据')
      return true
    }
  }
}

/**
 * options = [{
   value: 'transportTypeName',
   label: '运输方式',
   maxLen: 40, //最大字符串长度, 默认为100字符
   type: 'number', //qq, phone, user, url, email, number 或者['number',1] 0整数，1位小数，2,两位小数 默认为2位小数，discount折扣数（0.2,0.33）
   opt: [{
     condition: '!value',
     msg: '这个不能为空'
   }]
 }]
 */
Vue.prototype.$formValidate = options => {
  let obj = {}
  for (let index = 0; index < options.length; index++) {
    const item = options[index]
    item.maxLen = item.maxLen ? item.maxLen : 100 //默认字符长度为100
    item.label = item.label ? item.label : ''
    item.required = item.required == false ? item.required : true
    let trigger = item.select == 'undefined' ? 'blur' : 'change'
    obj[item.value] = [
      {
        required: item.required,
        trigger,
        validator: (rule, value, callback) => {
          let str = ''
          str += `if(!value && (value !=0)) {
              callback(new Error('${item.label}不能为空'))
            }`
          if (dataType(item.opt) === 'Array' && item.opt.length) {
            // 是否存在opt
            for (let index = 0, len = item.opt.length; index < len; index++) {
              const el = item.opt[index]
              str += `else if (${el.condition}) {
                callback(new Error('${el.msg}'))
              }`
            }
          }
          if (dataType(value) == 'Array') {
            // 值为数组
            if (!value.length) {
              str += `else if (true) {
                callback(new Error('${item.label}不能为空'))
              }`
            }
          } else {
            if (item.type && item.type == 'email') {
              // email 验证
              str += `else if (!specialExp(value,'email')) {
                  callback(new Error('输入的邮箱格式不正确'))
                }`
            } else if (item.type && item.type == 'phone') {
              // phone 验证
              str += `else if (!specialExp(value,'phone')) {
                  callback(new Error('输入的电话号码格式有误'))
                }`
            } else if (item.type && item.type == 'qq') {
              // qq 验证
              str += `else if (!specialExp(value,'qq')) {
                  callback(new Error('输入的qq号码格式有误'))
                }`
            } else if (item.type && item.type == 'url') {
              // url 验证
              str += `else if (!specialExp(value,'url')) {
                  callback(new Error('输入的url格式有误'))
                }`
            } else if (item.type && item.type == 'password') {
              // password 验证
              str += `else if (!specialExp(value,'password')) {
                  callback(new Error('输入的密码格式有误'))
                }`
            } else if (item.type && item.type == 'user') {
              // user 验证
              str += `else if (!specialExp(value,'user')) {
                  callback(new Error('输入的用户名格式有误'))
                }`
            } else if (item.type == 'discount') {
              str += `else if (!specialExp(value,'discount')) {
                      callback(new Error('${item.label}必须为1或者1-2位小数'))
                    }`
            } else if (
              item.type &&
              (item.type == 'number' || dataType(item.type) == 'Array')
            ) {
              // 数字验证
              if (
                dataType(item.type) == 'Array' &&
                item.type[1] == 'undefined'
              ) {
                item.type[1] == 2
              }
              if (dataType(item.type) == 'Array') {
                if (item.type[1]) {
                  str += `else if (!specialExp(value,'number',${
                    item.type[1]
                  })) {
                      callback(new Error('${item.label}必须为${
                    item.type[1]
                  }有效小数'))
                    }`
                } else {
                  str += `else if (!specialExp(value,'number',${
                    item.type[1]
                  })) {
                      callback(new Error('${item.label}必须为有效整数'))
                    }`
                }
              } else {
                str += `else if (!specialExp(value,'number',2)) {
                    callback(new Error('${item.label}必须为有效2位小数数字'))
                  }`
              }
            }
            //  else {
            //   // 特殊字符验证
            //   str += `else if (specialExp(value,'special')) {
            //       callback(new Error('${item.label}不能为特殊字符'))
            //   }`
            // }
          }

          str += `else if (value.length > ${item.maxLen}) {
                  callback(new Error('${item.label}字符不能超过${item.maxLen}'))
                }else {
                  callback()
                }` // 字符长度验证
          new Function(`value`, 'callback', 'specialExp', str)(
            value,
            callback,
            specialExp
          )
        }
      }
    ]
  }
  return obj
}

function specialExp(val, type, numType) {
  if (type && type == 'special') {
    // 特殊字符类型
    // eslint-disable-next-line
    return /[~@#$%^&*()_\+=<>:{}|/\\[\]~#￥%&*（）——\+={}|《》：【】]/im.test(
      val
    ) //特殊字符验证
  } else if (type == 'email') {
    // email 类型
    // eslint-disable-next-line
    return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
      val
    ) //邮箱验证
  } else if (type == 'number') {
    // 数字类型
    if (numType == '0') {
      console.log(val)
      return /^(0|[1-9]\d*)$/.test(Number(val)) //整数或者0
    } else {
      // eslint-disable-next-line\
      return new RegExp(
        `^(([1-9]{1}\\d*)|0)(\\.\\d{1,${Number(numType)}})?$`
      ).test(Number(val)) //正数并且限制2位以内的小数
    }
  } else if (type == 'discount') {
    // 折扣
    return /(^0\.[1-9]{1,2}$)|(^0\.[0-9]{1}[1-9]{1}$)|(^1{1}$)|(^1{1}\.0{2}$)|(^1{1}\.0{1}$)/.test(
      val
    )
  } else if (type == 'phone') {
    // 手机号类型
    return Object.values(GLOBAL.$const['OTHER/phoneExp']).some(item =>
      item.test(val)
    )
    // return /^1[34578]\d{9}$/.test(val)
  } else if (type == 'qq') {
    // qq类型
    // eslint-disable-next-line
    return /^[1-9][0-9]{4,10}$/.test(val)
  } else if (type == 'url') {
    // eslint-disable-next-line
    return /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/.test(
      val
    )
  } else if (type == 'user') {
    return /^[a-zA-Z0-9_\-\u4E00-\u9FA5]{4,16}$/.test(val)
  } else if (type == 'password') {
    return /^[^\u4e00-\u9fa5]{0,}$/.test(val)
  }
}

export default {
  dataType,
  dealObjectValue,
  firstCase,
  firstLower,
  toUrl
}
