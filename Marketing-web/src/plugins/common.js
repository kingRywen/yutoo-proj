import Vue from 'vue'
import XLSX from 'xlsx'
import commonDialog from '@/components/common/commonDialog.vue'
import NonePage from '@/components/common/NonePage'
import point from '@/components/common/point'
import ECharts from 'vue-echarts/components/ECharts'
let MyPlugin = {}
let funs = {}
const storageName = 'market_'

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
 * 获取前后几天时间
 * @param {Number} n 如果不传参数 | false | 0 则获取当前时间
 * @param {Boolean} type 如果不传参数获取前几天，传获取后几天
 * @return {Array} 数组区间
 */
funs.getRangeDay = (n, type) => {
  if (!n) {
    return [funs.formatTime(Date.now()), funs.formatTime(Date.now())]
  }

  if (!type) {
    return [funs.formatTime(Date.now() - 24 * 3600 * (n - 1) * 1000), funs.formatTime(Date.now())]
  } else {
    return [funs.formatTime(Date.now()), funs.formatTime(Date.now() + 24 * 3600 * n * 1000)]
  }
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

/**
 *  处理响应消息
 * @param {Object} res 响应对象
 * @param {Boolean} show 是否显示成功信息
 */
funs.handlerCode = (res, cb, show) => {
  if (res.data.code === 500) {
    Vue.prototype.$message({
      type: 'error',
      message: res.data.msg
    })
  } else if (show) {
    Vue.prototype.$message({
      type: 'success',
      message: res.data.msg
    })
    if (cb) {
      cb()
    }
  } else {
    if (cb) {
      cb()
    }
  }
}

funs.getStorage = (name) => {
  const obj = sessionStorage.getItem(storageName + name)
  if (!obj) {
    return {}
  }
  return JSON.parse(sessionStorage.getItem(storageName + name))
}

funs.setStorage = (name, val) => {
  sessionStorage.setItem(storageName + name, val)
  // return JSON.parse(sessionStorage.getItem(storageName + name))
}

// 错误信息
funs.showError = (res) => {
  Vue.prototype.$message({
    type: 'error',
    message: res && res.data && res.data.msg ? res.data.msg : '未知异常，请联系管理员'
  })
}

// 处理多行输入
funs.getMultiWords = (str) => {
  return str
    .split(/[\n|\r\n|\,|\，]/g)
    .filter(el => {
      if (el.trim() !== '') {
        return el
      }
    })
    .map(el => el.trim())
}

funs.isTrueUserAgent = () => {
  var Sys = {}
  var ua = navigator.userAgent.toLowerCase()
  console.log(ua)
  if (window.ActiveXObject) {
    Sys.ie = ua.match(/msie ([\d.]+)/)[1]
  } else if (document.getBoxObjectFor) {
    Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1]
  } else if (window.MessageEvent && !document.getBoxObjectFor) {
    Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1]
  } else if (window.opera) {
    Sys.opera = ua.match(/opera.([\d.]+)/)[1]
  } else if (window.openDatabase) {
    Sys.safari = ua.match(/version\/([\d.]+)/)[1]
  }
  console.log(Sys)
  return Sys
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
funs.formatTime = (time, cFormat) => {
  if (!time) {
    return null
  }
  time = new Date(time).getTime()
  if (arguments.length === 0) return null
  if ((time + '').length === 10) {
    time = +time * 1000
  }
  let format = cFormat || '{y}-{m}-{d}'
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

// 验证sku
funs.checkSkus = (changePlatformd) => (rule, value, callback) => {
  if (!value) {
    callback(new Error('输入不能为空'))
  } else {
    let val = value
      .split(/[\n|\r\n|\,|\，]/)
      .map(el => el.trim())
      .filter(el => el !== '')
    let _str = '产品ID'
    let platformId = sessionStorage.getItem('platformId').split(',')[0]
    if (platformId == 1) {
      _str = 'ASIN'
    }
    console.log(platformId)

    let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi
    let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi
    let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/
    let str = `${_str}须为10位数，纯数字或大写字母和数字的组合`
    if (changePlatformd === 2) {
      reg = /^[0-9]{12,12}$/
      str = '请输入12位纯数字'
    } else if (changePlatformd === 3) {
      reg = /^(?!_)(?!.*?_$)[0-9_]+$/
      str = '请输入纯数字，允许下划线'
    } else if (changePlatformd === 4) {
      reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]{24}$/
      str = '长度24位，须小写字母与纯数字的组合'
    } else if (changePlatformd === 5) {
      reg = /^[0-9]*$/
      str = '请输入纯数字'
    }
    if (!val.every(el => reg.test(el))) {
      callback(new Error(str))
    } else if (
      val.some(el => regEn.test(el)) ||
      val.some(el => regCn.test(el))
    ) {
      callback(new Error('不能包含特殊字符'))
    } else if (val.length > 500) {
      callback(new Error('输入数量不能超过500个'))
    } else {
      callback()
    }
  }
}

funs.findGroupIdsByName = (name, ids, arr) => {
  let el = JSON.parse(JSON.stringify(arr))
  // 不是全部的时候，forEach找最后一个
  if (ids && ids[0] !== 0) {
    ids.forEach(id => {
      el = el.find(el => el.groupId === id).groupingVOS
    })
  }
  // 最后一项找对应的id
  const lastId = el.find(el => el.groupName === name).groupId
  return lastId
}

funs.getRule = (msg) => {
  return [{
    required: true,
    message: msg,
    trigger: ['blur', 'change']
  }]
}

funs.saveAs = (obj, fileName) => {
  // 当然可以自定义简单的下载文件实现方式
  var tmpa = document.createElement('a')
  tmpa.download = fileName || '下载'
  tmpa.href = URL.createObjectURL(obj) // 绑定a标签
  tmpa.click() // 模拟点击实现下载
  setTimeout(function () {
    // 延时释放
    URL.revokeObjectURL(obj) // 用URL.revokeObjectURL()来释放这个object URL
  }, 100)
}

const wopts = {
  bookType: 'xlsx',
  bookSST: false,
  type: 'binary'
} // 这里的数据是用来定义导出的格式类型
// const wopts = { bookType: 'csv', bookSST: false, type: 'binary' };//ods格式
// const wopts = { bookType: 'ods', bookSST: false, type: 'binary' };//ods格式
// const wopts = { bookType: 'xlsb', bookSST: false, type: 'binary' };//xlsb格式
// const wopts = { bookType: 'fods', bookSST: false, type: 'binary' };//fods格式
// const wopts = { bookType: 'biff2', bookSST: false, type: 'binary' };//xls格式

funs.s2ab = (s) => {
  if (typeof ArrayBuffer !== 'undefined') {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  } else {
    var buf = new Array(s.length)
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff
    return buf
  }
}

funs.downloadExl = (data, name, type) => {
  try {
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {},
      Props: {}
    }
    wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data) // 通过json_to_sheet转成单页(Sheet)数据
    funs.saveAs(
      new Blob([funs.s2ab(XLSX.write(wb, wopts))], {
        type: 'application/octet-stream'
      }),
      name + '_' +
      funs.formatTime(Date.now(), '{y}{m}{d}{h}{i}{s}') +
      '.' +
      (wopts.bookType === 'biff2' ? 'xls' : wopts.bookType)
    )
  } catch (err) {
    console.log(err);
  }
}
funs.downloadExlShop = (json, type, name) => {
  var tmpDown //导出的二进制对象
  function s2ab(s) {
    // 字符串转字符流
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }
  // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
  function getCharCol(n) {
    let temCol = '',
      s = '',
      m = 0
    while (n > 0) {
      m = n % 26 + 1
      s = String.fromCharCode(m + 64) + s
      n = (n - m) / 26
    }
    return s
  }
  var tmpdata = json[0]
  json.unshift({})
  var keyMap = [] //获取keys
  keyMap = Object.keys(json[0])
  for (var k in tmpdata) {
    keyMap.push(k)
    json[0][k] = k
  }
  var tmpdata = [] //用来保存转换好的json
  json
    .map((v, i) =>
      keyMap.map((k, j) =>
        Object.assign({}, {
          v: v[k],
          position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) +
            (i + 1)
        })
      )
    )
    .reduce((prev, next) => prev.concat(next))
    .forEach(
      (v, i) =>
        (tmpdata[v.position] = {
          v: v.v
        })
    )
  var outputPos = Object.keys(tmpdata) //设置区域,比如表格从A1到D10
  var tmpWB = {
    SheetNames: [name], // 保存的表标题
    Sheets: {
      key: Object.assign({},
        tmpdata, // 内容
        {
          '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
        }
      )
    }
  }
  // 替换key值
  var key = name
  tmpWB.Sheets = {
    key: Object.assign({},
      tmpdata, // 内容
      {
        '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
      }
    )
  }
  // 复制原来的值
  tmpWB.Sheets[key] = tmpWB.Sheets['key']
  // 删除原来的键
  delete tmpWB.Sheets['key']
  // 替换key值end
  tmpDown = new Blob(
    [
      s2ab(
        XLSX.write(
          tmpWB, {
            bookType: type == undefined ? 'xlsx' : type,
            bookSST: false,
            type: 'binary'
          } // 这里的数据是用来定义导出的格式类型
        )
      )
    ], {
      type: ''
    }
  ) //创建二进制对象写入转换好的字节流
  var href = URL.createObjectURL(tmpDown) //创建对象超链接
  document.getElementById('shop_hf').href = href //绑定a标签
  document.getElementById('shop_hf').click() //模拟点击实现下载
  setTimeout(function () {
    // 延时释放
    URL.revokeObjectURL(tmpDown) //用URL.revokeObjectURL()来释放这个object URL
  }, 100)
}
MyPlugin.install = function (Vue, options) {
  Vue.prototype.$ = funs
  Vue.component('commonDialog', commonDialog)
  Vue.component('none-page', NonePage)
  Vue.component('el-point', point)
  Vue.component('echart', ECharts)
}

export default MyPlugin
