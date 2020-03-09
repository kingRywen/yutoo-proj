import camelCase from 'lodash/camelCase';

const moduleCache = {}

const storeData = {
  modules: {}
};

(function updateModule() {
  // 动态导入所有store模块
  const requireModules = require.context('.', true, /^((?!index).)*\.js/)

  requireModules.keys().forEach(name => {
    const _module = requireModules(name)
    if (moduleCache[name] === _module) {
      return
    }
    moduleCache[name] === _module
    let paths = name.match(/\.\/(.*).js/)[1].split(/\//).map(camelCase)
    const { modules } = getNamespace(storeData, paths)
    modules[paths.pop()] = { namespaced: true, ..._module }
  })
  if (module.hot) {
    // console.log(require('../index.js').default);
    // 热更新vuex store
    module.hot.accept(requireModules.id, () => {
      updateModule()
      
      
      require('../index').default.hotUpdate({ modules: storeData.modules })
    })
  }
})();

function getNamespace(subtree, path) {
  if (path.length === 1) return subtree

  const namespace = path.shift()
  subtree.modules[namespace] = {
    modules: {},
    namespaced: true,
    ...subtree.modules[namespace],
  }
  return getNamespace(subtree.modules[namespace], namespace)
}




export default storeData.modules