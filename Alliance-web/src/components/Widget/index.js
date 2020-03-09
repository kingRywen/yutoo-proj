
import camelCase from 'lodash/camelCase';

// 遍历注入组件
const requireComponent = require.context(
  // 查找文件夹路径
  '.',
  // 查找子文件夹
  true,
  // 所有index.js文件(除了这个文件)
  /^.*\.vue/
)

export default {
  install(Vue) {
    requireComponent.keys().forEach(filename => {
      let component = requireComponent(filename)
      component = component.default || component
      Vue.component('W' + camelCase('idget-' + component.name), component)
    })
  }
};

