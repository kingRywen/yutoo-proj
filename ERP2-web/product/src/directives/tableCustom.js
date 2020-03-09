import Vue from "vue"
Vue.directive('demo', {
  // eslint-disable-next-line no-unused-vars
  inserted(el, binding, vnode) {
    let {
      width = '400px',
        fields
    } = binding.value
    setTimeout(() => {
      if (el.offsetHeight > 40) {
        el.style.height = '33px'
        el.style.width = width + 'px'
        el.style.overflow = 'hidden'
        let arrElement = el.getElementsByClassName('costom-item'),
          len = arrElement.length,
          wrap_width = 0,
          index = 0
        for (let i = 0; i < len; i++) {
          wrap_width += arrElement[i].offsetWidth
          if (wrap_width > 400) {
            index = i
            break
          }
        }

        Vue.set(binding.value.row, `hideList${fields}`, binding.value.row[fields].slice(index))
        Vue.set(binding.value.row, `hide${fields}`, true)
      } else {
        Vue.set(binding.value.row, `hide${fields}`, false)
      }
    }, 0);
  }
})