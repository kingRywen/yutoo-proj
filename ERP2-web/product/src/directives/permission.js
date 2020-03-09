export default {
  /* eslint-disable */
  inserted(el, binding, vnode) {
    if (!vnode.context.$route) {
      return
    }
    let perms = vnode.context.$route && vnode.context.$route.meta && vnode.context.$route.meta.perms || []

    if (perms.indexOf(binding.value) === -1) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}