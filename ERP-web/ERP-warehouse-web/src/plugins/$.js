import Vue from 'vue'
const ReportCenterUrl = '/test-env/erp-warehouse/#/ReportCenter/index'

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

// 去除空或null或数组为空属性clone
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

let mergeId = function(arr1, arr2, id, vm) {
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
    .catch(() => {})
}

let notify = () => {
  let message = `请到<a href=${ReportCenterUrl}>报告中心</a>下载导出结果`
  return Vue.prototype.$notify({
    title: '导出中...',
    duration: 3000,
    type: 'info',
    dangerouslyUseHTMLString: true,
    message
  })
}

// 显示激活状态
let checkFlag = (fn = null) => {
  return (h, scope) => {
    return (
      <i
        style={{
          fontSize: '22px'
        }}
        onClick={fn.bind(this, scope.$index, scope.row)}
        class={
          Number(scope.row.activateFlag) ? 'el-icon-check' : 'el-icon-close'
        }
      />
    )
  }
}

//激活点击切换状态
let renderStatus = (h, scope) => {
  return (
    <i
      style={{
        fontSize: '22px'
      }}
      class={scope.row.activatedFlag ? 'el-icon-check' : 'el-icon-close'}
    />
  )
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

//操作返回结果消息  this.$deleteMsg(data)
Vue.prototype.$deleteMsg = function(data, msg = '成功操作') {
  if (data.code != 200 && data.msg) {
    this.$message.error(data.msg)
  }
  let { successNum, failNum, errMsg } = data
  if (failNum == undefined || successNum == undefined || errMsg == undefined) {
    return
  }

  this.$message({
    dangerouslyUseHTMLString: true,
    type: 'warning',
    message: `<strong>${msg}${successNum}数据</strong>，<strong>失败${failNum}数据</strong><br/><strong  style="overflow-y: auto;display: inline-block;max-height: 100px;">${errMsg}</strong>`
  })
}

Object.formRule = function(cb) {
  if (dataType(cb) != 'Function' && dataType(cb) == 'String') {
    return [
      {
        required: true,
        message: cb
      }
    ]
  }
  return [
    {
      required: true,
      validator: cb
    }
  ]
}

/**
 * 克隆
 */
Vue.prototype.$clone = function(obj) {
  return JSON.parse(JSON.stringify(obj))
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
    item.must = item.must == false ? item.must : true
    let trigger = item.select == 'undefined' ? 'blur' : 'change'
    if (!item.required) {
      continue
    }
    obj[item.value] = [
      {
        required: item.must,
        trigger,
        validator: (rule, value, callback) => {
          let str = ''
          str += `if(value=='' || value == undefined || value == null) {
              value !=0 && callback(new Error('${item.label}不能为空'))
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
            } else {
              // 特殊字符验证
              str += `else if (specialExp(value,'special')) {
                  callback(new Error('${item.label}不能为特殊字符'))
              }`
            }
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
  }
}

export default {
  dataType,
  dealObjectValue,
  firstCase,
  showWarning,
  renderStatus,
  firstLower,
  checkFlag,
  notify,
  deepClone,
  mergeId,
  specialExp
}
