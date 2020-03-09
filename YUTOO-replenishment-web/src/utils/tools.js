import downloadTxt from './download'


// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  function scroll(start, end, step) {
    if (start === end) return

    let d = start + step > end ? end : start + step
    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

export function assert(condition, msg) {
  if (!condition) throw new Error(`[Apior] ${msg}`)
}

/**
 * 下载文件
 * @param {String} url 下载路径
 * @param {Boolean} txt 下载为txt
 *
 */
export const downloadFile = (url, txt, _blank) => {
  if (!txt) {
    var link = document.createElement('a')
    document.body.appendChild(link)
    link.style.display = 'none'
    if (_blank) {
      link.target = '_blank'
    }
    link.href = url
    let exts = url.split('.')
    let ext = '.' + exts[exts.length - 1]
    link.download = '下载' + ext
    link.click()
    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  } else {
    downloadTxt(url, 'info.txt', 'text/plain')
  }
}

// 货币金额数字转中文大写
export const smalltoBIG = n => {
  var fraction = ['角', '分']
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]
  var head = n < 0 ? '欠' : ''
  n = Math.abs(n)

  var s = ''

  for (var i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  // eslint-disable-next-line
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = ''
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
  )
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
export function formatDate(time, cFormat) {
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

/**
 * 下载文件
 * @param {String, data} url 下载路径或二进制流
 * @param {Boolean} txt 下载为txt
 * 
 */
export const downloadFile2 = (url, txt = '下载-' + formatDate(new Date(), '{y}{m}{d}{h}{i}{s}'), _blank) => {
  process.env.NODE_ENV !== 'production' && console.info('下载时如果是二进制文件流，必须在api接口中配置 config.responseType= "blob"');
  var link
  if (typeof url === 'string') {
    // 如果是url
    if (!txt) {
      link = document.createElement("a");
      document.body.appendChild(link)
      link.style.display = 'none'
      if (_blank) {
        link.target = '_blank'
      }
      link.href = url
      let exts = url.split('.')
      let ext = '.' + exts[exts.length - 1]
      link.download = '下载' + ext
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link)
    } else {
      downloadTxt(url, txt, "text/plain")
    }
  } else {
    // 二进制
    // 接口传入
    // config : {responseType: 'blob'}
    // console.log(url);
    url = window.URL.createObjectURL(new Blob([url]));
    link = document.createElement("a");
    document.body.appendChild(link)
    link.style.display = 'none'
    link.href = url;
    // console.log(txt);
    link.setAttribute("download", txt.replace('.xlsx', '') + '.xlsx' || `下载.xlsx`);
    if (navigator.userAgent.indexOf('Firefox/') === -1) {
      link.click();
    } else {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      link.dispatchEvent(evt);
    }

    window.URL.revokeObjectURL(url);
  }
}

/**
 * //去除对象的空字符等
 * @param {obj}
 * @return {}
 */
export const filterObj = obj => {
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    let result = {}
    for (let k in obj) {
      if (
        obj[k] !== '' &&
        obj[k] != undefined &&
        obj[k] != null &&
        obj[k].length != 0
      ) {
        result[k] = obj[k]
      } else {
        continue
      }
    }
    return result
  } else {
    console.error('The incoming value is not an object')
    return {}
  }
}