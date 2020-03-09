import VueLazyload from 'vue-lazyload'
import Transition from './transition'
import Dialog from './dialog'
import Form from './form'
import Table from './table'
import YtTableSelect from './table/src/TableSelect'
import YtPage from './table/src/page'
import TreeSelect from './TreeSelect'
import MenuSelect from './MenuSelect'
import CustomExport from './CustomExport'
import UniversalLayout from './UniversalLayout'
import YtSearch from './search'
import LayoutTable from './shop/LayoutTable'

import '@/assets/styles/lazyloading.scss'

// function toCamelCase (str) {
//   str = str.replace(/(-)([\w\W])/g, function (p1, p2, p3) {
//     return p3.toUpperCase()
//   })
//   return str.charAt(0).toUpperCase() + str.substring(1)
// }

// 存储组件列表
const components = [
  Transition,
  YtSearch,
  UniversalLayout,
  MenuSelect,
  CustomExport,
  Form,
  YtTableSelect,
  YtPage,
  Table,
  TreeSelect,
  LayoutTable,
  Dialog
]

const install = function(Vue) {
  // 判断是否安装
  if (install.installed) return
  // 遍历注册全局组件
  components.map(component => {
    Vue.component(component.name, component)
    // Vue.component(toCamelCase(component.name), component)
  })
  Vue.use(VueLazyload, {
    preLoad: 1.3,
    attempt: 2
  })
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  Transition,
  MenuSelect,
  CustomExport,
  Form,
  Table,
  TreeSelect,
  Dialog
}
