/* eslint-disable no-undef */
// 向页面注入JS
function injectCustomJs(jsPath) {
  //   debugger
  jsPath = jsPath || 'js/inject.js'
  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.src = chrome.extension.getURL(jsPath)
  temp.onload = function() {
    this.parentNode.removeChild(this)
  }
  document.head.appendChild(temp)
}

document.addEventListener('DOMContentLoaded', function() {
  // 注入jq
  injectCustomJs('js/jquery-3.4.1.min.js')

  let excludes = ['is.alicdn.com', 'g.alicdn.com']
  let includes = [
    'login.live.com',
    'mail.sina.com.cn',
    'amazon.com',
    'ebay.com'
  ]
  if (location.host === 'www.aliexpress.com') {
    //
    // injectCustomJs()
    injectCustomJs('js/aliexpress/main.js')
  } else if (location.host === 'passport.aliexpress.com') {
    //
    injectCustomJs('js/aliexpress/passport.js')
  } else if (includes.indexOf(location.host) > -1) {
    //
    injectCustomJs()
  }
})

// 监听popup.js的事件
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  window.postMessage(request, '*')
  sendResponse('我收到了你的消息！')
})
