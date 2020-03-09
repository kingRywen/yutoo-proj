import Vue from 'vue'
import SyncCascader from './SimpleForm/src/SyncCascader';
import MainLayout from '../layouts/MainLayout';

Vue.component(MainLayout.name, MainLayout);
Vue.component(SyncCascader.name, SyncCascader);

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
