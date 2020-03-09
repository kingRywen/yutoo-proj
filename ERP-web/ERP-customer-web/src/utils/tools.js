import downloadTxt from './download'
export function getNumb() {
  var num = new Array()
  for (var i = 0; i < 10; i++) {
    var val = Math.ceil(Math.random() * 30)
    var isEqu = false
    for (var idx in num) {
      if (num[idx] == val) {
        isEqu = true
        break
      }
    }
    if (isEqu) i--
    else num[num.length] = val
  }
  return num
}

// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
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

export const isEqual = (...args) => {
  if (args.length < 2) return false
  for (let i in args) {
    i = +i
    if (args[i + 1] !== undefined) {
      if (isArray(args[i])) {
        if (!compareArrays(args[i], args[i + 1])) {
          return false
        }
      } else if (isObject(args[i])) {
        if (!compareObjects(args[i], args[i + 1])) {
          return false
        }
      } else if (isDate(args[i])) {
        if (!compareDates(args[i], args[i + 1])) {
          return false
        }
      } else {
        if (args[i] !== args[i + 1]) {
          return false
        }
      }
    }
  }

  return true
}

function compare(obj, obj1) {
  for (let i in obj) {
    if (obj1[i] === undefined) {
      return false
    }
    if (isArray(obj[i])) {
      if (!compareArrays(obj[i], obj1[i])) {
        return false
      }
    } else if (isObject(obj[i])) {
      if (!compareObjects(obj[i], obj1[i])) {
        return false
      }
    } else if (isDate(obj[i])) {
      if (!compareDates(obj[i], obj1[i])) {
        return false
      }
    } else {
      if (obj[i] !== obj1[i]) {
        return false
      }
    }
  }
  return true
}

function compareArrays(obj, obj1) {
  if (!isArray(obj1)) return false
  if (obj.length !== obj1.length) return false
  var equal = compare(obj, obj1)
  return equal
}

function compareObjects(obj, obj1) {
  if (!isObject(obj1)) return false
  for (let key in obj1) {
    if (obj[key] === undefined) {
      return false
    }
  }
  var equal = compare(obj, obj1)
  return equal
}

function compareDates(obj, obj1) {
  if (!isDate(obj1) || obj.getTime() !== obj1.getTime()) {
    return false
  }
  return true
}

function isArray(obj) {
  return Array.isArray(obj)
}

function isObject(obj) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray(obj) == false &&
    !(obj instanceof Date)
  )
}

function isDate(obj) {
  return obj instanceof Date
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
