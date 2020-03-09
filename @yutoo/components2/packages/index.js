const install = function (Vue) {
  // Vue.use(Clipboard)
  // 遍历注册全局组件
  // components.map(component => Vue.component(component.name, component))
  // 遍历注入组件
  const requireComponent = require.context(
    // 查找文件夹路径
    '.',
    // 查找子文件夹
    true,
    // 所有index.js文件(除了这个文件)
    /[^.]\/index\.js$/
  )
  requireComponent.keys().forEach(filename => {
    const component = requireComponent(filename)
    Vue.use(component.default || component)
  })
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install
}