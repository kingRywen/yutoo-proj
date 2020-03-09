import download from './download';
/**
 * 获取数据的数据类型
 * @param {*} params  需要获取的数据
 * @return {string}   Number | String ...
 */
export function dataType(params) {
  if (params === null) {
    return 'Null';
  } else if (params === undefined) {
    return 'Undefined';
  } else {
    return Object.prototype.toString.call(params).slice(8, -1);
  }
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
export function downloadFile(url, txt = '下载-' + formatDate(new Date(), '{y}{m}{d}{h}{i}{s}'), _blank) {
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
      download(url, txt, "text/plain")
    }
  } else {
    // 二进制
    // 接口传入
    // config : {responseType: 'blob'}
    // console.log(url);
    let name = url.name
    url = window.URL.createObjectURL(new Blob([url]));
    link = document.createElement("a");
    document.body.appendChild(link)
    link.style.display = 'none'
    link.href = url;
    // console.log(txt);
    link.setAttribute("download", name || txt.replace('.xls', '') + '.xls' || `下载.xls`);
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