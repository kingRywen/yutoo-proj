/* eslint-disable no-undef */
let time = 0
// 选择框下拉滚动速度
const SELECT_SCROLL_RATE = 2

/* eslint-disable no-console */
function $$(str) {
  return document.querySelectorAll(str)[0]
}

/**
 * 控制延时时间
 * @param {number} time 延时时间 秒为单位
 */
function sleep(time) {
  let startTime = Date.now()
  while (startTime + time * 1000 > Date.now()) {}
}

/**
 * 赋值并手动触发change事件
 * @param {HTMLDom} element 需要触发的dom元素
 * @param {any} value       赋给dom元素的值
 */
function inputVal(element, value) {
  element.focus()
  element.value = value
  if ('createEvent' in document) {
    var evt = document.createEvent('HTMLEvents')
    evt.initEvent('change', false, true)
    element.dispatchEvent(evt)
  } else {
    element.fireEvent('onchange')
  }
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

  let keyCode = this.getKeycode(value)
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

/**
 * 获取字符的keycode值
 * @param {any} character 字符
 */
function getKeycode(character) {
  return character.charCodeAt(0)
}

/**
 * 模拟键盘输入
 * @param {Number} keyCode 字符的keyCode值
 */
function simulateKeyPress(el, keyCode) {
  el.focus()
  setTimeout(() => {
    var ev = document.createEvent('KeyboardEvent')
    ev.initKeyboardEvent(
      'keydown',
      true,
      true,
      window,
      false,
      false,
      false,
      false,
      65,
      0
    )
    document.body.dispatchEvent(ev)
  }, 200)

  // const ke = new KeyboardEvent("keyup", {
  //   bubbles: true, cancelable: true, keyCode, key: 'q', char: 'q'
  // });
  //
  // el.dispatchEvent(ke);
}

/**
 * 将字符串转成keycode数组
 * @param {string} str 需要转换的字符串
 * @returns {Array}
 */
function charToCode(str) {
  return str.split('').map(el => getKeycode(el))
}

/**
 * 模拟字符串输入
 * @param {HTMLDom} el   需要输入的dom元素
 * @param {string} str    需要模拟输入的字符串
 * @param {number} time   输入间隔时间
 */
// eslint-disable-next-line no-unused-vars
function simulateInput(el, str, time = 30) {
  // debugger
  el.focus()
  setTimeout(() => {
    let codes = charToCode(str)
    codes.forEach((code, index) => {
      setTimeout(() => {
        simulateKeyPress(el, code)
      }, (index + 1) * time)
    })
  }, 2000)
}

// outlook邮箱登录
function outlookLogin({ data }) {
  // 获取邮箱输入框
  let emailInput = document.querySelectorAll('input[type=email]')[0]

  // emailInput.value = data.value.email
  if (data.type == 0) {
    // 账号
    fireEvent(emailInput, data.value.email)
  } else {
    // 密码
    let pwdInput = document.querySelectorAll('input[name=passwd]')[0]
    if (pwdInput) {
      fireEvent(pwdInput, data.value.emailPassword)
    }
  }
}

// 新浪邮箱登录
function sinaLogin({ data }) {
  // 账号输入框
  let userInput = $$('input.username')
  // 密码输入框
  let passInput = $$('input.password')
  // 登录按钮
  // let loginBtn = $$('.loginBtn')
  if (!userInput || !passInput) {
    return
  }

  if (data.type == 0) {
    fireEvent(userInput, data.value.email)
  } else {
    fireEvent(passInput, data.value.emailPassword)
  }
}

// 亚马逊搜索
function amazonSearch(e) {
  //
  let keywordInput = $$('input[name=field-keywords]')
  // let submitBtn = $$('input[type=submit]')
  // keywordInput.value = e.data.value
  fireEvent(keywordInput, e.data.value)
  // submitBtn.click()
}

// ebay搜索
function ebaySearch(e) {
  let keywordInput = $$('input[name=_nkw]')
  // let submitBtn = $$('input[type=submit]')
  fireEvent(keywordInput, e.data.value)
  // submitBtn.click()
}

// // aliexpress搜索
// function aliexpressSearch(e) {
//   let keywordInput = $$('input[name=SearchText]')
//   // let submitBtn = $$('input[type=submit]')
//   fireEvent(keywordInput, e.data.value)
//   // submitBtn.click()
// }

// 邮箱登录策略
let EMAIL_LOGIN = {
  outlookLogin,
  sinaLogin
}

// 搜索策略
let SEARCH_STRAG = {
  amazonSearch,
  ebaySearch
  // aliexpressSearch
}

// 搜索 data.platformCode 区分平台
function search(e) {
  let { data, origin } = e
  if (origin.indexOf(data.platformCode) == -1) {
    alert(`请打开 ${data.platformCode}.com`)
    return
  }
  let platforms = [
    {
      name: 'amazon',
      cmd: 'amazonSearch'
    },
    // {
    //   name: 'aliexpress',
    //   cmd: 'aliexpressSearch'
    // },
    {
      name: 'ebay',
      cmd: 'ebaySearch'
    }
  ]
  let current = platforms.find(el => el.name === data.platformCode)
  if (!current) {
    alert('平台不存在')
    return
  }

  SEARCH_STRAG[current.cmd](e)
}

function emailLog(e) {
  // 当前标签页的域名
  let origin = e.origin
  // 要登录的邮箱账号
  let email = e.data.value.email
  let emlExt = email.split('@')[1].toLowerCase()
  let emailType = [
    // outlook
    {
      host: 'login.live.com',
      ext: ['outlook.com', 'live.com', 'hotmail.com'],
      cmd: 'outlookLogin'
    },
    {
      host: 'mail.sina.com.cn',
      ext: ['sina.com'],
      cmd: 'sinaLogin'
    }
  ]
  let current = emailType.find(el => el.ext.indexOf(emlExt) > -1)
  if (!current) {
    alert(`请打开 ${emlExt}`)
    return
  }
  console.log(origin)

  if (origin.indexOf(current.host) === -1) {
    alert(`请打开 ${current.host}`)
    return
  }

  EMAIL_LOGIN[current.cmd](e)
}

// 登陆账号
function loginAccount(e) {
  if (e.origin.indexOf(e.data.platformCode + '.com') === -1) {
    alert(`请打开 ${e.data.platformCode}.com`)
    return
  }
  let { user, pwd } = e.data.value
  let type = e.data.type // type : act | pwd

  if (e.data.platformCode == 'amazon') {
    let acInput = $$('.a-section input[type=email]')
    let pwdInput = $$('.a-section input[type=password]')
    // let submit = $$('.a-section input[type=submit]')
    // let switchBtn = $$('#ap_switch_account_link')
    // 亚马逊登陆
    if ($$('.a-section input[type=email]')) {
      if (type == 'act') {
        fireEvent(acInput, e.data.value.user)
      } else {
        fireEvent(pwdInput, e.data.value.pwd)
      }
      // submit.click()
    } else {
      // 没有邮箱输入框，代表只用输入密码,此时需要判断账户是否是需要登陆的账户,如果是，只需输入密码，如果不是需要点切换账户
      let accountDiv = $$('.auth-text-truncate.a-size-base')
      if (
        accountDiv &&
        accountDiv.innerText &&
        accountDiv.innerText === e.data.value.user
      ) {
        if (type == 'act') {
          fireEvent(acInput, e.data.value.user)
        } else {
          fireEvent(pwdInput, e.data.value.pwd)
        }
        // submit.click()
      } else {
        // 点击切换按钮
        // switchBtn.click()
        if (type == 'act') {
          fireEvent(acInput, e.data.value.user)
        } else {
          fireEvent(pwdInput, e.data.value.pwd)
        }
      }
    }
  } else if (e.data.platformCode == 'ebay') {
    let wrapper = $$('.signin-view-container')
    if (wrapper) {
      if (type === 'act') {
        fireEvent($$('.signin-view-container input[name=userid]'), user)
      } else {
        fireEvent($$('.signin-view-container input[name=pass]'), pwd)
      }
      // $$('button[type=submit]').click()
    }
  } else if (e.data.platformCode == 'aliexpress') {
    // 登录按钮
    if (type === 'act') {
      localStorage.setItem('user', user)
    } else {
      localStorage.setItem('pwd', pwd)
    }
    if (location.host == 'www.aliexpress.com') {
      let loginBtn = $$('a[data-role=sign-link]'),
        loginWrapper = $$('.pc-dialog')
      if (loginBtn && !loginWrapper) {
        loginBtn.click()
      }
    }

    // if (type === 'act') {

    // } else {

    // }
  }
}

// // 速卖通自动填
// if (location.host == 'passport.aliexpress.com') {
//   fireEvent($$('#login input[type=text]'), localStorage.getItem('pwd'))
//   fireEvent($$('#login input[type=password]'), localStorage.getItem('user'))
// }

// 收货人信息填写
function consigneeInput(e) {
  let {
    consigneeAddressCountry,
    consigneePhone,
    consigneeName,
    consigneeAddressStateFullName,
    consigneeAddressCityFullName,
    consigneeAddressState,
    consigneeAddressCity,
    consigneeAddressStreet,
    consigneeAddressOther,
    consigneeZipcode
  } = e.data.value
  // 判断平台
  // if (e.origin.indexOf(e.data.platformCode + '.com') === -1) {
  //   alert(`请打开 ${e.data.platformCode}.com`)
  //   return
  // }

  // 亚马逊填写地址信息
  if (e.data.platformCode == 'amazon') {
    // 适配页面
    // let pathname = location.pathname
    // if (pathname === '/gp/buy/addressselect/handlers/display.html') {
    //   // 一键下单里的添加地址页面
    //   $$('.enter-address-form input[name=enterAddressFullName]').value =
    //   // 全名
    //   $$('input[name=enterAddressFullName]').value = consigneeName
    //   // 电话
    //   $$('input[name*=enterAddressPhoneNumber]').value = consigneePhone
    //   // 州
    //   $$('input[name=address-ui-widgets-enterAddressStateOrRegion]').value = consigneeAddressState
    //   // 城市
    //   $$('input[name=address-ui-widgets-enterAddressCity]').value = consigneeAddressCity
    //   // 街道地址
    //   $$('input[name=address-ui-widgets-enterAddressLine1]').value = consigneeAddressStreet
    //   // 地址第二行
    //   $$('input[name=address-ui-widgets-enterAddressLine2]').value = consigneeAddressOther
    //   // 邮编
    //   $$('input[name=address-ui-widgets-enterAddressPostalCode]').value = consigneeZipcode

    //   $$('#address-ui-widgets-enterAddressFormContainer input[type=submit]').click()
    // } else {

    // }

    // 个人信息中添加地址的页面
    let countryWrapper = $$('#address-ui-widgets-countryCode')
    if (!countryWrapper) {
      // 如果不存在这个元素，说明是一键下单页
      let trueSelectDom = document.getElementById('enterAddressCountryCode')
      // 国家选项dom
      let countryOptionsDom = [].slice.call(
        trueSelectDom.querySelectorAll('option')
      )
      // 国家选项值
      let countryOptions = countryOptionsDom.map(dom => {
        return {
          label: dom.innerText,
          value: dom.value
        }
      })
      // 需要选中的值
      let current = countryOptions.find(
        el =>
          el.label.toLowerCase() === consigneeAddressCountry.toLowerCase() ||
          el.value.toLowerCase() === consigneeAddressCountry.toLowerCase()
      )
      if (!current) {
        alert('国家信息有误，请手动选择国家！')
      } else {
        // 设置国家真实值
        let selectCtry = countryOptionsDom.find(
          el => el.innerText === current.label
        )
        selectCtry.selected = true
      }
    } else {
      // 国家输入显示用的div
      let countryInput = countryWrapper.querySelectorAll(
        '.a-dropdown-prompt'
      )[0]
      // 国家输入真实的dom
      let trueSelectDom = document.getElementById(
        'address-ui-widgets-countryCode-dropdown-nativeId'
      )
      // 国家选项dom
      let countryOptionsDom = [].slice.call(
        trueSelectDom.querySelectorAll('option')
      )
      // 国家选项值
      let countryOptions = countryOptionsDom.map(dom => {
        return {
          label: dom.innerText,
          value: dom.value
        }
      })
      // 需要选中的值 consigneeAddressCountry
      let current = countryOptions.find(
        el =>
          el.label.toLowerCase() === consigneeAddressCountry.toLowerCase() ||
          el.value.toLowerCase() === consigneeAddressCountry.toLowerCase()
      )
      if (!current) {
        alert('国家信息有误，请手动选择国家！')
        return
      } else {
        // 获取点击按钮
        let clickBtn = $$('.a-button-text.a-declarative')
        clickBtn.click()
        setTimeout(() => {
          let scrollEl = $$('.a-popover.a-declarative')
          let li = scrollEl.querySelectorAll('li a')
          scrollEl = scrollEl.querySelectorAll('.a-popover-inner')[0]
          let selectEl
          ;[].slice.call(li).forEach(el => {
            if (el.innerText.toLowerCase() === current.label.toLowerCase()) {
              selectEl = el
            }
          })

          fireEvent(clickBtn, current, 'select', scrollEl, selectEl)
        }, 2000)

        // // 设置国家显示值
        // countryInput.innerText = current.label
        // // 设置国家真实值
        // let selectCtry = countryOptionsDom.find(el => el.innerText === current.label)
        // selectCtry.selected = true
      }
    }

    setTimeout(() => {
      // end 国家
      // sleep(1)

      // 全名
      fireEvent($$('input[name*=enterAddressFullName]'), consigneeName)
      // sleep(1)
      // 街道地址
      let adds1Dom =
        $$('input[name*=enterAddressLine1]') ||
        $$('input[name=enterAddressAddressLine1]')
      fireEvent(adds1Dom, consigneeAddressStreet)
      // sleep(1.5)
      // 地址第二行
      let adds2Dom =
        $$('input[name*=enterAddressLine2]') ||
        $$('input[name=enterAddressAddressLine2]')
      fireEvent(adds2Dom, consigneeAddressOther)
      // sleep(1.9)
      // 城市
      fireEvent($$('input[name*=enterAddressCity]'), consigneeAddressCity)
      // sleep(2)
      // 州
      fireEvent(
        $$('input[name*=enterAddressStateOrRegion]'),
        consigneeAddressState
      )
      // sleep(0.5)
      // 邮编
      fireEvent($$('input[name*=enterAddressPostalCode]'), consigneeZipcode)
      // sleep(0.25)

      // 电话
      fireEvent($$('input[name*=enterAddressPhoneNumber]'), consigneePhone)
    }, 5000)

    // sleep(0.2)

    // let submitBtn = $$('#address-ui-widgets-enterAddressFormContainer input[type=submit]') || $$('input[name=shipToThisAddress]')
    // submitBtn.click()

    // 全名
    // $$('input[name=address-ui-widgets-enterAddressFullName]').value = 'consigneeName'
    // // 电话
    // $$('input[name=address-ui-widgets-enterAddressPhoneNumber]').value = '1352665'
    // // 州
    // $$('input[name=address-ui-widgets-enterAddressStateOrRegion]').value = 'consigneeAddressState'
    // // 城市
    // $$('input[name=address-ui-widgets-enterAddressCity]').value = 'consigneeAddressCity'
    // // 街道地址
    // $$('input[name=address-ui-widgets-enterAddressLine1]').value = 'consigneeAddressStreet'
  } else if (e.data.platformCode == 'ebay') {
    // ebay 填写地址
    // consigneeAddressCountry
    // 首先填写国家
    let ctryEl =
      $$('select[name=country-field]') || $$('select[name=af-country]')
    let options = [].slice.call(ctryEl.querySelectorAll('option'))
    let cur
    options.map(el => {
      // 匹配全称，后续如果匹配简称再改 Taiwan United States
      if (
        el.innerText === consigneeAddressCountry ||
        el.value === consigneeAddressCountry
      ) {
        el.selected = true
        cur = el.value
      }
    })
    // fireEvent(ctryEl, cur)
    ctryEl.value = cur
    sleep(1)
    setTimeout(() => {
      if ($$('select[name=country-field]')) {
        monitorElement('.spinner', false, () => {
          fireEvent($$('input[name=name-field]'), consigneeName)
          sleep(0.2)
          fireEvent(
            $$('input[name=addressLine1-field]'),
            consigneeAddressStreet
          )
          sleep(1.2)
          fireEvent($$('input[name=addressLine2-field]'), consigneeAddressOther)
          sleep(1.1)
          fireEvent($$('input[name=city-field]'), consigneeAddressCity)
          sleep(0.8)
          // 州填写有两种，一种是直接输入， 一种是选择
          let stateEl = $$('input[name=stateDD]')
          if (stateEl) {
            // 输入
            fireEvent(stateEl, consigneeAddressState)
          } else {
            // 选择
            stateEl = $$('select[name=stateDD]')
            ;[].slice.call(stateEl.querySelectorAll('option')).map(dom => {
              if (dom.innerText === consigneeAddressState) {
                dom.selected = true
                cur = dom.value
              }
            })
            stateEl.value = cur
          }
          stateEl.value = consigneeAddressState
          sleep(0.9)
          fireEvent($$('input[name=zipCode-field]'), consigneeZipcode)
          setTimeout(() => {
            fireEvent($$('input[name=phoneFlagComp1]'), consigneePhone)
          }, 800)
        })
      } else {
        // FIXME: 有个页面还未完成
        monitorElement('.spinner', false, () => {})
      }
    })
  } else if (e.data.platformCode == 'aliexpress') {
    // 速卖通填写地址
    // 国家
    // $$('select[name="country"]').focus()
    // let options = document.querySelectorAll('select[name=country] option')
    // options[11].selected = 'selected'
    // document.querySelectorAll('select[name=country]')[0].click()

    $('select[name=country]').val(consigneeAddressCountry.toUpperCase())
    // 全名
    fireEvent($$('input[name=contactPerson]'), consigneeName)
    // 电话
    fireEvent($$('input[name=mobileNo]'), consigneePhone)
    fireEvent($$('input[name=address]'), consigneeAddressStreet)
    fireEvent($$('input[name=address2]'), consigneeAddressOther)

    fireEvent($$('input[name=zip]'), consigneeZipcode)

    $('select[name=province]').val(consigneeAddressState)
    $('.sa-province-wrapper select').val(consigneeAddressStateFullName)

    setTimeout(() => {
      fireEvent($$('input[name=city]'), consigneeAddressCity)
      $('.sa-city-wrapper select').val(consigneeAddressCityFullName)
    }, 1000)
  }
}

// 监听某个元素出现或消失
function monitorElement(elStr, show, cb) {
  monitorElement.timer = setTimeout(() => {
    let flag = show
      ? document.querySelectorAll(elStr).length > 0
      : document.querySelectorAll(elStr).length == 0
    clearTimeout(monitorElement.timer)
    if (flag) {
      cb()
    } else {
      monitorElement(elStr, show, cb)
    }
  }, 30)
}

// 信息卡信息填写
function creditInput(e) {
  let { cardNum, cardHolder, cardValidDate, cardSecurityCode } = e.data.value
  let [y, m] = cardValidDate.split('-')
  // 判断平台
  if (e.origin.indexOf(e.data.platformCode + '.com') === -1) {
    alert(`请打开 ${e.data.platformCode}.com`)
    return
  }

  // 亚马逊
  if (e.data.platformCode == 'amazon') {
    // 获取信用卡填写的div
    let wrapper =
      document.querySelectorAll('.a-expander-inline-content')[1] ||
      document.querySelectorAll('#new-cc')[0]
    // 获取信用卡年月晶

    if (wrapper) {
      wrapper.style.display = 'block'
      // 签名
      let holderEl =
        wrapper.querySelectorAll('input[name=ppw-accountHolderName]')[0] ||
        wrapper.querySelectorAll('input[name=name]')[0]
      fireEvent(holderEl, cardHolder)
      sleep(1)
      // 卡号
      fireEvent(
        wrapper.querySelectorAll('input[name=addCreditCardNumber]')[0],
        cardNum
      )
      // 月
      // ppw-expirationDate_month
      // 真实select
      sleep(1)
      let domM =
        $$('select[name=ppw-expirationDate_month]') || $$('select[name=month]')
      let mTrueSelectDom = [].slice.call(domM.querySelectorAll('option'))
      let curMText
      mTrueSelectDom.forEach(dom => {
        if (dom.innerText === m) {
          curMText = dom.innerText
          dom.selected = true
        }
      })
      let pmtsExpiryMonth = $$('.pmts-expiry-month span.a-dropdown-prompt')

      if (!pmtsExpiryMonth) {
        wrapper.querySelectorAll(
          'span.a-dropdown-prompt'
        )[0].innerText = curMText
      } else {
        pmtsExpiryMonth.innerText = curMText
      }
      // 年
      // 真实select
      let domY =
        $$('select[name=ppw-expirationDate_year]') || $$('select[name=year]')
      let yTrueSelectDom = [].slice.call(domY.querySelectorAll('option'))
      let curYText
      yTrueSelectDom.forEach(dom => {
        if (dom.innerText === y) {
          curYText = dom.innerText
          dom.selected = true
        }
      })

      let pmtsExpiryYear = $$('.pmts-expiry-year span.a-dropdown-prompt')
      if (!pmtsExpiryYear) {
        wrapper.querySelectorAll(
          'span.a-dropdown-prompt'
        )[1].innerText = curYText
      } else {
        pmtsExpiryYear.innerText = curYText
      }
      // $$('.pmts-expiry-year span.a-dropdown-prompt').innerText = curYText

      // 点击按钮增加
      // let submitBtn = wrapper.querySelectorAll('.pmts-button-input')[0] || wrapper.querySelectorAll('input[type=submit]')[0]
      // submitBtn.click()
    }
  } else if (e.data.platformCode == 'ebay') {
    $$('body.myppc .hide').style.display = 'block'
    // ebay
    sleep(1)
    fireEvent($$('input[name=cardNumber]'), cardNum)
    sleep(0.5)
    fireEvent($$('input[name=cardExp]'), `${m} / ${y.substring(2)}`)
    sleep(1.2)
    fireEvent($$('input[name=securityCode]'), cardSecurityCode)
    sleep(1)

    let names = cardHolder.split(' ')
    names = [names[0], names.slice(1).join(' ')]
    fireEvent($$('input[name=cardHolderFirstName]'), names[0])
    sleep(1.4)
    fireEvent($$('input[name=cardHolderLastName]'), names[1])
  }
}

// 监听content.js中派发的事件
window.addEventListener(
  'message',
  function(e) {
    time = 0
    //
    // if (e.origin !== "http://example.com:8080") {
    //   return
    // }
    if (e.data.cmd === 'login_eml') {
      // 登录邮箱
      emailLog(e)
    }

    if (e.data.cmd === 'search' || e.data.cmd === 'second_search') {
      // 搜索
      search(e)
    }

    if (e.data.cmd === 'login_account') {
      // 账户登陆
      loginAccount(e)
    }

    if (e.data.cmd === 'consignee_input') {
      // 收货人地址
      consigneeInput(e)
    }

    if (e.data.cmd === 'credit_input') {
      // 信用卡信息
      creditInput(e)
    }

    if (e.data.cmd === 'test_move') {
      // let el = document.querySelectorAll('#input1')[0]
      // let new_el = el.cloneNode(true)
      // new_el.autofocus = true
      // el.parentNode.insertBefore(new_el, el)
      // el.parentNode.removeChild(el)
      // // el.addEventListener('focus', () => {
      // //   el.focus()
      // // })
      // el.autofocus = true
      fireEvent(
        document.querySelectorAll('#input1')[0],
        'data.value.emailPassword'
      )
      fireEvent(
        document.querySelectorAll('#input2')[0],
        'data.value.emailPassword'
      )
    }
  },
  false
)

if (location.pathname === '/reg/ChangeSecretQuestion') {
  // 遇到ebay的问题页，直接跳过
  // document.getElementById('rmdLtr').click()
}
