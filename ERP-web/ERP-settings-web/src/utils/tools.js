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
export const smalltoBIG = (n) => {
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);

  var s = '';

  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);

  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}