let index = 1

function Form(rootDom, rules) {
  window.__myForm = window.__myForm || {}
  window.__myForm[index++] = this
  this.value = {}
  // 子元素输入框
  this.rules = rules
  // 根元素
  this.parentDom = rootDom
  // 子元素
  this.formItems = {}
  this.validSuccess = false
  this.init()
}
Form.prototype.init = function() {
  let formItemDoms = this.parentDom.querySelectorAll('.input_wrapper [name]')
  ;[].forEach.call(formItemDoms, el => {
    this.value[el.getAttribute('name')] = el.value
    let isRequired =
      el.getAttribute('required') !== false &&
      el.getAttribute('required') != null
    let handleMap = {
      select: 'change',
      input: 'input'
    }

    let obj = {
      el,
      // errEl,
      isRequired,
      errMsg: el.getAttribute('errmsg'),
      validSuccess: !isRequired,
      validate: validateInput
    }
    this.formItems[el.getAttribute('name')] = obj

    el.addEventListener(handleMap[el.nodeName.toLowerCase()], e => {
      // console.log(22);

      if (isRequired) {
        obj.validSuccess = validateInput(el, el.getAttribute('type'))
        this.checkValid()
      }
      this.value[el.getAttribute('name')] = e.target.value
    })
  })
}

Form.prototype.checkValid = function() {
  this.validSuccess = Object.values(this.formItems).every(
    el => !!el.validSuccess
  )
  return this.validSuccess
}

Form.prototype.validate = function() {
  // debugger
  Object.values(this.formItems).forEach(item => {
    let { el } = item
    if (item.isRequired) {
      item.validSuccess = item.validate(el, el.getAttribute('type'))
    }
  })

  return this.checkValid()
}

function validateInput(el, type) {
  let errEl = el.nextElementSibling,
    flag = false
  if (!errEl) {
    errEl = document.createElement('div')
    errEl.className = 'hidden act_error error_msg'
    el.parentNode.appendChild(errEl)
  }
  if (!el.value) {
    errEl.classList.remove('hidden')
    errEl.innerHTML = el.getAttribute('errmsg') || '请输入用户名'
    return flag
  } else if (type) {
    switch (type) {
      case 'email':
        if (!/\w[-\w.+]*@([A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(el.value)) {
          if (errEl.innerHTML === '邮箱格式输入有误') {
            return flag
          }
          errEl.innerHTML = '邮箱格式输入有误'
          errEl.classList.remove('hidden')
        } else {
          errEl.innerHTML = ''
          errEl.classList.add('hidden')
          flag = true
        }
        break

      default:
        break
    }
  } else {
    errEl.innerHTML = ''
    errEl.classList.add('hidden')
    flag = true
  }
  if (!flag) {
    el.focus()
  }
  return flag
}

export default Form
