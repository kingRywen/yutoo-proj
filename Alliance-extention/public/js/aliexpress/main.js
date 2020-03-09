//
/**
 * 获取字符的keycode值
 * @param {any} character 字符
 */
function getKeycode(character) {
  return character.charCodeAt(0)
}
let time = 0
// 选择框下拉滚动速度
const SELECT_SCROLL_RATE = 2

/* eslint-disable no-console */
function $$(str) {
  return document.querySelectorAll(str)[0]
}

/**
 * 赋值并手动触发change事件
 * @param {HTMLDom} element 需要触发的dom元素
 * @param {any} value       赋给dom元素的值
 */
function inputVal(element, value) {
  document.body.focus()
  element.focus()
  setTimeout(() => {
    element.value = value
    if ('createEvent' in document) {
      var evt = document.createEvent('HTMLEvents')
      evt.initEvent('change', false, true)
      element.dispatchEvent(evt)
    } else {
      element.fireEvent('onchange')
    }
  })
}

/**
 * 设置输入控件输入值
 * @param {HTMLDocument} el 要设置值的Dom对象
 * @param {String} value 要设置的值
 * @param {String} type 设置的Dom的类型  select 按钮  空 普通输入框
 * @param {HTMLDocument} scrollEl 要滚动的Dom对象
 * @param {HTMLDocument} selectEl 要选择的Dom对象
 */
function fireEvent(el, value, type, scrollEl, selectEl) {
  if (el.value == value) {
    return
  }
  el.click()

  if (value == null) {
    return
  }
  if (type == 'select') {
    // 选择控件，需要把控件打开，并找到值选中，然后关闭
    let scrollTop = scrollEl.scrollTop
    for (let index = 1; index < 50; index++) {
      setTimeout(() => {
        if (scrollEl.scrollTop != 0) {
          scrollTop = scrollTop - index * SELECT_SCROLL_RATE
        } else {
          scrollTop = scrollTop + index * SELECT_SCROLL_RATE
        }
        scrollEl.scrollTop = scrollTop
      }, (time += 22))
    }

    setTimeout(() => {
      selectEl.click()
      // debugger
    }, (time += +(Math.random() * 600).toFixed(2)))
  } else {
    el.value = ''
    if (Number.isFinite(value)) {
      value = value + ''
    }
    value = value.split('')

    value.map(str => {
      time += +(Math.random() * 600).toFixed(2)
      //
      setTimeout(() => {
        fireEventCode(el, str)
      }, time)
    })
    time += Math.random() * 5 * 1000
  }

  // sleep(Math.random() * 2)
}

/**
 * 赋值并手动触发change事件
 * @param {HTMLDom} element 需要触发的dom元素
 * @param {any} value       赋给dom元素的值
 */
function fireEventCode(el, value, evtType = 'keydown') {
  //
  let handleEvent = function(event) {
    //
    inputVal(el, el.value + value)
    if (event.defaultPrevented) {
      return
    }
    el.removeEventListener('keydown', handleEvent, true)
    var handled = false

    if (handled) {
      // Suppress "double action" if event handled
      event.preventDefault()
    }
  }
  // evtType = 'keydown'
  el.addEventListener('keydown', handleEvent, true)

  let keyCode = getKeycode(value)
  var doc = el.ownerDocument,
    win = doc.defaultView || doc.parentWindow,
    evtObj
  if (doc.createEvent) {
    if (win.KeyEvent) {
      evtObj = doc.createEvent('KeyEvents')
      evtObj.initKeyEvent(
        evtType,
        true,
        true,
        win,
        false,
        false,
        false,
        false,
        keyCode,
        0
      )
    } else {
      evtObj = doc.createEvent('UIEvents')
      Object.defineProperty(evtObj, 'keyCode', {
        get: function() {
          return this.keyCodeVal
        }
      })
      Object.defineProperty(evtObj, 'which', {
        get: function() {
          return this.keyCodeVal
        }
      })
      evtObj.initUIEvent(evtType, true, true, win, 1)
      evtObj.keyCodeVal = keyCode
      if (evtObj.keyCode !== keyCode) {
        console.log(
          'keyCode ' + evtObj.keyCode + ' 和 (' + evtObj.which + ') 不匹配'
        )
      }
    }
    el.dispatchEvent(evtObj)
  } else if (doc.createEventObject) {
    evtObj = doc.createEventObject()
    evtObj.keyCode = keyCode
    el.fireEvent('on' + evtType, evtObj)
  }
}

let currentAction

function login(e) {
  // if (e.origin.indexOf(e.data.platformCode + '.com') === -1) {
  //   alert(`请打开 ${e.data.platformCode}.com`)
  //   return
  // }
  if (!$$('#alibaba-login-box')) {
    // 如果登录框不存在 就打开
    let showLoginBtn = $$('a[data-role=sign-link]')
    showLoginBtn.click()
    // alert('已打开登录框，请再次点击"执行"按钮')
    currentAction = e
  }
  //
}

function search(e) {
  // console.log(22)

  let keywordInput = $$('input[name=SearchText]')
  fireEvent(keywordInput, e.data.value)
}

window.addEventListener('message', function(e) {
  if (typeof e.data === 'string') {
    e.data = decodeURIComponent(e.data)
  }

  if (e.data.cmd === 'login_account') {
    // 账户登陆
    login(e)
  }
  if (e.data.cmd === 'search' || e.data.cmd === 'second_search') {
    // 搜索
    search(e)
  }
})
