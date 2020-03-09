import Vue from "vue";

// 遍历注入组件
const requireComponent = require.context(
  // 查找文件夹路径
  ".",
  // 查找子文件夹
  true,
  // 所有index.js文件(除了这个文件)
  /[^.]\/index\.js$/
);
requireComponent.keys().forEach(filename => {
  const component = requireComponent(filename);
  if (
    (component && component.default && component.default.install) ||
    (component && component.install)
  ) {
    Vue.use(component.default || component);
  }
});
